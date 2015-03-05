

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
				//'swag': "//fenixapps.fao.org/repository/js/handlebars/swag/0.6.1/lib/swag.min",

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
				'leaflet-markercluster': '//fenixapps.fao.org/repository/js/leaflet/plugins/leaflet.markecluster/1.1/leaflet.markercluster',

				'jquery.power.tip': "//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min",
				'jquery-ui': "//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min",
				'jquery.hoverIntent': "//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent",
				'jquery.i18n.properties': "//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min",
				'import-dependencies': "//fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0",

                'jquery.rangeSlider': '//fenixapps.fao.org/repository/js/jquery.rangeslider/5.7.0/jQDateRangeSlider-min',
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

	require([
	    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper', 'leaflet', 'leaflet-markercluster',
	    'text!config/services.json',
	    'text!html/table.html',

		'fx-menu/start',
        './scripts/components/AuthenticationManager',

        'amplify',
        'jquery.rangeSlider',
		'domready!'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L,LeafletMarkecluster,
		Config,
		table,

		TopMenu,
		AuthenticationManager
		) {

		Config = JSON.parse(Config);

		tableTmpl = Handlebars.compile(table);

		var resumeTmpl = Handlebars.compile('<ul id="afo-resume">{{#each items}}<li><span>{{label}} </span><b>{{value}}</b></li>{{/each}}</ul>');

        new TopMenu({
            active: 'prices_detailed',
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
				attributionControl:false,
				center: L.latLng(0,0),
				layers: L.tileLayer(Config.url_baselayer)
			}).addControl(L.control.zoom({position:'bottomright'}))

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
										"<i>product:</i> {fert}<br />"+
										"<i>price:</i> {val}"+
									"</div>"+
									"</div>";

				for(var i in data) {
					
					data[i][0] = data[i][0].replace('[Town]','');
					data[i][1] = data[i][1].split('|');
					data[i][2] += ' USD/tons';
					data[i][3] = formatMonth(data[i][3]);

					L.marker(data[i][1])
						.bindPopup( L.Util.template(popupTmpl, {
							title: data[i][0],
							fert: $("#prices_selectProduct option:selected").text(),
							val: data[i][2]
						}) )
						.addTo(layerRetail);
				}


				map.fitBounds( layerRetail.getBounds().pad(-1.2) );

				data = _.map(data, function(v) {
					v.splice(1,1);
					return v;
				});

				amplify.publish('updateSelection', { 
					tableHeaders: ['Market', 'Price', 'Date'],
					tableRows: data
				});
				
				updateResume( Selection );
			});
		}

		rangeMonths$.dateRangeSlider();
		rangeMonths$.dateRangeSlider("option","bounds", {
			min: new Date(2010, 2, 0),
			max: new Date(2015, 0, 0)
		});

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

			loadMarkers( Selection );
		});

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

		amplify.subscribe('updateSelection', function(data) {
			
			var table$ = $('#table-result').empty();

			if(data && data.tableRows && data.tableRows.length>0)
				table$.append( tableTmpl({
					headers: data.tableHeaders,
					rows: data.tableRows
				}) );
		});

		loadMarkers( Selection );

    });
});