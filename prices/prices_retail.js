
define([
	'text!../config/services.json',
	'jquery','underscore','bootstrap','highcharts','jstree','handlebars','leaflet','leaflet-markecluster',
	], function(
		Config,
		$, _, bts, highcharts, jstree, Handlebars, L, Lmarkers) {

	Config = JSON.parse(Config);

	function getWDS(queryTmpl, queryVars, callback) {

		var sqltmpl, sql;

		if(queryVars) {
			sqltmpl = _.template(queryTmpl);
			sql = sqltmpl(queryVars);
		}
		else
			sql = queryTmpl;

		var	data = {
				datasource: Config.dbName,
				thousandSeparator: ',',
				decimalSeparator: '.',
				decimalNumbers: 2,
				cssFilename: '',
				nowrap: false,
				valuesIndex: 0,
				json: JSON.stringify({query: sql})
			};

		$.ajax({
			url: Config.wdsUrl,
			data: data,
			type: 'POST',
			dataType: 'JSON',
			success: callback
		});
	}

	var map = L.map('prices_retail_map', {
			zoom: 11,
			zoomControl: false,
			attributionControl:false,
			center: L.latLng(0,0),
			layers: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
		}).addControl(L.control.zoom({position:'bottomright'}))

	var layerRetail = new L.MarkerClusterGroup({
		maxClusterRadius:30
	});
	layerRetail.addTo(map);


/*getWDS(queryTmpl, queryVars, callback) {

});
*//*	function loadMarkers() {

		var markers = {},
			places = [],
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
					markers[ json[i].join() ] = L.marker(L.latLng(json[i]), {
						title: places[i].place
					})
					.bindPopup([
						'<b>'+places[i].place+'</b>',
						places[i].fert,
						places[i].price
						].join('<br>')
					);
				}

				for(var l in markers)
					markers[l].addTo(layerRetail);

				map.fitBounds( bb.pad(1) );
			});
	}*/

/*	$('#prices_retail_grid tbody tr').on('click', function(e) {
		$(this).toggleClass('warning');

		loadMarkers();
	});*/

	//loadMarkers();

});
