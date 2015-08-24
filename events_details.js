/*global require*/

require(["submodules/fenix-ui-menu/js/paths",
		 "submodules/fenix-ui-common/js/Compiler"
		 ], function(Menu, Compiler) {

    var menuConfig = Menu;
    
    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Compiler.resolve([menuConfig], {
        placeholders : {
            FENIX_CDN: "//fenixrepo.fao.org/cdn"
        },
        config: {
			paths: {

                'events': 'scripts/events',
                'commons': 'scripts/commons',
                'AuthenticationManager': './scripts/components/AuthenticationManager',
				'text': "//fenixrepo.fao.org/cdn/js/requirejs/plugins/text/2.0.12/text",
				'i18n': "//fenixrepo.fao.org/cdn/js/requirejs/plugins/i18n/2.0.4/i18n",
				'domready': "//fenixrepo.fao.org/cdn/js/requirejs/plugins/domready/2.0.1/domReady",

				'amplify' : "//fenixrepo.fao.org/cdn/js/amplify/1.1.2/amplify.min",
				'highcharts': "//fenixrepo.fao.org/cdn/js/highcharts/4.0.4/js/highcharts",

				'underscore': "//fenixrepo.fao.org/cdn/js/underscore/1.7.0/underscore.min",
				'handlebars': "//fenixrepo.fao.org/cdn/js/handlebars/2.0.0/handlebars",

				'domReady': "//fenixrepo.fao.org/cdn/js/requirejs/plugins/domready/2.0.1/domReady",
				'swiper': "//fenixrepo.fao.org/cdn/js/swiper/2.7.5/dist/idangerous.swiper.min",
				'bootstrap': "//fenixrepo.fao.org/cdn/js/bootstrap/3.3.2/js/bootstrap.min",
				'draggabilly': "//fenixrepo.fao.org/cdn/js/draggabilly/dist/draggabilly.pkgd.min",
				'intro': "//fenixrepo.fao.org/cdn/js/introjs/1.0.0/intro",
				'isotope': "//fenixrepo.fao.org/cdn/js/isotope/2.1.0/dist/isotope.pkgd.min",
				'jquery': "//fenixrepo.fao.org/cdn/js/jquery/2.1.1/jquery.min",
				'jqwidgets': "//fenixrepo.fao.org/cdn/js/jqwidgets/3.1/jqx-light",
				'jstree': "//fenixrepo.fao.org/cdn/js/jstree/3.0.8/dist/jstree.min"
			},

		    shim: {
		        'bootstrap': ['jquery'],
		        'chosen': ['jquery'],
		        'highcharts': ['jquery'],
		        'jstree': ['jquery'],
		        'jquery-ui': ['jquery'],
		        'jquery.power.tip': ['jquery'],
		        'jquery.i18n.properties': ['jquery'],
		        'jquery.hoverIntent': ['jquery'],
		        'underscore': {
		            exports: '_'
		        },
                'amplify': {
                    deps: ['jquery'],
                    exports: 'amplifyjs'
                }        
		    }
		}
    });

	require([
        'events/App',
		'domready!'
	], function(App) {

        var compare = new App();
        compare.start();

        $('.footer').load('html/footer.html');
	});

});