/*global define*/
define(['underscore', 'underscore-string',
    'fx-common/js/WDSClient',
    'src/fxTree',
    'src/fxTreeNutrient',
    'geojson_decoder',
    'config/services',
    'text!afo_geo_countries',
    'amplify'
], function (_, _str,
    WDSClient,
    fxTree,
    fxTreeNutrient,
    geojsonDecoder,
    Config,
    afo_geo_countries) {

    'use strict';

    var s = {
            DATA_SOURCES: '#data-sources-s',
            PRODUCT: '#product-s',
            REGION: '#region-s',
            N_P: '#n-p-s'
        },
        defaultValues = {
            DATA_SOURCE: 'faostat',
            N_P: 'p',
            REGION: '650'
        },
        selection = {
            COUNTRY: null
        },
        ev = {
            SELECT: 'afo.selector.select'
        };

    var wdsClient = new WDSClient({
        datasource: Config.dbName,
        outputType: 'array'
    });

    var afoGeoCountries = JSON.parse(afo_geo_countries);

    function _template(str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            return data[key] || '';
        });
    }

    function Selectors() {

        var self = this;

        self.config = Config;

        self.productTree = new fxTreeNutrient(s.PRODUCT, {
            labelVal: 'HS Code',
            labelTxt: 'Product',
            labelNutrient: 'Nutrient',
            showTxtValRadio: true,
            showValueInTextMode: true,
            showTextInValueMode: true,
            onChange: function (seldata) {
                amplify.publish(ev.SELECT);
            }
        });

        self._initMapSelector();
        self._initDataSourceSelector();
        self._initProductSelector();
        self._initProductNutrientSelector();
    }

    Selectors.prototype._initMapSelector = function () {

        var self = this;

        var listCountries$ = $('#stats_selectCountries'),
            mapzoomsRegions$ = $('#stats_map_regions').next('.map-zooms'),
            mapzoomsCountries$ = $('#stats_map_countries').next('.map-zooms');

        var style = {
                fill: true, color: '#68AC46', weight: 1, opacity: 1, fillOpacity: 0.4, fillColor: '#6AAC46'
            },
            styleHover = {
                fill: true, color: '#6AAC46', weight: 1, opacity: 1, fillOpacity: 0.8, fillColor: '#6AAC46'
            },
            styleSelect = {
                fill: true, color: '#6AAC46', weight: 0, opacity: 1, fillOpacity: 1, fillColor: '#6AAC46'
            };

        this.mapCountries = L.map('stats_map_countries', {
            zoom: 3,
            minZoom: 2,
            zoomControl: false,
            center: L.latLng(Config.map_center),
            layers: L.tileLayer(Config.url_baselayer)
        }).addControl(L.control.zoom({ position: 'bottomright' }));

        var geojsonCountries = L.featureGroup();
        geojsonCountries.addTo(self.mapCountries);

        function renderMapCountries(data) {

            geojsonCountries.clearLayers();

            geojsonDecoder.decodeToLayer(data,
                geojsonCountries,
                style,
                function (feature, layer) {
                    layer
                    .on("mouseover", function (e) {
                        $('#stats_selected_countries').text(feature.properties.prop2);
                    })
                    .on("click", function (e) {

                        geojsonCountries.eachLayer(function (lay) {
                            lay.setStyle(style);
                            lay._options.selected = false;
                        });

                        e.target.setStyle(styleHover);
                        e.target._options.selected = true;

                        listCountries$.find("option:selected").removeAttr("selected");
                        listCountries$.val(feature.properties.prop1);

                        selection.COUNTRY = [{
                            code: feature.properties.prop1,
                            text: feature.properties.prop2
                        }];
                        
                        amplify.publish(ev.SELECT);
                    });
                }
            );

            self.mapCountries.fitBounds( geojsonCountries.getBounds().pad(-0.8) );
        }

        function loadMapCountries(ids) {

            var sql = _template(self.config.queries.countries_geojson, {
                        ids: ids.join(',')
                    });

            var url = _template(self.config.url_spatialquery_enc, {
                sql: sql
            });

            $.getJSON(url, function (data) {
                renderMapCountries(data);
            });
        }

        function loadMapByRegion(regCode) {

            wdsClient.retrieve({
                payload: {
                    query: Config.queries.countries_byregion,
                    queryVars: {
                        id: regCode,
                        source: $(s.DATA_SOURCES).find('input:checked').val()
                    }
                },
                success: function (resp) {

                    listCountries$.empty();
                    for (var r in resp)
                        listCountries$.append('<option value="' + resp[r][0] + '">' + resp[r][1] + '</option>');

                    var idsCountries = _.map(resp, function (val) {
                        return val[0];
                    });

                    loadMapCountries( idsCountries );
                }
            });
        }

        wdsClient.retrieve({
            payload: {
                query: Config.queries.regions
            },
            success: function (regs) {

                regs = _.reject(regs, function (val) {
                    return val[0] === "696";    //remove all countries
                });

                regs = _.map(regs, function (val) {
                    return { id: val[0], text: val[1] };
                })

                self.regionTree = new fxTree(s.REGION, {
                    labelTxt: 'Name',                    
                    labelVal: 'Code',
                    multiple: false,
                    showTxtValRadio: true,
                    showValueInTextMode: true,
                    showTextInValueMode: true,
                    onChange: function (seldata) {
                        loadMapByRegion(seldata[0])
                    }
                })
                .setData(regs)
                .setFirst({ id: '650', text: 'COMESA' });
            }
        });

        setTimeout(function() {
            renderMapCountries( afoGeoCountries );
        }, 2000);

        self.mapCountries.attributionControl.setPrefix(Config.map_attribution);

        mapzoomsCountries$.on('click', '.btn', function (e) {
            var z = parseInt($(this).data('zoom'));
            self.mapCountries[z > 0 ? 'zoomIn' : 'zoomOut']();
        });

        listCountries$.on('click', 'option', function (e) {
            e.preventDefault();

            selection.COUNTRY = [];
            listCountries$.find("option:selected").map(function () {
                selection.COUNTRY.push({
                    code: $(this).attr('value'),
                    text: $(this).text()
                });
            });

            amplify.publish(ev.SELECT);
        });

        //loadMapByRegion( defaultValues.REGION );

    };

    Selectors.prototype._initDataSourceSelector = function () {

        var self = this;

        wdsClient.retrieve({
            payload: {
                query: Config.queries.data_sources
            },
            success: function (res) {
                var $form = $('<form>');

                if (_.isArray(res)) {
                    _.each(res, function (item, index) {
                        $form.append(renderRadioBtn(item, index));
                    });
                }

                $(s.DATA_SOURCES).html($form).find('input[value="' + defaultValues.DATA_SOURCE + '"]').prop('checked', true);
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
                amplify.publish(ev.SELECT);
                self._initProductSelector($(s.DATA_SOURCES).find('input:checked').val());

            }));

            return $container;
        }
    };

    Selectors.prototype._initProductSelector = function (source) {

        var self = this,
            payload;

        if (source !== 'cstat')
            payload = {
                query: this.config.queries.product_by_source,
                queryVars: { SOURCE: source || defaultValues.DATA_SOURCE }
            };
        else
            payload = {
                query: this.config.queries.products_by_cstat
            };

        wdsClient.retrieve({
            payload: payload,
            success: function (res) {
                var data = [],
                    list;

                data = _.map(res, function (item) {
                    return {
                        id: item[0],
                        text: item[1],
                        n: item[2],
                        p: item[3],
                        k: item[4],
                        parent: '#'
                    };
                });

                self.productTree.setData(data);
            }
        });
    };

    Selectors.prototype._initProductNutrientSelector = function () {
        var kind = [['n', 'Nutrient'], ['p', 'Product']],
            $form = $('<form>');

        if (_.isArray(kind)) {
            _.each(kind, function (item, index) {
                $form.append(renderRadioBtn(item, index));
            });
        }

        $(s.N_P).html($form).find('input[value="' + defaultValues.N_P + '"]').prop('checked', true);

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

            $radio.on('change', _.bind(function () {
                amplify.publish(ev.SELECT);
            }));

            $container.append($radio).append($label);

            return $container;
        }
    };

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

        return valid;
    };

    Selectors.prototype.processJsTree = function (data) {
        return _.map(data, function (i) {
            return { code: i.id, text: i.text };
        });
    };

    Selectors.prototype.processRadioBtn = function ($btn) {
        return [{ code: $btn.val(), text: $("label[for='" + $btn.attr('id') + "']").html() }];
    };

    Selectors.prototype.processCheckbox = function ($btn) {

        var checkboxValues = [];

        $btn.each(function (index, elem) {
            checkboxValues.push({ code: $(elem).val(), text: $("label[for='" + $(elem).attr('id') + "']").html() });
        });

        return checkboxValues;
    };

    Selectors.prototype.getSelection = function () {

        var SEL = {
            COUNTRY: selection.COUNTRY,
            SOURCE: this.processCheckbox($(s.DATA_SOURCES).find('input:checked')),
            KIND: this.processRadioBtn($(s.N_P).find('input:checked')),
            PRODUCT: this.processJsTree(this.productTree.getSelection('full'))
        };
        return SEL;
    };

    Selectors.prototype.getFilter = function () {

        var filter = this.getSelection(),
            valid = this._validateFilter(filter);

        return (valid !== false) ? filter : this._showValidationErrors(valid);
    };

    Selectors.prototype._showValidationErrors = function (errors) {
        alert("Please select Country and Product");
    };

    return Selectors;
});