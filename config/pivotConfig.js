define({

    DEFAULT: {
        "header":["code","Elements","Year","Value","Unit","Flag"],
        "rows": [
            "Elements","Unit"
        ],
        "cols": ["Year"],
        "vals": ["Value"  ],
        "InstanceRenderers": [
            {label: "Grid", func: "Table"},
            {label: "barchart", func: "barchart"} ,
            {label: "Stacked barchart", func: "Stacked barchart"}
            ,
            {label: "line chart", func: "line chart"},
            {label: "Area", func: "Area"}
           
        ],
        "InstanceAggregators": [
            {label: "SumUnit", func: "Sum2"},
            {label: "Sum", func: "Sum"},
            {label: "Average", func: "Average"}
        ],
        "linkedAttributes": [["Elements","Unit"]],

        "hiddenAttributes": ["Value","code","Flag"],
        "showRender": true,
        "showFlags": false,
        "showUnit": false,
        "showCode": false,
        "showAgg": false
    },

    IFA: {
        "header":["code", "Elements","Year","Nutrient","Value","Unit","Flag"],
        "rows": [
            "Elements","Nutrient","Unit" 
        ],
        "cols": ["Year"],
        "vals": ["Value"  ],
        "InstanceRenderers": [
            {label: "Grid", func: "Table"},
            {label: "barchart", func: "barchart"} ,
            {label: "Stacked barchart", func: "Stacked barchart"}
            ,
            {label: "line chart", func: "line chart"},
            {label: "Area", func: "Area"}
           
        ],
        "InstanceAggregators": [
            {label: "SumUnit", func: "Sum2"},
            {label: "Sum", func: "Sum"},
            {label: "Average", func: "Average"}
        ],
        "hiddenAttributes": ["Value","Flag" ,"code"],
        "linkedAttributes": [["Elements","Unit"]],
        "showRender": true,
        "showFlags": false,
        "showUnit": false,
        "showCode": false,
        "showAgg": false
    }
});		
//"NoRecords","RecordOrder","Domain Code","Domain","Country Code","Country","Element Code","Element","Item Code","Item","Year Code","Year","Unit","Value","Flag","Flag Description","Var1Order","Var2Order","Var3Order","Var4Order"