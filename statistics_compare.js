require([
    "submodules/fenix-ui-menu/js/paths",
    "submodules/fenix-ui-common/js/Compiler"
], function (menuConfig, Compiler) {

    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Compiler.resolve([menuConfig], {
        placeholders: {
            FENIX_CDN: "//fenixapps.fao.org/repository"
        },
        config: {
            paths: {
                'compare': 'scripts/statistics/compare',
                'commons': 'scripts/commons',
                'AuthenticationManager': './scripts/components/AuthenticationManager',
                //Require JS plugins
                'text': "//fenixapps.fao.org/repository/js/requirejs/plugins/text/2.0.12/text",
                'i18n': "//fenixapps.fao.org/repository/js/requirejs/plugins/i18n/2.0.4/i18n",
                'domready': "//fenixapps.fao.org/repository/js/requirejs/plugins/domready/2.0.1/domReady",

                'amplify': "//fenixapps.fao.org/repository/js/amplify/1.1.2/amplify.min",
                'highcharts': "//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts",
                //'highcharts.export' : "//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/modules/exporting",
                'highcharts.export' : "//code.highcharts.com/modules/exporting",
                'underscore': "//fenixapps.fao.org/repository/js/underscore/1.7.0/underscore.min",
                'bootstrap': "//fenixapps.fao.org/repository/js/bootstrap/3.3.2/js/bootstrap.min",
                'jquery': "//fenixapps.fao.org/repository/js/jquery/2.1.1/jquery.min",
                'jstree': "//fenixapps.fao.org/repository/js/jstree/3.0.8/dist/jstree.min",
                'webix' : '//fenixapps.fao.org/repository/js/webix/2.2.1/js/webix',

                //fenix-map-js
                'fenix-map': "submodules/fenix-ui-map/dist/fenix-ui-map.min",
                'fenix-map-config': "submodules/fenix-ui-map/dist/fenix-map-config",
                'chosen': "//fenixapps.fao.org/repository/js/chosen/1.0.0/chosen.jquery.min",
                'leaflet': "//fenixapps.fao.org/repository/js/leaflet/0.7.3/leaflet",
                'leaflet.encoded': "//fenixapps.fao.org/repository/js/leaflet/plugins/leaflet.encoded/0.0.5/Polyline.encoded",
                'geojson_decoder': "src/geojson_decoder"
            },

            shim: {

                'bootstrap': ['jquery'],

                'highcharts': ['jquery'],
                'highcharts.export': ['highcharts', 'jquery'],
                'jstree': ['jquery'],
                'underscore': {
                    exports: '_'
                },
                'amplify': {
                    deps: ['jquery'],
                    exports: 'amplifyjs'
                },
                'geojson_decoder': ['leaflet', 'leaflet.encoded'],
                'leaflet.encoded' : ['leaflet'],
                'fenix-map': {
                    deps: [
                        'i18n',
                        'jquery',
                        'chosen',
                        'leaflet',
                        'jquery-ui',
                        'jquery.hoverIntent',
                        'jquery.power.tip',
                        'jquery.i18n.properties',
                        'import-dependencies',
                        'fenix-map-config',
                        'geojson_decoder'
                    ]
                }
            }
        }
    });

    require([
        'compare/App',
        'domready!'
    ], function (App) {

        var compare = new App();
        compare.start();


    }); // end of App.start()

});
