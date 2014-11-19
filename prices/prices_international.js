/*
define([
    'jquery','underscore','bootstrap','highcharts',
    'text!../data/prices_international.csv',
], function($,_,bts,highcharts, data) {
*/

var chart_options = {
    title: { text: '' },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },
    tooltip: {
        enabled: false
    },
    plotOptions: {
        line: {

            marker: {
                allowPointSelect: false,
                enabled: false
            }
        }
    },    
    yAxis: {
        title: { text: 'US $ / ton' },
        plotLines: [{ value: 0, width: 1, color: '#808080' }]
    },
    xAxis: {
        categories: []
    },
    series: []
};

$.get('../data/prices_international.csv', function(data) {

    var lines = data.split('\n');
    
    $.each(lines, function(lineNo, line) {
        var items = line.split(';');

        items = items.splice(1, items.length-3);
        
        // header line containes categories
        if (lineNo == 0) {
            $.each(items, function(itemNo, item) {
                if (itemNo > 0) chart_options.xAxis.categories.push(item);
            });
        }
        else {
            var series = {
                data: []
            };
            $.each(items, function(itemNo, item) {
                if (itemNo == 0)
                    series.name = item;
                else
                    series.data.push(parseFloat(item));
            });
            chart_options.series.push(series);
        }
    });
    $('#chart_prices_inter').highcharts(chart_options);
});

$('#prices_international_grid').load("html/prices_international.html");

//});

