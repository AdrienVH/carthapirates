const isProd = window.location.hostname == 'carthapirates.fr' ? true : false

const API_BASE_URL = isProd ? 'https://carthapirates.fr/api' : 'http://localhost:9001'

if (isProd) $('#ribbon').remove()

let focusBateau = false
let idBateau = null
const url = new URLSearchParams(window.location.search)
if (url.get('bateau') && !isNaN(parseInt(url.get('bateau')))) {
	focusBateau = true
	idBateau = parseInt(url.get('bateau'))
}

// MAP

const mapbox = new ol.layer.Tile({
	source: new ol.source.XYZ({
		tileSize: [256, 256],
		url: 'https://api.mapbox.com/styles/v1/adrienvh/cki3g3bme2w2w19qyrxm4wry5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRyaWVudmgiLCJhIjoiU2lDV0N5cyJ9.2pFJAwvwZ9eBKKPiOrNWEw'
	}),
	name: "mapbox"
});

/***** PORTS */

function getPortsStyle(f){
	return new ol.style.Style({
		image: new ol.style.RegularShape({
			fill: new ol.style.Fill({color: "#405a82"}),
			points: 4,
			radius: 12
		}),
		text: new ol.style.Text({
			offsetY: 1,
			text: f.getId().toString(),
			font: 'bold 12px sans-serif',
			fill: new ol.style.Fill({color: 'white'})
		})
	});
}

const portsSource = new ol.source.Vector({projection : 'EPSG:3857'});
const ports = new ol.layer.Vector({
	source: portsSource,
	style: getPortsStyle,
	name: "ports"
});

/***** BATEAUX */

function getBateauxStyle(f){
	return new ol.style.Style({
		image: new ol.style.Icon({
			src: f.getId() == 0 ? 'bateau.png' : 'bateau.png',
			opacity: focusBateau && f.getId() != idBateau ? 0.5 : 1
		}),
		text: new ol.style.Text({
			textAlign: 'left',
			offsetX: 20,
			offsetY: 6,
			text: focusBateau && f.getId() != idBateau ? "" : f.get("nom"),
			font: "bold 30px 'Ms Madi'",
			fill: new ol.style.Fill({ color: 'dimgrey' }),
			stroke: new ol.style.Stroke({ color: 'white', width: 3 }),
		})
	});
}

const bateauxSource = new ol.source.Vector({projection : 'EPSG:3857'});
const bateaux = new ol.layer.Vector({
	source: bateauxSource,
	style: getBateauxStyle,
	name: "bateaux"
});

/***** TRAJETS */

function getTrajetsStyle(f){
	let opacity = f.get('ordre') / f.get('ordreMax')
	const orange = `rgba(255, 165, 0, ${opacity})`
	const gris = '#aaaaaa'
	return new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: focusBateau && f.get('idBateau') != idBateau ? gris : orange,
			width: focusBateau && f.get('idBateau') != idBateau ? 1 : 3
		})
	});
}

const trajetsSource = new ol.source.Vector({projection : 'EPSG:3857'});
const trajets = new ol.layer.Vector({
	source: trajetsSource,
	style: getTrajetsStyle,
	name: "trajets"
});

/***** MAP */

const map = new ol.Map({
	layers: [mapbox, trajets, ports, bateaux],
	target: 'map',
	view: new ol.View({
		center: ol.proj.transform([6.0, 40.0], 'EPSG:4326', 'EPSG:3857'),
		minZoom: 5,
		maxZoom: 9
	}),
	controls : ol.control.defaults({
		attribution : false,
		zoom : false
	}).extend([])
})

map.on('singleclick', function (evt) {
	const xy = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326').map(c => c.toFixed(6)).join(",");
	$('#xy').html(xy);
	$('#xy').show();
	const elm = document.getElementById("xy");
	const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(elm);
    selection.removeAllRanges();
    selection.addRange(range);
	document.execCommand("Copy");
	selection.removeAllRanges();
	$('#xy').hide();
});

/************ GET PORTS */

function getPorts(){
	const request = $.ajax({ url: API_BASE_URL + "/ports", method: "GET" })
	request.done(function(records) {
		for(const port of records){
			addPortToMap(port)
		}
		map.getView().fit(portsSource.getExtent(), { padding: [100, 100, 100, 100] })
	})
	request.fail(function(jqXHR, textStatus) {
		console.log("FAIL", jqXHR, textStatus);
	})
}

function addPortToMap(record) {
	const feature = new ol.Feature({ });
	feature.setId(record.id)
	feature.set("nom", record.nom)
	feature.setGeometry(new ol.geom.Point(ol.proj.transform(record.geom.coordinates, 'EPSG:4326','EPSG:3857')))
	portsSource.addFeature(feature)
}

getPorts()

/************ GET BATEAUX */

function getBateaux(){
	const request = $.ajax({ url: API_BASE_URL + "/bateaux",method: "GET" })
	request.done(function(bateaux) {
		bateaux.forEach(bateau => addBateauToMap(bateau))
	})
	request.fail(function(jqXHR, textStatus) {
		console.log("FAIL", jqXHR, textStatus)
	})
}

function addBateauToMap(record) {
	const feature = new ol.Feature({ });
	feature.setId(record.id)
	feature.set("nom", record.nom)
	if (record.geom) {
		feature.setGeometry(new ol.geom.Point(ol.proj.transform(record.geom.coordinates, 'EPSG:4326','EPSG:3857')))
	}
	bateauxSource.addFeature(feature)
}

function moveBateau(bateau) {
	const feature = bateauxSource.getFeatureById(bateau.id)
	feature.setGeometry(new ol.geom.Point(ol.proj.transform(bateau.geom.coordinates, 'EPSG:4326','EPSG:3857')))
}

getBateaux()

/************ GET TRAJETS */

function getTrajets(){
	const request = $.ajax({ url: API_BASE_URL + "/trajets", method: "GET" })
	request.done(function(trajets) {
		const ordreMax = Math.max.apply(null, trajets.map(t => parseInt(t.ordre))) // FIX ME #18 : se passer du parseInt
		trajets.forEach(trajet => addTrajetToMap(trajet, ordreMax))
	})
	request.fail(function(jqXHR, textStatus) {
		console.log("FAIL", jqXHR, textStatus);
	})
}

function addTrajetToMap(trajet, ordreMax) {
	const feature = new ol.Feature({ });
	feature.set("idBateau", trajet.id_bateau)
	feature.set("ordre", parseInt(trajet.ordre)) // FIX ME #18 : se passer du parseInt
	feature.set("ordreMax", ordreMax)
	if (trajet.geom) {
		feature.setGeometry(new ol.format.GeoJSON().readGeometry(trajet.geom, { featureProjection: "EPSG:3857" }))
	}
	trajetsSource.addFeature(feature)
}

function retirerTrajets(idBateau) {
	trajetsSource.getFeatures().filter(f => f.get('idBateau') == idBateau).forEach(f => trajetsSource.removeFeature(f))
}

function remplacerTrajets(idBateau, trajets) {
	// On supprime les anciens trajets
	retirerTrajets(idBateau)
	// On ajoute les nouveaux trajets
	const ordreMax = Math.max.apply(null, trajets.map(t => parseInt(t.ordre))) // FIX ME #18 : se passer du parseInt
	trajets.forEach(trajet => addTrajetToMap(trajet, ordreMax))
}

getTrajets()

/************ SSE */

const eventSource = new EventSource(API_BASE_URL + '/stream')

eventSource.onopen = () => {
	console.log("CONNECTED")
}

eventSource.onerror = () => {
	switch (eventSource.readyState) {
		case EventSource.OPENED:
			console.log("OPENED")
			break
		case EventSource.CONNECTING:
			console.log("CONNECTING")
			break
		case EventSource.CLOSED:
			console.log("CLOSED")
			break
		default:
			console.log("UNKNOWN EVENT")
	}
}

eventSource.onmessage = event => {
	const data = JSON.parse(event.data)
	console.log("EVENT " + data.type)
	console.log(data.content)

	switch (data.type) {
		case 'deplacerBateau':
			const bateau = data.content.bateau
			const trajets = data.content.trajets
			// Actions
			moveBateau(bateau)
			remplacerTrajets(bateau.id, trajets)
			// Toaster
			toaster(`Le bateau n°${bateau.id} s'est déplacé vers ${bateau.geom.coordinates.join(', ')}`)
			break
		case 'rentrerBateau':
			const idBateau = data.content.idBateau
			// Actions
			bateauxSource.getFeatureById(idBateau).setGeometry(null)
			retirerTrajets(idBateau)
			// Toaster
			toaster(`Le bateau n°${idBateau} et ses trajets ont été retirés de la carte`)
			break
		case 'nouveauPort':
			const port = data.content.port
			addPortToMap(port)
			// Toaster
			toaster(`Le port n°${port.id} a bien été ajouté à la carte`)
			break
		case 'nouveauBateau':
			const nouveauBateau = data.content.bateau
			addBateauToMap(nouveauBateau)
			// Toaster
			toaster(`Le bateau n°${nouveauBateau.id} a bien été ajouté à la carte`)
			break
		default:
			console.log("UNHANDLED EVENT")
			break
	}
}

function toaster (texte) {
	const message = $(`<div class="message"><p>${texte}</p></div>`).appendTo('#stream')
	const div = $(`<div class="bar"></div>`).appendTo(message)
	message.fadeIn(function() {
		div.animate({ width: '100%' }, 5000, 'linear', function() { message.fadeOut() })
	})
}

//eventSource.close();
