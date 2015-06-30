/*global define*/
define(['underscore',
    'glance/chartsAfo',
    //'glance/tableAfo',
    'pivotConfig',
    'pivotRenderers',
    'pivotAggregators',
    'pivot'
], function (_,
    Chart,
    //Table,
    pivotConfig,
    pivotRenderers,
    pivotAggregators,
    Pivot
    ) {

    'use strict';

    pivotConfig = _.extend(pivotConfig, {
        rendererDisplay: pivotRenderers,
        aggregatorDisplay: pivotAggregators
    });

    console.log('pivotConfig',pivotConfig);

    var s = {
        COURTESY: '#afo-courtesy',
        RESULTS: '#afo-results'
    };

    function Results() {
        //this.table = new Table();
        this.pivot = new Pivot();
        //this.chart = new Chart();
    }

    Results.prototype.printTable = function (data) {

        data.unshift(["a1","a2","a3","Value","Unit"]);

        console.log('DAAAAATA',data);

        this.pivot.render("table1",data, pivotConfig)
    };

    Results.prototype.printChart = function (data) {
        //this.chart.render(data, {});
    };

    return Results;
});