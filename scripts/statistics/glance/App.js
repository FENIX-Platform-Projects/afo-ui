/*global define*/
define([
    'underscore',
    'fx-menu/start',
    'AuthenticationManager',
    'glance/Results',
    'glance/Selectors',
    'config/services',
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
        RESULTS: '#afo-results',
        RESUME : '#afo-resume'
    };

    function App() {
        this.state = {};
        this.config = Config;
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

        $(s.SEARCH_BTN).on('click', _.bind(this.query, this));

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
                    $value =  $('<b>', {text : resume[key][0].text }),
                    lab;

                switch(key){
                    case 'COUNTRY': lab = 'Africa Country '; break;
                    case 'KIND' :  lab = 'View in '; break;
                    case 'SOURCE' :  lab = 'Data Source '; break;
                    case 'PRODUCT' :  lab = 'Fertilizer '; break;
                }

                $label.html(lab);

                $li.append($label).append($value);
                $(s.RESUME).append($li)
            }
        })
    };

    App.prototype.query = function () {

        var results = this.selectors.getFilter();

        if (results !== false) {
            $(s.COURTESY).hide();
            $(s.RESULTS).show();

            this.queryChart(results);
            this.queryTable(results);
        }
    };

    //Chart
    App.prototype.prepareChartQuery = function (results) {
        var url = results.SOURCE[0].code === 'cstat' ? this.config.queries.select_from_compare_chart_cstat : this.config.queries.select_from_compare_chart;

        return this._replace(url, {
            COUNTRY: results.COUNTRY[0].code,
            SOURCE: results.SOURCE[0].code,
            KIND: results.KIND[0].code,
            PRODUCT: results.PRODUCT[0].code
        });
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
                    this._showCourtesyMessage()
                }

            }, this),
            error: function (e) {
                console.error("WDS error: ");
                console.log(e)
            }
        });

    };

    //Table
    App.prototype.prepareTableQuery = function (results) {

        var url = results.SOURCE[0].code === 'cstat' ? this.config.queries.select_from_compare_cstat : this.config.queries.select_from_compare;
        return this._replace(url, {
            COUNTRY: results.COUNTRY[0].code,
            SOURCE: results.SOURCE[0].code,
            KIND: results.KIND[0].code,
            PRODUCT: results.PRODUCT[0].code
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

    // General
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

    App.prototype._showCourtesyMessage = function () {
        $(s.COURTESY).show();
        $(s.RESULTS).hide();
    };

    App.prototype._initTopMenu = function () {

        //Top Menu
        this.topMenu = new Menu({
            active: 'statistics_glance',
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