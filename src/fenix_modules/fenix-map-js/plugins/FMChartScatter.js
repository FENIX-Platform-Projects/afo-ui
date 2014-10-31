var FMChartScatter = function() {

    var result = {

        chart: {
            color: ['rgba(223, 83, 83, .5)', 'rgba(22, 83, 83, .5)', 'rgba(13, 13, 13, .5)'],
            colorHighlight:  'rgba(200, 150, 150, .5)',
            colorRegression: 'rgba(0, 0, 102, .9)',

            data: '',
            id: '',

            delim: ",",
            textdelim: "\"",

            chart_title: '',
            yaxis_title: '',
            xaxis_title: '',

            keyword: 'FAOSTAT_DEFAULT_SCATTER'
        },

        maps: [

            // exmaple of definition for each map
            {
                id: '',
                fenixMap: '',
                layers: [
                    {
                        layer: '',
                        layerHighlight: ''
                    },
                    {
                        layer: '',
                        layerHighlight: ''
                    },
                    {
                        layer: '',
                        layerHighlight: ''
                    }
                ]
            }
        ],

        // TODO: in theory should be used the objects above
        o: {

            chart : {
                color: ['rgba(223, 83, 83, .5)', 'rgba(22, 83, 83, .5)', 'rgba(13, 13, 13, .5)'],
                colorHighlight:  'rgba(0, 0, 0, .5)',
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
                enableRegression: true
            },

            map : {
                id: '',
                fenixMap: '',
                layer: '',
                layerHighlight: ''
            },

            type: 'GEOCODE' //GEOCODE, LATLON

        },

        chartObj: '', // this is callback the object

        // CODE, LABEL, VALUEX, VALUEY, VALUEZ, CLUSTERINDEX, CLUSTERLABEL
        init: function(obj) {
            this.o =  $.extend(true, {}, this.o, obj);

            // chart
            /*if ( o.chart)
             this.chart =  $.extend(true, {}, this.chart, o.chart);

             // maps
             if ( o.map)
             this.chart =  $.extend(true, {}, this.chart, o.chart);*/

            switch(this.o.chart.datatype.toUpperCase()) {
                case 'CSV': this._createFromCSV(this.o.chart.data, this.o.chart.delim); break;
                case 'JSON': this._createFromJSON(this.o, this.o.chart.data); break;
                default: this._createFromJSON(this.o.chart.data); break;
            }

        },

        seriesFromCSV: function(obj, dataURL) {
            this.o =  $.extend(true, {}, this.o, obj);
            var _this = this;
            $.get(dataURL, function( data ) {
                _this.o.chart.data = data;
                _this._createFromCSV();
            }).error('error');

        },

        _createFromCSV: function(csv, delim) {
            this._createFromJSON(this.o, csvjson.csv2json(csv, { delim : delim }));
        },

        _createFromJSON: function(o, json) {
            console.log(json);

            var headers = [];
            var series = new Array();
            var data = new Array();

            for(var i = 0; i < json.headers.length; i++)
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
                s.geocode =  json.rows[i][json.headers[0]];
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
                regressionSerie.color = o.chart.colorRegression;
                regressionSerie.regression = true;
                series.push(regressionSerie);
            }

            // axis titles
            o.chart.xaxis_title = json.headers[2];
            o.chart.yaxis_title = json.headers[3];

            // store chart
            this.chartObj = this._createChart(o.chart.id, series);
        },

        _createChart:function (id, series) {
            var chart_payload = {};
            chart_payload.engine = 'highcharts';
            chart_payload.keyword = this.o.chart.keyword;
            chart_payload.renderTo = id;
            
            chart_payload.title = this.o.chart.chart_title;

            chart_payload.yaxis = {};
            chart_payload.yaxis.title = this.o.chart.yaxis_title;
            chart_payload.xaxis = {};
            chart_payload.xaxis.title =  this.o.chart.xaxis_title;
            chart_payload.series = series;
            chart_payload.chart = {};
            chart_payload.chart.events = {};

            // map object
            var mapObj = this.o.map;

            chart_payload.chart.events =  {
                redraw: function (e) {
                    var fenixMap = mapObj.fenixMap;
                    var l = mapObj.l;
                    var layerHighlight = mapObj.layerHighlight;
                    log('chart_payload.chart.events_redraw', l);

                    FM.SpatialQuery.scatterLayerFilterFaster(l, fenixMap, series, this.xAxis[0].min, this.xAxis[0].max, this.yAxis[0].min, this.yAxis[0].max, true, layerHighlight, l.layer.reclassify, l.layer.formula);
                },
                load: function() {
                    var fenixMap = mapObj.fenixMap;
                    var l = mapObj.l;
                    var layerHighlight = mapObj.layerHighlight;

                    // todo to handle multiple maps
                    FM.SpatialQuery.scatterLayerFilterFaster(l, fenixMap, series, this.xAxis[0].min, this.xAxis[0].max, this.yAxis[0].min, this.yAxis[0].max, true, layerHighlight, l.layer.reclassify, l.layer.formula);
                }
            };

            chart_payload.tooltip = {}
            chart_payload.tooltip.headerFormat = '' //'<b>{series.name}</b><br>';
            chart_payload.tooltip.pointFormat = '<b>{point.name}</b><br> {point.x} - {point.y}';

            return  FENIXCharts.plot(chart_payload);
        },

        /**
         *
         * @param slaveCharts: is an array of charts, those charts will be linked to the master one
         */
        linkSlaveCharts: function(slaveCharts) {
            log('linkSlaveCharts', this.chartObj);

            // getting the options in theory we can recreate the chart with a new set of options
            var options = this.chartObj.options;
            var _this = this;
            var mapObj = this.o.map;
            var series = options.series;
            options.chart.events.redraw = function() {
                // altering the option that we need, in that case altering the redraw function

                _this._updateCharts(series, this.xAxis[0].min, this.xAxis[0].max, this.yAxis[0].min, this.yAxis[0].max, slaveCharts)

                var fenixMap = mapObj.fenixMap;
                var l = mapObj.l;
                var layerHighlight = mapObj.layerHighlight;
                FM.SpatialQuery.scatterLayerFilterFaster(l, fenixMap, series, this.xAxis[0].min, this.xAxis[0].max, this.yAxis[0].min, this.yAxis[0].max, true, layerHighlight, l.layer.reclassify, l.layer.formula);
            }
            this.chartObj = new Highcharts.Chart(options);
        },

        _updateCharts: function(series, xmin, xmax, ymin, ymax, slaveCharts) {
            // get the visible points of the scatter chart
            var geocodes = this._getVisiblePoints(series, xmin, xmax, ymin, ymax);

            // update the slaveCharts highlighting the scatter points
            for(var i= 0; i < slaveCharts.length; i++)
                this._highlightChartValues(slaveCharts[i].chartObj, geocodes, this.o.chart.colorHighlight);
        },

        /**
         getThe visiblePoints of the Scatter Chart
         **/
        _getVisiblePoints: function( series, xmin, xmax, ymin, ymax) {
            var geocodes = new Array();
            for(var i=0; i < series.length; i++) {
                var points = series[i].data;
                for(var j=0; j < points.length; j++) {
                    if ( points[j].x >= xmin &&
                        points[j].x <= xmax &&
                        points[j].y >= ymin &&
                        points[j].y <= ymax )  {
                        geocodes.push(points[j].geocode);
                    }
                }
            }
            //console.log(geocodes);
            return geocodes;
        },

        _highlightChartValues: function(chart, geocodes, colorHighlight) {
            var start = new Date().getTime();
            var series = chart.series;

            var countP = 0;
            var countG = 0;
            var countS = 0;

            for(var i=0; i < series.length; i++) {
                // TODO: this should avoid the regression
                if ( series[i].type == 'line') {
                    // this is the regression serie
                }
                else {
                    // FAST implementation
                    var data = new Array();
                    var points = series[i].data;
                    for(var j=0; j < points.length; j++) {

                        countP++;
                        var containsCode = false;
                        for (var z=0; z < geocodes.length; z++) {
                            countG++;
                            if ( geocodes[z] == points[j].geocode ) {
                                containsCode = true;
                                break;
                            }
                        }
                        if ( containsCode ) {
                            // highlight value
                            points[j].color = colorHighlight;
                        }
                        else {
                            points[j].color = points[j].originalColor;
                            // if the value has been changed change it again
                            //if ( points[j].originalColor != points[j].color )
                            //points[j].color = points[j].originalColor;
                        }

                        var s = {};
                        var valuex = points[j].x;
                        var valuey = points[j].y;
                        s.color = points[j].color;
                        s.originalColor = points[j].originalColor;
                        s.x = valuex;
                        s.y = valuey;
                        s.name =  points[j].name;
                        s.geocode =   points[j].geocode;
                        data.push(s)
                    }
                    chart.series[0].update({
                        data: data
                    }, false); //true / false to redraw

                }
                //console.log('finish: ' + countS + ' ' + countP + ' ' + countG);
                var end = new Date().getTime();
                //log((end - start) / 1000);

                chart.redraw();
                var end = new Date().getTime();
                //log((end - start) / 1000);

                // TODO: create a webservice to handle a lot of codes = (sends all data of the charts)
                // send the GEOCODES:
                // - send and array of objects to handle all the series, of the different graphs
                // return an array with all the objects of the series
            }
        }


    };

    return result;
}