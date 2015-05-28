
require(["submodules/fenix-ui-menu/js/paths",
		 "submodules/fenix-ui-common/js/Compiler"
		 ], function(menuConfig, Compiler) {

    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Compiler.resolve([menuConfig], {
        placeholders : {
            FENIX_CDN: "//fenixrepo.fao.org/cdn"
        },
        config: {
			paths: {
				'text':        "{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text",
				'i18n':        "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
				'domready':    "{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady",

				'amplify' :    "{FENIX_CDN}/js/amplify/1.1.2/amplify.min",
				'highcharts':  "{FENIX_CDN}/js/highcharts/4.0.4/js/highcharts",

				'underscore':  "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
				'handlebars':  "{FENIX_CDN}/js/handlebars/2.0.0/handlebars.min",

				'swiper':      "{FENIX_CDN}/js/swiper/2.7.5/dist/idangerous.swiper.min",
				'bootstrap':   "{FENIX_CDN}/js/bootstrap/3.3.2/js/bootstrap.min",
				'draggabilly': "{FENIX_CDN}/js/draggabilly/dist/draggabilly.pkgd.min",
				'intro':       "{FENIX_CDN}/js/introjs/1.0.0/intro",
				'isotope':     "{FENIX_CDN}/js/isotope/2.1.0/dist/isotope.pkgd.min",
				'jquery':      "{FENIX_CDN}/js/jquery/2.1.1/jquery.min",
				'jqwidgets':   "{FENIX_CDN}/js/jqwidgets/3.1/jqx-light",
				'jstree':      "{FENIX_CDN}/js/jstree/3.0.8/dist/jstree.min",

				//fenix-map-js
				'fenix-map':              "{FENIX_CDN}/fenix/fenix-ui-map/0.0.1/fenix-ui-map.min",
				'fenix-map-config':       "{FENIX_CDN}/fenix/fenix-ui-map/0.0.1/fenix-ui-map-config",
				'chosen':                 "{FENIX_CDN}/js/chosen/1.0.0/chosen.jquery.min",
				'leaflet':                "{FENIX_CDN}/js/leaflet/0.7.3/leaflet",
				'jquery.power.tip':       "{FENIX_CDN}/js/jquery.power.tip/1.1.0/jquery.powertip.min",
				//'jquery-ui':              "{FENIX_CDN}/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min",
				'jquery.hoverIntent':     "{FENIX_CDN}/js/jquery.hoverIntent/1.0/jquery.hoverInten",
				'jquery.i18n.properties': "{FENIX_CDN}/js/jquery/1.0.9/jquery.i18n.properties-min"
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
                    exports: 'amplify'
                },
				'swiper': ['jquery'],
		        'fenix-map': {
		            deps: [
		                'fenix-map-config',
		                'leaflet',		                
		                'jquery',
		                'chosen',
		                //'jquery-ui',
		                'jquery.hoverIntent',
		                'jquery.power.tip',
		                'jquery.i18n.properties'
		            ]
		        }	        
		    }
		}
    });

	//LOAD MENU BEFORE ALL
	require(['src/renderAuthMenu'], function(renderAuthMenu) {

		renderAuthMenu('home');

		require([
		    'jquery', 'underscore', 'bootstrap', 'handlebars', 'swiper', 'leaflet',
		    'config/services'
		], function($,_,bts,Handlebars,Swiper,L,
			Config) {
			
			mapLegendTmpl = Handlebars.compile( $('#home_maps_legend').html() );

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
				}],
				mapsLayerJoins = {
					'afo_footprint': 0,
					'manufacturing_plant': 1,
					'blending_plant': 2
				};


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

			function initSlideMap(id, joinField) {
				return L.map(id, {
					zoom: 3,
					zoomControl: false,
					attributionControl: false,
					center: L.latLng(12,18),
					layers: L.tileLayer( Config.url_baselayer )
				})
				.addControl( L.control.zoom({position:'bottomright'}) )
				.addLayer( getLayerStyled(joinField, mapsLayerJoins[joinField] ) );
			}
/*			swiperMaps.slide1 = L.map('mapSlide1', {
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
*/

			swiperMaps.slide1 = initSlideMap('mapSlide1', 'afo_footprint');
			swiperMaps.slide2 = initSlideMap('mapSlide2', 'manufacturing_plant');
			swiperMaps.slide3 = initSlideMap('mapSlide3', 'blending_plant');

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
				/*,onSlideChangeStart: function(sw) {
					_.once(swiperMaps.slide1 = initSlideMap('mapSlide1', 'afo_footprint')
					console.log('onSlideChangeStart',sw.activeIndex-1);
				}*/
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
					//location.href = $(e.target).attr('href');
					window.open($(e.target).attr('href'),'_blank');
				});			
			/*$('.afo-home-partner-container .nav-tabs .active a').on('click.go', function(e) {
				location.href = $(e.target).data('link');
			});*/
		});
	});
});