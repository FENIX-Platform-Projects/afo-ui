define([
	'jquery','underscore','bootstrap','handlebars',
	'config/services'	
], function($,_,bts,Handlebars,
	Config
) {

	/*
		Override of wdsClient using HTTP POST for retrieve requests

		It's a Patch for limits of HTTP GET url max length
	*/


    function _template(str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            return data[key] || '';
        });
    }

	function wdsFakeInterface(config) {

		this.datasource = config.datasource;
        this.outputType = config.outputType;

		this.getWDS = function(queryTmpl, queryVars, callback) {
			
			var data = {
			    datasource: this.datasource,
			    thousandSeparator: ',',
			    decimalSeparator: '.',
			    decimalNumbers: 2,
			    cssFilename: '',
			    nowrap: false,
			    valuesIndex: 0,
			    json: JSON.stringify({
			        query: queryVars ? _template(queryTmpl, queryVars) : queryTmpl
			    })
			};

		    $.ajax({
		        url: Config.wdsUrl,
		        data: data,
		        type: 'POST',
		        dataType: 'JSON',
		        success: function(data) {
		        	callback(data);
		        }
		    });
		};

		return this;
	};

	wdsFakeInterface.prototype.retrieve = function(opts) {
		return this.getWDS(opts.payload.query, opts.payload.queryVars, opts.success);
	};


	return wdsFakeInterface;
});