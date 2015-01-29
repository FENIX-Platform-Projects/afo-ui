require.config({

    baseUrl: 'src/',

    paths: {
        'i18n': './lib/i18n',
        'text': './lib/text',
        'domready': './lib/domready',
        'bootstrap': './lib/bootstrap',
        //'backbone'              :'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
        'highcharts': '//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts',
        //'highcharts_exporting'  :'//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/modules/exporting',
        //'highcharts-heatmap'    :'http://code.highcharts.com/maps/modules/heatmap',
        //'highcharts-data'       :'http://code.highcharts.com/maps/modules/data',
        'jquery': './lib/jquery',
        'underscore': './lib/underscore',
        'jstree': './lib/jstree/jstree.min',
        'handlebars': './lib/handlebars',

        //fenix-map-js
/*        'fenix-map': '../submodules/fenix-map-js/dist/latest/fenix-map-min',
        'fenix-map-config': '../submodules/fenix-map-js/dist/latest/fenix-map-config',
*/      'chosen': '//fenixapps.fao.org/repository/js/chosen/1.0.0/chosen.jquery.min',
        'leaflet': '//fenixapps.fao.org/repository/js/leaflet/0.7.3/leaflet',
        'leaflet-markecluster': '//fenixapps.fao.org/repository/js/leaflet/plugins/leaflet.markecluster/1.1/leaflet.markercluster',
        'import-dependencies': '//fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0',
        'jquery.power.tip': '//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min',
        'jquery-ui': '//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
        'jquery.i18n.properties': '//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min',
        'jquery.hoverIntent': '//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent',
        'fenix-ui-topmenu': '../scripts/components/fenix-ui-topmenu',

/*        //OLAP
        'pivot': '../submodules/fenix-ui-olap/js/pivot',
        'countriesAgg': '//faostat3.fao.org/faostat-download-js/pivotAgg/countriesAgg',
        'olap-config': '../prices/configuration',
        'gt_msg_en': "../submodules/fenix-ui-olap/lib/grid/gt_msg_en",
        //'gt_const': 'submodules/fenix-ui-olap/grid/gt_const',
        'gt_grid_all': '../submodules/fenix-ui-olap/lib/grid/gt_grid_all',
        'fusionchart': '../submodules/fenix-ui-olap/lib/grid/flashchart/fusioncharts/FusionCharts'
*/
    },

    shim: {
        'bootstrap': ['jquery'],
        'chosen': ['jquery'],
        'highcharts': ['jquery'],
        'jstree': ['jquery'],
        'jquery-ui': ['jquery'],
        'jquery.power.tip': ['jquery'],
        'jquery.i18n.properties': ['jquery'],
        'jquery.hoverIntent': ['jquery'],
        'underscore': {
			exports: '_'
        },
//		'fenix-map-config': {
//			exports: 'FMCONFIG'
//		},
        'pivot': [
			'jquery',
			'jquery-ui',
			'jquery.i18n.properties',
			'countriesAgg',
			'olap-config',
			'gt_msg_en',
			//'gt_const',
			'gt_grid_all',
			'fusionchart'
        ],
        'leaflet-markecluster': ['leaflet'],
        'fenix-map': [
			'i18n',
			'jquery',
			'chosen',
			'leaflet',
			'jquery-ui',
			'jquery.hoverIntent',
			'jquery.power.tip',
			'jquery.i18n.properties',
			'import-dependencies',
			'fenix-map-config'
        ]
    }
});

require([
        'jquery','underscore','bootstrap','highcharts','jstree','handlebars',
        'leaflet',
        'fenix-ui-topmenu/main',
        'text!../config/services.json',
        'text!../config/africa_countries.json',
        'text!../config/africa_regions.json',
        'domready!'
    ],
    function ($, _, bts, highcharts, jstree, Handlebars, 
		L,
		TopMenu,
		Config,
		Countries,
		Regions) {

		Config = JSON.parse(Config);
		Countries = JSON.parse(Countries);
		Regions = JSON.parse(Regions);

		console.log(Countries);

		new TopMenu({
			url: 'json/fenix-ui-topmenu_config.json',
			active: "statistics"
		});

		var listRegions$ = $('#stats_select .stats_list_regions'),
			listCountries$ = $('#stats_select .stats_list_countries'),
			mapzoomsRegions$ = $('#stats_map_regions').next('.map-zooms'),
			mapzoomsCountries$ = $('#stats_map_countries').next('.map-zooms');

		for(var r in Regions)
			listRegions$.append('<option>'+Regions[r][1]+'</option>');

		for(var c in Countries)
			listCountries$.append('<option>'+Countries[c][2]+'</option>');

		var mapRegions = L.map('stats_map_regions', {
				zoom: 2,
				zoomControl: false,
				attributionControl: false,
				center: L.latLng(0,0),
				layers: L.tileLayer(Config.url_baselayer)
			});

		var mapCountries = L.map('stats_map_countries', {
				zoom: 3,
				zoomControl: false,
				attributionControl: false,
				center: L.latLng(0,0),
				layers: L.tileLayer(Config.url_baselayer)
			});		

		mapzoomsRegions$.on('click','.btn', function(e) {
			var z = parseInt($(this).data('zoom'));
			mapRegions[ z>0 ? 'zoomIn' : 'zoomOut' ]();
		});

		mapzoomsCountries$.on('click','.btn', function(e) {
			var z = parseInt($(this).data('zoom'));
			mapCountries[ z>0 ? 'zoomIn' : 'zoomOut' ]();
		});
});
