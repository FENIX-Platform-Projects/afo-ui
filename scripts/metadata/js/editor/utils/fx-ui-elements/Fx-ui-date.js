define([
    "jquery",  "fx-editor/utils/Fx-date-utils", "fx-editor/utils/Fx-element-utils"], function ($, Date_Utils, Element_Utils) {

    var date_Utils, dateFormat, element_Utils;

    function Fx_ui_Date() {
        date_Utils = new Date_Utils();
        element_Utils = new Element_Utils();
    }

    Fx_ui_Date.prototype.validate = function (e) {
        return true;
    };

    Fx_ui_Date.prototype.render = function (e, name, key, o, callback) {
        var validationRule, bootstrapValidator_Utils, self = this, value = null;

        var fromFormat = date_Utils.getFormat(o.datesConfig, date_Utils.getDateType(), "db");
        var toFormat = date_Utils.getFormat(o.datesConfig, date_Utils.getDateType(), "gui");

         //console.log("fromFormat = "+fromFormat);
       // console.log("toFormat = "+toFormat);

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
        var text = $("<input/>", {
            "class": o.cssClass,
            "name" : name
        });

        //set the type
        text.attr('type', 'text');
        //set the id
        text.attr('id', key);

        //set Value
        if(o.values!=null){
            value = element_Utils.getElementValue(name, o.values, e);
        }


        if(value !=null && value!== ""){
             var fDate = date_Utils.formatDate(value, toFormat);
            //var fDate = date_Utils.convertFormat(value, fromFormat, toFormat);
            text.val(fDate);
        } else {
            var today = new Date();
            var fDate = date_Utils.formatDate(today, toFormat);
            text.val(fDate);
        }

        //Date Format
            text.attr('data-date-format', toFormat);
            text.attr('data-date-db-format', fromFormat);


        if (e.hasOwnProperty("placeholder")) {
            text.attr('placeholder', e["placeholder"][o.lang]);
        }

        if(validationRule &&  bootstrapValidator_Utils){
            bootstrapValidator_Utils.setValidationAttributes(text, validationRule, o.lang);
        }

        //Date Format
        text.attr('data-date-format', dateFormat);

        //Prepend = Add as first child item
        //console.log("============ DATE: container is #"+ o.container+key);

        var containerId = '#'+ o.container + key;
        if(e.hasOwnProperty("fieldSetId"))  {
            containerId = '#'+o.container + e.fieldSetId+'-'+key;
        }

        $(containerId).prepend(text);

        callback();

    };

    Fx_ui_Date.prototype.getValue = function (e) {
        return $("#" + e.id).val();
    };


    return Fx_ui_Date;
});