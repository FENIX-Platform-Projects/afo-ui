/*global define*/
define([
    'compare/chartsAfo',
    'compare/tableAfo'
], function (Chart, Table) {

    'use strict';

    var s = {
        COURTESY: '#afo-courtesy',
        RESULTS: '#afo-results',
        LIST: '.results-list'
    };

    function Results() {
        this.table = new Table();
        this.chart = new Chart();
    }

    Results.prototype.printTable = function (data) {
        var id = this.appendContainer();
        this.table.render(id, data);
    };

    Results.prototype.appendContainer = function () {

        if (!window.chartCounter) {
            window.chartCounter = 0;
        }
        window.chartCounter++;
        var id = "afo-chart-" + window.chartCounter;
        var $c = $('<li>', {
            id: id
        });

        $(s.LIST).append($c);
        return id;
    };

    Results.prototype.printChart = function (data, results) {
        var id = this.appendContainer();
        this.chart.render(id, data, results);
    };

    Results.prototype.empty = function () {
        $(s.LIST).empty();
    };

    return Results;
});