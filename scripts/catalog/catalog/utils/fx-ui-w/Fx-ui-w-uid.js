define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons"
], function ($, W_Commons) {

    var o = {
     lang : 'EN',
        events: {
            READY : "fx.catalog.module.ready"
        }
    }, w_commons;

    function Fx_ui_w_Name() {
        w_commons = new W_Commons();
    }

    Fx_ui_w_Name.prototype.validate = function (e) {
        return true;
    };

    Fx_ui_w_Name.prototype.render = function (e, container) {

        o.container = container;
        o.module = e;

        var text = document.createElement('INPUT');
        text.setAttribute("type", "TEXT");

        if (e.component.hasOwnProperty("rendering")) {
            if (e.component.rendering.hasOwnProperty("placeholder")) {

                if (e.component.rendering.placeholder.hasOwnProperty(o.lang)) {
                    text.setAttribute("placeholder", e.component.rendering.placeholder[o.lang]);
                } else {
                    text.setAttribute("placeholder", e.component.rendering.placeholder['EN']);
                }
            }
        }

        if (e.component.rendering.hasOwnProperty("htmlattributes")) {

            Object.keys(e.component.rendering.htmlattributes).forEach(function (entry) {
                text[entry] = e.component.rendering.htmlattributes[entry];
            });

        }

        $(text).focusout( {w_commons : w_commons, type: o.module.type }, function(e){

            e.data.w_commons.raiseCustomEvent(
                o.container,
                o.events.READY,
                { value : $(o.container).find("input").val(),
                  module:  e.data.type }
            );
        });

        $(container).append(text);
    };

    Fx_ui_w_Name.prototype.getValue = function (e) {
        return [{ enumeration :  $("#" + e.id + " > input").val()}];
    };

    return Fx_ui_w_Name;
});