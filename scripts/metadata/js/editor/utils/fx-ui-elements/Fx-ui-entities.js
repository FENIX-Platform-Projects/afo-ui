define([
    "jquery","i18n!fx-editor/nls/langProperties", "fx-editor/utils/Fx-element-utils"], function ($, langProperties, Element_Utils) {

    var bootstrapValidator_Utils, element_Utils, lang, guiCache;

    function Fx_ui_Entities() {
        element_Utils = new Element_Utils();
    }

    Fx_ui_Entities.prototype.validate = function (e) {

        return true;
    };

    Fx_ui_Entities.prototype.render = function (e, name, key, o, callback) {
        var validationRule, isRequired = false, value = null;

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


        //set all select names as an array i.e. appending []
        var select = $("<select/>", {
            "class": o.cssClass,
            "name" : name
        });

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

        if(e.hasOwnProperty("fieldSetId"))
            containerId = '#'+o.container + e.fieldSetId+'-'+key;


        // add the specific CSS class
        $(containerId).addClass('selectContainer');


        if(o.guiConfig != undefined){
            guiCache = o.guiConfig;
        }

        getEntities(select, isRequired, e, name, value, containerId, o.resourceType, callback);


    };

    function getEntities(select, isRequired, element, name, value, containerId, resourceType,  callback){
        var options = [];

        // Add empty option if not a required field
        if(!isRequired){
            options.push(element_Utils.createEmptyOption(element, langProperties.pleaseSelect, lang));
        }

         if (guiCache.hasOwnProperty("panels")) {
            var entities = guiCache["panels"];
            for (var i = 0; i < entities.length; i++) {
                var label = entities[i]["module"];
                if(lang!=null) {
                    if (entities[i].hasOwnProperty("label")) {
                        label = entities[i]["label"][lang];
                    }
                }

                if(entities[i].hasOwnProperty("resourceType")){
                    if($.inArray(resourceType, entities[i].resourceType) >= 0) {
                        options.push( "<option value='" + entities[i]["module"] + "'>" +label + "</option>" );
                    }
                    continue;
                }

                options.push( "<option value='" + entities[i]["module"] + "'>" +label + "</option>" );

            }
        }


        //set options on the select
        select.html(options.join(""));


        //set Values
        element_Utils.setSelectedValues(select, value, isRequired, options.length);

        select.on('change', function(){
            //console.log("********************* ON CHANGE CALLED ");

            var labelFirstOption = false, options = [];

            if(select.find("option:first").val() == '') {
                labelFirstOption = true;
            }

            select.find("option:selected").each(function(index){
                var entityIndex =  $(this).index();
                var entityLabel =  $(this).text();

                if(labelFirstOption){
                    entityIndex = entityIndex-1;
                }

               var subentities = guiCache["panels"][entityIndex];

             if(subentities.hasOwnProperty("modules")){
                var sentities = subentities["modules"];
                 element_Utils.createModuleOptions(sentities, options, resourceType, lang);
              }

            });

            //Next Form Group = SubEntities
            var entityElement =  $(containerId).closest('.form-group');  // current (entity) form Group
            var subEntitySelect =  entityElement.next('.form-group').find("div:first select")[0];
            var subEntitySelectName =  $(subEntitySelect).attr("name");

            if(options.length > 0){
                $('#'+subEntitySelectName).show();
                $('#'+subEntitySelectName).html(options.join(""));
            } else {
                $('#'+subEntitySelectName).hide();
                options = [];
            }

        });

        select.appendTo(containerId);

        callback();

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
        select.val(select.find("option:first").val());
    }    **/


    Fx_ui_Entities.prototype.getValue = function (e) {
        return $("#" + e.id).val();
    };



    return Fx_ui_Entities;
});
