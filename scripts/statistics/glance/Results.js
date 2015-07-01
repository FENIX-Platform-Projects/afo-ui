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

    function Results() {

        this.s = {
            TABLE: "#table1",
            COURTESY: '#afo-courtesy',
            RESULTS: '#afo-results'
        };        
        //this.table = new Table();
        this.pivot = new Pivot();
        //this.chart = new Chart();
    }

    Results.prototype.printTable = function (data, filter) {

        var conf = pivotConfig.DEFAULT;

        if(filter.SOURCE[0].code === 'ifa') {
            conf = pivotConfig.IFA;
        }

        //add DATA HEADER
        data.unshift(conf.header);   

console.log(data, conf);

        this.pivot.render(this.s.TABLE.replace('#',''), data, _.extend(conf, {
            rendererDisplay: pivotRenderers,
            aggregatorDisplay: pivotAggregators
        }) );
    };

    Results.prototype.printChart = function (data) {
        //this.chart.render(data, {});
    };

    return Results;
});