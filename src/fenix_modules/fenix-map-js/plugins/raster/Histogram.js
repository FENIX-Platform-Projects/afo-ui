// Wrap code with module pattern.
(function() {
    var global = this;

    // widget constructor function
    global.FMHistogram = function() {
        var o = {
            chart: {
                //color: ['rgba(0, 0, 0, .5)'],
                id: null,
                series: '',
                decimalvalues: 4,
                chart_title: '',
                yaxis_title: '',
                xaxis_title: '',
                keyword: 'FAOSTAT_DEFAULT_LINE',

                // Chart Obj
                chartObj: '',

                // colors
                colors: ["#1f678a", "#92a8b7", "#5eadd5", "#6c79db", "#a68122", "#ffd569", "#439966", "#800432", "#067dcc", "#1f678a", "#92a8b7", "#5eadd5", "#6c79db", "#a68122", "#ffd569", "#439966", "#800432", "#067dcc"]
            },
            stats: {
                id: null
            },
            l: '', // layer
            map: '', // map if we want interact with the map
            callback: ''
        };

        // private instance methods
        var init = function(obj) {
            o = $.extend(true, {}, o, obj);
            createHistogram(o)
        };

        var createHistogram = function(o) {
            var url = FMCONFIG.WPS_SERVICE_STATS + o.l.layer.layers;
            $.ajax({
                type : 'GET',
                url : url,
                success : function(response) {
                    response = (typeof response == 'string')? $.parseJSON(response): response;
                    if (o.chart.id) {
                        parseHistogramResponse(response.hist[0]);
                    }
                    if (o.stats.id) {
                        parseStats(response.stats[0]);
                    }

                },
                error : function(err, b, c) {}
            });
        };

        var parseHistogramResponse = function(response) {
            o.l.layer.histogram = {};
            o.l.layer.histogram.min = response.min;
            o.l.layer.histogram.max = response.max;
            o.l.layer.histogram.buckets = response.buckets;
            o.l.layer.histogram.values = response.values;
            o.chart.series = parseChartSeries(response.values);
            o.chart.categories = createCategories(response.min, response.max, response.buckets, o.chart.decimalvalues);
            $("#" + o.chart.id).empty();
            createChart(o);
        }

        var parseStats = function(response) {
            o.l.layer.stats = {};
            o.l.layer.stats.min = response.min;
            o.l.layer.stats.max = response.max;
            o.l.layer.stats.mean = response.mean;
            o.l.layer.stats.sd = response.sd;

            // create summary
            var html = "<div>min: "+ o.l.layer.stats.min +"</div>"
            html += "<div>max: "+ o.l.layer.stats.max +"</div>"
            html += "<div>mean: "+ o.l.layer.stats.mean +"</div>"
            html += "<div>sd: "+ o.l.layer.stats.sd +"</div>"

            $("#" + o.stats.id).empty();
            $("#" + o.stats.id).html(html);

        }

        /** TODO: handle multiple raster bands **/
        var parseChartSeries = function(data) {
            var series = [];
            series.push({
                name: 'Histogram',
                data: data
            });
            return series;
        }

        var createCategories = function(min, max, buckets, decimalvalues) {
            // sum the absolute values of min max
            // |min|+|max| / buckets
            var categories = [];
            var step = (Math.abs(min) + Math.abs(max) ) / buckets
            while(min < max) {  //check if < or <= ??
                // TODO: check decimalvalues toFixed(0) why it doesn't work
                categories.push((decimalvalues)? min.toFixed(decimalvalues) : min);
                min = min + step;
            }
            if ( categories.length < buckets )  { }
            return categories;
        }

        var createChart = function() {
            var chart_payload = {};
            chart_payload.engine = 'highcharts';
            chart_payload.keyword = o.chart.keyword;
            chart_payload.renderTo = o.chart.id;

            chart_payload.title = o.chart.chart_title;
            chart_payload.legend = {};
            chart_payload.legend.enabled = true;

            chart_payload.yaxis = {};
            chart_payload.yaxis.title = o.chart.yaxis_title;
            chart_payload.xaxis = {};
            chart_payload.xaxis.title =  o.chart.xaxis_title;
            chart_payload.series = o.chart.series;
            chart_payload.categories = o.chart.categories;
            chart_payload.chart = {};
            chart_payload.chart.events = {};
            o.chart.chartObj = plotChart(chart_payload);
        }


        var plotChart = function(payload) {
            var chart = new Highcharts.Chart({
                chart : {
                    renderTo: payload.renderTo,
                    type: 'line',
                    zoomType : 'xy'
                },
                colors : o.chart.colors,
                xAxis: {
                    categories: payload.categories,
                    minTickInterval: 10,
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '9px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                title : {
                    text : payload.title
                },
                credits: {
                    position : {
                        align : 'left',
                        x : 10
                    },
                    text : payload.credits,
                    href : null
                },
                yAxis: {
                    min: payload.yaxis.min,
                    max: payload.yaxis.max,
                    tickInterval: payload.yaxis.tickInterval,
                    title : {
                        text: payload.yaxis.title
                    }
                },
                plotOptions : {
                    line : {
                        marker : {
                            enabled : false
                        }
                    }
                },
                tooltip : {
                    shared : true,
                    crosshairs: true
                },
                series: payload.series
            });
        }

        return {
            init: init
        };
    };

})();