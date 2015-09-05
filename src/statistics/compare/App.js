/*global define*/
define([
    'underscore',
    'compare/Results',
    'compare/Selectors',
    'config/services',
    'amplify'
], function (_, Results, Selectors, Config) {

    'use strict';

    var s = {
        FOOTER: '.footer',
        SEARCH_BTN: '#search-btn',
        COURTESY: '#afo-courtesy',
        RESULTS: '#afo-results',
        RESUME : '#afo-resume'
    };

    function App() {
        this.state = {};
        this.config = Config;
    }

    App.prototype.start = function () {

        this._bindEventListeners();
        this._initPageStructure();
    };

    App.prototype._initPageStructure = function () {

        //Selectors: map and others
        this.selectors = new Selectors();

        //Results: table and charts
        this.results = new Results();
        $("#downloadxls").on("click",_.bind(this.results.Pivot.exportExcel, this.results.Pivot));//monPivot.exportExcel
        $("#downloadcsv").on("click",_.bind(this.results.Pivot.exportCSV, this.results.Pivot));//monPivot.exportExcel
    };

    App.prototype._bindEventListeners = function () {

        $(s.SEARCH_BTN).on('click', _.bind(this.search, this));
		//$("#downloadxls").on("click",_.bind(this.results.Pivot.exportExcel, this));//monPivot.exportExcel
		/*$("#downloadcsv").on("click",_.bind(this.results.Pivot.exportCSV, this));//monPivot.exportExcel
		*/
		//$("#downloadcsv").click(this.results.Pivot.exportCSV)
        amplify.subscribe('afo.selector.select', _.bind(this.updateResume, this));
    };

    App.prototype.updateResume = function () {

        var resume = this.selectors.getSelection(),
            keys = Object.keys(resume);

        $(s.RESUME).empty();

        _.each(keys, function (key ) {

            if (resume.hasOwnProperty(key) && resume[key] && Array.isArray(resume[key]) && resume[key].length > 0){

                var $li = $('<li>'),
                    $label = $('<span>'),
                    $value =  $('<span>', {text : getLabel(resume[key]) }),
                    lab;

                switch(key){
                    case 'COUNTRY': lab = 'Africa Region'; break;
                    case 'KIND' :  lab = 'View in'; break;
                    case 'SOURCE' :  lab = 'Data Source'; break;
                    case 'PRODUCT' :  lab = 'Fertilizer'; break;
                    case 'ELEMENT' :  lab = 'Element'; break;
                    case 'COMPARE' :  lab = 'Compare by'; break;
                }

                $label.html(lab+': ');
                $li.append($label).append( '<b>'+$value.html()+'</b>' );
                $(s.RESUME).append($li)
            }
        });

        function getLabel(array) {

            var r ='';
            _.each(array, function (a) {
                r += a.text + ', ';
            });

            return r.slice(0, r.length - 2);
        }
    };

    App.prototype.search = function () {

        var results = this.selectors.getFilter(),
            values;

        if (results === false) {return;}

        values = this.buildFilterCombinations(results);
		
		/*jacques code*/
		var valuesPivot={SOURCE:'',COUNTRY:'',ELEMENT:'',KIND:'',PRODUCT:''};
		var tempArray=[];
		for(var vv in results["SOURCE"])
		{tempArray.push(results["SOURCE"][vv].code)}
	valuesPivot.SOURCE="'"+tempArray.join("','")+"'";
	 tempArray=[];
		for(var vv in results["COUNTRY"])
		{tempArray.push(results["COUNTRY"][vv].code)}
	valuesPivot.COUNTRY="'"+tempArray.join("','")+"'";
	 tempArray=[];
		for(var vv in results["ELEMENT"])
		{tempArray.push(results["ELEMENT"][vv].code)}
	valuesPivot.ELEMENT="'"+tempArray.join("','")+"'";
	 tempArray=[];
		for(var vv in results["KIND"])
		{tempArray.push(results["KIND"][vv].code)}
	valuesPivot.KIND="'"+tempArray.join("','")+"'";
	tempArray=[];
		for(var vv in results["PRODUCT"])
		{tempArray.push(results["PRODUCT"][vv].code)}
	valuesPivot.PRODUCT="'"+tempArray.join("','")+"'";
		/*end jacques code*/
        this.results.empty();
			if(results.SHOW=="pivot")
			{this.performPivotQuery(valuesPivot, results);}
		else{		
			_.each(values, _.bind(function (v) {
				switch (results.SHOW) {
					case 'table' :
						this.performTableQuery(v, results);
						break;
					case 'chart' :
						this.performChartQuery(v, results);
						break;
				}

			}, this));
		}
	
    };

    //Chart

    App.prototype.performChartQuery = function (v, results) {

        var query;

        switch (results.COMPARE[0].code) {
            case 'ELEMENT' :
                results.SOURCE[0].code === 'cstat' ?
                    query = this._replace(this.config.queries.compare_by_element_cstat, v) :
                    query = this._replace(this.config.queries.compare_by_element, v);
                break;
            case 'PRODUCT' :
                results.SOURCE[0].code === 'cstat' ?
                    query = this._replace(this.config.queries.compare_by_product_cstat, v) :
                    query = this._replace(this.config.queries.compare_by_product, v);
                break;
            case 'COUNTRY' :
                results.SOURCE[0].code === 'cstat' ?
                    query = this._replace(this.config.queries.compare_by_country_cstat, v) :
                    query = this._replace(this.config.queries.compare_by_country, v);
                break;
            case 'SOURCE' :
                    query = this._replace(this.config.queries.compare_by_source, v);
                break;
        }

        var data = {
            datasource: this.config.dbName,
            thousandSeparator: ',',
            decimalSeparator: '.',
            decimalNumbers: 2,
            cssFilename: '',
            nowrap: false,
            valuesIndex: 0,
            json: JSON.stringify({
                query: query
            })
        };

        $.ajax({
            url: this.config.wdsUrl,
            data: data,
            type: 'POST',
            dataType: 'JSON',
            success: _.bind(function (data) {
                if (data.length === 0) {
                    return;
                }
                this.appendChart(data, this.getCode2Label(v, results))
            }, this),
            error: function (e) {
                console.error("WDS error: ");
                console.log(e)
            }
        });


    };

    App.prototype.appendChart = function (data, results) {

        this.results.printChart(data, results);
    };

    //Table

    App.prototype.performTableQuery = function (v, results) {

        var query;
        //switch (results.COMPARE) {
switch (results.COMPARE[0].code) {
                    
		  case 'ELEMENT' :
                query = this._replace(this.config.queries.compare_by_element, v);
                break;
            case 'PRODUCT' :
                query = this._replace(this.config.queries.compare_by_product, v);
                break;
            case 'COUNTRY' :
                query = this._replace(this.config.queries.compare_by_country, v);
                break;
        }
        var data = {
            datasource: this.config.dbName,
            thousandSeparator: ',',
            decimalSeparator: '.',
            decimalNumbers: 2,
            cssFilename: '',
            nowrap: false,
            valuesIndex: 0,
            json: JSON.stringify({
                query: query
            })
        };

        $.ajax({
            url: this.config.wdsUrl,
            data: data,
            type: 'POST',
            dataType: 'JSON',
            success: _.bind(function (data) {
                if (data.length === 0) {return;}
                this.appendTable(data)
            }, this),
            error: function (e) {
                console.error("WDS error: ");
                console.log(e)
            }
        });


    };
  App.prototype.performPivotQuery = function (v, results) {

        var query=this._replace(this.config.queries.compare_pivot,v);
    
        var data = {
            datasource: this.config.dbName,
            thousandSeparator: ',',
            decimalSeparator: '.',
            decimalNumbers: 2,
            cssFilename: '',
            nowrap: false,
            valuesIndex: 0,
            json: JSON.stringify({query: query})
        };

        $.ajax({
            url: this.config.wdsUrl,
            data: data,
            type: 'POST',
            dataType: 'JSON',
            success: _.bind(function (data) {this.results.printOlap(data);}, this),
            error: function (e) {
                console.error("WDS error: ");
                console.log(e)
            }
        });
    };
    App.prototype.appendTable = function (data) {this.results.printTable(data);	};
	App.prototype.appendPivot = function (data) {this.results.printOlap(data);  };

    //General

    App.prototype.buildFilterCombinations = function (results) {

        var query = {},queries = [];

        var compareCode = [],compareText = [];

        _.each(results[results.COMPARE[0].code], function (a) {
            compareCode.push(a.code);
            compareText.push(a.text);
        });

        results[results.COMPARE[0].code] = [{code: compareCode.join("','"), text: compareText.join(",")}];
        _.each(results.COUNTRY, function (c) {
            query = {
                COUNTRY: '',
                PRODUCT: '',
                ELEMENT: '',
                SOURCE: results['SOURCE'][0].code,
                KIND: results['KIND'][0].code
            };
            query.COUNTRY = "'" + c.code + "'";
            _.each(results.ELEMENT, function (e) {
                query.ELEMENT = "'" + e.code + "'";
                _.each(results.PRODUCT, function (p) {
                    query.PRODUCT = "'" + p.code + "'";
                    queries.push($.extend({}, query));
                });
            });
        });

        return queries;
    };

    App.prototype.showCourtesyMessage = function () {
        $(s.COURTESY).show();
        $(s.RESULTS).hide();
    };

    App.prototype.getCode2Label = function (s, i) {

        return {
            COUNTRY: _.find(i['COUNTRY'], function (item) {
                return ("'" + item.code + "'") === s['COUNTRY'];
            }).text,
            PRODUCT: _.find(i['PRODUCT'], function (item) {
                return ("'" + item.code + "'") === s['PRODUCT'];
            }).text,
            ELEMENT: _.find(i['ELEMENT'], function (item) {
                return ("'" + item.code + "'") === s['ELEMENT'];
            }).text,
            SOURCE: i['SOURCE'][0].text,
            KIND: i['KIND'][0].text,
            COMPARE: i['COMPARE'][0].text
        };
    };

    App.prototype._replace = function (str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            return data[key] || '';
        });
    };
    
    return App;
});
