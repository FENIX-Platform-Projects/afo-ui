define([
    "jquery",
    "lib/jqwidgets"
    ], function ($) {

    function Fx_ui_w_Dropdown() {
    }

    Fx_ui_w_Dropdown.prototype.validate = function (e) {

        if (!e.hasOwnProperty("source")) {
            throw new Error("ELEM_NOT_SOURCE");
        }
        else {
            if (!e.source.hasOwnProperty("datafields")) {
                throw new Error("ELEM_NOT_DATAFIELDS");
            }
        }

        return true;

    };

    Fx_ui_w_Dropdown.prototype.render = function (e, container) {

        var source, dataAdapter;

        // prepare the data
        source = $.extend({datatype: "json"}, e.component.source);
        dataAdapter = new $.jqx.dataAdapter(source);
        // Create a jqxDropDownList
        $(container).jqxDropDownList($.extend({ source: dataAdapter}, e.component.rendering));

    };

    Fx_ui_w_Dropdown.prototype.getValue = function (e) {
        return $("#" + e.id).jqxDropDownList('val');
    };

    return Fx_ui_w_Dropdown;
});