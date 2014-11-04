
require.config({

<<<<<<< HEAD
	baseUrl: '../src/',

	paths: {
		'i18n'                  :'lib/i18n',
		'text'                  :'lib/text',
		'domready'              :'lib/domready',
		'bootstrap'             :'lib/bootstrap',	
		//'backbone'              :'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
		'highcharts'            :'//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts',
		//'highcharts_exporting'  :'//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/modules/exporting',
		//'highcharts-heatmap'    :'http://code.highcharts.com/maps/modules/heatmap',
		//'highcharts-data'       :'http://code.highcharts.com/maps/modules/data',
		'jquery'                :'lib/jquery',
		'underscore'            :'lib/underscore',
		'jstree'                :'lib/jstree/jstree.min',

		//fenix-map-js
		'fenix-map'             :'fenix_modules/fenix-map-js/fenix-map-min',
		'fenix-map-config'      :'fenix_modules/fenix-map-js/fenix-map-config',		
		'chosen'                :'//fenixapps.fao.org/repository/js/chosen/1.0.0/chosen.jquery.min',		
		'leaflet'               :'//fenixapps.fao.org/repository/js/leaflet/0.7.3/leaflet',	    
		'import-dependencies'   :'//fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0',
		'jquery.power.tip'      :'//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min',
		'jquery-ui'             :'//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
		'jquery.i18n.properties':'//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min',
		'jquery.hoverIntent'    :'//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent'
	},

	shim: {
		'bootstrap' : ['jquery'],
		'chosen'    : ['jquery'],
		'highcharts': ['jquery'],
		'jstree'    : ['jquery'],
		'jquery-ui'             : ['jquery'],
		'jquery.power.tip'      : ['jquery'],
		'jquery.i18n.properties': ['jquery'],
		'jquery.hoverIntent'    : ['jquery'],
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
	'jquery','underscore','bootstrap','highcharts','jstree',
	'fenix-map','text!../config/catalogue-map.json',
	'domready!'
	], function($,_,bts,highcharts,jstree,
	FenixMap, mapConf) {

	mapConf = JSON.parse(mapConf);

	_.extend(FMCONFIG, {
		BASEURL: '../src/fenix_modules/fenix-map-js',
		BASEURL_LANG: '../src/fenix_modules/fenix-map-js/I18N/'
	});

	function initListFamilies(fert) {

		$('#listFamilies').jstree({
			core: {
				data: {
					url: '../data_tools/fertilizers_families.json'
				},
				themes: {
					icons: false
				}				
			},
			plugins: ['checkbox'],
			checkbox: {
				keep_selected_style: false
			}
		}).on('changed.jstree', function (e, data) {
			e.preventDefault();
			initMapFamilies( data.selected );
		});
	}

	function initMapFamilies(ferts) {

		ferts = $.isArray(ferts) ? ferts : [ferts];

		var data = {
			datasource: mapConf.dbName,
			thousandSeparator: ',',
			decimalSeparator: '.',
			decimalNumbers: 2,
			cssFilename: '',
			nowrap: false,
			valuesIndex: 0,
			json: JSON.stringify({
				query:
					"SELECT country, name "+
					"FROM countries "+
					"WHERE value = 1 AND name IN ('"+ ferts.join("','") +"') "
			})
		};

		$.ajax({
			url: mapConf.wdsUrl,
			data: data,			
			type: 'POST',
			dataType: 'JSON',
			success: function(resp) {

				updateLayer(fmLayer, resp);
				initChartFamilies(resp);
			}
		});
	}

	function initChartFamilies(resp) {

		console.log('initChartFamilies',resp);

		var ccodes = {};
		_.each(resp, function(val) {
			if(!ccodes[ val[0] ])
				ccodes[ val[0] ] = 1;
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

		console.log('opacities',opacities);

		$('#chartFamilies').highcharts({
			chart: { type: 'column' },
			title: { text: 'Fertilizers for Country' },
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: false,
						color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
						style: {
							textShadow: '0 0 3px black, 0 0 3px black'
						}
					}
				}
			},
			yAxis: {
				min: 0,
				title: { text: 'Fertilizers in country' },
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: 'bold',
						color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
					}
				}
			},
			xAxis: {
				//categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
				categories: _.keys(ferts)
			},
			series: _.map(ccodes, function(val) {
				return {
					name: val,
					data: _.map(ccodes, function (val,code) {

					})
				};
			})
		});
	}
//COUNTRIES

	function initListCountries() {
=======
	var conf = {
			wdsUrl: 'http://faostat3.fao.org/wds/rest/table/json',
			mapUrl: 'http://fenixapps.fao.org/maps-africaferilizers/api?',			
			dbName: 'africafertilizer',
			colorBounds: '298A08'
		};

	function init() {

		initLogin();

		$('.nav-tabs')
		.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			switch($(e.target).attr('href'))
			{
				case '#families':
					initListFamilies('Agric Lime');
					initMapFamilies('Agric Lime');
				break;
				case '#countries':
					initListCountries('BEN');
					//initMapCountries();
					initResultsCountries('BEN','Benin');
				break;
				case '#crops':
					initListCrops('Beans');
					//initMapCrops('Beans');
					initResultsCrops('Beans');
				break;
			}
		});

		initListFamilies('Agric Lime');
		initMapFamilies('Agric Lime');
	};

	function initLogin() {
		$('.protected').hide();
		$('.btn-login').on('click', function() {
			$('.protected').show();
		});
	}

//FAMILIES

	function initListFamilies(fert) {

		$.getJSON('../data_tools/fertilizers.json', function(families) {

			var sel = false,
				lastInit = '';

			//$('#listFamilies').append('<optgroup>');

			for(var i in families) {
				sel = families[i]===fert ? 'selected="selected"':'';

				if(families[i].split(' ').length>2 && families[i].split(' ')[0]!==lastInit)
					$('#listFamilies').append('<optgroup label="'+lastInit+'"></optgroup>');
				
				$('#listFamilies').append('<option '+sel+' value="'+families[i]+'">'+families[i]+'</option>');

				lastInit = families[i].split(' ')[0];
			}

			//$('#listFamilies').append('</optgroup>');

			$('#listFamilies').on('change', function() {
				initMapFamilies( $(this).val() );
			});
		});
	}

	function initMapFamilies(ferts) {

		var data = {
			datasource: conf.dbName,
			thousandSeparator: ',',
			decimalSeparator: '.',
			decimalNumbers: 2,
			cssFilename: '',
			nowrap: false,
			valuesIndex: 0,
			json: JSON.stringify({
				query: "SELECT country,name "+
					"FROM countries "+
					"WHERE name IN ('"+ ferts.join("','") +"') AND value=1"
			})
		};

		$.ajax({
			type: 'POST',
			url: conf.wdsUrl,
			data: data,
			success: function (resp) {

				var ccodes = _.map(resp, function(val) {
					return "("+val[0]+",1)";
				});

				$('#familiesMap').attr({ src:
					conf.mapUrl+
					"baselayers=mapquest&layers=gaul0_faostat_3857&styles=join&joincolumn=iso3_code"+
					"&lat=0&lon=20&zoom=4&lang=E&"+
					"&joindata=["+ccodes.join(',')+"]"+  //[(EGY,1),(GHA,0),(NGR,1),(MOZ,1)]
					"&enablejoingfi=true&legendtitle=Fertilizers Distribution&"+
					"mu=<b>"+ferts.join('</b><br><b>')+"</b>&"+
					"colors="+conf.colorBounds+",ffffff&"+
					//"colorramp=Greens&"+
					"ranges=10&classification=custom"
				});
			}
		});
	}

//COUNTRIES

	function initListCountries(country) {

		$.getJSON('../data_tools/countries_iso3.json', function(countries) {

			var AFO_country = [
			"BDI","BEN","BFA","CIV","CMR","COD","ETH",
			"GHA","GNB","KEN","MDG","MLI","MOZ","UGA",
			"MWI","NER","NGA","RWA","SEN","TGO","TZA","ZMB"
			//"EGY","MRT","DZA","GNQ","LBR","SYC","ZWE","SDN"
			];

			var sel = false;
			for(var i in countries) {
				sel = countries[i].iso3===country ? 'selected="selected"':'';
				if(_.contains(AFO_country, countries[i].iso3))
					$('#listCountries').append('<option '+sel+' value="'+countries[i].iso3+'">'+countries[i].name+'</option>');
			}

			$('#listCountries').on('click', 'option', _.debounce(function(e) {

				console.log('click');

				$('#resultsCountries').empty().append('<a class="close pull-right" href="#">&#x274C;</a>');
				$('#listCountries').find(':selected').each(function(i) {
					initResultsCountries( $(this).val(), $(this).text() );
				});

				//var label = $('#listCountries option:selected').text();
				//initResultsCountries( $(this).val()[0], label);
			},100) );

			$('#resultsCountries').on('click','.close', function(e) {
				e.preventDefault();
				$('#listCountries').removeAttr('selected');
				$('#resultsCountries').empty();
			});
		});
	}

	function initResultsCountries(countryIso3, countryName) {

		console.log(countryIso3, countryName);

		var data = {
				datasource: conf.dbName,
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
				url: conf.wdsUrl,				
				success: function (resp) {

					$('#resultsCountries').append('<dt><h2>Fertilizers in <b>'+countryName+'</b></h2></dt>');
					_.each(resp, function(val) {
						$('#resultsCountries').append('<dd>&bull; '+val+'</dd>');
					});
				}
			});
	}

//CROPS

	function initListCrops(crop) {

		$.getJSON('../data_tools/crops.json', function(crops) {

			var sel = false;
			for(var i in crops) {
				sel = crops[i]===crop ? 'selected="selected"':'';
				$('#listCrops').append('<option '+sel+' value="'+crops[i]+'">'+crops[i]+'</option>');
			}

/*			$('#listCrops').on('change', function(e) {
				initResultsCrops( $(this).val()[0] );
			});*/

			$('#listCrops').on('click', 'option', _.debounce(function(e) {

				console.log('click');

				$('#resultsCrops').empty().append('<a class="close pull-right" href="#">&#x274C;</a>');
				$('#listCrops').find(':selected').each(function(i) {
					initResultsCrops( $(this).val(), $(this).text() );
				});

				//var label = $('#listCrops option:selected').text();
				//initResultsCountries( $(this).val()[0], label);
			},100) );

			$('#resultsCrops').on('click','.close', function(e) {
				e.preventDefault();
				$('#listCrops').removeAttr('selected');
				$('#resultsCrops').empty();
			});
		});
	}

	function initResultsCrops(crop) {

		var data = {
				datasource: conf.dbName,
				thousandSeparator: ',',
				decimalSeparator: '.',
				decimalNumbers: 2,
				cssFilename: '',
				nowrap: false,
				valuesIndex: 0,
				json: JSON.stringify({
					query: "SELECT DISTINCT name "+
						"FROM fertilizers_crops_faostatcodes "+
						"WHERE crop = '"+crop+"' "
				})
			};

			$.ajax({
				data: data,
				type: 'POST',
				url: conf.wdsUrl,
				success: function (resp) {
					$('#resultsCrops').append('<dt><h2>Fertilizers for <b>'+crop+'</b></h2></dt>');
					_.each(resp, function(val) {
						$('#resultsCrops').append('<dd>&bull; '+val+'</dd>');
						//TODO add countries
					});
					
				}
			});
	}

	function initMapCrops(crop) {

		var data = {
				datasource: conf.dbName,
				thousandSeparator: ',',
				decimalSeparator: '.',
				decimalNumbers: 2,
				cssFilename: '',
				nowrap: false,
				valuesIndex: 0,
				json: JSON.stringify({
					query: "SELECT countries.country "+
						"FROM fertilizers_crops_faostatcodes ferts, countries "+
						"WHERE countries.name = ferts.name AND ferts.crop = '"+crop+"'"
				})			
			};

			$.ajax({
				type:   'POST',
				url:conf.wdsUrl,
				data:   data,
				success: function (resp) {

					var ccodes = _.map(resp, function(val) {
					  return "("+val[0]+",1)";
					}).join(',');

					$('#cropsMap').attr({src: "http://fenixapps.fao.org/maps/api?"+
						"baselayers=mapquest&layers=gaul0_faostat_3857&styles=join&joincolumn=iso3_code"+
						"&lat=0&lon=20&zoom=4"+
						"&joindata=["+ccodes+"]"+  //[(EGY,1),(GHA,0),(NGR,1),(MOZ,1)]
						"&enablejoingfi=true&legendtitle=Fertilizer Distribution&mu="+crop+"&lang=E&colors=238B45,ffffff&ranges=1&classification=custom"
					});
				}
			});
	}	
>>>>>>> 321d7af2f574237d56f329de07daedf79dbe7d86

		var countriesData = [];

		$.ajax({
			url: '../data_tools/countries_iso3_afo.json',
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
			plugins: ['checkbox'],
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
		});
	}

	function initResultsCountries(countryIso3, countryName) {

		var data = {
				datasource: mapConf.dbName,
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
				url: mapConf.wdsUrl,				
				success: function(resp) {

					$('#resultsCountries').append('<dt>'+countryName+'</dt>');
					_.each(resp, function(val) {
						$('#resultsCountries').append('<dd>&bull; '+val+'</dd>');
					});
				}
			});
	}

//CROPS

	function initListCrops() {

		var cropsData = [];

		$.ajax({
			url: '../data_tools/crops.json',
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
			plugins: ['checkbox'],
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
				datasource: mapConf.dbName,
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
				url: mapConf.wdsUrl,
				success: function(resp) {

					$('#resultsCrops').append('<dt>'+cropName+'</dt>');
					_.each(resp, function(val) {
						$('#resultsCrops').append('<dd>&bull; '+val+'</dd>');
						//TODO add countries
					});
				}
			});
	}

	var zoomToCountries = function(fmMap, codes) {
		// http://127.0.0.1:5005/spatialquery/db/spatial/SELECT%20ST_AsGeoJSON%28ST_Extent%28geom%29%29%20from%20spatial.gaul1_3857%20where%20adm1_code%20IN%20%2870073,70075,1503,1489,1506,1502,1485,1507,1498,1492,70072,1495,1501,1487,70074,1493,70080,1494,1509,1511,70081,70082,1505,1491,1504,1490,70079,1508,70077,70078,70076,1500%29
		// TODO: POST and not GET
		var query = "SELECT ST_AsGeoJSON(ST_Transform(ST_SetSRID(ST_Extent(geom), 3857), 4326)) "+
					"FROM spatial.gaul0_faostat3_3857 "+
					"WHERE iso3 IN ('"+ codes.join("','") +"')",
			url = mapConf.url_spatialquery + encodeURIComponent(query);

		$.getJSON(url, function(json) {

			json = $.parseJSON(json[0][0]);

			if(json)
			{
				var coords = json.coordinates,
					minlat = coords[0][0][1],
					minlon = coords[0][0][0],
					maxlat = coords[0][1][1],
					maxlon = coords[0][2][0];

				fmMap.map.fitBounds([
					[minlat, minlon],
					[maxlat, maxlon]
				]);
			}
		});
	};

	var setLayerStyle = function(fmLayer, ccodes, opacities) {

		var style = '';
		_.each(ccodes, function(val, iso3) {
			style += "[iso3 = '"+iso3+"'] { fill: #309000; fill-opacity: "+opacities[iso3]+"; stroke: #FFFFFF; }";
		});

		var data = {
			stylename: fmLayer.layer.layers,
			style: style
		};
	
		$.ajax({
			url: mapConf.sldUrl,
			data: data,	
			async: false,
			type: 'POST',
			success: function(response) {
				fmLayer.leafletLayer.wmsParams.sld = response;
			}
		});
	};

	var updateLayer = function(fmLayer, resp) {
		//resp:
		/*[
			["TZA","Agric Lime"],
			["UGA","Agric Lime"],
			["BDI","Borax"],
			["TZA","Borax"]
		]*/

		var ccodes = {};
		_.each(resp, function(val) {
			if(!ccodes[ val[0] ])
				ccodes[ val[0] ] = '';
			
			ccodes[ val[0] ] += '<b>&bull; '+val[1]+'</b><br>';
		});

		var opacities = {};
		_.each(resp, function(val) {
			if(!opacities[ val[0] ])
				opacities[ val[0] ]= 0.2;
			
			opacities[ val[0] ]+= 0.18;
			
			opacities[ val[0] ]= parseFloat( opacities[ val[0] ].toFixed(2) );
			opacities[ val[0] ]= opacities[val[0]]>1 ? 1 : opacities[val[0]];
			console.log( opacities[ val[0] ] );
		});

		console.log('resp opacities',resp,opacities);

		var data = [];
		_.each(ccodes, function(val, key) {
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

		setLayerStyle(fmLayer, ccodes, opacities);
		
		fmLayer.leafletLayer.redraw();

		zoomToCountries(fmMap, _.keys(ccodes));
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

	fmMap.createMap();

	fmMap.addLayer( new FM.layer({
		urlWMS: mapConf.wmsUrl,
		//hideLayerInControllerList: true,
		layers: "fenix:gaul0_line_3857",
		layertitle: "Boundaries",
		styles: "gaul0_line",
		opacity: "0.7",
		zindex: 600
	}) );

	var fmLayer = new FM.layer({
		urlWMS: mapConf.wmsUrl,
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
				initListFamilies();
			break;
			case '#countries':
				initListCountries();
			break;
			case '#crops':
				initListCrops();
			break;
		}
	});

	initListFamilies();

});
