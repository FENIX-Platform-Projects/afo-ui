requirejs.config({

    baseUrl: 'scripts/lib',

    paths : {
        host : '../view/host',
        json : "../../json",
        structure : '../components/Structure',
        "fenix-ui-topmenu" : '../components/fenix-ui-topmenu',
        jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
        bootstrap : "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
        jqwidgets: "//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-all",
        highcharts : '//code.highcharts.com/highcharts',
        highstocks : '//code.highcharts.com/stock/highstock',
        "highcharts.export" : '//code.highcharts.com/modules/exporting',
        i18n : '//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min',
        'pivot/configuration': 'http://hqlprfenixapp2.hq.un.fao.org:20300/faostat-download-js/pivotAgg/configuration',
        'pivot/countriesAgg': 'http://hqlprfenixapp2.hq.un.fao.org:20300/faostat-download-js/pivotAgg/countriesAgg',
        'pivot/gchart_renderers': 'http://hqlprfenixapp2.hq.un.fao.org:20300/faostat-download-js/pivotAgg/gchart_renderers',
        'pivot/jquery-ui' : 'http://hqlprfenixapp2.hq.un.fao.org:20300/faostat-download-js/pivotAgg/jquery-ui-1.9.2.custom.min',
        'pivot/pivot': 'http://hqlprfenixapp2.hq.un.fao.org:20300/faostat-download-js/pivotAgg/pivot'
    },
   
    shim: {
        i18n : {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        },
        "jquery.history": {
            deps: ['jquery']
        },
        "highcharts": {
            "exports": "Highcharts",
            "deps": [ "jquery"]
        },
        "highcharts.export" : {
            "exports": "Highcharts",
            "deps": [ "jquery", "highcharts"]
        },
        "highstocks": {
            "exports": "StockChart",
            "deps": [ "jquery"]
        },
        'jqwidgets' : {
            deps: ['jquery']
        },
        'pivot/pivot': {
            deps: ['jquery']
        },
        'pivot/countriesAgg': {
            deps: [ 'pivot/pivot']
        },
        'pivot/gchart_renderers': {
            deps: ['pivot/countriesAgg']
        },
        'pivot/configuration': {
            deps: ['pivot/gchart_renderers']
        },
        'pivot/jquery-ui' : {
            deps: ['jquery']
        }

    }
});

require(['host', 'domReady!'], function( Host ) {

    var host = new Host();
    host.initFenixComponent()

});