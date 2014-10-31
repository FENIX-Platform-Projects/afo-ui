/*
function showmyContinent()
{
	if(document.getElementById('chaudcontinent').checked)
	{
		mesOptions.E.rows = ["Continent","SubContinent", "Element", "Item"];                        
	}
	else
	{
		mesOptions.E.rows = ["Area", "Element", "Item"];
	}

	$("#testinline").empty();
	$("#testinline").pivotUI(test, mesOptions.E, true);
}

function showmyvalue2()
{
	if(document.getElementById('chaudvalue2').checked)
	{
		mesOptions.E.vals = ["Value", "Unit", "Value2"];
	}
	else
	{
		mesOptions.E.vals = ["Value", "Unit", "Flag"];
	}

	$("#testinline").empty();
	$("#testinline").pivotUI(test, mesOptions.E, true);
}

function showMyValls()
{
	if(document.getElementById('chaudmyVals').checked)
	{
		document.getElementById('chaudgraph').checked=true;
		showmyraph();
		$("#mesVals").css("display", "block");
	}
	else
	{
		$("#mesVals").css("display", "none");
	}
}*/

//google.load("visualization", "1", {packages:["corechart", "charteditor"]});
var mydata;

function init() {
	$('#country').checkboxTree({initializeUnchecked: 'collapsed'});
	$('#partner').checkboxTree({initializeUnchecked: 'collapsed'});
	$('#commodity').checkboxTree({initializeUnchecked: 'collapsed'});
}

function returnTreeview(id) {
	var ret=[];
	var checkedCheckboxes = $('#'+id+' input[type="checkbox"]:checked');
	for(var i=0;i< checkedCheckboxes.length ; i++){
	ret.push(checkedCheckboxes[i].getAttribute("value"));
	//console.log(checkedCheckboxes[i].getAttribute("value"));
	}
	return ret.join(",");
}

function returnSelect(id) {
	var ret=[];
	checkedCheckboxes=$("#"+id+" :selected");
	for(var i=0;i< checkedCheckboxes.length ; i++){
		ret.push(checkedCheckboxes[i].getAttribute("value"));
	}
	return ret.join(",");
}

function myGetData()
{
	$("#output").empty();
	$("#output").html("Wait");

	param = {
		px: returnSelect("IClassification"),
		y: returnSelect("year"),
		r: returnTreeview("country"),
		p: returnTreeview("partner"),
		cc: returnTreeview("commodity"),
		Rg: returnSelect("TradeFlow")
	};

	//console.log(param.px+":" +param.y+":" +param.r+":" +param.p+":" +param.cc+":" +param.Rg);
	/*console.log(returnTreeview("partner"));
	console.log(returnTreeview("commodity"));
	console.log(returnSelect("year"));*/
	if(param.px!="" && param.y!="" && param.r!="" && param.p!="" && param.cc!="" && param.Rg!=""  )
	{
		$.post("data.php", param, function(data) {
		//$.post("listboxdata/datatest.json",param,function(data){

		data=eval(data);
		mydata=[];
		mydataNorm=[["mirror", "pfCode", "yr", "rgCode", "rtCode", "ptCode", "cmdCode", "cmdID", "qtCode", "Type","Value", "estCode", "htCode"] ];
		mydata.push(data[0]);
		console.log(data[0])

		for(var i=1;i<data.length;i++)
		{
			var t=[];
			var tNorm=[data[i][0][0],data[i][1][0],data[i][2][0],data[i][3][0],data[i][4][0],data[i][5][0],data[i][6][0],data[i][7][0],data[i][8][0],"TradeQuantity",
			data[i][9][0],data[i][12][0],data[i][13][0]];
			mydataNorm.push(tNorm);

			tNorm=[data[i][0][0],data[i][1][0],data[i][2][0],data[i][3][0],data[i][4][0],data[i][5][0],data[i][6][0],data[i][7][0],data[i][8][0],"NetWeight",
			data[i][10][0],data[i][12][0],data[i][13][0]];
			mydataNorm.push(tNorm);

			tNorm=[data[i][0][0],data[i][1][0],data[i][2][0],data[i][3][0],data[i][4][0],data[i][5][0],data[i][6][0],data[i][7][0],data[i][8][0],"TradeValue",
			data[i][11][0],data[i][12][0],data[i][13][0]];
			mydataNorm.push(tNorm);

			for(j in data[i]){
				t.push(data[i][j][0]);
			}
			mydata.push(t);
		}

		var derivers = $.pivotUtilities.derivers;
		var renderers = $.extend($.pivotUtilities.renderers,$.pivotUtilities.gchart_renderers);
		
		$("#output").pivotUI(mydataNorm, {
			hiddenAttributes:[],
			derivedAttributes: {
			"country":function(mp){return country[mp["rtCode"]]},
			"CountryCodeFAOSTAT":function(mp){if (matchCountryHSFAOSTAT[mp["rtCode"]]){return matchCountryHSFAOSTAT[mp["rtCode"]]["FAOSTAT"]}
			else{return "Nomatching found ("+mp["rtCode"]+")";}
			},
			"partner":function(mp){return country[mp["ptCode"]]},
			"PartnerCodeFAOSTAT":function(mp){if(matchCountryHSFAOSTAT[mp["ptCode"]]){return matchCountryHSFAOSTAT[mp["ptCode"]]["FAOSTAT"]}
			else{return "Nomatching found ("+mp["ptCode"]+")";}
			},
			"commodity":function(mp){return commodity[mp["cmdCode"]]},
			"flow":function(mp){if(mp["rgCode"]==1){return "Import"}else{return "Export"}},
			"faostatCode":function(mp)
			{if(matchHSFAOSTATFertilizer[mp["cmdCode"]])
			{return matchHSFAOSTATFertilizer[mp["cmdCode"]];}
			else{
			if (matchHSFAOSTATFertilizer[mp["cmdCode"].substring(0,4)+"*"])
			{return matchHSFAOSTATFertilizer[mp["cmdCode"].substring(0,4)+"*"]}
			return "not matching found ("+mp["cmdCode"]+")";
			}
			},
			"TradeValueFAOSTAT":function(mp){return mp["TradeValue"]/1000}

		 },
		 aggregators: aggregatorsCountry,

			//rows:["country","rtCode","CountryCodeFAOSTAT","partner","ptCode","PartnerCodeFAOSTAT","flow","commodity","faostatCode"],
			rows:["CountryCodeFAOSTAT","country","flow","faostatCode","Type"],
			
			cols: ["yr","mirror"],
		//	vals:["TradeValueFAOSTAT","TradeValue","TradeQuantity","NetWeight"],
			vals:["Value"],

			linkedAttributes:[["country","rtCode","CountryCodeFAOSTAT"]]
			},true);

		}).fail(function(xhr, textStatus, errorThrown) {
			$("#output").html("Error in loading data: "+xhr.responseText);
		});
	}
	else
		alert("missing parameters");
}


var fx_controller = (function() {

	function init() {

		//FAOSTATNEWOLAP.rendererV = 2;
/*
		var derivers = $.pivotUtilities.derivers;

		var renderers = $.extend(
			$.pivotUtilities.renderers
		);
*/
		var DATA = [];
		
		/*$.ajax({
			url: 'http://fenixapps.fao.org/repository/skeletons/af2/prices/data2.js',
			dataType: 'json',
			async: false,
			success: function(json) {
				DATA = json;
				alert(DATA);
				
	
			}
		});*/
$.get("http://fenixapps.fao.org/repository/skeletons/af2/prices/data2.js",function(data){
   // alert("Data: " + data );
	DATA=eval(data);
	$("#pivot").pivotUI(DATA, {
			derivedAttributes: {
				Area: function(mp) {
/*					if (false)
						return "<span class=\"ordre\">" + mp["Var1Order"] + "</span><table class=\"innerCol\"><th>" + mp["Country_"] + "</th><th>" + mp["Country Code"] + "</th></table>";
					else*/
						return mp["Country_"];
				},
				Element: function(mp) {
/*					if (false)
						return "<span class=\"ordre\">" + mp["Var2Order"] + "</span><table class=\"innerCol\"><th>" + mp["Element_"] + "</th><th>" + mp["Element Code"] + "</th></table>";
					else*/
						return mp["Element_"];
				},
				Item: function(mp) {
/*					if (false)
						return "<span class=\"ordre\">" + mp["Var3Order"] + "</span><table class=\"innerCol\"><th>" + mp["Item_"] + "</th><th>" + mp["Item Code"] + "</th></table>";
					else*/
						return mp["Item_"];
				},
				Continent: function(mp) {
					try {
						return countryAgg[ mp["Country Code"] ][1];
					}catch(er) {
						console.log( countryAgg, "|"+mp["Country Code"]+"|" );
					}
				},
				SubContinent: function(mp) {
					return countryAgg[ mp["Country Code"] ][2];
				}
			},
			rows: ["Area", "Element", "Item"],
			cols: ["Year"],
			vals: ["Value", "Unit", "Flag"],
			hiddenAttributes:["Var1Order","Var2Order","Var3Order","Var4Order","Flag Description"],
			linkedAttributes:[["Area","Continent","SubContinent"]]
		});
	
	
  });
  /*
		$.ajax({
			url: 'data.json',
			dataType: 'json',
			async: false,
			done: function(json) {
				DATA = json;
				alert(DATA);
			}
		});
*/
		
	};

	return { init : init }

})();

window.addEventListener('load', fx_controller.init, false);