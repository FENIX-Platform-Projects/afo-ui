

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
				'jquery.power.tip': "//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min",
				'jquery-ui': "//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min",
				'jquery.hoverIntent': "//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent",
				'jquery.i18n.properties': "//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min",
				'import-dependencies': "//fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0",
				//datarange
				'jquery.rangeSlider': '//fenixapps.fao.org/repository/js/jquery.rangeslider/5.7.0/jQDateRangeSlider-min',
				
				
				//OLAP
				'pivot': 'submodules/fenix-ui-olap/js/pivot',
				'countriesAgg': '//faostat3.fao.org/faostat-download-js/pivotAgg/countriesAgg',
				'olap-config': 'prices/configuration',
				'gt_msg_en': "submodules/fenix-ui-olap/lib/grid/gt_msg_en",
				//'gt_const': 'submodules/fenix-ui-olap/grid/gt_const',
				'gt_grid_all': 'submodules/fenix-ui-olap/lib/grid/gt_grid_all',
				'fusionchart': 'submodules/fenix-ui-olap/lib/grid/flashchart/fusioncharts/FusionCharts'
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
					'countriesAgg',
					'olap-config',
					'gt_msg_en',
					//'gtgetWDS_const',
					'gt_grid_all',
					'fusionchart'
				]
/*		        'fenix-map': {
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
		        }*/        
		    }
		}
    });

	require([
	    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper',
	    'text!config/services.json',
		'text!html/publication.html',

		'fx-menu/start',
		'./scripts/components/AuthenticationManager',

		'pivot',
		'amplify',
		
'jquery.rangeSlider',
		'domready!'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,
		Config,
		publication,

		TopMenu,
		AuthenticationManager,

		Pivot
		) {

		Config = JSON.parse(Config);


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

        new TopMenu({
            active: 'prices_national',
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


		//////////////	OLAP COFIGURATION /////////////////


		var mydata;
		F3DWLD = {
		    CONFIG: {
		        wdsPayload: {
		            showCodes: false
		        }
		    }
		};
		FAOSTATNEWOLAP.showUnits = "false";
		FAOSTATNEWOLAP.showFlags = "false";
		/*function init() {
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

		function myGetData()
		{
			$("#output").empty();
			$("#output").html("Wait");

			param = {
				px: returnSelect("IClassification"),
				y: returnSelect("year"),
				r: returnTreeview("country"),
				p: returnTreeview("partner"),
				cc: returnTreeview("commodity"),
				Rg: returnSelect("TradeFlow")
			};

			//console.log(param.px+":" +param.y+":" +param.r+":" +param.p+":" +param.cc+":" +param.Rg);
			/*console.log(returnTreeview("partner"));
			console.log(returnTreeview("commodity"));
			console.log(returnSelect("year"));*/
			if(param.px!="" && param.y!="" && param.r!="" && param.p!="" && param.cc!="" && param.Rg!=""  )
			{
				$.post("data.php", param, function(data) {
				//$.post("listboxdata/datatest.json",param,function(data){

				data=eval(data);
				mydata=[];
				mydataNorm=[["mirror", "pfCode", "yr", "rgCode", "rtCode", "ptCode", "cmdCode", "cmdID", "qtCode", "Type","Value", "estCode", "htCode"] ];
				mydata.push(data[0]);
				console.log(data[0])

				for(var i=1;i<data.length;i++)
				{
					var t=[];
					var tNorm=[data[i][0][0],data[i][1][0],data[i][2][0],data[i][3][0],data[i][4][0],data[i][5][0],data[i][6][0],data[i][7][0],data[i][8][0],"TradeQuantity",
					data[i][9][0],data[i][12][0],data[i][13][0]];
					mydataNorm.push(tNorm);

					tNorm=[data[i][0][0],data[i][1][0],data[i][2][0],data[i][3][0],data[i][4][0],data[i][5][0],data[i][6][0],data[i][7][0],data[i][8][0],"NetWeight",
					data[i][10][0],data[i][12][0],data[i][13][0]];
					mydataNorm.push(tNorm);

					tNorm=[data[i][0][0],data[i][1][0],data[i][2][0],data[i][3][0],data[i][4][0],data[i][5][0],data[i][6][0],data[i][7][0],data[i][8][0],"TradeValue",
					data[i][11][0],data[i][12][0],data[i][13][0]];
					mydataNorm.push(tNorm);

					for(j in data[i]){
						t.push(data[i][j][0]);
					}
					mydata.push(t);
				}

				var derivers = $.pivotUtilities.derivers;
				var renderers = $.extend($.pivotUtilities.renderers,$.pivotUtilities.gchart_renderers);
				
				$("#output").pivotUI(mydataNorm, {
					hiddenAttributes:[],
					derivedAttributes: {
					"country":function(mp){return country[mp["rtCode"]]},
					"CountryCodeFAOSTAT":function(mp){if (matchCountryHSFAOSTAT[mp["rtCode"]]){return matchCountryHSFAOSTAT[mp["rtCode"]]["FAOSTAT"]}
					else{return "Nomatching found ("+mp["rtCode"]+")";}
					},
					"partner":function(mp){return country[mp["ptCode"]]},
					"PartnerCodeFAOSTAT":function(mp){if(matchCountryHSFAOSTAT[mp["ptCode"]]){return matchCountryHSFAOSTAT[mp["ptCode"]]["FAOSTAT"]}
					else{return "Nomatching found ("+mp["ptCode"]+")";}
					},
					"commodity":function(mp){return commodity[mp["cmdCode"]]},
					"flow":function(mp){if(mp["rgCode"]==1){return "Import"}else{return "Export"}},
					"faostatCode":function(mp)
					{if(matchHSFAOSTATFertilizer[mp["cmdCode"]])
					{return matchHSFAOSTATFertilizer[mp["cmdCode"]];}
					else{
					if (matchHSFAOSTATFertilizer[mp["cmdCode"].substring(0,4)+"*"])
					{return matchHSFAOSTATFertilizer[mp["cmdCode"].substring(0,4)+"*"]}
					return "not matching found ("+mp["cmdCode"]+")";
					}
					},
					"TradeValueFAOSTAT":function(mp){return mp["TradeValue"]/1000}

				 },
				 aggregators: aggregatorsCountry,

					//rows:["country","rtCode","CountryCodeFAOSTAT","partner","ptCode","PartnerCodeFAOSTAT","flow","commodity","faostatCode"],
					rows:["CountryCodeFAOSTAT","country","flow","faostatCode","Type"],
					
					cols: ["yr","mirror"],
				//	vals:["TradeValueFAOSTAT","TradeValue","TradeQuantity","NetWeight"],
					vals:["Value"],

					linkedAttributes:[["country","rtCode","CountryCodeFAOSTAT"]]
					},true);

				}).fail(function(xhr, textStatus, errorThrown) {
					$("#output").html("Error in loading data: "+xhr.responseText);
				});
			}
			else
				alert("missing parameters");
		}

		//FAOSTATNEWOLAP.rendererV = 2;
		/*
				var derivers = $.pivotUtilities.derivers;
				var renderers = $.extend(
					$.pivotUtilities.renderers
				);
		*/
/*
getWDS(Config.queries.prices_national_filter, {
	fertilizer_code: '3102100000',
	month_from_yyyymm: '201201',
	month_to_yyyymm: '201212'
}, function(data) {

		data = [["Area","Item","Year","Month2","Value","Unit","Flag"]].concat(data);

			FAOSTATNEWOLAP.originalData = data;

			$("#pivot").pivotUI(data, {
				derivedAttributes: {
					"Month": function(mp){
						return "<span class=\"ordre\">" +matchMonth[ mp["Month2"]] + "</span>"+mp["Month2"];
					},"Indicator":function(mp){return mp["Item"]+" ("+mp["Unit"]+")";}
				},
				rows: ["Area", "Indicator"],
				cols: ["Year", "Month"],
				vals: ["Value", "Flag"],
				hiddenAttributes:["Month2","Unit","Item"],
				linkedAttributes:[]
			});

			$("#pivot_loader").hide();
			$("#pivot_download").show();

			$("#pivot_download").on('click', function(e) {

				my_exportNew();
				//decolrowspanNEW();
			});
		});
		*/
		/*test*/
		
		function loadMarkers(sqlFilter) {

			
getWDS(Config.queries.prices_national_filter,sqlFilter, function(data) {

		data = [["Area","Item","Year","Month2","Value","Unit","Flag"]].concat(data);

			FAOSTATNEWOLAP.originalData = data;

			$("#pivot").pivotUI(data, {
				derivedAttributes: {
					"Month": function(mp){
						return "<span class=\"ordre\">" +matchMonth[ mp["Month2"]] + "</span>"+mp["Month2"];
					},"Indicator":function(mp){return mp["Item"]+" ("+mp["Unit"]+")";}
				},
				rows: ["Area", "Indicator"],
				cols: ["Year", "Month"],
				vals: ["Value", "Flag"],
				hiddenAttributes:["Month2","Unit","Item"],
				linkedAttributes:[]
			});

			$("#pivot_loader").hide();
			$("#pivot_download").show();

			$("#pivot_download").on('click', function(e) {

				my_exportNew();
				//decolrowspanNEW();
			});
		});
		}
		loadMarkers({
				fertilizer_code: '3102100000',
				month_from_yyyymm: '201201',
				month_to_yyyymm: '201212'
			});
		
		var minDate='201201',maxDate='201212';
		$(".afo-range").dateRangeSlider().on('valuesChanged', function(e, data) {
		
			var minD = new Date(data.values.min),
				maxD = new Date(data.values.max);
				var minMonth=minD.getMonth()+1;
				var maxMonth=maxD.getMonth()+1;
				if(minMonth<10){minMonth="0"+minMonth;}
				
				if(maxMonth<10){maxMonth="0"+maxMonth;}
				minDate = ""+minD.getFullYear()+minMonth,
				maxDate = ""+maxD.getFullYear()+maxMonth;


			loadMarkers({
					fertilizer_code: $("#prices_selectProduct").val(),
					month_from_yyyymm: minDate,
					month_to_yyyymm: maxDate
				});
		});
		
		getWDS(Config.queries.products, null,function(products) {
console.log(products)
            for(var r in products){
                $('#prices_selectProduct').append('<option value="'+products[r][1]+'">'+products[r][0]+'</option>');
				}

		});
		
		$("#prices_selectProduct").on('change', function(e) {
		


			loadMarkers({
					fertilizer_code: $("#prices_selectProduct").val(),
					month_from_yyyymm: minDate,
					month_to_yyyymm: maxDate
				});
		});
		
    });
}
);