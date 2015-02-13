
define(function() {

	var map;
	var MARKER = {
	    icon:  L.icon({
	        iconUrl: 'img/marker-8.png',
	        iconSize: [8, 8]
	    })
	};

	var GEOMSTYLE = {
	    fillOpacity: 0.35,
	    fillColor: "#B7440E",
	    opacity: 0.35,
	    color: "#9E3B0E",
	    weight: 2
	};

	// Polyfill fo isArray
	if(!Array.isArray) {
	    Array.isArray = function (vArg) {
	        var isArray;

	        isArray = vArg instanceof Array;

	        return isArray;
	    };
	}

	function _build_linestrings(geom) {
	    var paths = [];
	    for (var j = 0; j < geom.length; j++) {
	        paths.push(L.PolylineUtil.decode(geom[j]));
	    }
	    return paths;
	}

	function _build_polygons(geom) {
	    var polygons = [];
	    for (var i = 0; i < geom.length; i++) {
	        polygons.push(_build_linestrings(geom[i]));
	    }
	    return polygons;
	}

	function decodeToMap(featureCollection, map) {
	    var geom;
	    var features = featureCollection["features"];
	    //console.log(features)
	    var gj = L.GeoJSON;
	    for (var i = 0; i < features.length; i++) {
	        var feature = features[i];
	        console.log(feature)
	        geom = feature["geometry"]["coordinates"];
	       // console.log(geom)
	        switch(feature["geometry"]["type"]) {
	            case "Point":
	                L.marker([geom[1], geom[0]], MARKER).addTo(map);
	                break;
	            case "LineString":
	                var coords = Array.isArray(geom[0]) ? gj.coordsToLatLngs(geom, 0) : L.PolylineUtil.decode(geom);
	                L.polyline(coords, GEOMSTYLE).addTo(map);
	                break;
	            case "MultiLineString":
	                var ls = Array.isArray(geom[0][0]) ? gj.coordsToLatLngs(geom, 1) : _build_linestrings(geom);
	                L.multiPolyline(ls, GEOMSTYLE).addTo(map);
	                break;
	            case "Polygon":
	                var rings = Array.isArray(geom[0][0]) ? gj.coordsToLatLngs(geom, 1) : _build_linestrings(geom);
	                L.polygon(rings, GEOMSTYLE).addTo(map);
	                break;
	            case "MultiPolygon":
	                var polygons = Array.isArray(geom[0][0]) ? gj.coordsToLatLngs(geom, 2) : _build_polygons(geom);
	                var polyLine = L.multiPolygon(polygons, GEOMSTYLE).addTo(map);	                break;
	            default:
	                console.error(feature.geometry.type + ' not implemented.');
	        }
	    }
	}

	return {
		decodeToMap: decodeToMap
	};
});