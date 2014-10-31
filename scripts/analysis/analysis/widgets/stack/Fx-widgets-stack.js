/*global define */

define([
    'jquery',
    'fx-ana/widgets/stack/Fx-stack-items-renderer',
    'text!fx-ana/html/widgets/fx-widgets-stack/template.html',
    //third party libraries
    'lib/mbExtruder',
    'lib/jquery.mb.flipText',
    'lib/jquery.hoverIntent'
], function ($, Renderer, template) {

    'use strict';

    var o = { },
        defaultOptions = {
            interaction: "click",
            panel: {
                positionFixed: true,
                sensibility: 800,
                position: "right", // left, right, bottom
                extruderOpacity: .5,
                width: 280,
                //flapDim: 100,
                textOrientation: "bt", // or "tb" (top-bottom or bottom-top)
                onExtOpen: function () {
                },
                onExtContentLoad: function () {
                },
                onExtClose: function () {
                },
                hidePanelsOnClose: true,
                autoCloseTime: 0, // 0=never
                slideTimer: 300
            }
        },
        selectors = {
            LIST: "#fx-ws-list",
            CLOSE_BTN: "#fx-ws-close-btn"
        },
        events = {
            CREATE_PANEL: "",
            ADD_ITEM: "",
            REMOVE_ITEM: ""
        };

    function FxWidgetsStack(options) {
        $.extend(true, o, defaultOptions, options);
    }

    FxWidgetsStack.prototype.init = function (options) {
        $.extend(true, o, defaultOptions, options);
        return this;
    };

    FxWidgetsStack.prototype.render = function () {
        this.createPanel();
        //init counter
        $(o.counter).html(0)
    };

    FxWidgetsStack.prototype.createPanel = function () {

        this.$panel = $(o.container);

        //Inject template
        this.$panel.html(template);

        this.$panel.buildMbExtruder(o.panel);

        //always after buildMbExtruder()
        this.initPanelBtns();
    };

    FxWidgetsStack.prototype.initPanelBtns = function () {

        //Close button
        this.$panel.find(selectors.CLOSE_BTN).html('Close panel').on(o.interaction, $.proxy(this.closePanel, this));
        $(o.open).on('click', $.proxy(this.openPanel, this))
    };

    FxWidgetsStack.prototype.openPanel = function (bool) {
        this.$panel.openMbExtruder(bool || true);
    };

    FxWidgetsStack.prototype.closePanel = function () {
        this.$panel.closeMbExtruder();
    };

    FxWidgetsStack.prototype.createItem = function (container, item) {

        return new Renderer().renderItem(container, item);
    };

    FxWidgetsStack.prototype.addItem = function (item) {
        this.increaseCounter();

        var container = document.createElement('li');
        this.$panel.find(selectors.LIST).append(container);
        this.createItem( container, item);
        this.$panel.trigger(events.ADD_ITEM, [item]);
    };

    FxWidgetsStack.prototype.removeItem = function (item) {
        this.decreaseCounter();
        this.$panel.find($(item)).fadeOut('fast', function () {
            $(this).remove();
        });
    };

    FxWidgetsStack.prototype.increaseCounter = function () {

        $(o.counter).html( (parseInt($(o.counter).html()) || 0) + 1 );

    };

    FxWidgetsStack.prototype.decreaseCounter = function () {
        $(o.counter).html( (parseInt($(o.counter).html()) || 0) - 1 );
    };

    return FxWidgetsStack;
});