define(['jquery',
    'mustache',
    'text!scatter/scatter_custom/template.html',
    'loglevel',
    'fenix-map',
    'highcharts',
    'FMChartScatter',
    'bootstrap'], function ($, Mustache, template, log) {

    var global = this;
    global.FMScatterCustom = function() {

        var CONFIG = {
            lang: 'EN',
            placeholder: 'main_content_placeholder'
        }


        var build = function(config) {
            console.log(config);
            CONFIG = $.extend(true, {}, CONFIG, config);
            $('#' + CONFIG.placeholder).html(template);


        }

        // public instance methods
        return {
            build: build
        };
    };

});