
require([
    "config/paths",
    "submodules/fenix-ui-menu/js/paths",
    "submodules/fenix-ui-common/js/Compiler"    
], function(Paths, menuConfig, Compiler) {

    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Compiler.resolve([menuConfig], {
        placeholders : {
            FENIX_CDN: Paths.FENIX_CDN
        },
        config: Paths
    });

	require([
	    'config/services',
	    'src/renderAuthMenu',
		'scripts/directories/business/App'
    ], function (Config, renderAuthMenu, App) {

		renderAuthMenu(true);

        var business = new App;
        business.start();

    }); // end of App.start()

});



