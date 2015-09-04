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


    var defaultOpts = {
        serviceUrl: 'http://fenixapps2.fao.org/wds_5.1/rest/crud',
        wdsUrl: 'http://fenixapps2.fao.org/wds_5.1/rest',
        wdsSchemaUrl: 'http://fenixapps2.fao.org/wds_5.1/schema/services.json',
        datasource: 'DEMO_FENIX',
		queryTmpl: '',
		queryVars: null,
		outputType: 'array',
		error: null,
		always: null,
		success: null
    };
    
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

	wdsInterface.prototype.retrieve = function(conf) {

	};


	return wdsInterface;
});