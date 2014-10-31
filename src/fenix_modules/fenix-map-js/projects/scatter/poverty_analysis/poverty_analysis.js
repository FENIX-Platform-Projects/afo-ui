define(['jquery',
    'mustache',
    'text!scatter/poverty_analysis/template.html',
    'loglevel',
    'fenix-map',
    'highcharts',
    'FMChartScatter',
    'bootstrap'], function ($, Mustache, template, log) {

    var global = this;
    global.FMPovertyAnalysis = function() {

        var charts =  new Array();
        var maps =  new Array()
        var slaveCharts = new Array();
        var slaveMaps = new Array();
        var files = [
            {
                url: 'scatter/csv/gaul2/NGA_Population_Poverty.csv',
                title: '',
                chartID: 'chart1',
                maps:[
                    {
                        mapID: 'map1',
                        layertitle: 'People living with less than $1.25 (2010)',
                        legendtitle: 'Percentage &#37;',
                        mu: '&#37;',
                        formula: '(series[i].data[j].y)',
                        colorramp : 'YlOrRd'
                    },
                    {
                        mapID: 'map2',
                        layertitle: 'Population (2010)',
                        legendtitle: 'Population number',
                        mu: ' people',
                        formula: '(series[i].data[j].x)',
                        colorramp : 'YlGn'
                    },
                    {
                        mapID: 'map3',
                        layertitle: 'Population/People living with less than $1.25 (2010)',
                        legendtitle: 'Index',
                        mu: 'index',
                        formula: '(series[i].data[j].x/series[i].data[j].y)',
                        colorramp : 'YlOrBr'
                    }
                ]
            }
        ]

        var CONFIG = {
            lang: 'EN',
            placeholder: 'main_content_placeholder'
        }


        var build = function(config) {
            CONFIG = $.extend(true, {}, CONFIG, config);
            $('#' + CONFIG.placeholder).html(template);

            $.get(files[0].url, files[0]).done(function( data ) {
                createScatter(data, files[0]);
            });
        }


        function createScatter(csv, obj) {

            var c = new FMChartScatter();

            var chartID = obj.chartID;

            // to handle multiple maps
            var mapsArray = [];

            for ( var i=0; i <  obj.maps.length; i++) {
                var mapObj = obj.maps[i];
                var mapID = mapObj.mapID;

                // single map
                var map = {};
                // to handle multiple layers

                var fenixMap = createMap(mapID);
                var l = createLayer(mapObj.layertitle, mapObj.legendtitle, mapObj.mu, mapObj.formula, mapObj.colorramp);
                var layerHighlight = createHighlightLayer(fenixMap);

                map.id = mapID;
                map.fenixMap = fenixMap;
                map.layers = [];
                map.layers.push({ l: l, layerHighlight: layerHighlight});
                maps.push(fenixMap);
                mapsArray.push(map);
            }

            c.init({
                chart : { data : csv, id : chartID, datatype: 'csv',  chart_title: obj.title },
                maps: mapsArray
            });

            for(var i=0; i < mapsArray.length; i++) {
                for(var j=0; j < mapsArray.length; j++) {
                    if ( i != j) {
                        mapsArray[i].fenixMap.syncOnMove(mapsArray[j].fenixMap)
                    }
                }
            }


        }

        function createMap(mapID) {
            var options = {
                plugins: {
                    geosearch : false,
                    mouseposition: false,
                    controlloading : true,
                    zoomControl: 'bottomright'
                },
                guiController: {
                    overlay : true,
                    baselayer: true,
                    wmsLoader: true
                },
                gui: {
                    disclaimerfao: true
                }
            }

            var mapOptions = {
                zoomControl:false,
                attributionControl: false
            };

            var m = new FM.Map(mapID, options, mapOptions);
            m.createMap();
            m.zoomTo('GAUL0', '182')

            var layer = {};
            layer.layers = 'fenix:gaul0_line_3857'
            layer.layertitle = 'Country Boundaries'
            layer.urlWMS = 'http://fenixapps2.fao.org/geoserver-demo'
            layer.opacity='0.9';
            var l = new FM.layer(layer);
            l.zindex = 104
            m.addLayer(l);
            return m;
        }

//        function createLayer() {
//            var layer = FMDEFAULTLAYER.getLayer("GAUL2", true)
//            layer.layertitle="Poverty Index"
//            layer.joindata=''
//            layer.addborders='true'
//            layer.borderscolor='FFFFFF'
//            layer.bordersstroke='0.8'
//            layer.bordersopacity='0.4'
//            layer.legendtitle='Poverty Index'
//            layer.mu = 'Index';
//            layer.lang='en';
//            layer.jointype='shaded';
//            layer.defaultgfi = true;
//            layer.openlegend = true;
//            layer.intervals='5';
//            layer.opacity='0.7';
//            layer.colorramp='YlOrRd';
////            layer.colors='33CCff,00CCFF,0099FF,0066FF,0000FF';
//            layer.formula = '(series[i].data[j].y)';
//            layer.reclassify = false;
//            var l = new FM.layer(layer);
//            l.zindex = 100
//            return l
//        }


        function createLayer(layertitle, legendtitle, mu, formula, colorramp) {
            var layer = FMDEFAULTLAYER.getLayer("GAUL2", true, mu)
            layer.layertitle=layertitle;
            layer.joindata=''
            layer.addborders='true'
            layer.borderscolor='FFFFFF'
            layer.bordersstroke='0.8'
            layer.bordersopacity='0.4'
            layer.legendtitle=legendtitle;
            layer.lang='en';
            layer.jointype='shaded';
            layer.defaultgfi = true;
            layer.openlegend = true;
            layer.intervals='5';
            layer.opacity='0.7';
            layer.colorramp= colorramp;
//            layer.colors='33CCff,00CCFF,0099FF,0066FF,0000FF';
            layer.formula = formula;
            layer.reclassify = false;
            var l = new FM.layer(layer);
            l.zindex = 100
            return l
        }

        function createHighlightLayer(m) {
            var layer = FMDEFAULTLAYER.getLayer("GAUL2", true)
            layer.urlWMS = 'http://fenixapps2.fao.org/geoserver-demo'
            layer.layertitle="Scatter Analysis (Highlight)"
            layer.style = 'gaul2_highlight_polygon';
            layer.srs = 'EPSG:3857';
            layer.opacity='0.9';
            layer.cql_filter="";
            var layerHighlight = new FM.layer(layer, m);
            layerHighlight.zindex = 102
            return layerHighlight;
        }

        function getJsonFromUrl(url) {
            // log(location.search);
            var query = url.split('?');
            var data = query[1].split("&");
            var result = {};
            for(var i=0; i<data.length; i++) {
                var item = data[i].split("=");
                result[decodeURI(item[0].replace(/\+/g, '%20'))] = decodeURI(item[1].replace(/\+/g, '%20'));
            }
            return result;
        }

        // public instance methods
        return {
            build: build
        };
    };

});