/*global define*/
define([
    'underscore',
    'text!config/event_details_list.json',
    'text!html/event_details_template.html',
    'text!html/event_details_courtesy.html'
], function (_, events, template, courtesy) {

    'use strict';

    function Event(o) {
        this.events = JSON.parse(events);
        this.conf = o;
        this._renderEvent();
    }

    Event.prototype._renderEvent = function () {

        this.id = this.getQueryVariable('event');

        this.current = this.events[this.id];

        console.log(this.current)

        if (!this.current) {
            //Show courtesy message
            $(this.conf.el).html(_.template(courtesy));
        } else {

            var compiled = _.template(template);
            $(this.conf.el).html(compiled({model: this.current}));

            this.initInteractions();
        }
    };

    Event.prototype.initInteractions = function () {
    };

    Event.prototype.getQueryVariable = function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    };

    return Event;
});