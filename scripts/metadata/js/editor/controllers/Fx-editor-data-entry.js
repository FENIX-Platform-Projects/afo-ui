/*global define */

define([
    "jquery",
    "fx-editor/plugins/Fx-editor-bridge-dataentry-plugin",
    "fx-editor/widgets/Fx-widgets-commons",
    "fx-editor/widgets/Fx-widgets-storage",
    "fx-editor/utils/Fx-json-utils",
    "fx-editor/utils/Fx-lang-utils",
    'nprogress',
    'pnotify',
    'pnotify.nonblock'
], function ($, Plugin, W_Commons, W_Storage, Json_Utils, LangUtils, NProgress, PNotify) {

    var w_Commons, w_Storage, ajaxConf, mappingConf, guiConf, validationConf, datesConf, resourceType, resourceTypeModule, source, cache = {}, json_Utils, lang_Utils,
        o = {},
        defaultOptions = {
            name : 'fx-editor-dataentry',
            resourceType: "dataset",
            config: {
                ajaxEventCalls: "conf/json/fx-editor-ajax-config.json"
            },
            source: null,
            widget: {
                lang: 'EN'
            },
            saveTypes: {
                OVERWRITE: "overwrite",
                CREATE: "create"
            },
            events: {
                SELECT: 'fx.editor.menu.select',
                INIT_STORAGE: 'fx.editor.init_storage',
                NEW_METADATA_SUCCESS: "fx.editor.saved",
                OVERWRITE_METADATA_SUCCESS: "fx.editor.overwritten",
                SUBMIT : "fx.editor.form.submit",
                CHECK_FORM_CHANGED: "fx.editor.module.form_check",
                SAVE : "fx.editor.save",
                LOAD: "fx.editor.load",
                OVERWRITE : "fx.editor.overwrite",
                REMOVE: "fx.editor.module.remove",
                FIND: "fx.editor.module.find",
                EMPTY_ROOT_ENTITY:  "fx.editor.module.empty_root",
                INVALID: 'fx.editor.form.invalid'
            }
        };

    var selectors = {
        CONTAINER : ".fx-editor-data-entry-container",
        TOGGLE_BTN: ".fx-editor-header-btn-expand"
    };

    function DataEntryController() {
        //Merge options
        $.extend(o, defaultOptions);

        this.publishFxEditorBridgePlugin();

        w_Commons = new W_Commons();
        w_Storage = new W_Storage();
        json_Utils = new Json_Utils();
        lang_Utils = new LangUtils();

    }

    //(injected)
    DataEntryController.prototype.menu = undefined;

    //(injected)
    DataEntryController.prototype.form = undefined;

    //(injected)
    DataEntryController.prototype.progress = undefined;


    DataEntryController.prototype.init = function (options) {
        $.extend(o, options);
        var self = this;
        //console.log("------------ DATA ENTRY CONTROLLER INIT () options = ");
       // console.log(o);

        ajaxConf = o.config.ajaxEventCalls;
        mappingConf = o.config.jsonMapping;
        guiConf = o.config.gui;
        validationConf = o.config.validation;
        datesConf = o.config.dates;
        resourceType = o.resourceType;
        source = o.source;



        //cache and modify GUI Conf based on resourceType
        //resourceRepresentationType


        //console.log("++++++++++++++++ init o.config.ajaxEventCalls "+o.config.ajaxEventCalls);
        //console.log("++++++++++++++++ init o.config.mapping "+o.config.jsonMapping);
        //console.log("++++++++++++++++ init o.config.gui "+o.config.gui);



      // console.log("++++++++++++++++ init source "+source);
      // console.log(source);

        // SET SAVE ACTION: Default is Create New
        cache.saveAction = {type: o.saveTypes.CREATE};
        cache.saveAjax = {};

    };

    DataEntryController.prototype.prepareGuiConf = function () {
        //console.log("------------ DATA ENTRY CONTROLLER prepareGuiConf () resourceType = "+  resourceType);
       // console.log("------------ DATA ENTRY CONTROLLER prepareGuiConf () guiConf = "+  cache.jsonGuiConf);

        //disable Resource Representation Type
        // set the default resourceRepresentation value
        var pth = json_Utils.findParentPathForProperty(cache.jsonGuiConf, "resourceRepresentationType");

        if(pth){
            if(pth!=null) {
                var parent = json_Utils.findObjectByPath(cache.jsonGuiConf, pth);
                if(parent != undefined){
                     if(parent["resourceRepresentationType"].hasOwnProperty("source")){
                        if(parent["resourceRepresentationType"].source.hasOwnProperty("datafields")){
                          parent["resourceRepresentationType"].source.datafields["defaultCode"] =  resourceType;  // reset the defaultCode
                          parent["resourceRepresentationType"].type["enabled"] = false; // disable the select
                        }
                    }
                }
              }

            var parentPth = pth.split(".");
            var parentObj = json_Utils.findObjectByPath(cache.jsonGuiConf, parentPth[0]);
            if(parentObj != undefined){
                resourceTypeModule = parentObj["module"];
            }
        }

        // Loop on the panels and sub-panels only and remove
        // un-necessary & form will hide the properties


    };

    DataEntryController.prototype.renderComponents = function () {
        var self = this;
        NProgress.start();


        //Cache json configuration files: Validation and Json Mapping
       $.when($.getJSON(ajaxConf), $.getJSON(mappingConf),  $.getJSON(guiConf), $.getJSON(validationConf),  $.getJSON(datesConf))
           .done(function( ajaxJsn, mappingJsn, guiJsn, validationJsn, datesJsn) {
            cache.jsonAjax = ajaxJsn[0];
            cache.jsonMapping = mappingJsn[0];
            cache.jsonGuiConf = guiJsn[0];
            cache.jsonValidationConf = validationJsn[0];
            cache.jsonDatesConf = datesJsn[0];

            cache.rootEntity = getRootEntity();
            cache.rootLabel = getRootLabel(cache.rootEntity);

            self.prepareGuiConf();




          //  console.log("MAPPING CACHE ....");
          //  console.log( cache.jsonMapping);
          //  console.log("AJAX CACHE ....");
          //  console.log( cache.jsonAjax);

            //self.menu.render();
            self.form.render({config: {cache: {mapping: cache.jsonMapping, validation: cache.jsonValidationConf,  dates: cache.jsonDatesConf}}});

           //HIDE PROGRESS FOR NOW
          //  self.progress.render();

               //TEST

                self.menu.render({config: {cache: {gui: cache.jsonGuiConf, validation: cache.jsonValidationConf}}}, function(panels){

                  //  if(cache.jsonAjax.hasOwnProperty("onSave")){
                        if(cache.jsonAjax.hasOwnProperty("create")){
                            cache.saveAjax[o.saveTypes.CREATE] = {url: cache.jsonAjax.create.url, type: cache.jsonAjax.create.type, response: cache.jsonAjax.create.response};
                        }
                        if(cache.jsonAjax.hasOwnProperty("overwrite")){
                            cache.saveAjax[o.saveTypes.OVERWRITE] = {url: cache.jsonAjax.overwrite.url, type: cache.jsonAjax.overwrite.type, request: cache.jsonAjax.overwrite.request};
                        }
                   // }

                    if (source!=null) {
                         var keys =  w_Storage.getAllKeys();
                         w_Commons.raiseCustomEvent(document.body, o.events.LOAD, {url:source.url, type: source.type, mapping: cache.jsonMapping, keys: keys, call: "DATA-ENTRY: LOAD"});
                        //self.parseData();
                        //console.log("hasproperty "+cache.jsonAjax["onLoad"]);
                    } else {
                        self.menu.setDefault();
                    }

                   /** if (cache.jsonAjax.hasOwnProperty("onLoad")) {
                        var keys =  w_Storage.getAllKeys();
                        //console.log("========================== renderComponents: onLoad ---- type = "+cache.jsonAjax.onLoad.type);
                        w_Commons.raiseCustomEvent(document.body, o.events.LOAD, {url: cache.jsonAjax.onLoad.url, type: cache.jsonAjax.onLoad.type, mapping: cache.jsonMapping, keys: keys, call: "DATA-ENTRY: LOAD"});
                        //self.parseData();
                        //console.log("hasproperty "+cache.jsonAjax["onLoad"]);
                    } else {
                        self.menu.setDefault();
                    }   **/

                    NProgress.done();
                });

             /**   $.when(self.menu.render())
                    .done(function(panels) {
                        console.log("========================== renderComponents: ---- MENU RENDER DONE "+panels);

                        self.form.render();

                        if (cache.jsonAjax.hasOwnProperty("onLoad")) {
                            var keys =  w_Storage.getAllKeys();
                            console.log("========================== renderComponents: onLoad ---- type = "+cache.jsonAjax.onLoad.type);
                            onLoad = true;
                            w_Commons.raiseCustomEvent(document.body, "load.editor.fx", {url: cache.jsonAjax.onLoad.url, type: cache.jsonAjax.onLoad.type, mapping: cache.jsonMapping, keys: keys, call: "DATA-ENTRY: LOAD"});
                            //self.parseData();
                            //console.log("hasproperty "+cache.jsonAjax["onLoad"]);
                        }
                    });
                **/


            //self.menu.render();
           // self.form.render();
        });


     };

    DataEntryController.prototype.initEventListeners = function () {

        var self = this;


        document.body.addEventListener(o.events.SELECT, function (e) {
            //console.log("----------------- DATA ENTRY (SELECT) "+e.detail.module);
            var moduleId = e.detail.module.module;
            var module = e.detail.module;
            var gui = e.detail.gui;

            self.createForm(moduleId, module, gui);

        }, false);

      /**  document.body.addEventListener(o.events.SELECT, function (e) {
          // console.log("----------------- DATA ENTRY (SELECT) "+e.detail.module);
             var keys = w_Storage.getAllKeys();

          //  console.log("============= STORAGE CHECK START ====== keys = "+keys.length);
          //  for(var i=0; i<keys.length; i++){
            //    console.log("============= STORAGE KEY = "+keys[i]);
           //  }
           // console.log("============= STORAGE CHECK END ======");



           var moduleId = e.detail.module.module;

          // console.log("----------------- DATA ENTRY (SELECT) "+moduleId);
            if(w_Storage.getItem(moduleId)){
                var jsn = w_Storage.getItem(moduleId)[moduleId];
                var values = JSON.parse(jsn);
                //console.log("========= JSN STRING PARSE +++++++++++++++++++")
               // console.log(values)

                self.form.createModuleForm(e.detail.module, values);
            } else {
                self.form.createModuleForm(e.detail.module);
            }


           // console.log("----------------- DATA ENTRY (SELECT) PARSE METADATA CALL ==================== ");
            //////////////////////////////////////////////////////
          //  self.parseMetadata();

        }, false);   **/

        document.body.addEventListener(o.events.INIT_STORAGE, function (e) {

            if(source === null && resourceTypeModule!== undefined && e.detail.id === resourceTypeModule){
               var resourceTypeModuleValues = {};
                resourceTypeModuleValues["resourceRepresentationType"] = resourceType;
                resourceTypeModuleValues["isRoot"] = false;
                w_Storage.setItem(e.detail.id, resourceTypeModuleValues);
            }
            else {
                w_Storage.setItem(e.detail.id, "");
            }

            }, false);


        document.body.addEventListener(o.events.CHECK_FORM_CHANGED, function (e) {
          //  if (this.form.serialize() !=  w_Storage.getItem(this.form.getCurrentModule())) {
                // Something changed
           // }

        }, false);


        document.body.addEventListener(o.events.SUBMIT, function (e) {
           var form = e.detail.form,
               module = e.detail.module,
               moduleLabel = e.detail.moduleLabel,
               url,
               type,
               event;

            self.cacheFormValues();



            //Get the urls based on the cache.saveAction type
            if(cache.saveAction.type == o.saveTypes.CREATE){
                url = cache.saveAjax[o.saveTypes.CREATE].url;
                type = cache.saveAjax[o.saveTypes.CREATE].type;
                event = o.events.SAVE;

            }
            else if(cache.saveAction.type  == o.saveTypes.OVERWRITE){
                url = cache.saveAjax[o.saveTypes.OVERWRITE].url;
                type = cache.saveAjax[o.saveTypes.OVERWRITE].type;
                event = o.events.OVERWRITE;
            }

            console.log("----------------- DATA ENTRY (SAVE) "+cache.saveAction.type);


            if(cache.rootEntity !=undefined)   {
                var rootValues =  w_Storage.getItem(cache.rootEntity);

                if(rootValues != ""){
                    w_Commons.raiseCustomEvent(form, event,  {url: url, type: type,  mapping: cache.jsonMapping, call: "DATA-ENTRY: SAVE"});
                } else {
                    w_Commons.raiseCustomEvent(document.body, o.events.EMPTY_ROOT_ENTITY,  {moduleLabel: moduleLabel, root: cache.rootLabel});
                }
            }

         }, false);

        document.body.addEventListener(o.events.EMPTY_ROOT_ENTITY, function (e) {

            var rootEntity = e.detail.root;
            var moduleSaved = e.detail.moduleLabel;

            var noRootNotice = lang_Utils.noRootNotice({
                rootModule: rootEntity
            });

            var noRootError = lang_Utils.noRootError({
                currentModule: moduleSaved,
                rootModule: rootEntity
            });

            new PNotify({
                title:  noRootNotice,
                text: noRootError,
                type: 'error',
                nonblock: {
                    nonblock: true
                }
            });
        }, false);


        document.body.addEventListener(o.events.INVALID, function (e) {
          var errors = e.detail.errors;

            var text = lang_Utils.requiredFieldsError({});

           var errorList = [];
           text +=  '</br>';
           for(var m = 0; m < errors.length; m++)            {

                text += $(errors[m]).attr('id');

                if(m < errors.length -1){
                    text += '</br>'
                }
            }



            new PNotify({
                title:  lang_Utils.requiredFieldsNotice,
                text: text,
                type: 'error',
                nonblock: {
                    nonblock: true
                }
            });
        }, false);

        document.body.addEventListener(o.events.NEW_METADATA_SUCCESS, function (e) {
            var text = lang_Utils.newMetadataSuccess({});

            new PNotify({
                title:  lang_Utils.updateNotice,
                text: text,
                type: 'success',
                nonblock: {
                    nonblock: true
                }
            });

            // RE-SET SAVE ACTION: OVERWRITE
            cache.saveAction = {type: o.saveTypes.OVERWRITE};

        }, false);



        document.body.addEventListener(o.events.OVERWRITE_METADATA_SUCCESS, function (e) {

            var text = lang_Utils.successfulUpdate({});

            new PNotify({
                title:  lang_Utils.updateNotice,
                text: text,
                type: 'success',
                nonblock: {
                    nonblock: true
                }
            });

            // SET SAVE ACTION: Default OVERWRITE
            cache.saveAction = {type: o.saveTypes.OVERWRITE};

        }, false);



        document.body.addEventListener(o.events.FIND, function (e) {
            //console.log("----------------- DATA ENTRY (FIND) ");
            var path = e.detail.path;

            var formItemValues = w_Storage.getItem(path);

            if(formItemValues != ""){

            }


        }, false);



        document.body.addEventListener(o.events.LOAD, function (e) {
            //cache data
        }, false);


     /**   document.body.addEventListener(o.events.SAVE, function (e) {
            var form = e.detail.form,
                module = e.detail.module;

            //check the
            w_Commons.setCacheModule(module, form);
            w_Commons.raiseCustomEvent(form, "submit.editor.fx", {});

        }, false);      **/

        document.body.addEventListener(o.events.REMOVE, function (e) {
            self.menu.activate(e.detail.type);
            self.form.removeItem(e.detail.module);
        }, false);

        $(selectors.TOGGLE_BTN).on('click', {self: this},function(e){
          //  console.log(' $(selectors.CONTAINER).is(":visible") = '+$(selectors.CONTAINER).is(":visible"));
            if ( $(selectors.CONTAINER).is(":visible") ) {
                e.data.self.collapseFilter();
            } else {
                e.data.self.openFilter();
            }
        })
    };


    DataEntryController.prototype.createForm = function (moduleId, module, gui) {
   // var moduleId = e.detail.module.module;

   // console.log("----------------- DATA ENTRY (SELECT): createForm "+moduleId);
        if(w_Storage.getItem(moduleId)){
            //var jsn = w_Storage.getItem(moduleId)[moduleId];
            var jsn = w_Storage.getItem(moduleId);
           // console.log("----------------- DATA ENTRY (SELECT) "+jsn);
            // var values = JSON.parse(jsn);
            var values = jsn;
         //  console.log("========= JSN SELECT PARSE +++++++++++++++++++")
         //  console.log(values)

            // needs to be adjusted for when there is more than 1 item in the array
           if($.isArray(jsn)) {
               values = jsn[0];
           }

            //console.log(values);
           //console.log(values.length);


            if(values !== "")  {
                if(typeof values === 'object' && Object.keys(values).length> 0)
                    this.form.createModuleForm(module, w_Storage, gui, values);
                 else
                    this.form.createModuleForm(module, w_Storage, gui, null);
            }
             else
               this.form.createModuleForm(module, w_Storage, gui, null);
            }
        else {
            this.form.createModuleForm(module, w_Storage, gui, null);
        }
    };

    DataEntryController.prototype.preValidation = function () {

        if (!this.menu) {
            throw new Error("DataEntryController: INVALID MENU ITEM.")
        }
        if (!this.form) {
            throw new Error("DataEntryController: INVALID FORM ITEM.")
        }


    };

    DataEntryController.prototype.render = function () {
        //console.log("------------ (2) DATA ENTRY CONTROLLER (i.e. FILTER) RENDER COMPONENTS() ");
        this.preValidation();
        this.initEventListeners();

        this.renderComponents();

    };

    DataEntryController.prototype.publishFxEditorBridgePlugin = function () {
        console.log("------------ (2) DATA ENTRY CONTROLLER publishFxEditorBridgePlugin "+o.name);
        //FENIX Editor Plugin Registration
        if (!window.Fx_editor_bridge_plugins) {
            window.Fx_editor_bridge_plugins = {};
        }

        window.Fx_editor_bridge_plugins[o.name] = new Plugin();

        //console.log("------------ (2) DATA ENTRY CONTROLLER publishFxEditorBridgePlugin  window.Fx_editor_bridge_plugins = ");
        //console.log(window.Fx_editor_bridge_plugins);

    };

    DataEntryController.prototype.cacheFormValues = function () {
        var moduleIdentifier = this.form.getCurrentModule();
        var moduleValues = this.form.getValues();
        //console.log("moduleValues = "+moduleValues);
        //console.log(moduleValues);

       // console.log("moduleIdentifier = "+moduleIdentifier);
        w_Storage.setItem(moduleIdentifier, moduleValues);

    };

    DataEntryController.prototype.getValues = function () {
        return this.getAllFormValues();
    };

    DataEntryController.prototype.getAllFormValues = function () {
        var keys = w_Storage.getAllKeys();
        var root = {};
        // Delete the "EntityPath" and "isRoot" properties

      for(var i=0; i<keys.length; i++){
            var formItemValues = w_Storage.getItem(keys[i]);
            var values = formItemValues;

         //   console.log("============ key "+keys[i] + ' | ' +formItemValues);
            //console.log(formItemValues);

          if(values != ""){
              // needs to be adjusted for when there is more than 1 item in the array
              if($.isArray(values)) {
                  values = values[0];
              }

             if(values.hasOwnProperty("isRoot")){
              if(values.isRoot){
                  root =  formItemValues;
                 // delete formItemValues.isRoot;
              } else {
                  var formObs;
                  if(values.hasOwnProperty("entityPath")){
                      var ePth = values.entityPath.split('.');
                      //console.log("============ split ePth "+ePth + " for "+keys[i]);
                      this.nest(ePth, root, values);
                     // delete formItemValues.entityPath;
                  }
                  else {
                    //  console.log("============ split NO Entity Path "+keys[i]);
                     // var formObs;
                      //if(formItemValues.hasOwnProperty("entityPath")){
                        //  var ePth = formItemValues.entityPath.split('.');
                        //  this.nest(ePth, root, formItemValues);
                         // delete formItemValues.entityPath;
                     // }
                     // else {
                          if(root[keys[i]] === undefined){
                              root[keys[i]] = formItemValues;
                            // delete formItemValues.isRoot;
                          } else {
                              root[keys[i]] = root[keys[i]];

                              //This needs to be extended so that it is recursive
                              for(var item in values) {
                                  root[keys[i]][item] = values[item];
                                // delete formItemValues[item].isRoot;

                              }
                          }
                     // }
               }
          }
          }

       }

      }

        return root;


    /**  console.log("============ key length "+keys.length);
        for(var i=0; i<keys.length; i++){
          var formItemValues = w_Storage.getItem(keys[i]);
          console.log("============ key START "+keys[i] + ' | ' +formItemValues);
          console.log(formItemValues);

          if(formItemValues!=""){
     //   if(json_Utils.isJsonString(formItem[keys[i]])){

         //  var formItemValues = json_Utils.parse(formItem[keys[i]]);   // Parse To create JS Object
           // console.log("============ values = ");
           // console.log(formItemValues);

           if(formItemValues.hasOwnProperty("isRoot")){
              if(formItemValues.isRoot){
                 root =  formItemValues;
                 // console.log("============ key "+keys[i] + ' isRoot ');
                 //console.log(root);
                 delete formItemValues.isRoot;
              } else {
                 var formObs;
                if(formItemValues.hasOwnProperty("entityPath")){
                   var ePth = formItemValues.entityPath.split('.');
                   this.nest(ePth, root, formItemValues);
                    delete formItemValues.entityPath;
                }
                else {
                  if(root[keys[i]] === undefined){
                    root[keys[i]] = formItemValues;
                    delete formItemValues.isRoot;
                  } else {
                      root[keys[i]] = root[keys[i]];

                      //This needs to be extended so that it is recursive
                      for(var item in formItemValues) {
                          root[keys[i]][item] = formItemValues[item];
                          delete formItemValues[item].isRoot;

                      }
                  }
                }
              }
            }
           }
        }

        return root;    **/
    };

    DataEntryController.prototype.deleteObjects = function(obj, find) {
      //  console.log("======================== parseMetadata: iterate: find "+find);
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                // console.log("======================== parseMetadata: iterate: prop "+ property);

                if (typeof obj[property] == "object") {
                   // console.log("======================== parseMetadata: iterate: isObject "+ obj[property] + " prop "+property);

                    if(property == find) {
                       // console.log("MATCH find: "+find + " | prop: "+ property + "   " + obj[property]);
                        delete obj[property];
                        break;
                    }
                    else {
                        this.deleteObjects(obj[property], find);
                    }
                } //else {
                //  console.log("======================== parseMetadata: iterate: isProperty "+ obj[property]);
                //console.log("======================== parseMetadata: iterate:prop: "+ property + "   " + obj[property]);
                //if(property == find) {
                // console.log("MATCH find: "+find + " | prop: "+ property + "   " + obj[property]);
                //}
                // }
            }
        }
    };

    DataEntryController.prototype.iterate = function(obj, find, json) {
       // console.log("======================== parseMetadata: iterate: find "+find);
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
               // console.log("======================== parseMetadata: iterate: prop "+ property);

                if (typeof obj[property] == "object") {
                 //   console.log("======================== parseMetadata: iterate: isObject "+ obj[property] + " prop "+property);

                   if(property == find) {
                       // console.log("MATCH find: "+find + " | prop: "+ property + "   " + obj[property]);
                        json = obj[property];
                        break;
                   }
                   else {
                        this.iterate(obj[property], find);
                  }
                } //else {
                  //  console.log("======================== parseMetadata: iterate: isProperty "+ obj[property]);
                    //console.log("======================== parseMetadata: iterate:prop: "+ property + "   " + obj[property]);
                    //if(property == find) {
                       // console.log("MATCH find: "+find + " | prop: "+ property + "   " + obj[property]);
                    //}
               // }
            }
        }
       // console.log("JSON: "+json);
       // console.log(json);
        return json;
    };


    DataEntryController.prototype.updateCache = function (data) {
    //console.log("=================== updateCache");
   // console.log(data);
        var storageKeys = w_Storage.getAllKeys();
    //Populate the storage cache
    for(var i=0; i<storageKeys.length; i++){
      //  console.log("=================== updateCache");
      //  console.log(storageKeys[i]);
       // console.log("=================== result ");
       // console.log(data[storageKeys[i]]);
        w_Storage.setItem(storageKeys[i],data[storageKeys[i]]);
    }


        //console.log("=================== updateCache END");


    // SET SAVE ACTION: As the data was loaded
     cache.saveAction = {type: o.saveTypes.OVERWRITE};

    //Test Get storage cache
   // for(var i=0; i<storageKeys.length; i++){
      //  console.log("============= TEST: STORAGE KEY = "+storageKeys[i]);
      //  console.log( w_Storage.getItem(storageKeys[i]));
   // }

        this.menu.setDefault();

     //  console.log("this.menu.getSelectedModule() = "+this.menu.getSelectedModule().module) ;

       // this.createForm(this.menu.getSelectedModule().module, this.menu.getSelectedModule());
    };


    DataEntryController.prototype.parseData = function () {
        var json='{"uid":"ss","version":"ss","language":{"codes":[{"code":"AR"}],"codeList":"FAO_Languages","version":"1.0"},"languageDetail":{"EN":"ss"},"title":{"EN":"ss"},"characterSet":{"codes":[{"code":"AR"}],"codeList":"FAO_Languages","version":"1.0"},"parentIdentifier":"","metadataStandardName":{"EN":"ss"},"metadataStandardVersion":{"EN":"ss"},"metadataLanguage":{"codes":[{"code":"AR"},{"code":"ZH"},{"code":"EN"}],"codeList":"FAO_Languages","version":"1.0"},"contacts":{"name":"ss","organization":{"EN":"ss"},"organizationUnit":{"EN":"ss"},"position":{"EN":""},"role":[{"code":""}],"specify":{"EN":""},"contactInfo":{"phone":"111","address":"","emailAddress":"","hoursOfService":{"EN":""},"contactInstruction":{"EN":""}}},"noDataValue":{"EN":""},"content":{"resourceRepresentationType":[{"code":"dataset"}],"keyWords":{"EN":"www,fff"},"description":{"EN":"wwww"},"statisticalConceptsDefinition":{"EN":"www"},"referencePopulation":{"statisticalPopulation":{"EN":"www"},"statisticalUnit":{"EN":"ww"},"referencePeriod":[{"code":"day"}],"referenceArea":[{"code":"adminlevel2"}]},"coverage":{"coverageSectors":[{"code":"agriculture"}],"coverageSectorsDetails":{"EN":"sector1"},"coverageGeographic":[{"code":"africa"}]}}}';
        var loadedJsnObj = json_Utils.parse(json);
        // console.log("======================== parseMetadata jsonObj = ");
        //console.log(loadedJsnObj);
       // console.log("parseData: cache.jsonMapping ======================== "+ cache.jsonMapping);

        // Determine the root entity
        var rootIdentifier =  cache.rootEntity;


       // console.log("parseData: rootIdentifier ======================== "+ rootIdentifier);


        var storageKeys = w_Storage.getAllKeys();
        // Create object, whose properties match the storage keys and values are the loadedJsnObj split by key
        var splitObj = json_Utils.splitJsnByKeys(storageKeys, loadedJsnObj, rootIdentifier);
       // console.log("parseData: splitObj ======================== "+ splitObj);
        // Delete the value Obj properties that match the storage keys
        var cleanedUpObj = json_Utils.deleteRootProperties(storageKeys, splitObj);

        //Populate the storage cache
        for(var i=0; i<storageKeys.length; i++){
            w_Storage.setItem(storageKeys[i], cleanedUpObj[storageKeys[i]]);
        }

        //Test Get storage cache
        //for(var i=0; i<storageKeys.length; i++){
           // console.log("============= TEST: STORAGE KEY = "+storageKeys[i]);
           // console.log( w_Storage.getItem(storageKeys[i]));
        //}
    };

    function getRootEntity(){
        var rootEntity;
        var jsnRootPath = json_Utils.findParentPathForValue(cache.jsonMapping, "root");

        var rootJsnEntity = json_Utils.findObjectByPath(cache.jsonMapping, jsnRootPath);

        if(rootJsnEntity.hasOwnProperty("entity")){
            rootEntity = rootJsnEntity["entity"];
        }

        return rootEntity;
    }

    function getRootLabel(rootEntity){
        var rootEntityLabel;
        var jsnRootPath = json_Utils.findParentPathForValue(cache.jsonGuiConf, rootEntity);

        var rootJsnEntity = json_Utils.findObjectByPath(cache.jsonGuiConf, jsnRootPath);

        if(rootJsnEntity.hasOwnProperty("label")){
            rootEntityLabel = rootJsnEntity["label"][o.widget.lang];
        }

        return rootEntityLabel;
    }


    DataEntryController.prototype.parseData1 = function () {
       var json='{"uid":"ss","version":"ss","language":{"codes":[{"code":"AR"}],"codeList":"FAO_Languages","version":"1.0"},"languageDetail":{"EN":"ss"},"title":{"EN":"ss"},"characterSet":{"codes":[{"code":"AR"}],"codeList":"FAO_Languages","version":"1.0"},"parentIdentifier":"","metadataStandardName":{"EN":"ss"},"metadataStandardVersion":{"EN":"ss"},"metadataLanguage":{"codes":[{"code":"AR"},{"code":"ZH"},{"code":"EN"}],"codeList":"FAO_Languages","version":"1.0"},"contacts":{"name":"ss","organization":{"EN":"ss"},"organizationUnit":{"EN":"ss"},"position":{"EN":""},"role":[{"code":""}],"specify":{"EN":""},"contactInfo":{"phone":"111","address":"","emailAddress":"","hoursOfService":{"EN":""},"contactInstruction":{"EN":""}}},"noDataValue":{"EN":""},"content":{"resourceRepresentationType":[{"code":"dataset"}],"keyWords":{"EN":"www,fff"},"description":{"EN":"wwww"},"statisticalConceptsDefinition":{"EN":"www"},"referencePopulation":{"statisticalPopulation":{"EN":"www"},"statisticalUnit":{"EN":"ww"},"referencePeriod":[{"code":"day"}],"referenceArea":[{"code":"adminlevel2"}]},"coverage":{"coverageSectors":[{"code":"agriculture"}],"coverageSectorsDetails":{"EN":"sector1"},"coverageGeographic":[{"code":"africa"}]}}}';
       var loadedJsnObj = json_Utils.parse(json);
      // console.log("======================== parseMetadata jsonObj = ");
       //console.log(loadedJsnObj);
      //console.log("parseMetadata: cache.jsonMapping ======================== "+ cache.jsonMapping);

     // console.log("parseMetadata: entityIdentifier ======================== "+ jsnEntity);
       /// console.log(jsnEntity);

        var isRoot;
        if(cache.jsonMapping){
            if(cache.jsonMapping.hasOwnProperty("path-mapping")){
                var arrayLength = cache.jsonMapping["path-mapping"].length;
                for (var e = 0; e < arrayLength; e++) {
                    var entityObj = cache.jsonMapping["path-mapping"][e];
                    if(entityObj.hasOwnProperty("path")){
                      if(entityObj["path"] = "root"){
                           isRoot = entityObj["entity"];
                           break;
                        }
                    }
                }
            }
        }

        //console.log("===================== cache.jsonMapping isRoot = "+isRoot);

        // find store key in JSON, and return the JSON Object
        // But delete the children nodes that are also in the store
        var keys = w_Storage.getAllKeys();

        var tempObj = {};

         for(var i = 0; i < keys.length; i++){
             var path = json_Utils.findParentPathForProperty(loadedJsnObj, keys[i]);
             var obj;
             if(path === undefined){
               obj = "";
                 //console.log("path undefinbed "+ isRoot+ " | "+ keys[i]);
               if(isRoot != undefined){
                  // console.log(isRoot+ " | "+ keys[i]);
                   if(keys[i] === isRoot)
                      obj = loadedJsnObj;
                   else
                     obj = "";
               }
             }
             else {
               if(path == 'root')     {
                  obj = loadedJsnObj[keys[i]];
               }
               else {
                   obj = json_Utils.findObjectByPath(loadedJsnObj, path+"["+keys[i]+"]");
               }

             }


             tempObj[keys[i]] = obj;







             //  obj = json_Utils.findObjectByPath(jsonObj, path);
            // else

          //  var jsContent = this.iterate(jsonObj, keys[i], {});
             // for(var j = 0; i < keys.length; j++){
               //  if( keys[j]!=keys[i])
                  //  this.delete(jsContent, keys[j]);
            // }

           // w_Storage.setItem(keys[i], jsContent);
         }

        //console.log("============= PROCESSING 1 COMPLETE ");
        //console.log(tempObj);


     //   for(var j = 0; j < keys.length; j++){
        for (var key1 in tempObj) {
            var objIt = tempObj[key1];
           // console.log("============= tempObj  "+key1 +" === START objIt = ");
           // console.log(objIt);
            for (var propIt in objIt) {
                // important check that this is objects own property
                // not from prototype prop inherited
                //console.log("============= propIt:  "+propIt);

                if(objIt.hasOwnProperty(propIt)){
                    for(var j = 0; j < keys.length; j++)  {
                    if(propIt == keys[j]){
                      //  console.log("============= deleting  "+propIt +" (MATCHES key "+ keys[j]+")");
                        delete objIt[propIt];
                    }
                    }
                }
            }
            w_Storage.setItem(key1, objIt);
           // console.log("============= tempObj  "+key1 + " === END ");
          }
        //}

        //console.log("============= PROCESSING 2 COMPLETE ");
      //  console.log(tempObj);

       // var stKeys = w_Storage.getAllKeys();

      //  console.log("============= STORAGE CHECK START ====== stKeys = "+stKeys.length);
        //  for(var sk=0; sk<stKeys.length; sk++){
             // console.log("============= STORAGE KEY = "+stKeys[sk]);
             // console.log(w_Storage.getItem(stKeys[sk]));

         // }







            //  obj = json_Utils.findObjectByPath(jsonObj, path);
            // else

            //  var jsContent = this.iterate(jsonObj, keys[i], {});
            // for(var j = 0; i < keys.length; j++){
            //  if( keys[j]!=keys[i])
            //  this.delete(jsContent, keys[j]);
            // }

            // w_Storage.setItem(keys[i], jsContent);






            //  var jsContent = this.iterate(jsonObj, "content", {});
       // console.log("=================JS CONTENT ");
       // console.log(jsContent);
       // this.delete(jsContent, "referencePopulation");
       // console.log(" ========== JSCONTENT AFTER" );
       // console.log(jsContent);

    };


    DataEntryController.prototype.splitJsnByKeys = function (storageKeys, loadedJsnObj, rootIdentifier) {
        // find storage key Object in Loaded JSON
        // If defined, then the keyObj is set to the key property in the splitJsnObj

        var splitJsnObj = {};

        for(var i = 0; i < storageKeys.length; i++){
            var keyPath = json_Utils.findParentPathForProperty(loadedJsnObj, storageKeys[i]);
            var keyObj;
            if(keyPath === undefined){
                keyObj = "";
                if(rootIdentifier != undefined){   // If rootIdentifier is defined then the key is the root Object and the whole loadedJsnObj is assigned to keyObj
                    if(storageKeys[i] === rootIdentifier) {
                        keyObj = loadedJsnObj;
                        keyObj.isRoot = true;
                    }
                    else {
                        keyObj = "";
                    }
                }
            }
            else {
                if(keyPath == 'rootProp') {  // keyPath = 'rootProp', means that the key is a direct property of the root object  e.g. {"content":{}}
                    keyObj = loadedJsnObj[storageKeys[i]];
                }
                else {
                    keyObj = json_Utils.findObjectByPath(loadedJsnObj, keyPath+"["+storageKeys[i]+"]");
                }

            }

            splitJsnObj[storageKeys[i]] = keyObj;

        }

        return splitJsnObj;

    };

    DataEntryController.prototype.nest  = function (keys, obj, values) {
        if (keys.length > 0) {
            var key = keys.shift()

            if (obj[key] === undefined) {
                if (keys.length === 0) {
                   // createCodes(key, value, obj, codeObj, codesArray);
                    obj[key] = values;
                } else {
                    obj[key] = {}
                }
            }
            else {
                if (keys.length === 0) {
                    obj[key] = values;
                    //createCodes(key, value, obj, codeObj, codesArray);
                } else {
                    obj[key] = obj[key];
                }
            }

            var nestingBookmark = obj[key];
        }
        if (keys.length !== 0) {
            this.nest(keys, nestingBookmark, values);
        }
    };

    DataEntryController.prototype.getName = function () {
        return o.name;
    };

    DataEntryController.prototype.collapseFilter = function () {

        $(selectors.CONTAINER).hide();
    };

    DataEntryController.prototype.openFilter = function () {

        $(selectors.CONTAINER).show();
    };


    DataEntryController.prototype.updateStorage = function (response) {
        if (response) {
            var keys =  w_Storage.getAllKeys();
            var moduleIds = [];
            var moduleFields = {};


            var responseObj = cache.saveAjax[cache.saveAction.type].response;

            if(responseObj!= undefined && responseObj.hasOwnProperty("keyFields")){
                for (var j = 0; j < responseObj["keyFields"].length; j++) {
                    var moduleObj = responseObj["keyFields"][j];

                    for(var prop in moduleObj){
                        if(moduleObj.hasOwnProperty(prop)){
                            moduleIds.push(prop);
                            moduleFields[prop];

                            var jsn = w_Storage.getItem(prop);
                            var values = jsn;
                            if($.isArray(jsn)) {
                                values = jsn[0];
                            }

                            var fields = moduleObj[prop];
                            var fieldsArry = [];
                            var fieldValues = {};
                            moduleFields[prop] = fields;
                            for (var i = 0; i < fields.length; i++) {
                                var field = fields[i];

                                var value = response[field];
                                values[field] = value;
                                fieldValues[field] =  value;
                                fieldsArry.push(fieldValues);
                            }
                            moduleFields[prop] =  fieldsArry;
                        }
                    }
                }
            }

            var currentForm = this.form.getCurrentModule();

            if($.inArray(currentForm, moduleIds) >= 0) {
                this.form.refresh(moduleFields[currentForm]);
            }  else {
                w_Commons.raiseCustomEvent(document.body, o.events.NEW_METADATA_SUCCESS, {});
            }

        }

    };



    DataEntryController.prototype.overwriteMessage = function (response) {
        if (Object.keys(response).length > 0) {
           w_Commons.raiseCustomEvent(document.body, o.events.OVERWRITE_METADATA_SUCCESS, {});
        }

    };

    return DataEntryController;

});