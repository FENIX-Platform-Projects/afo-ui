define(['underscore',  "commons/fx_chart", 'highcharts'], function (_, FxChartTemplate) {


    function Chart() {

        this.o = {

            chart1: {
                elements: ['appcons'],
                id: "chart1"
            },

            chart2: {
                elements: ['imp', 'exp'],
                id: "chart2"
            }
        };
    };


    Chart.prototype.render = function (data, config) {
        this.o = $.extend(true, {}, this.o, config);

        // chart1
        this.renderChart(this.o.chart1.id, this.filterData(this.o.chart1.elements, data))

        // chart2
        this.renderChart(this.o.chart2.id, this.filterData(this.o.chart2.elements, data))
    }

    Chart.prototype.filterData = function (elements, data) {
        var chartdata = []
        for (var i = 0; i < elements.length; i++) {
            for (var j = 0; j < data.length; j++) {
                if (elements[i] == data[j][0]) {
                    chartdata.push(data[j])
                }
            }
        }
        return chartdata;
    }


    Chart.prototype.renderChart = function (id, chartData) {

        var measurementUnit = '';

        var chart_id = id
        var c = {}
        c.chart = {
            "renderTo": chart_id,
            "type": "line"
        };
        c.series = [{ "name" : "No Data", data: []}];

        if (chartData.length > 0 ) {

            c.series = this.getSeries(chartData);
            measurementUnit = chartData[0][4];
        }

        c.yAxis = {
            title: {
                text: measurementUnit
            }
        }

        c = $.extend(true, {}, FxChartTemplate, c);
        return new Highcharts.Chart(c);
    }

    Chart.prototype.getSeries = function (chartData) {
        var allSeries = [];
        for (var i = 0; i < chartData.length; i++) {
            allSeries.push(chartData[i][1]);
        }
        allSeries = _.uniq(allSeries);

        // get series (names)
        var series = []
        for (var i = 0; i < allSeries.length; i++) {
            series.push({
                name: allSeries[i],
                data: []
            });
        }

        // get data
        for (var i = 0; i < chartData.length; i++) {
            for (var j = 0; j < series.length; j++) {
                if (chartData[i][1] == series[j].name) {
                    series[j].data.push([parseFloat(chartData[i][2]), parseFloat(chartData[i][3])]);
                    break;
                }
            }
        }
        return series;
    }

    return Chart;
})