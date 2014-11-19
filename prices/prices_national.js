
//FAOSTATNEWOLAP.rendererV = 2;
/*
		var derivers = $.pivotUtilities.derivers;
		var renderers = $.extend(
			$.pivotUtilities.renderers
		);
*/

$.getJSON("../data/prices_national.json", function(data) {
	
	var matchMonth = {"Jan":01,"Feb":02,"Mar":03,"Apr":04,"May":05,"Jun":06,"Jul":07,"Aug":08,"Sep":09,"Oct":10,"Nov":11,"Dec":12};
	
	$("#pivot").pivotUI(data, {
		derivedAttributes: {
			"Month": function(mp){
				return "<span class=\"ordre\">" +matchMonth[ mp["Month2"]] + "</span>"+mp["Month2"];
			}
		},
		rows: ["Area", "Item"],
		cols: ["Year", "Month"],
		vals: ["Value", "Unit", "Flag"],
		hiddenAttributes:[],
		linkedAttributes:[]
	});

	$("#pivot_loader").hide();
	$("#pivot_download").show();

	$("#pivot_download").on('click', function(e) {
		my_exportNew();
	});

});
