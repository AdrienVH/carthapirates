const API_BASE_URL = "http://localhost:9001"

// MAP

var mapbox = new ol.layer.Tile({
	source: new ol.source.XYZ({
		tileSize: [256, 256],
		url: 'https://api.mapbox.com/styles/v1/adrienvh/cki3g3bme2w2w19qyrxm4wry5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRyaWVudmgiLCJhIjoiU2lDV0N5cyJ9.2pFJAwvwZ9eBKKPiOrNWEw'
	}),
	name: "mapbox"
});

/***** SITES */

function getSitesStyle(f){
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

var sitesSource = new ol.source.Vector({projection : 'EPSG:3857'});
var sites = new ol.layer.Vector({
	source: sitesSource,
	style: getSitesStyle,
	name: "sites"
});

/***** MOYENS */

function getMoyensStyle(f){
	return new ol.style.Style({
		image: new ol.style.Icon({
			src: 'bateau.png',
			scale: 1,
			//rotation: f.get("radians")
		}),
		text: new ol.style.Text({
			offsetY: 25,
			text: f.get("nom"),
			font: 'italic bold 13px sans-serif',
			fill: new ol.style.Fill({color: 'black'})
		})
	});
}

var moyensSource = new ol.source.Vector({projection : 'EPSG:3857'});
var moyens = new ol.layer.Vector({
	source: moyensSource,
	style: getMoyensStyle,
	name: "moyens"
});

function getTrajetsStyle(f){
	return new ol.style.Style({
		stroke: new ol.style.Stroke({color: 'red', width: 3})
	});
}

var trajetsSource = new ol.source.Vector({projection : 'EPSG:3857'});
var trajets = new ol.layer.Vector({
	source: trajetsSource,
	style: getTrajetsStyle,
	name: "trajetsSource"
});

var scaleLineControl = new ol.control.ScaleLine();

var map = new ol.Map({
	layers: [mapbox, trajets, sites, moyens],
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

/************ GET SITES */

function getSites(){
	var request = $.ajax({
		url: API_BASE_URL + "/sites",
		method: "GET"
	});

	request.done(function(records) {
		for(i in records){
			addSiteToMap(records[i]);
		}
	});

	request.fail(function(jqXHR, textStatus) {
		console.log("FAIL", jqXHR, textStatus);
	});
}

function addSiteToMap(record) {
	var feature = new ol.Feature({ });
	feature.setId(record.id)
	feature.set("nom", record.nom)
	feature.setGeometry(new ol.geom.Point(ol.proj.transform(record.geom.coordinates, 'EPSG:4326','EPSG:3857')))
	sitesSource.addFeature(feature)
}

getSites()


/************ GET MOYENS */

function getMoyens(){
	var request = $.ajax({
		url: API_BASE_URL + "/moyens",
		method: "GET"
	});

	request.done(function(records) {
		for(i in records){
			addMoyenToMap(records[i]);
		}
	});

	request.fail(function(jqXHR, textStatus) {
		console.log("FAIL", jqXHR, textStatus);
	});
}

function addMoyenToMap(record) {
	var feature = new ol.Feature({ });
	/*feature.set("degres", 0)
	feature.set("radians", 0)*/
	feature.setId(record.id)
	feature.set("nom", record.nom)
	feature.setGeometry(new ol.geom.Point(ol.proj.transform(record.geom.coordinates, 'EPSG:4326','EPSG:3857')))
	moyensSource.addFeature(feature)
}

getMoyens()

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
	updateMoyen(JSON.parse(event.data))
};

function updateMoyen(modif) {
	const p = $('<p>Le bateau '+modif.id+' est à '+modif.geom.coordinates[0]+' , '+modif.geom.coordinates[1]+'</p>').appendTo('#stream')
	window.setTimeout(() => {
		p.fadeOut()
	}, 3000);
	// Update point feature on map
	var moyen = moyensSource.getFeatureById(modif.id)
	/*var point1 = modif.coordonnees[0]
	var point2 = modif.coordonnees[1]
	var degres = 180 - Math.atan2(point2[1] - point1[1], point2[0] - point1[0]) * 180 / Math.PI
	moyen.set("degres", degres)
	var radians = degres * (Math.PI / 180);
	moyen.set("radians", radians)*/
	var xyMoyen = ol.proj.transform(modif.geom.coordinates, 'EPSG:4326','EPSG:3857')
	moyen.setGeometry(new ol.geom.Point(xyMoyen))
	// Update line feature on map
	/*var trajet = trajetsSource.getFeatureById(modif.id)
	var line = new ol.geom.LineString(modif.coordonnees).transform('EPSG:4326','EPSG:3857')
	trajet.setGeometry(line)*/
}

//eventSource.close();
