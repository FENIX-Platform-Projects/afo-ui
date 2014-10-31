define([
    "jquery",
    "lib/jqrangeslider"
    ], function ($) {

    function Fx_ui_w_DateRange() {
    }

    Fx_ui_w_DateRange.prototype.validate = function (e) {

        return true;
    };

    Fx_ui_w_DateRange.prototype.render = function (e, container) {

        // create jqxRangeSelector.
        $(container).dateRangeSlider($.extend(e.component.rendering, e.component.source));
    };

    Fx_ui_w_DateRange.prototype.getValue = function (e) {
        return $("#" + e.id).dateRangeSlider("values");
    };

    return Fx_ui_w_DateRange;
});