define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons",
    "lib/jqrangeslider"
], function ($, W_Commons) {

    var o = {
        lang : 'EN',
        events: {
            READY : "fx.catalog.module.ready"
        }
    }, w_commons;

    function Fx_ui_w_SimpleRange() {
        w_commons = new W_Commons()
    }

    Fx_ui_w_SimpleRange.prototype.validate = function () {

        return true;
    };

    Fx_ui_w_SimpleRange.prototype.render = function (e, container) {

        o.container = container;
        o.module = e;

        // create rangeSlider.
        $(container).rangeSlider($.extend(e.component.rendering, e.component.source))
            .on("valuesChanged", {w_commons : w_commons, type: o.module.type}, function(e, data){

                e.data.w_commons.raiseCustomEvent(
                    o.container,
                    o.events.READY,
                    {   value : data.values.min + " - "+ data.values.max,
                        module: e.data.type }
                );
        });

        //Default initialization
        var that = this;
        window.setTimeout(function(){
            var results = that.getValue(e);

            w_commons.raiseCustomEvent(
                o.container,
                o.events.READY,
                {   value : results[0].min +" - "+ results[0].max,
                    module: o.module.type }
            );
        }, 100);
    };

    Fx_ui_w_SimpleRange.prototype.getValue = function (e) {

        return [$("#" + e.id).rangeSlider("values")];
    };

    return Fx_ui_w_SimpleRange;
});