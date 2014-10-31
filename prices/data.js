mesOptions = {
             
    E:{
        derivedAttributes: {
                    "Area": function(mp)
                    {
                        if (false)
                        {
                            return "<span class=\"ordre\">" + mp["Var1Order"] + "</span><table class=\"innerCol\"><th>" + mp["Country_"] + "</th><th>" + mp["Country Code"] + "</th></table>";
                        }
                        else {
                            return  mp["Country_"];
                        }
                    },
                    "Element": function(mp)
                    {
                        if (false)
                        {
                            return "<span class=\"ordre\">" + mp["Var2Order"] + "</span><table class=\"innerCol\"><th>" + mp["Element_"] + "</th><th>" + mp["Element Code"] + "</th></table>";
                        }
                        else {
                            return mp["Element_"];
                        }
                    },
                    "Item": function(mp)
                    {
                        if (false)
                        {
                            return "<span class=\"ordre\">" + mp["Var3Order"] + "</span><table class=\"innerCol\"><th>" + mp["Item_"] + "</th><th>" + mp["Item Code"] + "</th></table>";
                        }
                        else {
                            return  mp["Item_"];
                        }
                    },
                     "Continent": function(mp) {
	                 		try{
	                 			return countryAgg[mp["Country Code"]][1] ;
	                 	}catch(er) {
	                 		console.log(countryAgg);
	                 		console.log("|"+mp["Country Code"]+"|")
	                 	}
	                 },
					"SubContinent":function(mp) {return countryAgg[mp["Country Code"]][2] ;}
                },
                rows: ["Area", "Element", "Item"],
                cols: ["Year"],
                vals: ["Value", "Unit", "Flag"],
                hiddenAttributes:["Var1Order","Var2Order","Var3Order","Var4Order","Flag Description"],
        linkedAttributes:[["Area","Continent","SubContinent"]]
                }
        };
            
