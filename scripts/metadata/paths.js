define(function() {

    //Define it as string : string
    //Explicit jquery path!  Don't use a prefix for it
    var paths = {
        'fx-editor/start': './start',
        'fx-editor/controllers': "./js/editor/controllers",
        'fx-editor/js': "./js",
        'fx-editor/utils' : "./js/editor/utils",
        'fx-editor/conf/json': "./conf/json",
        'fx-editor/conf/js': "./conf/js",
        'fx-editor/widgets': "./js/editor/widgets",
        'fx-editor/plugins': "./js/editor/widgets/bridge/plugins",
        'fx-editor/templates': "./templates",
        'fx-editor/nls': "./nls",
        'jquery': "lib/jquery",
        'jquery-serialize-object' : "lib/jquery-serialize-object",
        'bootstrap': "lib/bootstrap",
        'pnotify' : "lib/pnotify",
        'nprogress': "lib/nprogress",
        'pnotify.nonblock': "lib/pnotify.nonblock",
        'jqueryui': "http://code.jquery.com/ui/1.10.3/jquery-ui.min",
       // 'bootstrap-validator': "http://cdn.jsdelivr.net/jquery.bootstrapvalidator/0.5.0/js/bootstrapValidator.min",
        'bootstrap-validator': "lib/bootstrapValidator",
        'text': "lib/text",
        'i18n': "lib/i18n",
        'domReady': "lib/domReady",
        'handlebars': "lib/handlebars",
        'jstorage': "lib/jstorage",
        'json2': "lib/json2",
        'jqrangeslider': "lib/jqrangeslider",
        'bootstrap-tagsinput': "lib/bootstrap-tagsinput",
        'bootstrap-datetimepicker': "lib/bootstrap-datetimepicker",
        'moment': "lib/moment"



};

    var metadataEditorConfig = {},
        lang;

    metadataEditorConfig.initialize = function(baseUrl, overridePaths, options, callback) {

        if (options.hasOwnProperty('widget')){
            if (options['widget'].hasOwnProperty('lang')){
                lang = options.widget.lang.toLowerCase();
            }
        }

        if(!overridePaths) {
            overridePaths = {};
        }

        if(baseUrl && baseUrl[baseUrl.length - 1] != '/') {
            baseUrl = baseUrl + '/';
        }

        var fullpaths = {};

        for(var path in paths) {
            // Don't add baseUrl to anything that looks like a full URL like 'http://...' or anything that begins with a forward slash
            if(paths[path].match(/^(?:.*:\/\/|\/)/)) {
                fullpaths[path] = paths[path];
            }
            else {
                fullpaths[path] = baseUrl + paths[path];
            }
        }

        var config = {
 
            paths: fullpaths,
            locale: lang || 'en',
            shim: {
                "jqrangeslider": {
                    deps: ["jquery", "jqueryui"]
                },
                "bootstrap": {
                    deps: ["jquery"]
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
                },
                "handlebars": {
                    exports: 'Handlebars'
                }
            }
        };

        for(var pathName in overridePaths) {
            config.paths[pathName] = overridePaths[pathName];
        }



        requirejs.config( config );


        if(callback) {
            callback();
        }
    };

    return metadataEditorConfig;
});