requirejs.config({

    baseUrl: 'scripts/lib',

    paths : {
        host : '../modules/host',
        json : "../../json",
        structure : '../components/Structure',
        "fenix-ui-topmenu" : '../components/fenix-ui-topmenu',
        jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
        bootstrap : "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min"
    },
   
    shim: {
        bootstrap: {
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