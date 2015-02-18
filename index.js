
require(["submodules/fenix-ui-menu/js/paths",
		 "submodules/fenix-ui-common/js/Compiler"
		 ], function(Menu, Compiler) {

    var menuConfig = Menu;
    
    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Compiler.resolve([menuConfig], {
        placeholders : {
            FENIX_CDN: "//fenixapps.fao.org/repository"
        },
        config: {
			paths: {
				'text': "//fenixapps.fao.org/repository/js/requirejs/plugins/text/2.0.12/text",
				'i18n': "//fenixapps.fao.org/repository/js/requirejs/plugins/i18n/2.0.4/i18n",
				'domready': "//fenixapps.fao.org/repository/js/requirejs/plugins/domready/2.0.1/domReady",

				'amplify' : "//fenixapps.fao.org/repository/js/amplify/1.1.2/amplify.min",
				'highcharts': "//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts",

				'underscore': "//fenixapps.fao.org/repository/js/underscore/1.7.0/underscore.min",
				'handlebars': "//fenixapps.fao.org/repository/js/handlebars/2.0.0/handlebars",

				'domReady': "//fenixapps.fao.org/repository/js/requirejs/plugins/domready/2.0.1/domReady",
				'swiper': "//fenixapps.fao.org/repository/js/swiper/2.7.5/dist/idangerous.swiper.min",
				'bootstrap': "//fenixapps.fao.org/repository/js/bootstrap/3.3.2/js/bootstrap.min",
				'draggabilly': "//fenixapps.fao.org/repository/js/draggabilly/dist/draggabilly.pkgd.min",
				'intro': "//fenixapps.fao.org/repository/js/introjs/1.0.0/intro",
				'isotope': "//fenixapps.fao.org/repository/js/isotope/2.1.0/dist/isotope.pkgd.min",
				'jquery': "//fenixapps.fao.org/repository/js/jquery/2.1.1/jquery.min",
				'jqwidgets': "//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-light",
				'jstree': "//fenixapps.fao.org/repository/js/jstree/3.0.8/dist/jstree.min",

				//fenix-map-js
				'fenix-map': "submodules/fenix-map-js/dist/latest/fenix-map-min",
				'fenix-map-config': "submodules/fenix-map-js/dist/latest/fenix-map-config",
				'chosen': "//fenixapps.fao.org/repository/js/chosen/1.0.0/chosen.jquery.min",
				'leaflet': "//fenixapps.fao.org/repository/js/leaflet/0.7.3/leaflet",
				'jquery.power.tip': "//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min",
				'jquery-ui': "//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min",
				'jquery.hoverIntent': "//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverInten",
				'jquery.i18n.properties': "//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min"
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
                'amplify': {
                    deps: ['jquery'],
                    exports: 'amplifyjs'
                },
				'swiper': ['jquery'],
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
        './scripts/components/AuthenticationManager',
        'amplify',
		
		'domready!'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L,
		Config,
		TopMenu, AuthenticationManager) {

		Config = JSON.parse(Config);

        var authUser = amplify.store.sessionStorage('afo.security.user'),
            menuUrl,
            publicMenuConfig = 'config/fenix-ui-menu.json',
            authMenuConfig = 'config/fenix-ui-menu-auth.json';

        authUser ? menuUrl = authMenuConfig : menuUrl = publicMenuConfig;

        var topMenu = new TopMenu({
            active: 'home',        	
            url: menuUrl,
            className : 'fx-top-menu',
            breadcrumb : {
                active : true,
                container : "#breadcumb_container",
                showHome : true
            }
        });

        /*Login*/
        new AuthenticationManager();

        amplify.subscribe('login', function (user) {
            refreshMenu(authMenuConfig);
        });
        amplify.subscribe('logout', function () {
            console.warn("Event logout intercepted");
            refreshMenu(publicMenuConfig);
        });
        function refreshMenu(url) {
            topMenu.refresh({
                active: 'home',
                url: url,
                className : 'fx-top-menu',
                breadcrumb : {
                    active : true,
                    container : "#breadcumb_container",
                    showHome : true
                }
            })
        }

        //HIGLIGHTS SLIDER
		//	SLIDER Highltights
		var swiperHigh = $('#afo-high-wrapper').swiper({
			loop: true,
			simulateTouch: false,
            onSwiperCreated: updateMainSwiperIndex,
            onSlideChangeEnd: updateMainSwiperIndex

		});
		$('.swipe-high-prev').on('click', function(e) {
			e.preventDefault();
			swiperHigh.swipePrev();
		});
		$('.swipe-high-next').on('click', function(e) {
			e.preventDefault();
			swiperHigh.swipeNext();
		});


        function updateMainSwiperIndex (swiper) {
            var s = swiper || swiperHigh;

           $('.hp-main-swiper-index').html('<span class="swiper-index"><span class="swiper-index-active">'+ (s.activeLoopIndex + 1)+'</span><span class="swiper-index-total"> | '+ (s.slides.length - (s.loopedSlides*2) )+'</span></span>' );
        }



///MAPS SLIDER
		var swiperMaps = {},
			countriesLayer = L.tileLayer.wms(Config.wmsUrl, {
				layers: "fenix:"+Config.gaulLayer,
				format: 'image/png',
				transparent: true
			});

		$.ajax({
			url: Config.sldUrl,
			data: {
				stylename: "fenix:"+Config.gaulLayer,
				style: "[iso3 = 'COD'] { fill: #309000; fill-opacity: 0.56; stroke: #FFFFFF; }"+
						"[iso3 = 'GHA'] { fill: #309000; fill-opacity: 0.74; stroke: #FFFFFF; }"+
						"[iso3 = 'CIV'] { fill: #309000; fill-opacity: 0.74; stroke: #FFFFFF; }"+
						"[iso3 = 'KEN'] { fill: #309000; fill-opacity: 0.74; stroke: #FFFFFF; }"+
						"[iso3 = 'MWI'] { fill: #309000; fill-opacity: 0.38; stroke: #FFFFFF; }"+
						"[iso3 = 'MOZ'] { fill: #309000; fill-opacity: 0.74; stroke: #FFFFFF; }"+
						"[iso3 = 'NGA'] { fill: #309000; fill-opacity: 0.56; stroke: #FFFFFF; }"+
						"[iso3 = 'SEN'] { fill: #309000; fill-opacity: 0.74; stroke: #FFFFFF; }"+
						"[iso3 = 'TZA'] { fill: #309000; fill-opacity: 0.74; stroke: #FFFFFF; }"+
						"[iso3 = 'UGA'] { fill: #309000; fill-opacity: 0.74; stroke: #FFFFFF; }"+
						"[iso3 = 'ZMB'] { fill: #309000; fill-opacity: 0.92; stroke: #FFFFFF; }"+
						"[iso3 = 'BFA'] { fill: #309000; fill-opacity: 0.56; stroke: #FFFFFF; }"+
						"[iso3 = 'BDI'] { fill: #309000; fill-opacity: 0.56; stroke: #FFFFFF; }"+
						"[iso3 = 'CMR'] { fill: #309000; fill-opacity: 0.56; stroke: #FFFFFF; }"+
						"[iso3 = 'ETH'] { fill: #309000; fill-opacity: 0.38; stroke: #FFFFFF; }"+
						"[iso3 = 'MDG'] { fill: #309000; fill-opacity: 0.56; stroke: #FFFFFF; }"+
						"[iso3 = 'MLI'] { fill: #309000; fill-opacity: 0.56; stroke: #FFFFFF; }"+
						"[iso3 = 'NER'] { fill: #309000; fill-opacity: 0.38; stroke: #FFFFFF; }"+
						"[iso3 = 'RWA'] { fill: #309000; fill-opacity: 0.38; stroke: #FFFFFF; }"+
						"[iso3 = 'TGO'] { fill: #309000; fill-opacity: 0.56; stroke: #FFFFFF; }"+
						"[iso3 = 'BEN'] { fill: #309000; fill-opacity: 0.38; stroke: #FFFFFF; }"
			},
			async: false,
			type: 'POST',
			success: function(response) {
				countriesLayer.wmsParams.sld = response;
			}
		});

		swiperMaps.slide1 = L.map('mapSlide1', {
			zoom: 3,
			zoomControl: false,
			attributionControl: false,
			center: L.latLng(12,18),
			layers: L.tileLayer(Config.url_baselayer)
		})
		.addControl(L.control.zoom({position:'bottomright'}))
		.addLayer(countriesLayer);

		swiperMaps.slide2 = L.map('mapSlide2', {
			zoom: 3,
			zoomControl: false,
			attributionControl: false,
			center: L.latLng(12,18),
			layers: L.tileLayer(Config.url_osmlayer)
		})
		.addControl(L.control.zoom({position:'bottomright'}));

		swiperMaps.slide3 = L.map('mapSlide3', {
			zoom: 3,
			zoomControl: false,
			attributionControl: false,
			center: L.latLng(12,18),
			layers: L.tileLayer(Config.url_osmlayer)
		})
		.addControl(L.control.zoom({position:'bottomright'}));

		//	SLIDER Maps
		var mySwiperMap = $('#afo-maps-wrapper').swiper({
			loop: false,
			simulateTouch: false,
			mode: 'vertical',
			onSwiperCreated: function() {
				swiperMaps.slide1.invalidateSize();
                $('#afo-maps-wrapper').find(".map-legend").removeClass("active");
			},
			onSlideChangeEnd: function() {
				swiperMaps.slide1.invalidateSize();
				swiperMaps.slide2.invalidateSize();
				swiperMaps.slide3.invalidateSize();
                $('#afo-maps-wrapper').find(".map-legend").removeClass("active");
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

        $('#afo-maps-legend-btn').on('click', function() {
            $('#afo-maps-wrapper').find(".map-legend[data-legend='"+mySwiperMap.activeIndex+"']").toggleClass("active");
        });

		$('.footer').load('html/footer.html');

		$('.afo-home-partner-container .nav-tabs')
			.on('mouseenter','a', _.debounce(function(e) {
				e.preventDefault();
				e.stopPropagation();
				//$(e.delegateTarget).trigger('mouseout'); 
				$(e.delegateTarget).next('.tab-content').find('.tab-pane').removeClass('active in');
				$(e.target).trigger('click');
			},50));
	});


});