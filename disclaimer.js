
require(["submodules/fenix-ui-menu/js/paths",
    "submodules/fenix-ui-common/js/Compiler"
], function(Menu, Compiler) {

    var menuConfig = Menu;

    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Compiler.resolve([menuConfig], {
        placeholders : {
            FENIX_CDN: "//fenixapps.fao.org/repository"
        },
        config: {
            paths: {
                'text': "//fenixapps.fao.org/repository/js/requirejs/plugins/text/2.0.12/text",
                'i18n': "//fenixapps.fao.org/repository/js/requirejs/plugins/i18n/2.0.4/i18n",
                'domready': "//fenixapps.fao.org/repository/js/requirejs/plugins/domready/2.0.1/domReady",

                'amplify' : "//fenixapps.fao.org/repository/js/amplify/1.1.2/amplify.min",
                'highcharts': "//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts",

                'underscore': "//fenixapps.fao.org/repository/js/underscore/1.7.0/underscore.min",
                'handlebars': "//fenixapps.fao.org/repository/js/handlebars/2.0.0/handlebars",

                'domReady': "//fenixapps.fao.org/repository/js/requirejs/plugins/domready/2.0.1/domReady",
                'swiper': "//fenixapps.fao.org/repository/js/swiper/2.7.5/dist/idangerous.swiper.min",
                'bootstrap': "//fenixapps.fao.org/repository/js/bootstrap/3.3.2/js/bootstrap.min",
                'draggabilly': "//fenixapps.fao.org/repository/js/draggabilly/dist/draggabilly.pkgd.min",
                'intro': "//fenixapps.fao.org/repository/js/introjs/1.0.0/intro",
                'isotope': "//fenixapps.fao.org/repository/js/isotope/2.1.0/dist/isotope.pkgd.min",
                'jquery': "//fenixapps.fao.org/repository/js/jquery/2.1.1/jquery.min",
                'jqwidgets': "//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-light",
                'jstree': "//fenixapps.fao.org/repository/js/jstree/3.0.8/dist/jstree.min",

                //fenix-map-js
                'fenix-map': "submodules/fenix-map-js/dist/latest/fenix-map-min",
                'fenix-map-config': "submodules/fenix-map-js/dist/latest/fenix-map-config",
                'chosen': "//fenixapps.fao.org/repository/js/chosen/1.0.0/chosen.jquery.min",
                'leaflet': "//fenixapps.fao.org/repository/js/leaflet/0.7.3/leaflet",
                'jquery.power.tip': "//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min",
                'jquery-ui': "//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min",
                'jquery.hoverIntent': "//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverInten",
                'jquery.i18n.properties': "//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min"
            },

            shim: {
                'swiper': ['jquery'],
                'bootstrap': ['jquery'],
                'chosen': ['jquery'],
                'highcharts': ['jquery'],
                'jstree': ['jquery'],
                'jquery-ui': ['jquery'],
                'jquery.power.tip': ['jquery'],
                'jquery.i18n.properties': ['jquery'],
                'jquery.hoverIntent': ['jquery'],
                'underscore': {
                    exports: '_'
                },
                'amplify': {
                    deps: ['jquery'],
                    exports: 'amplifyjs'
                },
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
                        'fenix-map-config'
                    ]
                }
            }
        }
    });

    require([
        'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper', 'leaflet',
        'text!config/services.json',
        'fx-menu/start',
        './scripts/components/AuthenticationManager',
        'amplify',

        'domready!'
    ], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L,
                Config,
                TopMenu, AuthenticationManager) {

        Config = JSON.parse(Config);

        new TopMenu({
            active: 'home',
            url: 'config/fenix-ui-menu.json',
            className : 'fx-top-menu',
            breadcrumb : {
                active : true,
                container : "#breadcumb_container",
                showHome : true
            }
        });

        /*Login*/
        new AuthenticationManager();
        //How to intercept Login event
        amplify.subscribe('login', function (user) {
            console.warn("Event login intercepted");
            console.log(user);
            console.warn('User from local storage');
            console.log(amplify.store.sessionStorage('afo.security.user'));
        });


        $('.footer').load('html/footer.html');

    });


});