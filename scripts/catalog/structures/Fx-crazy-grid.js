/*global define*/

define([
    'jquery',
    'fx-cat-br/widgets/Fx-widgets-commons',
    "lib/stroll"
], function ($, W_Commons, Stroll) {

    var o = { },
        defaultOptions = {
            data_filter_value: "data-filter-value",
            css_filter_active: "catalog-filter-active"
        };

    var isotope, w_Commons;

    function loadCss(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    function Fx_Filterable_grid() {
        w_Commons = new W_Commons();
    }

    Fx_Filterable_grid.prototype.initBtns = function () {

        // filter items on button click
        $(o.filters).on('click', 'button', function (event) {
            this.filterIsotope({ filter: $(this).attr(o.data_filter_value) });
            $(o.filters).find(" button").removeClass(o.css_filter_active);
            $(this).addClass(o.css_filter_active);
        });

        $(o.filters).find("button[" + o.data_filter_value + "='*']").addClass(o.css_filter_active);

    };

    Fx_Filterable_grid.prototype.clear = function () {
        //TODO
    };

    Fx_Filterable_grid.prototype.addItems = function (items) {

        var li = document.createElement("LI");
            li.appendChild(items);
        document.querySelector("#crazy-scroll").appendChild(li);

    };

    Fx_Filterable_grid.prototype.validateOptions = function () {

        //Validate HTML Container
        if (!w_Commons.isElement(o.container)) {
            throw new Error("Filterable Grid: INVALID_CONTAINER.")
        }
    };

    Fx_Filterable_grid.prototype.render = function (options) {

        $.extend(o, options);

        this.validateOptions();

        // Makes stroll.js monitor changes to the DOM (like adding or resizing items).
        // This is taxing on performance, so use scarcely. Defaults to false.
        stroll.bind( "#crazy-scroll" , { live: true } );

        if (o.filters) {
            this.initBtns();
        }
    };

    Fx_Filterable_grid.prototype.init = function (baseOptions) {

        //Merge options
        $.extend(o, defaultOptions);
        $.extend(o, baseOptions);
        loadCss("css/stroll.css");
        loadCss("css/strollexample.css");


    };

    Fx_Filterable_grid.prototype.clear = function () {



    };

    //Public API
    return Fx_Filterable_grid
});