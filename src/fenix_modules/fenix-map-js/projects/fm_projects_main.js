require(['jquery',
    'mustache',
    'backbone',
    'loglevel',
    'chosen',
    'bootstrap',,
    'domReady!'], function($, Mustache, Backbone, log) {

    log.setLevel(0);


    var ApplicationRouter = Backbone.Router.extend({

        lang: "en",

        placeholder_container : "fm_projects_container",

        isRendered: false,

        initialize: function (options) {
            Backbone.history.start();
        },


        routes: {
            '(/)scatter(/)poverty_analysis': 'poverty_analysis',
            '(/)scatter(/)scatter_custom': 'scatter_custom',
            '(/)timeserie(/)ndvi': 'timeserie_ndvi',
            '(/)hungermap': 'hungermap',
            '': 'generic'
        },

        poverty_analysis: function() {
            var placeholder_container = this.placeholder_container
            require(['FMPovertyAnalysis'], function() {
                FMPovertyAnalysis().build( { "placeholder" : placeholder_container});
            });
        },

        scatter_custom: function() {
            var placeholder_container = this.placeholder_container
            require(['FMScatterCustom'], function() {
                FMScatterCustom().build( { "placeholder" : placeholder_container});
            });
        },

        timeserie_ndvi: function() {
            console.log("timeserie_ndvi");
            var placeholder_container = this.placeholder_container
            require(['FMTimeserieNDVI'], function() {
                console.log("timeserie_ndvi");
                FMTimeserieNDVI().build( { "placeholder" : placeholder_container});
            });
        },

        hungermap: function() {
            var placeholder_container = this.placeholder_container
            require(['FMHungerMap'], function() {
                FMHungerMap().build( { "placeholder" : placeholder_container});
            });
        },



        _init: function (lang) {

            if (lang) {
                this._initLanguage(lang)
            }

            if (!this.isRendered) {
                this.isRendered = true;
                var template = $(templates).filter('#structure').html();
                var view = {};
                var render = Mustache.render(template, view);
                $('#js_geo_placeholder').html(render);
                var navbar = new Navbar({lang: lang});
                navbar.build();
            }

        },

        _initLanguage: function (lang) {
            require.config({"locale": lang});
        }

    });

    new ApplicationRouter();

});