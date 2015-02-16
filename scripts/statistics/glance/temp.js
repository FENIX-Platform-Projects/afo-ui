
require([
    'glance',
    'jquery',
    'underscore',
    'fx-menu/start',
    './scripts/components/AuthenticationManager',
    'amplify',
    'bootstrap',
    'domready!'
], function ($, _, Menu, AuthenticationManager) {

    new Menu({
        active: 'statistics',
        url: 'config/fenix-ui-menu.json',
        className: 'fx-top-menu',
        breadcrumb: {
            active: true,
            container: "#breadcumb_container",
            showHome: true
        }
    });

    new AuthenticationManager();
    amplify.subscribe('login', function (user) {
        console.warn("Event login intercepted");
        console.log(amplify.store.sessionStorage('afo.security.user'));
    });

    Countries = JSON.parse(Countries);
    Regions = JSON.parse(Regions);
    Africa = JSON.parse(Africa);

    var listRegions$ = $('#stats_select .stats_list_regions'),
        listCountries$ = $('#stats_select .stats_list_countries'),
        mapzoomsRegions$ = $('#stats_map_regions').next('.map-zooms'),
        mapzoomsCountries$ = $('#stats_map_countries').next('.map-zooms');

    var style = {
            fill: true,
            color: '#6AAC46',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.4,
            fillColor: '#6AAC46'
        },
        styleHover = {
            fill: true,
            color: '#6AAC46',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6,
            fillColor: '#6AAC46'
        };

    for (var r in Regions)
        listRegions$.append('<option value="' + Regions[r][0] + '">' + Regions[r][1] + '</option>');

    for (var c in Countries)
        listCountries$.append('<option value="' + Countries[c][1] + '">' + Countries[c][2] + '</option>');

    var mapCountries = L.map('stats_map_countries', {
        zoom: 4,
        zoomControl: false,
        attributionControl: false,
        center: L.latLng(20, 0),
        layers: L.tileLayer(Config.url_baselayer)
    });

    var geojsonCountries = L.geoJson(null, {
        style: function (feature) {
            return style;
        },
        onEachFeature: function (feature, layer) {

            layer.setStyle(style);

            layer.on("mouseover", function (e) {
                layer.setStyle(styleHover);
            });

            layer.on("mouseout", function (e) {
                layer.setStyle(style);
            });

            layer.on("click", function (e) {
                console.log(layer.properties);
            });
        }
    }).addTo(mapCountries);

    var zoomToCountries = function (fmMap, codes) {
        var query = "SELECT ST_AsGeoJSON(ST_Transform(ST_SetSRID(ST_Extent(geom), 3857), 4326)) " +
                "FROM spatial.gaul0_faostat3_3857 " +
                "WHERE iso3 IN ('" + codes.join("','") + "')",

            url = mapConf.url_bbox + 'iso3/' + encodeURIComponent(codes.join());

        $.getJSON(url, function (json) {

            geojsonCountries.fitBounds(json);

        });
    };

    var geomCountries = function (codes) {

        var query = "SELECT ST_AsGeoJSON(ST_Transform(ST_SetSRID(geom, 3857), 4326)) " +
                "FROM spatial.gaul0_faostat3_3857 " +
                "WHERE faost_code IN (" + codes.join(',') + ")",

            url = Config.url_spatialquery + encodeURIComponent(query);


        $.getJSON(url, function (json) {
            geojsonCountries.fitBounds(json);

        });

        $.getJSON(url, function (json) {

            var geom = JSON.parse(json[0][0]);

            geojsonCountries.clearLayers().addData(geom);

            mapCountries.fitBounds(geojsonCountries.getBounds());

        });
    };

    var geomRegions = function (regCode) {

        regCode = parseInt(regCode);

        codes = _.filter(Countries, function (v) {
            return v[0] === regCode;
        });

        codes = _.map(codes, function (v) {
            return v[1];
        });

        var url = Config.url_spatialquery + Config.queries.countries_geojson +
            encodeURIComponent("(" + codes.join(",") + ")");

        $.getJSON(url, function (json) {

            var geom = JSON.parse(json[0][0]);

            geojsonRegions.clearLayers().addData(geom);

        });
    };

    mapzoomsCountries$.on('click', '.btn', function (e) {
        var z = parseInt($(this).data('zoom'));
        mapCountries[z > 0 ? 'zoomIn' : 'zoomOut']();
    });

    listRegions$.on('click', 'option', function (e) {

        var regCode = $(e.target).attr('value');

        //geomRegions(regCode);

        var service = "http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/query/"
        var url = service += "SELECT ST_AsGeoJSON(geom), adm0_code, areanamee FROM spatial.gaul0_faostat3_4326 WHERE adm0_code IN (1,2)?geojsonEncoding=True"

// Add neighbourhood geojson (encoded) file to map.
        $.getJSON(url, function (data) {
            //console.log(data);
            geojsonDecoder.decodeToMap(data, mapCountries);
        });

    });

    listCountries$.on('click', 'option', function (e) {

        var code = $(e.target).attr('value');

        geomCountries([code]);

    });


    $('.footer').load('html/footer.html');
});

});
