define(["jquery", "fx-cat-br/jqrangeslider"], function ($) {

    function Fx_ui_w_SimpleRange() {
    };

    Fx_ui_w_SimpleRange.prototype.validate = function (e) {

        return true;
    };

    Fx_ui_w_SimpleRange.prototype.render = function (e, container) {

        // create rangeSlider.
        $(container).rangeSlider($.extend(e.component.rendering, e.component.source));
    };

    Fx_ui_w_SimpleRange.prototype.getValue = function (e) {

        return $("#" + e.id).rangeSlider("values");
    };

    return Fx_ui_w_SimpleRange;
});