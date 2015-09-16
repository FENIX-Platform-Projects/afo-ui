define(['underscore', 'highcharts', 'highcharts.export',
    'highcharts.config'
], function (_, highcharts, highchartsExport,
    highchartsConfig) {

    function Chart(){

        this.o = {};
    };


    Chart.prototype.render = function(container, data, results) {

        // render chart
        this.renderChart(container, data, results)
    }

    Chart.prototype.renderChart = function(id, chartData, results) {

        var series = this.getSeries(chartData);
        var measurementUnit = chartData[0][3];
        var chart_id = id;
        var c = {}
        c.chart = {
            renderTo : chart_id,
            type : "line"
        };
        c.title = {
            text: "<b>Element:</b> " +results.ELEMENT + ", <br><b>Product:</b> " + results.PRODUCT + " ( as " + results.KIND + " ),<br><b>Country:</b> " +  results.COUNTRY
        };
        c.subtitle = {
            text: "Source: " +results.SOURCE + ", Compared by: " + results.COMPARE
        };
        c.series = series;
        c.yAxis = {
            title: {
                text: measurementUnit
            }
        }
        c = $.extend(true, {}, highchartsConfig, c);
        return new Highcharts.Chart(c);
    }

    Chart.prototype.getSeries = function(chartData) {
        var allSeries = [];
        for (var i=0; i < chartData.length; i++) {
            allSeries.push(chartData[i][0]);
        }
        allSeries = _.uniq(allSeries);

        // get series (names)
        var series = []
        for (var i=0; i < allSeries.length; i++) {
            series.push({
                name: allSeries[i],
                data: []
            });
        }

        // get data
        for (var i=0; i < chartData.length; i++) {
            for( var j=0; j < series.length; j++) {
                if (chartData[i][0] == series[j].name) {
                    series[j].data.push([parseFloat(chartData[i][1]), parseFloat(chartData[i][2])]);
                    break;
                }
            }
        }
        return series;
    }

    return Chart;
})