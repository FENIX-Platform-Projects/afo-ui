define([
    "require",
    "jquery",
    "fx-editor/utils/Fx-json-utils"
], function (require, $, Json_Utils) {

    var errors = {
            UNKNOWN_TYPE: {EN: "FENIX UI Element Creator: Unknown widget type"},
            ELEMENTS_NOT_JSON: { EN: "FENIX UI Element Creator: Elements JSON not valid"},
            ELEMENTS_NOT_OBJECT: { EN: "FENIX UI Element Creator: Elements JSON is not an object"},
            ELEM_NO_SOURCE: { EN: "FENIX UI Element Creator: select: Missing 'source' property"},
            ELEM_NO_TYPE: { EN: "FENIX UI Element Creator: select: Missing 'source.type' property"},
            ELEM_NO_NAME: { EN: "FENIX UI Element Creator: select: Missing 'source.type.name' property"},
            ELEM_NO_CODELIST: { EN: "FENIX UI Element Creator: select: Missing 'source.type.codeList' property"},
            ELEM_NO_CODELISTVERSION: { EN: "FENIX UI Element Creator: select: Missing 'source.type.codeListVersion' property"},
            ELEM_NO_MULTIPLECHOICE: { EN: "FENIX UI Element Creator: select: Missing 'source.type.multipleChoice' property"},
            ELEM_NO_DATAFIELDS: { EN: "FENIX UI Element Creator: select: Missing 'source.datafields' property"},
            ELEM_NO_DATAFIELDS_CODE_LABEL: { EN: "FENIX UI Element Creator: select: Missing 'source.datafields[{code, label}]' properties"},
            ELEM_NO_DATAROOT: { EN: "FENIX UI Element Creator: select: Missing 'source.dataroot' property"},
            NO_DATES_CONFIG: { EN: "FENIX UI Element Creator: date/period: Missing Dates config "}

        },
    types = {
        FIELDSET: "fieldset",
        CLONEBUTTON: "clonebutton",
        TEXT: "text",
        TEST: "test",
        TEXTAREA: "textarea",
        SELECT: "select",
        DATE: "date",
        PERIOD: "period",
        NUMBER: "number",
        LABEL: "label"
    },
        lang = 'EN',
        valid = true;
    /*
     langs: allowed languages for rendering
     o: component internal options
     v: used to get validation result
     */
    var langs = ["EN", "FR", "ES"], o = {}, elems, json_Utils;

    //helper functions
    function handleError(e) {
        //console.log("HANDLE ERROR called ");
        throw new Error(errors[e][lang]);
        valid = false;
    }

    //Validation fns
    function inputValidation() {

        //JSON Source
        if(!json_Utils.isJson(o.elements)){
            handleError("ELEMENTS_NOT_JSON");
        }

        //JSON Source is Object
        if(!json_Utils.isJsonObject(o.elements)){
              handleError("ELEMENTS_NOT_OBJECT");
        }

        //UI valid lang
         if (o.lang && langs.indexOf(o.lang.toUpperCase()) > -1) {
            lang = o.lang.toUpperCase();
        } else {
            valid = false;
        }

          return valid;
    }


    function validateElement(e, widget, opts) {
      //Component Type
        if (widget.validate) {
          valid = widget.validate(e, opts);
        }

        return valid;
    }


    function renderElement(widget, element, ind, callback){
       if (validateElement(element, widget, o)) {
            var elName = createElementName(element, element.name, o);
            widget.render(element, elName, element.name, o, callback);
       }
    }

    function createElementName(element, ind, opts) {
        var name = ind;

        // parent-path is not null if the element is to be rendered within a fieldset or has been mapped explicitly to a path (via json dataentry-mapping config)
        if(element.hasOwnProperty("parent-path")){
            if(element["parent-path"].hasOwnProperty("mapped"))  {
                if(element["parent-path"].mapped){
                    // mapped explicity
                    name = element["parent-path"].path;
                } else {
                    //fieldset
                    // the name of the element should be added
                    name = element["parent-path"].path + "."+name;
                }
            }
        }

        // add any Object related component to the path
        //e.g. metadataLanguage, would be mapped to metadataLanguage.ObjectCodeList.codes, based on the fact that it has an type.object property = ObjectCodeList
        if(element.hasOwnProperty("source")){
            if(element.source.hasOwnProperty("type")){
                if(element.source.type.hasOwnProperty("object")){
                    if(opts.objMapping != undefined) {
                        var objType =  element.source.type["object"];
                        if(opts.objMapping.hasOwnProperty(objType)){
                            if(opts.objMapping[objType].hasOwnProperty("path")){
                                    name = name + "."+ opts.objMapping[objType]['path'];
                            }
                        }
                    }
                }
             }
        }
        // add any multilingual component to the path
      /**  if(element.hasOwnProperty("value")){
            if(element.value.hasOwnProperty("multilingual")){
                if(element.value.multilingual)
                    name = name +'.'+o.lang;
            }
        }  **/

        return name;
    }


    //Executes and tracks when functions (fn, fn2) are complete, at which point the callback function is returned
    function asyncFunctionsTracker(obj, fn, fn2, callback) {
        var completed = 0;
        if(Object.keys(obj).length === 0) {
            callback(); // done immediately
        }
        var len = Object.keys(obj).length;
        $.each(obj, function (ind, element) {
           // alert(ind+ '##### widgetCreator');
            //console.log(ind+ '##### widgetCreator = '+ element);
           // console.log(element);


            var widgetCreator = "fx-editor/utils/fx-ui-elements/Fx-ui-" + element.type.name;

           // console.log("=================== widgetCreator = "+widgetCreator);
            //console.log(ind+ '##### widgetCreator = '+widgetCreator);
            if(element.type.name != types.FIELDSET && element.type.name != types.LABEL){
               // console.log("=================== widgetCreator IN "+element.type.name);
           fn([widgetCreator], function(Widget) {
                 // console.log("==================="+widgetCreator + ' | '+element.type.name);

                    if(typeof(Widget) != 'undefined'){
                        var widget = new Widget();
                      //  console.log("=================== WIDGET DEFINED "+ element.type.name);
                    fn2(widget, element, ind, function() {
                        completed++;
                        if(completed === Object.keys(obj).length) {
                          //  console.log("=================== CALLBACK FN2 CALLED "+ element.type.name);
                            callback();
                        }
                    })
                    } else {
                      // console.log("=================== &&&&&&& widget UNDEFINED "+element.type.name);
                        // In IE, if the file is not there, the Widget is Undefined
                        // handleError("UNKNOWN_TYPE");
                       // console.log("ERROR  for "+ind);
                        completed++;
                        if(completed === Object.keys(obj).length) {
                           // console.log("=================== &&&&&&& CALLBACK FN2 CALLED "+ element.type.name);
                            callback();
                        }
                    }
                },
                function (err){
                    // handleError("UNKNOWN_TYPE");
                   // console.log("ERROR  for "+element.type.name);
                    completed++;
                    if(completed === Object.keys(obj).length) {
                        callback();
                    }
                });
            } else {
              //  console.log("=================== &&&&&& widgetCreator NOT IN "+element.type.name);
                completed++;
                if(completed === Object.keys(obj).length) {
                    callback();
                }
            }
        });

    }

    //Rendering
 //   function createElement(e, name, container, widget) {

       /** var div, label, c;

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
        }   **/





     //   widget.render(e, name, container, o);

   // }

    //Public Component
    function Fx_Ui_Element_Creator() {
        json_Utils = new Json_Utils();
    }



   /** Fx_Ui_Element_Creator.prototype.render1 = function (options, callback) {
         var self = this;
        $.extend(o, options);

      if (inputValidation()) {

        elems =  o.elements;

      //  $.each(elems, function (i, elementArray) {
          //  console.log("i = "+ i + " : "+elementArray);

          //$(body).on
        console.log("Object.keys(elems).size = "+Object.keys(elems).length);

         var counter = 0;
         var limit = Object.keys(elems).length;

          $.each(elems, function (ind, element) {
           // $.each(elementArray, function (ind, element) {
               console.log("ind = "+ ind + " : "+element);

                 var widgetCreator = "fx-editor/utils/fx-ui-elements/Fx-ui-" + element.type;
                 require([widgetCreator], function (Widget) {
                         valid = true;
                        var widget = new Widget();

                        if (validateElement(element, widget)) {
                            createElement(element, ind, o.container, widget);
                           counter++;
                        }

                    }, function (err) {
                         counter++;
                        handleError("UNKNOWN_TYPE");
                    });



                 console.log('counter '+ counter + ' limit '+ limit);
                 if(counter == limit)  {
                     return true; // $(body).trigger();
                 }
            }

         );


        // });
      }
    };    **/




    Fx_Ui_Element_Creator.prototype.render = function (options, callback) {
        var self = this;
        $.extend(o, options);

        if (inputValidation()) {

            elems =  o.elements;
            //pass function names to be executed by the tracker
            //on completion the callback function is called
            asyncFunctionsTracker(elems, require, renderElement, function(){
                //console.log("Async done ... before call callback!!!");
                callback.call();
            });
        }
    };



    Fx_Ui_Element_Creator.prototype.getTypes = function () {
       return types;
    };

    Fx_Ui_Element_Creator.prototype.init = function () { };

    //Public API
    return Fx_Ui_Element_Creator;

});