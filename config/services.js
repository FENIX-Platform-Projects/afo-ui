define(['jquery',
    'text!config/queries.xml'
], function($,
    queries) {

    var Queries = {};

    $(queries).find('q').each(function() {
        var id = $(this).attr('id'),
            text = $(this).text().replace(/(?:\r\n|\r|\n)/g, ' ');
        Queries[ id ]= text;
    });
    //CONVERT XML TO JSON

    return {
        "dbName": "africafertilizer",
        "gaulLayer": "gaul0_faostat_afo_3857",
        "wdsUrl": "http://faostat3.fao.org/wds/"+
        "rest/table/json",
        "wdsUrlExportCsv": "http://faostat3.fao.org/wds/rest/exporter/streamcsv",
        //TODO update to fenix.fao.org/geoserver...

        "wmsUrl": "http://fenixapps2.fao.org/geoserver-demo",
        "sldUrl": "http://fenixapps2.fao.org/geoservices/CSS2SLD",

        "url_geoserver_wms": "http://fenix.fao.org/geoserver",
        "url_bbox": "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/bbox/layer/gaul0_faostat_afo_4326/",
        "url_spatialquery": "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/query/",

        "url_spatialquery_enc": "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/query/{sql}?geojsonEncoding=True",

        "url_geocoding": "http://fenix.fao.org/geo/fenix/geocoding/latlon/",
        "url_esrilayer": "http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}.png",
        "url_baselayer": "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        "url_osmlayer": "http://{s}.tile.osm.org/{z}/{x}/{y}.png",

        "url_events_attachments": "//fenixrepo.fao.org/afo/events/attachments/",

        "prices_international_banner": "images/prices/prices_international_banner_argus_fmb_europe.jpg",  
        "prices_international_link": "http://www.argusmedia.com/Events/Argus-Events/Europe/Fert-Euro/Home",
        "prices_international_chart": "images/prices/prices_international_chart_ago2015.png",

        "map_attribution": "&copy; <a href='http://www.openstreetmap.org/copyright'>OSM contrib</a>",
        "map_marker": "images/marker-icon.png",
        "map_center": [7.188100, 22.236328],

        "dateRangeSlider": {
            prices_national: {
                defaultValues: { min: new Date(2014, 2, 0), max: new Date(2015, 6, 0) },
                bounds: { min: new Date(2010, 2, 0), max: new Date(2015, 6, 0) }
            },
            prices_detaild: {
                defaultValues: { min: new Date(2014, 7, 0), max: new Date(2015, 7, 0) },
                bounds: { min: new Date(2010, 2, 0), max: new Date(2015, 7, 0) }
            }    
        },

        "queries": Queries
    };
});