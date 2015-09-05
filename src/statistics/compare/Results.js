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
var monPivot;
    var s = {
        COURTESY: '#afo-courtesy',
        RESULTS: '#afo-results',
        LIST: '.results-list'
    };

    function Results() {
        this.table = new Table();
		 this.Pivot = new Pivot();
        monPivot=this.Pivot;
		this.chart = new Chart();
    }

	  Results.prototype.exportExcel = function (data) {
       this.Pivot.exportExcel();
    };
	 Results.prototype.exportCSV = function (data) {
       this.Pivot.exportCSV();
    };
	
    Results.prototype.printTable = function (data) {
        var id = this.appendContainer();
        this.table.render(id, data);
    };
	  Results.prototype.printOlap = function (data) {
       
     
	    var id = this.appendContainer();
		
		$("#"+id).attr("class","fx-olap-holder");
		$("#"+id).css("height","1500px");
	   data = [['Source','Country','Element','Product', 'Year', 'Value', 'Unit']].concat(data);
	   this.Pivot.render(id, data,{	rows: ["Source","Country","Element","Product"],
						cols: ["Year"],
						vals: ["Value"],
						hiddenAttributes:["Unit","Value","Flag"],
						linkedAttributes:[],
						derivedAttributes: {
                    "Flag": function(mp)
                    {
                       return "";
						}},
						rendererDisplay: pivotRenderers,
						aggregatorDisplay: pivotAggregators,
						"InstanceRenderers": [
						{label: "Grid", func: "Table"},
						{label: "Barchart", func: "barchart"},
						{label: "Line chart", func: "line chart"},
						{label: "Area", func: "Area"},
						{label: "Stacked barchart", func: "Stacked barchart"}
						],
						"InstanceAggregators": [
						{label: "SOMME", func: "Sum2"},
						],
						"showRender": true,
						"showFlags": false,
						"showUnit": true,
						"showCode": false,
						"showAgg": false,
						"csvText":"AFO"
	   });
	   //monPivot.exportExcel();
		
    };

    Results.prototype.appendContainer = function () {

        if (!window.chartCounter) {
            window.chartCounter = 0;
        }
        window.chartCounter++;
        var id = "afo-chart-" + window.chartCounter;
        var $c = $('<li>', {  id: id});

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
