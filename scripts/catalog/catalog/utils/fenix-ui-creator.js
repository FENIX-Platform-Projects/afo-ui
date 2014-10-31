/*
 * TODO:
 * Set lang dynamically
 *
 * Review the validation method. Every ComponentType should have an array of validation fns in order
 * to do not duplicate the same validation fns
 * */

define([
    "require",
    "jquery"
], function (require, $) {

    var errors = {
            UNKNOWN_TYPE: {EN: "FENIX UI Creator: Unknown widget type"},
            CONTAINER_NOT_FOUND: { EN: "FENIX UI Creator: Impossible to find container"},
            ELEMENTS_NOT_JSON: { EN: "FENIX UI Creator: Elements JSON file not valid"},
            ELEMENTS_NOT_ARRAY: { EN: "FENIX UI Creator: Elements JSON file not an array"},
            ELEM_NOT_ID: { EN: "FENIX UI Creator: Specify Id for each UI element"},
            ELEM_NOT_COMP: { EN: "FENIX UI Creator: Specify Component for each UI element"},
            ELEM_COMP_TYPE: { EN: "FENIX UI Creator: Component Type not valid"},
            ELEM_NOT_SOURCE: { EN: "FENIX UI Creator: Specify source for each Component"},
            ELEM_NOT_DATAFIELDS: { EN: "FENIX UI Creator: Specify Datafields for each Component"},
            VALUES_NOT_READY: { EN: "FENIX UI Creator: Values Not Ready"},
            VALIDATORS_NOT_VALID: { EN: "FENIX UI Creator: Validators not valid"},
            DATE_FORMAT_ERROR: { EN: "FENIX UI Creator: Date format not valid"},
            CONNECTION_FAIL: { EN: "FENIX UI Creator: Connection problems"}
        },
        lang = 'EN',
        valid;
    /*
     langs: allowed languages for rendering
     o: component internal options
     v: used to get validation result
     */
    var langs = ["EN", "FR", "ES"], o = {}, elems, v;

    //helper functions
    function handleError(e) {
        throw new Error(errors[e][lang]);
        valid = false;
    }

    //Validation fns
    function inputValidation() {

        //Existing container
        if (!document.querySelector(o.container)) {
            handleError("CONTAINER_NOT_FOUND");
        }

        //valid JSON Source
        try {
            JSON.parse(o.elements);
        } catch (e) {
            handleError("ELEMENTS_NOT_JSON");
        }

        //Source as Array
        if (JSON.parse(o.elements).length === undefined) {
            handleError("ELEMENTS_NOT_ARRAY");
        }

        //UI valid lang
        if (o.lang && langs.indexOf(o.lang.toUpperCase()) > 0) {
            lang = o.lang.toUpperCase();
        }

        return valid;
    }

    function validateElement(e, widget) {

        //Valid component
        if (!e.hasOwnProperty("id")) {
            handleError("ELEM_NOT_ID");
        }

        //Valid component
        if (!e.hasOwnProperty("component")) {
            handleError("ELEM_NOT_COMP");
        }
        //Component Type
        if (widget.validate) {
            valid = widget.validate(e.component);
        }

        return valid;
    }

    //Rendering fns
    function createElement(e, container, widget) {

        var div, label, c;

        c = document.getElementById(e.container);

        if (!c) {

            c = document.createElement("DIV");
            c.setAttribute("id", e.container);
            if (e.cssclass) {
                c.setAttribute("class", e.cssclass);
            }

        }

        if (e.label[lang] && o.labels) {

            label = document.createElement("label");
            label.setAttribute("for", e.id);
            label.innerHTML = e.label[lang];
            c.appendChild(label);

            div = document.createElement("DIV");
            div.setAttribute("id", e.id);
            c.appendChild(div);

            document.querySelector(container).appendChild(c);

        } else {

            div = document.createElement("DIV");
            if (e.cssclass) {

                div.setAttribute("id", e.id);
                div.setAttribute("class", e.cssclass);
            }

            document.querySelector(container).appendChild(div);
        }

        widget.render(e, div);

    }

    //Public Component
    function Fenix_ui_creator() {
    }

    Fenix_ui_creator.prototype.getValidation = function (values) {

        var result = {}, propertyErrors, property, validatorName, e;

        if (o.validators) {
            if (typeof o.validators !== "object") {
                handleError("VALIDATORS_NOT_VALID");
            }
            else {

                //Loop over validations
                for (property in o.validators) {

                    propertyErrors = { errors: {} };

                    if (o.validators.hasOwnProperty(property)) {

                        for (validatorName in o.validators[property]) {

                            if (o.validators[property].hasOwnProperty(validatorName)) {

                                e = o.validators[property][validatorName](values[property]);

                                if (e !== true) {
                                    propertyErrors.errors[validatorName] = e;
                                }

                            }
                        }
                    }

                    if (Object.keys(propertyErrors.errors).length > 0) {

                        propertyErrors.value = values[property];
                        result[property] = propertyErrors;

                    }
                }
            }
        }

        return Object.keys(result).length === 0 ? null : result;
    };

    //Get Values
    Fenix_ui_creator.prototype.getValues = function (validate, externalElements) {

        var result = {}, i, self = this;

        if (externalElements) {

            $(externalElements).each(function (index, element) {

                //Synch call of require
                try {
                    var module = require("fx-cat-br/utils/fx-ui-w/Fx-ui-w-" + element.type),
                        widget = new module();
                    result[element.type] = widget.getValue(element);

                } catch (e) {
                    console.log(e)
                }


            });

        } else {
            //Looping on initial elements
            if (elems === undefined) {
                handleError("VALUES_NOT_READY");
            }


            $(elems).each(function (index, element) {

                //Synch call of require
                try {
                    var module = require("fx-cat-br/utils/fx-ui-w/Fx-ui-w-" + element.type),
                        widget = new module();

                    result[element.id] = widget.getValue(element);
                } catch (e) {
                    console.log(e)
                }

            });
        }

        v = validate === undefined || validate === false ? null : self.getValidation(result);
        if (v) {
            throw new Error(v);
        }

        return result;
    };

    Fenix_ui_creator.prototype.validate = function () {
        return this.getValidation(this.getValues());
    };

    Fenix_ui_creator.prototype.render = function (options) {

        var i;

        $.extend(o, options);
        valid = true;

        if (inputValidation()) {

            elems = JSON.parse(o.elements);

            $(elems).each(function (index, element) {

                var widgetCreator = "fx-cat-br/utils/fx-ui-w/Fx-ui-w-" + element.type;

                require([widgetCreator], function (Widget) {
                    valid = true;
                    var widget = new Widget();

                    if (validateElement(element, widget)) {
                        createElement(element, o.container, widget);
                    }

                }, function (err) {
                    handleError("UNKNOWN_TYPE");
                });

            });

        }
    };

    Fenix_ui_creator.prototype.init = function () { };

    //Public API
    return Fenix_ui_creator;

});