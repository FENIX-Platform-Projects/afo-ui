
define(['jquery','underscore','config'],function($,_) {
	
	return function(queryTmpl, queryVars, callback) {

		var sqltmpl, sql;`

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
	};
});