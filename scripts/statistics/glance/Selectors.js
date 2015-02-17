/*global define*/
define([
    "underscore",
    "commons/Wds",
    'text!config/services.json',
    'geojson_decoder',
    'jstree'
], function (_, Wds, C, geojsonDecoder) {

    'use strict';

    var s = {
        DATA_SOURCES: '#data-sources-s',
        PRODUCT: '#product-s',
        PRODUCT_SEARCH: '#product-search-s',
        N_P: '#n-p-s'
    }, defaultValues = {
          DATA_SOURCE: 'faostat',
          N_P: 'p'
    }, selection = { COUNTRIES: null };

    function Selectors() {

        this.config = JSON.parse(C);
        this._initMapSelector();
        this._initDataSourceSelector();
        this._initProductSelector();
        this._initProductNutrientSelector();
    }

    Selectors.prototype._initMapSelector = function () {

        var self = this;

        var listRegions$ = $('#stats_selectRegions'),
            listCountries$ = $('#stats_selectCountries'),
            mapzoomsRegions$ = $('#stats_map_regions').next('.map-zooms'),
            mapzoomsCountries$ = $('#stats_map_countries').next('.map-zooms');

        var style = {
                fill: true, color: '#68AC46', weight: 1, opacity: 1, fillOpacity: 0.4, fillColor: '#6AAC46'
            },
            styleHover = {
                fill: true, color: '#6AAC46', weight: 1, opacity: 1, fillOpacity: 0.8, fillColor: '#6AAC46'
            };

        function getWDS(queryTmpl, queryVars, callback) {

            var sqltmpl, sql;

            if (queryVars) {
                sqltmpl = _.template(queryTmpl);
                sql = sqltmpl(queryVars);
            }
            else
                sql = queryTmpl;

            var data = {
                datasource: self.config.dbName,
                thousandSeparator: ',',
                decimalSeparator: '.',
                decimalNumbers: 2,
                cssFilename: '',
                nowrap: false,
                valuesIndex: 0,
                json: JSON.stringify({query: sql})
            };

            $.ajax({
                url: self.config.wdsUrl,
                data: data,
                type: 'POST',
                dataType: 'JSON',
                success: callback
            });
        }

        getWDS(this.config.queries.regions, null, function (regs) {
            var Regions = regs;
            for (var r in regs)
                listRegions$.append('<option value="' + regs[r][0] + '">' + regs[r][1] + '</option>');
        });

        var mapCountries = L.map('stats_map_countries', {
            zoom: 4,
            zoomControl: false,
            attributionControl: false,
            center: L.latLng(20, 0),
            layers: L.tileLayer(this.config.url_baselayer)
        })
            .addControl(L.control.zoom({position: 'bottomright'}))

        var geojsonCountries = L.featureGroup(null, {
            style: function (feature) {
                return style;
            }
        });

        mapzoomsCountries$.on('click', '.btn', function (e) {
            var z = parseInt($(this).data('zoom'));
            mapCountries[z > 0 ? 'zoomIn' : 'zoomOut']();
        });

        listRegions$.on('click', 'option', function (e) {

            var regCode = parseInt($(e.target).attr('value'));

            getWDS(self.config.queries.countries_byregion, {id: "'" + regCode + "'"}, function (resp) {

                listCountries$.empty();
                for (var r in resp)
                    listCountries$.append('<option value="' + resp[r][0] + '">' + resp[r][1] + '</option>');

                var idsCountries = _.map(resp, function (val) {
                    return val[0];
                });

                var sqlTmpl = urlTmpl = _.template(self.config.queries.countries_geojson),
                    sql = sqlTmpl({ids: idsCountries.join(',')});

                var urlTmpl = _.template(self.config.url_spatialquery_enc),
                    url = urlTmpl({sql: sql});

                $.getJSON(url, function (data) {

                    geojsonCountries.clearLayers();

                    geojsonDecoder.decodeToLayer(data,
                        geojsonCountries,
                        style,
                        function (feature, layer) {
                            layer
                                .setStyle(style)
                                .on("mouseover", function (e) {
                                    layer.setStyle(styleHover);
                                })
                                .on("mouseout", function (e) {
                                    layer.setStyle(style);
                                })
                                .on("click", function (e) {
                                    listCountries$.find("option:selected").removeAttr("selected");
                                    listCountries$.val(feature.properties.prop1);
                                    $('#stats_selected_countries').text(feature.properties.prop2);
                                    selection.COUNTRIES = feature.properties.prop1;
                                });
                        }
                    );
                    var bb = geojsonCountries.getBounds();
                    mapCountries.fitBounds(bb.pad(-0.8));
                    geojsonCountries.addTo(mapCountries);
                });

            });

        });

        listCountries$.on('click', 'option', function (e) {
            e.preventDefault();
            $('#stats_selected_countries').text($(e.target).text());
            selection.COUNTRIES = $(e.delegateTarget).val();
        });

        $('#stats_map_countries').on('click', '.popupCountry', function (e) {
            e.preventDefault();
            listCountries$.find("option:selected").removeAttr("selected");
            //$('#stats_selected_countries').text( $(e.currentTarget).data('name') );
            selection.COUNTRIES = $(e.currentTarget).data('id');
        });


    };

    Selectors.prototype._initDataSourceSelector = function () {

        var self = this;

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
                $(s.DATA_SOURCES).find('input[value="'+ defaultValues.DATA_SOURCE +'"]').prop('checked', true);
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

            $container.append($radio).append($label);

            $radio.on('change', _.bind(function () {
                self._initProductSelector($(s.DATA_SOURCES).find('input:checked').val())
            }));

            return $container;
        }
    };

    Selectors.prototype._initProductSelector = function ( source ) {

        var self = this;

        Wds.get({
            query: this._replace(this.config.queries.product_by_source, {SOURCE: source || defaultValues.DATA_SOURCE}),
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
                    "multiple": false,
                    "animation": 0,
                    "themes": {"stripes": true},
                    'data': data
                },
                "plugins": [ "search", "wholerow", "ui" ],
                "search": {
                    show_only_matches: true
                }
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
                text: item[1], // node text
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
        $(s.N_P).find('input[value="'+ defaultValues.N_P +'"]').prop('checked', true);

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

            $container.append($radio).append($label);

            return $container;
        }
    };

    Selectors.prototype._validateFilter = function (f) {
        var valid = true,
            errors = {};

        if (!f.hasOwnProperty('SOURCE') || !f.SOURCE ) {
            errors["sources"] = "invalid";
            valid = false;
        }

        if (!f.hasOwnProperty('KIND') || !f.KIND ) {
            errors["kind"] = "invalid";
            valid = false;
        }

        if (!f.hasOwnProperty('COUNTRY') || !f.COUNTRY ) {
            errors["countries"] = "invalid";
            valid = false;
        }

        if (!f.hasOwnProperty('PRODUCT') || !f.PRODUCT ) {
            errors["product"] = "invalid";
            valid = false;
        }

        return valid;
    };

    Selectors.prototype.getFilter = function () {

        var filter = {
                COUNTRY: selection.COUNTRIES,
                SOURCE: $(s.DATA_SOURCES).find('input:checked').val(),
                KIND: $(s.N_P).find('input:checked').val(),
                PRODUCT: $(s.PRODUCT).jstree(true).get_selected()[0]
            },
            valid = this._validateFilter(filter);

        if (valid !== false) {
            return filter;
        } else {

            this._showValidationErrors(valid);
            return false;
        }
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