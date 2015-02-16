
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


	function loadMarkers() {

			getWDS(Config.queries.prices_local_geo_filter, {
				fertilizer_code: '3102100000',
				month_from_yyyymm: '201201',
				month_to_yyyymm: '201212'
			},function(data) {

				console.log(data);

				var markers = {},
					places = [],
					placesquery = [];


				layerRetail.clearLayers();

				//var bb = L.latLngBounds(latlngs);

				for(var i in data) {
					var popup = L.Util.template('<h4>{title}<h4><big style="color:red">{val}</big>', {
							title: data[i][0],
							val: data[i][2]+' '+data[i][3]+" (avg)"
						});
					L.marker(data[i][1].split('|'))
						.bindPopup( popup )
						.addTo(layerRetail);
				}

				map.fitBounds( layerRetail.getBounds().pad(-0.8) );
			});
	}

/*	$('#prices_retail_grid tbody tr').on('click', function(e) {
		$(this).toggleClass('warning');

		loadMarkers();
	});*/

	loadMarkers();

});
