define(["jquery"], function () {
    var o = { },
        validationTypes = {
            IS_REQUIRED: "required",
            IS_CONDITIONAL: "conditional",
            IS_REQUIRED_CONDITIONAL: "required-conditional"
        },
        feedbackIconTypes = {
            REQUIRED: "required",
            VALID: "valid",
            INVALID: "invalid",
            VALIDATING: "validating"
        },
        defaultOptions = {
        css_classes: {
            ICON_FAMILY: "glyphicon",
            ICON_REQUIRED: "glyphicon-asterisk",
            ICON_VALID: "glyphicon-ok",
            ICON_INVALID: "glyphicon-remove",
            ICON_VALIDATING: "glyphicon-refresh"
        }
    };

    function Fx_BootstrapValidator_Utils() {
    }

    Fx_BootstrapValidator_Utils.prototype.init = function (options) {
        //Merge options
        $.extend(o, defaultOptions);
        $.extend(o, options);
    };

    Fx_BootstrapValidator_Utils.prototype.setValidationAttributes = function (element, rule, lang){
        //Set Bootstrap Validator attributes on the element
        if(rule.hasOwnProperty("validators")){
            for(var type in rule.validators){
                var typeobj = rule.validators[type];

                element.attr("data-bv-"+type.toLowerCase(), true);

                if (typeobj.hasOwnProperty("message")) {
                    element.attr("data-bv-"+type.toLowerCase()+"-message", typeobj.message[lang]);
                }
            }
        }
        // set dependant values
        if(rule.hasOwnProperty("find")){
            if(rule["find"].hasOwnProperty("values")){

                for(var k=0; k < rule["find"].values.length; k++){
                    //set and find value
                    var itm = rule["find"].values[k];

                    if(itm.hasOwnProperty("value")){
                        element.attr("fnx-dependant-value-"+itm["name"], itm["value"]);
                    }

                }
            }


            }



    };

    Fx_BootstrapValidator_Utils.prototype.isRequired = function (rule){
        //Check if field is required
        if(rule.hasOwnProperty("type")){
            if(rule.type == validationTypes.IS_REQUIRED)
                return true;
        }

        return false;
    };

    Fx_BootstrapValidator_Utils.prototype.getTypes = function (){
        return validationTypes;
    };

    Fx_BootstrapValidator_Utils.prototype.addValidationIcon = function (data) {
        //Display Required Icons onLoad
        // data.bv      --> The BootstrapValidator instance
        // data.field   --> The field name
        // data.element --> The field element
        var $parent    = data.element.parents('.form-group'),
            $icon      = $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]'),
            options    = data.bv.getOptions(),                      // Entire options
            validators = data.bv.getOptions(data.field).validators; // The field validators

        if (validators.notEmpty && options.feedbackIcons && options.feedbackIcons.required) {
            // The field uses notEmpty validator
            // Add required icon
            $icon.addClass(options.feedbackIcons.required).show();
        }
    };

    Fx_BootstrapValidator_Utils.prototype.updateValidationIcon = function (data) {
         // Remove the required icon when the field updates its status
        var $parent    = data.element.parents('.form-group'),
            $icon      = $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]'),
            options    = data.bv.getOptions(),                      // Entire options
            validators = data.bv.getOptions(data.field).validators; // The field validators

        if (validators.notEmpty && options.feedbackIcons && options.feedbackIcons.required) {
            $icon.removeClass(options.feedbackIcons.required).addClass(o.css_classes.ICON_FAMILY);
        }
    };

    Fx_BootstrapValidator_Utils.prototype.getFeedbackIconCss = function (type) {
        var self = this;
        var iconTypes = self.getFeedbackIconTypes();
        var cssPath = o.css_classes.ICON_FAMILY;
        switch (type) {
            case iconTypes.REQUIRED:
                cssPath =  cssPath + ' '+ o.css_classes.ICON_REQUIRED;
                break;
            case iconTypes.VALID:
                cssPath =  cssPath + ' '+ o.css_classes.ICON_VALID;
                break;
            case iconTypes.INVALID:
                cssPath =  cssPath + ' '+ o.css_classes.ICON_INVALID;
                break;
            case iconTypes.VALIDATING:
                cssPath =  cssPath + ' '+ o.css_classes.ICON_VALIDATING;
                break;
        }

        return  cssPath;

    };

    Fx_BootstrapValidator_Utils.prototype.getFeedbackIcons= function () {
        var feedbackIcons = {
            required: o.css_classes.ICON_FAMILY + ' '+o.css_classes.ICON_REQUIRED,
            valid: o.css_classes.ICON_FAMILY + ' '+o.css_classes.ICON_VALID,
            invalid: o.css_classes.ICON_FAMILY + ' '+o.css_classes.ICON_INVALID,
            validating: o.css_classes.ICON_FAMILY + ' '+o.css_classes.ICON_VALIDATING
        }

        return feedbackIcons;
    };

    Fx_BootstrapValidator_Utils.prototype.getFeedbackIconTypes= function () {
        return feedbackIconTypes;
    };


    return Fx_BootstrapValidator_Utils;

});