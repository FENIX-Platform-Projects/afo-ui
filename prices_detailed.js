

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
				'text': "//fenixrepo.fao.org/cdn/js/requirejs/plugins/text/2.0.12/text",
				'i18n': "//fenixrepo.fao.org/cdn/js/requirejs/plugins/i18n/2.0.4/i18n",
				'domready': "//fenixrepo.fao.org/cdn/js/requirejs/plugins/domready/2.0.1/domReady",

				'amplify' : "//fenixrepo.fao.org/cdn/js/amplify/1.1.2/amplify.min",
				'highcharts': "//fenixrepo.fao.org/cdn/js/highcharts/4.0.4/js/highcharts",

				'underscore': "//fenixrepo.fao.org/cdn/js/underscore/1.7.0/underscore.min",
				'handlebars': "//fenixrepo.fao.org/cdn/js/handlebars/2.0.0/handlebars",
				//'swag': "//fenixrepo.fao.org/cdn/js/handlebars/swag/0.6.1/lib/swag.min",

				'swiper': "//fenixrepo.fao.org/cdn/js/swiper/2.7.5/dist/idangerous.swiper.min",
				'bootstrap': "//fenixrepo.fao.org/cdn/js/bootstrap/3.3.2/js/bootstrap.min",
				'draggabilly': "//fenixrepo.fao.org/cdn/js/draggabilly/dist/draggabilly.pkgd.min",
				'intro': "//fenixrepo.fao.org/cdn/js/introjs/1.0.0/intro",
				'isotope': "//fenixrepo.fao.org/cdn/js/isotope/2.1.0/dist/isotope.pkgd.min",
				'jquery': "//fenixrepo.fao.org/cdn/js/jquery/2.1.1/jquery.min",
				'jqwidgets': "//fenixrepo.fao.org/cdn/js/jqwidgets/3.1/jqx-light",
				'jstree': "//fenixrepo.fao.org/cdn/js/jstree/3.0.8/dist/jstree.min",

				//fenix-map-js
				'fenix-map': "submodules/fenix-ui-map/dist/fenix-ui-map.min",
				'fenix-map-config': "submodules/fenix-ui-map/dist/fenix-ui-map-config",
				'chosen': "//fenixrepo.fao.org/cdn/js/chosen/1.0.0/chosen.jquery.min",
				'leaflet': "//fenixrepo.fao.org/cdn/js/leaflet/0.7.3/leaflet",
				'leaflet-markercluster': '//fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.markecluster/1.1/leaflet.markercluster',

				'jquery.power.tip': "//fenixrepo.fao.org/cdn/js/jquery.power.tip/1.1.0/jquery.powertip.min",
				'jquery-ui': "//fenixrepo.fao.org/cdn/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min",
				'jquery.hoverIntent': "//fenixrepo.fao.org/cdn/js/jquery.hoverIntent/1.0/jquery.hoverIntent",
				'jquery.i18n.properties': "//fenixrepo.fao.org/cdn/js/jquery/1.0.9/jquery.i18n.properties-min",
				'import-dependencies': "//fenixrepo.fao.org/cdn/js/FENIX/utils/import-dependencies-1.0",

                'jquery.rangeSlider': '//fenixrepo.fao.org/cdn/js/jquery.rangeslider/5.7.0/jQDateRangeSlider-min',
				'moment':             '//fenixrepo.fao.org/cdn/js/moment/2.9.0/moment.min',                
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
                'jquery.rangeSlider': ['jquery', 'jquery-ui'],
		        'underscore': {
		            exports: '_'
		        },
                'amplify': {
                    deps: ['jquery'],
                    exports: 'amplifyjs'
                },
                'swag': ['handlebars'],
                'leaflet-markercluster': ['leaflet'],
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

	//LOAD MENU BEFORE ALL
	require(['src/renderAuthMenu'], function(renderAuthMenu) {

		renderAuthMenu('prices_detailed');

		require([
		    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper', 'leaflet', 'leaflet-markercluster','moment',
		    'config/services',
		    'text!html/table.html',
	        'jquery.rangeSlider',
		], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L,LeafletMarkecluster,moment,
			Config,
			table
			) {

			tableTmpl = Handlebars.compile(table);

			var resumeTmpl = Handlebars.compile('<ul id="afo-resume">{{#each items}}<li><span>{{label}} </span><b>{{value}}</b></li>{{/each}}</ul>');

			$('.footer').load('html/footer.html');
		
	        var listProducts$ = $('#prices_selectProduct'),
	        	rangeMonths$ = $('#prices_rangeMonths'),
	        	Selection = {
					fertilizer_code: '3105300000',
					month_from_yyyymm: '201003',
					month_to_yyyymm: '201501'
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
		
			function formatMonth(date) {
				return [date.slice(0,4),'/',date.slice(4)].join('')
			}

			var map = L.map('prices_retail_map', {
					zoom: 11,
					zoomControl: false,
					scrollWheelZoom: false,
					center: L.latLng(0,0),
					layers: L.tileLayer(Config.url_baselayer)
				}).addControl(L.control.zoom({position:'bottomright'}));

			map.attributionControl.setPrefix(Config.map_attribution);

			var layerRetail = new L.MarkerClusterGroup({
				maxClusterRadius: 30,
			    showCoverageOnHover: false
			});
			layerRetail.addTo(map);

			function updateResume(Selection) {

				var from = Selection.month_from_yyyymm,
					to = Selection.month_to_yyyymm,
					timeRange = formatMonth(from)+' - '+formatMonth(to);

				$('#afo-resume-wrap').html(resumeTmpl({
					items: [{
						label:'Product',
						value: $("#prices_selectProduct option:selected").text()
					},{
						label:'Time Range',
						value: timeRange
					}]
				}));
			}

			function loadMarkers(Selection) {

				getWDS(Config.queries.prices_detailed_local_geofilter, Selection, function(data) {

					layerRetail.clearLayers();

					var popupTmpl = "<div class='fm-popup'>"+
										"<div class='fm-popup-join-title'><b>{title}</b></div>"+
										"<div class='fm-popup-join-content'>"+
											"<i>product name:</i> {fert}<br />"+
											"<i>average price:</i> {val}"+
										"</div>"+
										"</div>";

					for(var i in data) {
						
						data[i][0] = data[i][0].replace('[Town]','');
						data[i][1] = data[i][1].split('|');
						data[i][2] += ' USD/tons';

						L.marker(data[i][1])
							.bindPopup( L.Util.template(popupTmpl, {
								title: data[i][0],
								fert: $("#prices_selectProduct option:selected").text(),
								val: data[i][2]
							}) )
							.addTo(layerRetail);
					}

					map.fitBounds( layerRetail.getBounds().pad(-1.2) );

					loadGrid(Selection);
					updateResume(Selection);
				});
			}

			function loadGrid(Selection) {

				getWDS(Config.queries.prices_detailed_local_grid, Selection, function(data) {


					for(var i in data) {
						data[i][1] = data[i][1].replace('[Town]','');
						data[i][2] += ' USD/tons';
						data[i][4] = formatMonth(data[i][4]);
					}
					
					var table$ = $('#table-result').empty();
					if(data && data.length>0)
						table$.append( tableTmpl({
							headers: ['Country', 'Market', 'Price', 'Type', 'Date'],
							rows: data
						}) );
				});
			}		

/*			rangeMonths$.dateRangeSlider();
			rangeMonths$.dateRangeSlider("option","bounds", {
				min: new Date(2010, 2, 0),
				max: new Date(2015, 4, 0)
			});*/

			rangeMonths$.dateRangeSlider(Config.dateRangeSlider.prices_detaild);

			rangeMonths$.on('valuesChanged', function(e, data) {
				
				var values = data.values,//rangeMonths$.rangeSlider("values"),
					
					minD = new Date(values.min),
					maxD = new Date(values.max),

					minM = minD.getMonth()+1,
					maxM = maxD.getMonth()+1;
				
				var minDate = ""+minD.getFullYear()+(minM<10 ? '0'+minM : minM),
					maxDate = ""+maxD.getFullYear()+(maxM<10 ? '0'+maxM : maxM);

				Selection = {
					fertilizer_code: $("#prices_selectProduct").val(),
					month_from_yyyymm: minDate,
					month_to_yyyymm: maxDate
				};

				loadMarkers(Selection);
			});

			$('input[name=prices_range_radio]').on('click', function (e) {

				var val = parseInt( $(this).val() ),
					max = moment(Config.dateRangeSlider.prices_detaild.bounds.max),
					min = max.subtract(val,'months').toDate();
				rangeMonths$.dateRangeSlider('min', min);
			});//*/

			$("#prices_selectProduct").on('change', function(e) {
				Selection.fertilizer_code = $(e.target).val();
				loadMarkers( Selection );
			});

			getWDS(Config.queries.prices_detailed_products, null, function(products) {
	            for(var r in products)
	                listProducts$.append('<option value="'+products[r][0]+'">'+products[r][1]+'</option>');
			});

	        $('#price_table_download').on('click', function(e) {

				var sqltmpl = _.template(Config.queries.prices_detailed_local_geofilter);
					sql = sqltmpl(Selection),
					query = JSON.stringify({query: sql });
				//.replace(/[']/g,"\'");//.replace(/[']/g,"`");

				$("<form style='display:none;' id='csvFormWithQuotes' name='csvFormWithQuotes'"+
				"method='POST' action='"+Config.wdsUrlExportCsv+"' target='_new'>"+
				"<div><input type='text' value='faostat' name='cssFilename_WQ' id='cssFilename_WQ_csv'/></div>"+
				"<div><input type='text' value='africafertilizer' name='datasource_WQ_csv' id='datasource_WQ_csv'/></div>"+
				"<div><input type='text' value='2' name='decimalNumbers_WQ_csv' id='decimalNumbers_WQ_csv'/></div>"+
				"<div><input type='text' value='.' name='decimalSeparator_WQ_csv' id='decimalSeparator_WQ_csv'/></div>"+
				"<div><input type='text' value=',' name='thousandSeparator_WQ_csv' id='thousandSeparator_WQ_csv'/></div>"+
				"<div><input type='text' value='6' name='valueIndex_WQ_csv' id='valueIndex_WQ_csv'/></div>"+
				"<div><input type='text' value='"+query+"' name='json_WQ_csv' id='json_WQ_csv'/></div>"+
				"<div><input type='text' value='' name='quote_WQ_csv' id='quote_WQ_csv'/></div>"+
				"<div><input type='text' value='' name='title_WQ_csv' id='title_WQ_csv'/></div>"+
				"<div><input type='text' value='' name='subtitle_WQ_csv' id='subtitle_WQ_csv'/></div>"+
				"</form>").insertAfter(this).submit();
			});

			loadMarkers( Selection );

	    });
	});
});