
define([
	'text!../config/services.json',
	'jquery','underscore','bootstrap','highcharts','jstree','handlebars','leaflet','leaflet-markecluster',
	], function(
		Config,
		$, _, bts, highcharts, jstree, Handlebars, L, Lmarkers) {

	Config = JSON.parse(Config);

	var map = L.map('prices_retail_map', {
			zoom: 11,
			center: L.latLng(0,0),
			layers: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
		});

	var layerRetail = new L.MarkerClusterGroup({
		maxClusterRadius:30
	});
	layerRetail.addTo(map);


	function loadMarkers() {

		var places = [],
			placesquery = [];

		$('#prices_retail_grid tbody tr.warning').each(function() {

				var fert = $(this).find('td').eq(4).text(),
					price = $(this).find('td').eq(6).text(),
					place = $(this).find('td').eq(0).text()+', '+
							$(this).find('td').eq(3).text();
							
				places.push({
					fert: fert,
					place: place,
					loc: []
				});
			});

			placesquery = _.pluck(places, 'place').join('|');

			layerRetail.clearLayers();
			$.get(Config.url_geocoding+placesquery, function(json) {

				var bb = L.latLngBounds(json);

				for(var i in json)
				{
					L.marker(L.latLng(json[i]), {
						title: places[i].place
					})
					.bindPopup([
						'<b>'+places[i].place+'</b>',
						places[i].fert,
						places[i].price
						].join('<br>')
					).addTo(layerRetail);
				}

				map.fitBounds( bb.pad(1) );
			});
	}

	$('#prices_retail_grid tbody tr').on('click', function(e) {
		$(this).toggleClass('warning');

		loadMarkers();
	});

	loadMarkers();

});
