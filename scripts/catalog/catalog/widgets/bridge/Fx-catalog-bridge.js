/*global define */

define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons"
], function ($, W_Commons) {

    var o = { },
        defaultOptions = {
            error_prefix: "Fx_catalog_bridge ERROR: ",
            url: 'http://faostat3.fao.org:7788/find/meta/',
            events: {
                END : "end.query.catalog.fx",
                EMPTY_RESPONSE: "empty_response.query.catalog.fx"
            }
        }, w_commons;

    function Fx_catalog_bridge() {
        w_commons = new W_Commons();
    }

    Fx_catalog_bridge.prototype.init = function (options) {

        //Merge options
        $.extend(o, defaultOptions);
        $.extend(o, options);

        return $(this);
    };

    Fx_catalog_bridge.prototype.query = function (src, callback, context) {
        var plugin;

        if (!window.Fx_catalog_bridge_plugins || typeof window.Fx_catalog_bridge_plugins !== "object") {
            throw new Error(o.error_prefix + " Fx_catalog_bridge_plugins plugins repository not valid.");
        } else {
            plugin = window.Fx_catalog_bridge_plugins[src.getName()];
        }

        if (!plugin) {
            throw new Error(o.error_prefix + " plugin not found.")
        }

        if (typeof plugin.init !== "function") {
            throw new Error(o.error_prefix + " plugin for " + src.getName() + " does not have a public init() method.");
        } else {
            plugin.init({component: src});
        }

        if (typeof callback !== "function") {
            throw new Error(o.error_prefix + " callback param is not a function");
        } else {

            //Ask the plugin the filter, make the request and pass data to callback()
            $.ajax({
                url: o.url,
                type: 'post',
                contentType: 'application/json',
                dataType: 'json',
                success: function (response, textStatus, jqXHR ) {

                    if(jqXHR.status !== 204){

                        if (context) {
                            $.proxy(callback, context, response)();
                        } else {
                            callback(response)
                        }

                    } else {
                        w_commons.raiseCustomEvent(
                            document.body,
                            o.events.EMPTY_RESPONSE,
                            { }
                        );
                    }

                },
                data: JSON.stringify(plugin.getFilter()),
                complete: function(){
                    w_commons.raiseCustomEvent(
                        document.body,
                        o.events.END,
                        { }
                    );
                }
            });
        }
    };

    return Fx_catalog_bridge;

});