define(["jquery", "lib/jqwidgets"], function ($) {

    function Fx_ui_w_List() {
    }

    Fx_ui_w_List.prototype.validate = function (e) {
        if (!e.hasOwnProperty("source")) {
            throw new Error("ELEM_NOT_SOURCE");
        } else {
            if (!e.source.hasOwnProperty("datafields")) {
                throw new Error("ELEM_NOT_DATAFIELDS");
            }
        }

        return true;
    };

    Fx_ui_w_List.prototype.render = function (e, container) {

        var source, dataAdapter;

        // prepare the data
        source = $.extend({datatype: "json"}, e.component.source);
        dataAdapter = new $.jqx.dataAdapter(source, {
            loadError: function (jqXHR, status, error) {
                throw new Error("CONNECTION_FAIL");
            }
        });
        // Create a jqxListBox
        $(container).jqxListBox($.extend({ source: dataAdapter}, e.component.rendering));
    };

    Fx_ui_w_List.prototype.getValue = function (e) {
        return $("#" + e.id).jqxListBox('val');
    };

    return Fx_ui_w_List;
});