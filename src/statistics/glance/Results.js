/*global define*/
define(['underscore',
    'pivotConfig',
    'pivotRenderers',
    'pivotAggregators',
    'pivot'
], function (_,
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
        self.pivot = new Pivot();
        
        $("#pivot_download_xls").on('click', function(e) {
            self.pivot.exportExcel();
        });
        $("#pivot_download_csv").on('click', function(e) {
            self.pivot.exportCSV();
        });        
    }

    Results.prototype.printTable = function (data, filter) {

        var conf = pivotConfig.AT_GLANCE;

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

    return Results;
});