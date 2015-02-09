define([
    'jquery',
    'text!config/authorized_users.json',
    'amplify'
], function ($, AuthUsers) {

    'use strict';

    var s = {
        FORM: '#afo-login-form',
        MODAL: '#afo-login-modal',
        EMAIL: '#afo-login-form-inputEmail',
        PASSWORD: '#afo-login-form-inputPassword',
        ERROR_CONTAINER: '#afo-login-form-error-container',
        SUBMIT : "#afo-login-form-submit"
    };

    function AuthManager(){
        this.users = JSON.parse(AuthUsers);
        this.initVariables();
        this.bindEventListeners();
    }

    AuthManager.prototype.initVariables = function () {
        this.$modal = $(s.MODAL);
        this.$form = $(s.FORM);
        this.$email = $(s.EMAIL);
        this.$password = $(s.PASSWORD);
        this.$errorContainer = $(s.ERROR_CONTAINER);
        this.$submit = $(s.SUBMIT)
    };

    AuthManager.prototype.bindEventListeners = function () {

        var self = this;

        amplify.subscribe('fx.menu.login', function () {
            self.$modal.modal('show');
        });

        this.$submit.on('submit', function (event) {
            event.preventDefault();
        });

        this.$submit.on('click', function () {
            if ( self.$form[0].checkValidity()){
                self._authenticate();
            }
        });
    };

    AuthManager.prototype._authenticate = function () {

        var email = this.$email.val(),
            password = this.$password.val(),
            user= this.users[email];

        if ( user && user.password === password) {
            this._onAuthenticationSuccess(user);
        } else {
            this._onAuthenticationError();
        }
    };

    AuthManager.prototype._onAuthenticationSuccess = function (user) {

        this.$modal.modal('hide');
        console.warn("Login success: broadcast user information.");
        console.warn("Storing authenticated user details with key: 'afo.security.user'.");
        amplify.store.sessionStorage('afo.security.user', user );
        amplify.publish('login', amplify.store.sessionStorage('afo.security.user'));
    };

    AuthManager.prototype._onAuthenticationError = function () {

        console.warn("Login fail.");
        this.$errorContainer.html("Invalid login! Email and password do not match.");
    };

    return AuthManager;
});