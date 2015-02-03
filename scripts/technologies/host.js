define([
    'structure/structure',
    'fenix-ui-topmenu/main'
], function( Structure, TopMenu ){

    function Host(){}

    Host.prototype.initFenixComponent = function(){

        var callbacks = {
            "callback 1" : function(){
                console.log("Callback One")
            },
            "callback 2" : function(){
                console.log("Callback Two")
            }
        };

        $.getJSON( "json/fenix_interface_technologies_conf.json", function( conf ) {
            new Structure().initialize(conf, callbacks);
        });     

        new TopMenu({ 
            url : 'json/fenix-ui-topmenu_config.json'
            , active: "technologies"
        });

    };

    return Host;
    
});