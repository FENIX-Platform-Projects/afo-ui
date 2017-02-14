
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
	    'jquery', 'underscore', 'bootstrap', 'handlebars','moment',
	    'config/services',
	    'src/renderAuthMenu',
	    'fx-common/js/WDSClient',
	    'text!html/table.html',
        'jquery.rangeSlider',
	], function($,_,bts,Handlebars,moment,
		Config,
		renderAuthMenu,
		WDSClient,
		table
	) {

		renderAuthMenu(true);

		function formatMonth(date, str) {
			var year = date.slice(0,4),
				month = date.slice(4);
			if(!!str) {
				var mdate = (new Date(year,month-1)).toDateString().split(' ');
				return mdate[1]+' '+mdate[3];
			}
			return [year, '/', month].join('');
		}

		var wdsClient = new WDSClient({
			datasource: Config.dbName,
			outputType: 'array'
		});

		tableTmpl = Handlebars.compile(table);

		var banner$ = $('#prices_international_banner'),
			chart$ = $('#prices_international_chart'),
			table$ = $('#prices_international_grid');

		banner$.attr('href', Config.prices_international_link )
			.find('img').attr('src', Config.prices_international_banner );

		chart$.attr('src', Config.prices_international_chart );

		table$.html('<big class="text-center">Loading data...<br /><br /></big>');

		wdsClient.retrieve({
			payload: {
				query: Config.queries.prices_international
			},
			success: function(data) {

				var cols = data[0][2].split('|'),
					year = cols.pop(),
					month = cols.pop(),
					months = _.map(cols, function(val) {
						return formatMonth(val, true);
					}),
					lastmont = moment(_.last(cols),'YYYYMM').format('MMMM YYYY');
				$('.market_date').text( lastmont );

				var	headers = _.union(['Nutrient','Fertilizer'], months, [month, year]),
					rows = _.map(data, function(val) {
						var vv = val[3].split('|');
						vv[vv.length-1] += '%';
						vv[vv.length-2] += '%';
						return [val[0], val[1]].concat( vv );
					});

				table$.html( tableTmpl({
					headers: headers,
					rows: rows
				}) );
			}
		});
	});
});