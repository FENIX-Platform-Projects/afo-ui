define({
    "rows": [
        "a1","a2","Unit" 
    ],
    "cols": ["a3"],
    "vals": ["Value"  ],
    "InstanceRenderers": [
        {label: "TABLE", func: "Table2"}
    ],
    "InstanceAggregators": [
        {label: "Sum", func: "Sum"},
        {label: "Average", func: "Average"}
    ],
     "hiddenAttributes": [
       "Value"
    ],
    "showAgg": false,
    "showRender": false,
    "showUnit":false,
    "showCode":true,
    "showFlags":true
});		
//"NoRecords","RecordOrder","Domain Code","Domain","Country Code","Country","Element Code","Element","Item Code","Item","Year Code","Year","Unit","Value","Flag","Flag Description","Var1Order","Var2Order","Var3Order","Var4Order"