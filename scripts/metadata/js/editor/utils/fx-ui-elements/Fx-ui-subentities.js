define([
    "jquery","i18n!fx-editor/nls/langProperties", "fx-editor/utils/Fx-element-utils"], function ($, langProperties, Element_Utils) {

    var bootstrapValidator_Utils, element_Utils, lang, guiCache;
    function Fx_ui_SubEntities() {
        element_Utils = new Element_Utils();
    }

    Fx_ui_SubEntities.prototype.validate = function (e) {

        return true;
    };

    Fx_ui_SubEntities.prototype.render = function (e, name, key, o, callback) {
        var validationRule, isRequired = false, value = null;

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


        if(o.guiConfig != undefined){
            guiCache = o.guiConfig;
        }

        //set all select names as an array i.e. appending []
        //var selectName = name+'[]';
        var selectName = name;
        //set all select names as an array i.e. appending []

        //set all select names as an array i.e. appending []
      //  var select = $("<select/>", {
        //    "class": o.cssClass,
        //    "name" : name+'[]'
       // });

        select.attr("class", o.cssClass);
        select.attr("name", selectName);

        // set the id
        select.attr('id', key);

        //set the lang
        select.attr("data-lang", lang);



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

        var options = [];
        if(!isRequired){
            options.push(element_Utils.createEmptyOption(e, langProperties.pleaseSelect, lang));
        }

        select.html(options.join(""));


        select.appendTo(containerId);


        //get Value
        if(o.values!=null){
             value = element_Utils.getElementValue(name, o.values, e);
             if(value!=null){
                 //Prev Form Group = Entities
                 var subEntityElement =  $(containerId).closest('.form-group');  // current (sub-entity) form group
                 var entitySelect =  subEntityElement.prev('.form-group').find("div:first select")[0];
                 var entityName =  $(entitySelect).attr("name");
                 var entityValue = element_Utils.getElementValue(entityName, o.values, e);

                 var firstVal = $(entitySelect).find("option:first").val();
                 var actualValIdx = $("#"+entityName+" option[value='"+entityValue+"']").index();

                 if(firstVal == '') {   // test if first option is a label
                     actualValIdx = actualValIdx-1;
                 }

                 //console.log("FINAL index = "+actualValIdx);

                 var subentities = guiCache["panels"][actualValIdx];

                 if(subentities != undefined){
                 if(subentities.hasOwnProperty("modules")){
                     var sentities = subentities["modules"];
                     element_Utils.createModuleOptions(sentities, options, o.resourceType, lang);
                 }
                 }
                 if(options.length > 0){
                     select.show();
                     select.html(options.join(""));

                     //set Values
                     element_Utils.setSelectedValues(select, value, isRequired, options.length);

                 } else {
                     select.hide();
                     options = [];
                 }

                 //console.log("entityValue "+entityValue);
            }
        } else {
            select.hide();
        }

        callback();

    };


    Fx_ui_SubEntities.prototype.getValue = function (e) {
        return $("#" + e.id).val();
    };


    return Fx_ui_SubEntities;
});
