define([
    "jquery",
    "text!fx-cat-br/html/fx_result_fragments.html"
], function ($, template) {

    var o = { };
    //Default Result options
    var defaultOptions = {
        s_result: ".fenix-result",
        s_desc_title: ".fx_result_description_title",
        s_desc_source: ".fx_result_description_source",
        s_desc_geo: ".fx_result_description_geograficalarea",
        s_desc_period: ".fx_result_description_baseperiod",
        s_icon: "#fx_result_icon_img",
        error_prefix: "FENIX Result layer creation error: "
    };
    var $result;

    function Fx_catalog_result_renderer_layer(options) {
        $.extend(o, options);
    }

    Fx_catalog_result_renderer_layer.prototype.initText = function () {

        $result.find(o.s_desc_title).html(o.source.name);
        $result.find(o.s_desc_source).html(o.source.source);

        $result.find(o.s_desc_geo).html(o.source.metadata.geographicExtent.title['EN']);
        $result.find(o.s_desc_period).html("from " + new Date(o.source.metadata.basePeriod.from).getFullYear() + " to " + new Date(o.source.metadata.basePeriod.to).getFullYear());

    };

    Fx_catalog_result_renderer_layer.prototype.initModal = function () {

        $result.find("#myModalLabel").html(o.source.name);

    };

    Fx_catalog_result_renderer_layer.prototype.getHtml = function (callback) {

        //Merge options
        extend(o, defaultOptions);

        $result = $(template).find(o.s_result);
        if ($result.length === 0) {
            throw new Error(o.error_prefix + "HTML fragment not found");
        }

        $result.addClass("layer");
        $result.find(o.s_icon).attr("src", "css/img/mind_map60.png");

        $.initText();
        $.initModal();

        //Check callback is a function
        if (callback && typeof callback === "function") {
            callback($result);
        }
        else {
            throw new Error(o.error_prefix + "getHtml() #1 param is not a function");
        }

    };

    return Fx_catalog_result_renderer_layer;

});