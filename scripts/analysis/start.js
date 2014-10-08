/*global define */

define([
    'jquery',
    'fx-ana/controllers/Fx-analysis-page',
    'fx-cat-br/widgets/storage/SessionStorage',
    'fx-ana/widgets/stack/Fx-widgets-stack',
    'fx-ana/controllers/Fx-analysis-desk',
    'fx-cat-br/structures/Fx-fluid-grid',
    'fx-ana/widgets/bridge/Bridge'
], function ($, Controller, Storage, Stack, Desk, Grid, Bridge) {

    var o = {};

    function Start(options) {
        $.extend(true, o, options);
    }

    Start.prototype.init = function (options) {

        $.extend(true, o, options);

        var pageController = new Controller();

        $.extend(pageController, {
            catalog: this.initCatalog(o.catalog),
            stack: this.initStack(),
            desk: this.initDesk(),
            storage: new Storage(),
            bridge : new Bridge()
        });

        pageController.render();
    };

    Start.prototype.initDesk = function (g) {

        var grid = new Grid().init({
            container: document.querySelector('#fx-ana-result-container'),
            drag: {
                handle: '.fx-handle',
                containment: '#fx-ana-result-container'
            },
            config: {
                itemSelector: '.fx-analysis-item',
                columnWidth: '.fx-analysis-item',
                rowHeight: '.fx-analysis-item'
            }
        });

        return  $.extend(new Desk(), {
            grid : grid
        });
    };

    Start.prototype.initCatalog = function (c) {

        return c.init({
            container: document.querySelector('#catalogContainer'),
            manualRender: true
        });
    };

    Start.prototype.initStack = function () {

        return new Stack().init({
            container: "#fx-widgets-stack",
            open : '#fx-widgets-stack-btn',
            counter : '#fx-widgets-stack-counter'
        });
    };

    return Start;
});
