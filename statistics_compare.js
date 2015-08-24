
require([
    "config/paths",
    "submodules/fenix-ui-menu/js/paths",
    "submodules/fenix-ui-common/js/Compiler"    
], function(Paths, menuConfig, Compiler) {

    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Paths.paths.compare = 'scripts/statistics/compare';
    Paths.paths.commons = 'scripts/commons';
    Paths.paths.AuthenticationManager = 'scripts/components/AuthenticationManager';

    Compiler.resolve([menuConfig], {
        placeholders: {
            FENIX_CDN: Paths.FENIX_CDN
        },
        config: Paths
    });

    require([
        'compare/App',
        'src/renderAuthMenu'
    ], function (App, renderAuthMenu) {

        renderAuthMenu('statistics_compare');

        var app = new App();
        app.start();

    });

});

