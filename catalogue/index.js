
require([
	'../src/fenix-ui-topmenu/paths',
	'../src/lib/domready!'
], function(TopMenuPaths) {

	TopMenuPaths.initialize('../src/', null, function() {

		require(['../src/fenix-ui-topmenu/main'], function(TopMenu) {

			new TopMenu({
				configUrl: "../config/fenix-ui-topmenu.json",
				active: "catalogue"
			});
		});
	});

});
