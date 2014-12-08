define([
    "jquery",
    "fx-editor/utils/Fx-json-utils"
], function ($, Json_Utils) {

    var json_Utils;

    //Public Component
    function Fx_Element_Utils() {
        json_Utils =  new Json_Utils();
    }


    function iterate(obj, codes) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] == "object")
                    iterate(obj[property], codes);
                else  {
                    codes.push(obj[property]);
                }
            }

        }
    }


    function setFirstItemSelected (select) {
        select.val(select.find("option:first").val());
    }



    Fx_Element_Utils.prototype.setSelectedValues = function(select, value, isRequired, optsLength) {
        var opts = [];
        if(value !=null){
            var codes = this.getValues(value);

            if(optsLength == undefined || optsLength == 0) {
                for(var t = 0; t <codes.length; t++){
                    opts.push("<option value='" + codes[t] +"'>" + codes[t] + "</option>");
                }

                select.html(opts.join(""));
            }

            select.val(codes);

        } //else {
            //if(isRequired){
              //  setFirstItemSelected(select);
            //}
        //}

    }

    Fx_Element_Utils.prototype.setDefaultSelectedValue = function(select, value) {
        var codes = [];
        codes.push(value);

        select.val(codes);
    }

    Fx_Element_Utils.prototype.getValueObjects = function(value) {
        var codes = [];
        if (value instanceof Array) {
            for(var j=0; j < value.length; j++){
                var item =  value[j];
                codes.push(item);
            }
        }
        else if(typeof value === 'object'){
            iterate(value, codes);
        }

        return codes;
    }

    Fx_Element_Utils.prototype.getValues = function(value) {
        var codes = [];
        if (value instanceof Array) {
            for(var j=0; j < value.length; j++){
                var item =  value[j];
                if(typeof item === 'object'){
                    iterate(item, codes);
                } else {
                    codes.push(item);
                }
            }
        }
        else if(typeof value === 'object'){
            iterate(value, codes);
        } else {
            codes.push(value);
        }

        return codes;
    }

    Fx_Element_Utils.prototype.getElementValue = function(name, jsonValues, obj) {
        var pth = [name], parentPath, parent, value, itemTrackerArray = [];

        if(obj != undefined){
            if(obj.hasOwnProperty("fieldSetMappedName")) {
                if(obj.fieldSetMappedName != undefined){
                    parentPath = obj.fieldSetMappedName;
                }
            }
        }

        if(parentPath !=undefined){
            var parents = parentPath.split('.');
            var clone = parents.slice();
            var parent;


            var jsn = json_Utils.findValue(parents, jsonValues);

            if(jsn == undefined){
                parents = parentPath.split('.');


                var cloneCopy = [];

                for (var i = 0; i < parents.length; i++) {
                    cloneCopy.push(parents.slice());
                }



                //for (var i = 0; i < parents.length; i++) {
                for(var i = parents.length; i--; )  {
                    var itm =  parents[i];
                   itemTrackerArray.push(itm);

                    var clone =  cloneCopy[i];
                    remove(clone, itemTrackerArray);


                    var jsnP;
                    if(clone.length == 0){
                       jsnP = json_Utils.findValue(itm, jsonValues);
                    } else {
                       jsnP = json_Utils.findValue(clone, jsonValues);
                    }

                    if(jsnP != undefined){
                        jsonValues = jsnP;
                        itemTrackerArray = [];
                        break;
                    }

                }

                if(jsonValues.hasOwnProperty("parent")){
                    parent = jsonValues.parent;
                    var strLen = parent.length;
                    parent = parent.slice(0,strLen-1); //remove trailing .
                   }


            } else {
                jsonValues = jsn;
                parent = parentPath;
                itemTrackerArray = [];
            }


           // console.log("==================== parent = "+parent);

            // needs to be adjusted for when there is more than 1 item in the array
            if($.isArray(jsonValues)) {
                jsonValues = jsonValues[0];
            }

            if(/\./.test(name)){
                var childRes = name.replace(parent+'.','');
                if(/\./.test(childRes)) {
                    value = json_Utils.findValue(childRes.split('.'), jsonValues)
                }
                else {
                    value = json_Utils.findValue([childRes], jsonValues);
                }
            }
        } else {
            if(/\./.test(name)){
                pth = name.split('.');
            }

            value = json_Utils.findValue(pth, jsonValues);
        }

        if(value === null){
            value = "";
        }

        return value;

    }


    function remove(arr, item) {
        //console.log("============== REMOVE ++++++++++++++++");

        for(var j = 0; j < item.length; j++) {
            var itm = item[j];
             for(var i = arr.length; i--;) {
                if(arr[i] === itm) {
                    arr.splice(i, 1);
                }
            }
        }
    }


    Fx_Element_Utils.prototype.getElementValueOriginal = function(name, jsonValues) {
        var pth = [name];

        if(/\./.test(name)){
            pth = name.split('.');
        }

        var value = json_Utils.findValue(pth, jsonValues);

        return value;

    }


    Fx_Element_Utils.prototype.createModuleOptions = function(json, options, resourceType, lang, parentLabel){
       var self = this;
        for (var i = 0; i < json.length; i++) {
            var elem = json[i];

            var label = elem["module"];

            if(lang!=null) {
                if (elem.hasOwnProperty("label")) {
                    label = elem["label"][lang];
                }
            }

            if(parentLabel != undefined){
                label += " ("+parentLabel+")";
            }

            if(elem.hasOwnProperty("resourceType")){
                if($.inArray(resourceType, elem.resourceType) >= 0) {
                    options.push( "<option value='" + elem["module"] + "'>" +label + "</option>" );

                    if(elem.hasOwnProperty("modules")) {
                        self.createModuleOptions(elem["modules"], options, resourceType, label);
                    }

                }
                continue;
            }

            options.push( "<option value='" + elem["module"] + "'>" +label + "</option>" );

            if(elem.hasOwnProperty("modules")) {
                self.createModuleOptions(elem["modules"], options, resourceType, label);
            }

        }
    }



    Fx_Element_Utils.prototype.createEmptyOption = function(element, defaultLabel, lang) {

        if(element.type.hasOwnProperty("instruction")){
            defaultLabel = element.type.instruction[lang];
        }
        return "<option value=''>====="+defaultLabel+"=====</option>";
    }

    Fx_Element_Utils.prototype.init = function () { };

    //Public API
    return Fx_Element_Utils;

});