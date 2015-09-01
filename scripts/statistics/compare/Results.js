/*global define*/
define([
    'compare/chartsAfo',
    'compare/tableAfo',
	'pivot',
		'pivotConfig',
		'pivotRenderers',
		'pivotAggregators'
], function (Chart, Table,Pivot,
		PivotConfig,
		pivotRenderers,
		pivotAggregators) {

    'use strict';

    var s = {
        COURTESY: '#afo-courtesy',
        RESULTS: '#afo-results',
        LIST: '.results-list'
    };

    function Results() {
        this.table = new Table();
		 this.Pivot = new Pivot();
        this.chart = new Chart();
    }

    Results.prototype.printTable = function (data) {
        var id = this.appendContainer();
        this.table.render(id, data);
    };
	  Results.prototype.printOlap = function (data) {
       
     
	    var id = this.appendContainer();
		
		$("#"+id).attr("class","fx-olap-holder");
		$("#"+id).css("height","1500px");
	//cs.data_source_label,cc.country_label,ce.element_label, cc.fertilizer_label, d.year, d.value, d.um
	   data = [['Source','Country','Element','Product', 'Year', 'Value', 'Unit']].concat(data);
	   this.Pivot.render(id, data,{	rows: ["Source","Country","Element","Product"],
						cols: ["Year"],
						vals: ["Value"],
						hiddenAttributes:["Unit","Value"],
						linkedAttributes:[],
						rendererDisplay: pivotRenderers,
						aggregatorDisplay: pivotAggregators,
						derivedAttributes: {},
						"showRender": true,
						"showFlags": false,
						"showUnit": true,
						"showCode": false,
						"showAgg": false,
						"csvText":"AFO"
	   });
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