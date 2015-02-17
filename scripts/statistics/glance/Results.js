/*global define*/
define([
    'glance/chartsAfo',
    'glance/tableAfo'
], function ( Chart, Table ) {

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
        this.table.render(data);
    };

    Results.prototype.appendContainer = function () {

        var $c = $('<li>', {
        });

        $(s.LIST).appendChild($c);
        return $c;
    };

    Results.prototype.printChart = function (data) {
        this.chart.render(data, {});
    };

    Results.prototype.empty = function () {
        $(s.LIST).empty();
    };

    return Results;
});