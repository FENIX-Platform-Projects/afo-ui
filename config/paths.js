define({
    
    FENIX_CDN: "//fenixrepo.fao.org/cdn",

    paths: {
        'text':        "{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text",
        'i18n':        "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
        'domready':    "{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady",
        'amplify' :    "{FENIX_CDN}/js/amplify/1.1.2/amplify.min",
        'highcharts':  "{FENIX_CDN}/js/highcharts/4.0.4/js/highcharts",
        'underscore':  "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
        'handlebars':  "{FENIX_CDN}/js/handlebars/2.0.0/handlebars.min",
        'swiper':      "{FENIX_CDN}/js/swiper/2.7.5/dist/idangerous.swiper.min",
        'bootstrap':   "{FENIX_CDN}/js/bootstrap/3.3.2/js/bootstrap.min",
        'draggabilly': "{FENIX_CDN}/js/draggabilly/dist/draggabilly.pkgd.min",
        'intro':       "{FENIX_CDN}/js/introjs/1.0.0/intro",
        'isotope':     "{FENIX_CDN}/js/isotope/2.1.0/dist/isotope.pkgd.min",
        'jquery':      "{FENIX_CDN}/js/jquery/2.1.1/jquery.min",
        'jqwidgets':   "{FENIX_CDN}/js/jqwidgets/3.1/jqx-light",
        'jstree':      "{FENIX_CDN}/js/jstree/3.0.8/dist/jstree.min",
        'chosen':      "{FENIX_CDN}/js/chosen/1.0.0/chosen.jquery.min",
        'leaflet':     "{FENIX_CDN}/js/leaflet/0.7.3/leaflet",
        'fenix-map':              "{FENIX_CDN}/fenix/fenix-ui-map/0.0.1/fenix-ui-map.min",
        'fenix-map-config':       "{FENIX_CDN}/fenix/fenix-ui-map/0.0.1/fenix-ui-map-config",
        'jquery.power.tip':       "{FENIX_CDN}/js/jquery.power.tip/1.1.0/jquery.powertip.min",
        //'jquery-ui':              "{FENIX_CDN}/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min",
        'jquery.hoverIntent':     "{FENIX_CDN}/js/jquery.hoverIntent/1.0/jquery.hoverInten",
        'jquery.i18n.properties': "{FENIX_CDN}/js/jquery/1.0.9/jquery.i18n.properties-min"
    },
    shim: {
        'jstree': ['jquery'],
        'swiper': ['jquery'],
        'chosen': ['jquery'],
        'jquery-ui': ['jquery'],
        'bootstrap': ['jquery'],
        'highcharts': ['jquery'],
        'jquery.power.tip': ['jquery'],
        'jquery.hoverIntent': ['jquery'],
        'jquery.i18n.properties': ['jquery'],
        'underscore': {
            exports: '_'
        },
        'amplify': {
            deps: ['jquery'],
            exports: 'amplifyjs'
        },
        'fenix-map': [
            'leaflet',
            'jquery',
            'chosen',
            //'jquery-ui',
            'jquery.power.tip',
            'fenix-map-config',
            'jquery.hoverIntent',
            'jquery.i18n.properties'
        ]
    }
});