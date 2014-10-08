define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons",
    'bootstrap'
], function ($, W_Commons) {

    var o = { },
        defaultOptions = {
            widget: {
                lang: 'EN'
            },
            events: {
                READY: 'fx.catalog.module.ready',
                REMOVE: 'fx.catalog.module.remove'
            }
        };

    var cache = {},
        w_Commons, $collapse;

    function Fx_Catalog_Resume_Bar() {
        w_Commons = new W_Commons();
    }

    Fx_Catalog_Resume_Bar.prototype.init = function (options) {

        //Merge options
        $.extend(o, defaultOptions);
        $.extend(o, options);

    };

    Fx_Catalog_Resume_Bar.prototype.render = function (options) {

        this.initEventListeners();
        this.initStructure();

    };

    Fx_Catalog_Resume_Bar.prototype.initStructure = function () {

    };

    Fx_Catalog_Resume_Bar.prototype.removeItem = function (item) {
        this.findResumeItem(item).remove();
    };

    Fx_Catalog_Resume_Bar.prototype.addItem = function (item) {

        var module = this.findResumeItem(item.module);

        if (module.length !== 0) {
            var i = module.find("i"),
                text = $("<span>"+item.value+"</span>");
            module.empty().append(i).append(text);
        } else {  $(o.container).append(this.createResumeItem(item)); }

    };

    Fx_Catalog_Resume_Bar.prototype.initEventListeners = function () {

        var that = this;

        document.body.addEventListener(o.events.READY, function (e) {
            that.addItem(e.detail)
        }, false);

        document.body.addEventListener(o.events.REMOVE, function (e) {
            that.removeItem(e.detail.type)
        }, false);

    };

    Fx_Catalog_Resume_Bar.prototype.findResumeItem = function (module) {
        return  $(o.container).find('[data-module="' + module + '" ]');
    };

    Fx_Catalog_Resume_Bar.prototype.createResumeItem = function ( item ) {
        var icon;

        switch (item.module){
            case "resourceType" : icon="fa fa-database fa-fw"; break;
            case "uid" : icon="fa fa-slack fa-fw"; break;
            case "unitOfMeasure" : icon="fa fa-arrows-h fa-fw"; break;
            case "indicator" : icon="fa fa-archive fa-fw"; break;
            case "item" : icon="fa fa-dot-circle-o fa-fw"; break;
            case "coverageSector" : icon="fa fa-book fa-fw"; break;
            case "referencePeriod" : icon="fa fa-clock-o fa-fw"; break;
            case "basePeriod" : icon="fa fa-clock-o fa-fw"; break;
            case "updatePeriodicity" : icon="fa fa-calendar fa-fw"; break;
            case "region" : icon="fa fa-globe fa-fw"; break;
            case "source" : icon="fa fa-user fa-fw"; break;
            case "owner" : icon="fa fa-user fa-fw"; break;
            case "provider" : icon="fa fa-user fa-fw"; break;
        }

        return  $('<div class="fx-resume-item-selected" data-module="' + item.module + '"><i class=" ' + icon + '"></i>' + item.value + '</div>');
    };

    return Fx_Catalog_Resume_Bar;

});