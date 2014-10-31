/*global define */

define([
    'jquery',
    'fx-ana/widgets/stack/renderes/Fx-stack-item-ds'
], function ($, DataSetRenderer) {

    'use strict';

    var o = { },
        defaultOptions = {
            interaction: "click"
        },
        selectors = {
        },
        events = {
            CREATE_PANEL: "",
            ADD_ITEM: "",
            REMOVE_ITEM: ""
        };

    function StackItemRenderer(options) {
        $.extend(true, o, defaultOptions, options);
        this.ds = new DataSetRenderer();
    }

    StackItemRenderer.prototype.renderItem = function ( container, item ) {
        this.ds.renderItem(container, item);
    };

    return StackItemRenderer;
});