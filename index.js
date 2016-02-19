
require([
    "config/paths",
    "submodules/fenix-ui-menu/js/paths",
    "submodules/fenix-ui-common/js/Compiler"    
], function(Paths, menuConfig, Compiler) {

    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Compiler.resolve([menuConfig], {
        placeholders : {
            FENIX_CDN: Paths.FENIX_CDN
        },
        config: Paths
    });

	require([
	    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper', 'leaflet',
	    'config/services',
	    'src/renderAuthMenu',
		'fx-common/js/WDSClient'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L,

		Config,
		renderAuthMenu,
		WDSClient
	) {

		renderAuthMenu('home');


		var mapLegendTmpl = Handlebars.compile( $('#home_maps_legend').html() );

		var wdsClient = new WDSClient({
			datasource: Config.dbName,
			outputType: 'array'
		});

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
		
			wdsClient.retrieve({
				payload: {
					query: Config.queries.home_maps_filter,
					queryVars: {field: field }
				},
				success: function(data) {
					var ccodes = {}, val;

					for(var i in data)
						ccodes[ data[i][0] ] = data[i][1];

					countriesLayer.wmsParams.sld = setLayerStyle(ccodes, indexMap);
					countriesLayer.redraw();
				}
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