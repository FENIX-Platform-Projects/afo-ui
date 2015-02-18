 FAOSTATOLAPV3={};
FAOSTATOLAPV3.grouped=true;

var matchMonth = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
function changechkTreeview()
{
   FAOSTATOLAPV3.grouped=document.getElementById('chkTreeview').checked;
   FAOSTATOLAPV3.mygrid="";
$("#pivot").pivotUI(FAOSTATNEWOLAP.originalData,{
				derivedAttributes: {
					"Month": function(mp){
						return "<span class=\"ordre\">" +matchMonth[ mp["Month2"]] + "</span>"+mp["Month2"];
					},"Indicator":function(mp){return mp["Item"]+" ("+mp["Unit"]+")";}
				},
				rows: ["Area", "Indicator"],
				cols: ["Year", "Month"],
				vals: ["Value", "Flag"],
				hiddenAttributes:["Month2","Unit","Item"],
				linkedAttributes:[]
			});
	}

	

	
function newGrid(r){

   var r2d2=[];
    
    $("#mesFlags").empty(); 
	sortedIndex=[];
	for(col in r.colKeys)
    {sortedIndex.push(r.colKeys[col].join("||"));}
	sortedIndex.sort();
	
	
for(ligne in r.tree)
    {
       
   var temp=ligne.split('||');
    for(col in sortedIndex){
        var coldInd=sortedIndex[col];
		if( r.tree[ligne][coldInd]!=null){temp.push(r.tree[ligne][coldInd].value());}
		else{temp.push( "");}
       
      }
		
      r2d2.push(temp);
     }
     
var grid_demo_id = "myGrid1" ;


var dsOption= {fields :[],recordType : 'array',data : r2d2};


r2d2.sort();
var colsOption = [];

for(var i in r.rowAttrs){
 dsOption.fields.push({name : r.rowAttrs[i]  });
 
   colsOption.push({id:  r.rowAttrs[i] , header:  r.rowAttrs[i] , frozen : true ,grouped : FAOSTATOLAPV3.grouped});
}


 var reg = new RegExp("<span class=\"ordre\">[0-9]*</span>(.*)", "g"); 

 var reg2 = new RegExp("<span class=\"ordre\">[0-9]*</span><table class=\"innerCol\"><th>([0-9]+)</th><th>([^>]*)</th></table>", "g"); 


for(var i in sortedIndex){

   dsOption.fields.push({name : sortedIndex[i].replace(/[^a-zA-Z0-9]/g,"_")/*,type:'float' */ });
	montitle=""+sortedIndex[i].replace(reg, "$1");
	
	colsOption.push({id:  sortedIndex[i].replace(/[^a-zA-Z0-9]/g,"_") ,header: montitle });
}




var gridOption={
	id : grid_demo_id,
	width: "100%", 
	height: "500",  
	container :"myGrid1_div",
	replaceContainer : true, 

	dataset : dsOption ,
	resizable : false,
	columns : colsOption,
	pageSize : 15 ,
        pageSizeList : [15,25,50,150],
        SigmaGridPath : 'grid/',
	toolbarContent : 'nav | goto | pagesize '/*,
onMouseOver : function(value,  record,  cell,  row,  colNo, rowNo,  columnObj,  grid){
if (columnObj && columnObj.toolTip) {grid.showCellToolTip(cell,columnObj.toolTipWidth);	}
else{grid.hideCellToolTip();}
	},onMouseOut : function(value,  record,  cell,  row,  colNo, rowNo,  columnObj,  grid){grid.hideCellToolTip();}*/

};


  FAOSTATOLAPV3.mygrid=new Sigma.Grid( gridOption );
  
 Sigma.Grid.render( FAOSTATOLAPV3.mygrid)() ;
 document.getElementById('page_after').innerHTML="/"+FAOSTATOLAPV3.mygrid.getPageInfo().totalPageNum;
  FAOSTATOLAPV3.mygrid.pageSizeSelect.onchange=function()
  {document.getElementById('page_after').innerHTML="/"+FAOSTATOLAPV3.mygrid.getPageInfo().totalPageNum;};
 
 if(FAOSTATOLAPV3.grouped){$("#mesFlags").append($("<br><br><input checked onchange=\"changechkTreeview()\" type=\"checkbox\" id=\"chkTreeview\"><label for=\"chkTreeview\">Treeview/sorting columns</label>"));}
else{$("#mesFlags").append($("<br><br><input  onchange=\"changechkTreeview()\" type=\"checkbox\" id=\"chkTreeview\"><label for=\"chkTreeview\">Treeview/Sorting columns</label>"));}
$("#nested_by").hide();
}




FAOSTATOLAP2 = {};
FAOSTATOLAP2.displayOption =
        {
            showUnit: 0,
            showCode: 0,
            showFlag: 0,
            overwrite: true
        };
     
		
