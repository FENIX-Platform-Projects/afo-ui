define({

    DEFAULT: {
        "header": ["code", "Elements", "Year", "Value", "Unit", "Flag"],
        "rows": [
            "Elements"
        ],
        "cols": ["Year"],
        "vals": ["Value"],
        "InstanceRenderers": [
            { label: "Grid", func: "Table" },
            { label: "barchart", func: "barchart" },
            { label: "Stacked barchart", func: "Stacked barchart" }
            ,
            { label: "line chart", func: "line chart" },
            { label: "Area", func: "Area" }

        ],
        "InstanceAggregators": [
            { label: "SumUnit", func: "Sum2" },
            { label: "Sum", func: "Sum" }//used by charts
        ],
        "linkedAttributes": [],

        "hiddenAttributes": ["Value", "code", "Flag", "Unit"],
        "showRender": true,
        "showFlags": false,
        "showUnit": true,
        "showCode": false,
        "showAgg": false,
        "csvText": "AFO"
    },

    AT_GLANCE: {
        "header": ["code", "Elements", "CountryCode", "Country", "FertilizerCode", "Fertilizer", "Year", "Value", "Unit", "Flag"],
        "rows": [
            "Elements", "Country", "Fertilizer","Unit"
        ],
        "cols": ["Year"],
        "vals": ["Value"],
        "InstanceRenderers": [
            { label: "Grid", func: "Table" },
            { label: "barchart", func: "barchart" },
            { label: "Stacked barchart", func: "Stacked barchart" }
            ,
            { label: "line chart", func: "line chart" },
            { label: "Area", func: "Area" }

        ],
        "InstanceAggregators": [
            { label: "SumUnit", func: "Sum2" },
            { label: "Sum", func: "Sum" }//used by charts
        ],
        "linkedAttributes": [],

        "hiddenAttributes": ["Value", "code", "CountryCode", "FertilizerCode", "Flag", "Unit"],
        "showRender": true,
        "showFlags": false,
        "showUnit": false,
        "showCode": false,
        "showAgg": false,
        "csvText": "AFO"
    },

    IFA: {
        "header": ["code", "Elements", "CountryCode", "Country", "Year", "Nutrient", "Value", "Unit", "Flag"],
        "rows": [
            "Elements", "Contry", "Nutrient","Unit"
        ],
        "cols": ["Year"],
        "vals": ["Value"],
        "InstanceRenderers": [
            { label: "Grid", func: "Table" },
            { label: "barchart", func: "barchart" },
            { label: "Stacked barchart", func: "Stacked barchart" }
            ,
            { label: "line chart", func: "line chart" },
            { label: "Area", func: "Area" }

        ],
        "InstanceAggregators": [
            { label: "SumUnit", func: "Sum2" },
            { label: "Sum", func: "Sum" }
        ],
        "hiddenAttributes": ["Value", "Flag", "code", "CountryCode"],
        "linkedAttributes": [],
        "showRender": true,
        "showFlags": false,
        "showUnit": false,
        "showCode": false,
        "showAgg": false,
        "csvText": "AFO"
    }
});
//"NoRecords","RecordOrder","Domain Code","Domain","Country Code","Country","Element Code","Element","Item Code","Item","Year Code","Year","Unit","Value","Flag","Flag Description","Var1Order","Var2Order","Var3Order","Var4Order"