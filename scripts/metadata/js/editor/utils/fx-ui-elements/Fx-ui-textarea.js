define([
    "jquery",
    "fx-editor/utils/Fx-element-utils"], function ($, Element_Utils) {
     var element_Utils;

    function Fx_ui_TextArea() {
        element_Utils = new Element_Utils();
    }

    Fx_ui_TextArea.prototype.validate = function (e) {
        return true;
    };

    Fx_ui_TextArea.prototype.render = function (e, name, key, o, callback) {
        var validationRule, bootstrapValidator_Utils, value = null;

        if(o.validationUtils != undefined) {
            bootstrapValidator_Utils = o.validationUtils;
        }

        if(e.hasOwnProperty("rule")){
            validationRule = e.rule;
        }

        // add any multilingual component to the path
        if(e.hasOwnProperty("value")){
            if(e.value.hasOwnProperty("multilingual")){
                if(e.value.multilingual)
                    name = name +'.'+o.lang;
            }
        }

        // create the HTML element
        var textarea = $("<textarea/>", {
            "class": o.cssClass,
            "name" : name,
            "cols": "",
            "rows": ""
        });


        //need to check if lang attribute and to set it, so it can be used in serialization later
        if (name.match(o.lang+"$")) {
            textarea.attr('data-multi-lang', o.lang);
        }
        //set the type
        textarea.attr('type', e.type.name);

        //set the id
        textarea.attr('id', key);

        //get Value
        if(o.values!=null){
            var value = element_Utils.getElementValue(name, o.values, e);
            if(value !=null){
                textarea.val(value);
            }
        }



        if(validationRule &&  bootstrapValidator_Utils){
            bootstrapValidator_Utils.setValidationAttributes(textarea, validationRule, o.lang);
        }

        var containerId = '#'+ o.container + key;
        if(e.hasOwnProperty("fieldSetId"))  {
            containerId = '#'+o.container + e.fieldSetId+'-'+key;
        }

        textarea.appendTo(containerId);

        callback();

    };

    Fx_ui_TextArea.prototype.getValue = function (e) {
        return $("#" + e.id).val();
    };


    return Fx_ui_TextArea;
});