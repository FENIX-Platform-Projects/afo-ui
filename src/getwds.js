
define(['jquery','underscore','config'],function($,_, Config, wdsConfig) {

	function _template(str, data) {
		return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
			return data[key] || '';
		});
	}

	return function(queryTmpl, queryVars, callback) {

		var ret,
			sql = queryVars ? _template(queryTmpl, queryVars) : queryTmpl,
			data = _.extend({
				datasource: Config.dbName,
				thousandSeparator: ',',
				decimalSeparator: '.',
				decimalNumbers: 2,
				cssFilename: '',
				nowrap: false,
				valuesIndex: 0,
				json: JSON.stringify({query: sql})
			}, wdsConfig);

		if(_.isFunction(callback))
			ret = $.ajax({
				url: Config.wdsUrl,
				data: data,
				type: 'POST',
				dataType: 'JSON',
				success: callback
			});
		else
			$.ajax({
				async: false,
				url: Config.wdsUrl,
				data: data,
				type: 'POST',
				dataType: 'JSON',
				success: function(resp) {
					ret = resp;
				}
			});

		return ret;
	};
});