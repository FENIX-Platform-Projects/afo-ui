

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
		'text!html/accordion.html',

		'fx-menu/start',
        './scripts/components/AuthenticationManager',

		'fenix-map',
		'fenix-map-config',

        'amplify',

		'domready!'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L,
		Config,
		accordion,

		TopMenu,
		AuthenticationManager
		) {

		Config = JSON.parse(Config);

        new TopMenu({
            active: 'catalogue',        	
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

	accordionTmpl = Handlebars.compile(accordion);

	_.extend(FMCONFIG, {
		BASEURL: 'submodules/fenix-map-js',
		BASEURL_LANG: 'submodules/fenix-map-js/dist/I18N/'
	});

	function initListFamilies(fmLayer) {

		$('#listFamilies').jstree({
			core: {
				data: {
					url: 'data/fertilizers_families.json'
				},
				themes: {
					icons: false
				}
			},
			"plugins": ["checkbox", "wholerow"]
		}).on('changed.jstree', function (e, data) {
			e.preventDefault();
			
			console.log( data.selected );

			initMapFamilies( data.selected, fmLayer );
		});
	}

	function initMapFamilies(ferts, fmLayer) {

		ferts = $.isArray(ferts) ? ferts : [ferts];

		var data = {
			datasource: Config.dbName,
			thousandSeparator: ',',
			decimalSeparator: '.',
			decimalNumbers: 2,
			cssFilename: '',
			nowrap: false,
			valuesIndex: 0,
			json: JSON.stringify({
				query: Config.queries.countries_groups
			})
		};
'"+ ferts.join("','") +"'

		$.ajax({
			url: Config.wdsUrl,
			data: data,			
			type: 'POST',
			dataType: 'JSON',
			success: function(resp) {

				console.log(resp);

				updateLayer(fmLayer, resp);

				//initChartFamilies(resp);
			}
		});
	}
/*
	function initChartFamilies(resp) {

		var retCodes = {};
		_.each(resp, function(val) {
			if(!retCodes[ val[0] ])
				retCodes[ val[0] ] = 1;
		});

		var ferts = {};
		_.each(resp, function(val) {
			if(!ferts[ val[1] ])
				ferts[ val[1] ] = 1;
		});
		
		var opacities = {};
		_.each(resp, function(val) {
			if(!opacities[ val[0] ])
				opacities[ val[0] ]= 0;
			
			opacities[ val[0] ]+= 1;
			//opacities[ val[0] ]= parseFloat( opacities[ val[0] ].toFixed(2) );
			//opacities[ val[0] ]= opacities[val[0]]>1 ? 1 : opacities[val[0]];
		});
	}
//COUNTRIES*/

	function initListCountries() {

		var countriesData = [];

		$.ajax({
			url: 'data/countries_iso3_afo.json',
			dataType: "json",
			async: false,
			success: function(json) {
				countriesData = json;
			}
		});

		$('#listCountries').jstree({
			core: {
				themes: { icons: false },
				data: countriesData
			},
            plugins: ["checkbox", "wholerow"],
			checkbox: {
				keep_selected_style: false
			}
		}).on('changed.jstree', function (e, data) {
			e.preventDefault();

			var res = _.map(data.selected, function(val) {
				return _.findWhere(countriesData, {id: val});
			});

			$('#resultsCountries').empty();
			_.each(res, function(val) {
				initResultsCountries( val.id, val.text );
			});

			$('#resultsCountries .collapse').collapse();
		});
	}

	function initResultsCountries(countryIso3, countryName) {

		var data = {
				datasource: Config.dbName,
				thousandSeparator: ',',
				decimalSeparator: '.',
				decimalNumbers: 2,
				cssFilename: '',
				nowrap: false,
				valuesIndex: 0,
				json: JSON.stringify({
					query: "SELECT name "+
						"FROM countries "+
						"WHERE country = '"+countryIso3+"' AND value=1 GROUP BY name"
				})
			};

			$.ajax({
				data: data,
				type: 'POST',
				url: Config.wdsUrl,				
				success: function(resp) {

					$('#resultsCountries').append(accordionTmpl({
						id: countryIso3,
						title: countryName,
						items: resp,
						caret: resp.length > 9
					}));
				}
			});
	}

//CROPS

	function initListCrops() {

		var cropsData = [];

		$.ajax({
			url: 'data/crops.json',
			dataType: "json",
			async: false,
			success: function(json) {
				cropsData = json;
			}
		});

		$('#listCrops').jstree({
			core: {
				themes: { icons: false },
				data: cropsData
			},
			plugins: ["checkbox", "wholerow"],
			checkbox: {
				keep_selected_style: false
			}
		}).on('changed.jstree', function (e, data) {
			e.preventDefault();

			$('#resultsCrops').empty();
			_.each(data.selected, function(val) {
				initResultsCrops( val, val);
			});
		});
	}

	function initResultsCrops(cropId, cropName) {

		var data = {
				datasource: Config.dbName,
				thousandSeparator: ',',
				decimalSeparator: '.',
				decimalNumbers: 2,
				cssFilename: '',
				nowrap: false,
				valuesIndex: 0,
				json: JSON.stringify({
					query: "SELECT DISTINCT name "+
						"FROM fertilizers_crops_faostatcodes "+
						"WHERE crop = '"+cropId+"' "
						//TODO use LIKE
				})
			};

			$.ajax({
				data: data,
				type: 'POST',
				url: Config.wdsUrl,
				success: function(resp) {

/*					$('#resultsCrops').append('<dt>'+cropName+'</dt>');
					_.each(resp, function(val) {
						$('#resultsCrops').append('<dd>&bull; '+val+'</dd>');
						//TODO add countries
					});*/
					$('#resultsCrops').append(accordionTmpl({
						id: cropId,
						title: cropName,
						items: resp,
						caret: resp.length > 9
					}));			
				}
			});
	}

	var setLayerStyle = function(ccodes, opacities) {

		var style = '',
			sld = '';
		_.each(ccodes, function(val, iso3) {
			style += "[iso3 = '"+iso3+"'] { fill: #309000; fill-opacity: "+opacities[iso3]+"; stroke: #FFFFFF; }";
		});

		$.ajax({
			url: Config.sldUrl,
			data: {
				stylename: "fenix:gaul0_faostat_3857",
				style: style
			},
			async: false,
			type: 'POST',
			success: function(response) {
				sld = response;
			}
		});
		return sld;
	};

	var updateLayer = function(fmLayer, codes) {

		var retCodes = {};
		_.each(codes, function(val) {
			if(!retCodes[ val[0] ])
				retCodes[ val[0] ] = '';
			
			retCodes[ val[0] ] += '<b>&bull; '+val[1]+'</b><br>';
		});

		var opacities = {};
		_.each(codes, function(val) {
			if(!opacities[ val[0] ])
				opacities[ val[0] ]= 0.2;
			
			opacities[ val[0] ]+= 0.18;
			
			opacities[ val[0] ]= parseFloat( opacities[ val[0] ].toFixed(2) );
			opacities[ val[0] ]= opacities[val[0]]>1 ? 1 : opacities[val[0]];
		});

		var data = [];
		_.each(retCodes, function(val, key) {
			var o = _.object([key],[val]);
			data.push( o );
		});

		fmLayer.layer.joindata = JSON.stringify(data);//'[{"TZA":"testtt<br>iuahsiduh"},{"BDI":"11"}]';

		fmLayer.layer.customgfi = {
			showpopup: true,
			content: {
				en: "<div class='fm-popup'>"+
						"<div class='fm-popup-join-title'>{{"+ fmLayer.layer.joincolumnlabel +"}}</div>"+
						"<div class='fm-popup-join-content'>"+
						"<em>Fertilizers:</em><br>"+
							"{{{iso3}}}"+
						"</div>"+
					"</div>"
			}
		};

		fmLayer.leafletLayer.wmsParams.sld = setLayerStyle(retCodes, opacities);
		fmLayer.leafletLayer.redraw();

		retCodes = _.keys(retCodes);

		fmLayer._fenixmap.zoomTo("country", "iso3", retCodes);
		//TODO convert from iso3 to gaul code(adm0_code)
	};

	var fmMap = new FM.Map('fertMap', {
		plugins: {
			geosearch: false,
			mouseposition: false,
			controlloading: true,
			zoomControl: 'bottomright'
		},
		guiController: {
			overlay : true,
			baselayer: true,
			wmsLoader: true
		},
		gui: {
			disclaimerfao: true
		}
	}, {
		zoomControl: false,
		attributionControl: false
	});

	window.fmMap = fmMap;

	fmMap.createMap();

	fmMap.addLayer( new FM.layer({
		urlWMS: Config.wmsUrl,
		//hideLayerInControllerList: true,
		layers: "fenix:gaul0_line_3857",
		layertitle: "Boundaries",
		styles: "gaul0_line",
		opacity: "0.7",
		zindex: 600
	}) );

	var fmLayer = new FM.layer({
		urlWMS: Config.wmsUrl,
		layers: "fenix:gaul0_faostat_3857",
		layertitle: "Fertilizers",
		defaultgfi: true,
		opacity: '0.7',		
		lang: "en",
		zindex: 500,
		joincolumn: "iso3",
		joincolumnlabel: "areanamee",
		customgfi: {
			showpopup: true,
			content: {
				en: "<div class='fm-popup'>"+
						"<div class='fm-popup-join-title'></div>"+
						"<div class='fm-popup-join-content'><i></i></div>"+
					"</div>"
			}
		}
	});

	fmMap.addLayer(fmLayer);

	$('#catalogue_tabs').find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

		switch($(e.target).attr('href'))
		{
			case '#families':
				initListFamilies(fmLayer);
			break;
			case '#countries':
				initListCountries();
			break;
			case '#crops':
				initListCrops();
			break;
		}
	});

	initListFamilies(fmLayer);

	$('.footer').load('html/footer.html');

	});


});