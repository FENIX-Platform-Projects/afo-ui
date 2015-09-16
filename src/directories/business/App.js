/*global define*/
define([
    'underscore',
    'src/directories/business/Results',
    'src/directories/business/Selectors',
    'config/services',
    'amplify'
], function (_, Results, Selectors, Config) {

    'use strict';

    var s = {
        SEARCH_BTN: '#search-btn',
        COURTESY: '#afo-courtesy',
        RESULTS: '#afo-results'
    };

    function App() {
        this.state = {};
        this.config = Config;
    }

    App.prototype.start = function () {

   //     this._bindEventListeners();
        this._initPageStructure();
    };

    App.prototype._initPageStructure = function () {

        //Selectors: map and others
        this.selectors = new Selectors();

        //Results: table and charts
        this.results = new Results();
    };

    App.prototype._bindEventListeners = function () {

        $(s.SEARCH_BTN).on('click', _.bind(function () {
            var results = this.selectors.getFilter(),
                values;

            if (results === false) {
                return;
            }

            values = this.buildQuery(results);
            this.results.empty();

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

        }, this));
    };


    App.prototype.performTableQuery = function (v, results) {

        var query;

        switch (results.COMPARE) {
             case 'PRODUCT' :
                query = this._replace(this.config.queries.directory_business_product, v);
                break;
            case 'COUNTRY' :
                query = this._replace(this.config.queries.directory_business_country, v);
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

                if (data.length ===0){
                    return;
                }

                this.appendTable(data)
            }, this)
        });


    };

    App.prototype.appendTable = function (data) {
        this.results.printTable(data);
    };

    App.prototype.appendChart = function (data) {

        this.results.printChart(data);
    };

    App.prototype.buildQuery = function (results) {

        var query = {},
            queries = [];

        var temp = [];

        _.each(results[results.COMPARE], function (a) {
            temp.push(a);
        });

        results[results.COMPARE] = [temp.join("','")];

        _.each(results.COUNTRY, function (c) {

            query = {
                COUNTRY: '',
                PRODUCT: '',
                ELEMENT: '',
                SOURCE: results['SOURCE'],
                KIND: results['KIND']
            };

            query.COUNTRY = "'" + c + "'";

            _.each(results.ELEMENT, function (e) {

                query.ELEMENT = "'" + e + "'";

                _.each(results.PRODUCT, function (p) {

                    query.PRODUCT = "'" + p + "'";

                    queries.push($.extend({}, query));
                });
            });
        });

        return queries;

    };

    App.prototype.queryChart = function (results) {

        var data = {
            datasource: this.config.dbName,
            thousandSeparator: ',',
            decimalSeparator: '.',
            decimalNumbers: 2,
            cssFilename: '',
            nowrap: false,
            valuesIndex: 0,
            json: JSON.stringify({
                query: this.prepareChartQuery(results)
            })
        };

        $.ajax({
            url: this.config.wdsUrl,
            data: data,
            type: 'POST',
            dataType: 'JSON',
            success: _.bind(function (data) {
                if (data.length > 0) {
                    this.results.printChart(data)
                } else {
                    this.showCourtesyMessage()
                }

            }, this)
        });

    };

    App.prototype.queryTable = function (results) {

        var data = {
            datasource: this.config.dbName,
            thousandSeparator: ',',
            decimalSeparator: '.',
            decimalNumbers: 2,
            cssFilename: '',
            nowrap: false,
            valuesIndex: 0,
            json: JSON.stringify({
                query: this.prepareTableQuery(results)
            })
        };

        $.ajax({
            url: this.config.wdsUrl,
            data: data,
            type: 'POST',
            dataType: 'JSON',
            success: _.bind(function (data) {
                this.results.printTable(data)
            }, this)
        });

    };

    App.prototype.showCourtesyMessage = function () {
        $(s.COURTESY).show();
        $(s.RESULTS).hide();
    };

    App.prototype.prepareTableQuery = function (results) {

        var url = results.SOURCE === 'cstat' ? this.config.queries.select_from_compare : this.config.queries.select_from_compare_cstat;
        return this._replace(url, results);
    };

    App.prototype.prepareChartQuery = function (results) {

        var url = results.SOURCE === 'cstat' ? this.config.queries.select_from_compare_chart : this.config.queries.select_from_compare_chart_cstat

        return this._replace(url, results);
    };

    App.prototype._replace = function (str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            return data[key] || '';
        });
    };

    return App;
});