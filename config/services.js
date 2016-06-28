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

    //Queries.data_sources += " WHERE data_source_code <> 'ifa' ";
    //Queries.data_sources += " AND data_source_code <> 'ifdc' ";
    //DISABLED datasources

    return {
        "dbName": "africafertilizer",
        "gaulLayer": "gaul0_faostat_afo_3857",
        "wdsUrl": "http://faostat3.fao.org/wds/rest/table/json",
        "wdsUrlExportCsv": "http://faostat3.fao.org/wds/rest/exporter/streamcsv",
        //TODO update to fenix.fao.org/geoserver...

        "wmsUrl": "http://fenixapps2.fao.org/geoserver-demo",
        "sldUrl": "http://fenixapps2.fao.org/geoservices/CSS2SLD",

        "url_geoserver_wms":"http://fenix.fao.org/geoserver",
        "url_spatialquery": "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/query/",
        "url_bbox":         "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/bbox/layer/gaul0_faostat_afo_4326/",        

        "url_spatialquery_enc": "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/query/{sql}?geojsonEncoding=True",
        "url_baselayer": "http://{s}.tile.osm.org/{z}/{x}/{y}.png",

        "url_events_attachments": "//fenixrepo.fao.org/afo/events/attachments/",

        "prices_international_banner": "images/prices/prices_international_banner_argus_fmb_africa_fertilizer_2017.jpg",  
        "prices_international_link": "http://www.argusmedia.com/events/argus-events/europe/fert-africa/home/?utm_medium=Partner&utm_source=ArgusWebinar&utm_campaign=Lon-Conf-FertAfrica16-MPifdc",
        "prices_international_chart": "images/prices/prices_international_chart_may2016.png",

        "eventCategories": {
            "1": "AFO technical workshops",
            "2": "AFO conferences &amp; events",
            "3": "AFO partners events",
            "4": "AFO partners corner"
        },

        "stats_compare_hidden_elements": {
            "ifa": [
                "prod",   //Production
                "exp",    //Export
                //"cons",   //Consumption
                //"imp",    //Import
                //"nfu",    //Non fertilizer use
                //"prodCap" //Production Capacities
            ]
        },

        "map_attribution": "&copy; <a href='http://www.openstreetmap.org/copyright'>OSM contrib</a>",
        "map_marker": "images/marker-icon.png",
        "map_center": [7.188100, 22.236328],

        "dateRangeSlider": {
            "prices_national": {
                defaultValues: {
                    min: new Date(2014, 2, 0),
                    max: new Date()
                },
                bounds: {
                    min: new Date(2010, 2, 0),
                    max: new Date()
                }
            },
            "prices_local": {
                defaultValues: {
                    min: new Date(2014, 7, 0),
                    max: new Date()
                },
                bounds: {
                    min: new Date(2010, 2, 0),
                    max: new Date()
                }
            }    
        },

        "queries": Queries
    };
});