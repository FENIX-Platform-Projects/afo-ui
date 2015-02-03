define([
    "jquery",
    "fx-editor/widgets/Fx-widgets-commons",
    "fx-editor/utils/Fx-json-utils",
    "fx-editor/utils/fx-ui-elements/Fx-ui-info",
    "i18n!fx-editor/nls/langProperties",
    "bootstrap"
], function ($, W_Commons, Json_Utils, UI_Info, langProperties) {

    var o = { }, selectedModule,
        defaultOptions = {
            widget: {
                lang: 'EN'
            },
            config: {
                gui: "conf/json/fx-editor-gui-config.json"
            },
            resourceType : 'dataset',
            css_classes: {
                ENTITY_SELECTED: "fx-editor-active-panel",
                SUB_ENTITY_SELECTED: "fx-editor-sub-entity-active-panel",
                ICON: "fx-editor-menu-glyphicon",
                PLUS_ICON: "fx-editor-menu-plus",
                MINUS_ICON: "fx-editor-menu-minus",
                INFO_ICON: "fx-editor-menu-info",
                REQUIRED_ICON: "fx-editor-menu-asterix"
            },
            events: {
                SELECT: 'fx.editor.menu.select',
                INIT_STORAGE: 'fx.editor.init_storage',
                SHOW: 'show.bs.collapse',
                HIDE: 'hide.bs.collapse',
                CHECK_FORM_CHANGED: 'fx.editor.form_check'
            }
        };

    var cache = {},
        w_Commons, $collapse,
        conf,
        resourceType, requiredIcon,
        json_Utils, ui_Info;

    function Fx_Editor_Menu() {
        w_Commons = new W_Commons();
        json_Utils = new Json_Utils();
        ui_Info = new UI_Info();
    }

    // =============================== Public functions ======================

    Fx_Editor_Menu.prototype.init = function (options) {

        //Merge options
        $.extend(o, defaultOptions);
        $.extend(o, options);

        conf = o.config.gui;
        resourceType = o.resourceType;



        //console.log("++++++++++++ MENU resourceType = "+ resourceType);

    };

    Fx_Editor_Menu.prototype.render = function (options, callback) {
        $.extend(o, options);

        var self = this;

        if(o.config.hasOwnProperty("cache")){
            if(o.config.cache.hasOwnProperty("gui")){
              cache.json = o.config.cache.gui;
            }

            if(o.config.cache.hasOwnProperty("validation")){
                cache.jsonvalidation = o.config.cache.validation;
            }
        }


        //console.log("============================== CACHE JSON =======================");
       // console.log(cache.json);

        if(cache.json !=undefined){
            self.initStructure();
            var panels = self.renderMenu(cache.json);
            callback(panels);
        } else {
            //Cache json GUI configuration file
            $.when($.get(conf))
                .done(function( guiJsn ) {
                    cache.json = guiJsn//JSON.parse(data);
                    self.initStructure();
                    var panels = self.renderMenu(cache.json);
                    callback(panels);
            });
        }



       // var $.getJSON(){

        //}
      //  console.log("++++++++++++ MENU RENDER  conf = "+ conf +' confy ');

       // cache.json = JSON.parse(confy);

       // this.initStructure();
       // this.renderMenu(cache.json);
    };

    Fx_Editor_Menu.prototype.initStructure = function () {

        o.collapseId = "fx-collapse-" + w_Commons.getFenixUniqueId();

        $collapse = $('<div class="panel-group" id="accordion"></div>');
        $collapse.attr("id", o.collapseId);

        $(o.container).append($collapse);

    };

    Fx_Editor_Menu.prototype.renderMenu = function (json) {

        var self = this;

        if (json.hasOwnProperty("panels")) {

            var panels = json.panels;

            for (var i = 0; i < panels.length; i++) {
                if(panels[i].hasOwnProperty("resourceType")){
                    if($.inArray(o.resourceType, panels[i].resourceType) >= 0) {
                   // if(panels[i].resourceType == o.resourceType){
                        $collapse.append(self.buildPanel(panels[i]));
                    }
                    continue;
                }

                $collapse.append(self.buildPanel(panels[i]))
            }

            $(o.container).append($collapse)

            //Default first panel as selected
           // self.setDefault();

        } else {
            throw new Error("Fx_Editor_Menu: no 'panels' attribute in config JSON.")
        }

       return panels;
    };

    //First Panel Selected as Default
    Fx_Editor_Menu.prototype.setDefault = function () {
        var firstPanel = $("#fx-editor-menu .panel:first");
        var href = $(firstPanel).find("a");
        $(href).trigger('click');
    }

    Fx_Editor_Menu.prototype.buildPanel = function (panel) {
        var self = this,
            id = "fx-collapse-panel-" + w_Commons.getFenixUniqueId(),
            requiredEntity = false, jsnModulesValidation;

        var $p = $(document.createElement("DIV"));
        $p.addClass("panel");
        $p.addClass("panel-default");

        $p.on( o.events.HIDE, {
            value: false,
            child: false,
            label: null
        }, self.toggleImageHighlight );

        $p.on( o.events.SHOW, {
            value: true,
            child: false,
            label: null
        }, self.toggleImageHighlight );


        if(cache.jsonvalidation != undefined){
         var entity = json_Utils.findParentPathForValue(cache.jsonvalidation, panel.module);
            if(entity){
                if(entity!=null) {
                    var jsnObj =  json_Utils.findObjectByPath(cache.jsonvalidation, entity);

                    if(jsnObj.hasOwnProperty("type")){
                      if(jsnObj.type == "required")
                        requiredEntity = true;
                    }
                    if(jsnObj.hasOwnProperty("modules")){
                        jsnModulesValidation = jsnObj.modules;
                    }


                }
            }
        }


        $p.append(self.buildPanelHeader(panel, id, o.collapseId, requiredEntity));
        $p.append(self.buildPanelBody(panel, id, jsnModulesValidation));

        return $p;
    };


    Fx_Editor_Menu.prototype.buildPanelHeader = function (panel, id, parentId, requiredEntity) {
        //Init header
        var self = this;
        var $header = $('<div class="panel-heading"></div>'),
            $label = $('<h5></h5>'),
            $a = $('<a data-toggle="collapse"></a>'),
            $plus = $('<span class="'+o.css_classes.ICON+' '+o.css_classes.PLUS_ICON+'"></span>'),
            $info = $('<button class="btn btn-default btn-xs pull-right" type="button"><span class="'+o.css_classes.ICON+' '+o.css_classes.INFO_ICON+'"></span></button>');

        $label.addClass("panel-title");
        $label.addClass("fx-menu-entity-title");


        //Initialize Storage
        w_Commons.raiseCustomEvent(o.container, o.events.INIT_STORAGE, {id: panel.module, call: "MENU INIT_STORAGE"});


        $header.on('click', {module:panel}, function (e) {
            var $header = $(this);
            if ($header.is(':disabled') === false) {
                //  $p.attr("disabled", "disabled");
                self.activateAllButtons();
                selectedModule = panel;


                w_Commons.raiseCustomEvent(o.container, o.events.SELECT, {module: e.data.module, gui: cache.json, call: "MENU SELECT"});
               // w_Commons.raiseCustomEvent(o.container, o.events.SELECT, e.data.module);
                // }
            }
        });


        if(parentId.indexOf("accordion-") > -1) {
            $label.removeClass("fx-menu-entity-title");
            $label.addClass("fx-menu-sub-entity-title");

            $header.addClass("fx-editor-sub-entity");

        } else {
            $header.addClass("fx-editor-entity");
        }


        $a.attr("data-parent", "#" + parentId);
        $a.attr("href", "#" + id);

        if (panel.hasOwnProperty("modules")){
            $a.append($plus);
        }

        if (panel.hasOwnProperty("label")) {
            $a.append(panel["label"][o.widget.lang]);
        }

        if(requiredEntity)  {
            var $required = $('<span class="'+o.css_classes.ICON+' '+o.css_classes.REQUIRED_ICON+'" title="'+langProperties.requiredMetadataEntity+'"></span>');
            $a.append($required);
        }

      if (panel.hasOwnProperty("info")) {
           // console.log("ITEM IS  = "+ panel["label"][o.widget.lang] + " has INFO");
            if(panel["info"].hasOwnProperty("popover")){
                ui_Info.createPopOver($info, panel["info"]["popover"][o.widget.lang]);
            }
            else if(panel["info"].hasOwnProperty("remote-html")){
                ui_Info.createModal($info, panel["info"]["remote-html"][o.widget.lang], '#infoModal');
            }

            return $header.append($label.append($a).append($info));
        }  else {
            //console.log("ITEM IS  = "+ panel["label"][o.widget.lang] + " has NOO INFO");
            return $header.append($label.append($a));
        }


       // if(parentId.indexOf("accordion-") > -1) {
        //    $header.addClass("fx-editor-sub-entity");
      //      console.log("SUB_ENTITY ITEM IS  = "+ panel["label"][o.widget.lang]);
        //    return $header.append($label.append($a));
      //  }
       // else {
            //console.log("ENTITY: ITEM IS  = "+ panel["label"][o.widget.lang]);
          //  $header.addClass("fx-editor-entity");
          //  return $header.append($label.append($a).append($info));
       // }

    };

    Fx_Editor_Menu.prototype.buildPanelBody = function (panel, id, jsnModulesValidation) {
        var self = this;

        //Init panel body
        var $bodyContainer = $("<div class='panel-collapse collapse'></div>");
        $bodyContainer.attr("id", id);

        if (panel.hasOwnProperty("modules")) {
            var $body = $('<div class="panel-body"></div>');
            var modules = panel.modules;

            self.buildModules(panel.modules, $body,  $bodyContainer, jsnModulesValidation);

        }

        return $bodyContainer;
    };


    Fx_Editor_Menu.prototype.highlight = function (module) {

        $(o.container).find("[data-module='" + module + "']").removeAttr("disabled");

    };




    Fx_Editor_Menu.prototype.toggleImageHighlight = function (e) {

       // w_Commons.raiseCustomEvent(o.container, o.events.CHECK_FORM_CHANGED, {call: "MENU toggleImageHighlight"});


        // fx-editor-menu-glyphicon fx-editor-menu-plus
        $(e.target).prev('.panel-heading').find('span.'+o.css_classes.ICON).toggleClass(o.css_classes.PLUS_ICON+' '+o.css_classes.MINUS_ICON);

        var parent = $(e.target).prev('.panel-heading').find('a').attr('data-parent');

        // console.log('LABEL = '+  parent);
        //$('#main div').not('.no div')

        $('.panel-collapse.collapse.in').each(function(){
            // $(e.target).prev('.panel-heading').find('span.fx-editor-menu-glyphicon').toggleClass('fx-editor-menu-plus fx-editor-menu-minus');
            //  $(this).removeClass('in');
            // $(this).addClass('.panel-collapse.collapse');

            // $(this).html("Found: " + $(this).attr("id"));
            //console.log("Found: " + $(this).attr("id"));
        });


        if(typeof parent!='undefined' && parent.indexOf("accordion-") > -1) {
            // if(parent.indexOf("accordion-") > -1) {
            if(e.data.value)
                $(e.target).prev('.panel-heading').addClass(o.css_classes.SUB_ENTITY_SELECTED);
            else
                $(this).find('.panel-heading').not($(e.target)).removeClass(o.css_classes.SUB_ENTITY_SELECTED);
        }
        else {
            if(e.data.value) {
                $(e.target).prev('.panel-heading').addClass(o.css_classes.ENTITY_SELECTED);
            }
            else  {
                $(this).find('.panel-heading').not($(e.target)).removeClass(o.css_classes.ENTITY_SELECTED);
                //$(this).find('.panel-heading').not($(e.target)).removeClass(o.css_classes.SUB_ENTITY_SELECTED);
            }
        }
    };


    Fx_Editor_Menu.prototype.buildModules = function (modules, body, bodyContainer, jsnModulesValidation) {
        var self = this;
        var requiredSubEntity = false;

        for (var j = 0; j < modules.length; j++) {
            var current = modules[j];

            if(jsnModulesValidation != undefined){
                var entity = json_Utils.findParentPathForValue(jsnModulesValidation, current.module);
                if(entity){
                    if(entity!=null) {
                        var jsnObj =  json_Utils.findObjectByPath(jsnModulesValidation, entity);
                        if(jsnObj.hasOwnProperty("type")){
                            if(jsnObj.type == "required")
                                requiredSubEntity = true;
                        }
                        if(jsnObj.hasOwnProperty("modules")){
                            jsnModulesValidation = jsnObj.modules;
                        }
                    }
                }
            }


            if(current.hasOwnProperty("resourceType")){
                if($.inArray(o.resourceType, current.resourceType) >= 0) {
                 //   if(current.resourceType == o.resourceType){
                    self.build(current, body, modules, j, jsnModulesValidation, requiredSubEntity);
                    bodyContainer.append(body);
                }
                continue;
            }

            self.build(current, body, modules, j, jsnModulesValidation, requiredSubEntity);
            bodyContainer.append(body);

        }

    };


    Fx_Editor_Menu.prototype.build = function (current, body, modules, j, jsnModulesValidation, requiredSubEntity) {
    var self = this;
    var $module = $("<div></div>");

    if (current.modules && current.modules.length > 0) {
        var $module = $("<div class='collapse-group'></div>");

        $module.addClass("panel");
        $module.addClass("panel-default");

        $module.attr("id", "accordion-"+current.module);

        $module.append(self.buildPanelHeader(current, current.module,  $module.attr("id"), requiredSubEntity));
        $module.append(self.buildPanelBody(current, current.module, jsnModulesValidation));

        body.append($module);

    } else {

        var $btn = $('<button type="button" class="btn btn-default"></button>'),
            $info = $('<button class="btn btn-default btn-xs" type="button"><span class="'+o.css_classes.ICON+' '+o.css_classes.INFO_ICON+'"></span></button>');


        //Initialize Storage
        w_Commons.raiseCustomEvent(o.container, o.events.INIT_STORAGE, {id: current.module, call: "MENU INIT_STORAGE"});


        //  var $info = $('<button class="btn btn-default btn-xs pull-right" type="button"><span class="'+o.css_classes.ICON+' '+o.css_classes.INFO_ICON+'"></span></button>');

        //  var  $btn = $('<button type="button" class="btn btn-default btn-block"></button>');

        $btn.on('click', {module: modules[j] }, function (e) {
            var $btn = $(this);
            //modules[j]["parent"] = e.data.parent;
            //console.log("++++++++++++++++++++ e.data");
            //console.log(e.data);


            if ($btn.is(':disabled') === false) {
                self.activateAllButtons();

                //alert('e.data.module id = '+e.data.module.id);
                $btn.attr("disabled", "disabled");
                // console.log('%%% BUTTON ON CLICK PANEL e.data.module = '+  e.data.module);
                // console.log('MENU e.data.module = '+  e.data.module);

                w_Commons.raiseCustomEvent(o.container, o.events.SELECT, {module: e.data.module, call: "SUB-MENU SELECT"});

                // w_Commons.raiseCustomEvent(o.container, o.events.SELECT, e.data.module)
            }

        });

        if (current.hasOwnProperty("id")) {
            $btn.attr("id", current.id);
        }

        if (current.hasOwnProperty("module")) {
            var path = json_Utils.findParentPathForValue(cache.json, current.module);
            var parentPath = self.getParentPath(path);
            modules[j]["parent"] = parentPath;

            $btn.attr("data-module", modules[j].module);
            $btn.attr("data-path", path);
        }

        //Keep it before the label to have the icon in its the left side
        if (current.hasOwnProperty("icon")) {
            $btn.append($('<span class="' + current.icon + '"></span>'));
        }

        if (current.hasOwnProperty("label")) {
            $btn.append(current.label[o.widget.lang]);
        }

       if(requiredSubEntity){
           var $required = $('<span class="'+o.css_classes.ICON+' '+o.css_classes.REQUIRED_ICON+'" title="'+langProperties.requiredMetadataSubEntity+'"></span>');
           $btn.append($required);
       }

        //$buttonContainer.append($btn);

        if (current.hasOwnProperty("info")) {
            if(current["info"].hasOwnProperty("popover")){
                ui_Info.createPopOver($info, current["info"]["popover"][o.widget.lang]);
            }
            else if(current["info"].hasOwnProperty("remote-html")){
                ui_Info.createModal($info, current["info"]["remote-html"][o.widget.lang], '#infoModal');
            }

            $module.append($btn).append($info);
            // $infoContainer.append($info);
        }  else {
            $module.append($btn);
        }

        //$module.append($btn).append($infoContainer);

        // $module.append($btn);
        body.append($module);
    }
    };

    Fx_Editor_Menu.prototype.getParentPath = function (path) {

        var keys = path.split(".");
        var parentPath = "";
        var key;
        for(var k =0; k < keys.length; k++){
            if(k == 0){
                key = keys[k];
            } else
            {
                key = key + '.' +  keys[k];
            }
            var ob = json_Utils.findObjectByPath(cache.json, key);
            parentPath = parentPath + ob.module + ".";

        }

        return  parentPath.slice(0,-1);

    };

    Fx_Editor_Menu.prototype.getSelectedModule = function () {
        return selectedModule;
    };



    Fx_Editor_Menu.prototype.activateAllButtons = function () {
        $(o.container).find("button[data-module]").removeAttr("disabled");
    };

    return Fx_Editor_Menu;

});
