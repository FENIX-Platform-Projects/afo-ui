FMCONFIG = {

    // fenix-maps-js config variables
    BASEURL: 'http://168.202.28.214:7070/fenix-map-js',

    //BASEURL_DEPENDENCIES: 'config/DEPENDENCIES.json',
    BASEURL_LANG: '../src/fenix-map-js/I18N/',

    // MAPS Servicies config variables
    //BASEURL_MAPS: 'http://fenixapps2.fao.org/maps',
    BASEURL_MAPS: 'http://fenixapps2.fao.org/maps-demo',
    //BASEURL_MAPS: 'http://localhost:7070/maps',

    DEFAULT_WMS_SERVER: 'http://fenixapps2.fao.org/geoserver-demo',

    // BASEURL_MAPS: 'fenixapps.fao.org/maps',
    //BASEURL_MAPS: '168.202.23.224:8081/maps',
    MAP_SERVICE_SHADED: '/rest/service/sld2',
    MAP_SERVICE_POINT:  '/rest/service/sld2',
    MAP_SERVICE_GFI_JOIN: '/rest/service/joingfi',
    MAP_SERVICE_GFI_STANDARD: '/rest/service/request',
    MAP_SERVICE_ZOOM_TO_BOUNDARY: '/rest/service/bbox',
    MAP_SERVICE_WMS_GET_CAPABILITIES: '/rest/service/request',
    MAP_SERVICE_PROXY: '/rest/service/request',

    MAP_SERVICE_WPS_HISTOGRAM: '/rest/wps/hist',

    /** WDS configuration **/
    //BASEURL_WDS: 'http://fenix.fao.org/wdshm',
    // BASEURL_WDS: 'http://168.202.23.224:8082/wds',
    BASEURL_WDS: 'http://fenixapps.fao.org/wds',
    WDS_SERVICE_SPATIAL_QUERY: '/rest/geo/sq',

    // Map Store
    D3SP_SERVICE_SAVEMAP: 'http://fenixapps.fao.org/d3sp/service/msd/dm/dataset/',
    D3SP_SERVICE_LOADMAP: 'http://fenixapps.fao.org/d3sp/service/msd/dm/',

    // PGEO

    WPS_SERVICE_STATS: 'http://168.202.28.214:5005/stats/raster/',
    WPS_SERVICE_HISTOGRAM: 'http://168.202.28.214:5005/stats/raster/{{ID}}/hist/',

    METADATA_GET_LAYERS: 'http://168.202.28.214:5005/search/layer/',
    METADATA_GET_LAYERS_BY_PRODUCT: 'http://168.202.28.214:5005/search/layer/product/'

};