

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
				'leaflet.encoded': "//fenixapps.fao.org/repository/js/leaflet/plugins/leaflet.encoded/0.0.5/Polyline.encoded",
				'geojson_decoder': "src/geojson_decoder",

				'jquery.power.tip': "//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min",
				'jquery-ui': "//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min",
				'jquery.hoverIntent': "//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent",
				'jquery.i18n.properties': "//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min",
				'import-dependencies': "//fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0"
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
                'geojson_decoder': ['leaflet','leaflet.encoded'],
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
		                'fenix-map-config',
		                'geojson_decoder'
		            ]
		        }	        
		    }
		}
    });

	require([
	    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper', 'leaflet','geojson_decoder',
	    'text!config/services.json',

        'text!data/africa_regions.json',
        'text!data/africa_regions_countries.json',        
        'text!data/africa.json',

		'fx-menu/start',
        './scripts/components/AuthenticationManager',

        'amplify',

		'domready!'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L, geojsonDecoder,

		Config,

		Regions,
		Countries,
		Africa,

		TopMenu,
		AuthenticationManager
		) {

/*		_.templateSettings = {
		  interpolate: /\{\{(.+?)\}\}/g
		};*/

		Config = JSON.parse(Config);

        new TopMenu({
            active: 'statistics',        	
            url: 'config/fenix-ui-menu.json',
            className : 'fx-top-menu',
            breadcrumb : {
                active : true,
                container : "#breadcumb_container",
                showHome : true
            }
        });

        new AuthenticationManager();
        amplify.subscribe('login', function (user) {
            console.warn("Event login intercepted");
            console.log(amplify.store.sessionStorage('afo.security.user'));
        });

		Countries = JSON.parse(Countries);
		Regions = JSON.parse(Regions);
		Africa = JSON.parse(Africa);

		var listRegions$ = $('#stats_select .stats_list_regions'),
			listCountries$ = $('#stats_select .stats_list_countries'),
			mapzoomsRegions$ = $('#stats_map_regions').next('.map-zooms'),
			mapzoomsCountries$ = $('#stats_map_countries').next('.map-zooms');

		var style = {
				fill: true,
				color: '#6AAC46',
				weight: 1,
				opacity: 1,
				fillOpacity: 0.4,
				fillColor: '#6AAC46'
			},
			styleHover = {
				fill: true,
				color: '#6AAC46',
				weight: 1,
				opacity: 1,
				fillOpacity: 0.6,
				fillColor: '#6AAC46'
			};

		for(var r in Regions)
			listRegions$.append('<option value="'+Regions[r][0]+'">'+Regions[r][1]+'</option>');

		for(var c in Countries)
			listCountries$.append('<option value="'+Countries[c][1]+'">'+Countries[c][2]+'</option>');

		var mapCountries = L.map('stats_map_countries', {
				zoom: 4,
				zoomControl: false,
				attributionControl: false,
				center: L.latLng(20,0),
				layers: L.tileLayer(Config.url_baselayer)
			});

		var geojsonCountries = L.geoJson(null, {
			style: function (feature) {
				return style;
			},
			onEachFeature: function(feature, layer) {

				layer.setStyle(style);

				layer.on("mouseover", function (e) {
					layer.setStyle(styleHover);
				});

				layer.on("mouseout", function (e) {
					layer.setStyle(style); 
				});

				layer.on("click", function (e) {
					console.log( layer.properties );
				});
			}
		}).addTo(mapCountries);

		var zoomToCountries = function(fmMap, codes) {
			var query = "SELECT ST_AsGeoJSON(ST_Transform(ST_SetSRID(ST_Extent(geom), 3857), 4326)) "+
						"FROM spatial.gaul0_faostat3_3857 "+
						"WHERE iso3 IN ('"+ codes.join("','") +"')",

				url = mapConf.url_bbox +'iso3/'+ encodeURIComponent(codes.join());

			$.getJSON(url, function(json) {
				
				geojsonCountries.fitBounds(json);

			});
		};

		var geomCountries = function(codes) {

			var query = "SELECT ST_AsGeoJSON(ST_Transform(ST_SetSRID(geom, 3857), 4326)) "+
						"FROM spatial.gaul0_faostat3_3857 "+
						"WHERE faost_code IN ("+ codes.join(',') +")",

				url = Config.url_spatialquery + encodeURIComponent(query);


			$.getJSON(url, function(json) {
				geojsonCountries.fitBounds(json);

			});

			$.getJSON(url, function(json) {

				var geom = JSON.parse(json[0][0]);

				geojsonCountries.clearLayers().addData( geom );

				mapCountries.fitBounds( geojsonCountries.getBounds() );

			});
		};

		var geomRegions = function(regCode) {

			regCode = parseInt(regCode);

			codes = _.filter(Countries, function(v) {
				return v[0] === regCode;
			});

			codes = _.map(codes, function(v) {
				return v[1];
			});

			var url = Config.url_spatialquery + Config.queries.countries_geojson +
					encodeURIComponent( "("+codes.join(",")+")" );

			$.getJSON(url, function(json) {

				var geom = JSON.parse(json[0][0]);

				geojsonRegions.clearLayers().addData( geom );

			});
		};

		mapzoomsCountries$.on('click','.btn', function(e) {
			var z = parseInt($(this).data('zoom'));
			mapCountries[ z>0 ? 'zoomIn' : 'zoomOut' ]();
		});

		listRegions$.on('click', 'option', function(e) {

			var regCode = $(e.target).attr('value');
			
			//geomRegions(regCode);

var service = "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/query/"
var url = service += "SELECT ST_AsGeoJSON(geom), adm0_code, areanamee FROM spatial.gaul0_faostat3_4326 WHERE adm0_code IN (1,2)?geojsonEncoding=True"

// Add neighbourhood geojson (encoded) file to map.
$.getJSON(url, function (data) {
    //console.log(data);
    geojsonDecoder.decodeToMap(data, mapCountries);
});

		});

		listCountries$.on('click', 'option', function(e) {

			var code = $(e.target).attr('value');
			
			geomCountries([code]);

		});


		$('.footer').load('html/footer.html');		
	});

});
