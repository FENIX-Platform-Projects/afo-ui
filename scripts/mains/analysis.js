// relative or absolute path of Components' main.js
//risoluzione delle dipendenze relativa alla posizione del file questo
require([
    '../../submodules/fenix-ui-catalog/js/paths',
    '../../submodules/fenix-ui-analysis/js/paths'
], function (Catalog, Analysis) {

    var override = {
        lib: '../lib',
        "fenix-ui-topmenu": '../components/fenix-ui-topmenu',
        'jqwidgets': "http://fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-all",
        'jqueryui': "http://code.jquery.com/ui/1.10.3/jquery-ui.min",
        'jquery': '../../node_modules/jquery/dist/jquery.min',
        'nprogress': '../../node_modules/nprogress/nprogress',
        'intro': '../../node_modules/intro.js/minified/intro.min',
        'bootstrap': '../../node_modules/bootstrap/dist/js/bootstrap.min',
        'packery': '../../node_modules/packery/dist/packery.pkgd.min',
        'draggabilly': '../../node_modules/draggabilly/dist/draggabilly.pkgd.min',
        'jstree': '../../node_modules/jstree/dist/jstree.min',
        'jqrangeslider': '../lib/jqrangeslider',
        'isotope': "../lib/isotope",
        'pnotify': '../lib/pnotify'
    };

    /*
     @param: prefix of Components paths to reference them also in absolute mode
     @param: paths to override
     @param: callback function
     */
    //risoluzione delle dipendenze relativa alla posizione del file questo
    Catalog.initialize('../../submodules/fenix-ui-catalog/js', null, function () {

        Analysis.initialize('../../submodules/fenix-ui-analysis/js/', override, function () {

            require([
                'fx-ana/start'
                , 'fx-cat-br/start'
                , 'fenix-ui-topmenu/main'
            ], function (Analysis, Catalog, TopMenu) {

                new TopMenu({
                    url: 'json/fenix-ui-topmenu_config.json', active: "statistics"
                });

                new Analysis().init({
                    catalog: new Catalog({
                        catalog: {
                            BLANK_FILTER: 'config/submodules/catalog/afo-catalog-blank-filter.json'
                        },
                        results: {
                            actions: {
                                EDIT_METADATA: { }
                            }                        }
                    })
                });

            });

        });

    });

});