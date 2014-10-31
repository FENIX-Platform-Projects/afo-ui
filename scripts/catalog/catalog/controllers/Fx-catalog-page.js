/*global define */

define([
    'jquery',
    'lib/nprogress',
    'pnotify',
    'lib/pnotify.nonblock'
], function ($, NProgress, PNotify) {

    var o = {
        events: {
            ANALYZE_SUB: 'resultAnalyze',
            ANALYZE: 'analyze'
        },
        storage: {
            CATALOG: 'fx.catalog'
        }
    };

    function PageController() {
    }

    //(injected)
    PageController.prototype.storage = undefined;

    //(injected)
    PageController.prototype.filter = undefined;

    //(injected)
    PageController.prototype.bridge = undefined;

    //(injected)
    PageController.prototype.results = undefined;

    PageController.prototype.renderComponents = function () {
        this.filter.render();
        this.results.render();
    };

    PageController.prototype.initEventListeners = function () {

        var self = this;

        document.body.addEventListener("submit.catalog.fx", function () {
            NProgress.start();
            self.bridge.query(self.filter, self.results.addItems, self.results);
            //self.filter.collapseFilter();
        }, false);

        document.body.addEventListener("end.query.catalog.fx", function () {
            NProgress.done();
        }, false);

        document.body.addEventListener("empty_response.query.catalog.fx", function () {

            self.results.clear();

            new PNotify({
                title: 'No Result Notice',
                text: 'The request has no results',
                type: 'error',
                nonblock: {
                    nonblock: true
                }
            });
        }, false);

        $('body').on(o.events.ANALYZE_SUB, function (e, payload) {

            self.storage.getItem(o.storage.CATALOG, function (item) {
                var a = JSON.parse(item) || [];
                a.push(payload.metadata.uid);
                self.storage.setItem(o.storage.CATALOG, JSON.stringify(a));
                $(e.currentTarget).trigger(o.events.ANALYZE, [payload.metadata.uid]);
            });
        });
    };

    PageController.prototype.preValidation = function () {
        if (!this.filter) {
            throw new Error("PAGE CONTROLLER: INVALID FILTER ITEM.")
        }
    };

    PageController.prototype.render = function () {

        this.preValidation();
        this.initEventListeners();
        this.renderComponents();
    };

    return PageController;

});