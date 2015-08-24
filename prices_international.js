
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
	    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper', 'leaflet', 'leaflet-markercluster','moment',
	    'config/services',
	    'src/renderAuthMenu',
	    'text!html/table.html',
        'jquery.rangeSlider',
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L,LeafletMarkecluster,moment,
		Config,
		renderAuthMenu,
		table) {

		renderAuthMenu(true);


		tableTmpl = Handlebars.compile(table);

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

		function formatMonth(date, str) {
			var year = date.slice(0,4),
				month = date.slice(4);

			if(!!str) {
				var mdate = (new Date(year,month-1)).toDateString().split(' ');
				return mdate[1]+' '+mdate[3];
			}

			return [year, '/', month].join('');
		}
        //JQUERY range slider
        $(".afo-range").dateRangeSlider();

		var table$ = $('#prices_international_grid'),
			chart$ = $('#prices_international_chart');

//CHART IMAGE

		chart$.attr({src: 'images/prices_international_chart_july2015.png'});

		table$.html('<big class="text-center">Loading data...<br /><br /></big>');
		getWDS(Config.queries.prices_international, null, function(data) {

			var cols = data[0][2].split('|'),
				year = cols.pop(),
				month = cols.pop(),
				months = _.map(cols, function(val) {
					return formatMonth(val,true);
				});

			$('#market_date').text(_.last(months));

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

		});
	});
});