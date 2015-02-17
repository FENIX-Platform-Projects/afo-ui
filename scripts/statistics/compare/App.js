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
            var results = this.selectors.getFilter();

            console.log(results)

            this.buildQuery(results);

           /* if (results !== false) {

                $(s.COURTESY).hide();
                $(s.RESULTS).show();

                this.queryChart(results);

            } else {

                $(s.COURTESY).show();
                $(s.RESULTS).hide();
            }*/

        }, this));
    };

    App.prototype.buildQuery = function (results) {
       /* fertilizer = '{PRODUCT}' and country = '{COUNTRY}' and n_p = '{KIND}'
       * data_source, element*/


        var query = { },
            queries= [],
            concat = {
                COUNTRY: '',
                PRODUCT: '',
                ELEMENT: ''
            };

        _.each(results.COUNTRY, function (a) {
            concat.COUNTRY += "'"+a+"',"
        });
        concat.COUNTRY = concat.COUNTRY.slice(0,  concat.COUNTRY.length -1);

        _.each(results.PRODUCT, function (a) {
            concat.PRODUCT += "'"+a+"',"
        });
        concat.PRODUCT = concat.PRODUCT.slice(0,  concat.PRODUCT.length -1);

        _.each(results.ELEMENT, function (a) {
            concat.ELEMENT += "'"+a+"',"
        });
        concat.ELEMENT = concat.ELEMENT.slice(0,  concat.ELEMENT.length -1);

        results[results.COMPARE] = [concat[results.COMPARE]];

        console.log(results)

        _.each(results.COUNTRY, function (c) {

            query = {
                COUNTRY: '',
                PRODUCT: '',
                ELEMENT: ''
            };

            query.COUNTRY =  "'"+c+"'";

            _.each(results.ELEMENT, function (e) {

                query.ELEMENT =  "'"+e+"'";

                _.each(results.PRODUCT, function (p) {

                    query.PRODUCT =  "'"+p+"'";

                    queries.push($.extend({}, query));
                });
            });
        });

        console.log(queries)

     };

    App.prototype.queryChart = function (results) {

        var data = {
            datasource:  this.config.dbName,
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
            url:  this.config.wdsUrl,
            data: data,
            type: 'POST',
            dataType: 'JSON',
            success: _.bind(function (data) {
                if (data.length > 0){
                    this.results.printChart(data)
                } else {
                   this.showCourtesyMessage()
                }

            } , this),
            error: function (e) {
                console.error("WDS error: ");
                console.log(e)
            }
        });

    };

    App.prototype.queryTable = function (results) {

        var data = {
            datasource:  this.config.dbName,
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
            url:  this.config.wdsUrl,
            data: data,
            type: 'POST',
            dataType: 'JSON',
            success: _.bind(function (data) {
                    this.results.printTable(data)
                } , this),
            error: function (e) {
                console.error("WDS error: ");
                console.log(e)
            }
        });

    };

    App.prototype.showCourtesyMessage = function(){
        $(s.COURTESY).show();
        $(s.RESULTS).hide();
    };

    App.prototype.prepareTableQuery = function (results) {

        var url =  results.SOURCE === 'cstat' ? this.config.queries.select_from_compare : this.config.queries.select_from_compare_cstat;
        return this._replace(url, results);
    };

    App.prototype.prepareChartQuery = function (results) {

        var url =  results.SOURCE === 'cstat' ? this.config.queries.select_from_compare_chart : this.config.queries.select_from_compare_chart_cstat

        return this._replace(url, results);
    };

    App.prototype._replace = function(str, data) {
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