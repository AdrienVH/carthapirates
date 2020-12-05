const API_BASE_URL = "http://localhost:9001"

// MAP

var mapbox = new ol.layer.Tile({
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
			font: 'bold 11px sans-serif',
			fill: new ol.style.Fill({color: 'white'})
		})
	});
}

var portsSource = new ol.source.Vector({projection : 'EPSG:3857'});
var ports = new ol.layer.Vector({
	source: portsSource,
	style: getPortsStyle,
	name: "ports"
});

/***** BATEAUX */

function getBateauxStyle(f){
	return new ol.style.Style({
		image: new ol.style.Icon({
			src: 'bateau.png',
			scale: 1
		}),
		text: new ol.style.Text({
			offsetY: 25,
			text: f.get("nom"),
			font: 'italic bold 13px sans-serif',
			fill: new ol.style.Fill({color: 'black'})
		})
	});
}

var bateauxSource = new ol.source.Vector({projection : 'EPSG:3857'});
var bateaux = new ol.layer.Vector({
	source: bateauxSource,
	style: getBateauxStyle,
	name: "bateaux"
});

/*function getTrajetsStyle(f){
	return new ol.style.Style({
		stroke: new ol.style.Stroke({color: 'red', width: 3})
	});
}

var trajetsSource = new ol.source.Vector({projection : 'EPSG:3857'});
var trajets = new ol.layer.Vector({
	source: trajetsSource,
	style: getTrajetsStyle,
	name: "trajetsSource"
});*/

var scaleLineControl = new ol.control.ScaleLine();

var map = new ol.Map({
	layers: [mapbox, ports, bateaux],
	target: document.getElementById('map'),
	view: new ol.View({
		center: ol.proj.transform([6.0, 40.0], 'EPSG:4326', 'EPSG:3857'),
		zoom: 6,
		minZoom:6,
		maxZoom:8
	}),
	controls : ol.control.defaults({
		attribution : false,
		zoom : false
	}).extend([scaleLineControl])
})

map.on('singleclick', function (evt) {
	var xy = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326').map(c => c.toFixed(6)).join(",");
	$('#xy').html(xy);
	$('#xy').show();
	var elm = document.getElementById("xy");
	var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(elm);
    selection.removeAllRanges();
    selection.addRange(range);
	document.execCommand("Copy");
	selection.removeAllRanges();
	$('#xy').hide();
});

/************ GET PORTS */

function getPorts(){
	var request = $.ajax({
		url: API_BASE_URL + "/ports",
		method: "GET"
	});

	request.done(function(records) {
		for(i in records){
			addPortToMap(records[i]);
		}
	});

	request.fail(function(jqXHR, textStatus) {
		console.log("FAIL", jqXHR, textStatus);
	});
}

function addPortToMap(record) {
	var feature = new ol.Feature({ });
	feature.setId(record.id)
	feature.set("nom", record.nom)
	feature.setGeometry(new ol.geom.Point(ol.proj.transform(record.geom.coordinates, 'EPSG:4326','EPSG:3857')))
	portsSource.addFeature(feature)
}

getPorts()

/************ GET BATEAUX */

function getBateaux(){
	var request = $.ajax({
		url: API_BASE_URL + "/bateaux",
		method: "GET"
	});

	request.done(function(records) {
		for(i in records){
			addBateauToMap(records[i]);
		}
	});

	request.fail(function(jqXHR, textStatus) {
		console.log("FAIL", jqXHR, textStatus);
	});
}

function addBateauToMap(record) {
	var feature = new ol.Feature({ });
	feature.setId(record.id)
	feature.set("nom", record.nom)
	feature.setGeometry(new ol.geom.Point(ol.proj.transform(record.geom.coordinates, 'EPSG:4326','EPSG:3857')))
	bateauxSource.addFeature(feature)
}

getBateaux()

// SSE

const eventSource = new EventSource(API_BASE_URL + '/stream');
eventSource.onopen = () => {
	console.log('connected')
};
eventSource.onerror = event => {
  if (eventSource.readyState === EventSource.CLOSED) {
    console.log('closed')
  }
  if (eventSource.readyState === EventSource.CONNECTING) {
    console.log('connecting')
  }
};
eventSource.onmessage = event => {
	updateBateau(JSON.parse(event.data))
};

function updateBateau(modif) {
	const p = $('<p>Le bateau '+modif.id+' est à '+modif.geom.coordinates[0]+' , '+modif.geom.coordinates[1]+'</p>').appendTo('#stream')
	window.setTimeout(() => {
		p.fadeOut()
	}, 3000);
	// Update point feature on map
	var bateau = bateauxSource.getFeatureById(modif.id)
	var xyBateau = ol.proj.transform(modif.geom.coordinates, 'EPSG:4326','EPSG:3857')
	bateau.setGeometry(new ol.geom.Point(xyBateau))
	// Update line feature on map
	/*var trajet = trajetsSource.getFeatureById(modif.id)
	var line = new ol.geom.LineString(modif.coordonnees).transform('EPSG:4326','EPSG:3857')
	trajet.setGeometry(line)*/
}

//eventSource.close();
