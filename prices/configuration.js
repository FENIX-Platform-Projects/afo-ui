FAOSTATOLAP2 = {};
FAOSTATOLAP2.displayOption =
{
    showUnit: 0,
    showCode: 0,
    showFlag: 0,
    overwrite: true
};

FAOSTATOLAP2.options = {
    E:{
        derivedAttributes: {
                    "Area": function(mp)
                    {
                        if (F3DWLD.CONFIG.wdsPayload.showCodes)
                        {
                            return "<span class=\"ordre\">" + mp["Var1Order"] + "</span><table class=\"innerCol\"><th>" + mp["Country_"] + "</th><th>" + mp["Country Code"] + "</th></table>";
                        }
                        else {
                            return "<span class=\"ordre\">" + mp["Var1Order"] + "</span>" + mp["Country_"];
                        }
                    },
                    "Element": function(mp)
                    {
                        if (F3DWLD.CONFIG.wdsPayload.showCodes)
                        {
                            return "<span class=\"ordre\">" + mp["Var2Order"] + "</span><table class=\"innerCol\"><th>" + mp["Element_"] + "</th><th>" + mp["Element Code"] + "</th></table>";
                        }
                        else {
                            return "<span class=\"ordre\">" + mp["Var2Order"] + "</span>" + mp["Element_"];
                        }
                    },
                    "Item": function(mp)
                    {
                        if (F3DWLD.CONFIG.wdsPayload.showCodes)
                        {
                            return "<span class=\"ordre\">" + mp["Var3Order"] + "</span><table class=\"innerCol\"><th>" + mp["Item_"] + "</th><th>" + mp["Item Code"] + "</th></table>";
                        }
                        else {
                            return "<span class=\"ordre\">" + mp["Var3Order"] + "</span>" + mp["Item_"];
                        }
                    }
                },
                rows: ["Area", "Element", "Item"],
                cols: ["Year"],
                vals: ["Value", "Unit", "Flag"],
                linkedAttributes: []
            },
    F:{
                derivedAttributes: {
                    "Pays": function(mp)
                    {
                        if (F3DWLD.CONFIG.wdsPayload.showCodes)
                        {
                            return "<span class=\"ordre\">" + mp["Var1Order"] + "</span><table class=\"innerCol\"><th>" + mp["Country_"] + "</th><th>" + mp["Country Code"] + "</th></table>";
                        }
                        else {
                            return "<span class=\"ordre\">" + mp["Var1Order"] + "</span>" + mp["Country_"];
                        }
                    },
                    "Elements": function(mp)
                    {
                        if (F3DWLD.CONFIG.wdsPayload.showCodes)
                        {
                            return "<span class=\"ordre\">" + mp["Var2Order"] + "</span><table class=\"innerCol\"><th>" + mp["Element_"] + "</th><th>" + mp["Element Code"] + "</th></table>";
                        }
                        else {
                            return "<span class=\"ordre\">" + mp["Var2Order"] + "</span>" + mp["Element_"];
                        }
                    },
                    "Articles": function(mp)
                    {
                        if (F3DWLD.CONFIG.wdsPayload.showCodes)
                        {
                            return "<span class=\"ordre\">" + mp["Var3Order"] + "</span><table class=\"innerCol\"><th>" + mp["Item_"] + "</th><th>" + mp["Item Code"] + "</th></table>";
                        }
                        else {
                            return "<span class=\"ordre\">" + mp["Var3Order"] + "</span>" + mp["Item_"];
                        }
                    }
                },
                rows: ["Pays", "Elements", "Articles"],
                cols: ["Annees"],
                vals: ["Value", "Unit", "Flag"],
                linkedAttributes: []
            }
    , S:{
        derivedAttributes: {
            "Area": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<span class=\"ordre\">" + mp["Var1Order"] + "</span><table class=\"innerCol\"><th>" + mp["Country_"] + "</th><th>" + mp["Country Code"] + "</th></table>";
                 }
                 else {
                     return "<span class=\"ordre\">" + mp["Var1Order"] + "</span>" + mp["Country_"];
                 }
             },
            "Element": function(mp)
             {
                 if (F3DWLD.CONFIG.wdsPayload.showCodes)
                 {
                     return "<span class=\"ordre\">" + mp["Var2Order"] + "</span><table class=\"innerCol\"><th>" + mp["Element_"] + "</th><th>" + mp["Element Code"] + "</th></table>";
                 }
                 else {
                     return "<span class=\"ordre\">" + mp["Var2Order"] + "</span>" + mp["Element_"];
                 }
             },
            "Item": function(mp)
             {
                 if (F3DWLD.CONFIG.wdsPayload.showCodes)
                 {
                     return "<span class=\"ordre\">" + mp["Var3Order"] + "</span><table class=\"innerCol\"><th>" + mp["Item_"] + "</th><th>" + mp["Item Code"] + "</th></table>";
                 }
                 else {
                     return "<span class=\"ordre\">" + mp["Var3Order"] + "</span>" + mp["Item_"];
                 }
             }
         },
                 rows: ["Area", "Element", "Item"],
                 cols: ["Year"],
                 vals: ["Value", "Unit", "Flag"],
                 linkedAttributes: []
            }
        };

FAOSTATOLAP2.header = {E: [["Country Code", "Country_", "Element Code", "Element_", "Item Code",
            "Item_", "Year", "Unit", "Value", "Flag", "Flag Description", "Var1Order", "Var2Order", "Var3Order",
            "Var4Order"]],
    F: [["Country Code", "Country_", "Element Code", "Element_", "Item Code",
            "Item_", "Annees", "Unit", "Value", "Flag", "Flag Description", "Var1Order", "Var2Order", "Var3Order",
            "Var4Order"]],
    S: [["Country Code", "Country_", "Element Code", "Element_", "Item Code",
            "Item_", "Year", "Unit", "Value", "Flag", "Flag Description", "Var1Order", "Var2Order", "Var3Order",
            "Var4Order"]]
};


FAOSTATOLAP2.optionsTM = {
    E: {
        derivedAttributes: {
            "Reporter": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ReporterName"] + "</th><th>" + mp["ReporterCode"] + "</th></table>";
                }
                else {
                    return mp["ReporterName"];
                }
            },
            "Partner": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["PartnerName"] + "</th><th>" + mp["PartnerCode"] + "</th></table>";
                }
                else {
                    return mp["PartnerName"];
                }
            },
            "Element": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ElementName"] + "</th><th>" + mp["ElementCode"] + "</th></table>";
                }
                else {
                    return mp["ElementName"];
                }
            },
            "Item": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ItemName"] + "</th><th>" + mp["ItemCode"] + "</th></table>";
                }
                else {
                    return mp["ItemName"];
                }
            }}
        ,
        rows: ["Reporter", "Partner", "Item", "Element"],
        cols: ["Year"],
        vals: ["Value", "Unit", "Flag"],
        linkedAttributes: []
    },
    F: {
        derivedAttributes: {
            "Reporteurs": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ReporterName"] + "</th><th>" + mp["ReporterCode"] + "</th></table>";
                }
                else {
                    return mp["ReporterName"];
                }
            },
            "Partnaires": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["PartnerName"] + "</th><th>" + mp["PartnerCode"] + "</th></table>";
                }
                else {
                    return mp["PartnerName"];
                }
            },
            "Elements": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ElementName"] + "</th><th>" + mp["ElementCode"] + "</th></table>";
                }
                else {
                    return mp["ElementName"];
                }
            },
            "Articles": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ItemName"] + "</th><th>" + mp["ItemCode"] + "</th></table>";
                }
                else {
                    return mp["ItemName"];
                }
            }
        }
        ,
        rows: ["Reporteurs", "Partnaires", "Articles", "Elements"],
        cols: ["Annees"],
        vals: ["Value", "Unit", "Flag"],
        linkedAttributes: []
    }
    ,
    S: {
        derivedAttributes: {
            "Reporter": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ReporterName"] + "</th><th>" + mp["ReporterCode"] + "</th></table>";
                }
                else {
                    return mp["ReporterName"];
                }
            },
            "Partner": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["PartnerName"] + "</th><th>" + mp["PartnerCode"] + "</th></table>";
                }
                else {
                    return mp["PartnerName"];
                }
            },
            "Element": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ElementName"] + "</th><th>" + mp["ElementCode"] + "</th></table>";
                }
                else {
                    return mp["ElementName"];
                }
            },
            "Item": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ItemName"] + "</th><th>" + mp["ItemCode"] + "</th></table>";
                }
                else {
                    return mp["ItemName"];
                }
            }}
        ,
        rows: ["Reporter", "Partner", "Item", "Element"],
        cols: ["Year"],
        vals: ["Value", "Unit", "Flag"],
        linkedAttributes: []}

};


FAOSTATOLAP2.headerTM = {
    E: [["n1", "n2",
            "Domain", "DomainName",
            "ReporterCode", "ReporterName",
            "PartnerCode", "PartnerName",
            "ElementCode", "ElementName",
            "ItemCode", "ItemName",
            "YearCode", "Year",
            "Unit", "Value", "Flag", "FlagD", "Var1Order", "Var2Order", "Var3Order", "Var4Order", "Var5Order"]],
    F: [["n1", "n2",
            "Domain", "DomainName",
            "ReporterCode", "ReporterName",
            "PartnerCode", "PartnerName",
            "ElementCode", "ElementName",
            "ItemCode", "ItemName",
            "YearCode", "Annees",
            "Unit", "Value", "Flag", "FlagD", "Var1Order", "Var2Order", "Var3Order", "Var4Order", "Var5Order"]],
    S: [["n1", "n2",
            "Domain", "DomainName",
            "ReporterCode", "ReporterName",
            "PartnerCode", "PartnerName",
            "ElementCode", "ElementName",
            "ItemCode", "ItemName",
            "YearCode", "Year",
            "Unit", "Value", "Flag", "FlagD", "Var1Order", "Var2Order", "Var3Order", "Var4Order", "Var5Order"]]

};


FAOSTATOLAP2.headerFA = {E: [["Country Code", "Country_", "Element Code", "Element_", "Item Code",
            "Item_", "Year", "Unit", "Value", "Flag", "Flag Description", "Var1Order", "Var2Order", "Var3Order",
            "Var4Order"]],
    F: [["Country Code", "Country_", "Element Code", "Element_", "Item Code",
            "Item_", "Annee", "Unit", "Value", "Flag", "Flag Description", "Var1Order", "Var2Order", "Var3Order",
            "Var4Order"]],
    S: [["Country Code", "Country_", "Element Code", "Element_", "Item Code",
            "Item_", "Year", "Unit", "Value", "Flag", "Flag Description", "Var1Order", "Var2Order", "Var3Order",
            "Var4Order"]]
};


FAOSTATOLAP2.optionsFA = {
    E: {
        derivedAttributes: {
            "Recipient_Country": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["Country_"] + "</th><th>" + mp["Country Code"] + "</th></table>";
                }
                else {
                    return mp["Country_"];
                }
            },
            "Donor_Country": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["Element_"] + "</th><th>" + mp["Element Code"] + "</th></table>";
                }
                else {
                    return mp["Element_"];
                }
            },
            "Item": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["Item_"] + "</th><th>" + mp["Item Code"] + "</th></table>";
                }
                else {
                    return mp["Item_"];
                }
            }

        },
        rows: ["Recipient_Country", "Donor_Country", "Item"],
        cols: ["Year"],
        vals: ["Value", "Unit", "Flag"],
        linkedAttributes: []

    }, F: {
        derivedAttributes: {
            "Pays_beneficiaire": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["Country_"] + "</th><th>" + mp["Country Code"] + "</th></table>";
                }
                else {
                    return mp["Country_"];
                }
            },
            "Pays_Donateur": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["Element_"] + "</th><th>" + mp["Element Code"] + "</th></table>";
                }
                else {
                    return mp["Element_"];
                }
            },
            "Article": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["Item_"] + "</th><th>" + mp["Item Code"] + "</th></table>";
                }
                else {
                    return mp["Item_"];
                }
            }

        },
        rows: ["Pays_beneficiaire", "Pays_Donateur", "Article"],
        cols: ["Annee"],
        vals: ["Value", "Unit", "Flag"],
        linkedAttributes: []

    },
    S: {
        derivedAttributes: {
            "Recipient_Country": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["Country_"] + "</th><th>" + mp["Country Code"] + "</th></table>";
                }
                else {
                    return mp["Country_"];
                }
            },
            "Donor_Country": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["Element_"] + "</th><th>" + mp["Element Code"] + "</th></table>";
                }
                else {
                    return mp["Element_"];
                }
            },
            "Item": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["Item_"] + "</th><th>" + mp["Item Code"] + "</th></table>";
                }
                else {
                    return mp["Item_"];
                }
            }

        },
        rows: ["Recipient_Country", "Donor_Country", "Item"],
        cols: ["Year"],
        vals: ["Value", "Unit", "Flag"],
        linkedAttributes: []

    }



};




FAOSTATOLAP2.optionsHS = {
    E: {
        derivedAttributes: {
            "Survey": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ReporterName"] + "</th><th>" + mp["ReporterCode"] + "</th></table>";
                }
                else {
                    return mp["ReporterName"];
                }
            },
            "Breakdown_Variable": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["PartnerName"] + "</th><th>" + mp["PartnerCode"] + "</th></table>";
                }
                else {
                    return mp["PartnerName"];
                }
            },
            "Breakdown_by_Sex": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ElementName"] + "</th><th>" + mp["ElementCode"] + "</th></table>";
                }
                else {
                    return mp["ElementName"];
                }
            },
            "Indicator": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ItemName"] + "</th><th>" + mp["ItemCode"] + "</th></table>";
                }
                else {
                    return mp["ItemName"];
                }
            }

        },
        rows: ["Survey", "Breakdown_Variable", "Breakdown_by_Sex", "Indicator"],
        cols: ["Measure"],
        vals: ["Value", "Unit", "Flag"],
        linkedAttributes: []

    },
    F: {
        derivedAttributes: {
            "Survey": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ReporterName"] + "</th><th>" + mp["ReporterCode"] + "</th></table>";
                }
                else {
                    return mp["ReporterName"];
                }
            },
            "Breakdown_Variable": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["PartnerName"] + "</th><th>" + mp["PartnerCode"] + "</th></table>";
                }
                else {
                    return mp["PartnerName"];
                }
            },
            "Breakdown_by_Sex": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ElementName"] + "</th><th>" + mp["ElementCode"] + "</th></table>";
                }
                else {
                    return mp["ElementName"];
                }
            },
            "Indicator": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ItemName"] + "</th><th>" + mp["ItemCode"] + "</th></table>";
                }
                else {
                    return mp["ItemName"];
                }
            }

        },
        rows: ["Survey", "Breakdown_Variable", "Breakdown_by_Sex", "Indicator"],
        cols: ["Measure"],
        vals: ["Value", "Unit", "Flag"],
        linkedAttributes: []

    },
    S: {
        derivedAttributes: {
            "Survey": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ReporterName"] + "</th><th>" + mp["ReporterCode"] + "</th></table>";
                }
                else {
                    return mp["ReporterName"];
                }
            },
            "Breakdown_Variable": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["PartnerName"] + "</th><th>" + mp["PartnerCode"] + "</th></table>";
                }
                else {
                    return mp["PartnerName"];
                }
            },
            "Breakdown_by_Sex": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ElementName"] + "</th><th>" + mp["ElementCode"] + "</th></table>";
                }
                else {
                    return mp["ElementName"];
                }
            },
            "Indicator": function(mp)
            {
                if (F3DWLD.CONFIG.wdsPayload.showCodes)
                {
                    return "<table class=\"innerCol\"><th>" + mp["ItemName"] + "</th><th>" + mp["ItemCode"] + "</th></table>";
                }
                else {
                    return mp["ItemName"];
                }
            }

        },
        rows: ["Survey", "Breakdown_Variable", "Breakdown_by_Sex", "Indicator"],
        cols: ["Measure"],
        vals: ["Value", "Unit", "Flag"],
        linkedAttributes: []

    }


};
FAOSTATOLAP2.headerHS = {
	E: [["n1", "n2",
            "Domain", "DomainName",
            "ReporterCode", "ReporterName",
            "PartnerCode", "PartnerName",
            "ElementCode", "ElementName",
            "ItemCode", "ItemName",
            "YearCode", "Measure",
            "Unit", "Value", "Flag", "FlagD", "Var1Order", "Var2Order", "Var3Order", "Var4Order", "Var5Order"]],
    F: [["n1", "n2",
            "Domain", "DomainName",
            "ReporterCode", "ReporterName",
            "PartnerCode", "PartnerName",
            "ElementCode", "ElementName",
            "ItemCode", "ItemName",
            "YearCode", "Measure",
            "Unit", "Value", "Flag", "FlagD", "Var1Order", "Var2Order", "Var3Order", "Var4Order", "Var5Order"]],
    S: [["n1", "n2",
            "Domain", "DomainName",
            "ReporterCode", "ReporterName",
            "PartnerCode", "PartnerName",
            "ElementCode", "ElementName",
            "ItemCode", "ItemName",
            "YearCode", "Measure",
            "Unit", "Value", "Flag", "FlagD", "Var1Order", "Var2Order", "Var3Order", "Var4Order", "Var5Order"]]

};

function retConfig(domain, lang)
{//mesOptionsPivotSend
    var response2_2 = [];
    var mesOptionsPivot = {};
    if (domain == "TM" || domain == "FT")
    {
        response2_2 = FAOSTATOLAP2.headerTM[lang];

        for (j in FAOSTATOLAP2.optionsTM[lang]) {
            mesOptionsPivot[j] = FAOSTATOLAP2.optionsTM[lang][j];
        }
    }
    else if (domain == "HS")
    {
        response2_2 = FAOSTATOLAP2.headerHS[lang];
        mesOptionsPivot = {};
        for (j in FAOSTATOLAP2.optionsHS[lang]) {
            mesOptionsPivot[j] = FAOSTATOLAP2.optionsHS[lang][j];
        }
    }
    else if (domain == "FA")
    {
        response2_2 = FAOSTATOLAP2.headerFA[lang];
        mesOptionsPivot = {};
        for (j in FAOSTATOLAP2.optionsFA[lang]) {
            mesOptionsPivot[j] = FAOSTATOLAP2.optionsFA[lang][j];
        }
    }
    else {
        response2_2 = FAOSTATOLAP2.header[lang];
        mesOptionsPivot = {};
        for (j in FAOSTATOLAP2.options[lang]) {
            mesOptionsPivot[j] = FAOSTATOLAP2.options[lang][j];
        }
    }

    return [response2_2, mesOptionsPivot];

}
		