var locale = localStorage.getItem('locale' || 'en-us');

requirejs.config({

    config: { i18n: { locale: locale} },

    baseUrl: 'scripts/lib',

    paths : {
        host : '../administration/host',
        root: "../administration",
        templates: "../administration/templates",
        models: "../administration/models",
        views: "../administration/views",
        resources: "../administration/resources",
        nls: "../administration/nls",
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
        }
    }
});

require(['host', 'domReady!'], function( Host ) {

    var host = new Host();
    host.initFenixComponent()

});