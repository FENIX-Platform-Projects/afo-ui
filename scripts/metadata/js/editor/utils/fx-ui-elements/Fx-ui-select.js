define([
    "jquery","i18n!fx-editor/nls/langProperties", "fx-editor/utils/Fx-element-utils"], function ($, langProperties, Element_Utils) {

    var bootstrapValidator_Utils, element_Utils, lang,
        types = {
            "CODE_LIST": "CodeList",
            "MULTIPLE_CHOICE" : "MultipleChoice"
        };

    function Fx_ui_Select() {
        element_Utils = new Element_Utils();
    }

    Fx_ui_Select.prototype.validate = function (e) {
        //console.log("============== TEST =================== ");
      if (!e.hasOwnProperty("source")) {
            throw new Error("ELEM_NO_SOURCE");
        }
        else {
            if (!e.source.hasOwnProperty("type")) {
                throw new Error("ELEM_NO_TYPE");
            } else {
                if(!e.source.type.hasOwnProperty("name")){
                    throw new Error("ELEM_NO_NAME");
                }
                else {
                    if(e.source.type.name === types.CODE_LIST){
                        if (!e.source.type.hasOwnProperty("system")) {
                            throw new Error("ELEM_NO_CODELIST");
                        }

                        if (!e.source.type.hasOwnProperty("version")) {
                            throw new Error("ELEM_NO_CODELISTVERSION");
                        }
                    }
                   // if(e.source.type.name === types.MULTIPLE_CHOICE){
                       // if (!e.source.type.hasOwnProperty("multipleChoice")) {
                         //   throw new Error("ELEM_NO_MULTICHOICE");
                       // }
                   // }
                }
            }

            if(!e.source.hasOwnProperty("datafields")){
                throw new Error("ELEM_NO_DATAFIELDS");
            } else {
                if(!e.source.datafields.hasOwnProperty("lang") && !e.source.datafields.hasOwnProperty("label")){
                      throw new Error("ELEM_NO_DATAFIELDS_CODE_LABEL");
                  }
            }




            // else {
            //  if(!e.source.datafields[0].hasOwnProperty("code") && !e.source.datafields[0].hasOwnProperty("label")){
            //      throw new Error("ELEM_NO_DATAFIELDS_CODE_LABEL");
            //  }
            // if(e.source.hasOwnProperty("url")){
            //     if(!e.source.hasOwnProperty("dataroot")){
            //           throw new Error("ELEM_NO_DATAROOT");
            //   }
            // }
            // }
        }
        return true;
    };

    Fx_ui_Select.prototype.render = function (e, name, key, o, callback) {
        var validationRule, isRequired = false, value = null;
        //console.log("TEST RENDER ========== "+name);

        lang = o.lang;

        if(o.validationUtils != undefined) {
            bootstrapValidator_Utils = o.validationUtils;
        }

        if(e.hasOwnProperty("rule")){
            validationRule = e.rule;
        }

        var select = $("<select/>");

        if(e.type.hasOwnProperty("enabled")){
            if(!e.type.enabled){
                select =  $("<select disabled/>");
            }
        }

        //get Value
        if(o.values!=null){
            value = element_Utils.getElementValue(name, o.values, e);
        }

        //set all select names as an array i.e. appending []
        //var selectName = name+'[]';
        var selectName = name;

        if(e.source.type.name === types.CODE_LIST){   //array for codeList
            selectName += '[]';
        } else {
            if(e.type.hasOwnProperty("multi")){  //otherwise only if multiple select for multiple choice
                if(e.type.multi){
                    selectName += '[]';
                }
            }
        }




       // console.log("==== SELECT selectName = "+ selectName);
      //  console.log("==== SELECT o.objMapping = "+ o.objMapping);

        if(e.source.type.hasOwnProperty("object")){
          //  console.log("==== SELECT e.type.object = "+ e.source.type.object);
            if(o.objMapping != undefined) {
                var objType =  e.source.type["object"];
                if(o.objMapping.hasOwnProperty(objType)){
                    if(o.objMapping[objType].hasOwnProperty("code")){
                       // console.log("==== SELECT hasProperty code ");
                        if(o.objMapping[objType]["code"].hasOwnProperty("path")){
                         //   console.log("==== SELECT hasProperty code.path "+ objType);
                            selectName += o.objMapping[objType]["code"]["path"];
                          //  console.log("selectName = "+ selectName);
                        }
                    }
                }

                for (var property in  e.source.type) {
                    select.attr("data-cl-"+property.toLowerCase(), e.source.type[property]);
                    if (e.source.type.hasOwnProperty(property) && property!= 'name') {
                        if(o.objMapping[objType].hasOwnProperty(property)){
                            if(o.objMapping[objType][property].hasOwnProperty("path"))
                                select.attr("data-cl-"+property.toLowerCase()+"-path", o.objMapping[objType][property]["path"]);
                        }
                    }
                }
            }
        }

        //set all select names as an array i.e. appending []
        select.attr("class", o.cssClass);
        select.attr("name", selectName);

        // var select = $("<select/>", {
         //   "class": o.cssClass,
          //  "name" : name+'[]'
       // });

        // set the id
        select.attr('id', key);

        //set the lang
        select.attr("data-lang", lang);

        //set the codelist/multiplechoice
        for (var property in  e.source.type) {
            if (e.source.type.hasOwnProperty(property) && property!= 'name') {
                select.attr("data-cl-"+property.toLowerCase(), e.source.type[property]);
            }
        }

        // select.attr("data-codelist", e.source.codeList);
        //set the codelist version
        //select.attr("data-codelistversion", e.source.codeListVersion);

        // set additional options like 'multiple' selections
        if(e.type.hasOwnProperty("multi")){
            if(e.type.multi){
                select.attr("multiple", '');
            }
        }

        //check if the field is required
        if(validationRule && bootstrapValidator_Utils){
            if(bootstrapValidator_Utils.isRequired(validationRule)){
                isRequired = true;
            }
            bootstrapValidator_Utils.setValidationAttributes(select, validationRule, lang);
        }

        var containerId = '#'+ o.container + key;
        if(e.hasOwnProperty("fieldSetId"))  {
            containerId = '#'+o.container + e.fieldSetId+'-'+key;
        }

        // add the specific CSS class
        $(containerId).addClass('selectContainer');


        if (e.source.hasOwnProperty("url")) {

            populateFromUrl(select, isRequired,  e.source, e, name, value, containerId, callback);
        }
    };




    function populateFromUrl(select, isRequired, source, element, name, value, containerId, callback){

        var root, codeProp, labelProp, langProp, defaultLang, sortLabels = true;
        if(source.hasOwnProperty("dataroot")){
            root = source.dataroot;
        }

        if(source.datafields.hasOwnProperty("code")){
            codeProp = source.datafields.code;
        }

        if(source.datafields.hasOwnProperty("label")){
            labelProp = source.datafields.label;
        }

        if(source.datafields.hasOwnProperty("sort")){
            sortLabels = source.datafields.sort;
        }

        if(source.datafields.hasOwnProperty("lang")){
            langProp = source.datafields.lang;

           // console.log("langProp = "+langProp);
           // console.log("labelProp = "+labelProp);

            if(langProp === labelProp){
                defaultLang = labelProp;
                //console.log("labelProp MATCH ");
                //console.log("defaultLang =  "+defaultLang);
            }
            else {
                var fields = langProp.split(/[[\]]{1,2}/);
                fields.length--;

                 for(var k = 0; k < fields.length; k++){
                    if(fields[k] != labelProp){
                        defaultLang = fields[k];
                    }
                 }
            }
        }


        $.getJSON(source.url, function(data, status, xhr) {
          //  console.log(xhr);
         //   console.log("====================================== "+name+" ==========================");
            if( xhr.status == 200 ) {
            //sort data
            var rootItem, options = [];
            if(root!== undefined)  {
                rootItem = data[root];
                //rootItem.sort(sortData(label, labelProp));
            } else {
                var dataArry = [];
                for(var prop in data){
                   var obj = data[prop];
                   obj.code = prop;
                   dataArry.push(obj);
                }
                rootItem =  dataArry;
            }

          //  console.log("BEFORE SORT: ");
          //  console.log(rootItem);

           // console.log("codeProp = "+codeProp);
           // console.log("labelProp = "+labelProp);
           // console.log("defaultLang = "+defaultLang);
           // console.log("lang = "+lang);
           //    console.log("====================================== "+name+" ========================== sort = "+sortLabels);
            if(sortLabels){
              rootItem.sort(sortData(labelProp, defaultLang, lang));
            }
          //  console.log("AFTER SORT: ");
          //  console.log(rootItem);

           // Add empty option if not a required field
            if(!isRequired){
                options.push(element_Utils.createEmptyOption(element, langProperties.pleaseSelect, lang));
            }


            for(var i = 0; i < rootItem.length; i++){
                var codeVal = rootItem[i];

                if(codeProp !== undefined) {
                    codeVal = codeVal[codeProp];
                } else {
                    codeVal = codeVal.code;
                }

               // console.log(codeVal+ " labelProp = "+labelProp);
                var opt = createOption(codeVal, rootItem[i], labelProp, defaultLang, lang);
              ///  console.log(opt);
              //  console.log("================================ ");

                options.push(opt);

            }

            //set options on the select
            select.html(options.join(""));


            //set Values
                //console.log("====================================== TEST ==========================");
                //console.log(name + " | "+options.length);
                if(value !=null){
                    element_Utils.setSelectedValues(select, value, isRequired, options.length);
                } else {
                    if(element.source.hasOwnProperty("datafields")){
                        if(element.source.datafields.hasOwnProperty("defaultCode")){
                             element_Utils.setDefaultSelectedValue(select, element.source.datafields.defaultCode);
                        }
                    }
                }

                select.appendTo(containerId);
                callback();
            }

            if(xhr.status == 404){
                select.appendTo(containerId);
                callback();
            }

            //else {
              //console.log("IS NOT 200 ");
            //select.appendTo(containerId);
            //callback();
            //}

        });



    }

    function sortData(labelProp, langProp, lang) {
        //if language is associated to label field, get value based on the lang
        return function(a, b) {
            // console.log(a);
            // console.log(b);

            if(langProp!=null) {
                if(labelProp == langProp){
                    if(a.hasOwnProperty(lang)){
                        if (a[lang] < b[lang])
                            return -1;
                        if (a[lang] > b[lang])
                            return 1;
                        return 0;
                    } else {
                        if (a[langProp] < b[langProp])
                            return -1;
                        if (a[langProp] > b[langProp])
                            return 1;
                        return 0;
                    }
                } else {
                    if(a.hasOwnProperty(labelProp) && b.hasOwnProperty(labelProp)) {
                        if(a[labelProp].hasOwnProperty(lang) && b[labelProp].hasOwnProperty(lang)){
                            if (a[labelProp][lang] < b[labelProp][lang])
                                return -1;
                            if (a[labelProp][lang] > b[labelProp][lang])
                                return 1;
                            return 0;
                        } else {
                            if (a[labelProp][[langProp]] < b[labelProp][langProp])
                                return -1;
                            if (a[labelProp][langProp] > b[labelProp][langProp])
                                return 1;
                            return 0;
                        }
                    }
                }
            }
           else {
                if (a[labelProp] < b[labelProp])
                    return -1;
                if (a[labelProp] > b[labelProp])
                    return 1;
                return 0;
            }
        }
    }




    function createOption(index, item, labelProp, langProp, lang){
        if(labelProp!=null) {
            if(labelProp == langProp){
                if(item.hasOwnProperty(lang)){
                    return  "<option value='" + index + "'>" + item[lang] + "</option>";
                }
                else
                    return  "<option value='" + index + "'>" + item[labelProp] + "</option>";

            } else {
               if(item.hasOwnProperty(labelProp)){
                    if(item[labelProp].hasOwnProperty(lang)){
                        return  "<option value='" + index + "'>" +  item[labelProp][lang] + "</option>";
                    }
                    else
                        return  "<option value='" + index + "'>" + item[labelProp][langProp] + "</option>";
                   }
                else {
                   return  "<option value='" + index + "'>" + item + "</option>";
               }
            }
         }
        else {
            return "<option value='" + index + "'>" + item[labelProp] + "</option>";
        }
    }





 /**   function setSelectedValues(select, value, isRequired) {
        console.log("%%%%%% TEST: value "+value);
        console.log(value)
        if(value !=null){
            var codes = [];
            if(typeof value === 'object'){
                codes.push(iterate(value));
            } else {
                codes.push(value);
            }



            select.val(codes);

        } else {
            if(isRequired){
                setFirstItemSelected(select);
            }
        }
    }


    function iterate(obj) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] == "object")
                    iterate(obj[property]);
                else  {
                    console.log("%%%%%% TEST:iterate property: "+property+ " | value: "+obj[property]);
                    return obj[property];
                }

            }
        }
    }

    function setSelectedValuesOriginal(select, value, isRequired) {
        if(value !=null){
            var codes = [];
            for(var i = 0; i < value.length; i++){
                codes.push(value[i]['code']);
            }
            select.val(codes);

        } else {
            if(isRequired){
                setFirstItemSelected(select);
            }
        }
    }

    function setFirstItemSelected(select) {
        select.val(select.find("option:first").val());
    }  **/


 Fx_ui_Select.prototype.getValue = function (e) {
        return $("#" + e.id).val();
    };




    return Fx_ui_Select;
});
