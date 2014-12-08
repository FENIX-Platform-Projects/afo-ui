define([
    "require",
    "jquery",
    "bootstrap-validator",
    "bootstrap-tagsinput",
    "fx-editor/widgets/Fx-widgets-commons",
    "fx-editor/utils/Fx-ui-element-creator",
    "fx-editor/utils/fx-ui-elements/Fx-ui-info",
    "fx-editor/utils/Fx-json-utils",
    "fx-editor/utils/Fx-bootstrapValidator-utils",
    "fx-editor/utils/Fx-date-utils",
    "i18n!fx-editor/nls/langProperties",
    "bootstrap",
    "fx-editor/conf/js/fx-form-validation-callback",
    "jquery-serialize-object",
    "bootstrap-datetimepicker"
], function (require, $, bootstrapValidator, bootstrapTagsInput, W_Commons, Ui_Element_Creator, UI_Info, Json_Utils, BootstrapValidator_Utils, Date_Utils, langProperties) {

    var o = { },
        defaultOptions = {
            config: {
                validation: "conf/json/fx-editor-validation-config.json",
                jsonMapping: "conf/json/fx-editor-mapping-config.json",
                dates: "conf/json/fx-editor-dates-config.json"
            },
            resourceType : 'dataset',
            widget: {
                lang: 'EN'
            },
            css_classes: {
                ICON_INFO: "glyphicon fx-editor-menu-info",
                ICON_EXPAND: "fa fa-caret-down fa-lg fa-fw",
                ICON_COLLAPSE: "fa fa-caret-up fa-lg fa-fw",
                ICON_CALENDAR: "glyphicon glyphicon-calendar"
            },
            events: {
               // SAVE: 'fx.editor.module.save',
                FIND: 'fx.editor.module.find',
                SUBMIT: 'fx.editor.form.submit',
                INVALID: 'fx.editor.form.invalid',
                NEW_METADATA_SUCCESS: "fx.editor.saved",
                OVERWRITE_METADATA_SUCCESS: "fx.editor.overwritten"
            }
        };

    var cache = {}, validatedModuleForm = {}, resourceType,
        w_Commons, ui_Element_Creator, ui_Info, json_Utils, bootstrapValidator_Utils, date_Utils,
        validation_conf, json_mapping_conf, dates_conf,
        $formPanel, $form, $module, moduleValues, storageCache, guiCache, elementValidationRule, entityPath, pathMappingExists = false, pathFieldsMappingExists = false,
        modulePath;

    function Fx_Editor_Form() {
        w_Commons = new W_Commons();
        json_Utils = new Json_Utils();
        bootstrapValidator_Utils = new BootstrapValidator_Utils();
        date_Utils = new Date_Utils();
        ui_Info = new UI_Info();
        ui_Element_Creator = new Ui_Element_Creator();
        ui_Element_Creator.init();
    }

    // =============================== Helper functions ======================

    // Recursively search JSON for a match on the key and the property (prop)
    // set the global elementValidationRule if there is a match
    function setElementValidationRule(json, prop){

        for (var key in json) {
            var elem = json[key];

            if(key === prop) {
                //set global variable (elementValidationRule) if the key and prop match
                elementValidationRule = elem;
            }

            if(elem.hasOwnProperty("fields")) {
                setElementValidationRule(elem["fields"], prop);
            }

        }
    }

    function cacheModuleValidationRules(){
         //Check if the Module Entity requires validation i.e. check if the module is present in cache.jsonvalidation
        var entity = json_Utils.findParentPathForValue(cache.jsonvalidation, $module.module);

        //console.log(" FIND VALIDATION RULES FOR ++++++++++++++++++++++++++++++++ "+ $module.module + " entity = "+entity);

        //If the module entity, is not null, retrieve and cache the validation rules for the module
        if(entity){
            if(entity!=null) {
                cache.modulevalidationrules = json_Utils.findObjectByPath(cache.jsonvalidation, entity);
                //console.log(cache.modulevalidationrules);
            }
        }else {
           // console.log("ENTITY FALSE FOR  ++++++++++++++++++++++++++++++++ "+ $module.module);
        }
    }


    function cacheModulePathMapping(){
        //Check if the Module Entity has any path mapping requirements i.e. check if the module is present in cache.jsonmapping
        var entity = json_Utils.findParentPathForValue(cache.jsonmapping, $module.module);
        //console.log("===================== cacheModulePathMapping() "+entity);
        var objMapping = json_Utils.findParentPathForProperty(cache.jsonmapping, "obj-path-mapping");

        //If the module entity, is not null, retrieve and cache the path mappings for the module
        if(entity){
            if(entity!=null) {
                cache.modulepathmapping = json_Utils.findObjectByPath(cache.jsonmapping, entity);
                if(cache.modulepathmapping.hasOwnProperty("path")){
                    modulePath = cache.modulepathmapping.path;
                }
                //console.log("===================== cacheModulePathMapping() = modulePath "+modulePath);
                //console.log(cache.modulepathmapping);
            }
        }
        //If there are any general object mappings (e.g. OJCodeList), is not null, retrieve and cache the path mappings
        if(objMapping){
            if(objMapping!=null) {
              // cache.objpathmapping = cache.jsonmapping[0]["obj-path-mapping"];
               cache.objpathmapping = cache.jsonmapping["obj-path-mapping"];
            }
        }
    }


    function setFieldSetsVisibility() {

        // set padding after a fieldset has finished.
        $('#fx-editor-form').find('fieldset').each(function(index, element){
            //console.log(this.id);

            // form group before a fieldset
            var prevForGrp = $('#'+this.id).prev('.form-group');

            if(prevForGrp.length > 0){
                prevForGrp.css("padding-bottom", "10px");
            }

            // first form group after a fieldset
            var nextForGrp = $('#'+this.id).next('.form-group');

            if(nextForGrp.length > 0){
                nextForGrp.css("padding-top", "15px");
            }

            // first div in the fieldset
            $('div:first', this).css("padding-top", "15px");

        });

        //On Load of the form, only display nested field sets that contain no required fields
        $('#fx-editor-form fieldset:first').find('fieldset').each(function(){

            if ($('#'+this.id + ' span').filter(function() {
                var requiredCss =  bootstrapValidator_Utils.getFeedbackIconCss(bootstrapValidator_Utils.getFeedbackIconTypes().REQUIRED);
                return $(this).attr('class') == requiredCss;
            }).length == 0) {
                $('#'+this.id).find("*:not(legend, legend *)").hide();
            }
        });

    }


    function initializeFormValidation() {
        //console.log("form rendered ...IN VALIDATION module = "+$module);
        var self = this;

        //Get options for the Bootstrap Validator Object
        var bValidatorOptions = createBootstrapValidatorOptions();


        //Initialize the form with the Bootstrap Validator Options and set other Validation configurations
        $('#fx-editor-form form')
            // IMPORTANT: Must declare .on('init.field.bv')
            // before calling .bootstrapValidator(options)
            .on('init.field.bv', function (e, data) {
                bootstrapValidator_Utils.addValidationIcon(data);
            })
            //Set Bootstrap Validator with the form specific options
            .bootstrapValidator(bValidatorOptions)
            .on('status.field.bv', function(e, data) {
                bootstrapValidator_Utils.updateValidationIcon(data);
            })
          //  //Set on Success Handling, when Save pressed
           // .on('success.form.bv', function(e) {
           // //    console.log("=================== FORM: ON SUCCESS CALLED ");
                // Prevent form submission
              //  e.preventDefault();
              //  validatedModuleForm = {id: $module.module, form: e.target, entityPath: entityPath};
              //  var mapping = null;

               // console.log("=================== FORM:CALLED ");
               // w_Commons.raiseCustomEvent(o.container, 'fx.editor.module.save', {form: e.target, module: $module.module, mapping: mapping, call: "FORM: SAVE"});
          //  });

        // Revalidate the tag fields when they change
        $('#fx-editor-form form').find('[data-role="tagsinput"]').each(function(){
            //console.log(this);
             var name = this.name;
             var bv_att = $(this).attr('data-bv-field');

            //only revalidate field if it requires validation
            if(bv_att){
                $(this).change(function(){
                        $('#fx-editor-form form').data('bootstrapValidator').revalidateField(name);
                }).end();
            }

        });

    }


    //Create BootstrapValidator Options from the Validation Rules
    function createBootstrapValidatorOptions() {
        //Prepare options for the Bootstrap Validator
        var bValidatorOptions = new Object();
        var feedbackIcons =  bootstrapValidator_Utils.getFeedbackIcons();

        // Set Excluded disabled, this allows hidden fields, e.g. keywords which is tag input, to be validated
        bValidatorOptions.excluded = ':disabled';

        // Set feedback icons
        bValidatorOptions.feedbackIcons = feedbackIcons;

        //Set the fields
        bValidatorOptions.fields = {};

        var validationFieldsExists = false;
        // Set the Validation Field Rules from the Validation configuration
        if(cache.modulevalidationrules != undefined) {
            //  if(typeof(cache.modulevalidationrules) != 'undefined'){
            if (cache.modulevalidationrules.hasOwnProperty("fields")) {
                validationFieldsExists = true;
            }
        }

        //Check if the validation rules exist
        if(validationFieldsExists){
            for(var field in cache.modulevalidationrules.fields){
                var fieldObj = cache.modulevalidationrules.fields[field];

                // Check if the callback property is present
                // If so convert the string function into an actual function
                if(fieldObj.hasOwnProperty("validators")){
                    if(fieldObj.validators.hasOwnProperty("callback")){
                        if(fieldObj.validators.callback.hasOwnProperty("callback")){
                            var fn = eval("var "+field+" = function(){ return "+fieldObj.validators.callback.callback+";}; "+field+"() ;") ;
                            fieldObj.validators.callback.callback = fn;
                        }
                    }
                }

                // Check the actual DIV field name matches that in the validation rules
                // If not, change the property to match the DIV field name
                // This is true in cases when the DIV field name has been changed programatically to represent a path e.g. contacts.phone
                var name = field;
                var fieldDiv;
                if(!(/\[]/.test(field))){   // test if field does not contains square brackets e.g. languages[],
                    fieldDiv = $('#'+field)
                }

                if(fieldDiv){
                    //console.log(fieldDiv.attr('id'));
                    if(name != fieldDiv.attr("name")){
                        name =  fieldDiv.attr("name");
                    }
                }
                //Set the updated fieldObj to the bValidatorOptions
                bValidatorOptions.fields[name] = fieldObj;

            }

        }

        //console.log("================================= bValidatorOptions");
        //console.log(bValidatorOptions);
        return bValidatorOptions;
    }

    // =============================== Public functions ======================
    Fx_Editor_Form.prototype.init = function (options) {
        var self = this;
        //console.log("FORM:: INIT(): CALLED ");
        //Merge options
        $.extend(o, defaultOptions);
        $.extend(o, options);

       // console.log(" ======================== FORM: INIT::: options = "+o.widget.lang);
       // console.log(o);

        validation_conf = o.config.validation;
        json_mapping_conf =  o.config.jsonMapping;
        dates_conf =  o.config.dates;
        resourceType = o.resourceType;

        bootstrapValidator_Utils.init(options);
        self.initStructure();

    };

    Fx_Editor_Form.prototype.createModuleForm = function (module, storage, gui, values) {
        var self = this;
        $module = module;
        moduleValues = values;
        storageCache = storage;
        guiCache = gui;

        entityPath = null;

      // console.log("************ FORM MODULE::: "+module.module + " entityPath "+entityPath + " storageCache = "+storageCache);
        //console.log(storageCache);
       // console.log(module);

        if(module.hasOwnProperty("parent")){
          entityPath = module.parent;
        }


      //  console.log("createModuleForm:::: VALUES = "+values);
        //console.log(values);

        self.initModule(module);

        //Cache json configuration files: Validation and Json Mapping
      /**  $.when($.get(json_mapping_conf),  $.get(validation_conf), $.get(dates_conf))
          .done(function( mappingJsn, validationJsn, datesJsn ) {
                 cache.jsonmapping = mappingJsn;
                 cache.jsonvalidation = validationJsn;
                 cache.jsondates = datesJsn;
                 self.initModule(module);
        });   **/

    };


    Fx_Editor_Form.prototype.initModule = function (module) {
        //console.log("FORM:: initModule() CALLED cache.jsonvalidation = "+cache.jsonvalidation);
        var self = this;
    if(cache.jsonvalidation != undefined)  {
        //Cache any Module Validation Rules
        cacheModuleValidationRules();
    }

    if(cache.jsonmapping != undefined)  {
        //Cache any Module Path Mappings
        cacheModulePathMapping();
    }

    //Clear the form
    self.removeModuleForm(module);
    self.renderModule(module);
    }


    //This callback function is called when the form render is complete
    Fx_Editor_Form.prototype.onRenderInitialize = function () {
        //Initialize the tag plugin
      //  $("#fx-editor-form form input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput(
       // );

        $("#fx-editor-form form input[data-role=tagsinput], select[multiple][data-role=tagsinput]").each(function(){
            $(this).tagsinput(
                {
                    trimValue: true,
                    confirmKeys: [13, 44]
                    /**,tagClass: 'small' **/
                }
            );
        });



          $("#fx-editor-form form div[class='input-group date']").each(function(){
             $(this).datetimepicker({
                pickTime: false
            });

        });


      //  $("#fx-editor-form form div[class='input-group date']").datetimepicker({
        //   pickTime: false
       // });

        //Initialize the Bootstrap date time picker for ranges
        $("#fx-editor-form form div[class='input-group date-range'] input").each(function(){
            $(this).datetimepicker();
        });

        if(cache.modulevalidationrules != undefined) {
            //Set Bootstrap Validator
            initializeFormValidation();
        }

        //On Load of the form, only display nested field sets that contain no required fields
        setFieldSetsVisibility();



        //Create Hidden Clone templates
        //$('#fx-editor-form').find('.fnx-clone-button').each(function(){
        //});

    };


    //Function to clear the Form Panel
    Fx_Editor_Form.prototype.removeModuleForm = function (module) {
        $(o.container).find('.panel').empty();
    };

    Fx_Editor_Form.prototype.render = function (options) {
        $.extend(o, options);

        var self = this;

        if(o.config.hasOwnProperty("cache")){
            if(o.config.cache.hasOwnProperty("mapping")){
                cache.jsonmapping = o.config.cache.mapping;
            }

            if(o.config.cache.hasOwnProperty("validation")){
                cache.jsonvalidation = o.config.cache.validation;
            }

            if(o.config.cache.hasOwnProperty("dates")){
                cache.jsondates = o.config.cache.dates;
            }
        }


       // $.getJSON(validation_conf, function( data ) {
            // Validation Rules
            // cache the validation configuration file
          //  cache.jsonvalidation = data;//JSON.parse(validation_conf);
       // });




        //set default load
        // var root = cache.json.panels[0];
        // console.log('root = '+root.module);
        //this.renderModule(root);
    };


    Fx_Editor_Form.prototype.initStructure = function () {
        o.formPanelId = "fx-form-panel" + w_Commons.getFenixUniqueId();

        //Hide the modal Information template (used when clicking on the 'i' icon and the content should be retrieved from a "remote-html" )
        $("#infoModal").modal('hide');

        //Create the form panel
        $formPanel = $('<div class="panel panel-default"></div>');
        $formPanel.attr("id", o.formPanelId);

        $(o.container).append($formPanel);

    };

    Fx_Editor_Form.prototype.renderModule = function (module) {
        var self = this;
        $formPanel.append(self.buildPanelHeader(module));
        $formPanel.append(self.buildPanelBody(module));
        //$formPanel.append(self.buildPanelFooter(module));

        //set Focus on first item
        $('#fx-editor-form').find(':text,:radio,:checkbox,select,textarea').each(function(){
            if(!this.readOnly && !this.disabled &&
                $(this).parentsUntil('form', 'div').css('display') != "none") {
                this.focus();  //Dom method
                this.select(); //Dom method
                return false;
            }
        });
    };


    Fx_Editor_Form.prototype.buildPanelHeader = function (module) {
        //Initialize header and set with the module name
        var $panelHeader = $('<div class="panel-heading fx-editor-active-panel"></div>'),
            $label = $('<h3 class="panel-title"></h3>');



        if (module.hasOwnProperty("module")) {
            $label.append(module["label"][o.widget.lang]);
        } //else
            //console.log('NO module.module property ');

        return $panelHeader.append($label);

    };


    Fx_Editor_Form.prototype.buildPanelBody = function (module) {
        var self = this;
        //Initialize panel body
        var $panelBody = $('<div class="panel-body"></div>');

        //Add any introductory text
        if (module.hasOwnProperty("intro")) {
           if(module["intro"].hasOwnProperty([o.widget.lang])){
                $panelBody.append('<div class="well well-sm">'+module["intro"][o.widget.lang]+'</div>');
            }
            //the content of which will be determined by the remote html
            else if(module["intro"].hasOwnProperty("remote-html")){
                $panelBody.load(module["intro"]["remote-html"][o.widget.lang]);
            }
        }
        cache.properties = {};
        if(module.hasOwnProperty("properties")) {
            self.checkProperties(cache.properties, module.properties);
        }

        //console.log("======================= buildPanelBody: cache.properties ========================");
       // console.log(cache.properties);

        //console.log("======================= buildPanelBody: module.properties ========================");
       // console.log(module.properties);

       $panelBody.append(self.buildForm(module, cache.properties));

        return $panelBody;
    };



    Fx_Editor_Form.prototype.checkProperties = function (cacheProps, props) {
        var self = this;
            //clean up the properties
            for (var name in props) {
                var obj = props[name];

                if(obj.hasOwnProperty("resourceType")){
                    if($.inArray(resourceType, obj.resourceType) >= 0) {
                        cacheProps[name] = obj;
                    }
                    continue;
                }

                cacheProps[name] = obj;

          }
           //console.log("======================= checkProperties: cacheProps ========================");
           //console.log(cacheProps);

    };


    Fx_Editor_Form.prototype.buildForm = function (module, cachProps) {
        var self = this,
            id = "fx-form-" + w_Commons.getFenixUniqueId();

        //Initialize form
        $form = $('<form class="form-horizontal" role="form" action="" method="">');
        //Set default message for bootstrap validator
        $form.attr("data-bv-message", "This value is not valid");
        $form.attr("id", id);

        //If the module has properties, build the Form Field containers
       if (module.hasOwnProperty("properties")) {

        var props = cachProps,//module.properties,
                ruleExists = false,
                requiredFieldsExist = false,
                elementsJson = {};



            if(cache.modulevalidationrules != undefined) {
                //if(typeof(cache.modulevalidationrules) != 'undefined'){
                if (cache.modulevalidationrules.hasOwnProperty("fields")) {
                    ruleExists = true;
                }
            }

            if(cache.modulepathmapping != undefined) {
                // if(typeof(cache.modulepathmapping) != 'undefined'){
                pathMappingExists = true;

                if (cache.modulepathmapping.hasOwnProperty("fields")) {
                    pathFieldsMappingExists = true;
                } else {
                    pathFieldsMappingExists = false;
                }

            }




          //console.log("=========================== buildForm() pathMappingExists "+pathMappingExists + " pathFieldsMappingExists "+  pathFieldsMappingExists);

            if(ruleExists){
                for (var fld in cache.modulevalidationrules["fields"]) {
                    //console.log("=========================== fld = ");
                   // console.log(fld);
                    if(cache.modulevalidationrules["fields"][fld].hasOwnProperty("type")){
                        if(cache.modulevalidationrules["fields"][fld]["type"] == bootstrapValidator_Utils.getTypes().IS_REQUIRED) {
                            requiredFieldsExist = true;
                            break;
                        }
                    }
                }

                //console.log("=========================== requiredFieldsExist "+requiredFieldsExist);

                if(requiredFieldsExist) {
                    var requiredCss =  bootstrapValidator_Utils.getFeedbackIconCss(bootstrapValidator_Utils.getFeedbackIconTypes().REQUIRED),
                    $requiredDiv = $('<div class="well well-sm"></div>'),
                    $requiredStrong = $('<strong></strong>'),

                    $requiredImg = $('<span class="'+requiredCss+'"></span>'),
                    $requiredLabel = langProperties.requiredFields;

                    $requiredStrong.prepend($requiredImg);
                    $requiredStrong.append($requiredLabel);

                    $requiredDiv.append($requiredStrong);
                  //  $requiredDiv.append($requiredLabel);
                    $form.append($requiredDiv);
                }
            }

            // Build the containers for the module properties.
            // These containers will be populated 'later' by the ui_Element_Creator.render with the appropriate form field HTML element
            self.buildFormFieldContainers(props, ruleExists, pathFieldsMappingExists, elementsJson, 1);


            // Render the form field HTML elements via ui_Element_Creator.
            // As determined in the elementsJson, the ui_Element_Creator will call the appropriate widget renderer (e.g. <input>, <textarea>, <select>),
            // which in turn will set the appropriate field validation rule.
            // On completion the callback function onRenderInitialize will be applied.

            //console.log("============================================= resourceType ================== "+resourceType);
           // console.log("============================================= resourceType ================== "+resourceType);


           ui_Element_Creator.render({
                cssClass: "form-control",
                container: "fnx-element-",
                elements: elementsJson,
                lang: o.widget.lang,
                validationUtils: bootstrapValidator_Utils,
                values: moduleValues,
                datesConfig: cache.jsondates,//cache.jsondates[0],
                guiConfig: guiCache,
                mapping: cache.modulepathmapping,
                objMapping: cache.objpathmapping,
                resourceType: resourceType
            }, this.onRenderInitialize);

        } else {
            //throw new Error("Fx_Editor_Form: no 'properties' attribute in config JSON.")
        }

        //Initialize Save Button
      //  var $button = $('<button type="submit" class="btn btn-default">Save</button>');
        var $button = $('<button  class="btn btn-default">'+langProperties.save+'</button>');
        $button.on('click', function (e) {
            //e.preventDefault();
            var fm = $('#fx-editor-form form');
            var bv = fm.data('bootstrapValidator');
            bv.validate();

             var mapping = null, moduleLabel;

            //console.log("=================== FORM SAVE fm = "+fm);
           // form: $('#fx-editor-form')
            if(bv.isValid()){
                validatedModuleForm = {id: $module.module, form: fm[0], entityPath: entityPath};
                if(module["label"].hasOwnProperty(o.widget.lang)){
                    moduleLabel = module["label"][o.widget.lang]
                } else {
                    moduleLabel = $module.module;
                }

                w_Commons.raiseCustomEvent(o.container, o.events.SUBMIT, {form: fm[0], module: $module.module, moduleLabel: moduleLabel, mapping: mapping, call: "FORM: SAVE"});
            } else {
                var  errors = bv.getInvalidFields();
                w_Commons.raiseCustomEvent(o.container, o.events.INVALID, {errors: errors});

            }

            return false;
        });




        $form.append($button);

        return $form;
    };

    //Create Form Group
    //Set Field Label and Required Icon
    //Create and Set Information Icon
    //Create Input Group for 'text' fields with an icon add ons
    // key = property e.g. language
    // value = object associated to the property e.g. for language = { "dbid": "language", "type": {}, "label": {}, "info": {} etc}
    // rule = validation rule associated to the property, can be null

    Fx_Editor_Form.prototype.buildFormGroup = function (name, value, rule, fieldSet) {
        var self = this,
            $formGroup = $('<div class="form-group"></div>'),
        // InputGroup: Used if there is an icon to be added to the <input>
            $inputGroup = $('<div class="input-group"></div>'),
            $label = $('<label class="col-sm-4 control-label"></label>'),
            $infoContainer = $('<div class="col-sm-3"></div>'),
        //$info = $('<button class="btn btn-xs btn-info" type="button"><span class="'+o.css_classes.ICON_FAMILY+' '+o.css_classes.ICON_INFO+'"></span></button>');
            $info = $('<button class="btn btn-xs btn-info" type="button"><span class="'+o.css_classes.ICON_INFO+'"></span></button>');

         //$inputDivId is used to determine which container the field HTML element will be appended to
        var $inputDivId = "fnx-element-"+name;

        if(fieldSet !=undefined){
            $inputDivId = "fnx-element-"+fieldSet[0].id+"-"+name;
        }

        //InputContainer: will hold the rendered form field HTML Element e.g. <input>, <select>, <textarea>
        // The $inputDivId is used by the renderer to determine the correct InputContainer
        var $inputContainer = $('<div class="col-sm-5" id="'+$inputDivId+'"></div>');

        $label.attr('for', name);

        // The 'Required' field icon, will be rendered by the widget renderer within the appropriate field. However,
        // in cases when fields are required but the nature of the validation is handled elsewhere e.g. a callback function, then
        // the required icon is displayed alongside the field name.

        // Example 1: 'required-conditional' may refer to a situation when at least one field is required from a set of fields.
        // In this case a label is necessary to show the intention (i.e. these are required fields) but the specific validation is
        // handled by the callback function which will check that only one is required.

        // Example 2, clone buttons (e.g. Add a new contact), maybe associated to a required field (e.g. Contacts),
        // in this case the required icon (i.e. *) would need to be indicated next to the "Contacts" label, it has no correspondence
        // with the button itself.

        var requiredCss =  bootstrapValidator_Utils.getFeedbackIconCss(bootstrapValidator_Utils.getFeedbackIconTypes().REQUIRED);

        // Set Field Label and Required Icon
        if (value.hasOwnProperty("label")) {
            $label.append(value["label"][o.widget.lang]);

            if (rule != null) {
                if (value.hasOwnProperty("type")) {
                    if (value.type.hasOwnProperty("name")) {
                        if (value.type.name == ui_Element_Creator.getTypes().CLONEBUTTON) {
                            if (rule.hasOwnProperty("type")) {
                                if (rule.type == bootstrapValidator_Utils.getTypes().IS_REQUIRED || rule.type == validation_Utils.getTypes().IS_REQUIRED_CONDITIONAL)   {
                                    $label.append(" " + "<span class='" + requiredCss + "'></span>");
                                }

                            }
                        } else {
                            if (rule.hasOwnProperty("type")) {
                                if (rule.type == bootstrapValidator_Utils.getTypes().IS_REQUIRED_CONDITIONAL) {
                                    $label.append(" " + "<span class='" + requiredCss + "'></span>");
                                }
                            }
                        }
                    }
                }
            }
        }

        //Set the information Icon and it's onclick action (either popover or modal window)
        // Uses UI Info
        if (value.hasOwnProperty("info")) {
            if(value["info"].hasOwnProperty("popover")){
                ui_Info.createPopOver($info, value["info"]["popover"][o.widget.lang]);
            }
            // Uses the #infoModal already present in the HTML, opens a modal window
            //the content of which will be determined by the remote html
            else if(value["info"].hasOwnProperty("remote-html")){
                ui_Info.createModal($info, value["info"]["remote-html"][o.widget.lang], '#infoModal');
            }

            $infoContainer.append($info);
        }


        //Set the Input Group, if there is an icon associated with the input type 'text'
        if(value.hasOwnProperty("type")){
            if((value.type.name == ui_Element_Creator.getTypes().TEXT || value.type.name == ui_Element_Creator.getTypes().NUMBER) && value.type.hasOwnProperty("input-group")){
                var  $inputGroup = $('<div class="input-group" id="'+$inputDivId+'"></div>');
                var  $inputGroupSpan = $('<span class="input-group-addon"></span>');

                if(value.type["input-group"].hasOwnProperty("icon")){
                    $inputGroupSpan.attr("class", $inputGroupSpan.attr('class') + ' '+value.type["input-group"].icon);
                }  if(value.type["input-group"].hasOwnProperty("text")){
                    $inputGroupSpan.html(value.type["input-group"].text);
                }

                $inputContainer.removeAttr("id");
                $inputGroup.append($inputGroupSpan);
                $inputContainer.append($inputGroup);
            }

            if(value.type.name == ui_Element_Creator.getTypes().DATE){
                var  $inputGroup = $('<div class="input-group date" id="'+$inputDivId+'"></div>');
                var  $inputGroupSpan = $('<span class="input-group-addon"></span>');
                var  $inputGroupIconSpan = $('<span class="o.css_classes.ICON_CALENDAR"></span>');

                if(value.type.hasOwnProperty("input-group")){
                    if(value.type["input-group"].hasOwnProperty("icon")){
                        $inputGroupIconSpan.attr("class", value.type["input-group"].icon);
                    }
                }

                $inputContainer.removeAttr("id");
                $inputGroup.append($inputGroupSpan.append($inputGroupIconSpan));
                $inputContainer.append($inputGroup);
            }


            if(value.type.name == ui_Element_Creator.getTypes().PERIOD){
                var  $inputSelector = $('<div id="'+$inputDivId+'selector"></div>');
                var  $inputGroup = $('<div class="input-group date-range" id="'+$inputDivId+'"></div>');
                var  $inputGroupSpan = $('<span class="input-group-addon control-label">'+langProperties.to+'</span>');

                $inputContainer.addClass('selectContainer');

                $inputContainer.removeAttr("id");
                $inputGroup.append($inputGroupSpan);
                $inputContainer.append($inputSelector).append($inputGroup);
            }

        }

        $formGroup.append($label).append($inputContainer).append($infoContainer);

        return $formGroup;
    };


    //Create FieldSet
    //Set FieldSet Label and Required Icon
    //Set Collapsible/Expand Action
    //Set Subtitle
    Fx_Editor_Form.prototype.buildFieldSet = function (name, value, rule, idx, fieldSetParentPath) {
        var self = this,
            cssStyle = "fnx-fieldset-"+idx,
            $fieldSet = $('<fieldset title="Click to Expand/Collapse" class="'+cssStyle+'"></fieldset>'),
            $legend =  $('<legend></legend>'),
            $collapeIcon = $('<span class="'+o.css_classes.ICON_EXPAND+'"></span>');


        //fieldSetName used to determine the path to be associated with the HTML elements that will be appended to the fieldset
        var fieldSetId = name,
            fieldSetName =  name;

        if(fieldSetParentPath != undefined) {
            // if(typeof fieldSetParentPath != 'undefined') {
            fieldSetName =  fieldSetParentPath;
        }


        $fieldSet.attr("id", fieldSetId);
        $fieldSet.attr("name", fieldSetName);

        // Set FieldSet Label and Required Icon
        if(value.hasOwnProperty("label")){
            $legend.append($collapeIcon);
            $legend.append("<label>"+value["label"][o.widget.lang]+"</label>");

            if(rule!= null){
                if(rule.hasOwnProperty("type")){
                    if(rule.type == validation_Utils.getTypes().IS_REQUIRED)
                    //if (rule.type == 'required')
                        $legend.append(" "+ "<span class='glyphicon "+o.css_classes.ICON_REQUIRED+"'></span>");
                }
            }
        }

        //Set Collapsible/Expand Action
        $legend.click(function() {
            var fieldsSetId = $(this).parent().attr("id");
            //console.log('fieldsSetId '+fieldsSetId);
            //console.log("================== Toggle Legend");
            //toggle (hide/show) all HTML elements in the fieldset except for the legend, legend contents and small
            $('#'+fieldsSetId).find("*:not(legend, legend *)").toggle();


            //If the fieldset contents is visible, remove existing class and add collapse icon class
            if( $('#'+fieldsSetId).find("*:not(legend, legend *)").is(":visible"))
            {
                $('#'+fieldsSetId).find("legend:first span:first").removeClass();
                $('#'+fieldsSetId).find("legend:first span:first").addClass(o.css_classes.ICON_COLLAPSE);
            }
            //If the fieldset contents is hidden, remove existing class and add expand icon class
            else
            {
                $('#'+fieldsSetId).find("legend:first span:first").removeClass();
                $('#'+fieldsSetId).find("legend:first span:first").addClass(o.css_classes.ICON_EXPAND);
            }

            return false;
        });

        //Append the legend to the fieldset
        $fieldSet.append($legend);

        //Set Subtitle
        if(value.type.hasOwnProperty("subtitle")){
            var $subtitle=  $('<div class="form-group"><div class="col-sm-12 fnx-control-subtitle"><label>'+value.type.subtitle[o.widget.lang]+'</label></div></div>');

            $fieldSet.append($subtitle);
        }


        //Set Multi
        if(value.type.hasOwnProperty("multi")){
            if(value.type.multi)
              $fieldSet.attr("data-array", true);
        }


        return $fieldSet;
    };

    Fx_Editor_Form.prototype.buildPanelFooter = function (module) {

        var self = this,
            $panelFooter = $('<div class="panel-footer" style="overflow:hidden;text-align:right;"></div>'),
            $formButtonContainer = $('<div class="form-group">'),
            $buttonContainer = $(' <div class="col-sm-offset-3 col-sm-9">'),
        // $button = $('<button type="submit" class="btn btn-success btn-sm">Submit</button>');
            $button = $('<button type="submit" class="btn btn-default">Submit</button>');

        $button.on("click", { module: module}, function (e) {
            //  console.log('#fx-editor-form form = '+  $('#fx-editor-form form'));
            $('#fx-editor-form form').bootstrapValidator();
        });

        $panelFooter.append($formButtonContainer.append($buttonContainer.append($button)));

        return $panelFooter;
    };

    // Recursive function on the object's "properties"
    // Creates a Form Group on the leaf node or a FieldSet Container which contains Form Group leaf nodes
    Fx_Editor_Form.prototype.buildFormFieldContainers = function (props, ruleExists, pathFieldsMappingExists, elementsJson, fieldSetCounter, fieldSet, parentPath) {
        var self = this;
        var value,
            $fs,
            fieldSetParentPath,
            nameIdentifier;


         for (var name in props) {
                // console.log(name);
                //property object
                var obj = props[name];

            // Check if the property has a Validation Rule
          //  console.log("---------------------------- FORM:::: cache.modulevalidationrules = "+cache.modulevalidationrules + " ruleExists "+ruleExists +' for' +name);
            if(cache.modulevalidationrules != undefined) {
                // if(typeof(cache.modulevalidationrules) != 'undefined'){
                if (ruleExists) {
                    elementValidationRule = null;
                    //console.log("cache.modulevalidationrules['fields'] ================== ");
                   // console.log(cache.modulevalidationrules['fields']);

                    setElementValidationRule(cache.modulevalidationrules['fields'], name);

                    //Create a "rule" property on the obj, to set the validation rule
                    if(elementValidationRule === null) {
                        // if(typeof elementValidationRule === 'undefined') {
                        obj["rule"] = null;
                    }  else  {
                        obj["rule"] = elementValidationRule;

                        if(elementValidationRule.hasOwnProperty("find")){
                            if(elementValidationRule["find"].hasOwnProperty("values")){

                                    for(var k=0; k < elementValidationRule["find"].values.length; k++){
                                           //set and find value
                                        var itm = elementValidationRule["find"].values[k];
                                        var pth = itm.split('.');
                                        var st = storageCache.getItem(pth[0]);

                                        if(st === ''){
                                            obj["rule"]["find"].values[k] = {"name": pth[1], "value": '' };
                                        } else {
                                          for(var zp in st){
                                              //console.log("Loop  = "+zp);
                                            if(st.hasOwnProperty(zp)) {
                                                if(zp === pth[1]){
                                                    obj["rule"]["find"].values[k] = {"name": pth[1], "value": st[zp] };
                                                }
                                            }
                                          }
                                        }
                                    }
                                  //  w_Commons.raiseCustomEvent(o.container, o.events.FIND, {form: e.target, module: $module.module, mapping: mapping, call: "FORM: FIND"});
                                }

                        }


                    }
                    //console.log("&&&&&&&&&&&&&& After findValidationRule Rule = "+obj.rule + " for "+name);
                    //console.log(obj.rule);
                }
            }

            if(obj.hasOwnProperty("properties")){

                if(obj.hasOwnProperty("type")){
                    if(obj.type.name == ui_Element_Creator.getTypes().FIELDSET){
                        if(obj.hasOwnProperty("label")){
                          //  console.log("====================================== FIELDSET name = "+name);


                            // build the parent path to the fieldset and assign it to the fieldset
                            fieldSetParentPath = parentPath + '.'+ name;

                            if(cache.modulepathmapping != undefined) {
                                // if(typeof(cache.modulepathmapping) != 'undefined'){
                                if (pathFieldsMappingExists) {
                                    if(cache.modulepathmapping['fields'].hasOwnProperty(name)){
                                        if(cache.modulepathmapping['fields'][name].hasOwnProperty("path")){
                                          fieldSetParentPath = cache.modulepathmapping['fields'][name]['path'];
                                        }
                                    }
                                }
                            }

                          //  if(obj.type.hasOwnProperty("multi")) {
                                //if(obj.type.multi)
                                  //fieldSetParentPath = fieldSetParentPath;
                           // }


                            $fs = self.buildFieldSet(name, obj, obj["rule"], fieldSetCounter, fieldSetParentPath);
                            fieldSetCounter ++;

                        }
                    } else {
                        fieldSetParentPath = name;

                        if(cache.modulepathmapping != undefined) {
                            // if(typeof(cache.modulepathmapping) != 'undefined'){
                            if (pathFieldsMappingExists) {
                                if(cache.modulepathmapping['fields'].hasOwnProperty(name)){
                                    // set the parent path object
                                    // set the path from modulepathmapping
                                    // set mapping to true, as the path was taken from modulepathmapping
                                    if(cache.modulepathmapping['fields'][name].hasOwnProperty("path")){
                                        var newPath = cache.modulepathmapping['fields'][name]['path'];

                                        self.createParentPathObject(obj, newPath, true);
                                    }
                                }
                            }
                        }

                        if(obj.hasOwnProperty("label")){
                            if(fieldSet != undefined) {
                                fieldSet.append(self.buildFormGroup(name, obj, obj["rule"]), fieldSet);
                            }
                            else {
                                $form.append(self.buildFormGroup(name, obj, obj["rule"]), fieldSet);
                            }

                        }
                    }
                }
             //   console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CALL before APPEND TO FORM  "+obj.label.EN+" fieldSet = "+fieldSet);

                if(fieldSet != undefined) {
                    // if(typeof(fieldSet)!='undefined')  {
                      fieldSet.append($fs);
                } else {
                    $form.append($fs);
                }


                if(fieldSet != undefined && $fs == undefined) {
                    self.buildFormFieldContainers(obj.properties, ruleExists, pathFieldsMappingExists, elementsJson, fieldSetCounter, fieldSet, fieldSetParentPath);
                }
                else
                  self.buildFormFieldContainers(obj.properties, ruleExists, pathFieldsMappingExists, elementsJson, fieldSetCounter, $fs, fieldSetParentPath);
            }
            else {
                //reset fieldSetPath
                fieldSetParentPath = '';


                if(cache.modulepathmapping != undefined) {
                    // if(typeof(cache.modulepathmapping) != 'undefined'){
                    if (pathFieldsMappingExists) {
                        if(cache.modulepathmapping['fields'].hasOwnProperty(name)){
                            // set the parent path object
                            // set the path from modulepathmapping
                            // set mapping to true, as the path was taken from modulepathmapping
                            if(cache.modulepathmapping['fields'][name].hasOwnProperty("path")){
                                var newPath = cache.modulepathmapping['fields'][name]['path'];


                                self.createParentPathObject(obj, newPath, true);
                            }
                        }
                    }
                }

                if(obj.hasOwnProperty("label")){
                    if(fieldSet != undefined) {
                        // if(typeof(fieldSet)!='undefined')  {
                        if(obj["parent-path"] == null){
                            // create the parent path object
                            // set the path (which was set on the field set's name) on the object, for all children of the field set
                            // set mapping to false, as the path was not taken from modulepathmapping

                            self.createParentPathObject(obj, fieldSet.attr("name"), false);
                        }

                        fieldSet.append(self.buildFormGroup(name, obj, obj["rule"], fieldSet));
                    }
                    else   {
                         $form.append(self.buildFormGroup(name, obj, obj["rule"]), fieldSet);
                    }
                }

            }

            obj.name = name;

            if(fieldSet !=undefined){
                obj.fieldSetId = fieldSet.attr('id');
                obj.fieldSetMappedName = fieldSet.attr('name');

                name = obj.fieldSetId + '-'+name;
              // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CALL append to FORM  "+obj.label.EN+" "+obj.fieldSetId +" | " +obj.fieldSetMappedName);
            }

           // if(obj["parent-path"]!=null) {
              //  console.log("PARENT PATH ============================ "+name);
           // }

            //Populate the elementsJson array with the property name, and set the object to it
            elementsJson[name] = obj;
        }
    }


    Fx_Editor_Form.prototype.createParentPathObject = function (obj, path, isMapped) {

        //console.log("+++++++++++++++++++++++ createParentPathObject "+obj.type.name);

        obj["parent-path"] = [];
        obj["parent-path"].path = path;
        obj["parent-path"].mapped = isMapped;

    }


    Fx_Editor_Form.prototype.getValues = function () {
        var result = {};
        var id = validatedModuleForm.id;
        var $form = $(validatedModuleForm.form);
        var isRoot = false;
      // console.log("=========== FORM: getValues: cache.modulepathmapping id = "+id);
       // console.log("=========== form pathMappingExists = "+pathMappingExists);


        if(pathMappingExists){
           // console.log(cache.modulepathmapping);

             if(cache.modulepathmapping['entity'] === id){
               if(cache.modulepathmapping.hasOwnProperty('path')){
                   if(cache.modulepathmapping.path == "root"){
                      isRoot = true;
                   }  else {
                      isRoot = false;
                   }
               }
            }
        }


        //console.log("=========== form isRoot = "+isRoot);
        var disabledArray = [];
        $form.find(":disabled").each(function(){
           var $this = $(this);
           $this.removeAttr("disabled");
           // console.log("****************** $this.id = "+$this.attr('id'));
           // console.log($this);
           disabledArray.push($this.attr('id'));
        });


        var serializeForm = $form.serializeObject();

        // re-instate disabled fields
        //console.log("****************** disabledArray.length = "+disabledArray.length);
        if(disabledArray.length > 0){
            for(var k = 0; k < disabledArray.length; k++){
                var disItemId =  disabledArray[k];
                //console.log($form.find("#"+disItemId));
                $form.find("#"+disItemId).attr('disabled','disabled');
            }
        }


        // Create Fieldset arrays
        $form.find('> fieldset').each(function(){
            var $this = $(this);
            var isArray = $(this).attr("data-array");
            var name = $(this).attr("name");

            if(isArray !=undefined){
                if(isArray){
                    var obj = serializeForm[name];

                    if(/\./.test(name)){
                        var keys = name.split('.');
                        obj = json_Utils.findValue(keys, serializeForm);
                        obj = [obj];
                        json_Utils.nestArray(name.split('.'), obj, serializeForm);
                    }  else {
                        obj = [obj];
                        serializeForm[$(this).attr("name")] = obj;
                    }

                   // var arry = [serializeForm[$(this).attr("name")]];
                   // serializeForm[$(this).attr("name")] = arry;


                }
            }
        });


        console.log("=========================SERIALIZE FORM ");
        console.log(serializeForm);
        //console.log("================ Serialize BEFORE = ");
        //console.log(serializeForm);

        //Format the dates
        var dates = [];
       // console.log("================ DATE FORMATTING = ");
        //class^ = class starts with
        $form.find("div[class^='input-group date'] input").each(function(){
            var $this = $(this);
            var val = $(this).val();
            var name = $(this).attr("name");

            var a = name.split('.')
            console.log("a");
            console.log(a);
            var p;
            var obj;
            console.log("================ name = "+name);

            if(a.length > 1) {
                var pt = a[0];
                console.log("pt = "+pt);
                p = json_Utils.findParentPathForProperty(serializeForm, pt);
                if(p == "rootProp")
                  obj = serializeForm[pt];

                // needs to be adjusted for when there is more than 1 item in the array
                if($.isArray(obj)) {
                    obj = obj[0];
                }
                console.log("================ pt = "+pt);

            } else {
                p = json_Utils.findParentPathForProperty(serializeForm,  $this.attr("id"));
                obj = json_Utils.findObjectByPath(serializeForm, p);
            }

            console.log("================ OBJ = "+obj);
            console.log(obj);

          //  var p = json_Utils.findParentPathForProperty(serializeForm,  $this.attr("id"));
           // var obj = json_Utils.findObjectByPath(serializeForm, p);

            if(val!=null && val.length > 0){
                var displayFormat = $(this).attr("data-date-format");
                var dbFormat = $(this).attr("data-date-db-format");
                var fValue = date_Utils.convertFormat(val, displayFormat, dbFormat);

              //  var utc = date_Utils.convertToDate(val, displayFormat, dbFormat);
                if(obj === undefined){
                    serializeForm[$this.attr("id")] = fValue;
                } else {
                    obj[$this.attr("id")] =  fValue;
                }
            } else {
                if(obj === undefined){
                    serializeForm[$this.attr("id")] = "";
                } else {
                    obj[$this.attr("id")] =  "";
                }
            }
        });

       $form.find("select[data-role=tagsinput]").each(function(){
         //  console.log("INPUT TAG input ================= ");
         //  console.log(this);
            var formItem =  serializeForm[$(this).attr("id")];


            if(formItem != undefined){
                var dataLangAtt = $(this).data("lang");
                var dataCodeList = $(this).attr("data-cl-object");

              if(dataCodeList != undefined && formItem.hasOwnProperty("codes")){
                  for(var t = 0; t <formItem.codes.length; t++){
                      var codeObj = formItem.codes[t];
                      if(codeObj.hasOwnProperty("code")){
                          var code =  codeObj.code;
                          var idx = $("#"+$(this).attr("id")+" option[value='"+code+"']").index();
                          var label = this.options[idx].innerHTML;
                           var labelObj = {};
                           labelObj[o.widget.lang] = label;
                           codeObj["label"] = labelObj;
                      }
                  }
              }
             else if(dataLangAtt != undefined){
                for(var p = 0; p <formItem.length; p++){
                    var codeObj = formItem[p];
                    if(codeObj.hasOwnProperty("code")){
                        codeObj[dataLangAtt] = codeObj["code"];
                        delete codeObj["code"];
                    }
                }

               // console.log("INPUT TAG LANG ================= ");
                //console.log(dataLangAtt);
            } else {
                for(var p = 0; p <formItem.length; p++){
                    var codeObj = formItem[p];
                    if(codeObj.hasOwnProperty("code")){
                        //replace with simple array of values
                        formItem.splice(p, 1, codeObj["code"]);
                    }
                }

            }
          }



          /**  var items = $(this).tagsinput('items');
            if (nameAttr.indexOf("."+dataLangAtt) >= 0) {
                  var holder = [];

                  for(var f = 0; f<items.length; f++){
                      var holderObj = {};
                      holderObj[dataLangAtt] = items[f];
                      holderObj["value"] = items[f];
                      holder.push(holderObj);
                  }

                serializeForm[$(this).attr("id")] = holder;
            }
            else {
                serializeForm[$(this).attr("id")] = $(this).tagsinput('items');
            }   **/

        });



        /**$form.find("select[name$='.codes[]']").each(function(){
            var $this = $(this);
            var val = $(this).val();
            var name = $(this).attr("name");
           // console.log(name + " | "+val);

        });  **/



        //console.log("================ Serialize AFTER = ");
       // console.log(serializeForm);






        //  var pSerializeForm = json_Utils.parse(serializeForm)
        //console.log(pSerializeForm);

        //Format the dates

       /** for (var key in json) {
            var elem = json[key];

            if(key === prop) {
                //set global variable (elementValidationRule) if the key and prop match
                elementValidationRule = elem;
            }

            if(elem.hasOwnProperty("fields")) {
                setElementValidationRule(elem["fields"], prop);
            }

        }

        for(var i = 0; i < dates.length; i++){

             $(pSerializeForm).find('#').each(function(){
                 dates.push($(this).id);
             });
        }
        dates.each(function(){
            console.log(this);
            var input = $(this).val();
            var utc = Moment(Date.parse(input)).format();
            $(this).val(utc);

        }); **/

        //result[id] = JSON.stringify(serializeForm);
       // result[id] = serializeForm;
        result = serializeForm;
        result.isRoot = isRoot;
        if(validatedModuleForm.entityPath !=null)
            result.entityPath = validatedModuleForm.entityPath;

        if(modulePath != undefined && modulePath!= "root")  {
            result.entityPath = modulePath;//validatedModuleForm.entityPath;
        }


        if($module.hasOwnProperty("multi")){
            if($module.multi){
             result = [result];
            }
        }

        console.log("===================  FORM: getValues FINAL RESULT ========== ");
       console.log(result);

        return result;
    };







    Fx_Editor_Form.prototype.getValues1 = function (form) {
        //console.log("=================== getValues "+ $(form));
        // Prevent form submission
        // e.preventDefault();

        // var $form     = $(e.target),
        //  validator = $form.data('bootstrapValidator');
        //   $form.find('.alert').html('Thanks for signing up. Now you can sign in as ' + validator.getFieldElements('username').val()).show();


        //console.log('SUBMIT ME - VALIDATED ');
        // Get the form instance
        var $form1 = $(form);

        // console.log("=================== getValues "+e);
        //Enable clone button if disabled
        if($form1.find('.fnx-clone-button')){
            var $btn =  $form1.find('.fnx-clone-button');
            if ($btn.is(':disabled') === true) {
                // $btn.removeAttr("disabled");
                // var val =  $form1.find('#responsibleParty input:visible:first').val();
                // $form1.find('#responsibleParty legend:first label:first').html(val);
                //$form1.find('#responsibleParty').hide();
            }
        }



        // Get the BootstrapValidator instance
        var bv = $form1.data('bootstrapValidator');

        //console.log("form data =================== ");
        //console.log(bv);

        //console.log("form serialize =================== ");
       // console.log($form1.serialize());





        // var config = {};
        // $($form1).serializeArray().map(function(item) {
        //    config[item.name] = item.value;
        // });

        // console.log("form serialize json =================== ");
        // console.log(config);

        //console.log("form serialize json =================== ");
        //var data = JSON.stringify(serializeObject($form1));
        // console.log(JSON.stringify($form1.serializeObject()));
        // console.log(data);





        // Use Ajax to submit form data
        // $.post($form1.attr('action'), $form1.serialize(), function(result) {
        // ... Process the result ...
        // }, 'json');
    }

    Fx_Editor_Form.prototype.getCurrentModule = function () {
        return $module.module;
    };



    Fx_Editor_Form.prototype.refresh = function (updatedFields) {
       for(var i = 0; i < updatedFields.length; i++){
              var fieldObj = updatedFields[i];

              for(var id in fieldObj){
               if(fieldObj.hasOwnProperty(id)){
                 if($('#'+id)) {
                   $('#'+id).val(fieldObj[id]);
                   $('#'+id).attr('disabled','disabled');
                 }

               }
              }
       }
        w_Commons.raiseCustomEvent(o.container, o.events.NEW_METADATA_SUCCESS, {});

    };


    return Fx_Editor_Form;

});
