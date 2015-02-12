define([
    'jquery',
    'text!config/authorized_users.json',
    'text!html/loginForm.html',
    'bootstrap',
    'amplify'
], function ($, AuthUsers, template) {

    'use strict';

    var s = {
        //login
        FORM_LOGIN: '#afo-login-form',
        MODAL_LOGIN: '#afo-login-modal',
        EMAIL_LOGIN: '#afo-login-form-inputEmail',
        PASSWORD_LOGIN: '#afo-login-form-inputPassword',
        ERROR_CONTAINER_LOGIN: '#afo-login-form-error-container',
        SUBMIT_LOGIN : "#afo-login-form-submit",
        //logout
        FORM_LOGOUT: '#afo-logout-form',
        MODAL_LOGOUT: '#afo-logout-modal',
        ERROR_CONTAINER_LOGOUT: '#afo-logout-form-error-container',
        SUBMIT_LOGOUT : "#afo-logout-form-submit",
        CANCEL_LOGOUT : "#afo-logout-form-cancel"
    };

    function AuthManager(){
        this.users = JSON.parse(AuthUsers);
        $('body').append(template);

        this.initVariables();
        this.bindEventListeners();
    }

    AuthManager.prototype.initVariables = function () {
        //login
        this.$modalLogin = $(s.MODAL_LOGIN);
        this.$formLogin = $(s.FORM_LOGIN);
        this.$emailLogin = $(s.EMAIL_LOGIN);
        this.$passwordLogin = $(s.PASSWORD_LOGIN);
        this.$errorContainerLogin = $(s.ERROR_CONTAINER_LOGIN);
        this.$submitLogin = $(s.SUBMIT_LOGIN);
        //logout
        this.$modalLogout = $(s.MODAL_LOGOUT);
        this.$submitLogout = $(s.SUBMIT_LOGOUT);
        this.$cancelLogout = $(s.CANCEL_LOGOUT);
    };

    AuthManager.prototype.bindEventListeners = function () {

        var self = this;

        //login
        amplify.subscribe('fx.menu.login', function () {
            self.$modalLogin.modal('show');
        });

        this.$submitLogin.on('submit', function (event) {
            event.preventDefault();
        });

        this.$submitLogin.on('click', function () {
            if ( self.$formLogin[0].checkValidity()){
                self._authenticate();
            }
        });

        //logout
        amplify.subscribe('fx.menu.logout', function () {
            self.$modalLogout.modal('show');
        });
        this.$cancelLogout.on('click', function () {
            self.$modalLogout.modal('hide');
        });
        this.$submitLogout.on('click', function () {
            self._logout();
        });
    };

    AuthManager.prototype._logout = function () {

        this.$modalLogout.modal('hide');
        console.warn("Logout success.");
        console.warn("Removing authenticated user details with key: 'afo.security.user'.");
        amplify.store.sessionStorage('afo.security.user', '' );
        amplify.publish('logout');

    };

    AuthManager.prototype._authenticate = function () {

        var email = this.$emailLogin.val(),
            password = this.$passwordLogin.val(),
            user= this.users[email];

        if ( user && user.password === password) {
            this._onAuthenticationSuccess(user);
        } else {
            this._onAuthenticationError();
        }
    };

    AuthManager.prototype._onAuthenticationSuccess = function (user) {

        this.$modalLogin.modal('hide');
        console.warn("Login success: broadcast user information.");
        console.warn("Storing authenticated user details with key: 'afo.security.user'.");
        amplify.store.sessionStorage('afo.security.user', user );
        amplify.publish('login', amplify.store.sessionStorage('afo.security.user'));
    };

    AuthManager.prototype._onAuthenticationError = function () {

        console.warn("Login fail.");
        this.$errorContainerLogin.html("Invalid login! Email and password do not match.");
    };

    return AuthManager;
});