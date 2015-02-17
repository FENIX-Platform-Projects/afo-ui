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

    return Results;
});