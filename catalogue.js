
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

	    'fx-common/js/WDSClient',
	    'src/fxTree',
	    
		'text!html/accordion.html',

		'fenix-map',
		'fenix-map-config'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L,

		Config,
		renderAuthMenu,
		WDSClient,
		fxTree,

		accordion) {

		renderAuthMenu(true);

		var wdsClient = new WDSClient({
			datasource: Config.dbName,
			outputType: 'array'
		});


		var accordionTmpl = Handlebars.compile(accordion);

		DataSelected = [];
		//data selected in jstree

		_.extend(FMCONFIG, {
			BASEURL: 'submodules/fenix-ui-map',
			BASEURL_LANG: 'submodules/fenix-ui-map/dist/i18n/'
		});

		function initListFamilies(fmLayer) {

			wdsClient.retrieve({
				payload: {
					query: Config.queries.fertilizers_tree
				},
				success: function(data) {

					var dataTree = [],
						lastCatCode = '';

					for(var i in data)
						dataTree.push({
							fertilizer_category_code: data[i][0],
							fertilizer_code: data[i][1],
							fertilizer_category_label: data[i][2],
							fertilizer_label: data[i][3]
						});

					dataTree = _.groupBy(dataTree, 'fertilizer_category_code');

					dataTree = _.map(dataTree, function(cat, catName) {
						return {
							id: cat[0].fertilizer_category_code,
							text: cat[0].fertilizer_category_label,
							children: _.map(cat, function(fert) {
								return {
									id: fert.fertilizer_code,
									text: fert.fertilizer_label
								};
							})
						};
					});

                    var treeFamilies = new fxTree('#listFamilies', {
                        labelVal: 'HS Code',
                        labelTxt: 'Product Name',
                        showTxtValRadio: true,
                        showValueInTextMode: true,
                        onChange: function (seldata) {
                        	initMapFamilies(seldata, fmLayer);
                        }
                    }).setData(dataTree);
				}
			});
		}

		function initMapFamilies(ferts, fmLayer) {
			wdsClient.retrieve({
				payload: {
					query: Config.queries.countries_byfertilizers,
					queryVars: {ids: "'"+ferts.join("','")+"'"}
				},
				success: function(data) {

					data = _.map(data, function(val) {
						val[1] = val[1].split('|');
						return val;
					});

					updateLayer(fmLayer, data);
				}
			});
		}

		function initListCountries() {

			wdsClient.retrieve({
				payload: {
					query: Config.queries.countries_withfertizers
				},
				success: function(data) {

					data = _.map(data, function(val) {
						return { id: val[0], text: val[1] };
					});

                    var treeCountries = new fxTree('#listCountries', {
                        labelVal: 'Country Code <small>(GAUL0)</small>',
                        labelTxt: 'Country Name',
                        showTxtValRadio: false,
                        showValueInTextMode: false,
                        onChange: function(seldata) {

							var selected = _.map(seldata, function(val) {
								return _.findWhere(data, {id: val});
							});

							$('#resultsCountries').empty();

							DataSelected = [];
							_.each(selected, function(val) {
								initResultsCountries( val.id, val.text );
							});
						}
					}).setData(data);
				}
			});	
		}

		function initResultsCountries(adm0_code, countryName) {

			wdsClient.retrieve({
				payload: {
					query: Config.queries.fertilizers_bycountry,
					queryVars: {id: adm0_code}
				},
				success: function(data) {

					data = _.sortBy(data, function(val) {
						return val[0];
					});

					$('#resultsCountries').append( accordionTmpl({
						id: adm0_code,
						title: countryName+' ('+data.length+')',
						items: data,
						expand: true
					}) );

					for(var i in data)
						DataSelected.push({
							adm0_code: adm0_code,
							countryName: countryName,
							fertilizer: data[i][0]
						});
				}
			});
		}

	//CROPS
		function initListCrops() {

			wdsClient.retrieve({
				payload: {
					query: Config.queries.crops_withfertizers
				},
				success: function(data) {

					data = _.map(data, function(val) {
						return { id: val[0], text: val[1] };
					});

                    var treeCrops = new fxTree('#listCrops', {
                        labelVal: 'HS Code',
                        labelTxt: 'Crop Name',
                        showTxtValRadio: false,
                        showValueInTextMode: false,
                        onChange: function(seldata) {

							var selected = _.map(seldata, function(val) {
								return _.findWhere(data, {id: val});
							});

							$('#resultsCrops').empty();
							DataSelected = [];
							_.each(selected, function(val) {
								initResultsCrops( val.id, val.text );
							});
						}
					})
					.setData(data);
				}
			});
		}

		function initResultsCrops(cropId, cropName) {

			wdsClient.retrieve({
				payload: {
					query: Config.queries.fertilizers_bycrop,
					queryVars: {id: cropId }
				},
				success: function(data) {	
					if(data.length > 0 ) {
						data = _.sortBy(data, function(val) {
							return val[0];
						});

						$('#resultsCrops').append( accordionTmpl({
							id: cropId,
							title: cropName+' ('+data.length+')',
							items: data,
							expand: data.length > 9
						}) );
						for(var i in data)
							DataSelected.push({
								crop_code: cropId,
								cropName: cropName,
								fertilizer: data[i][0]
							});
					}
				}
			});
		}

		var setLayerStyle = function(ccodes, opacities) {

			var style = '',
				sld = '';
				
			_.each(ccodes, function(val, adm0_code) {
				style += "[adm0_code = '"+adm0_code+"'] { fill: #309000; fill-opacity: "+opacities[adm0_code]+"; stroke: #FFFFFF; }";
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
		};

		var updateLayer = function(fmLayer, codes) {

			var retCodes = {};
			_.each(codes, function(val) {
				if(!retCodes[ val[0] ])
					retCodes[ val[0] ] = '';
				val[1].sort();
				retCodes[ val[0] ] += '&bull; '+val[1].join('<br>&bull; ');
			});

			var opacities = {};
			_.each(codes, function(val) {

				if(!opacities[ val[0] ])
					opacities[ val[0] ]= 0.2;
				
				opacities[ val[0] ]= parseFloat( val[1].length * 0.18 ).toFixed(2);
				opacities[ val[0] ]= Math.min(opacities[val[0]], 1);			
			});
			
			var data = [];
			_.each(retCodes, function(val, key) {
				var o = _.object([key],[val]);
				data.push( o );
			});
			//'[{"TZA":"testtt<br>iuahsiduh"},{"BDI":"11"}]';

			fmLayer.layer.joindata = JSON.stringify(data);

			fmLayer.layer.customgfi = {
				showpopup: true,
				content: {
					en: "<div class='fm-popup'>"+
							"<div class='fm-popup-join-title'>{{"+ fmLayer.layer.joincolumnlabel +"}}</div>"+
							"<div class='fm-popup-join-content'>"+
							"<em>Fertilizers used:</em><br>"+
								"{{{adm0_code}}}"+
							"</div>"+
						"</div>"
				}
			};

			fmLayer.leafletLayer.wmsParams.sld = setLayerStyle(retCodes, opacities);
			fmLayer.leafletLayer.redraw();

			retCodes = _.keys(retCodes);

			fmLayer._fenixmap.zoomTo("country", "adm0_code", retCodes);
		};

		var fmMap = new FM.Map('fertMap', {
			plugins: {
				geosearch: false,
				mouseposition: false,
				controlloading: true,
				zoomControl: 'bottomright'
			},
			guiController: {
				overlay: true,
				baselayer: false,
				wmsLoader: true
			},
			gui: {
				disclaimerfao: true
			},
			usedefaultbaselayers: false
		}, {
			zoomControl: false,
			attributionControl: true
		});
		
		fmMap.map.attributionControl.setPrefix(Config.map_attribution);

		fmMap.createMap(0, 20, 3);

		L.tileLayer(Config.url_baselayer).addTo(fmMap.map);

		var fmLayer = new FM.layer({
			urlWMS: Config.wmsUrl,
			layers: "fenix:"+Config.gaulLayer,
			styles: "none",
			layertitle: "Fertilizers",
			defaultgfi: true,
			opacity: '0.7',		
			lang: "en",
			zindex: 500,
			joincolumn: "adm0_code",
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

		$('#down_selection').on('click', function(e) {
			//$('#down_selection_view').text( JSON.stringify(DataSelected) ).slideDown();
				if(DataSelected.length>0){
			if(DataSelected[0].adm0_code){
			var ret="adm0_code,countryName,fertilizer\n";
			for (i in DataSelected)
			{ret+='"'+DataSelected[i].adm0_code+'","'+DataSelected[i].countryName+'","'+DataSelected[i].fertilizer+'"\n'}
			}
			else if(DataSelected[0].crop_code)
			{
				var ret="crop_code,cropName,fertilizer\n";
			for (i in DataSelected)
			{ret+='"'+DataSelected[i].crop_code+'","'+DataSelected[i].cropName+'","'+DataSelected[i].fertilizer+'"\n'}
			}
		
			   var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var blob = new Blob(["\ufeff", ret], {type: 'text/csv;charset=UTF-8;'});
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "fileName.csv");
            link.style = "visibility:hidden";
        }
        else if (navigator.msSaveBlob) { // IE 10+
            link.addEventListener("click", function(event) {
                var blob = new Blob(["\ufeff", ret], {"type": "text/csv;charset=UTF-8;"});
                navigator.msSaveBlob(blob, "fileName.csv");
            }, false);
        }
			 document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
			}
		})
		initListFamilies(fmLayer);

	});

});