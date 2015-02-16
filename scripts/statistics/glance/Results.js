/*global define*/
define([
    'glance/chartsAfo',
    'glance/tableAfo'
], function ( Chart, Table ) {

    'use strict';

    function Results() {
        this._initTable();
        this._initChart();
    }

    Results.prototype.validate = function () {

        return true;
    };


    Results.prototype.validate = function () {

        return true;
    };

    Results.prototype.render = function (data) {

        if (this.validate()){

            this.chart.render(data, {});
            this.table.render(data, {});
        }

    };

    Results.prototype._initTable = function () {
        this.table = new Table();
    };

    Results.prototype._initChart = function () {

        this.chart = new Chart();
    };

    return Results;
});