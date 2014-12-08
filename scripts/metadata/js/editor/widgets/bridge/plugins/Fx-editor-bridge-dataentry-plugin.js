define([
    "jquery",
    "fx-editor/utils/Fx-json-utils",
    "jquery-serialize-object"
], function ($, Json_Utils) {

    var o = { }, json_Utils;

    function FilterPlugin(options) {
        $.extend(o, options);


       //console.log("o.config: "+ o.mapping);
      // console.log("o.config: "+ o.component);

        json_Utils = new Json_Utils();
    }

    FilterPlugin.prototype.preValidation = function () {

        if (!o.component) {
            throw new Error("FILTER PLUGIN: no valid filter component during init()");
        }

        if (!o.mapping) {
            throw new Error("FILTER PLUGIN: no config during init()");
        }

    };

    FilterPlugin.prototype.init = function (options) {
        var self = this;
        //Merge options
        $.extend(o, options);

        self.preValidation();

    };

    FilterPlugin.prototype.getDataEntry = function () {
        //console.log("============== BRIDGE PLUGIN: getDataEntry:=================== ");
        var self = this;

        try {
            return self.createSerializedJson(o.component.getValues())
        }
        catch (e) {
            throw new Error(e);
        }

    };

    FilterPlugin.prototype.createSerializedJson = function (values) {
        //var request = JSON.stringify(values);
        //var request = JSON.stringify(values)
        //console.log("============== BRIDGE PLUGIN: createSerializedJson(): values =================== ");
        var json = JSON.stringify(values);

        //console.log(json);
        return json;
    };



    FilterPlugin.prototype.parseJson = function (jsnObj) {
     //  var json='{"uid":"ss","version":"ss","language":{"codes":[{"code":"AR"}],"codeList":"FAO_Languages","version":"1.0"},"languageDetail":{"EN":"ss"},"title":{"EN":"ss"},"characterSet":{"codes":[{"code":"AR"}],"codeList":"FAO_Languages","version":"1.0"},"parentIdentifier":"","metadataStandardName":{"EN":"ss"},"metadataStandardVersion":{"EN":"ss"},"metadataLanguage":{"codes":[{"code":"AR"},{"code":"ZH"},{"code":"EN"}],"codeList":"FAO_Languages","version":"1.0"},"contacts":{"name":"ss","organisation":{"EN":"ss"},"organisationUnit":{"EN":"ss"},"position":{"EN":""},"role":[{"code":""}],"specify":{"EN":""},"contactInfo":{"phone":"111","address":"","emailAddress":"","hoursOfService":{"EN":""},"contactInstruction":{"EN":""}}},"noDataValue":{"EN":""},"content":{"resourceRepresentationType":[{"code":"dataset"}],"keyWords":{"EN":"www,fff"},"description":{"EN":"wwww"},"statisticalConceptsDefinition":{"EN":"www"},"referencePopulation":{"statisticalPopulation":{"EN":"www"},"statisticalUnit":{"EN":"ww"},"referencePeriod":[{"code":"day"}],"referenceArea":[{"code":"adminlevel2"}]},"coverage":{"coverageSectors":[{"code":"agriculture"}],"coverageSectorsDetails":{"EN":"sector1"},"coverageGeographic":[{"code":"africa"}]}}}';
      //  console.log("parseData: values ======================== "+ jsnObj);
      //  console.log(jsnObj);

      //  var jsnObj = json_Utils.parse(values);

      //  console.log(jsnObj);
      //  console.log("parseData: cache.jsonMapping ======================== "+ o.mapping);

        // Determine the root entity
        var rootIdentifier;
        var jsnRootPath = json_Utils.findParentPathForValue(o.mapping, "root");
       // console.log("parseData: jsnRootPath ======================== "+ jsnRootPath);

        var rootJsnEntity = json_Utils.findObjectByPath(o.mapping, jsnRootPath);

       // console.log("parseData: rootJsnEntity ======================== "+ rootJsnEntity);


        if(rootJsnEntity.hasOwnProperty("entity")){
            rootIdentifier = rootJsnEntity["entity"];
        }

        //console.log("parseData: rootIdentifier ======================== "+ rootIdentifier);

        //o.component.getValues()


        var storageKeys = o.keys;
        // Create object, whose properties match the storage keys and values are the loadedJsnObj split by key
        var splitObj = json_Utils.splitJsnByKeys(storageKeys, jsnObj, rootIdentifier);
        //console.log("parseData: splitObj ======================== "+ splitObj);
       // console.log(splitObj);

        // Delete the value Obj properties that match the storage keys
      var cleanedUpObj = json_Utils.deleteRootProperties(storageKeys, splitObj);

       return cleanedUpObj;
    };

    FilterPlugin.prototype.createSerializedJson1 = function (values) {
        var $form = $(values);

        //console.log("form =================== ");
        //console.log($form);

       // console.log("form serialize =================== ");
        //console.log($form.serialize());

       // console.log("form serialize ARRAY=================== ");
        //console.log($form.serializeArray());


        var request = JSON.stringify($form.serializeObject())
        //console.log("form serialize Object =================== ");
       // console.log(request);


        var jsonObject = JSON.parse(request);
       // console.log("form parse(deserialize) Object =================== ");
       // console.log(jsonObject);


        return request;
    };



    FilterPlugin.prototype.convertValue = function(values, rules ){

        var rulesKeys = Object.keys(rules);

        for (var j=0; j < values.length; j ++){

            for (var i = 0; i < rulesKeys.length; i++){
                if (rules.hasOwnProperty(rulesKeys[i])){
                    if (values[j].hasOwnProperty(rulesKeys[i])){
                        values[j][rules[rulesKeys[i]]] =  values[j][rulesKeys[i]];
                        delete values[j][rulesKeys[i]];
                    }
                }
            }
        }

        return values;

    };

    return FilterPlugin;

});