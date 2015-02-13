
define(function() {

	var map;
	var MARKER = {
	    icon:  L.icon({
	        iconUrl: 'img/marker-8.png',
	        iconSize: [8, 8]
	    })
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

	function decodeToLayer(featureCollection, targetLayer, popupTmpl, featureStyle) {
	    var geom,bb,
	    	features = featureCollection["features"],
	    	popupOpts = {closeButton: false};

	    for (var i = 0; i < features.length; i++) {
	        var feature = features[i];

	        geom = feature["geometry"]["coordinates"];

	        switch(feature["geometry"]["type"]) {
	            case "Point":
	                L.marker([geom[1], geom[0]], MARKER).addTo(targetLayer);
	                break;
	            case "LineString":
	                var coords = Array.isArray(geom[0]) ? L.GeoJSON.coordsToLatLngs(geom, 0) : L.PolylineUtil.decode(geom);
	                
	                var poly = L.polyline(coords, featureStyle).addTo(targetLayer);

					poly.bindPopup( L.Util.template(popupTmpl, feature["properties"]), popupOpts);

	                break;
	            case "MultiLineString":
	                var ls = Array.isArray(geom[0][0]) ? L.GeoJSON.coordsToLatLngs(geom, 1) : _build_linestrings(geom);
	                
	                var poly = L.multiPolyline(ls, featureStyle).addTo(targetLayer);

	                poly.bindPopup( L.Util.template(popupTmpl, feature["properties"]), popupOpts);

	                break;
	            case "Polygon":
	                var rings = Array.isArray(geom[0][0]) ? L.GeoJSON.coordsToLatLngs(geom, 1) : _build_linestrings(geom);
	                
	                L.polygon(rings, featureStyle).addTo(targetLayer);
	                
	                poly.bindPopup( L.Util.template(popupTmpl, feature["properties"]), popupOpts);

	                break;
	            case "MultiPolygon":
	                var polygons = Array.isArray(geom[0][0]) ? L.GeoJSON.coordsToLatLngs(geom, 2) : _build_polygons(geom);
	                var poly = L.multiPolygon(polygons, featureStyle).addTo(targetLayer);
	                
	                poly.bindPopup( L.Util.template(popupTmpl, feature["properties"]), popupOpts);

	                break;
	            default:
	                console.error(feature.geometry.type + ' not implemented.');
	        }
	    }
	    return targetLayer;
	}

	return {
		decodeToLayer: decodeToLayer
	};
});