fx_CountrySTAT_SCATTER = {

    init : function() {

        FM.init(
            function() {
                var m1 = fx_CountrySTAT_SCATTER.createMap('map1', 'chart1');
                var m1 = fx_CountrySTAT_SCATTER.createMap('map2', 'chart1');
            }
        );
    },

    createMap:function (mapID, chartID) {
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

        // $("#content").append("<div style='  overflow: hidden; margin: 0 auto; text-align: left; width:800px; height: 400px;' id='map1'><div>");
        var m = new FM.Map(mapID, options, mapOptions);
        m.createMap();
        m.zoomTo('GAUL0', '182')

        var tile = this.createBaseLayer('ESRI_WORLDSTREETMAP','EN' );
        m.addTileLayer(tile, true);


        var layer = {};
        layer.layers='gaul2_3857'
        //layer.layers='gaul2_nga_3857'
        layer.styles=''
        layer.layertitle="Nigeria Gaul2"
        layer.joincolumn='adm2_code'
        layer.joindata=''
        layer.addborders='true'
        layer.borderscolor='FFFFFF'
        layer.bordersstroke='0.8'
        layer.bordersopacity='0.4'
        layer.legendtitle='Population/Poverty'
        //layer.cql_filter="adm0_code IN (182)";
        layer.mu = 'Index';
        layer.srs = 'EPSG:3857';
        layer.layertype = 'JOIN';
        layer.lang='e';
        layer.jointype='shaded';
        layer.defaultgfi = true;
        layer.openlegend = true;
        layer.layertype = 'JOIN';
        layer.geometrycolumn = 'the_geom'
        /*
         layer.colorramp='Reds'
         layer.intervals='4'
        */
        layer.intervals='3';
        //layer.colors='680000,FFFF00,009900';
        layer.colors='965a00,e88a00,f3ab2d';
        //layer.colors='8b001d,d5002b,eb3660';

        //layer.colors='680000,D80000,FFFF00,00CC33,009900';
        //layer.colors='FF0AFF,FF1EFF,D700D7,CD00CD';

        var l = new FM.layer(layer);

        console.log(JSON.stringify(layer))
        //m.addShadedLayer(l);


        // Layer to highlight
        var layer = {};
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.layers='gaul2_nga_3857'
        layer.styles=''
        layer.layertitle="Nigeria Gaul2 (Highlighted)"
        layer.joincolumn='adm2_code'
        layer.style = 'highlight_features';
        layer.srs = 'EPSG:3857';
        layer.opacity='0.9';
        // layer.hideLayerInControllerList = true; // this to hide the layer from the controller list
        layer.cql_filter="";
        var layerHighlight = new FM.layer(layer, m);
        layerHighlight.zindex = 104
        //m.addLayerWMS(layerHighlight)

        // Adding Chart
       var chart = Chart.initPopulationPovertyChart(chartID, m, l, layerHighlight);

        return m;
    },


    initDoubleMap : function() {

        FM.init(
            function() {

                var layer = {};
                layer.layers='gaul2_3857'
                //layer.layers='gaul2_nga_3857'
                layer.styles=''
                layer.layertitle="Nigeria Gaul2"
                layer.joincolumn='adm2_code'
                layer.joindata=''
                layer.addborders='true'
                layer.borderscolor='FFFFFF'
                layer.bordersstroke='0.8'
                layer.bordersopacity='0.4'
                layer.legendtitle='Population/Poverty'
                layer.cql_filter="adm0_code IN (182)";
                layer.mu = 'Index';
                layer.srs = 'EPSG:3857';
                layer.layertype = 'JOIN';
                layer.lang='e';
                layer.jointype='shaded';
                layer.defaultgfi = true;
                layer.openlegend = true;
                layer.layertype = 'JOIN';
                layer.geometrycolumn = 'the_geom'
                layer.intervals='3';
                layer.colors='965a00,e88a00,f3ab2d';
                var l1 = new FM.layer(layer);

                var m1 = fx_CountrySTAT_SCATTER.createDoubleMap('map1', l1);

                // Layer to highlight
                var layer = {};
                layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
                layer.layers='gaul2_nga_3857'
                layer.styles=''
                layer.layertitle="Nigeria Gaul2 (Highlighted)"
                layer.joincolumn='adm2_code'
                layer.style = 'highlight_features';
                layer.srs = 'EPSG:3857';
                layer.opacity='0.9';
                // layer.hideLayerInControllerList = true; // this to hide the layer from the controller list
                layer.cql_filter="";
                var layerHighlight1 = new FM.layer(layer, m1);
                layerHighlight1.zindex = 104

                // create second map
                var layer = {};
                layer.layers='gaul2_3857'
                //layer.layers='gaul2_nga_3857'
                layer.styles=''
                layer.layertitle="Nigeria Gaul2"
                layer.joincolumn='adm2_code'
                layer.joindata=''
                layer.addborders='true'
                layer.borderscolor='FFFFFF'
                layer.bordersstroke='0.8'
                layer.bordersopacity='0.4'
                layer.legendtitle='Population/Poverty'
                layer.cql_filter="adm0_code IN (182)";
                layer.mu = 'Index';
                layer.srs = 'EPSG:3857';
                layer.layertype = 'JOIN';
                layer.lang='e';
                layer.jointype='shaded';
                layer.defaultgfi = true;
                layer.openlegend = true;
                layer.layertype = 'JOIN';
                layer.geometrycolumn = 'the_geom'
                layer.intervals='3';
                layer.colors='965a00,e88a00,f3ab2d';
                var l2 = new FM.layer(layer);
                var m2 = fx_CountrySTAT_SCATTER.createDoubleMap('map2', l2);

                m1.syncOnMove(m2)
                m2.syncOnMove(m1)

                // create scatter chart
                var chart = fx_CountrySTAT_SCATTER.createScatterDoubleChart('chart1', m1, l1, layerHighlight1, m2, l2);
            }
        );
    },

    createDoubleMap:function (mapID, l) {
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

        // $("#content").append("<div style='  overflow: hidden; margin: 0 auto; text-align: left; width:800px; height: 400px;' id='map1'><div>");
        var m = new FM.Map(mapID, options, mapOptions);
        m.createMap();
        m.zoomTo('GAUL0', '182')

        var tile = this.createBaseLayer('ESRI_WORLDSTREETMAP','EN' );
        m.addTileLayer(tile, true);


        return m;
    },

    createScatterDoubleChart:function (chartID, map1, l1, layerHightlight1, map2, l2, layerHightlight2) {


        // Adding Chart
        var chart = Chart.initPopulationPovertyChartDoubleMap(chartID, map1, l1, layerHightlight1, map2, l2, layerHightlight2);
    },

    createBaseLayer: function (layername, lang) {
        var layer = {};
        layer.layername =layername;
        layer.layertype ='TILE';
        layer.lang = lang;
        var l = new FM.TileLayer(layer);
        l.leafletLayer = l.createTileLayer(layer.layername);
        return l;
    }


};
