define([
	'jquery','underscore','bootstrap','handlebars',
	'config/services',
	'text!html/table.html',
	], function($,_,bts,Handlebars,
		Config,
		table
	) {

	var tableTmpl = Handlebars.compile(table);

	function formatMonth(date) {
		return [date.slice(0,4),'/',date.slice(4)].join('')
	}

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

	return function(Selection, $target) {

		getWDS(Config.queries.prices_detailed_local_grid, Selection, function(data) {

			for(var i in data) {
				data[i][1] = data[i][1].replace('[Town]','');
				data[i][2] += ' USD/tons';
				data[i][4] = formatMonth(data[i][4]);
			}
			
			var $table = $target.empty();
			if(data && data.length>0)
				$table.append( tableTmpl({
					headers: ['Country', 'Market', 'Price', 'Type', 'Date'],
					rows: data
				}) );
		});
	};
});