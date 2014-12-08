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
            },
            "callback 3" : function(){
                console.log("Callback Three")
            },

        };

        $.getJSON( "json/fenix_interface_showcase_conf.json", function( conf ) {
            new Structure().initialize(conf, callbacks);
        });     

        new TopMenu({ 
            url : 'json/fenix-ui-topmenu_config.json'
            , active: "showcase"
        });

    };

    return Host;
	
});