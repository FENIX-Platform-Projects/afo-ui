/*global require*/
require(["submodules/fenix-ui-menu/js/paths",
		 "submodules/fenix-ui-common/js/Compiler"
		 ], function(menuConfig, Compiler) {
    
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

				'swiper': "//fenixapps.fao.org/repository/js/swiper/2.7.5/dist/idangerous.swiper.min",
				'bootstrap': "//fenixapps.fao.org/repository/js/bootstrap/3.3.2/js/bootstrap.min",
				'draggabilly': "//fenixapps.fao.org/repository/js/draggabilly/dist/draggabilly.pkgd.min",
				'intro': "//fenixapps.fao.org/repository/js/introjs/1.0.0/intro",
				'isotope': "//fenixapps.fao.org/repository/js/isotope/2.1.0/dist/isotope.pkgd.min",
				'jquery': "//fenixapps.fao.org/repository/js/jquery/2.1.1/jquery.min",
				'jqwidgets': "//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-light",
				'jstree': "//fenixapps.fao.org/repository/js/jstree/3.0.8/dist/jstree.min",


				'jquery-ui': "//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min",
				'jquery.hoverIntent': "//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent",
				'jquery.i18n.properties': "//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min",

				'jquery.rangeSlider': '//fenixapps.fao.org/repository/js/jquery.rangeslider/5.7.0/jQDateRangeSlider-min',
				
				
				//OLAP
				 //'fx-pivot/start':         "submodules/fenix-ui-olap/js/pivot",
				'fx-olap/nls':           "submodules/fenix-ui-olap/nls",

				'pivot': 'submodules/fenix-ui-olap/js/pivot',
				//'countriesAgg': '//faostat3.fao.org/faostat-download-js/pivotAgg/countriesAgg',
				'olap-config': 'prices/configuration',
				'gt_msg': "submodules/fenix-ui-olap/lib/grid/gt_msg_en",
				//'gt_const': 'submodules/fenix-ui-olap/grid/gt_const',
				'gt_msg_grid': 'submodules/fenix-ui-olap/lib/grid/gt_grid_all',
				//'fusionchart': 'submodules/fenix-ui-olap/lib/grid/flashchart/fusioncharts/FusionCharts'
				
			  'pivotRenderers':         "submodules/fenix-ui-olap/js/rend/rendererers",
            'pivotAggregators':       "submodules/fenix-ui-olap/js/rend/aggregators",
            'pivotRenderersFuncs':    "submodules/fenix-ui-olap/js/rend/function_rendererers",
            'pivotAggregatorsFuncs':  "submodules/fenix-ui-olap/js/rend/function_aggregators",


            //"pivotConfig":            FX_CDN+"/fenix/fenix-ui-olap/4.0/config/dataConfig1",
            "pivotConfig":            "config/pivotConfig"
				
				
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
				'pivot': [
					'jquery',
					'jquery-ui',
					'jquery.i18n.properties',
					//'countriesAgg',
					'olap-config',
					'gt_msg',
					//'gtgetWDS_const',
					'gt_msg_grid',
					//'fusionchart'
				],
				  "gt_msg": ['jquery'],
            "gt_msg_grid": ['jquery','gt_msg'],
            "HPivot": ['jquery','jqueryui'],            
            "pivotRenderers": ['pivotRenderersFuncs'],  
            "pivotAggregators": ['pivotAggregatorsFuncs','jquery']   
		    }
		}
    });

	//LOAD MENU BEFORE ALL
	require(['src/renderAuthMenu'], function(renderAuthMenu) {

		renderAuthMenu('prices_national');

		require([
		    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper',
	 		'jquery.rangeSlider',
		    'config/services',

		    'text!html/publication.html',
			'pivot',
			 'pivotConfig',
    'pivotRenderers',
    'pivotAggregators'
		], function($,_,bts,highcharts,jstree,Handlebars,Swiper,
			rangeSlider,
			Config,
			publication,
			Pivot,
			PivotConfig,
			pivotRenderers,
			pivotAggregators
			) {

	        var minDate, maxDate;

	        /* ================================== PAGE */

			$('.footer').load('html/footer.html');

	        //Search button
	        $('#search-btn').on('click', function () {

	            var inputs = {
	                fertilizer_code: $('#product-s').jstree(true).get_selected().join("', '"),
	                country_code: $('#country-s').jstree(true).get_selected().join("', '"),
	                month_from_yyyymm: minDate,
	                month_to_yyyymm: maxDate
	            };

	            //Validate inputs
	            if (inputs.fertilizer_code === '' || inputs.country_code === '' ||!inputs.month_from_yyyymm || !inputs.month_to_yyyymm){
	                alert("Please select Countries and Fertilizers");
	                return;
	            }

	            loadOlapData(inputs);

	        });

	        /* ================================== SELECTORS */

	        // Fertilizers
	        getWDS(Config.queries.prices_national_products, null,function(res) {

	            var data = [],
	                list,
	                s_product = '#product-s',
	                s_product_search = '#product-search-s',
	                s_product_sel_all = '#product-sel-all-s';

	            if (Array.isArray(res)) {

	                list = res.sort(function (a, b) {
	                    if (a[1] < b[1]) return -1;
	                    if (a[1] > b[1]) return 1;
	                    return 0;
	                });

	                _.each(list, function (n) {
	                    data.push(createNode(n));
	                });

	                // Place ureas as first element and selected
	                var urea = _.findWhere(data, {id: '3102100000' });
	                data = _.without(data, urea);
	                urea['state'] = {};
	                urea.state.selected = true;
	                data.unshift(urea);

	            }

	            createTree(data);
	            initSearch();
	            initBtns();

	            function initBtns () {

	                var allChecked = false;

	                $(s_product_sel_all).on('click', function () {

	                    if (!allChecked){
	                        $(s_product).jstree("check_all");
	                        allChecked = true
	                    } else {
	                        $(s_product).jstree("uncheck_all");
	                        allChecked = false
	                    }
	                })
	            }

	            function createTree(data) {

	                $(s_product).jstree({
	                    "core": {
	                        "multiple": true,
	                        "animation": 0,
	                        "themes": {"stripes": true},
	                        'data': data
	                    },
	                    "plugins": ["search", "wholerow", "ui", "checkbox"],
	                    "search": {
	                        show_only_matches: true
	                    },
	                    "ui": {"initially_select": ['2814200000']}
	                });

	                $(s_product).jstree(true).select_node('ul > li:first');
	            }

	            function initSearch() {
	                var to = false;
	                $(s_product_search).keyup(function () {
	                    if (to) {
	                        clearTimeout(to);
	                    }
	                    to = setTimeout(function () {
	                        var v = $(s_product_search).val();
	                        $(s_product).jstree(true).search(v);
	                    }, 250);
	                });
	            }

	            function createNode(item) {

	                // Expected format of the node (there are no required fields)
	                var config = {
	                    id: item[0], // will be autogenerated if omitted
	                    text: item[1] + " ["+item[0]+"]" // node text
	                    //icon: "string", // string for custom
	                    /* state: {
	                     opened: boolean,  // is the node open
	                     disabled: boolean,  // is the node disabled
	                     selected: boolean  // is the node selected
	                     },*/
	                    //children    : [],  // array of strings or objects
	                    //li_attr: {},  // attributes for the generated LI node
	                    //a_attr: {}  // attributes for the generated A node
	                };

	                return config;
	            }
	        });

	        // Country
	        getWDS(Config.queries.prices_national_countries, null,function(res) {

	            var data = [],
	                list,
	                s_product = '#country-s',
	                s_product_search = '#country-search-s',
	                s_product_sel_all = '#country-sel-all-s';;

	            if (Array.isArray(res)) {

	                list = res.sort(function (a, b) {
	                    if (a[1] < b[1]) return -1;
	                    if (a[1] > b[1]) return 1;
	                    return 0;
	                });

	                _.each(list, function (n) {
	                    data.push(createNode(n));
	                });

	            }

	            createTree(data);
	            initSearch();
	            initBtns();

	            function initBtns () {

	                var allChecked = false;

	                $(s_product_sel_all).on('click', function () {

	                   if (!allChecked){
	                       $(s_product).jstree("check_all");
	                       allChecked = true
	                   } else {
	                       $(s_product).jstree("uncheck_all");
	                       allChecked = false
	                   }
	                })
	            }

	            function createTree(data) {

	                $(s_product).jstree({
	                    "core": {
	                        "multiple": true,
	                        "animation": 0,
	                        "themes": {"stripes": true},
	                        'data': data
	                    },
	                    "plugins": ["search", "wholerow", "ui", "checkbox"],
	                    "search": {
	                        show_only_matches: true
	                    },
	                    "ui": {"initially_select": ['2814200000']}
	                });

	                $(s_product).jstree(true).select_node('ul > li:first');
	            }

	            function initSearch() {
	                var to = false;
	                $(s_product_search).keyup(function () {
	                    if (to) {
	                        clearTimeout(to);
	                    }
	                    to = setTimeout(function () {
	                        var v = $(s_product_search).val();
	                        $(s_product).jstree(true).search(v);
	                    }, 250);
	                });
	            }

	            function createNode(item) {

	                // Expected format of the node (there are no required fields)
	                var config = {
	                    id: item[0], // will be autogenerated if omitted
	                    text: item[1] // node text
	                    //icon: "string", // string for custom
	                    /* state: {
	                     opened: boolean,  // is the node open
	                     disabled: boolean,  // is the node disabled
	                     selected: boolean  // is the node selected
	                     },*/
	                    //children    : [],  // array of strings or objects
	                    //li_attr: {},  // attributes for the generated LI node
	                    //a_attr: {}  // attributes for the generated A node
	                };

	                return config;
	            }
	        });

	        // Time
	        var rangeMonths$ = $('#prices_rangeMonths');


	        rangeMonths$.dateRangeSlider(Config.dateRangeSlider.prices_national);

	        var minD = Config.dateRangeSlider.prices_national.bounds.min,
	            maxD = Config.dateRangeSlider.prices_national.bounds.max;

	        var minMonth=minD.getMonth()+1;
	        var maxMonth=maxD.getMonth()+1;
	        
	        if(minMonth<10){ minMonth="0"+minMonth; }
	        if(maxMonth<10){ maxMonth="0"+maxMonth; }

	        minDate = ""+minD.getFullYear()+minMonth;
	        maxDate = ""+maxD.getFullYear()+maxMonth;

	        rangeMonths$.on('valuesChanged', function(e, data) {

	            var minD = new Date(data.values.min),
	                maxD = new Date(data.values.max);
	            var minMonth=minD.getMonth()+1;
	            var maxMonth=maxD.getMonth()+1;
	            if(minMonth<10){ minMonth="0"+minMonth; }

	            if(maxMonth<10){ maxMonth="0"+maxMonth; }

	            minDate = ""+minD.getFullYear()+minMonth;
	            maxDate = ""+maxD.getFullYear()+maxMonth;

	        });





	        /* ================================== OLAP */

			var F3DWLD = {
			    CONFIG: {
			        wdsPayload: {
			            showCodes: false
			        }
			    }
			};
		/*	FAOSTATNEWOLAP.showUnits = "false";
			FAOSTATNEWOLAP.showFlags = "false";
			*//*function init() {
				$('#country').checkboxTree({initializeUnchecked: 'collapsed'});
				$('#partner').checkboxTree({initializeUnchecked: 'collapsed'});
				$('#commodity').checkboxTree({initializeUnchecked: 'collapsed'});
			}*/

			function returnTreeview(id) {
				var ret=[];
				var checkedCheckboxes = $('#'+id+' input[type="checkbox"]:checked');
				for(var i=0;i< checkedCheckboxes.length ; i++){
				ret.push(checkedCheckboxes[i].getAttribute("value"));
				//console.log(checkedCheckboxes[i].getAttribute("value"));
				}
				return ret.join(",");
			}

			function returnSelect(id) {
				var ret=[];
				checkedCheckboxes=$("#"+id+" :selected");
				for(var i=0;i< checkedCheckboxes.length ; i++){
					ret.push(checkedCheckboxes[i].getAttribute("value"));
				}
				return ret.join(",");
			}

			function loadOlapData(sqlFilter) {

				getWDS(Config.queries.prices_national_filter, sqlFilter, function(data) {

					data = [["Area","Item","Year","Month2","Value","Unit","Flag","FertCode"]].concat(data);

					//FAOSTATNEWOLAP.originalData = data;
					var pp1=new Pivot();
					pp1.render("pivot", data,{
						derivedAttributes: {
							"Month": function(mp){
								return "<span class=ordre>" +matchMonth[ mp["Month2"]] + "</span>"+mp["Month2"];
							},
							"Indicator":function(mp){return "<span class=ordre>" + mp["FertCode"] + "</span>"+mp["Item"]+" ("+mp["Unit"]+")";}
						},
						rows: ["Area", "Indicator", "Month"],
						cols: ["Year"],
						vals: ["Value", "Flag"],
						hiddenAttributes:["Month2","Unit","Item","Value","Flag","FertCode"],
						linkedAttributes:[],
						 rendererDisplay: pivotRenderers,
						aggregatorDisplay: pivotAggregators
					})
/*
					$("#pivot").pivotUI(data, {
						derivedAttributes: {
							"Month": function(mp){
								return "<span class=\"ordre\">" +matchMonth[ mp["Month2"]] + "</span>"+mp["Month2"];
							},"Indicator":function(mp){return "<span class=\"ordre\">" + mp["FertCode"] + "</span>"+mp["Item"]+" ("+mp["Unit"]+")";}
						},
						rows: ["Area", "Indicator", "Month"],
						cols: ["Year"],
						vals: ["Value", "Flag"],
						hiddenAttributes:["Month2","Unit","Item"],
						linkedAttributes:[]
					},true);
*/
					$("#pivot_download").show();

					$("#pivot_download").on('click', function(e) {

						pp1.exportExcel();
						//decolrowspanNEW();
					});
				});
			}







	        /* ================================== GENERAL */
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

	    });
    });
});