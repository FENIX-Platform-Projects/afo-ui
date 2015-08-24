define(function() {

    var FX_CDN = "//fenixrepo.fao.org/cdn";

    return {
        
        FENIX_CDN: FX_CDN,

        paths: {
            'text':                   FX_CDN+"/js/requirejs/plugins/text/2.0.12/text",
            'i18n':                   FX_CDN+"/js/requirejs/plugins/i18n/2.0.4/i18n",
            'domready':               FX_CDN+"/js/requirejs/plugins/domready/2.0.1/domReady",
            'jquery':                 FX_CDN+"/js/jquery/2.1.1/jquery.min",
            'amplify' :               FX_CDN+"/js/amplify/1.1.2/amplify.min",
            'highcharts':             FX_CDN+"/js/highcharts/4.0.4/js/highcharts",
            'highcharts.export':      FX_CDN+"/js/highcharts/4.0.4/js/modules/exporting",
            'underscore':             FX_CDN+"/js/underscore/1.7.0/underscore.min",
            'underscore-string':      FX_CDN+"/js/underscore-string/3.0.3/underscore.string.min",
            'handlebars':             FX_CDN+"/js/handlebars/2.0.0/handlebars.min",
            'bootstrap':              FX_CDN+"/js/bootstrap/3.3.2/js/bootstrap.min",
            'draggabilly':            FX_CDN+"/js/draggabilly/dist/draggabilly.pkgd.min",
            'isotope':                FX_CDN+"/js/isotope/2.1.0/dist/isotope.pkgd.min",
            'swiper':                 FX_CDN+"/js/swiper/2.7.5/dist/idangerous.swiper.min",
            'intro':                  FX_CDN+"/js/introjs/1.0.0/intro",
            'jqwidgets':              FX_CDN+"/js/jqwidgets/3.1/jqx-light",
            'jstree':                 FX_CDN+"/js/jstree/3.0.8/dist/jstree.min",
            'chosen':                 FX_CDN+"/js/chosen/1.0.0/chosen.jquery.min",
            'webix':                  FX_CDN+"/js/webix/2.2.1/js/webix",
            'leaflet':                FX_CDN+"/js/leaflet/0.7.3/leaflet",
            'leaflet.encoded':        FX_CDN+"/js/leaflet/plugins/leaflet.encoded/0.0.5/Polyline.encoded",
            'leaflet-markercluster':  FX_CDN+"/js/leaflet/plugins/leaflet.markecluster/1.1/leaflet.markercluster",
            'geojson_decoder':        FX_CDN+"/js/leaflet/plugins/geojson_decoder",

            'fenix-map':              FX_CDN+"/fenix/fenix-ui-map/0.0.1/fenix-ui-map.min",
            'fenix-map-config':       FX_CDN+"/fenix/fenix-ui-map/0.0.1/fenix-ui-map-config",
            'jquery.power.tip':       FX_CDN+"/js/jquery.power.tip/1.1.0/jquery.powertip.min",
            'jquery-ui':              FX_CDN+"/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min",
            'jquery.hoverIntent':     FX_CDN+"/js/jquery.hoverIntent/1.0/jquery.hoverIntent",
            'jquery.i18n.properties': FX_CDN+"/js/jquery/1.0.9/jquery.i18n.properties-min",

            'jquery.rangeSlider':     FX_CDN+"/js/jquery.rangeslider/5.7.0/jQDateRangeSlider-min",
            'moment':                 FX_CDN+"/js/moment/2.9.0/moment.min",

            'fx-pivot/start':         "submodules/fenix-ui-olap/js/pivot",
            'fx-olap/nls':            "submodules/fenix-ui-olap/nls",

            'pivot':                  "submodules/fenix-ui-olap/js/pivot",
            //'pivotPaths':             "submodules/fenix-ui-olap/js/paths",

            'gt_msg':                 "submodules/fenix-ui-olap/lib/grid/gt_msg_en",
            'gt_msg_grid':            "submodules/fenix-ui-olap/lib/grid/gt_grid_all",
            'pivotRenderers':         "submodules/fenix-ui-olap/js/rend/rendererers",
            'pivotAggregators':       "submodules/fenix-ui-olap/js/rend/aggregators",
            'pivotRenderersFuncs':    "submodules/fenix-ui-olap/js/rend/function_rendererers",
            'pivotAggregatorsFuncs':  "submodules/fenix-ui-olap/js/rend/function_aggregators",            
            
            //"pivotConfig":          FX_CDN+"/fenix/fenix-ui-olap/4.0/config/dataConfig1",
            "pivotConfig":            "config/pivotConfig",
        },
        shim: {
            'jstree': ['jquery'],
            'swiper': ['jquery'],
            'chosen': ['jquery'],
            'jquery-ui': ['jquery'],
            'bootstrap': ['jquery'],
            'highcharts': ['jquery'],
            'highcharts.export': ['jquery','highcharts'],
            'jquery.power.tip': ['jquery'],
            'jquery.hoverIntent': ['jquery'],
            'jquery.i18n.properties': ['jquery'],
            'jquery.rangeSlider': ['jquery', 'jquery-ui'],
            'underscore-string': ['underscore'],
            'underscore': { exports: '_' },            
            'amplify': { deps: ['jquery'], exports: 'amplifyjs' },
            'geojson_decoder': ['leaflet','leaflet.encoded'],
            'leaflet.encoded': ['leaflet'],
            'leaflet-markercluster': ['leaflet'],
           // 'pivot': ['pivotPaths'],
            'fenix-map': [
                'leaflet',
                'jquery',
                'chosen',
                'jquery-ui',
                'jquery.power.tip',
                'fenix-map-config',
                'jquery.hoverIntent',
                'jquery.i18n.properties'
            ],
            "gt_msg": ['jquery'],
            "gt_msg_grid": ['jquery','gt_msg'],
            "HPivot": ['jquery','jqueryui'],
            "pivotRenderers": ['pivotRenderersFuncs'],
            "pivotAggregators": ['pivotAggregatorsFuncs','jquery']
        }
    };
});