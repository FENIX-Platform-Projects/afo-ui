define([
    "jquery", "fx-editor/utils/Fx-element-utils"
     ], function ($, Element_Utils) {

    var element_Utils;

    function Fx_ui_Sequence() {
        element_Utils = new Element_Utils();
    }


    Fx_ui_Sequence.prototype.validate = function (e) {
        return true;
    };

    Fx_ui_Sequence.prototype.render = function (e, name, key, o, callback) {
        var validationRule, bootstrapValidator_Utils, self = this, isRequired = false, value = null;

        if(o.validationUtils != undefined) {
            //console.log("VALIDATION UTILS DEFINED --------------- ");
            bootstrapValidator_Utils = o.validationUtils;
        }else {
           // console.log("VALIDATION UTILS UNDEFINED --------------- "+key);
        }

        if(e.hasOwnProperty("rule")){
            validationRule = e.rule;
        }

        // create the HTML element
       /** var text = $("<input/>", {
            "class": o.cssClass,
            "name" : name
        });  **/

        var text = $("<select multiple/>");


        //get Value
        if(o.values!=null){
            value = element_Utils.getElementValue(name, o.values, e);
        }

        // add any multilingual component to the path
        if(e.hasOwnProperty("value")){
            if(e.value.hasOwnProperty("multilingual")){
                if(e.value.multilingual)
                    text.attr("data-lang", o.lang);
            }
        }

      /**  if(e.hasOwnProperty("value")){
            if(e.value.hasOwnProperty("multilingual")){
                if(e.value.multilingual)
                    var langPart =  '.'+o.lang;
                    name = name.replace(langPart,"");
                    text.attr("data-lang", o.lang);
            }
        }  **/

        text.attr("class", o.cssClass);
        text.attr("name", name+'[]');

        text.attr("data-role", "tagsinput");
       // text.attr("data-lang", o.lang);

        //set the type
        text.attr('type', e.type.name);
        //set the id
        text.attr('id', key);

       // text.tagsinput('add', o.lang);

        //set Value
        //if(value !=null){
        // text.val(value);
       // }



        if (e.hasOwnProperty("placeholder")) {
            text.attr('placeholder', e["placeholder"][o.lang]);
        }

        //console.log("validationRule --------------- "+validationRule + " for "+key);
        //console.log("bootstrapValidator_Utils --------------- "+bootstrapValidator_Utils + " for "+key);

        if(validationRule &&  bootstrapValidator_Utils){
            if(bootstrapValidator_Utils.isRequired(validationRule)){
                isRequired = true;
            }
            bootstrapValidator_Utils.setValidationAttributes(text, validationRule, o.lang);
        }

        //create options

        element_Utils.setSelectedValues(text, value, isRequired);

        var containerId = '#'+ o.container + key;
        if(e.hasOwnProperty("fieldSetId"))  {
            containerId = '#'+o.container + e.fieldSetId+'-'+key;
        }

        text.appendTo(containerId);

        callback();

    };

    Fx_ui_Sequence.prototype.getValue = function (e) {
        return $("#" + e.id).tagsinput('items');
        //return $("#" + e.id).val();
    };



    return Fx_ui_Sequence;
});