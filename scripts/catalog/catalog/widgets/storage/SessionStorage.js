define([
    'jquery'
], function ($, Backbone, config) {
    'use strict';

    function Storage() {
    }

    /**
     Method retrieves item from local storage.

     @method getItem
     @param {String} storageKey
     @param {Function} success
     **/
    Storage.prototype.getItem = function (storageKey, success) {
        return success(window.sessionStorage.getItem(storageKey));
    };

    /**
     Method sets item into session storage.

     @method setItem
     **/
    Storage.prototype.setItem = function (storageKey, json) {
        window.sessionStorage.setItem(storageKey, json);
    };

    /**
     Method removes item from session storage.

     @method setItem
     **/
    Storage.prototype.removeItem = function (storageKey) {
        window.sessionStorage.removeItem(storageKey);
    };

    /**
     Entry point for the session storage implementation.

     @method init
     **/
    Storage.prototype.init = function () {
    };

    return Storage;
});