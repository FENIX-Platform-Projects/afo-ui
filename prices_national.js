
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
	    'fx-common/js/WDSClient',
	    'src/fxTree',

		'pivot',
		'pivotConfig',
		'pivotRenderers',
		'pivotAggregators'
	], function($,_,bts,highcharts,jstree,Handlebars,moment,rangeSlider,
		Config,
		renderAuthMenu,
		WDSClient,
		fxTree,

		Pivot,
		PivotConfig,
		pivotRenderers,
		pivotAggregators
	) {

		renderAuthMenu(true);

		var wdsClient = new WDSClient({
			datasource: Config.dbName,
			outputType: 'array'
		});

		var minDate, maxDate;

	    var treeCountry =  new fxTree('#country-s', {
            labelVal: 'Country Code <small>( Gaul )</small>',
            labelTxt: 'Country Name',
            showTxtValRadio: true,
            showValueInTextMode: true
        });

	    var treeProduct =  new fxTree('#product-s', {
            labelVal: 'HS Code',
            labelTxt: 'Product Name',
            showTxtValRadio: true,
            showValueInTextMode: true
        });        

        /* ================================== SELECTORS */

	    // Fertilizers
		wdsClient.retrieve({
			payload: {
				query: Config.queries.prices_national_products
			},
			success: function(res) {

	            var data = [],
	                list;

	            if (Array.isArray(res)) {

	                list = res.sort(function (a, b) {
	                    if (a[1] < b[1]) return -1;
	                    if (a[1] > b[1]) return 1;
	                    return 0;
	                });

	                _.each(list, function (item) {
	                    data.push({
							id: item[0],
	                    	text: item[1]
	                    });
	                });

	                // Place ureas as first element and selected
	                var urea = _.findWhere(data, {id: '3102100000' });
	                data = _.without(data, urea);
	                urea['state'] = {};
	                urea.state.selected = true;
	                data.unshift(urea);

	            }

	            treeProduct.setData(data);
	        }
	    });

	    // Country
		wdsClient.retrieve({
			payload: {
				query: Config.queries.prices_national_countries
			},
			success: function(res) {

	            var data = [],
	                list;

	            if (Array.isArray(res)) {

	                list = res.sort(function (a, b) {
	                    if (a[1] < b[1]) return -1;
	                    if (a[1] > b[1]) return 1;
	                    return 0;
	                });

	                _.each(list, function (item) {
	                    data.push({
							id: item[0],
	                    	text: item[1]
	                    });
	                });

	            }

	            treeCountry.setData(data);
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
			var checkedCheckboxes = $('#'+id+' input[type="checkbox"]:checked'),
				ret = [];
			
			for(var i=0;i< checkedCheckboxes.length ; i++)
				ret.push(checkedCheckboxes[i].getAttribute("value"));

			return ret.join(",");
		}

		function returnSelect(id) {
			var checkedCheckboxes=$("#"+id+" :selected"),
				ret = [];

			for(var i=0;i< checkedCheckboxes.length ; i++)
				ret.push(checkedCheckboxes[i].getAttribute("value"));

			return ret.join(",");
		}

		function loadOlapData(sqlFilter) {

			wdsClient.retrieve({
				payload: {
					query: Config.queries.prices_national_filter,
					queryVars: sqlFilter
				},
				success: function(data) {

					data = [["Area","Item","Year","Month2","Value","Unit","Flag","FertCode"]].concat(data);

					var pp1 = new Pivot();
					pp1.render("pivot", data,{
						derivedAttributes: {
							"Month": function(mp){
								var matchMonth = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
								return "<span class='ordre'>" +matchMonth[ mp["Month2"]] + "</span>"+mp["Month2"];
							},
							"Indicator":function(mp){return "<span class='ordre'>" + mp["FertCode"] + "</span>"+mp["Item"]+" ("+mp["Unit"]+")";}
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
				}
			});
		}


		        //Search button
        $('#search-btn').on('click', function () {

            var Selection = {
                country_code:      treeCountry.getSelection().join("', '"),
                fertilizer_code:   treeProduct.getSelection().join("', '"),
                month_to_yyyymm:   maxDate,
                month_from_yyyymm: minDate           
            };

            console.log(Selection)

            if(Selection.fertilizer_code === '' || Selection.country_code === '' || !Selection.month_from_yyyymm || !Selection.month_to_yyyymm) {
                alert("Please select Countries and Fertilizers");
                return;
            }

            loadOlapData(Selection);

        });

    });
});