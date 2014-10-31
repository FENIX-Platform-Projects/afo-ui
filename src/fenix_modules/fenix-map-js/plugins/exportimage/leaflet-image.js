(function(e){if("function"==typeof bootstrap)bootstrap("leafletimage",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeLeafletImage=e}else"undefined"!=typeof window?window.leafletImage=e():global.leafletImage=e()})(function(){var define,ses,bootstrap,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var queue = require('./queue');

// leaflet-image
    /**
     *
     *
     * @param map
     * @param options = {
     *          map: fenixmap or map
     * }
     * @param callback
     */

module.exports = function leafletImage(map, options, callback) {

    var o = {
        dimensions : {
            x : "1138",
            y : "400"
        }
    }

    console.log('exports');

    // forcing the dimension to the dimension of the map
    var dimensions = map.getSize();
    o.dimensions.x = dimensions.x;
    o.dimensions.y = dimensions.y;


    var layerQueue = new queue(1);

    var options = options;


    var canvas = document.createElement('canvas');
    canvas.width  = (o.dimensions.x);
    canvas.height = (o.dimensions.y);
    var ctx = canvas.getContext('2d');

    // layers are drawn in the same order as they are composed in the DOM:
    // tiles, paths, and then markers
    map.eachLayer(drawTileLayer);
    if (map._pathRoot) layerQueue.defer(handlePathRoot, map._pathRoot);
    map.eachLayer(drawMarkerLayer);
    layerQueue.awaitAll(layersDone);

    /**
     *
     * function to get all the active layers
     *
     * @param l
     */
    function drawTileLayer(l) {
        if (l instanceof L.TileLayer) {
            layerQueue.defer(handleTileLayer, l);
        }
    }

    function drawMarkerLayer(l) {
        if (l instanceof L.Marker && l.options.icon instanceof L.Icon) {
            layerQueue.defer(handleMarkerLayer, l);
        }
    }

    function done() {
        callback(null, options, canvas);
    }

    function layersDone(err, layers) {
        if (err) throw err;
        layers.forEach(function(layer) {
            if (layer && layer.canvas) {
                ctx.drawImage(layer.canvas, 0, 0);
            }
        });
        done();
    }

    /**
     *
     * Layer to handle in the export
     *
     * @param layer
     * @param callback
     * @returns {*}
     */
    function handleTileLayer(layer, callback) {
        var canvas = document.createElement('canvas');
        canvas.width  = o.dimensions.x;
        canvas.height = o.dimensions.y;

        var ctx = canvas.getContext('2d'),
            bounds = map.getPixelBounds(),
            origin = map.getPixelOrigin(),
            zoom = map.getZoom(),
            tileSize = layer.options.tileSize;

        // get opacity by id (if exist ID) TODO: remove JQuery
        var opacity = 1;
        try {
            opacity = $('#' + layer.options.id).css("opacity");
        } catch(e) {}

        if (zoom > layer.options.maxZoom ||
            zoom < layer.options.minZoom  ) {
            // this fixed the loading of the TileLayer.WMS
            //(layer.options.format && !layer.options.tiles)) {
             return callback();
        }

       // console.log('IF')

        var offset = new L.Point(
            ((origin.x / tileSize) - Math.floor(origin.x / tileSize)) * tileSize,
            ((origin.y / tileSize) - Math.floor(origin.y / tileSize)) * tileSize
        );


        var tileBounds = L.bounds(
            bounds.min.divideBy(tileSize)._floor(),
            bounds.max.divideBy(tileSize)._floor()),
            tiles = [],
            center = tileBounds.getCenter(),
            j, i, point,
            tileQueue = new queue(1);

        //console.log('TILEBOUNDS')
        //console.log(tileBounds)

        for (j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
            for (i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
                tiles.push(new L.Point(i, j));
            }
        }

        tiles.forEach(function(tilePoint) {
            var originalTilePoint = tilePoint.clone();

            layer._adjustTilePoint(tilePoint);
            console.log('LAYER');
            console.log(layer);

            console.log(originalTilePoint);

            var tilePos = layer._getTilePos(originalTilePoint).subtract(bounds.min).add(origin);

            if (tilePoint.y >= 0) {
                console.log(tilePoint);
                //var url = layer.getTileUrl(tilePoint) + '?cache=' + (+new Date());
                var url = layer.getTileUrl(tilePoint);
                console.log(url);
                console.log(opacity);
                tileQueue.defer(loadTile, url, tilePos, tileSize, opacity);
            }
        });

        tileQueue.awaitAll(tileQueueFinish);

        function loadTile(url, tilePos, tileSize, opacity, callback) {
            console.log(url);
            console.log(tilePos);
            console.log(tileSize);
            console.log("opacity: " +opacity);
            var im = new Image();
            im.crossOrigin = '';
            im.onload = function() {
               // console.log('im load');
                callback(null, {
                    img: this,
                    pos: tilePos,
                    size: tileSize,
                    opacity: opacity
                });
            };
            im.onerror = function() {
                //console.log('im error');
                // TODO: Force the reload. THIS COULD BE DANGROUS. Add a maximum loading
                loadTile(url, tilePos, tileSize, opacity, callback);
                /*callback(null, {
                    img: null,
                    pos: null,
                    size: null
                });*/
            };
            im.src = url;
        }

        function tileQueueFinish(err, data) {
            console.log("tileQueueFinish: ");
            console.log(data);
            data.forEach(drawTile);
            callback(null, { canvas: canvas });
        }

        function drawTile(d) {
            try {
                ctx.drawImage(d.img, Math.floor(d.pos.x), Math.floor(d.pos.y),
                d.size, d.size);
                // setting the opacity of each layer
                ctx.globalAlpha = ( d.opacity )? d.opacity: 1;
            }
            catch(e) {
                console.log(e);
            }
        }
    }

    function handlePathRoot(root, callback) {
        console.log('-----------> handlePathRoot: ' + root);
        var bounds = map.getPixelBounds();
        var origin = map.getPixelOrigin();
        var canvas = document.createElement('canvas');
        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
        var ctx = canvas.getContext('2d');
        var pos = L.DomUtil.getPosition(root).subtract(bounds.min).add(origin);
        try {
            ctx.drawImage(root, pos.x, pos.y);
        }catch (e) {
            console.log(e);
        }
        callback(null, {
            canvas: canvas
        });
    }

    function handleMarkerLayer(marker, callback) {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            pixelBounds = map.getPixelBounds(),
            minPoint = new L.Point(pixelBounds.min.x, pixelBounds.min.y),
            pixelPoint = map.project(marker.getLatLng()),
            url = marker._icon.src + '?cache=false',
            im = new Image(),
            size = marker.options.icon.options.iconSize,
            pos = pixelPoint.subtract(minPoint),
            x = pos.x - (size[0] / 2),
            y = pos.y - size[1];

        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
        im.crossOrigin = '';

        im.onload = function() {
            ctx.drawImage(this, x, y, size[0], size[1]);
            callback(null, {
                canvas: canvas
            });
        };

        im.src = url;
    }
};

},{"./queue":2}],2:[function(require,module,exports){
(function() {
  if (typeof module === "undefined") self.queue = queue;
  else module.exports = queue;
  queue.version = "1.0.4";

  var slice = [].slice;

  function queue(parallelism) {
    var q,
        tasks = [],
        started = 0, // number of tasks that have been started (and perhaps finished)
        active = 0, // number of tasks currently being executed (started but not finished)
        remaining = 0, // number of tasks not yet finished
        popping, // inside a synchronous task callback?
        error = null,
        await = noop,
        all;

    if (!parallelism) parallelism = Infinity;

    function pop() {
      while (popping = started < tasks.length && active < parallelism) {
        var i = started++,
            t = tasks[i],
            a = slice.call(t, 1);
        a.push(callback(i));
        ++active;
        t[0].apply(null, a);
      }
    }

    function callback(i) {
      return function(e, r) {
        --active;
        if (error != null) return;
        if (e != null) {
          error = e; // ignore new tasks and squelch active callbacks
          started = remaining = NaN; // stop queued tasks from starting
          notify();
        } else {
          tasks[i] = r;
          if (--remaining) popping || pop();
          else notify();
        }
      };
    }

    function notify() {
      if (error != null) await(error);
      else if (all) await(error, tasks);
      else await.apply(null, [error].concat(tasks));
    }

    return q = {
      defer: function() {
        if (!error) {
          tasks.push(arguments);
          ++remaining;
          pop();
        }
        return q;
      },
      await: function(f) {
        await = f;
        all = false;
        if (!remaining) notify();
        return q;
      },
      awaitAll: function(f) {
        await = f;
        all = true;
        if (!remaining) notify();
        return q;
      }
    };
  }

  function noop() {}
})();

},{}]},{},[1])
(1)
});
;