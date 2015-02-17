/*global define*/
define([
    'underscore',
    'fx-menu/start',
    'AuthenticationManager',
    'compare/Results',
    'compare/Selectors',
    'text!config/services.json',
    'amplify'
], function (_, Menu, AuthenticationManager, Results, Selectors, Config) {

    'use strict';

    var c = {
        MENU_AUTH: 'config/fenix-ui-menu.json',
        MENU_PUBLIC: 'config/fenix-ui-menu-auth.json'
    }, s = {
        FOOTER: '.footer',
        SEARCH_BTN: '#search-btn',
        COURTESY: '#afo-courtesy',
        RESULTS: '#afo-results'
    };

    function App() {
        this.state = {};
        this.config = JSON.parse(Config);
    }

    App.prototype.start = function () {

        //check if session is authenticated
        this.state.authenticated = amplify.store.sessionStorage('afo.security.user') === undefined;

        this._initSecurity();
        this._bindEventListeners();
        this._initPageStructure();
    };

    App.prototype._initPageStructure = function () {

        //Top menu
        this._initTopMenu();

        //Selectors: map and others
        this.selectors = new Selectors();

        //Results: table and charts
        this.results = new Results();

        //Footer
        $(s.FOOTER).load('html/footer.html');
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

    App.prototype.getCode2Label = function (s, i) {

        return  {
            COUNTRY: _.find(i['COUNTRY'], function (item) { return ("'"+item.code+"'") === s['COUNTRY']; }).text,
            PRODUCT:_.find(i['PRODUCT'], function (item) { return ("'"+item.code+"'") === s['PRODUCT']; }).text,
            ELEMENT: _.find(i['ELEMENT'], function (item) { return ("'"+item.code+"'") === s['ELEMENT']; }).text,
            SOURCE: i['SOURCE'][0].text,
            KIND: i['KIND'][0].text,
            COMPARE: i['COMPARE'][0].text
        };


    };

    App.prototype.performChartQuery = function (v, results) {

        var query;

        switch (results.COMPARE[0].code) {
            case 'ELEMENT' :
/*                if (results.SOURCE === 'cstat'){
                    query = this._replace(this.config.queries.compare_by_element_cstat, v);
                }*/
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
                if (data.length ===0){
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

    App.prototype.performTableQuery = function (v, results) {

        var query;

        switch (results.COMPARE) {
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

                if (data.length ===0){
                    return;
                }

                this.appendTable(data)
            }, this),
            error: function (e) {
                console.error("WDS error: ");
                console.log(e)
            }
        });


    };

    App.prototype.appendTable = function (data) {
        this.results.printTable(data);
    };

    App.prototype.appendChart = function (data, results) {

        this.results.printChart(data, results);
    };

    App.prototype.buildQuery = function (results) {

        var query = {},
            queries = [];

        var temp = [];

        _.each(results[results.COMPARE], function (a) {
            temp.push(a.code);
        });

        results[results.COMPARE] = [temp.join("','")];

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
                    this.results.printChart(data, results)
                } else {
                    this.showCourtesyMessage()
                }

            }, this),
            error: function (e) {
                console.error("WDS error: ");
                console.log(e)
            }
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
            }, this),
            error: function (e) {
                console.error("WDS error: ");
                console.log(e)
            }
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

    App.prototype._initSecurity = function () {

        var self = this;

        /*Login*/
        this.authManager = new AuthenticationManager();

        amplify.subscribe('login', function () {
            console.warn("Event login intercepted");
            self.state.authenticated = true;
            self._initTopMenu()
        });

        amplify.subscribe('logout', function () {
            console.warn("Event logout intercepted");
            self.state.authenticated = true;
            self._initTopMenu()
        });
    };

    App.prototype._initTopMenu = function () {

        //Top Menu
        this.topMenu = new Menu({
            active: 'statistics_compare',
            url: this.state.authenticated ? c.MENU_AUTH : c.MENU_PUBLIC,
            className: 'fx-top-menu',
            breadcrumb: {
                active: true,
                container: "#breadcumb_container",
                showHome: true
            }
        });
    };

    return App;
});