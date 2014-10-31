define([
    "jquery",
    "fx-cat-br/utils/fenix-ui-creator",
    'text!fx-cat-br/json/fx-catalog-modular-form-config.json',
    "fx-cat-br/widgets/Fx-widgets-commons"
], function ($, UiCreator, config, W_Commons) {

    var o = { },
        defaultOptions = {
            widget: {
                lang: 'EN'
            },
            css_classes: {
                HEADER: "fx-catalog-modular-form-header",
                HANDLER: "fx-catalog-modular-form-handler",
                CONTENT: "fx-catalog-modular-form-content",
                CLOSE_BTN: "fx-catalog-modular-form-close-btn",
                MODULE: 'fx-catalog-form-module',
                RESIZE: "fx-catalog-modular-form-resize-btn",
                LABEL: "fx-catalog-modular-form-label"
            },
            events: {
                REMOVE_MODULE: "fx.catalog.module.remove"
            }
        }, uiCreator, w_Commons, cache = {}, modules = [];

    function Fx_catalog_modular_form() {

        uiCreator = new UiCreator();
        uiCreator.init();
        w_Commons = new W_Commons();

    }

    //(injected)
    Fx_catalog_modular_form.prototype.grid = undefined;

    Fx_catalog_modular_form.prototype.removeItem = function (item) {
        this.grid.removeItem(item)
    };

    Fx_catalog_modular_form.prototype.addItem = function (module) {

        var blank = this.getBlankModule(module);

        this.grid.addItem(blank.get(0));
        this.renderModule(blank, module);

    };

    Fx_catalog_modular_form.prototype.renderModule = function ($blank, module) {

        var c = $blank.find("." + o.css_classes.CONTENT);

        var id = "fx-catalog-module-" + w_Commons.getFenixUniqueId(),
            m = {id: cache.json[module.module].id, type: module.module};
        c.attr("id", id);

        if (cache.json[module.module].hasOwnProperty("details")){ m.details = cache.json[module.module].details; }

        modules.push(m);

        uiCreator.render({
            cssClass: "form-elements",
            container: "#" + id,
            elements: JSON.stringify([cache.json[module.module]])
        });

    };

    Fx_catalog_modular_form.prototype.getBlankModule = function (module) {

        var self = this;

        var $module = $("<div class='" + o.css_classes.MODULE + "'></div>"),
            $header = $("<div class='" + o.css_classes.HEADER + "'></div>");

        $module.attr("data-module", module.module);
        $module.attr("data-size", "half");
        $header.append("<div class='" + o.css_classes.HANDLER + "'></div>");
        $header.append("<div class='" + o.css_classes.LABEL + "'>" + cache.json[module.module]["label"][o.widget.lang] + "</div>");

        var $resize = $("<div class='" + o.css_classes.RESIZE + "'></div>");
        $resize.on("click", { module: $module.get(0), btn: $resize}, function (e) {

            if ($(e.data.module).attr("data-size") === 'half') {
                $(e.data.module).attr("data-size", "full");
                $(e.data.btn).css({
                    "background-position": "-30px -15px"
                });

            } else {
                $(e.data.module).attr("data-size", "half");
                $(e.data.btn).css({
                    "background-position": "-30px 0"
                });
            }

            self.grid.resize(e.data.module);
        });
        $header.append($resize);

        var $close_btn = $("<div class='" + o.css_classes.CLOSE_BTN + "'></div>")
            .on("click", { o: o }, function () {
                w_Commons.raiseCustomEvent(document.body, o.events.REMOVE_MODULE, { type: module.module, module: $module.get(0)});

                for (var i = 0; i < modules.length; i++) {

                    if (modules[i]["type"] === module.module) {
                        modules.splice(i, 1);
                    }
                }

            });

        $header.append($close_btn);
        $module.append($header);
        $module.append("<div class='" + o.css_classes.CONTENT + "'></div>");

        $(o.container).append($module);

        return $module;
    };

    Fx_catalog_modular_form.prototype.getValues = function (boolean) {

        return uiCreator.getValues(boolean, modules);
    };

    Fx_catalog_modular_form.prototype.initStructure = function () {

        this.grid.render();
    };

    Fx_catalog_modular_form.prototype.render = function (options) {

        $.extend(o, options);

        cache.json = JSON.parse(config);
        this.initStructure();
    };

    Fx_catalog_modular_form.prototype.init = function (options) {

        $.extend(o, defaultOptions);
        $.extend(o, options);
    };

    return Fx_catalog_modular_form;

});