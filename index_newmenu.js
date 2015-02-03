
require(['submodules/fenix-ui-menu/js/paths',
		 'submodules/fenix-ui-common/js/Compiler'
		 ], function(Menu, Compiler) {

    var menuConfig = Menu;
    menuConfig['baseUrl'] = 'submodules/fenix-ui-menu/js';

    Compiler.resolve([menuConfig], {
        config: {

		    //baseUrl: 'src/',

		    paths: {

		        'host': '../scripts/index/host',
		    	'text': '//fenixapps.fao.org/repository/js/requirejs/plugins/text/2.0.12/text',
		        //TODO 'i18n': 'lib/i18n',
		        'domready': '//fenixapps.fao.org/repository/js/requirejs/plugins/domready/2.0.1/domReady',
		       
		        'highcharts': '//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts',

		        'underscore': "//fenixapps.fao.org/repository/js/underscore/1.7.0/underscore.min",
		        'handlebars': '//fenixapps.fao.org/repository/js/handlebars/2.0.0/handlebars',

                'domReady': '//fenixapps.fao.org/repository/js/requirejs/plugins/domready/2.0.1/domReady',
                'highcharts': "//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts",
                'swiper': "//fenixapps.fao.org/repository/js/swiper/2.7.5/dist/idangerous.swiper.min",
				'bootstrap': '//fenixapps.fao.org/repository/js/bootstrap/3.3.2/js/bootstrap.min',
				'draggabilly': '//fenixapps.fao.org/repository/js/draggabilly/dist/draggabilly.pkgd.min',
				'intro': '//fenixapps.fao.org/repository/js/introjs/1.0.0/intro',
				'isotope': '//fenixapps.fao.org/repository/js/isotope/2.1.0/dist/isotope.pkgd.min',
				'jquery': '//fenixapps.fao.org/repository/js/jquery/2.1.1/jquery.min',
				'jqwidgets': '//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-light',
				'jstree': '//fenixapps.fao.org/repository/js/jstree/3.0.8/dist/jstree.min',

		        //fenix-map-js
		        'fenix-map': '../submodules/fenix-map-js/dist/latest/fenix-map-min',
		        'fenix-map-config': '../submodules/fenix-map-js/dist/latest/fenix-map-config',
		        'chosen': '//fenixapps.fao.org/repository/js/chosen/1.0.0/chosen.jquery.min',
		        'leaflet': '//fenixapps.fao.org/repository/js/leaflet/0.7.3/leaflet-src',
		        
		        'import-dependencies': '//fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0',

		        'jquery.power.tip': '//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min',
		        'jquery-ui': '//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
		        'jquery.i18n.properties': '//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min',
		        'jquery.hoverIntent': '//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent',

		        //'fenix-ui-menu': '../submodules/fenix-ui-menu/main'
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
		}
    });

	require([
	    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper', 'leaflet',
	    'text!config/services.json',

		'fx-menu/start',
		
		'domready!'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L,
		Config,
		TopMenu) {

		Config = JSON.parse(Config);

        new TopMenu({
            url: 'config/fenix-ui-menu.json',
            active: 'home'
        });

		var swiperMapOpts = {
				zoom: 4,
				zoomControl: false,
				attributionControl: false,
				center: L.latLng(20,0),
				layers: L.tileLayer(Config.url_osmlayer)
			},
			swiperMaps = {};

		swiperMaps.slide1 = L.map('mapSlide1', swiperMapOpts);
		swiperMaps.slide1.addControl(L.control.zoom({position:'bottomright'}));

		swiperMaps.slide2 = L.map('mapSlide2', {
			zoom: 4,
			zoomControl: false,
			attributionControl: false,
			center: L.latLng(20,0),
			layers: L.tileLayer(Config.url_baselayer)
		});

		swiperMaps.slide2.addControl(L.control.zoom({position:'bottomright'}));

		//Maps
		var mySwiperMap = $('#afo-maps-wrapper').swiper({
			loop: false,
			simulateTouch: false,
			mode: 'vertical',
			onSwiperCreated: function() {
				swiperMaps.slide1.invalidateSize();
			},
			onSlideChangeEnd: function() {
				swiperMaps.slide1.invalidateSize();
				swiperMaps.slide2.invalidateSize();	
			}
		});
		$('.swipe-maps-prev').on('click', function(e) {
			e.preventDefault();
			mySwiperMap.swipePrev();
		});
		$('.swipe-maps-next').on('click', function(e) {
			e.preventDefault();
			mySwiperMap.swipeNext();
		});

		// Highltights
		var mySwiperHigh = $('#afo-high-wrapper').swiper({
			loop: true,
			simulateTouch: false
		});
		$('.swipe-high-prev').on('click', function(e) {
			e.preventDefault();
			mySwiperHigh.swipePrev();
		});
		$('.swipe-high-next').on('click', function(e) {
			e.preventDefault();
			mySwiperHigh.swipeNext();
		});

		$('.footer').load('html/footer.html');
	});


});