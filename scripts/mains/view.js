requirejs.config({

    baseUrl: 'scripts/lib',

    paths : {
        host : '../view/host',
        json : "../../json",
        structure : '../components/Structure',
        "fenix-ui-topmenu" : '../components/fenix-ui-topmenu',
        jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
        bootstrap : "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
        jqwidgets: "//fenixrepo.fao.org/cdn/js/jqwidgets/3.1/jqx-all",
        highcharts : '//code.highcharts.com/highcharts',
        highstocks : '//code.highcharts.com/stock/highstock',
        "highcharts.export" : '//code.highcharts.com/modules/exporting',
        i18n : '//fenixrepo.fao.org/cdn/js/jquery/1.0.9/jquery.i18n.properties-min',

        //OLAP DEPENDENCIES
		"pivot": "../../submodules/fenix-ui-olap/pivotNew",        
		"jquery-i18n": "//fenixrepo.fao.org/cdn/js/jquery/1.0.9/jquery.i18n.properties-min",
		"jquery-ui": "../../submodules/fenix-ui-olap/jquery-ui-1.9.2.custom.min",
		"jssc3": "../../submodules/fenix-ui-olap/highlight/jssc3",
		"grid_calendar": "../../submodules/fenix-ui-olap/grid/calendar/calendar",
		"grid_calendar2": "../../submodules/fenix-ui-olap/grid/calendar/calendar-cn-utf8",
		"grid_gt_msg": "../../submodules/fenix-ui-olap/grid/gt_msg_en",
		"grid_gt_grid": "../../submodules/fenix-ui-olap/grid/gt_grid_all",
		"grid_flashchart": "../../submodules/fenix-ui-olap/grid/flashchart/fusioncharts/FusionCharts"
    },
   
    shim: {
        "i18n": {
            deps: ['jquery']
        },
        "bootstrap": {
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

        //OLAP DEPENDENCIES
        'jquery-ui' : {
            deps: ['jquery']
        },
        'jquery-i18n' : {
            deps: ['jquery']
        },
        'jssc3': {
            deps: ['jquery']
        },
        'grid_calendar': {
            deps: ['jquery']
        },
        'grid_calendar2': {
            deps: ['grid_calendar']
        },
        'grid_gt_msg' : {
            deps: ['grid_calendar']
        },
        'grid_gt_grid' : {
            deps: ['grid_calendar','grid_gt_msg']
        },
        'grid_flashchart' : {
            deps: ['grid_calendar','grid_gt_grid']
        },
        'pivot': {
            deps: [
				'jquery','jquery-i18n','jssc3',
				'grid_calendar','grid_calendar2',
				'grid_gt_msg','grid_gt_grid',
				'grid_flashchart'
            ]
        }
    }
});

require(['host', 'domReady!'], function( Host ) {

    var host = new Host();
    host.initFenixComponent()

});