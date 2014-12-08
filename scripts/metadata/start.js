/*global define */

define(["fx-editor/controllers/Fx-editor-page",
        "fx-editor/controllers/Fx-editor-data-entry",
        "fx-editor/widgets/data-entry/Fx-editor-menu",
        "fx-editor/widgets/data-entry/Fx-editor-form",
        "fx-editor/widgets/data-entry/Fx-editor-progress",
        "fx-editor/widgets/bridge/Fx-editor-bridge",
        "text!fx-editor/templates/fx_editor_template.html",
        'i18n!fx-editor/nls/langProperties',
 	'fenix-ui-topmenu/main',
        'handlebars',
        'module'
    ],
    function (Controller, DataEntryController, Menu, Form, Progress, Bridge, template, langProperties, TopMenu, Handlebars, module) {

         var html_ids = {
            MAIN_CONTAINER: "#metadataEditorContainer",
            MENU: "fx-editor-menu",
            FORM: "fx-editor-form",
            PROGRESS: "fx-editor-progress"
        };

        function StartUp() {
         }


        StartUp.prototype.init = function (options) {

	 new TopMenu({ 
		    url : 'json/fenix-ui-topmenu_config.json'
		    , active: "metadata"
		});


            if (!options.hasOwnProperty('container')){
                throw 'Metadata Editor needs a container!'
            }

           // console.log("startUp: locale = "+ localStorage.getItem('locale'));

            var context = {
                resourceType: options.resourceType
            };

            var compiledTmpl = Handlebars.compile(template, context);
            $(options.container).html(compiledTmpl({ langProperties: langProperties, context: context}));



           // $(options.container).html(structure);

            var pageController = new Controller();

            // Perform dependency injection by extending objects
            $.extend(pageController, {
                dataentry: this.initDataEntry(options),
                bridge: this.initBridge()
            });

            pageController.render();

        };

        StartUp.prototype.initDataEntry = function (options) {

            var dataEntryController = new DataEntryController(),
                menu = new Menu(),
                form = new Form(),
                progress = new Progress(),
                lang = "EN",
                guiConfig,
                validationConfig,
                jsonMappingConfig,
                ajaxConfig,
                datesConfig;

            // guiConfig = options.config.gui;
            // validationConfig = options.config.validation;
            /// jsonMappingConfig = options.config.jsonMapping;
            //ajaxConfig = options.config.ajaxEventCalls;


           if (!options.hasOwnProperty('config')){
                guiConfig = "conf/json/fx-editor-gui-config.json";
                validationConfig = "conf/json/fx-editor-validation-config.json";
                jsonMappingConfig = "conf/json/fx-editor-mapping-config.json";
                ajaxConfig = "conf/json/fx-editor-ajax-config.json";
               datesConfig = "conf/json/fx-editor-dates-config.json";

               options.config.gui = guiConfig;
               options.config.validation = validationConfig;
               options.config.jsonMapping= jsonMappingConfig;
               options.config.ajaxEventCalls = ajaxConfig;
               options.config.dates = datesConfig;

           }
           else {
                    if (!options['config'].hasOwnProperty('gui')){
                        throw 'Metadata Editor needs to have the "gui" JSON config'
                    }
                    if (!options['config'].hasOwnProperty('validation')){
                        throw 'Metadata Editor needs to have the "validation" JSON config'
                    }
                    if (!options['config'].hasOwnProperty('jsonMapping')){
                        throw 'Metadata Editor needs to have the "jsonMapping" JSON config'
                    }
                    if (!options['config'].hasOwnProperty('ajaxEventCalls')){
                        throw 'Metadata Editor needs to have the "eventCalls" JSON config'
                    }

                   if (!options['config'].hasOwnProperty('dates')){
                       throw 'Metadata Editor needs to have the "dates" JSON config'
                   }

               // guiConfig = options.config.gui;
               // validationConfig = options.config.validation;
               /// jsonMappingConfig = options.config.jsonMapping;
                //ajaxConfig = options.config.ajaxEventCalls;
            }

            if (!options.hasOwnProperty('source')){
                options.source = null;
            }

            if (options.hasOwnProperty('source')){
                if(options.source != null){
                    if (!options.source.hasOwnProperty('url')){
                        throw 'Metadata Editor "source" property needs to have a "url" property'
                    }
                    if (!options.source.hasOwnProperty('type')){
                        throw 'Metadata Editor "source" property needs to have a "type" property'
                    }
                }
                options.source = options['source'];
            }

            if (options.hasOwnProperty('widget')){
                if (options['widget'].hasOwnProperty('lang')){
                    lang = options['widget'].lang;
                }
            } else {
                options.widget.lang = lang;
            }


            if (options.hasOwnProperty('resourceType')){
                options.resourceType = options['resourceType'];
            }




            //console.log("=================================================== RESOURCE TYPE = "+options.resourceType);

            //dataEntryController.init(options);
            dataEntryController.init({
               config: options.config,
               source: options.source,
               resourceType: options.resourceType,
               widget: {lang: options.widget.lang}
            });

            menu.init({
                container: document.querySelector("#" + html_ids.MENU),
                config: options.config,
                resourceType: options.resourceType,
                widget: {lang: options.widget.lang}
            });
            form.init({
                container: document.querySelector("#" + html_ids.FORM),
                resourceType: options.resourceType,
                config: options.config,
                widget: {lang: options.widget.lang}
            });
            progress.init({
                container: document.querySelector("#" + html_ids.PROGRESS),
                widget: {lang: options.widget.lang}
            });


            // Perform dependency injection by extending objects
            $.extend(dataEntryController, {
                menu: menu,
                form: form,
                progress: progress
            });

            return dataEntryController;

        };

        StartUp.prototype.initBridge = function () {
            var bridge = new Bridge();
            bridge.init();
            return bridge;
        };

        return StartUp;

    });
