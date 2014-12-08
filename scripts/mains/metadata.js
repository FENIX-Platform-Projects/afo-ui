// relative or absolute path of Components' main.js

define(['module'], function(module){
   var userConfig =  module.config();

     var override = { 
        lib : '../lib',
        "fenix-ui-topmenu" : '../components/fenix-ui-topmenu',
        'fast-fix':"../lib/fastfix",
        'jquery': "../lib/jquery",
        'jquery-serialize-object' : "../lib/jquery-serialize-object",
        'bootstrap': "../lib/bootstrap",
        'pnotify' : '../lib/pnotify', 
        'nprogress': "../lib/nprogress",
        'pnotify.nonblock': "../lib/pnotify.nonblock",
        'jqueryui': "http://code.jquery.com/ui/1.10.3/jquery-ui.min",
       // 'bootstrap-validator': "http://cdn.jsdelivr.net/jquery.bootstrapvalidator/0.5.0/js/bootstrapValidator.min",
        'bootstrap-validator': "../lib/bootstrapValidator",
        'text': "../lib/text",
        'i18n': "../lib/i18n",
        'domReady': "../lib/domReady",
        'handlebars': "../lib/handlebars",
        'jstorage': "../lib/jstorage",
        'json2': "../lib/json2",
        'jqrangeslider': "../lib/jqrangeslider",
        'bootstrap-tagsinput': "../lib/bootstrap-tagsinput",
        'bootstrap-datetimepicker': "../lib/bootstrap-datetimepicker",
        'moment': "../lib/moment"  
       /* , pnotify: '../lib/pnotify' 
        , "fenix-ui-topmenu" : '../components/fenix-ui-topmenu'
        , bootstrap : "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min"*/

    }; 

    require(['../metadata/paths'], function( MetadataEditor ) {

    // NOTE: This setTimeout() call is used because, for whatever reason, if you make
    //       a 'require' call in here or in the Cart without it, it will just hang
    //       and never actually go fetch the files in the browser. There's probably a
    //       better way to handle this, but I don't know what it is.


    setTimeout(function() {


         /*
         @param: prefix of Components paths to reference them also in absolute mode
         @param: paths to override
         @param: options passed in to override defaults
         @param: callback function
         */

        MetadataEditor.initialize('../metadata', override, userConfig, function() {

            require(['fx-editor/start' ], function( StartUp ){

              new StartUp().init(userConfig);
            });
        });

    }, 0);
});

});
