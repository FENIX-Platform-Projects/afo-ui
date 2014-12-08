define([
    "jquery","i18n!fx-editor/nls/langProperties", "fx-editor/utils/Fx-element-utils"], function ($, langProperties, Element_Utils) {

    var bootstrapValidator_Utils, element_Utils, lang,
        types = {
            "CODE_LIST": "CodeList",
            "MULTIPLE_CHOICE" : "MultipleChoice"
        };

    function Fx_ui_Hierarchy() {
        element_Utils = new Element_Utils();
    }

    Fx_ui_Hierarchy.prototype.validate = function (e) {
        //console.log("============== Hierarchy =================== ");
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

        }
        return true;
    };

    Fx_ui_Hierarchy.prototype.render = function (e, name, key, o, callback) {
        var validationRule, isRequired = false, value = null;
        //console.log("TEST HIERARCHY ========== "+name);


        lang = o.lang;

        if(o.validationUtils != undefined) {
             bootstrapValidator_Utils = o.validationUtils;
        }

        if(e.hasOwnProperty("rule")){
            validationRule = e.rule;
        }

        //get Value
        if(o.values!=null){
            value = element_Utils.getElementValue(name, o.values, e);
        }

        // the selected values are set using the bootstrap tagsinput library
        var tagsInputSelect = $("<select multiple/>");

        //set all select names as an array i.e. appending []
        var selectName = name+'[]';

        if(e.source.type.hasOwnProperty("object")){
           // console.log("==== SELECT e.type.object = "+ e.source.type.object);
            if(o.objMapping != undefined) {
                var objType =  e.source.type["object"];
                if(o.objMapping.hasOwnProperty(objType)){
                    if(o.objMapping[objType].hasOwnProperty("code")){
                        if(o.objMapping[objType]["code"].hasOwnProperty("path")){
                             selectName += o.objMapping[objType]["code"]["path"];
                        }
                    }
                }

                for (var property in  e.source.type) {
                    tagsInputSelect.attr("data-cl-"+property.toLowerCase(), e.source.type[property]);
                    if (e.source.type.hasOwnProperty(property) && property!= 'name') {
                        if(o.objMapping[objType].hasOwnProperty(property)){
                            if(o.objMapping[objType][property].hasOwnProperty("path"))
                                tagsInputSelect.attr("data-cl-"+property.toLowerCase()+"-path", o.objMapping[objType][property]["path"]);
                        }
                    }
                }
            }
        }


        tagsInputSelect.attr("class", o.cssClass);
        tagsInputSelect.attr("name", selectName);
        tagsInputSelect.attr("data-role", "tagsinput");
        tagsInputSelect.attr('type', e.type.name);
        tagsInputSelect.attr('id', key);

        //set the codelist/multiplechoice
        for (var property in  e.source.type) {
            if (e.source.type.hasOwnProperty(property) && property!= 'name') {
                tagsInputSelect.attr("data-cl-"+property.toLowerCase(), e.source.type[property]);
            }
        }

        //check if the field is required
        if(validationRule && bootstrapValidator_Utils){
            if(bootstrapValidator_Utils.isRequired(validationRule)){
                isRequired = true;
            }
            bootstrapValidator_Utils.setValidationAttributes(tagsInputSelect, validationRule, lang);
        }

        var containerId = '#'+ o.container + key;

        if(e.hasOwnProperty("fieldSetId"))
            containerId = '#'+o.container + e.fieldSetId+'-'+key;


        // add the specific CSS class
        $(containerId).addClass('selectContainer');

        // add any multilingual component to the path
        if(e.hasOwnProperty("value")){
            if(e.value.hasOwnProperty("multilingual")){
                if(e.value.multilingual)
                    tagsInputSelect.attr("data-lang", o.lang);
            }
        }

        tagsInputSelect.attr('placeholder', langProperties.selectFromList);

        tagsInputSelect.appendTo(containerId);
        tagsInputSelect.tagsinput({
            trimValue: true,
            confirmKeys: [13, 44],
            itemValue: 'value',
            itemText: 'text',
            freeInput: false
        });

      //  console.log("VALUE = "+value);

        if(value!=null){
            buildSelectedValues(tagsInputSelect, value, o.lang);
        } //else {
           // tagsInputSelect.attr("disabled", "disabled");
       // }


        // the Level One Parent Selector
        var levelOneSelect = $("<select/>");
        levelOneSelect.attr("class", o.cssClass);

        if (e.source.hasOwnProperty("url")) {
            populateFromUrl(levelOneSelect, isRequired,  e.source, e, name, containerId, callback);
        }

        // the Level Two Child Selector
        var childSelect = $("<select/>");
        childSelect.attr("class", o.cssClass);

        // set additional options like 'multiple' selections
        if(e.type.hasOwnProperty("multi")){
            if(e.type.multi){
                childSelect.attr("multiple", '');
            }
        }

        childSelect.on('click', function(){
            if($(this).val() != ""){
            var label = this.options[this.selectedIndex].innerHTML;
            tagsInputSelect.tagsinput('add',{value: $(this).val(), text: label});
            tagsInputSelect.tagsinput('refresh');
            }
         });





        levelOneSelect.on('click', function(){
          //  if(tagsInputSelect.attr("disabled") == "disabled")
             //   tagsInputSelect.removeAttr("disabled");

            if($(this).val() != ""){
             /**   if(tagsInputSelect.attr("placeholder") != undefined) {
                    console.log("REMOVE placeholder 1 ");
                    tagsInputSelect.removeAttr("placeholder");
                    $(containerId+ " div[class='bootstrap-tagsinput']").each(function(){
                       var input =  $(this).children("input");

                        if(input.attr("placeholder") != undefined) {
                            input.removeAttr("placeholder");
                        }
                    });
                 }   **/

                var label = this.options[this.selectedIndex].innerHTML;
                tagsInputSelect.tagsinput('add',{value: $(this).val(), text: label});
                tagsInputSelect.tagsinput('refresh');

                populateFromUrlChildren(childSelect, $(this).val(), isRequired,  e.source, e, name, containerId, callback);
             } else {
                childSelect.hide();
            }

        });

    };


    function populateFromUrl(select, isRequired, source, element, name, containerId, callback){

        var root, codeProp, labelProp, langProp, defaultLang, level, children,  sortLabels = true;
        if(source.hasOwnProperty("dataroot")){
            root = source.dataroot;
        }

        if(source.datafields.hasOwnProperty("level")){
            level = source.datafields.level;
        }

        if(source.datafields.hasOwnProperty("children")){
            children = source.datafields.children;
        }

        if(source.datafields.hasOwnProperty("sort")){
            sortLabels = source.datafields.sort;
        }

        if(source.datafields.hasOwnProperty("code")){
            codeProp = source.datafields.code;
        }

        if(source.datafields.hasOwnProperty("label")){
            labelProp = source.datafields.label;
        }


        if(source.datafields.hasOwnProperty("lang")){
            langProp = source.datafields.lang;

           // console.log("langProp = "+langProp);
           // console.log("labelProp = "+labelProp);

            if(langProp === labelProp){
                defaultLang = labelProp;
              //  console.log("labelProp MATCH ");
               // console.log("defaultLang =  "+defaultLang);
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
           // console.log(xhr);

            if( xhr.status == 200 ) {
                //sort data
                var rootItem, options = [];
                if(root!== undefined)  {
                    rootItem = data[root];
                }

             //   console.log("BEFORE SORT: ");
              //  console.log(rootItem);

               // console.log("codeProp = "+codeProp);
               // console.log("labelProp = "+labelProp);
               // console.log("defaultLang = "+defaultLang);
               // console.log("lang = "+lang);
               // console.log("========================== "+name+ "======================== sort = "+sortLabels);
                if(sortLabels){
                rootItem.sort(sortData(labelProp, defaultLang, lang));
                }
               // console.log("AFTER SORT: ");
              //  console.log(rootItem);

                // Add empty option if not a required field
               // if(!isRequired){
                    options.push(element_Utils.createEmptyOption(element, langProperties.pleaseSelect, lang));
              //  }


                for(var i = 0; i < rootItem.length; i++){
                    var codeVal = rootItem[i];

                    if(codeProp !== undefined) {
                        codeVal = codeVal[codeProp];
                    } else {
                        codeVal = codeVal.code;
                    }

                   //console.log("codeVal = "+ codeVal);
                    var opt = createOption(codeVal, rootItem[i], labelProp, defaultLang, lang);
                  //  console.log(opt);
                  // console.log("================================ ");

                    options.push(opt);

                }

                //set options on the select
                select.html(options.join(""));

                select.appendTo(containerId);
                callback();
            }

            else {
                //console.log("IS NOT 200 ");
                select.appendTo(containerId);
                callback();
            }

        });



    }



    function populateFromUrlChildren(select, parentCode, isRequired, source, element, name, containerId, callback){

        var root, codeProp, labelProp, langProp, defaultLang, level, children, sortLabels = true;
        if(source.hasOwnProperty("dataroot")){
            root = source.dataroot;
        }

        if(source.datafields.hasOwnProperty("level")){
            level = source.datafields.level;
        }

        if(source.datafields.hasOwnProperty("children")){
            children = source.datafields.children;
        }

        if(source.datafields.hasOwnProperty("sort")){
            sortLabels = source.datafields.sort;
        }

        if(source.datafields.hasOwnProperty("code")){
            codeProp = source.datafields.code;
        }

        if(source.datafields.hasOwnProperty("label")){
            labelProp = source.datafields.label;
        }

        if(source.datafields.hasOwnProperty("lang")){
            langProp = source.datafields.lang;

            //console.log("langProp = "+langProp);
            //console.log("labelProp = "+labelProp);

            if(langProp === labelProp){
                defaultLang = labelProp;
                //console.log("labelProp MATCH ");
               // console.log("defaultLang =  "+defaultLang);
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
         //   console.log(xhr);

            if( xhr.status == 200 ) {
                //sort data
                var rootItem, options = [];

                var result = data[root].filter(function( obj ) {
                    return obj.code == parentCode;
                });

                     if(result.length > 0) {
                    if(result[0].hasOwnProperty("children")){
                       // console.log("result.children");
                       // console.log(result[0].children);

                        rootItem = result[0].children;
                    }
                    }


               if(rootItem != undefined){
                   options.push(element_Utils.createEmptyOption(element, langProperties.pleaseSelect, lang));

                   rootItem.sort(sortChildrenData(labelProp, defaultLang, lang));

                for(var i = 0; i < rootItem.length; i++){
                    var codeVal = rootItem[i];

                    if(codeProp !== undefined) {
                        codeVal = codeVal[codeProp];
                    } else {
                        codeVal = codeVal.code;
                    }

                  //  console.log("codeVal = "+ codeVal);
                    var opt = createOption(codeVal, rootItem[i], labelProp, defaultLang, lang);
                  //  console.log(opt);
                   // console.log("================================ ");

                    options.push(opt);

                  }
                }

                //set options on the select
                select.html(options.join(""));


                select.appendTo(containerId);

                if(options.length > 0){
                    select.show();
                } else {
                    select.hide();
                }
                callback();
            }

            else {
                //console.log("IS NOT 200 ");
                select.appendTo(containerId);
                callback();
            }

        });



    }

    function sortChildrenData(labelProp, langProp, lang) {
        //if language is associated to label field, get value based on the lang
        return function(a, b) {


            if(langProp!=null) {
                if(labelProp == langProp){
                    if(a.hasOwnProperty(lang)){
                        if (a[lang].trim() < b[lang].trim())
                            return -1;
                        if (a[lang].trim() > b[lang].trim())
                            return 1;
                        return 0;
                    } else {
                        if (a[langProp].trim() < b[langProp].trim())
                            return -1;
                        if (a[langProp].trim() > b[langProp].trim())
                            return 1;
                        return 0;
                    }
                } else {
                     if(a[labelProp].hasOwnProperty(lang)){
                        if (a[labelProp][lang].trim() < b[labelProp][lang].trim())
                            return -1;
                        if (a[labelProp][lang].trim() > b[labelProp][lang].trim())
                            return 1;
                        return 0;
                    } else {
                        if (a[labelProp][langProp].trim() < b[labelProp][langProp].trim())
                            return -1;
                        if (a[labelProp][langProp].trim() > b[labelProp][langProp].trim())
                            return 1;
                        return 0;
                    }
                }
            }
            else {
                if (a[labelProp].trim() < b[labelProp].trim())
                    return -1;
                if (a[labelProp].trim() > b[labelProp].trim())
                    return 1;
                return 0;
            }
        }
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
                    if(a[labelProp].hasOwnProperty(lang)){
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
                    return  "<option value='" + index + "' name='code'>" + item[lang] + "</option>";
                }
                else
                    return  "<option value='" + index + "' name='code'>" + item[labelProp] + "</option>";

            } else {
                if(item[labelProp].hasOwnProperty(lang)){
                    return  "<option value='" + index + "' name='code'>" +  item[labelProp][lang] + "</option>";
                }
                else
                    return  "<option value='" + index + "' name='code'>" + item[labelProp][langProp] + "</option>";
            }
        }
        else {
            return "<option value='" + index + "' name='code'>" + item[labelProp] + "</option>";
        }
    }

    function buildSelectedValues(select, value, lang) {
            //console.log("================== buildSelectedValues ================");
           //console.log(value);
            var codes = element_Utils.getValueObjects(value);

             for(var t = 0; t <codes.length; t++){
                 var obj = codes[t];
                 var code = obj.code;
                 var label = obj.label[lang];

                 //console.log(codes[t]);
                 select.tagsinput('add',{value: code, text: label});
             }

            select.tagsinput('refresh');
    }

  /**  function setSelectedValues(select, value, isRequired) {
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
        select.val(select.find("option:first").val()).change();
    } **/


    Fx_ui_Hierarchy.prototype.getValue = function (e) {
        return $("#" + e.id).val();
    };



    return Fx_ui_Hierarchy;
});
