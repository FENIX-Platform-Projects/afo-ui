require.config({

    baseUrl: 'src/',

    paths: {
        "host": '../scripts/index/host',
        'i18n': 'lib/i18n',
        'text': 'lib/text',
        'domready': 'lib/domready',
        'bootstrap': 'lib/bootstrap',
        //'backbone'              :'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
        'highcharts': '//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts',
        //'highcharts_exporting'  :'//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/modules/exporting',
        //'highcharts-heatmap'    :'http://code.highcharts.com/maps/modules/heatmap',
        //'highcharts-data'       :'http://code.highcharts.com/maps/modules/data',
        'jquery': 'lib/jquery',
        'underscore': 'lib/underscore',
        'jstree': 'lib/jstree/jstree.min',
        'handlebars': 'lib/handlebars',
        'swiper' : '../scripts/lib/swiper',

        //fenix-map-js
        'fenix-map': '../submodules/fenix-map-js/dist/latest/fenix-map-min',
        'fenix-map-config': '../submodules/fenix-map-js/dist/latest/fenix-map-config',
        'chosen': '//fenixapps.fao.org/repository/js/chosen/1.0.0/chosen.jquery.min',
        'leaflet': '//fenixapps.fao.org/repository/js/leaflet/0.7.3/leaflet',
        'import-dependencies': '//fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0',
        'jquery.power.tip': '//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min',
        'jquery-ui': '//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
        'jquery.i18n.properties': '//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min',
        'jquery.hoverIntent': '//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent',
        'fenix-ui-topmenu': '../scripts/components/fenix-ui-topmenu'
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
        'fenix-map': {
            deps: [
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
    }
});

require([
    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper', 'leaflet',
    'text!../config/services.json',
	'fenix-ui-topmenu/main',
	'domready!'
], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L,
	Config,
	TopMenu) {

	new TopMenu({
		url: 'json/fenix-ui-topmenu_config.json',
		active: "events"
	});

		// Highltights
	var mySwiperHigh = $('#afo-high-wrapper').swiper({
		//    pagination: '.pagination',
		loop: true,
		grabCursor: true,
		paginationClickable: true,
		mode: 'vertical'
	});
	$('.swipe-high-prev').on('click', function(e) {
		e.preventDefault();
		mySwiperHigh.swipePrev();
	});
	$('.swipe-high-next').on('click', function(e) {
		e.preventDefault();
		mySwiperHigh.swipeNext();
	});

	//Maps
	var mySwiperMap = $('#afo-maps-wrapper').swiper({
		//    pagination: '.pagination',
		loop: true,
		grabCursor: true,
		paginationClickable: true,
		mode: 'vertical'
	});
	$('.swipe-maps-prev').on('click', function(e) {
		e.preventDefault();
		mySwiperMap.swipePrev();
	});
	$('.swipe-maps-next').on('click', function(e) {
		e.preventDefault();
		mySwiperMap.swipeNext();
	});

/*	var swiperMapOpts = {zoomControl: false, attributionControl: false},
		mapSlide1 = L.map('mapSlide1', swiperMapOpts),
		mapSlide2 = L.map('mapSlide2', swiperMapOpts),
		mapSlide3 = L.map('mapSlide3', swiperMapOpts);

*/

	$('.footer').load('html/footer.html');
});