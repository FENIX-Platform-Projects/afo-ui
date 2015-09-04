define([
	'jquery','underscore','bootstrap','handlebars',
	'config/services'	
], function($,_,bts,Handlebars,
	Config,
) {

	function getWDS(queryTmpl, queryVars, callback) {

	    var sqltmpl, sql;

	    if (queryVars) {
	        sqltmpl = _.template(queryTmpl);
	        sql = sqltmpl(queryVars);
	    } else sql = queryTmpl;

	    var data = {
	        datasource: Config.dbName,
	        thousandSeparator: ',',
	        decimalSeparator: '.',
	        decimalNumbers: 2,
	        cssFilename: '',
	        nowrap: false,
	        valuesIndex: 0,
	        json: JSON.stringify({
	            query: sql
	        })
	    };

	    $.ajax({
	        url: Config.wdsUrl,
	        data: data,
	        type: 'POST',
	        dataType: 'JSON',
	        success: callback
	    });
	}

	function wdsInterface(conf) {
        this.opts = $.extend({
            serviceUrl: defaultOpts.serviceUrl,
            datasource: defaultOpts.datasource,
            collection: null,
            wdsUrl: defaultOpts.wdsUrl,
            wdsSchemaUrl: defaultOpts.wdsSchemaUrl,
            wds_blacklist: ['method', 'endpoint'],
            thousandSeparator: ',',
            decimalSeparator: '.',
            decimalNumbers: 2,
            cssFilename: '',
            nowrap: false,
            valuesIndex: 0,
            json: JSON.stringify({query: ''}),
            wds_client_config: {
                url_root: '',
                parameters: [],
                error: null,
                always: null,
                success: null,
                rest_service_name: ''
            }
        }, config);

        return this;
	};

	wdsInterface.prototype.retrieve = function() {

	};


	return wdsInterface;
});