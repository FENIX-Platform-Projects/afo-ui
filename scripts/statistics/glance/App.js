/*global define*/
define([
    'underscore',
    'fx-menu/start',
    'AuthenticationManager',
    'glance/Results',
    'glance/Selectors',
    'text!config/services.json',
    'amplify'
], function (_, Menu, AuthenticationManager, Results, Selectors, Config) {

    'use strict';

    var c = {
        MENU_AUTH: 'config/fenix-ui-menu.json',
        MENU_PUBLIC: 'config/fenix-ui-menu-auth.json'
    }, s = {
        FOOTER: '.footer',
        SEARCH_BTN: '#search-btn'
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

            if (results !== false) {
                this.query(results);
            }

        }, this));
    };

    App.prototype.query = function (results) {

console.log(results);

        var data = {
            datasource:  this.config.dbName,
            thousandSeparator: ',',
            decimalSeparator: '.',
            decimalNumbers: 2,
            cssFilename: '',
            nowrap: false,
            valuesIndex: 0,
            json: JSON.stringify({
                query: this.prepareQuery(results)
            })
        };

        $.ajax({
            url:  this.config.wdsUrl,
            data: data,
            type: 'POST',
            dataType: 'JSON',
            success: _.bind(this._printResults, this),
            error: function (e) {
                console.error("WDS error: " + e);
            }
        });

    };

    App.prototype.prepareQuery = function (results) {

        return _replace(this.config.queries.select_from_compare, results);

        function _replace(str, data) {
            return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
                return data[key] || '';
            });
        }

    };

    App.prototype._printResults = function ( data) {

        this.results.render(data);
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
            active: 'statistics',
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