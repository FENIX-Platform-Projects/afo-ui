/*global define */

define([
    'jquery',
    'fx-ana/widgets/desk/renderes/Fx-desk-item-ds',
    'text!fx-ana/html/widgets/desk/items/structure.html',
    'bootstrap'
], function ($, DataSetRenderer, template) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        selectors: {
            buttons: {
                MINIMIZE: "#btn-minimize-",
                RESIZE: "#btn-resize-",
                CLONE: "#btn-clone-",
                REMOVE: "#btn-remove-"
            }
        },
        events: {
            RESIZE_ITEM: "resizeDeskItem",
            CLONE_ITEM: 'cloneDeskItem',
            REMOVE_ITEM: "removeItemFromDesk",
            MINIMIZE_ITEM: "minimizeDeskItem"
        }
    };

    function GridItemRenderer(options) {

        if (this.o === undefined) {
            this.o = {};
        }
        $.extend(true, this.o, defaultOptions, options);
        this.ds = new DataSetRenderer();
    }

    GridItemRenderer.prototype.renderItem = function (container, model) {

        this.container = container;
        this.model = model;
        this.$template = $(template);

        this.initEventListeners();

        this.initBlankTemplate(container);

        //TODO add logic to discriminate if the resource shown is a dataset, a codelist or else
        this.ds.renderItem(this.$template,  this.model);
    };

    GridItemRenderer.prototype.initBlankTemplate = function (container) {

        this.generateId();

        this.initButtons();

        //Init bootstrap
        $(template).find('UL').tab();

        $(container).append(this.$template);
    };

    GridItemRenderer.prototype.generateId = function () {

        var r = 'REPLACE';
        window.fx_dynamic_id_counter > -1 ? window.fx_dynamic_id_counter++ : window.fx_dynamic_id_counter = 0;
        this.id = window.fx_dynamic_id_counter;

        this.$template.find("[id*='" + r + "'], [href*='" + r + "']").each(function () {

            var o = $(this).attr('id');
            if (o) $(this).attr('id', o.replace(r, window.fx_dynamic_id_counter));
            o = $(this).attr('href');
            if (o) $(this).attr('href', o.replace(r, window.fx_dynamic_id_counter));
        });
    };

    GridItemRenderer.prototype.initButtons = function () {

        this.$template.find(this.o.selectors.buttons.REMOVE + this.id).on(this.o.interaction, {self: this}, function (e) {
            $(this).trigger(e.data.self.o.events.REMOVE_ITEM, [e.data.self.container.parentNode, e.data.self.model]);
        });

        this.$template.find(this.o.selectors.buttons.CLONE + this.id).on(this.o.interaction, {self: this}, function (e) {
            $(this).trigger(e.data.self.o.events.CLONE_ITEM, [e.data.self.model]);
        });

        this.$template.find(this.o.selectors.buttons.RESIZE + this.id).on(this.o.interaction, {self: this}, function (e) {
            $(this).trigger(e.data.self.o.events.RESIZE_ITEM, [e.data.self.container.parentNode]);
            $(this).resize();
            $(window).trigger('resize');
        });

        this.$template.find(this.o.selectors.buttons.MINIMIZE + this.id).on(this.o.interaction, {self: this}, function (e) {
            $(this).trigger(e.data.self.o.events.MINIMIZE_ITEM, [e.data.self.container.parentNode, e.data.self.model]);
        });
    };

    GridItemRenderer.prototype.initEventListeners = function () {

        this.$template.find('a[data-toggle="tab"]').on('shown.bs.tab', {self : this}, function (e) {
            e.data.self.ds.buildChart($(e.target).data('chart'))
        });
    };

    return GridItemRenderer;
});