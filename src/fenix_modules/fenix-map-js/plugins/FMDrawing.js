// Wrap code with module pattern.
(function() {
    var global = this;

    // widget constructor function
    global.FMDrawing = function() {

        var o = {
            fenixmap: null, // pass the used fenixmap
            type: 'SCATTER',
            drawnitems: null, // L.FeatureGroup() -> used to handle the drawn geometries
            scatterquerylayer: null, // scatter query layer used to spatial query
            scatterchart: null, // scatterchart

            queryrules:  {
                /*
                default:        'ST_Contains',
                point:          'ST_Contains',
                polygon:        'ST_Contains',
                multipolygon:   'ST_Contains'
                */
                default:      'ST_Intersects',
                point:        'ST_Intersects',
                polygon:      'ST_Intersects',
                multipolygon: 'ST_Intersects'

            },
        };

        // private instance methods
        var init = function(obj) {
            // TODO: check if the drawing module is loaded, otherwise load it
            o = $.extend(true, {}, o, obj);
            var fenixmap = o.fenixmap;
            switch (o.type) {
                case 'SCATTER': addDrawScatterControl(fenixmap); break;
                case 'CROWDPRICES': alert('to be implented'); break;
                default: addDrawScatterControl(fenixmap); break;
            }
        };

        var addDrawScatterControl= function() {
            o.drawnitems = new L.FeatureGroup();
            o.fenixmap.map.addLayer(o.drawnitems);

            var drawControl = new L.Control.Draw({
                draw: {
                    position: 'topleft',
                    polygon: {
                        title: 'Draw a polygon!',
                        allowIntersection: false,
                        drawError: {
                            color: '#b00b00',
                            timeout: 1000
                        },
                        shapeOptions: {
                            color: '#bada55'
                        }
                    },
                    circle: {
                        shapeOptions: {
                            color: '#662d91'
                        }
                    }
                },
                edit: {
                    featureGroup: o.drawnitems
                }
            });
            o.fenixmap.map.addControl(drawControl);

            o.fenixmap.map.on('draw:created', function (e) {
                var type = e.layerType,
                    layer = e.layer;
                if (type === 'marker') {
                    //layer.bindPopup('A popup!');
                }
                layer.layerType = type;
                o.drawnitems.addLayer(layer);

                // load the query
                scatterSpatialQuery();
            });

            o.fenixmap.map.on('draw:edited', function (e) {
                // reload the query
                scatterSpatialQuery();
            });

            o.fenixmap.map.on('draw:deleted', function (e) {
                // reload the query
                scatterSpatialQuery();
            });
        };

        /**
         * Create the spatial query
         */
        var scatterSpatialQuery = function() {
            var drawitems = o.drawnitems;
            var drawnlayers = drawitems.getLayers();
            var scatterquerylayer = o.scatterquerylayer.layer;
            var queries = [];
            for( var i=0; i < drawnlayers.length; i++) {
                var geoJson = drawnlayers[i].toGeoJSON();
                var wkt = Terraformer.WKT.convert(geoJson.geometry);
                queries.push(createQueryRuleFromWKT(o.queryrules, geoJson.geometry.type.toUpperCase(),wkt, scatterquerylayer.geometrycolumn, scatterquerylayer.srs));
            }
            if ( queries.length > 0 ) loadQueries(queries);
            else o.scatterchart.highlightChartValues([]);
        }

        /**
         *
         * Method to create the query's where condition
         *
         * @param queryrules
         * @param type
         * @param wkt
         * @param geometrycolumn
         * @param layersrs
         * @returns {string}
         */
        var createQueryRuleFromWKT = function(queryrules, type, wkt, geometrycolumn, layersrs) {
            var rule = (queryrules[type.toLowerCase()])? queryrules[type.toLowerCase()] : queryrules.default;
            var srs =  layersrs.split(":")? layersrs.substring(layersrs.indexOf(":")+1, layersrs.length) : layersrs;
            var qWKT = "ST_Transform(ST_GeomFromText('"+ wkt +"', 4326), "+ srs +")";

            /** TODO: find a way to do it nicer, but it should work in most cases **/
            var q = rule + "(";
            switch (type.toUpperCase()) {
                case 'POINT': q += geometrycolumn +','+ qWKT; break;
                default:      q += qWKT +','+ geometrycolumn; break;
            }
            q += ')';
            // points "ST_Contains("+ scatterquerylayer.layer.geometrycolumn +", ST_Transform(ST_GeomFromText('"+ wkts[i] +"', 4326), 3857)) ";
            // polygons/multipolygons etc "ST_Contains(ST_Transform(ST_GeomFromText('"+ wkt +"', 4326), 3857), "+ scatterquerylayer.layer.geometrycolumn +") "
            return q;
        }

        /**
         *
         * Create and perform the query to be passed to the WDS
         *
         * @param queries
         */
        var loadQueries = function(queries) {
            var scatterquerylayer = o.scatterquerylayer;
            var scatterchart = o.scatterchart;
            var data = {};
            data.datasource = (o.scatterquerylayer.datasource)? o.scatterquerylayer.datasource: 'FENIX'; // DEFAULT DATASOURCE (TODO: handle it better)
            data.select = scatterquerylayer.layer.joincolumn;
            data.from = scatterquerylayer.layer.layers;
            var where = '';
            for ( var i=0; i < queries.length; i++) {
                // where += "ST_Contains(ST_Transform(ST_GeomFromText('"+ wkts[i] +"', 4326), 3857), "+ scatterquerylayer.layer.geometrycolumn +") ";
                where += queries[i];
                if ( i < queries.length -1 ) where += ' OR ';
            }
            data.where = where;
            //data.where = "ST_Contains(ST_Transform(ST_GeomFromText('"+ wkt +"', 4326), 3857), "+ scatterquerylayer.layer.geometrycolumn +") "
            $.ajax({
                type : 'POST',
                url :  FMCONFIG.BASEURL_WDS + FMCONFIG.WDS_SERVICE_SPATIAL_QUERY,
                data : data,
                success : function(response) {
                    var data = (typeof data == 'string')? $.parseJSON(response): response;
                    scatterchart.highlightChartValues(data);
                },
                error : function(err, b, c) { }
            });
        }

        return {
            init: init
        };
    };

})();