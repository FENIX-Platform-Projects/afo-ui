
require([
    "config/paths",
    "submodules/fenix-ui-menu/js/paths",
    "submodules/fenix-ui-common/js/Compiler"    
], function(Paths, Menu, Compiler) {

    var menuConfig = Menu;

    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Compiler.resolve([menuConfig], {
        placeholders : {
            FENIX_CDN: Paths.FENIX_CDN
        },
        config: Paths
    });

	//LOAD MENU BEFORE ALL
	require(['src/renderAuthMenu'], function(renderAuthMenu) {

		renderAuthMenu('about_us');

		require([
		    'jquery', 'underscore', 'bootstrap', 'handlebars',
		    'config/services'
		], function($,_,bts,Handlebars,
			Config) {


        	$('.footer').load('html/footer.html');
		});
    });

});