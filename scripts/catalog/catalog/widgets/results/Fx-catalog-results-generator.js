define([
    'jquery',
    "fx-cat-br/widgets/results/renderers/Fx-result-renderer-dataset",
    "fx-cat-br/widgets/results/renderers/Fx-result-renderer-layer"
], function ($, Dataset, Layer) {

    var o = {
        events : {
            ANALYZE_SUB : "clickResultAnalyzeBtn",
            ANALYZE : 'clickResultAnalyze'
        }
    };

    function Fx_catalog_results_generator() {
        this.initEventListeners();
    }

    Fx_catalog_results_generator.prototype.initEventListeners = function(){

       $('body').on(o.events.ANALYZE_SUB, function (e, payload) {
           //Listen to it on Fx-catalog-results
            $(e.currentTarget).trigger(o.events.ANALYZE, [payload]);
       });
    };

    Fx_catalog_results_generator.prototype.getInstance = function (options) {

        switch (options.resourceType.toUpperCase()) {
            case "DATASET" :
                return new Dataset(options).getHtml();
                break;
            case "CODELIST" :
                //return new Fenix_catalog_result_codelist( options );
                break;
            case "LAYER" :
                return new Layer(options).getHtml();
                break;
        }
    };

    return Fx_catalog_results_generator;

});