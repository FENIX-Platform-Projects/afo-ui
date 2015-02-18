/*global define*/
define([
    'events/Event',
    'fx-menu/start',
    'AuthenticationManager',
    'amplify'
], function (Event, Menu, AuthenticationManager) {

    'use strict';

    var s = {
        EVENT_CONTAINER : '#event_container',
        FOOTER: '.footer'
    }, c = {
        MENU_AUTH: 'config/fenix-ui-menu.json',
        MENU_PUBLIC: 'config/fenix-ui-menu-auth.json'
    };

    function App(){
        this.state = {};
    }

    App.prototype.start = function () {

        //check if session is authenticated
        this.state.authenticated = amplify.store.sessionStorage('afo.security.user') === undefined;

        this._initSecurity();
        this._bindEventListeners();
        this._initPageStructure();
    };


    //General
    App.prototype._initPageStructure = function () {

        //Top menu
        this._initTopMenu();

        //Event Renderer
        this.event = new Event({
            el: s.EVENT_CONTAINER
        });

        //Footer
        $(s.FOOTER).load('html/footer.html');
    };

    App.prototype._initTopMenu = function () {

        //Top Menu
        this.topMenu = new Menu({
/*            active: 'events',*/
            url: this.state.authenticated ? c.MENU_AUTH : c.MENU_PUBLIC,
            className: 'fx-top-menu',
            breadcrumb: {
                container: "#breadcumb_container",
                showHome: true
            }
        });
    };

    App.prototype._bindEventListeners = function () {

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


    return App;
});