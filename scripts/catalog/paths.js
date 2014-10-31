define(function() {

    //Define it as string : string
    //Explicit jquery path!  Don't use a prefix for it
    var paths = {
        'fx-cat-br/controllers': "catalog/controllers",
        'fx-cat-br/js': "./",
        'fx-cat-br/utils' : 'catalog/utils',
        'fx-cat-br/json': "./json",
        'fx-cat-br/catalog': "catalog",
        'fx-cat-br/widgets': "catalog/widgets",
        'fx-cat-br/plugins': "catalog/widgets/bridge/plugins",
        'fx-cat-br/structures': "structures",
        'fx-cat-br/html': "./html",
        'fx-cat-br/start' : './start',
        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js',
        'pnotify' : 'lib/pnotify',
        'jqwidgets': "http://fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-all",
        'jqueryui': "http://code.jquery.com/ui/1.10.3/jquery-ui.min"
    };

    var exports = {};

    exports.initialize = function(baseUrl, overridePaths, callback) {

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
            shim: {
                "lib/jqrangeslider": {
                    deps: ["jquery", "jqueryui"]
                }
            }
        };

        for(var pathName in overridePaths) {
            config.paths[pathName] = overridePaths[pathName];
        }

        requirejs.config( config );

        // Do anything else you need to do such as defining more functions for exports

        if(callback) {
            callback();
        }
    };

    return exports;
});