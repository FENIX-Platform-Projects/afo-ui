HM = {

    fenixMap: '',
    l: '',
    layers: [],
    selectedLayerIndex: 0,  //0 etc
    boundaries: '',
    layerLang: 'e',
    mapLang: 'EN',

    // layer used to highlight a country
    layerHighlight: '',

    // this one contains layersHashMap[0] = elementcode
    layersHashMap: {},

    rangesHM: [0.0,5,15,25,35],

    timeperiod: false,

    selectedCountryCode: '',

    init: function() {

        // default GUI variables
        var lang = 'EN';
        var spacing = 30;
        // var width = 700;
        //var height = 671;
        var width = '100%';
        var height = '100%';

        var mapHeight = 300;
        var heightHeaderFooter = 300;

        // getting url variables
        function getUrlVars()
        {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }
        var vars = getUrlVars();
        if ( vars['height'] )
            height = vars['height'];
        if ( vars['width'] )
            width = vars['width'];
        if ( height == '100%') {
            height = $(window).height() - spacing;
            mapHeight = height - heightHeaderFooter;
        }
        // setting the language
        if ( vars['lang'] )
            lang = vars['lang'].toUpperCase();

        switch(lang) {
            case 'ES' : HM.layerLang = 's'; HM.mapLang = 'ES'; break;
            case 'FR' :  HM.layerLang = 'f'; HM.mapLang = 'FR'; break;
        }

        $( "#hm-container" ).width(width);
        $( "#hm-map" ).width(width);
        $( "#hm-container" ).height(height);
        $( "#hm-map" ).height(mapHeight)


        $("#hm-logo").addClass('hm-logo-' + lang);

        // labels
        switch(lang)
        {
            case 'FR':
                $('#hm-proportion').html('Proportion de la');
                $('#hm-title').html('Population Totale sous-alimentée');
                $('#hm-timeline-title').html('Chronologie');
                $('#hm-legend').html('Légende');
                $('#hm-verylow').html('Très basse ');
                $('#hm-moderatelylow').html('Modérément basse');
                $('#hm-moderatelyhigh').html('Modérément élevée');
                $('#hm-high').html('Élevée')
                $('#hm-veryhigh').html('Très élevée')
                $('#hm-missing').html('Données manquantes ou insuffisantes')
                $('#hm-andover').html('et plus')
                $('#hm-areaname').html('Sélectionnez un pays sur la carte pour en obtenir les détails')

                break;
            case 'ES':
                $('#hm-proportion').html('Proporción de la');
                $('#hm-title').html('Población Total Sub-alimentada');
                $('#hm-timeline-title').html('Cronología');
                $('#hm-legend').html('Leyenda');
                $('#hm-verylow').html('Muy bajo');
                $('#hm-moderatelylow').html('Moderadamente bajo');
                $('#hm-moderatelyhigh').html('Moderadamente alto');
                $('#hm-high').html('Alto')
                $('#hm-veryhigh').html('Muy alto ')
                $('#hm-missing').html('Información ausente o insuficiente')
                $('#hm-andover').html('o más')
                $('#hm-areaname').html('Seleccionar un país en el mapa para obtener los detalles')
                break;
            default:
                $('#hm-proportion').html('Proportion Of');
                $('#hm-title').html('Total Population Undernourished');
                $('#hm-timeline-title').html('Timeline');
                $('#hm-legend').html('Legend');
                $('#hm-verylow').html('Very low');
                $('#hm-moderatelylow').html('Moderately low');
                $('#hm-moderatelyhigh').html('Moderately high');
                $('#hm-high').html('High')
                $('#hm-veryhigh').html('Very high')
                $('#hm-missing').html('Missing or insufficient data')
                $('#hm-andover').html('and over')
                $('#hm-areaname').html('Select a country on the map to get country details')
        }
        HM.createHungerMap('hm-map');
    },

    createHungerMap:function (id) {
        var options = {
            plugins: {
                geosearch : false,
                mouseposition: false,
                controlloading : true,
                zoomControl: 'bottomright'
            },
            guiController: {
                overlay : false,
                baselayer: false,
                wmsLoader: false,
                enablegfi: false
            },
            gui: {
                disclaimerfao: true,
                fullscreen: false
            }
        }

        var fenixMap = new FM.Map(id, options, {  zoom: 2, zoomControl:false, attributionControl: false });
        fenixMap.createMap();
       // $("#" + fenixMap.mapContainerID).append(HMUI.menu);
        fenixMap.lang = HM.mapLang;
        HM.fenixMap = fenixMap;

        HM.fenixMap.map.on('click', function (e) {
            // customGFI
            var fenixMap = e.target._fenixMap;
            var l = fenixMap.controller.selectedLayer;
            if ( l ) {
                HMRequests.countryGFI(l, e.layerPoint, e.latlng, fenixMap.map, l.layer.joincolumn);
            }
        });

        var tile = this.createBaseLayer('ESRI_WORLDSTREETMAP','EN' );
        fenixMap.addTileLayer(tile, true);

        var layer = {};
        //layer.joindata = '[(1,-2066.815),(2,-2066.815),(3,2325.163),(4,7432.631),(5,0.819),(7,5188.298),(8,36.239),(9,101276.026),(10,95528.009),(11,5857.891),(12,17.062),(13,46.616),(14,65.789),(15,7166.042),(16,58302.945),(17,2.578),(18,474.149),(19,15937.864),(20,3217.645),(21,336353.69),(22,1.9180000000000001),(23,140.821),(25,33.435),(26,49.548),(27,4465.658),(28,42317.386),(29,865.749),(32,8066.075),(33,36532.525),(35,94.377),(36,3.305),(37,4387.376),(38,4916.412),(39,9416.854),(40,10234.164),(41,522364.021),(44,50415.848),(45,187.862),(46,264.894),(47,2.7199999999999998),(48,3262.985),(49,9868.325),(50,334.26),(51,8337.017),(52,5320.167),(53,2381.933),(54,7087.516),(55,34.996),(56,5580.476),(57,11760.21),(58,11883.854),(59,22683.655),(60,2625.779),(61,16.732),(62,28727.468),(63,899.804),(64,20.757),(65,140.845),(66,793.663),(67,3694.165),(68,60659.5),(69,65.143),(70,24.887),(72,565.479),(73,2662.904),(74,140.385),(75,662.054),(79,46866.893),(80,1400.309),(81,3224.471),(83,1.858),(84,7239.469),(85,4.456),(86,12.676),(87,144.34),(88,1.389),(89,5469.25),(90,5579.662),(91,1101.739),(93,3141.915),(95,4491.726),(96,19.865),(97,5271.123),(98,2190.133),(99,380.688),(100,508261.089),(101,94877.394),(102,37521.892),(103,5816.421),(104,15952.075),(105,1155.018),(106,26977.114),(107,2822.185),(108,14403.894),(109,805.538),(110,20175.566),(112,861.339),(113,2853.415),(114,22929.481),(115,12337.724),(116,5242.938),(117,11853.839),(118,327.416),(119,1426.341),(120,4957.428),(121,534.613),(122,1226.291),(123,228.081),(124,2067.829),(125,13.914),(126,2698.239),(128,26.723),(129,17102.101),(130,1978.131),(131,7610.817),(132,0.178),(133,12466.539),(134,63.171),(135,76.041),(136,5553.445),(137,150.034),(138,70337.973),(141,9860.98),(142,19.484),(143,10519.213),(144,2847.059),(145,29.856),(146,1747.631),(147,3598.287),(148,0.142),(149,15853.75),(150,13017.411),(151,6.459),(153,220.124),(154,1060.004),(155,300.128),(156,34867.964),(157,5921.616),(158,12622.234),(159,39389.157),(160,0.404),(162,3351.416),(164,17.645),(165,92287.043),(166,2779.095),(167,5338.87),(168,315.611),(169,17110.641),(170,18774.485),(171,40853.49),(173,22728.946),(174,5246.627),(175,885.537),(176,470.397),(177,776.656),(178,3148.19),(179,191.667),(181,7846.047),(182,142.204),(183,13196.057),(184,1449.317),(185,83040.03),(186,4904.201),(187,1.442),(188,15.373),(189,42.028),(190,0.148),(191,18.834),(192,1.13),(193,8.999),(194,5105.592),(195,5677.828),(196,7.443),(197,1279.513),(198,1199.936),(199,2266.243),(200,49.149),(201,17793.969),(202,25928.401),(203,28372.677),(205,141.375),(206,62955.36),(207,508.234),(208,2841.087),(209,867.842),(210,5019.832),(211,4304.109),(212,6450.49),(213,5164.024),(214,3878.333),(215,25444.724),(216,53798.659),(217,1106.921),(218,0.063),(219,34.075),(220,209.411),(221,819.492),(222,3671.671),(223,39641.46),(225,931.016),(226,9989.592),(227,0.72),(228,214547.623),(229,40611.378),(230,31407.79),(231,282001.902),(233,11983.751),(234,22811.776),(235,14170.033),(236,29113.543),(237,46442.651),(238,53748.554),(239,7.418),(240,18.168),(243,3.221),(244,68.417),(248,10331.106),(249,5081.075),(250,2735.97),(251,4015.311),(255,5942.32),(256,450.058),(272,4702.146),(273,293.87),(299,275.416),(351,526288.942)]';
        layer.layertitle = 'GHG'
        layer.layers = 'gaul0_faostat_3857';
        layer.layername = 'gaul0_faostat_3857';
        layer.classification= 'custom';
        layer.joinboundary= 'FAOSTAT';
        layer.joincolumn = 'faost_code';
        layer.mu='Gigagrams';
        //layer.ranges='0.0,5,15,25,35';
        layer.ranges='-1,0.1,15,25,35';
        // layer.decimalnumbers='0';
        //layer.colors='c4c8cb,ffffff,fbc0bf,f69291,ee5552,ad2026';
        layer.colors='c4c8cb,ffffff,fbc0bf,f69291,ee5552,ad2026';

        layer.legendtitle=''
        layer.lang=HM.layerLang;
        layer.jointype='shaded';
        layer.layertype = 'JOIN';
        layer.defaultgfi = true;
        //layer.openlegend = true;
        layer.srs = 'EPSG:3857';
        HM.l = new FM.layer(layer, fenixMap);
        HM.l.zindex = 102;

        var boundaries = {};
        boundaries.layername = 'gaul0_line_3857'
        boundaries.layertitle = 'Boundaries'
        boundaries.style = ''
        boundaries.urlWMS = 'http://fenix.fao.org/geo'
        boundaries.srs = 'EPSG:3857';
        boundaries.opacity='0.9';
        var lboundaries = new FM.layer(boundaries, fenixMap);
        HM.boundaries = lboundaries;
        HM.boundaries.zindex = 104;
        fenixMap.addLayerWMS(lboundaries);

        HMRequests.getElements(HM_CONFIG.ITEMCODE, HM.layerLang);

        var layerHighlight = {};
        layerHighlight.layertitle = 'GHG'
        //layerHighlight.urlWMS = 'http://fenix.fao.org/geo'
        layerHighlight.urlWMS = 'http://hqlprfenixapp1.hq.un.fao.org:10090/geoserver/wms'
        layerHighlight.layername = 'gaul0_faostat_3857';
        layerHighlight.style = 'gaul0_highlight_polygon';
        layerHighlight.srs = 'EPSG:3857';
        layerHighlight.opacity='0.9';
        layerHighlight.cql_filter="faost_code IN (1)";
        HM.layerHighlight = new FM.layer(layerHighlight, fenixMap);
        HM.layerHighlight.zindex = 104

        $("#" + HM.fenixMap.mapContainerID).append("<div class='fm-icon-box-background fm-btn-icon fm-fullscreen'><div class='fm-icon-sprite fm-icon-fullscreen' id='hm-fullscreen'><div></div>");
        $('#hm-fullscreen').on('click', function () {
            var lang =''
            if ( HM.mapLang.toUpperCase() != 'EN')
                lang = '?lang=' + HM.mapLang.toUpperCase()
            window.open(HM_CONFIG.BASE_URL + lang);
        });

        $('#hm-timeline-title').on('click', function () {
            if ( HM.timeperiod ) {
                HM.timeperiod = false;
                clearInterval(HM.interval);
            }
            else {
                HM.timeperiod = true;
                HM.interval = setInterval(function(){
/*                    var index = HM.selectedLayerIndex+1;
                    if (index >= HM.layers.length)
                        index = 0;*/

                    var index = HM.selectedLayerIndex-1;
                    if (index <= -1)
                        index = HM.layers.length -1;
                      HM.switchLayer(index)
                 },3000);
            }
        });
    },

    switchLayer: function(id) {
        var index = id;
        // reset classes and select
        for(var i=0; i< HM.layers.length; i++) {
            if ( index != i )
                $("#hm-timeline-" + i).removeClass('hm-timeline-selected');
        }
        $("#hm-timeline-" + index).addClass('hm-timeline-selected');

        // close popup or remove the countries details
        //HM.fenixMap.map.closePopup();
        // remove highlighted country
        var l = HM.layerHighlight;
        l.removeLayer();

        var oldLayer = HM.layers[HM.selectedLayerIndex];
        var nextLayer = HM.layers[id];
        HM.selectedLayerIndex = id;
        oldLayer.removeLayer();
        HM.fenixMap.createShadedLayerRequestCached(nextLayer);
        HM.fenixMap.controller.selectedLayer = nextLayer;

        if ( HM.selectedCountryCode ) {
            // load country information
            HMRequests.getCountryDetails(HM.map, HM_CONFIG.ITEMCODE, HM.layersHashMap[HM.selectedLayerIndex], HM.selectedCountryCode, HM.layerLang, null);
        }
    },

    highlightCountry: function(countryCode) {
        var l = HM.layerHighlight;
        l.removeLayer();
        l.layer.cql_filter="faost_code IN ("+ countryCode +")";
        HM.fenixMap.addLayerWMS(HM.layerHighlight);
    },

    createBaseLayer: function (layername, lang) {
        var layer = {};
        layer.layername = layername;
        layer.layertype ='TILE';
        layer.lang = lang;
        var l = new FM.TileLayer(layer);
        l.leafletLayer = l.createTileLayer(layer.layername);
        return l;
    }

};
