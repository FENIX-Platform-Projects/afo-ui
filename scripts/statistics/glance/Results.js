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

        var self = this;

        self.s = {
            TABLE: "#table1",
            COURTESY: '#afo-courtesy',
            RESULTS: '#afo-results'
        };        
        //this.table = new Table();
        self.pivot = new Pivot();
        //this.chart = new Chart();
        
        $("#pivot_download_xls").on('click', function(e) {
            //console.log(self.pivot);
            self.pivot.exportExcel();
        });
        $("#pivot_download_csv").on('click', function(e) {
            //console.log(self.pivot);
            self.pivot.exportCSV();
        });        
    }

    Results.prototype.printTable = function (data, filter) {

        var conf = pivotConfig.DEFAULT;

        if(filter.SOURCE[0].code === 'ifa') {
            conf = pivotConfig.IFA;
        }

        //add DATA HEADER
        data.unshift(conf.header);   

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