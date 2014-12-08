define([
    'fenix-ui-topmenu/main'
], function( TopMenu ){

    function Host(){}

    Host.prototype.initFenixComponent = function(){

        new TopMenu({ 
            url : 'json/fenix-ui-topmenu_config.json'
            , active: "modules"
        });

    };

    return Host;
	
});