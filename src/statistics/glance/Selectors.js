/*global define*/
define(['underscore','underscore-string',
    'commons/Wds',
    'fx-common/js/WDSClient',
    'src/fxTree',    
    'geojson_decoder',
    'config/services',    
    'amplify'
], function (_, _str,
    Wds,
    WDSClient,
    fxTree,    
    geojsonDecoder,
    Config) {

    'use strict';

    var s = {
            DATA_SOURCES: '#data-sources-s',
            PRODUCT: '#product-s',
            N_P: '#n-p-s'
        },
        defaultValues = {
            DATA_SOURCE: 'faostat',
            N_P: 'p',
            REGION: '696'
        },
        selection = {
        	COUNTRIES: null
        },
        ev = {
            SELECT: 'afo.selector.select'
        },
        mapCountries;


    var wdsClient = new WDSClient({
        datasource: Config.dbName,
        outputType: 'array'
    });

    function _template(str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            return data[key] || '';
        });
    }

    function Selectors() {

        this.config = Config;
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
            },
            styleSelect = {
                fill: true, color: '#6AAC46', weight: 0, opacity: 1, fillOpacity: 1, fillColor: '#6AAC46'
            };

        function loadMapByRegion(regCode) {

            wdsClient.retrieve({
                payload: {
                    query: Config.queries.countries_byregion,
                    queryVars: {id: regCode }
                },
                success: function(resp) {


                    listCountries$.empty();
                    for (var r in resp)
                        listCountries$.append('<option value="' + resp[r][0] + '">' + resp[r][1] + '</option>');

                    var idsCountries = _.map(resp, function (val) {
                        return val[0];
                    });

                    var sql = _template(self.config.queries.countries_geojson, {
                            ids: idsCountries.join(',')
                        });

                    var url = _template(self.config.url_spatialquery_enc, {
                            sql: sql
                        });

                    $.getJSON(url, function (data) {

                        geojsonCountries.clearLayers();

                        geojsonDecoder.decodeToLayer(data,
                            geojsonCountries,
                            style,
                            function (feature, layer) {
                                layer
                                .on("mouseover", function(e) {
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
                                    
                                    selection.COUNTRIES = [{
                                    	code: feature.properties.prop1,
                                    	text : feature.properties.prop2
                                    }];

                                    // leave me as last row!
                                    amplify.publish(ev.SELECT);
                                });
                            }
                        );
                        var bb = geojsonCountries.getBounds();
                        mapCountries.fitBounds(bb.pad(-0.8));
                        geojsonCountries.addTo(mapCountries);
                    });
                }
            });
        }

        wdsClient.retrieve({
            payload: {
                query: Config.queries.regions
            },
            success: function(regs) {            

                regs = _.reject(regs, function (val) {
                    return val[0] === "696";//remove all countries
                });

                listRegions$.append('<option value="696" class="afo-list-allcountries" selected>All African Countries</option>');

                for (var r in regs)
                    listRegions$.append('<option value="' + regs[r][0] + '">' + regs[r][1] + '</option>');
            }
        });

        mapCountries = L.map('stats_map_countries', {
            zoom: 3,
            minZoom: 2,            
            zoomControl: false,
            center: L.latLng(Config.map_center),            
            layers: L.tileLayer(this.config.url_baselayer)
        }).addControl(L.control.zoom({position: 'bottomright'}))

        mapCountries.attributionControl.setPrefix(this.config.map_attribution);

        var geojsonCountries = L.featureGroup();

        mapzoomsCountries$.on('click', '.btn', function (e) {
            var z = parseInt($(this).data('zoom'));
            mapCountries[z > 0 ? 'zoomIn' : 'zoomOut']();
        });

        listRegions$.on('click', 'option', function (e) {

            loadMapByRegion($(e.target).attr('value'));

        });

        listCountries$.on('click', 'option', function (e) {
            e.preventDefault();

            selection.COUNTRIES = [{
				code: $(e.target).attr('value'),
				text: $(e.target).text()
			}];

            amplify.publish(ev.SELECT);
        });

        loadMapByRegion( defaultValues.REGION );

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
                $(s.DATA_SOURCES).find('input[value="' + defaultValues.DATA_SOURCE + '"]').prop('checked', true);
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
                self._initProductSelector($(s.DATA_SOURCES).find('input:checked').val())
            }));

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
            query: q,
            success: function (res) {

                var data = [],
                    list;

                if (Array.isArray(res)) {

                    list = res.sort(function (a, b) {
                        if (a[1] < b[1]) return -1;
                        if (a[1] > b[1]) return 1;
                        return 0;
                    });

                    _.each(list, function (item) {
                        data.push({
                            id: item[0],
                            text: item[1],
                            parent: '#'
                        });
                    });
                }

                self.productTree = new fxTree(s.PRODUCT, {
                    labelVal: 'HS Code',
                    labelTxt: 'Product Name',
                    showTxtValRadio: true,
                    showValueInTextMode: true,
                    onChange: function (seldata) {
                        amplify.publish(ev.SELECT);
                    }
                }).setData(data);
            }
        });
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
        return _.map(data, function(i){
            return {code: i.id, text: i.text};
        });
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

        var SEL = {
            COUNTRY: selection.COUNTRIES,
            SOURCE: this.processCheckbox( $(s.DATA_SOURCES).find('input:checked') ),
            KIND: this.processRadioBtn( $(s.N_P).find('input:checked') ),
            PRODUCT: this.processJsTree( this.productTree.getSelection('full') )
        };
        return SEL;
    };

    Selectors.prototype.getFilter = function () {

        var filter = this.getSelection(),
            valid = this._validateFilter(filter);

        if (valid !== false) {
            return filter;
        } else {

            this._showValidationErrors(valid);
            return false;
        }
    };

    Selectors.prototype._replace = function (str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            return data[key] || '';
        });
    };

    Selectors.prototype._showValidationErrors = function (errors) {
        alert("Please select Country and Product");
    };

    return Selectors;
});