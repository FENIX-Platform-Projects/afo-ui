
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
	    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars','moment','jquery.rangeSlider',
	    'config/services',
	    'src/renderAuthMenu',

		'pivot',
		'pivotConfig',
		'pivotRenderers',
		'pivotAggregators'
	], function($,_,bts,highcharts,jstree,Handlebars,moment,rangeSlider,
		Config,
		renderAuthMenu,

		Pivot,
		PivotConfig,
		pivotRenderers,
		pivotAggregators
		) {

			renderAuthMenu(true);

	        var minDate, maxDate;
			
			

	        /* ================================== PAGE */

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
	            var minMonth = minD.getMonth()+1;
	            var maxMonth = maxD.getMonth()+1;
	            if(minMonth<10){ minMonth="0"+minMonth; }

	            if(maxMonth<10){ maxMonth="0"+maxMonth; }

	            minDate = ""+minD.getFullYear()+minMonth;
	            maxDate = ""+maxD.getFullYear()+maxMonth;

	        });


			$('input[name=prices_range_radio]').on('click', function (e) {

				var val = parseInt( $(this).val() ),
					max = moment(Config.dateRangeSlider.prices_national.bounds.max),
					min = max.subtract(val,'months').toDate();
				rangeMonths$.dateRangeSlider('min', min);
			});//*/


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
							
							var matchMonth = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
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