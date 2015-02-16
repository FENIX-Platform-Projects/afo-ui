/*global define*/
define([
    'glance/chartsAfo',
    'glance/tableAfo'
], function ( Chart, Table ) {

    'use strict';

    var s = {
        COURTESY: '#afo-courtesy',
        RESULTS: '#afo-results'
    };

    function Results() {
        this.table = new Table();
        this.chart = new Chart();
    }

    Results.prototype.printTable = function (data) {
        this.table.render(data);
    };

    Results.prototype.printChart = function (data) {
        this.chart.render(data, {});
    };

   /* Results.prototype.render = function (data) {

        console.log(data)

        if (!this.validate(data)){
          return;
        }

        if (!data || data.length === 0) {
            this.showCourtesyMessage();
            return;
        }


        $(s.COURTESY).hide();
        $(s.RESULTS).show();

        this.chart.render(data, {});


    };

    Results.prototype.showCourtesyMessage = function () {

        $(s.COURTESY).show();
        $(s.RESULTS).hide();

    };*/

    return Results;
});