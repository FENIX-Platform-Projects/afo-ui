/*global define */

define([
    'nprogress',
    'pnotify',
    'pnotify.nonblock'
], function (NProgress, PNotify) {
    var o = { };

    function PageController() {}

    //(injected)
    PageController.prototype.dataentry = undefined;

    //(injected)
    PageController.prototype.bridge = undefined;


    PageController.prototype.init = function (options) {
        //console.log("------------ (1) INIT ");

        //Merge options
        $.extend(o, options);

        this.render();
    };



    PageController.prototype.renderComponents = function () {
       // console.log("------------ (2) PAGE CONTROLLER RENDER COMPONENTS() ");
        this.dataentry.render();
    };

    PageController.prototype.initEventListeners = function () {
        var self = this;

        // Load Data
        document.body.addEventListener("fx.editor.load", function (e) {
            var url = e.detail.url,
                type = e.detail.type,
                mapping = e.detail.mapping;

          //  url = "http://localhost:8080/fnx-metadata-editor/conf/json/metadata_sample.json";
            //console.log("------------ PAGE CONTROLLER RENDER LOAD listener "+url + " |||  "+type);

          //  self.dataentry.parseData();

            //w_Commons.raiseCustomEvent(this.form, "load.editor.fx", {call: "DATA-ENTRY: LOAD"});
            //self.parseData();



            self.bridge.init(e.detail);
            NProgress.start();
            self.bridge.get(self.dataentry, self.dataentry.updateCache, self.dataentry);
        }, false);


        document.body.addEventListener("fx.editor.save", function (e) {
            //console.log("------------ PAGE CONTROLLER RENDER submit listener ");
            self.bridge.init(e.detail);
            NProgress.start();
            self.bridge.query(self.dataentry, self.dataentry.updateStorage, self.dataentry);
        }, false);


        //Save Data
        document.body.addEventListener("fx.editor.overwrite", function (e) {
            //console.log("------------ PAGE CONTROLLER RENDER submit listener ");
            self.bridge.init(e.detail);
            NProgress.start();
            self.bridge.query(self.dataentry, self.dataentry.overwriteMessage, self.dataentry);
        }, false);


        document.body.addEventListener("end.query.editor.fx", function () {
            NProgress.done();
        }, false);


        document.body.addEventListener("empty_response.query.editor.fx", function () {

            new PNotify({
                title: 'No Result Notice',
                text: 'The request has no results',
                type: 'error',
                nonblock: {
                    nonblock: true
                }
            });
        }, false);

    };

    PageController.prototype.preValidation = function () {
        if (!this.dataentry) {
            throw new Error("PAGE CONTROLLER: INVALID DATAENTRY ITEM.")
        }

    };



    PageController.prototype.render = function () {

        this.preValidation();
        this.initEventListeners();

        this.renderComponents();
    };

    return PageController;

});