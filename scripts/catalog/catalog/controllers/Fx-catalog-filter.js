/*global define */

define([
    "fx-cat-br/plugins/Fx-catalog-brigde-filter-plugin",
    "fx-cat-br/widgets/Fx-widgets-commons"
], function (Plugin, W_Commons) {

    var w_Commons,
        o = {
            name : 'fx-catalog-filter',
            events: {
                SELECT : "fx.catalog.module.select",
                REMOVE: "fx.catalog.module.remove"
            }
        };

    var selectors = {
        CONTAINER : ".fx-catalog-modular-filter-container",
        TOGGLE_BTN: ".fx-catalog-header-btn-close"
    };

    function FilterController() {

        this.publishFxCatalogBridgePlugin();

        w_Commons = new W_Commons();

    }

    //(injected)
    FilterController.prototype.menu = undefined;

    //(injected)
    FilterController.prototype.form = undefined;

    //(injected)
    FilterController.prototype.resume = undefined;

    //(injected)
    FilterController.prototype.submit = undefined;

    FilterController.prototype.initSubmit = function () {
        var self = this;

        $(this.submit).on("click", function () {
            w_Commons.raiseCustomEvent(self.submit, "submit.catalog.fx", {});
        });
    };

    FilterController.prototype.renderComponents = function () {

        this.menu.render();
        this.form.render();
        this.resume.render();
    };

    FilterController.prototype.initEventListeners = function () {

        var self = this;

        document.body.addEventListener(o.events.SELECT, function (e) {
            self.form.addItem(e.detail);
        }, false);

        document.body.addEventListener(o.events.REMOVE, function (e) {
            self.menu.activate(e.detail.type);
            self.form.removeItem(e.detail.module);
        }, false);

        $(selectors.TOGGLE_BTN).on('click', {self: this},function(e){

            if ( $(selectors.CONTAINER).is(":visible") ) {
                e.data.self.collapseFilter();
            } else {
                e.data.self.openFilter();
            }
        })
    };

    FilterController.prototype.preValidation = function () {

        if (!this.menu) {
            throw new Error("FilterController: INVALID MENU ITEM.")
        }
        if (!this.form) {
            throw new Error("FilterController: INVALID FORM ITEM.")
        }
        if (!this.submit) {
            throw new Error("FilterController: INVALID SUBMIT ITEM.")
        }
        if (!w_Commons.isNode(this.submit)) {
            throw new Error("FilterController: SUBMIT NOT DOM NODE.")
        }

    };

    FilterController.prototype.render = function () {

        this.preValidation();
        this.initEventListeners();
        this.initSubmit();

        this.renderComponents();
    };

    FilterController.prototype.publishFxCatalogBridgePlugin = function () {

        //FENIX Catalog Plugin Registration
        if (!window.Fx_catalog_bridge_plugins) {
            window.Fx_catalog_bridge_plugins = {};
        }
        window.Fx_catalog_bridge_plugins[o.name] = new Plugin();

    };

    FilterController.prototype.getValues = function (boolean) {
        return this.form.getValues(boolean);
    };

    FilterController.prototype.getName = function () {
        return o.name;
    };

    FilterController.prototype.collapseFilter = function () {

        $(selectors.CONTAINER).hide();
    };

    FilterController.prototype.openFilter = function () {

        $(selectors.CONTAINER).show();
    };

    return FilterController;

});