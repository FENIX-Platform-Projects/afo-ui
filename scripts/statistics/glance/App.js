/*global define*/
define([
    'underscore',
    'fx-menu/start',
    'AuthenticationManager',
    'glance/Selectors',
    'glance/Results',
    'amplify'
], function (_, Menu, AuthenticationManager, Selectors, Results ) {

    'use strict';

    var c = {
        MENU_AUTH : 'config/fenix-ui-menu.json',
        MENU_PUBLIC: 'config/fenix-ui-menu-auth.json'
    }, s = {
        FOOTER: '.footer',
        SEARCH_BTN: '#search-btn'
    };

    function App() {
        this.state = {};
    }

    App.prototype.start = function() {

        //check if session is authenticated
        this.state.authenticated = amplify.store.sessionStorage('afo.security.user') === undefined;

        this._initSecurity();
        this._bindEventListeners();
        this._initPageStructure();
    };

    App.prototype._initPageStructure = function() {

        //Top menu
        this._initTopMenu();

        //Selectors: map and others
        this.selectors = new Selectors();

        //Results: table and charts
        this.results = new Results();

        //Footer
        $(s.FOOTER).load('html/footer.html');
    };

    App.prototype._bindEventListeners = function() {

        $(s.SEARCH_BTN).on('click', _.bind(function () {

            var results =  this.selectors.getFilter();

            if (results !== false) {
                this.query(results);
            }

        }, this));
    };

    App.prototype.query = function (results) {

        console.log(results)
    };

    App.prototype._initSecurity = function() {

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

    App.prototype._initTopMenu = function() {

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