

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

		'text!data/africa_regions_countries.json',
		'text!data/africa.json',

		'fx-menu/start',
		'./scripts/components/AuthenticationManager',

		'amplify',

		'domready!'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L, geojsonDecoder,

		Config,

		Countries,
		Africa,

		TopMenu,
		AuthenticationManager
		) {

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
		Africa = JSON.parse(Africa);

		var listRegions$ = $('#stats_selectRegions'),
			listCountries$ = $('#stats_selectCountries'),
			mapzoomsRegions$ = $('#stats_map_regions').next('.map-zooms'),
			mapzoomsCountries$ = $('#stats_map_countries').next('.map-zooms');

		var style = {
				fill: true, color: '#68AC46', weight: 1, opacity: 1, fillOpacity: 0.4, fillColor: '#6AAC46'
			},
			styleHover = {
				fill: true, color: '#6AAC46', weight: 1, opacity: 1, fillOpacity: 0.8, fillColor: '#6AAC46'
			};

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

		getWDS(Config.queries.regions, null, function(regs) {
			Regions = regs;
			for(var r in regs)
				listRegions$.append('<option value="'+regs[r][0]+'">'+regs[r][1]+'</option>');
		});

		var mapCountries = L.map('stats_map_countries', {
				zoom: 4,
				zoomControl: false,
				attributionControl: false,
				center: L.latLng(20,0),
				layers: L.tileLayer(Config.url_baselayer)
			})
			.addControl(L.control.zoom({position:'bottomright'}))


		var geojsonCountries = L.featureGroup(null, {
			style: function (feature) {
				return style;
			}
		});

		mapzoomsCountries$.on('click','.btn', function(e) {
			var z = parseInt( $(this).data('zoom') );
			mapCountries[ z>0 ? 'zoomIn' : 'zoomOut' ]();
		});

		listRegions$.on('click', 'option', function(e) {

			var regCode = parseInt( $(e.target).attr('value') );

			getWDS(Config.queries.countries_byregion, {id: "'"+regCode+"'"}, function(resp) {

				listCountries$.empty();
				for(var r in resp)
					listCountries$.append('<option value="'+resp[r][0]+'">'+resp[r][1]+'</option>');

				var idsCountries = _.map(resp, function(val) {
					return val[0];
				});

				var sqlTmpl = urlTmpl = _.template(Config.queries.countries_geojson),
					sql = sqlTmpl({ids: idsCountries.join(',') });
				
				var urlTmpl = _.template(Config.url_spatialquery_enc),
					url = urlTmpl({sql: sql });

				$.getJSON(url, function(data) {

					geojsonCountries.clearLayers();
					
					geojsonDecoder.decodeToLayer(data,
						geojsonCountries,
						style,
						function(feature, layer) {
							layer
							.setStyle(style)
							.on("mouseover", function (e) {
								layer.setStyle(styleHover);
							})
							.on("mouseout", function (e) {
								layer.setStyle(style); 
							})
							.on("click", function (e) {
								listCountries$.find("option:selected").removeAttr("selected");								
								$('#stats_selected_countries').text( feature.properties.prop2 );
							});
						}
					);
					var bb = geojsonCountries.getBounds();
					mapCountries.fitBounds( bb.pad(-0.8) );
					geojsonCountries.addTo(mapCountries);
				});

			});

		});

		listCountries$.on('click', 'option', function(e) {
			e.preventDefault();
			$('#stats_selected_countries').text( $(e.target).text() );
		});

		$('#stats_map_countries').on('click','.popupCountry', function(e) {
			e.preventDefault();
			listCountries$.find("option:selected").removeAttr("selected");
			$('#stats_selected_countries').text( $(e.currentTarget).data('name') );
		});

		$('.footer').load('html/footer.html');		
	});

});
