define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons",
    "jqwidgets"
], function ($, W_Commons ) {

    var o = {
        lang : 'EN',
        events: {
            READY : "fx.catalog.module.ready"
        }
    }, w_commons;

    function Fx_ui_w_item() {
        w_commons = new W_Commons();
    }

    Fx_ui_w_item.prototype.validate = function (e) {
        if (!e.hasOwnProperty("source")) {
            throw new Error("ELEM_NOT_SOURCE");
        } else {
            if (!e.source.hasOwnProperty("datafields")) {
                throw new Error("ELEM_NOT_DATAFIELDS");
            }
        }

        return true;
    };

    Fx_ui_w_item.prototype.render = function (e, container) {

        o.container = container;
        o.module = e;

        var source, dataAdapter;

        $.get( e.component.source.url, function( data ){

            // prepare the data
            source = {datatype: "array"};
            source["datafields"] = e.component.source["datafields"];
            source["id"] = e.component.source["id"];
            source["localdata"] = data.sort(function(a, b){
                if ( a.title.EN < b.title.EN )
                    return -1;
                if ( a.title.EN > b.title.EN )
                    return 1;
                return 0;
            });

        dataAdapter = new $.jqx.dataAdapter(source, {
            loadError: function (jqXHR, status, error) {
                throw new Error("CONNECTION_FAIL");
            }
        });
        // Create a jqxListBox
        $(container).jqxListBox($.extend({ source: dataAdapter}, e.component.rendering))
            .on('change', {container: container }, function (event) {
                var selected = $(event.data.container).jqxListBox("getSelectedItems");
                var payload = '';

                for (var i = 0; i < selected.length; i++) {
                    payload += selected[i].label + ", ";
                }

                w_commons.raiseCustomEvent(
                    o.container,
                    o.events.READY,
                    { value: payload.substring(0, payload.length - 2),
                        module: o.module.type }
                );
            });
        });
    };

    Fx_ui_w_item.prototype.getValue = function (e) {
        var codes = $("#" + e.id).jqxListBox('val').split(','),
            system = e.details.cl.system,
            version = e.details.cl.version,
            results = [];

        for (var i = 0 ; i < codes.length; i++){
            results.push({code: {code : codes[i], systemKey : system, systemVersion:version}});
        }

        return results;
    };

    return Fx_ui_w_item;
});