if (!window.FENIXCharts) {

    window.FENIXCharts = {

        KEYWORDS : ['FAOSTAT_DEFAULT_BAR', 'FAOSTAT_DEFAULT_LINE', 'FAOSTAT_DEFAULT_PIE', 'FAOSTAT_DEFAULT_STACK',
            'FAOSTAT_DEFAULT_DOUBLE_AXES_BAR', 'FAOSTAT_DEFAULT_DOUBLE_AXES_LINE'],

        COLORS : ['#1f678a','#92a8b7','#5eadd5','#6c79db','#a68122','#ffd569','#439966','#800432','#067dcc',
            '#1f678a','#92a8b7','#5eadd5','#6c79db','#a68122','#ffd569','#439966','#800432','#067dcc'],

        listKeywords : function() {
            return FENIXCharts.KEYWORDS;
        },

        plot : function(payload) {
            switch (payload.engine) {
                case 'highcharts' : return FENIXCharts.plotHighcharts(payload);
                default: throw payload.engine + ' is not a valid engine.';
            }
        },

        plotHighcharts : function(payload) {
            switch (payload.keyword) {
                case 'FAOSTAT_DEFAULT_LINE' : FENIXCharts.plotHighcharts_FAOSTAT_DEFAULT_LINE(payload); break;
                case 'FAOSTAT_DEFAULT_BAR' : FENIXCharts.plotHighcharts_FAOSTAT_DEFAULT_BAR(payload); break;
                case 'FAOSTAT_DEFAULT_BAR_STACKED' : FENIXCharts.plotHighcharts_FAOSTAT_DEFAULT_BAR_STACKED(payload); break;
                case 'FAOSTAT_DEFAULT_DOUBLE_AXES_BAR' :  FENIXCharts.plotHighcharts_FAOSTAT_DEFAULT_DOUBLE_AXES_BAR(payload); break;
                case 'FAOSTAT_DEFAULT_DOUBLE_AXES_LINE' : FENIXCharts.plotHighcharts_FAOSTAT_DEFAULT_DOUBLE_AXES_BAR(payload); break;
                case 'FAOSTAT_DEFAULT_DOUBLE_AXES_TIMESERIES_BAR' : FENIXCharts.plotHighcharts_FAOSTAT_DEFAULT_DOUBLE_AXES_BAR(payload); break;
                case 'FAOSTAT_DEFAULT_DOUBLE_AXES_TIMESERIES_LINE' : FENIXCharts.plotHighcharts_FAOSTAT_DEFAULT_DOUBLE_AXES_BAR(payload); break;
                case 'FAOSTAT_DEFAULT_PIE' : FENIXCharts.plotHighcharts_FAOSTAT_DEFAULT_PIE(payload); break;
                case 'FAOSTAT_DEFAULT_STACK' : FENIXCharts.plotHighcharts_FAOSTAT_DEFAULT_STACK(payload); break;
                case 'FAOSTAT_DEFAULT_SCATTER' : return FENIXCharts.plotHighcharts_SCATTER(payload); break;
                default: throw payload.keyword + ' is not a valid keyword.';
            }
        },

        plotHighcharts_FAOSTAT_DEFAULT_DOUBLE_AXES_BAR : function(payload) {

            /** Optional rotation for x-axis labels */
            var labels = {};
            labels.enabled = true;
            if (payload.xaxis != null && payload.xaxis.rotation != null) {
                labels.rotation = payload.xaxis.rotation;
                labels.style = {};
                //labels.style.fontSize = payload.xaxis.fontSize;
                if ( payload.xaxis.style)
                    labels.style = payload.xaxis.style;
            }
            var tickInterval = ( payload.xaxis != null && payload.xaxis.tickinterval != null ) ? payload.xaxis.tickinterval : 1;
            var c = {
                chart : {
                    renderTo: payload.renderTo,
                    type: 'column',
                    zoomType : 'xy'
                },
                colors : FENIXCharts.COLORS,
                xAxis: {
                    categories: payload.categories,
                    labels : labels,
                    tickInterval: tickInterval
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
                tooltip: {
                    shared : true,
                    crosshairs: true
                },
                plotOptions : {
                    line : {
                        marker : {
                            enabled : false
                        }
                    }
                },
                yAxis: payload.yaxis,
                series: payload.series
                // chart type HERE
            }
            //console.log(JSON.stringify(c))
            var chart = new Highcharts.Chart(c);
        },

        plotHighcharts_FAOSTAT_DEFAULT_PIE : function(payload) {
            /**$(document).ready(function() { **/
            chart = new Highcharts.Chart({
                chart : {
                    renderTo: payload.renderTo
                },
                colors : FENIXCharts.COLORS,
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
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function() {
                                return '<b>'+ this.point.name +'</b>: '+ Math.round(parseFloat(this.percentage) * 100) / 100 +' %';
                            }
                        }
                    }
                },
                series: payload.series
            });
            /**});**/
        },

        plotHighcharts_FAOSTAT_DEFAULT_BAR : function(payload) {
            /**$(document).ready(function() { **/
            chart = new Highcharts.Chart({
                chart : {
                    renderTo: payload.renderTo,
                    type: 'column',
                    zoomType : 'xy'
                },
                colors : FENIXCharts.COLORS,
                xAxis: {
                    categories: payload.categories
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
                tooltip: {
                    shared : true,
                    crosshairs: true
                },
                yAxis: {
                    min: payload.yaxis.min,
                    max: payload.yaxis.max,
                    tickInterval: payload.yaxis.tickInterval,
                    title : {
                        text: payload.yaxis.title
                    }
                },
                series: payload.series
            });
            /**});**/
        },

        plotHighcharts_FAOSTAT_DEFAULT_BAR_STACKED : function(payload) {
            /**$(document).ready(function() { **/
            chart = new Highcharts.Chart({
                chart : {
                    renderTo: payload.renderTo,
                    type: 'column',
                    zoomType : 'xy'
                },
                colors : FENIXCharts.COLORS,
                xAxis: {
                    categories: payload.categories
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
                tooltip: {
                    shared : true,
                    crosshairs: true
                },
                yAxis: {
                    min: payload.yaxis.min,
                    max: payload.yaxis.max,
                    tickInterval: payload.yaxis.tickInterval,
                    title : {
                        text: payload.yaxis.title
                    }
                },
                plotOptions: {
                    column : {
                        stacking : 'normal'
                    }
                },
                series: payload.series
            });
            /**});**/
        },

        plotHighcharts_FAOSTAT_DEFAULT_LINE : function(payload) {
            /**$(document).ready(function() { **/
            chart = new Highcharts.Chart({
                chart : {
                    renderTo: payload.renderTo,
                    type: 'line',
                    zoomType : 'xy'
                },
                colors : FENIXCharts.COLORS,
                xAxis: {
                    categories: payload.categories
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
            /**});**/
        },

        plotHighcharts_FAOSTAT_DEFAULT_STACK : function(payload) {
            /**$(document).ready(function() { **/
            var chart = new Highcharts.Chart({
                chart : {
                    renderTo: payload.renderTo,
                    type: 'column',
                    zoomType : 'xy'
                },
                colors : FENIXCharts.COLORS,
                xAxis: {
                    categories: payload.categories
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
                tooltip: {
                    shared : true,
                    crosshairs: true
                },
                plotOptions : {
                    column: {
                        stacking: 'normal'
                    }
                },
                yAxis: {
                    min: payload.yaxis.min,
                    max: payload.yaxis.max,
                    tickInterval: payload.yaxis.tickInterval,
                    title : {
                        text: payload.yaxis.title
                    }
                },
                series: payload.series
            });
            /**});**/
            return chart;
        },

        plotHighcharts_SCATTER: function(payload) {
            var payload = FENIXCharts.defaultScatterProperties(payload)
            console.log(payload)
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: payload.renderTo,
                    type: payload.plottype,
                    zoomType: 'xy',
                    colors : FENIXCharts.COLORS,
                    events:  payload.chart.events
                },
                title: {
                    text : payload.title
                    /* style: {
                     display: 'none'
                     }*/
                },
                subtitle: {
                    text : payload.subtitle
                    /**style: {
                        display: 'none'
                    }**/
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    title: {
                        enabled: true,
                        text: payload.xaxis.title
                    },
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true,
                    events:  payload.xaxis.events
                },
                yAxis: {
                    title: {
                        text: payload.yaxis.title
                    }
                },
                legend: {
                    enabled: payload.legend.enabled
                },
                plotOptions: {
                    /*series: {
                        point: {
                            events: {
                                mouseOver: payload.plotOptions.series.point.events.mouseOver,
                                click: payload.plotOptions.series.point.events.click
                            }
                        },
                        events: {
                            mouseOut: payload.plotOptions.series.events.mouseOut
                        },
                        cursor: 'pointer'

                    }, */
                    scatter: {
                        turboThreshold: 1000,
                        animation: false,
                        shadow: false,
                        marker: {
                            radius: payload.marker.radius,
                            states: {
                                hover: {
                                    enabled: true
                                    //,lineColor: 'rgb(100,100,100)'
                                }
                            },
                            symbol: payload.marker.symbol
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: payload.tooltip.headerFormat,
                            pointFormat: payload.tooltip.pointFormat
                        }

                    }
                },

                /*tooltip: {
                 useHTML: true,
                 followPointer: true,
                 formatter: function() {
                 console.log(this);
                 return this.x + ' - ' + this.y +
                 ' is '+ this.key;
                 }
                 },  */
                series: payload.series
            });

            return chart;
        },

        defaultScatterProperties: function(payload) {
            var defaultPayload = {}

            defaultPayload.yaxis = {};
            defaultPayload.yaxis.title = '';

            defaultPayload.plottype = 'scatter'

            defaultPayload.xaxis = {};
            defaultPayload.xaxis.title = '';
            defaultPayload.xaxis.events = {};

            defaultPayload.chart = {};
            defaultPayload.chart.events = {};

            defaultPayload.tooltip = {};
            defaultPayload.tooltip.headerFormat = '<b>{series.name}</b><br>';
            defaultPayload.tooltip.pointFormat = '{point.x} - {point.y}';
            defaultPayload.tooltip.enabled = true;

            defaultPayload.marker = {};
            defaultPayload.marker.symbol = 'circle';
            defaultPayload.marker.radius = 5;

            defaultPayload.legend = {};
            defaultPayload.legend.enabled = false;

            defaultPayload.plotOptions = {};
            defaultPayload.plotOptions.series = {};
            defaultPayload.plotOptions.series.point = {};
            defaultPayload.plotOptions.series.point.events = {};
            defaultPayload.plotOptions.series.events = {};
            defaultPayload.plotOptions.series.point.events.mouseOver = '';
            defaultPayload.plotOptions.series.point.events.click = ''
            defaultPayload.plotOptions.series.events.mouseOut = '';



            return $.extend(true, {}, defaultPayload, payload);
        }

    };

}