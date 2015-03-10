require([
    "submodules/fenix-ui-menu/js/paths",
    "submodules/fenix-ui-common/js/Compiler"
], function (Menu, Compiler) {

    var menuConfig = Menu;

    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Compiler.resolve([menuConfig], {
        placeholders: {
            FENIX_CDN: "//fenixapps.fao.org/repository"
        },
        config: {
            paths: {
                'glance': 'scripts/statistics/glance',
                'commons': 'scripts/commons',
                'AuthenticationManager': './scripts/components/AuthenticationManager',
                //Require JS plugins
                'text': "//fenixapps.fao.org/repository/js/requirejs/plugins/text/2.0.12/text",
                'i18n': "//fenixapps.fao.org/repository/js/requirejs/plugins/i18n/2.0.4/i18n",
                'domready': "//fenixapps.fao.org/repository/js/requirejs/plugins/domready/2.0.1/domReady",

                'amplify': "//fenixapps.fao.org/repository/js/amplify/1.1.2/amplify.min",
                'highcharts': "//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts",
                'underscore': "//fenixapps.fao.org/repository/js/underscore/1.7.0/underscore.min",
                'underscore-string': "//fenixapps.fao.org/repository/js/underscore-string/3.0.3/underscore.string.min",
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
                'jstree': ['jquery'],
                'underscore': {
                    exports: '_'
                },
                'underscore-string': ['underscore'],
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
        'glance/App',
        'domready!'
    ], function (App) {

        var glance = new App();
        glance.start();


    }); // end of App.start()

});

