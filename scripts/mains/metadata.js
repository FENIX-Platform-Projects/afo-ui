requirejs.config({

    baseUrl: 'scripts/lib',

    locale: 'en',

    paths : {
        host : '../metadata/host',
        'fx-editor/controllers': "../metadata/js/editor/controllers",
        'fx-editor/js': "../metadata/js",
        'fx-editor/utils' : "../metadata/js/editor/utils",
        'fx-editor/conf/json': "../metadata/conf/json",
        'fx-editor/conf/js': "../metadata/conf/js",
        'fx-editor/widgets': "../metadata/js/editor/widgets",
        'fx-editor/plugins': "../metadata/js/editor/widgets/bridge/plugins",
        'fx-editor/templates': "../metadata/templates",
        'fx-editor/start-up' : "../metadata/js/start-up",
        //'jquery': "libs/jquery",
        //'jquery-serialize-object' : "libs/jquery-serialize-object",
        //'pnotify' : "libs/pnotify",
        'jqueryui': "//code.jquery.com/ui/1.10.3/jquery-ui.min",
        //'bootstrap-validator': "http://cdn.jsdelivr.net/jquery.bootstrapvalidator/0.5.0/js/bootstrapValidator.min",
        //'bootstrap-validator': "libs/bootstrapValidator",
        //'text': "libs/text",
        //'i18n': "libs/i18n",
        //'domReady': "libs/domReady",
        'nls': "../metadata/nls",
        //'handlebars': "libs/handlebars",
        //'jstorage': "libs/jstorage",
        //'json2': "libs/json2",
        //'jqrangeslider': "libs/jqrangeslider",
        //'bootstrap-tagsinput': "libs/bootstrap-tagsinput",
        //'bootstrap-datetimepicker': "libs/bootstrap-datetimepicker",
        //'moment': "libs/moment.min"
        "fenix-ui-topmenu" : '../components/fenix-ui-topmenu',
        jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
        jqxall: "//fenixapps.fao.org/repository/js/jqwidgets/3.2.2/jqx-all",
        bootstrap : "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min"
    },
   
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        jqxall: {
            deps: ['jquery']
        },
        "jquery.history": {
            deps: ['jquery']
        },
        "jqrangeslider": {
            deps: ["jquery", "jqueryui"]
        },
        "jquery-serialize-object": {
            deps: ["jquery"]
        },
        "bootstrap-validator": {
           deps: ["jquery", "moment"]
        },
        "jstorage" : {
          deps: ["jquery", "json2"]
        },
        "bootstrap-tagsinput" : {
            deps: ["jquery", "bootstrap"]
        },
        "bootstrap-datetimepicker" : {
         deps: ["jquery", "moment"]
        }
    }
});

require(['host', 'domReady!'], function( Host ) {

    var host = new Host();
    host.initFenixComponent()

});