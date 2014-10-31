// Wrap code with module pattern.
(function() {
    var global = this;

    // widget constructor function
    global.FMChartScatter = function() {

        var o = {
            chart : {
                color: ['rgba(0, 0, 0, .5)', 'rgba(22, 83, 83, .5)', 'rgba(13, 13, 13, .5)'],
                colorHighlight:   'rgba(223, 83, 83, .5)',
                colorRegression: 'rgba(0, 0, 150, .5)',

                data: '',
                id: '',

                delim: ",",
                textdelim: "\"",

                chart_title: '',
                yaxis_title: '',
                xaxis_title: '',

                keyword: 'FAOSTAT_DEFAULT_SCATTER',

                datatype: 'JSON', //JSON, CSV
                enableRegression: true,

                chartObj: '',

                // TODO: this should be used to avoid the highlight of the map when is pressed the reset button
                originalAxes: {
                    xmin: null,
                    xmax: null,
                    ymin: null,
                    ymax: null
                }
            },
            maps: [
                // example of definition for each map
                /*{
                    id: '', // the Map ID
                    fenixMap: '',
                    layers: [
                        {
                            l: '', // layer
                            lHighlight: ''
                            lmouseover: ''
                        }
                    ]
                } */
            ],
            type: 'GEOCODE', //GEOCODE, LATLON

            suffix: ''
        };

        // private instance methods
        var init = function(obj) {
            o = $.extend(true, {}, o, obj);
            switch(o.chart.datatype.toUpperCase()) {
                case 'CSV': createFromCSV(o.chart.data, o.chart.delim); break;
                case 'JSON': createFromJSON(o, o.chart.data); break;
                default: createFromJSON(o.chart.data); break;
            }
        };

        var seriesFromCSV = function(obj, dataURL) {
            o =  $.extend(true, {}, o, obj);
            $.get(dataURL, function( data ) {
                o.chart.data = data;
                createFromCSV();
            }).error('error');
        };

        var createFromCSV= function(csv, delim) {
            createFromJSON(o, csvjson.csv2json(csv, { delim : delim }));
        };

        var createFromJSON = function(o, json) {
            //console.log(json);
            switch(o.type.toUpperCase()) {
                case 'GEOCODE': createChartGEOCODE(o, json); break;
                case 'LATLON': createChartLATLON(o, json); break;
                default: createChartGEOCODE(o, json); break;
            }
        };

        var createChartGEOCODE = function(o, json) {
            var headers = [];
            var series = new Array();
            var data = new Array();

            for(i = 0; i < json.headers.length; i++)
                headers.push(json.rows[i]);

            var serie = {};
            var regressionSerie = {}
            var regressionData = []
            for(i = 0; i < json.rows.length; i++) {
                var s = {};
                var valuex = parseFloat(json.rows[i][json.headers[2]]);
                var valuey = parseFloat(json.rows[i][json.headers[3]]);
                var valuez = (json.rows[i].VALUEZ) ? parseFloat(json.rows[i].VALUEZ) : null;
                var clusterindex = (json.rows[i].CLUSTERINDEX) ? json.rows[i].CLUSTERINDEX : 0;
                s.color = o.chart.color[clusterindex];
                s.originalColor = o.chart.color[clusterindex];
                s.updated = false;
                s.x = valuex;
                s.y = valuey;
                s.name = json.rows[i][json.headers[1]];
                s.code =  json.rows[i][json.headers[0]];
                data.push(s);

                if ( o.chart.enableRegression ) regressionData.push([valuex,valuey]);
            }
            serie.data = data;
            serie.type = 'scatter';
            series.push(serie);

            // add regression line
            if ( o.chart.enableRegression ) {
                var r = fitData(regressionData).data;
                regressionSerie.data = r;
                regressionSerie.marker = {};
                regressionSerie.marker.enabled = false;
                regressionSerie.type = 'line';
                regressionSerie.enableMouseTracking = false;
                regressionSerie.name = 'Regression';
                regressionSerie.color = o.chart.colorRegression;
                regressionSerie.regression = true;
                series.push(regressionSerie);
            }

            // axis titles
            o.chart.xaxis_title = json.headers[2];
            o.chart.yaxis_title = json.headers[3];

            // create the chart
            createChart(o.chart.id, series);

//            console.log('series');
//            console.log(series);
        }

        var createChartLATLON = function(o, json) {
            var headers = [];
            var series = new Array();
            var data = new Array();

            for(i = 0; i < json.headers.length; i++)
                headers.push(json.rows[i]);

            var serie = {};
            var regressionSerie = {}
            var regressionData = []
            for(i = 0; i < json.rows.length; i++) {
                var s = {};
                var valuex = parseFloat(json.rows[i][json.headers[3]]);
                var valuey = parseFloat(json.rows[i][json.headers[4]]);
                var valuez = (json.rows[i].VALUEZ) ? parseFloat(json.rows[i].VALUEZ) : null;
                var clusterindex = (json.rows[i].CLUSTERINDEX) ? json.rows[i].CLUSTERINDEX : 0;
                s.color = o.chart.color[clusterindex];
                s.originalColor = o.chart.color[clusterindex];
                s.updated = false;
                s.x = valuex;
                s.y = valuey;
                s.name = json.rows[i][json.headers[2]];
                s.lat =  json.rows[i][json.headers[0]];
                s.lng =  json.rows[i][json.headers[1]];
                data.push(s);

                if ( o.chart.enableRegression ) regressionData.push([valuex,valuey]);
            }
            serie.data = data;
            serie.type = 'scatter';
            series.push(serie);

            // add regression line
            if ( o.chart.enableRegression ) {
                var r = fitData(regressionData).data;
                regressionSerie.data = r;
                regressionSerie.marker = {};
                regressionSerie.marker.enabled = false;
                regressionSerie.type = 'line';
                regressionSerie.enableMouseTracking = false;
                regressionSerie.name = 'Regression';
                regressionSerie.color = o.chart.colorRegression;
                regressionSerie.regression = true;
                series.push(regressionSerie);
            }

            // axis titles
            o.chart.xaxis_title = json.headers[2];
            o.chart.yaxis_title = json.headers[3];

            // create the chart
            createChartMarkerClusters(o.chart.id, series);
        }

        //
        var createChartMarkerClusters = function(id, series) {
            var chart_payload = {};
            chart_payload.engine = 'highcharts';
            chart_payload.keyword = o.chart.keyword;
            chart_payload.renderTo = id;

            chart_payload.title = o.chart.chart_title;
            chart_payload.title = o.chart.chart_title;
            chart_payload.legend = {};
            chart_payload.legend.enabled = true;

            chart_payload.yaxis = {};
            chart_payload.yaxis.title = o.chart.yaxis_title;
            chart_payload.xaxis = {};
            chart_payload.xaxis.title =  o.chart.xaxis_title;
            chart_payload.series = series;
            chart_payload.chart = {};
            chart_payload.chart.events = {};

            // map object
            var mapsObj = o.maps;

            chart_payload.chart.events =  {
                redraw: function (e) {
                    //mapsSpatialQueries(mapsObj, series,  this.xAxis[0].min, this.xAxis[0].max, this.yAxis[0].min, this.yAxis[0].max)
                },
                load: function() {
                    //mapsSpatialQueries(mapsObj, series,  this.xAxis[0].min, this.xAxis[0].max, this.yAxis[0].min, this.yAxis[0].max)
                }
            };

            chart_payload.tooltip = {}
            // chart_payload.tooltip.headerFormat = '' //'<b>{series.name}</b><br>';
            // chart_payload.tooltip.pointFormat = '<b>{point.name}</b><br> {point.x} - {point.y}';
            chart_payload.tooltip.enabled = false;



            // store chart
            o.chart.chartObj = FENIXCharts.plot(chart_payload);
            createMapMarkerClusters(series)
        }

        /** TODO: move it from here **/
        var createMapMarkerClusters = function(series) {

            //console.log(series);
            var markers = L.markerClusterGroup();
            var markerList = [];
            for(var i=0; i < series.length; i++) {
                for ( var j = 0; j < series[i].data.length; j++) {
                    if ( series[i].type == 'line') {
                        // this is the regression serie
                    }
                    else {
                        var title = series[i].data[j].name;
                        var marker = L.marker(new L.LatLng(series[i].data[j].lat, series[i].data[j].lng), { title: title });
                        marker.bindPopup(title);
                        markerList.push(marker);
                    }
                }
            }

            markers.addLayers(markerList);
            o.maps[0].fenixMap.map.addLayer(markers);
        }


        var createChart = function (id, series) {
            var chart_payload = {};
            chart_payload.engine = 'highcharts';
            chart_payload.keyword = o.chart.keyword;
            chart_payload.renderTo = id;

            chart_payload.title = o.chart.chart_title;
            chart_payload.legend = {};
            chart_payload.legend.enabled = true;

            chart_payload.yaxis = {};
            chart_payload.yaxis.title = o.chart.yaxis_title;
            chart_payload.xaxis = {};
            chart_payload.xaxis.title =  o.chart.xaxis_title;
            chart_payload.series = series;
            chart_payload.chart = {};
            chart_payload.chart.events = {};

            // map object
            var mapsObj = o.maps;
            var chartOriginalAxes = o.chart.originalAxes;

            chart_payload.chart.events =  {
                redraw: function (e) {
                    mapsSpatialQueries(mapsObj, series,  this.xAxis[0].min, this.xAxis[0].max, this.yAxis[0].min, this.yAxis[0].max)
                  },
                load: function() {
                    mapsSpatialQueries(mapsObj, series,  this.xAxis[0].min, this.xAxis[0].max, this.yAxis[0].min, this.yAxis[0].max)

                }
            };

            chart_payload.tooltip = {}
            chart_payload.tooltip.headerFormat = '' //'<b>{series.name}</b><br>';
            chart_payload.tooltip.pointFormat = '<b>{point.name}</b><br> {point.x} - {point.y}';

            // highlight layer on mouse over
            /*chart_payload.plotOptions = {};
            chart_payload.plotOptions.series = {};
            chart_payload.plotOptions.series.point = {};
            chart_payload.plotOptions.series.point.events = {};
            chart_payload.plotOptions.series.events = {};
            chart_payload.plotOptions.series.point.events =  {
                click: function (e) {
                    console.log(e);
                }
            };

            chart_payload.plotOptions.series.events =  {
                mouseOut: function (e) {
                    console.log(e);
                }
            }; */

            // store chart
            o.chart.chartObj = FENIXCharts.plot(chart_payload);

            // check min max axi
            //console.log(o.chart.chartObj);
            o.chart.originalAxes.xmin = o.chart.chartObj.xAxis[0].min;
            o.chart.originalAxes.xmax = o.chart.chartObj.xAxis[0].max;
            o.chart.originalAxes.ymin = o.chart.chartObj.yAxis[0].min;
            o.chart.originalAxes.ymax = o.chart.chartObj.yAxis[0].max;
        };

        var mapsSpatialQueries = function(mapsObj, series, xAxisMin, xAxisMax, yAxisMin, yAxisMax ) {
            //console.log("mapsSpatialQueries()");
            var chartOriginalAxes = o.chart.originalAxes;
            if ( chartOriginalAxes.xmin == xAxisMin && chartOriginalAxes.xmax == xAxisMax && chartOriginalAxes.ymin ==  yAxisMin && chartOriginalAxes.ymax == yAxisMax ) {
                mapsSpatialQueriesReset(mapsObj);
            }
            else {
                mapsSpatialQueriesLoad(mapsObj, series, xAxisMin, xAxisMax, yAxisMin, yAxisMax );
            }
        };

        var mapsSpatialQueriesLoad = function(mapsObj, series, xAxisMin, xAxisMax, yAxisMin, yAxisMax ) {
            //console.log("mapsSpatialQueriesLoad()");
            for(var i=0; i < mapsObj.length; i++) {
                var mapObj = mapsObj[i];
                var fenixMap = mapObj.fenixMap;
                for(var j=0; j < mapObj.layers.length; j++) {
                   // console.log(mapObj.layers[j]);
                    var l = mapObj.layers[j].l;
                    var layerHighlight = mapObj.layers[j].layerHighlight;
                    FM.SpatialQuery.scatterLayerFilterFaster(l, fenixMap, series, xAxisMin, xAxisMax, yAxisMin, yAxisMax, layerHighlight, l.layer.reclassify, l.layer.formula);
                }
            }
        };

        var mapsSpatialQueriesReset = function(mapsObj) {
            //console.log("mapsSpatialQueriesReset()");
            for(var i=0; i < mapsObj.length; i++) {
                var mapObj = mapsObj[i];
                for(var j=0; j < mapObj.layers.length; j++) {
                    var layerHighlight = mapObj.layers[j].layerHighlight;
                    if ( layerHighlight ) FM.SpatialQuery.highlightFeaturesOfLayer(layerHighlight, '');
                }
            }
        };

        /**
         *
         * @param slaveCharts: is an array of charts, those charts will be linked to the master one
         */
        var linkSlaveCharts = function(slaveCharts) {
            // getting the options in theory we can recreate the chart with a new set of options
            var options = o.chart.chartObj.options;
            var mapsObj = o.maps;
            var series = options.series;
            options.chart.events.redraw = function() {
                // altering the option that we need, in that case altering the redraw function
                updateCharts(series, this.xAxis[0].min, this.xAxis[0].max, this.yAxis[0].min, this.yAxis[0].max, slaveCharts);

                mapsSpatialQueries(mapsObj, series,  this.xAxis[0].min, this.xAxis[0].max, this.yAxis[0].min, this.yAxis[0].max)
            }
            o.chart.chartObj = new Highcharts.Chart(options);
        };

        /**
         * It's used when a chart is not anymore a Master Chart
         **/
        var removeEventsExceptMaps = function() {
            var options = o.chart.chartObj.options;
            var mapsObj = o.maps;
            var series = options.series;
            options.chart.events.redraw = function() {
                mapsSpatialQueries(mapsObj, series,  this.xAxis[0].min, this.xAxis[0].max, this.yAxis[0].min, this.yAxis[0].max)
            }
            o.chart.chartObj = new Highcharts.Chart(options);
        };

        /**
         *  It's used when a chart is not anymore a master chart and the Map is now the Master of the chart
         */
        var removeAllEvents = function() {
            var options = o.chart.chartObj.options;
            var mapsObj = o.maps;
            var series = options.series;
            //console.log( options.series);
            options.chart.events.redraw = function() {}
            o.chart.chartObj = new Highcharts.Chart(options);
        };

        var updateCharts = function(series, xmin, xmax, ymin, ymax, slaveCharts) {
            // get the visible points of the scatter chart
            var codes = getVisiblePoints(series, xmin, xmax, ymin, ymax);
            // update the slaveCharts highlighting the scatter points
            for(var i= 0; i < slaveCharts.length; i++)
                highlightChartValues(codes, slaveCharts[i].getChart().chartObj, o.chart.colorHighlight);
        };

        /**
         getThe visiblePoints of the Scatter Chart
         **/
        var getVisiblePoints = function( series, xmin, xmax, ymin, ymax) {
            var codes = new Array();
            for(var i=0; i < series.length; i++) {
                var points = series[i].data;
                for(var j=0; j < points.length; j++) {
                    if ( points[j].x >= xmin && points[j].x <= xmax && points[j].y >= ymin && points[j].y <= ymax ) codes.push(points[j].code);
                }
            }
            return codes;
        };

        var highlightChartValues = function(codes, chart, colorHighlight) {
            var colorHighlight = ( colorHighlight )? colorHighlight : o.chart.colorHighlight;
            var chart = ( chart )? chart : o.chart.chartObj;

            //var start = new Date().getTime();
            var series = chart.series;
            for(var i=0; i < series.length; i++) {
                // TODO: this should avoid the regression
                if ( series[i].type == 'line') {
                    // this is the regression serie
                }
                else {
                    // FASTER implementation
                    var data = new Array();
                    var points = series[i].data;
                    for(var j=0; j < points.length; j++) {
                        var containsCode = false;
                        for (var z=0; z < codes.length; z++) {
                            if ( codes[z] == points[j].code ) { containsCode = true; break; }
                        }
                        points[j].color = ( containsCode )? colorHighlight : points[j].originalColor;

                        var s = {};
                        var valuex = points[j].x;
                        var valuey = points[j].y;
                        s.color = points[j].color;
                        s.originalColor = points[j].originalColor;
                        s.x = valuex;
                        s.y = valuey;
                        s.name =  points[j].name;
                        s.code =   points[j].code;
                        data.push(s)
                    }
                    chart.series[i].update({  data: data}, false); //true / false to redraw
                }
                chart.redraw();

                // TODO: create a webservice to handle a lot of codes = (sends all data of the charts)
                // send the GEOCODES:
                // - send and array of objects to handle all the series, of the different graphs
                // return an array with all the objects of the series
            }
        };

        // public instance methods
        return {
            init: init,
            linkSlaveCharts: linkSlaveCharts,
            removeEventsExceptMaps: removeEventsExceptMaps,
            removeAllEvents: removeAllEvents,
            highlightChartValues: highlightChartValues,
            getObj: function()    {return o;},
            getChart: function()  {return o.chart;},
            getSuffix: function() { return o.suffix;}
        };
    };

})();