define(function () {

    //Define it as string : string
    //Explicit jquery path!  Don't use a prefix for it
    var paths = {
        'fx-ana/controllers': "analysis/controllers",
        'fx-ana/js': "./",
        'fx-ana/utils': 'analysis/utils',
        'fx-ana/json': "./json",
        'fx-ana/analysis': "analysis",
        'fx-ana/widgets': "analysis/widgets",
        'fx-ana/structures': "structures",
        'fx-ana/html': "./html",
        'fx-ana/start': './start',
        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min',
        'pnotify': 'lib/pnotify',
        'highcharts' : '//code.highcharts.com/highcharts',
        'jqwidgets': "//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-all",
        'jqueryui': "//code.jquery.com/ui/1.10.3/jquery-ui.min",
        'bootstrap' : "//maxcdn.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min"
    };

    var exports = {};

    exports.initialize = function (baseUrl, overridePaths, callback) {

        if (!overridePaths) {
            overridePaths = {};
        }

        if (baseUrl && baseUrl[baseUrl.length - 1] != '/') {
            baseUrl = baseUrl + '/';
        }

        var fullpaths = {};

        for (var path in paths) {
            // Don't add baseUrl to anything that looks like a full URL like 'http://...' or anything that begins with a forward slash
            if (paths[path].match(/^(?:.*:\/\/|\/)/)) {
                fullpaths[path] = paths[path];
            }
            else {
                fullpaths[path] = baseUrl + paths[path];
            }
        }

        var config = {

            paths: fullpaths,
            
            shim: {
                'highcharts' : {
                    deps: ['jquery']
                },
                'jqwidgets' : {
                    deps: ['jquery']
                },
                'lib/mbExtruder': {
                    deps: ['jquery']
                },
                'lib/jquery.mb.flipText': {
                    deps: ['jquery']
                },
                'lib/jquery.hoverIntent': {
                    deps: ['jquery']
                },
                "bootstrap" : {
                    deps : ["jquery"]
                }
            }
        };

        for (var pathName in overridePaths) {
            if (overridePaths.hasOwnProperty(pathName)){
                config.paths[pathName] = overridePaths[pathName];
            }
        }

        requirejs.config(config);

        // Do anything else you need to do such as defining more functions for exports

        if (callback) {
            callback();
        }
    };

    return exports;
});