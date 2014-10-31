App = {

    init : function() {


        var m1 = App.createNigeriaMap('map1');

        // Zoom to NIGERIA
        m1.zoomTo('GAUL0', '182', 'EPSG:3827')
    },

    createNigeriaMap: function(id, layer) {

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

        var m = new FM.Map(id, options, mapOptions);
        m.createMap();

        var tile = this.createBaseLayer('ESRI_WORLDSTREETMAP','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('OSM','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('ESRI_WORLDTERRAINBASE','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('MAPQUEST_NASA_AERIAL','EN' );
        m.addTileLayer(tile, true);

        // NIGERIA

        // Nigeria MODIS NDVI - 09/13/2013
        var layer = {};
        layer.layername = 'nga_modis_ndvi_20130913'
        layer.layertitle = 'Nigeria MODIS NDVI - 09/13/2013'
        layer.style = ''
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.srs = 'EPSG:3857';
        layer.opacity='0.9';
        layer.defaultgfi = true;
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '182',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        m.addLayerWMS(l);


        // Nigeria MODIS NDVI - 09/29/2013
        var layer = {};
        layer.layername = 'nga_modis_ndvi_20130929'
        layer.layertitle = 'Nigeria MODIS NDVI - 09/29/2013'
        layer.style = ''
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.srs = 'EPSG:3857';
        layer.opacity='0.9';
        layer.defaultgfi = true
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '182',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        m.addLayerWMS(l);

        // Nigeria MODIS NDVI - 10/15/2013
        var layer = {};
        layer.layername = 'nga_modis_ndvi_20131015'
        layer.layertitle = 'Nigeria MODIS NDVI - 10/15/2013'
        layer.style = ''
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.srs = 'EPSG:3857';
        layer.opacity='0.9';
        layer.defaultgfi = true
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '182',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        m.addLayerWMS(l);

        // Nigeria MODIS NDVI - 10/31/2013
        var layer = {};
        layer.layername = 'fenix:nga_modis_ndvi_20131031'
        layer.layertitle = 'Nigeria MODIS NDVI - 10/31/2013'
        layer.style = ''
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.srs = 'EPSG:3857';
        layer.opacity='0.9';
        layer.defaultgfi = true
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '182',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        m.addLayerWMS(l);



        // NIGERIA GAUL1
        var layer = {};
        layer.layername = 'gaul1_nga'
        layer.layertitle = 'Nigeria Administrative Boundaries Lvl1'
        layer.style = ''
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.srs = 'EPSG:3857';
        layer.opacity='1';
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '182',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        console.log(JSON.stringify(layer))
        m.addLayerWMS(l);

        // Country Boundaries
        var layer = {};
        layer.layername = 'gaul0_line_3857'
        layer.layertitle = 'Country Boundaries'
        layer.style = ''
        layer.urlWMS = 'http://fenix.fao.org/geo'
        layer.srs = 'EPSG:3857';
        layer.opacity='0.7';
        var l = new FM.layer(layer);
        console.log(JSON.stringify(layer))
        m.addLayerWMS(l);

        return m;
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
