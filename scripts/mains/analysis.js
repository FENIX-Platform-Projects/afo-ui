// relative or absolute path of Components' main.js
//risoluzione delle dipendenze relativa alla posizione del file questo
require([
    '../catalog/paths'
    , '../analysis/paths'
], function (Catalog, Analysis) {

    var override = { 
        lib : '../lib'  
        , pnotify: '../lib/pnotify' 
        , "fenix-ui-topmenu" : '../components/fenix-ui-topmenu'
        , bootstrap : "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min"

    }; 

    /*
     @param: prefix of Components paths to reference them also in absolute mode
     @param: paths to override
     @param: callback function
     */
    //risoluzione delle dipendenze relativa alla posizione del file questo
    Catalog.initialize('../catalog', null, function () {

        Analysis.initialize('../analysis', override , function () {

            require([
                'fx-ana/start'
                ,'fx-cat-br/start'
                ,'fenix-ui-topmenu/main'
            ], function (Analysis, Catalog, TopMenu) {
                
                new TopMenu({ 
                    url : 'json/fenix-ui-topmenu_config.json'
                    , active: "analysis"
                });
                
                new Analysis().init({
                    catalog: new Catalog()
                });

            });

        });
    
    });

});