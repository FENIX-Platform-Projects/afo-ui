define(['underscore',
    'submodules/fenix-ui-common/js/AuthManager',
    'fx-menu/start',
	'config/fenix-ui-menu'
], function (_,	AuthManager, Menu, menuConf) {

	return function(menuId) {
		//AUTH & TOP MENU
		menuConf.active = menuId;

		var menuConfAuth = _.extend({}, menuConf, {
				hiddens: ['login']
			}),
			menuConfPub = _.extend({}, menuConf, {
				hiddens: ['createdataset','logout']
			});

		var auth = new AuthManager({
				onLogin: function() {
					menu.refresh(menuConfAuth);
				},
				onLogout: function() {
					menu.refresh(menuConfPub);
				}
			}),
			menu = new Menu( auth.isLogged() ? menuConfAuth : menuConfPub );

		return {
			auth: auth,
			menu: menu
		};
	};
});