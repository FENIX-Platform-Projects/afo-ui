/*global define */

define([
    'jquery',
    //'pnotify',
    //'lib/pnotify.nonblock',
    'lib/tweenmax'
], function ($) {

    var defaultOptions = {
        selectors: {
            EVENTS_LISTENERS: 'body'
        },
        events: {
            CREATE_PANEL: "",
            ADD_ITEM: "",
            CLONE_ITEM: 'cloneDeskItem',
            REMOVE_ITEM: "removeItemFromDesk",
            MINIMIZE_ITEM: "minimizeDeskItem",
            MOVE_TO_DESK: "moveToDesk",
            REMOVE_STACK: "removeStackItem"
        },
        storage: {
            CATALOG: 'fx.catalog',
            STACK: 'fx.stack'
        }
    };

    function PageController(options) {

        if (this.o === undefined) {
            this.o = {};
        }
        $.extend(true, this.o, defaultOptions, options);
    }

    //(injected)
    PageController.prototype.desk = undefined;

    //(injected)
    PageController.prototype.catalog = undefined;

    //(injected)
    PageController.prototype.stack = undefined;

    //(injected)
    PageController.prototype.storage = undefined;

    //(injected)
    PageController.prototype.bridge = undefined;

    PageController.prototype.saveDeskToStorage = function (model) {

        var that = this;

        this.storage.getItem(this.o.storage.CATALOG, function (item) {
            var a = JSON.parse(item) || [];
            a.push(model.resources[0].metadata.uid);
            that.storage.setItem(that.o.storage.CATALOG, JSON.stringify(a));
        });
    };

    PageController.prototype.removeDeskItemFromStorage = function (model) {

        var that = this;
        this.storage.getItem(this.o.storage.CATALOG, function (item) {
            var a = JSON.parse(item) || [];
            var index = $.inArray(model.resources[0].metadata.uid, a);
            a.splice(index, 1);
            that.storage.setItem(that.o.storage.CATALOG, JSON.stringify(a));
        });
    };

    PageController.prototype.loadDeskFromStorage = function () {
        var that = this;
        this.storage.getItem(this.o.storage.CATALOG, function (items) {
            var datasets;

            if (items) {
                datasets = JSON.parse(items);
                for (var i = 0; i < datasets.length; i++) {
                    that.getData(datasets[i], $.proxy(that.addItemToDesk, that));
                }
            }
        });
    };

    PageController.prototype.saveStackToStorage = function (model) {

        var that = this;
        this.storage.getItem(this.o.storage.STACK, function (item) {
            var a = JSON.parse(item) || [];
            a.push(model.resources[0].metadata.uid);
            that.storage.setItem(that.o.storage.STACK, JSON.stringify(a));
        });
    };

    PageController.prototype.loadSackFromStorage = function () {
        var that = this;
        this.storage.getItem(this.o.storage.STACK, function (items) {
            var datasets;

            if (items) {
                datasets = JSON.parse(items);
                for (var i = 0; i < datasets.length; i++) {
                    that.getData(datasets[i], $.proxy(that.addItemToStack, that));
                }
            }
        });
    };

    PageController.prototype.removeStackItemFromStorage = function (model) {

        var that = this;
        this.storage.getItem(this.o.storage.STACK, function (item) {
            var a = JSON.parse(item) || [];
            var index = $.inArray(model.resources[0].metadata.uid, a);
            a.splice(index, 1);
            that.storage.setItem(that.o.storage.STACK, JSON.stringify(a));
        });
    };

    PageController.prototype.initAnimation = function () {

        var that = this;

        $('.overlay-content').hide();

        $("#btn").on('click', that.openOverlay);

        $(".closeOverlay").on('click', function (e) {
            e.stopPropagation();
            that.closeOverlay();
        });
    };

    PageController.prototype.openOverlay = function () {

        TweenLite.to(
            document.querySelector("#overlay"), 1,
            {
                width: "100%",
                height: "100%",
                ease: Power2.easeInOut,
                onComplete: function () {
                    $('.overlay-content').fadeIn('fast');
                }
            });
    };

    PageController.prototype.closeOverlay = function () {
        $('.overlay-content').fadeOut("fast", function () {

            $('.overlay-content').hide();
            TweenLite.to($("#overlay"), 1, { width: "0%", height: "0%", ease: Power2.easeInOut});

        })
    };

    PageController.prototype.preValidation = function () {

    };

    PageController.prototype.addItemToDesk = function (item) {
        this.desk.addItem(item);
    };

    PageController.prototype.removeItemFromDesk = function (item) {
        this.desk.removeItem(item);
    };

    PageController.prototype.addItemToStack = function (item) {
        this.stack.addItem(item);
    };

    PageController.prototype.removeItemFromStack = function (item) {
        this.stack.removeItem(item);
    };

    PageController.prototype.loadSession = function () {

        //load Desk
        this.loadDeskFromStorage();
        //load Stack
        this.loadSackFromStorage();
    };

    PageController.prototype.getData = function (uid, callback) {

        var settings = {
            uid: uid,
            success: callback
        };
        this.bridge.query(settings);
    };

    PageController.prototype.renderComponents = function () {

        this.desk.render();
        this.catalog.render();
        this.stack.render();

        this.initAnimation();
    };

    PageController.prototype.initEventListeners = function () {

        var that = this;

        $(this.o.selectors.EVENTS_LISTENERS).on('analyze', function (e, payload) {
            that.closeOverlay();
            that.getData(payload, $.proxy(that.addItemToDesk, that))
        });

        $(this.o.selectors.EVENTS_LISTENERS).on(this.o.events.CLONE_ITEM, function (e, model) {
            that.saveDeskToStorage(model);
            that.addItemToDesk(model);
        });

        $(this.o.selectors.EVENTS_LISTENERS).on(this.o.events.REMOVE_ITEM, function (e, container, model) {
            that.removeDeskItemFromStorage(model);
            that.removeItemFromDesk(container);
        });

        $(this.o.selectors.EVENTS_LISTENERS).on(this.o.events.MINIMIZE_ITEM, function (e, container, model) {
            that.saveStackToStorage(model);
            that.removeDeskItemFromStorage(model);

            that.addItemToStack(model);
            that.removeItemFromDesk(container);
        });

        $(this.o.selectors.EVENTS_LISTENERS).on(this.o.events.MOVE_TO_DESK, function (e, model, container) {
            that.removeStackItemFromStorage(model);
            that.saveDeskToStorage(model);
            that.addItemToDesk(model);
            that.removeItemFromStack(container);
        });

        $(this.o.selectors.EVENTS_LISTENERS).on(this.o.events.REMOVE_STACK, function (e, model, container) {
            that.removeStackItemFromStorage(model);
            that.removeItemFromStack(container);
        });
    };

    PageController.prototype.render = function () {

        this.preValidation();
        this.initEventListeners();
        this.renderComponents();
        this.loadSession();
    };

    return PageController;
});