define([
    "jquery",
    "text!fx-cat-br/html/fx_result_fragments.html"
], function ($, template) {

    //Default Result options
    var defaultOptions = {
        error_prefix: "FENIX Result dataset creation error: "
    }, selectors = {
        s_result: ".fenix-result",
        s_desc_title: ".fx_result_description_title",
        s_desc_source: ".fx_result_description_source",
        s_desc_geo: ".fx_result_description_geograficalarea",
        s_desc_period: ".fx_result_description_baseperiod",
        s_uid : ".fx_result_uid"
    }, $result;

    function Fx_catalog_result_render_dataset(options) {
        this.o = {};
        $.extend(this.o, options);
    }

    Fx_catalog_result_render_dataset.prototype.initText = function () {

        if (this.o.metadata.hasOwnProperty('uid') && this.o.metadata.uid !== null) {

            $result.find(selectors.s_uid).html(this.o.metadata.uid);
        }

        if (this.o.metadata.hasOwnProperty('title') && this.o.metadata.title !== null) {

            if (this.o.metadata.title.hasOwnProperty('EN')) {
                $result.find(selectors.s_desc_title).html(this.o.metadata.title['EN']);
            } else {

                var keys = Object.keys(this.o.metadata.title);

                if (keys.length > 0) {
                    $result.find(selectors.s_desc_title).html(this.o.metadata.title[ keys[0] ]);
                }
            }
        }

        $result.find(this.o.s_desc_source).html(this.o.source);

        if (this.o.metadata.hasOwnProperty('geographicExtent') && this.o.metadata.geographicExtent !== null) {

            if (this.o.metadata.geographicExtent.hasOwnProperty('title') && this.o.metadata.geographicExtent.title !== null) {
                if (this.o.metadata.geographicExtent.title.hasOwnProperty('EN')) {
                    $result.find(selectors.s_desc_geo).html(this.o.metadata.geographicExtent.title['EN']);
                } else {

                    var keys = Object.keys(this.o.metadata.geographicExtent.title);

                    if (keys.length > 0) {
                        $result.find(selectors.s_desc_geo).html(this.o.metadata.geographicExtent.title[ keys[0] ]);
                    }
                }
            }
        }

        if (this.o.metadata.hasOwnProperty('basePeriod') && this.o.metadata.basePeriod !== null) {
            if (this.o.metadata.basePeriod.hasOwnProperty('from') && this.o.metadata.basePeriod.hasOwnProperty('to')) {
                $result.find(selectors.s_desc_period).html("from " + new Date(this.o.metadata.basePeriod.from).getFullYear() + " to " + new Date(this.o.metadata.basePeriod.to).getFullYear());
            }
        }
    };

    Fx_catalog_result_render_dataset.prototype.initModal = function () {

        $result.find("#myModalLabel").html(this.o.name);
    };

    Fx_catalog_result_render_dataset.prototype.initBtns = function () {

        $result.find(".btn-to-analyze").on('click', {o: this.o}, function (e) {
            //Listen to it within Fx-catalog-results-generator
            $(e.currentTarget).trigger("clickResultAnalyzeBtn", [e.data.o]);
        });
    };

    Fx_catalog_result_render_dataset.prototype.getHtml = function () {

        $.extend(this.o, defaultOptions);

        $result = $(template).find(selectors.s_result).clone();

        if ($result.length === 0) {
            throw new Error(o.error_prefix + " HTML fragment not found");
        }

        $result.addClass("dataset");

        this.initText();
        this.initModal();
        this.initBtns();

        return $result.get(0);
    };

    return Fx_catalog_result_render_dataset;
});
