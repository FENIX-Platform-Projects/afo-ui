define([
    "jquery",
    "fx-editor/widgets/Fx-widgets-commons",
    "fx-editor/utils/Fx-json-utils",
    "fx-editor/utils/fx-ui-elements/Fx-ui-info",
    "bootstrap"
], function ($, W_Commons, Json_Utils, UI_Info) {

    var o = { }, $progressPanel, $panelBody,
        defaultOptions = {
            widget: {
                lang: 'EN'
            },
            config: {
                gui: "conf/json/fx-editor-gui-config.json"
            },
            css_classes: {
                ENTITY_SELECTED: "fx-editor-active-panel",
                SUB_ENTITY_SELECTED: "fx-editor-sub-entity-active-panel",
                ICON: "fx-editor-menu-glyphicon",
                PLUS_ICON: "fx-editor-menu-plus",
                MINUS_ICON: "fx-editor-menu-minus",
                INFO_ICON: "fx-editor-menu-info"
            },
            events: {
                SELECT: 'fx.editor.module.select',
                INIT_STORAGE: 'fx.editor.module.init_storage',
                SHOW: 'show.bs.collapse',
                HIDE: 'hide.bs.collapse'
            }
        };

    var cache = {},
        w_Commons, $collapse,
        conf,
        json_Utils, ui_Info;

    function Fx_Editor_Progress() {
        w_Commons = new W_Commons();
        json_Utils = new Json_Utils();
        ui_Info = new UI_Info();
    }

    // =============================== Public functions ======================

    Fx_Editor_Progress.prototype.init = function (options) {
        //Merge options
        $.extend(o, defaultOptions);
        $.extend(o, options);

        conf = o.config.gui;

    };

    Fx_Editor_Progress.prototype.render = function (options) {
        $.extend(o, options);

        var self = this;
        //console.log("======================== IN PROGRESS render");
        //Cache json GUI configuration file
        $.when($.get(conf))
            .done(function( guiJsn ) {
                cache.json = guiJsn//JSON.parse(data);
                self.initStructure();
                self.renderProgressBar(cache.json);
        });

    };



    Fx_Editor_Progress.prototype.initStructure = function () {
        o.progressPanelId = "fx-progress-panel" + w_Commons.getFenixUniqueId();
        //console.log("======================== IN PROGRESS initStructure");
        //Create the progress panel
        $progressPanel = $('<div class="panel panel-default"></div>');
        $progressPanel.attr("id", o.progressPanelId);

        var $panelHeader = $('<div class="panel-heading fx-editor-active-panel"></div>'),
            $label = $('<h3 class="panel-title">Metadata Entities</h3>');

        $panelBody = $('<div class="panel-body fx-editor-progress"></div>');

        $progressPanel.append($panelHeader.append($label));

        //console.log("==================================== IN PROGRESS initStructure container = "+ o.container)
        $(o.container).append($progressPanel);

    };

    /**
    <div class="circle done">
        <span class="label">1</span>
        <span class="title">Personal</span>
    </div>
    <span class="bar done"></span>
        <div class="circle done">
            <span class="label">2</span>
            <span class="title">Address</span>
        </div>
        <span class="bar half"></span>
        <div class="circle active">
            <span class="label">3</span>
            <span class="title">Payment</span>
        </div>
        <span class="bar"></span>
        <div class="circle">
            <span class="label">4</span>
            <span class="title">Review</span>
        </div>
        <span class="bar"></span>
        <div class="circle">
            <span class="label">5</span>
            <span class="title">Finish</span>
        </div>
        **/
    Fx_Editor_Progress.prototype.renderProgressBar = function (json) {
        var self = this;
        //console.log("======================== IN PROGRESS renderProgressBar");
        if (json.hasOwnProperty("panels")) {

            var panels = json.panels;

            for (var i = 0; i < panels.length; i++) {
                var panel = panels[i];
                //console.log("======================== IN PROGRESS ");
                $panelBody.append("<div class='circle done'><span class='label'>"+(i+1)+"</span><span class='title'>"+panel["label"][o.widget.lang]+"</span></div>")

            if(i < panels.length-1)
              $panelBody.append("<span class='bar'></span>")
            }

           $progressPanel.append($panelBody);

        } else {
            throw new Error("Fx_Editor_Progress: no 'panels' attribute in config JSON.")
        }

    };


    return Fx_Editor_Progress;

});