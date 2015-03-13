
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
				'fenix-map': "submodules/fenix-ui-map/dist/fenix-ui-map.min",
				'fenix-map-config': "submodules/fenix-ui-map/dist/fenix-ui-map-config",
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
		'text!html/home_maps_legend.html',

		'fx-menu/start',
        './scripts/components/AuthenticationManager',

        'amplify',
		
		'domready!'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L,
		Config,
		mapLegend,

		TopMenu, AuthenticationManager
		) {

		Config = JSON.parse(Config);
		mapLegendTmpl = Handlebars.compile(mapLegend);

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

//        $(window).bind("load resize", function(){
//            var container_width = $('#afo-facebook-widget').width();
//            $('#afo-facebook-widget').html('<div class="fb-like-box" ' +
//                'data-href="https://www.facebook.com/AfricaFertilizer.org"' +
//                ' data-width="' + container_width + '" data-height="250" data-show-faces="false" ' +
//                'data-stream="true" data-header="true"></div>');
//            FB.XFBML.parse( );
//        });

        var authUser = amplify.store.sessionStorage('afo.security.user'),
            menuUrl,
            publicMenuConfig = 'config/fenix-ui-menu.json',
            authMenuConfig = 'config/fenix-ui-menu-auth.json';

        authUser ? menuUrl = authMenuConfig : menuUrl = publicMenuConfig;

        var topMenu = new TopMenu({
            active: 'home',        	
            url: menuUrl,
            className : 'fx-tomapLegendTmplp-menu',
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
		var swiperHigh = $('#afo-high-wrapper').swiper({
			loop: true,
			simulateTouch: false,
            onSwiperCreated: updateMainSwiperIndex,
            onSlideChangeEnd: updateMainSwiperIndex,
            autoplay: 5000
		});
		$('.swipe-high-prev').on('click', function(e) {
			e.preventDefault();
			swiperHigh.swipePrev();
		});
		$('.swipe-high-next').on('click', function(e) {
			e.preventDefault();
			swiperHigh.swipeNext();
		});

        function updateMainSwiperIndex(swiper) {
            var s = swiper || swiperHigh;
           $('.hp-main-swiper-index').html('<span class="swiper-index"><span class="swiper-index-active">'+ (s.activeLoopIndex + 1)+'</span><span class="swiper-index-total"> | '+ (s.slides.length - (s.loopedSlides*2) )+'</span></span>' );
        }

///MAPS SLIDER
		var swiperMaps = {},
			mapScales = [{
				"-1": { color: "#DDDDDD", label: "NC"},
				"4":  { color: "#F1EEE8", label: "4" },
				"3":  { color: "#BCD5AB", label: "3" },
				"2":  { color: "#A5C88E", label: "2" },
				"1":  { color: "#8DBD70", label: "1" },
				"0":  { color: "#6AAC46", label: "0" }
			}, {
				"-1": { color: "#DDDDDD", label: "NC"},
				"0":  { color: "#deebf7", label: "0" },
				"1":  { color: "#c6dbef", label: "1" },
				"2":  { color: "#9ecae1", label: "2" },
				"3":  { color: "#6baed6", label: "3" },
				"4":  { color: "#4292c6", label: "4" },
				"5":  { color: "#2171b5", label: "5" },
				"6":  { color: "#08519c", label: "6" },
				"7":  { color: "#08306b", label: "7" },
				"8":  { color: "#08306b", label: "8" }
			}, {
				"-1": { color: "#DDDDDD", label: "NC"},
				"0":  { color: "#e0f3db", label: "0" },
				"1":  { color: "#ccebc5", label: "1" },
				"2":  { color: "#a8ddb5", label: "2" },
				"3":  { color: "#A5C88E", label: "3" },
				"4":  { color: "#7bccc4", label: "4" },
				"5":  { color: "#4eb3d3", label: "5" },
				"6":  { color: "#2b8cbe", label: "6" },
				"7":  { color: "#0868ac", label: "7" },
				"8":  { color: "#084081", label: "8" },
				"9":  { color: "#063879", label: "9" }
			}];	

		$('#mapSlide1').next('.map-legend').append( mapLegendTmpl({values: mapScales[0] }) );
		$('#mapSlide2').next('.map-legend').append( mapLegendTmpl({values: mapScales[1] }) );
		$('#mapSlide3').next('.map-legend').append( mapLegendTmpl({values: mapScales[2] }) );

		function setLayerStyle(ccodes, indexMap) {
			var style = '',
				sld = '';

			_.each(ccodes, function(val, adm0_code) {

				style += "[adm0_code = '"+adm0_code+"'] { "+
					"fill: "+mapScales[indexMap][val].color+"; "+
					"fill-opacity: 0.8; "+
					"stroke: #FFFFFF; "+
				"}";
			});

			$.ajax({
				url: Config.sldUrl,
				data: {
					stylename: "fenix:"+Config.gaulLayer,
					style: style
				},
				async: false,
				type: 'POST',
				success: function(response) {
					sld = response;
				}
			});
			return sld;
		}

		function getLayerStyled(field, indexMap) {

			var	countriesLayer = L.tileLayer.wms(Config.wmsUrl, {
				layers: "fenix:"+Config.gaulLayer,
				format: 'image/png',
				transparent: true
			});

			getWDS(Config.queries.home_maps_filter, {field: field }, function(resp) {

				var ccodes = {}, val;

				for(var i in resp)
					ccodes[ resp[i][0] ] = resp[i][1];

				countriesLayer.wmsParams.sld = setLayerStyle(ccodes, indexMap);
				countriesLayer.redraw();
			});

			return countriesLayer;
		}

		swiperMaps.slide1 = L.map('mapSlide1', {
			zoom: 3,
			zoomControl: false,
			attributionControl: false,
			center: L.latLng(12,18),
			layers: L.tileLayer(Config.url_baselayer)
		})
		.addControl(L.control.zoom({position:'bottomright'}))
		.addLayer( getLayerStyled('afo_footprint',0) );

		swiperMaps.slide2 = L.map('mapSlide2', {
			zoom: 3,
			zoomControl: false,
			attributionControl: false,
			center: L.latLng(12,18),
			layers: L.tileLayer(Config.url_baselayer)
		})
		.addControl(L.control.zoom({position:'bottomright'}))
		.addLayer( getLayerStyled('manufacturing_plant',1) );

		swiperMaps.slide3 = L.map('mapSlide3', {
			zoom: 3,
			zoomControl: false,
			attributionControl: false,
			center: L.latLng(12,18),
			layers: L.tileLayer(Config.url_baselayer)
		})
		.addControl(L.control.zoom({position:'bottomright'}))
		.addLayer( getLayerStyled('blending_plant',2) );


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
				//$(e.delegateTarget).trigger('mouseout'); 
				$(e.delegateTarget).next('.tab-content').find('.tab-pane').removeClass('active in');
				$(e.target).trigger('click');
			},50))
			.on('mousedown','a', function(e) {
				location.href = $(e.target).attr('href');
			});			
/*		$('.afo-home-partner-container .nav-tabs .active a').on('click.go', function(e) {
			location.href = $(e.target).data('link');
		});*/
	});


});