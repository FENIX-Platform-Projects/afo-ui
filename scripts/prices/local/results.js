define([
	'jquery','underscore','bootstrap','handlebars',
	'config/services',
	'fx-common/js/WDSClient',
	
	'pivot',
		'pivotConfig',
		'pivotRenderers',
		'pivotAggregators'
	
	], function($,_,bts,Handlebars,
		Config,
		WDSClient,

		Pivot,
		PivotConfig,
		pivotRenderers,
		pivotAggregators
	) {

	function formatMonth(date) {
		return [date.slice(0,4),'/',date.slice(4)].join('')
	}

    var wdsClient = new WDSClient({
        datasource: Config.dbName,
        outputType: 'array'
    });

    return function (Selection, $target) {

		//DEBUG
    	/*Selection = {
    	    fertilizer_code: '3102100000',
    	    country_code: '270',
    	    month_from_yyyymm: '201203',
    	    month_to_yyyymm: '201501'
    	};*/


        wdsClient.retrieve({
            payload: {
            	//TODO move to Config.queries
                //query: "select DISTINCT country_label, market, price, type, month from (select market, country, round(cast(avg(unit_price_usd) AS numeric), 2) as price, type, month from prices_local where fertilizer = cast(<%= fertilizer_code %> AS varchar) and month between <%= month_from_yyyymm %> and <%= month_to_yyyymm %> group by market, country, month, type) data join codes_countries on (country = country_code) order by month,country_label,market asc",
                query: Config.queries.prices_detailed_local_grid,
                queryVars: Selection
            },
            success: function(data) {

				for(var i in data) {
					data[i][1] = data[i][1].replace('[Town]','');
					data[i][2] += ' USD/tons';
					data[i][4] = formatMonth(data[i][4]);
				}
				
				var $table = $target.empty();
				
				if(data && data.length>0)
				{
					$target.attr("class","fx-olap-holder");
					$target.css("height","500px");
					
					data = [['Country', 'Market', 'Price', 'Type', 'Date']].concat(data);

					var pp1 = new Pivot();
					
					pp1.render($target.attr('id'), data, {
						derivedAttributes: {
							"Value": function(mp) {
								return mp["Price"].split(" ")[0];
							},
							"Unit": function(mp) {
								return mp["Price"].split(" ")[1];
							}
						},
						rows: ["Country", "Market", "Type","Unit"],
						cols: ["Date"],
						vals: ["Value"],
						hiddenAttributes:["Price","Value"],
						linkedAttributes:[],
						rendererDisplay: pivotRenderers,
						aggregatorDisplay: pivotAggregators
					});
				}
			}
		});
	};
});