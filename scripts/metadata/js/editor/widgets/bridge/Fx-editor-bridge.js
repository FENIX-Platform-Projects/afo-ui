/*global define */

define([
    "jquery",
    "fx-editor/widgets/Fx-widgets-commons"
], function ($, W_Commons) {

    var o = { },
        defaultOptions = {
            error_prefix: "Fx_editor_bridge ERROR: ",
            url: 'http://faostat3.fao.org:7799/v2/msd/resources/metadata',
            type: 'post',
            events: {
                END : "end.query.editor.fx",
                EMPTY_RESPONSE: "empty_response.query.editor.fx"
            }
        }, w_commons;

    function Fx_editor_bridge() {
        w_commons = new W_Commons();
    }

    Fx_editor_bridge.prototype.init = function (options) {

        //Merge options
        $.extend(o, defaultOptions);
        $.extend(o, options);

        console.log("=============== IN BRIDGE ++++++++++++++++ for o.url: "+o.url + " | o.type: "+o.type + " | "+o.mapping);

        return $(this);
    };

    Fx_editor_bridge.prototype.query = function (src, callback, context) {
        var plugin;

      //  console.log("========== IN BRIDGE: QUERY ================== src = "+src.getName());
        if (!window.Fx_editor_bridge_plugins || typeof window.Fx_editor_bridge_plugins !== "object") {
            throw new Error(o.error_prefix + " Fx_editor_bridge_plugins plugins repository not valid.");
        } else {
            plugin = window.Fx_editor_bridge_plugins[src.getName()];
        }

        if (!plugin) {
            throw new Error(o.error_prefix + " plugin not found.")
        }

        if (typeof plugin.init !== "function") {
            throw new Error(o.error_prefix + " plugin for " + src.getName() + " does not have a public init() method.");
        } else {
            plugin.init({component: src, mapping: o.mapping});
        }

        if (typeof callback !== "function") {
            throw new Error(o.error_prefix + " callback param is not a function");
        } else {
          //  console.log("========== IN BRIDGE: AJAX QUERY START ================== ");
            //Ask the plugin the filter, make the request and pass data to callback()
            $.ajax({
                url: o.url,
                type: o.type,
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
                data: plugin.getDataEntry(), //JSON.stringify(plugin.getDataEntry()),
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



    Fx_editor_bridge.prototype.get = function (src, callback, context) {
        var plugin;

        console.log("========== IN BRIDGE: GET ================== src = "+src.getName());
        if (!window.Fx_editor_bridge_plugins || typeof window.Fx_editor_bridge_plugins !== "object") {
            throw new Error(o.error_prefix + " Fx_editor_bridge_plugins plugins repository not valid.");
        } else {
            plugin = window.Fx_editor_bridge_plugins[src.getName()];
        }

        if (!plugin) {
            throw new Error(o.error_prefix + " plugin not found.")
        }
       console.log("o.mapping = "+ o.mapping);

        if (typeof plugin.init !== "function") {
            throw new Error(o.error_prefix + " plugin for " + src.getName() + " does not have a public init() method.");
        } else {
            plugin.init({component: src, mapping: o.mapping, keys: o.keys});
        }

        if (typeof callback !== "function") {
            throw new Error(o.error_prefix + " callback param is not a function");
        } else {
            //console.log("========== IN BRIDGE: AJAX GET START ================== ");
            //Ask the plugin the filter, make the request and pass data to callback()
            $.ajax({
                url: o.url,
                type: o.type,
                contentType: 'application/json',
                dataType: 'json',
                success: function (response, textStatus, jqXHR ) {

                    if(jqXHR.status !== 204){
                        var data = plugin.parseJson(response);
                        console.log("+++++++++++++++++ GET "+data);
                        console.log("context =  "+context);

                        if (context) {
                            $.proxy(callback, context, data)();
                        } else {
                            console.log("=============== CALL TO CALLBACK ");
                            callback(data)
                        }

                    } else {
                        w_commons.raiseCustomEvent(
                            document.body,
                            o.events.EMPTY_RESPONSE,
                            { }
                        );
                    }

                },
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


    return Fx_editor_bridge;

});