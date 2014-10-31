/*global define */

define([
    'jquery',
    'text!fx-ana/html/widgets/fx-widgets-stack/item-structure.html'
], function ($, template) {

    'use strict';

    var defaultOptions = {
            interaction: "click",
            selectors : {
                'MOVE_TO_DESk' : ".fx-sessionstore-item-movemetodesk",
                'REMOVE' : ".fx-sessionstore-item-removeme",
                'TITLE' : ".fx-sessionstore-item-title",
                "DESCRIPTION" : ".fx-sessionstore-item-info"
            },
            events : {
                MOVE_TO_DESK: "moveToDesk",
                REMOVE_ITEM: "removeStackItem"
            }
        };

    function DataSetRender(options) {
        if (this.o === undefined) {
            this.o = {};
        }
        $.extend(true, this.o, defaultOptions, options);
    }
    
    DataSetRender.prototype.initStructure = function () {

        this.$template = $(template);

        this.$template.find(this.o.selectors.MOVE_TO_DESk).on(this.o.interaction, {self: this}, function(e){
            $(this).trigger(e.data.self.o.events.MOVE_TO_DESK, [e.data.self.model, e.data.self.container])
        });

        this.$template.find(this.o.selectors.REMOVE).on(this.o.interaction, {self: this}, function(e){
            $(this).trigger(e.data.self.o.events.REMOVE_ITEM, [e.data.self.model, e.data.self.container]);
        });

        var title = 'undefiend';
        if (this.model.resources[0].metadata.title) {
            title = this.model.resources[0].metadata.title['EN'] || this.model.resources[0].metadata.title[Object.keys(this.model.resources[0].metadata.title)[0]];
        }

        var desc = 'undefined';
        if (this.model.resources[0].metadata.description ){
            desc =  this.model.resources[0].metadata.description['EN'] || this.model.resources[0].metadata.description[Object.keys(this.model.resources[0].metadata.description)[0]];
        }


        this.$template.find(this.o.selectors.TITLE).html(title);

        this.$template.find(this.o.selectors.DESCRIPTION).html(desc);

    };

    DataSetRender.prototype.renderItem = function ( container, model ) {

        this.model = model;
        this.container = container;
        this.initStructure();

        $(container).append(this.$template);
    };

    return DataSetRender;
});