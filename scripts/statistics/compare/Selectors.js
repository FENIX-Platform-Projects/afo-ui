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
        ELEMENT: '#element-s',
        ELEMENT_SEARCH: '#element-search-s',
        N_P: '#n-p-s',
        COMPARE: '#compare-s',
        COUNTRY: '#country-s',
        COUNTRY_SEARCH: '#country-search-s',
        SHOW_AS: '#show-s'
    }, defaultValues = {
        DATA_SOURCE: 'faostat',
        COMPARE: 'COUNTRY',
        N_P: 'p',
        SHOW_AS: 'chart'
    }, ev = {
        SELECT: 'afo.selector.select'
    };

    function Selectors() {

        this.config = JSON.parse(C);
        this._initCountrySelector();
        this._initDataSourceSelector();
        this._initProductSelector();
        this._initElementSelector();
        this._initProductNutrientSelector();
        this._initCompareSelector();
        this._initShowAsSelector();
    }

    //Selectors

    Selectors.prototype._initCountrySelector = function () {

        var self = this;

        Wds.get({
            query: this.config.queries.countries,
            success: function (res) {

                var data = [];

                if (Array.isArray(res)) {

                    _.each(res, function (n) {
                        data.push(createNode(n));
                    });
                }

                createTree(data);
                initSearch();
            }
        });

        function createTree(data) {

            self.countriesTree = $(s.COUNTRY).jstree({
                "core": {
                    "animation": 0,
                    "themes": {"stripes": true},
                    'data': data
                },
                "plugins": ["search", "wholerow", "ui"],
                "search": {
                    show_only_matches: true
                },
                "ui": {"initially_select": ['2814200000']}
            }).on('changed.jstree', function () {
                amplify.publish(ev.SELECT);
            });

            $(s.COUNTRY).jstree(true).select_node('ul > li:first');
        }

        function initSearch() {
            var to = false;
            $(s.COUNTRY_SEARCH).keyup(function () {
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function () {
                    var v = $(s.COUNTRY_SEARCH).val();
                    $(s.COUNTRY).jstree(true).search(v);
                }, 250);
            });
        }

        function createNode(item) {

            // Expected format of the node (there are no required fields)
            var config = {
                id: item[0], // will be autogenerated if omitted
                text: item[1] + " ["+item[0]+"]" // node text
                //parent: item[0] === '' ? '#' : item[0]
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

    Selectors.prototype._initDataSourceSelector = function () {

        var self = this;

        Wds.get({
            query: this.config.queries.data_sources,
            success: function (res) {

                var $form = $('<form>');

                if (Array.isArray(res)) {
                    _.each(res, function (item, index) {
                        $form.append(renderCheckbox(item, index));
                    });
                }

                $(s.DATA_SOURCES).html($form);
                $(s.DATA_SOURCES).find('input[value="' + defaultValues.DATA_SOURCE + '"]').prop('checked', true);
            }
        });

        function renderCheckbox(item, index) {

            var id = 'afo-data-source-' + index,
                $container = $('<span>'),
                $label = $('<label>', {
                    text: item[1],
                    for: id
                }),
                $radio = $('<input>', {
                    type: 'checkbox',
                    id: id,
                    name: 'afo-data-source',
                    value: item[0]
                });

            $radio.on('change', _.bind(function () {

                var checkboxValues = [];
                $(s.DATA_SOURCES).find('input:checked').each(function(index, elem) {
                    checkboxValues.push($(elem).val());
                });

                self._initProductSelector(checkboxValues.join("','"));
                amplify.publish(ev.SELECT);
            }));

            $container.append($radio).append($label);

            return $container;
        }
    };

    Selectors.prototype._initProductSelector = function (source) {

        var self = this,
            q;

            if (source !== 'cstat') {
                q = this._replace(this.config.queries.product_by_source, {SOURCE: source || defaultValues.DATA_SOURCE});
            } else {
                q = this.config.queries.products_by_cstat;
            }

        Wds.get({
            query:  q,
            success: function (res) {

                var data = [],
                    list;

                if (Array.isArray(res)) {

                    list = res.sort(function (a, b) {
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

        function createTree(data) {

            if ( $(s.PRODUCT).jstree(true) &&  $(s.PRODUCT).jstree(true).destroy){
                $(s.PRODUCT).jstree(true).destroy()
            }

            self.productTree = $(s.PRODUCT).jstree({
                "core": {
                    "multiple": true,
                    "animation": 0,
                    "themes": {"stripes": true},
                    'data': data
                },
                "plugins": ["search", "wholerow", "ui"],
                "search": {
                    show_only_matches: true
                },
                "ui": {"initially_select": ['2814200000']}
            }).on('changed.jstree', function () {
                amplify.publish(ev.SELECT);
            });

            $(s.PRODUCT).jstree(true).select_node('ul > li:first');
        }

        function initSearch() {
            var to = false;
            $(s.PRODUCT_SEARCH).keyup(function () {
                if (to) {
                    clearTimeout(to);
                }
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
                text: item[1] + " ["+item[0]+"]" , // node text
                parent: '#'
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

    Selectors.prototype._initElementSelector = function () {

        var self = this;

        Wds.get({
            query: this.config.queries.elements,
            success: function (res) {

                var data = [],
                    list;

                if (Array.isArray(res)) {

                    list = res.sort(function (a, b) {
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

        function createTree(data) {

            self.elementTree = $(s.ELEMENT).jstree({
                "core": {
                    "multiple": true,
                    "animation": 0,
                    "themes": {"stripes": true},
                    'data': data
                },
                "plugins": ["search", "wholerow", "ui"],
                "search": {
                    show_only_matches: true
                },
                "ui": {"initially_select": ['2814200000']}
            }).on('changed.jstree', function () {
                amplify.publish(ev.SELECT);
            });

            $(s.ELEMENT).jstree(true).select_node('ul > li:first');
        }

        function initSearch() {
            var to = false;
            $(s.ELEMENT_SEARCH).keyup(function () {
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function () {
                    var v = $(s.ELEMENT_SEARCH).val();
                    $(s.ELEMENT).jstree(true).search(v);
                }, 250);
            });
        }

        function createNode(item) {

            // Expected format of the node (there are no required fields)
            var config = {
                id: item[0], // will be autogenerated if omitted
                text: item[1] + " ["+item[0]+"]" , // node text
                parent: '#'
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
        $(s.N_P).find('input[value="' + defaultValues.N_P + '"]').prop('checked', true);

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

            $radio.on('change', _.bind(function () {

                amplify.publish(ev.SELECT);
            }));

            $container.append($radio).append($label);

            return $container;
        }
    };

    Selectors.prototype._initCompareSelector = function () {
        var kind = [['COUNTRY', 'Country'], ['ELEMENT', 'Element'], ['PRODUCT', 'Product'], ['SOURCE', 'Data Source' ]],
            $form = $('<form>');

        if (Array.isArray(kind)) {
            _.each(kind, function (item, index) {
                $form.append(renderRadioBtn(item, index));
            });
        }

        $(s.COMPARE).html($form);
        $(s.COMPARE).find('input[value="' + defaultValues.COMPARE + '"]').prop('checked', true);

        function renderRadioBtn(item, index) {

            var id = 'afo-compare-' + index,
                $container = $('<span>'),
                $label = $('<label>', {
                    text: item[1],
                    for: id
                }),
                $radio = $('<input>', {
                    type: 'radio',
                    id: id,
                    name: 'afo-compare',
                    value: item[0]
                });

            $radio.on('change', function ( e ) {
                var $dataSourceCountrySTAT = $(s.DATA_SOURCES).find('input[value="cstat"]');

                if ($(e.currentTarget).attr('value') === 'SOURCE') {

                    if ($dataSourceCountrySTAT.is(":checked")) {
                       $dataSourceCountrySTAT.prop('checked', false);
                    }

                    $dataSourceCountrySTAT.attr("disabled", true);

                    if ($(s.DATA_SOURCES).find('input:checked').length < 1 ){
                        $(s.DATA_SOURCES).find('input[value="' + defaultValues.DATA_SOURCE + '"]').prop('checked', true);

                    }

                } else {
                    $dataSourceCountrySTAT.removeAttr("disabled");
                }

                amplify.publish(ev.SELECT);

            });
            $container.append($radio).append($label);

            return $container;
        }
    };

    Selectors.prototype._initShowAsSelector = function () {
        var kind = [['table', 'Table'], ['chart', 'Chart']],
            $form = $('<form>');

        if (Array.isArray(kind)) {
            _.each(kind, function (item, index) {
                $form.append(renderRadioBtn(item, index));
            });
        }

        $(s.SHOW_AS).html($form);
        $(s.SHOW_AS).find('input[value="' + defaultValues.SHOW_AS + '"]').prop('checked', true);

        function renderRadioBtn(item, index) {

            var id = 'afo-show-' + index,
                $container = $('<span>'),
                $label = $('<label>', {
                    text: item[1],
                    for: id
                }),
                $radio = $('<input>', {
                    type: 'radio',
                    id: id,
                    name: 'afo-show',
                    value: item[0]
                });

            if (index === 0) {
                $radio.attr("checked", true);
            }

            $radio.on('change', _.bind(function () {
                amplify.publish(ev.SELECT);
            }));

            $container.append($radio).append($label);

            return $container;
        }
    };

    //Filter

    Selectors.prototype.processJsTree = function (data) {

        var r= [];
        _.each(data, function(i){
            r.push({code: i.id, text: i.text})
        });

        return r;
    };

    Selectors.prototype.processRadioBtn = function ($btn) {

        return [{code: $btn.val(), text: $("label[for='"+$btn.attr('id')+"']").html() }];
    };

    Selectors.prototype.processCheckbox = function ($btn) {

        var checkboxValues = [];

        $btn.each(function(index, elem) {
            checkboxValues.push({ code: $(elem).val(), text: $("label[for='"+ $(elem).attr('id')+"']").html()});
        });

        return checkboxValues;
    };

    Selectors.prototype.getSelection = function () {

        return  {
            ELEMENT: this.processJsTree( $(s.ELEMENT).jstree(true).get_selected('full') ),
            COUNTRY: this.processJsTree( $(s.COUNTRY).jstree(true).get_selected('full') ),
            SOURCE: this.processCheckbox( $(s.DATA_SOURCES).find('input:checked') ),
            KIND: this.processRadioBtn( $(s.N_P).find('input:checked') ),
            PRODUCT: this.processJsTree( $(s.PRODUCT).jstree(true).get_selected('full') ),
            COMPARE: this.processRadioBtn( $(s.COMPARE).find('input:checked') ),
            SHOW: $(s.SHOW_AS).find('input:checked').val()
        }
    };


    Selectors.prototype.getFilter = function () {

        var filter = this.getSelection(),
            valid;

        valid = this._validateFilter(filter);

        if (valid === true) {
            return filter;
        } else {

            this._showValidationErrors(valid);
            return false;
        }
    };

    //General

    Selectors.prototype._validateFilter = function (f) {
        var valid = true,
            errors = {};

        if (!f.hasOwnProperty('SOURCE') || !f.SOURCE) {
            errors["sources"] = "invalid";
            valid = false;
        }

        if (!f.hasOwnProperty('KIND') || !f.KIND) {
            errors["kind"] = "invalid";
            valid = false;
        }

        if (!f.hasOwnProperty('COUNTRY') || !f.COUNTRY || f.COUNTRY.length === 0) {
            errors["countries"] = "invalid";
            valid = false;
        }

        if (!f.hasOwnProperty('PRODUCT') || !f.PRODUCT || f.PRODUCT.length === 0) {
            errors["product"] = "invalid";
            valid = false;
        }

        if (!f.hasOwnProperty('ELEMENT') || !f.ELEMENT || f.ELEMENT.length === 0) {
            errors["element"] = "invalid";
            valid = false;
        }

        return valid ? valid : errors;
    };

    Selectors.prototype._replace = function(str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            return data[key] || '';
        });
    };

    Selectors.prototype._showValidationErrors = function (errors) {

        alert("Please select all the fields");
        console.error(errors)
    };

    return Selectors;
});