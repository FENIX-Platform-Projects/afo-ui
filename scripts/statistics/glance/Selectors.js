/*global define*/
define([
    "underscore",
    "commons/Wds",
    'text!config/services.json',
    'jstree'
], function (_, Wds, C) {

    'use strict';

    var s = {
        DATA_SOURCES: '#data-sources-s',
        PRODUCT: '#product-s',
        PRODUCT_SEARCH: '#product-search-s',
        N_P: '#n-p-s'
    };

    function Selectors() {
        this.config = JSON.parse(C);
        this._initMapSelector();
        this._initDataSourceSelector();
        this._initProductSelector();
        this._initProductNutrientSelector();
    }

    Selectors.prototype._initMapSelector = function () {
    };

    Selectors.prototype._initDataSourceSelector = function () {

        Wds.get({
            query: this.config.queries.data_sources,
            success: function (res) {

                var $form = $('<form>');

                if (Array.isArray(res)) {
                    _.each(res, function (item, index) {
                        $form.append(renderRadioBtn(item, index));
                    });
                }

                $(s.DATA_SOURCES).html($form);
            }
        });

        function renderRadioBtn(item, index) {

            var id = 'afo-data-source-' + index,
                $container = $('<span>'),
                $label = $('<label>', {
                    text: item[1],
                    for: id
                }),
                $radio = $('<input>', {
                    type: 'radio',
                    id: id,
                    name: 'afo-data-source',
                    value: item[0]
                });

            if (index === 0) {
                $radio.attr("checked", true);
            }

            $container.append($label).append($radio);

            return $container;
        }
    };

    Selectors.prototype._initProductSelector = function () {

        var self = this;

        Wds.get({
            query: this.config.queries.products,
            success: function (res) {

                var data = [],
                    list;

                if (Array.isArray(res)) {

                    list = res.sort(function (a,b){
                        if (a[1] < b[1]) return -1;
                        if (a[1] > b[1]) return 1;
                        return 0;
                    });

                    _.each(list, function (n) {
                        data.push(createNode(n));
                    });

                }

                createTree(data);
                initSearch();
            }
        });

        function createTree( data ) {

            self.productTree = $(s.PRODUCT).jstree({
                "core": {
                    "animation": 0,
                    "themes": {"stripes": true},
                    'data': data
                },
                "plugins": [
                    "contextmenu", "dnd", "search",
                    "state", "types", "wholerow"
                ],
                "search": {
                    show_only_matches: true
                }
            });
        }

        function initSearch() {
            var to = false;
            $(s.PRODUCT_SEARCH).keyup(function () {
                if(to) { clearTimeout(to); }
                to = setTimeout(function () {
                    var v = $(s.PRODUCT_SEARCH).val();
                    $(s.PRODUCT).jstree(true).search(v);
                }, 250);
            });
        }

        function createNode(item) {

            // Expected format of the node (there are no required fields)
            var config = {
                id: item[0], // will be autogenerated if omitted
                text: item[1], // node text
                parent: '#',
                //icon: "string", // string for custom
                /* state: {
                    opened: boolean,  // is the node open
                    disabled: boolean,  // is the node disabled
                    selected: boolean  // is the node selected
                },*/
                //children    : [],  // array of strings or objects
                //li_attr: {},  // attributes for the generated LI node
                //a_attr: {}  // attributes for the generated A node
            };

            return config;
        }
    };

    Selectors.prototype._initProductNutrientSelector = function () {
        var kind = [['n', 'Nutrient'], ['p', 'Product']],
            $form = $('<form>');

        if (Array.isArray(kind)) {
            _.each(kind, function (item, index) {
                $form.append(renderRadioBtn(item, index));
            });
        }

        $(s.N_P).html($form);

        function renderRadioBtn(item, index) {

            var id = 'afo-kind-' + index,
                $container = $('<span>'),
                $label = $('<label>', {
                    text: item[1],
                    for: id
                }),
                $radio = $('<input>', {
                    type: 'radio',
                    id: id,
                    name: 'afo-kind',
                    value: item[0]
                });

            if (index === 0) {
                $radio.attr("checked", true);
            }

            $container.append($label).append($radio);

            return $container;
        }
    };

    Selectors.prototype._validateFilter = function(f) {
        var valid = true,
            errors= {};

        if (!f.hasOwnProperty('sources') || f.sources === null){
            errors["sources"] = "invalid";
            valid = false;
        }

        if (!f.hasOwnProperty('kind') || f.kind === null){
            errors["kind"] = "invalid";
            valid = false;
        }

        if (!f.hasOwnProperty('countries') || f.countries === null){
            errors["countries"] = "invalid";
            valid = false;
        }

        if (!f.hasOwnProperty('product') || f.product === null){
            errors["product"] = "invalid";
            valid = false;
        }

        return valid;
    };

    Selectors.prototype.getFilter = function() {

        var filter = {
            sources : $(s.DATA_SOURCES).find('input').val(),
            kind:  $(s.N_P).find('input').val(),
            countries: ["133"], //TODO remove
            product:  $(s.PRODUCT).jstree(true).get_selected()
        }, valid = this._validateFilter(filter);

        if (valid !== false) {
            return filter;
        } else {

            this._showValidationErrors();
            return false;
        }
    };

    Selectors.prototype._showValidationErrors = function (errors) {

        console.error(errors)
    };

    return Selectors;
});