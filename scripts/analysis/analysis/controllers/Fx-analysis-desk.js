/*global define */

define([
    'jquery',
    'fx-ana/widgets/desk/Fx-desk-items-renderer'
], function ($, Renderer) {

    var defaultOptions = {
        selectors: {
            EVENTS_LISTENERS: 'body'
        },
        events: {
            CREATE_PANEL: "",
            ADD_ITEM: "",
            RESIZE_ITEM: "resizeDeskItem",
            CLONE_ITEM: 'cloneDeskItem',
            REMOVE_ITEM: "removeItemFromDesk",
            MINIMIZE_ITEM: "minimizeDeskItem"
        }
    };

    //(injected)
    DeskController.prototype.grid = undefined;

    function DeskController(options) {

        if (this.o === undefined) {
            this.o = {};
        }
        $.extend(true, this.o, defaultOptions, options);
    }

    DeskController.prototype.preValidation = function () {

        if (!this.grid) {
            throw new Error("DeskController: INVALID GRID ITEM.")
        }
    };

    DeskController.prototype.renderComponents = function () {
        this.grid.render();
    };

    DeskController.prototype.initEventListeners = function () {

        var self = this;

        $(this.o.selectors.EVENTS_LISTENERS).on(this.o.events.RESIZE_ITEM, function (e, container) {
            self.resizeItem(container);
        });
    };

    DeskController.prototype.render = function () {

        this.preValidation();
        this.renderComponents();
        this.initEventListeners();
    };

    DeskController.prototype.addItem = function (item) {

        var container = document.createElement('DIV'),
            handler = document.createElement('DIV'),
            content = document.createElement('DIV');

        container.className = 'fx-analysis-item';
        handler.className = "fx-handle";

        container.appendChild(handler);
        container.appendChild(content);
        this.grid.addItem(container);

        new Renderer().renderItem(content, item);
    };

    DeskController.prototype.resizeItem = function (item) {
        this.grid.resize(item);
    };

    DeskController.prototype.removeItem = function (item) {
        this.grid.removeItem(item);
    };

    DeskController.prototype.clear = function () {

        this.grid.clear();
    };

    return DeskController;
});