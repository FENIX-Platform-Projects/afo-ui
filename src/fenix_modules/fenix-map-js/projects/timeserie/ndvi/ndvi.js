define(['jquery',
    'mustache',
    'text!timeserie/ndvi/template.html',
    'loglevel',
    'fenix-map',
    'highcharts',
    'FMChartScatter',
    'bootstrap'], function ($, Mustache, template, log) {

    var global = this;
    global.FMTimeserieNDVI = function() {

        var CONFIG = {
            lang: 'EN',
            placeholder: 'main_content_placeholder',
            url_search_layer_product_type: "http://168.202.28.214:5005/search/layer/product/{{PRODUCT}}/type/{{TYPE}}/",
            url_geoserver_wms: 'http://168.202.28.214:9090/geoserver/wms'
        }


        var build = function(config) {
            CONFIG = $.extend(true, {}, CONFIG, config);
            $('#' + CONFIG.placeholder).html(template);

            createTimeserie("MODIS-NDVI-SADC", "none")
        }

        var createTimeserie = function(code, type) {

            var url = CONFIG.url_search_layer_product_type
            url = url.replace("{{PRODUCT}}", code)
            url = url.replace("{{TYPE}}", type)
            $.ajax({
                type : 'GET',
                url : url,
                success : function(response) {
                    response = (typeof response === 'string')? $.parseJSON(response): response;
                    var maps = []
                    for(var i=1; i <= 6; i++) {
                        maps.push(build_map("map" + i, response[response.length-i]))
                    }

                    for(var i=0; i < maps.length; i++) {
                        for(var j=0; j < maps.length; j++) {
                            if (i != j ) {
                               maps[i].syncOnMove(maps[j])
                            }
                        }
                    }
                },
                error : function(err, b, c) {
                    alert(err)
                }
            });

        }

        var build_map = function(id, obj) {
            $("#" + id + "_title").html(obj["title"]["EN"])
            console.log("layer");
            console.log(obj["uid"])
            var options = {
                plugins: { geosearch : false, mouseposition: false, controlloading : true, zoomControl: 'bottomright'},
                guiController: { overlay : true,  baselayer: true,  wmsLoader: true },
                gui: {disclaimerfao: true }
            }

            var mapOptions = { zoomControl:false,attributionControl: false };
            var m = new FM.Map(id, options, mapOptions);
            m.createMap();

            var layer = {};
            layer.layers = obj["uid"]
            layer.layertitle = obj["title"]["EN"]
            layer.urlWMS = CONFIG.url_geoserver_wms
            layer.opacity='0.9';
            var l = new FM.layer(layer);
            m.addLayer(l);

            var layer = {};
            layer.layers = 'fenix:gaul0_line_3857'
            layer.layertitle = 'Country Boundaries'
            layer.urlWMS = 'http://fenixapps2.fao.org/geoserver-demo'
            layer.opacity='0.9';
            var l = new FM.layer(layer);
            m.addLayer(l);

            return m;
        }



        // public instance methods
        return {
            build: build
        };
    };

});