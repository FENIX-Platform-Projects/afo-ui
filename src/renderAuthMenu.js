define([
	'jquery','underscore',
    'submodules/fenix-ui-common/js/AuthManager',
    'fx-menu/start',
	'config/fenix-ui-menu',
	'text!html/footer.html'
], function ($,_,
	AuthManager,
	Menu,
	menuConf,
	tmplFooter) {

	return function(menuId) {

		if(menuId===true)
			menuId = location.pathname.substring(location.pathname.lastIndexOf('/')).match(/\/(.+)\..*/)[1];

		//AUTH & TOP MENU
		menuConf.active = menuId;
		menuConf.template = $('.fx-menu');

		var auth, menu,
			menuConfAuth = _.extend({}, menuConf, {
				hiddens: ['login']
			}),
			menuConfPub = _.extend({}, menuConf, {
				hiddens: ['createdataset','logout']
			});

		auth = new AuthManager({
			onLogin: function() {
				menu.refresh(menuConfAuth);
			},
			onLogout: function() {
				menu.refresh(menuConfPub);
			}
		});
		
		menu = new Menu( auth.isLogged() ? menuConfAuth : menuConfPub );

		$('.footer').html(tmplFooter);

		return {
			auth: auth,
			menu: menu
		};
	};
});