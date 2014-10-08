/*global define */

define([
    'jquery'
], function ($) {

    var o = {
        events : {
            ANALYZE_SUB : 'clickResultAnalyze',
            ANALYZE: 'resultAnalyze'
        }
    };

    function ResultsController() {
    }

    //(injected)
    ResultsController.prototype.grid = undefined;

    //(injected)
    ResultsController.prototype.resultsRenderer = undefined;

    ResultsController.prototype.renderComponents = function () {
        this.grid.render();
    };

    ResultsController.prototype.preValidation = function () {

        if (!this.grid) {
            throw new Error("ResultsController: INVALID GRID ITEM.")
        }
        if (!this.resultsRenderer) {
            throw new Error("ResultsController: INVALID RENDER ITEM.")
        }
    };

    ResultsController.prototype.render = function () {
        this.preValidation();
        this.initEventListeners();
        this.renderComponents();
    };

    ResultsController.prototype.addItems = function (response) {

        this.grid.clear();

        if (response) {
            var items = response.resources;

            for (var i = 0; i < items.length; i++) {
                this.grid.addItems(this.resultsRenderer.getInstance(items[i]));
            }
        }
    };

    ResultsController.prototype.clear = function () {
        this.grid.clear();
    };

    ResultsController.prototype.initEventListeners = function(){

        $('body').on(o.events.ANALYZE_SUB, function (e, payload) {
            //Listen to it on Fx-catalog-page
            $(e.currentTarget).trigger(o.events.ANALYZE, [payload]);
        });
    };

    return ResultsController;

});