require([
    "config/paths",
    "submodules/fenix-ui-menu/js/paths",
    "submodules/fenix-ui-common/js/Compiler"
], function (Paths, menuConfig, Compiler) {

    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Compiler.resolve([menuConfig], {
        placeholders: {
            FENIX_CDN: Paths.FENIX_CDN
        },
        config: Paths
    });

    require([
        'jquery','underscore','bootstrap','jstree','handlebars','leaflet','leaflet-markercluster','jquery.rangeSlider','moment',
        'config/services',
        'src/renderAuthMenu',
        'fx-common/js/WDSClient',
        'scripts/prices/local/results'
    ], function ($, _, bts, jstree, Handlebars, L, LeafletMarkecluster, rangeslider, moment,
        Config,
        renderAuthMenu,
        WDSClient,
        resultsTable
        ) {

        renderAuthMenu(true);

        var wdsClient = new WDSClient({
            datasource: Config.dbName,
            outputType: 'array'
        });

        var resumeTmpl = Handlebars.compile($('script#resumeTmpl').html()),
            popupTmpl = Handlebars.compile($('script#popupTmpl').html());

        var listProducts$ = $('#prices_selectProduct'),
            listCountries$ = $('#country-s'),
            radioMarketTypeAll$ = $('#marketTypeAll'),
            radioMarketTypeOpen$ = $('#marketTypeOpen'),
            radioMarketTypeSub$ = $('#marketTypeSub'),
            rangeMonths$ = $('#prices_rangeMonths'),
            tableresult$ = $('#table-result'),
            afoResumeWrap$ = $('#afo-resume-wrap'),
            pricesRangeRadio$ = $('input[name=prices_range_radio]'),
            pricesTypeRadio$ = $('input[type=radio][name=mType_radio]');

        function formatMonth(date) {
            return [date.slice(0, 4), '/', date.slice(4)].join('')
        }

        function formatMonthStr(date) {
           var yyyy = date.getFullYear().toString();
           var mm = (date.getMonth()+1).toString();
           return yyyy + (mm[1]?mm:"0"+mm[0]); // padding
        }        

        var defDates = Config.dateRangeSlider.prices_detaild.defaultValues,
            defSelection = {
                fertilizer_code: '3105300000',
                country_code: ['42'],
                month_from_yyyymm: formatMonthStr( defDates.min ),
                month_to_yyyymm: formatMonthStr( defDates.max )
            };

        function getSelection() {
            var dates = rangeMonths$.dateRangeSlider('values');
            minD = new Date(dates.min),
            maxD = new Date(dates.max),
            minM = minD.getMonth() + 1,
            maxM = maxD.getMonth() + 1;

            var minDate = "" + minD.getFullYear() + (minM < 10 ? '0' + minM : minM),
                maxDate = "" + maxD.getFullYear() + (maxM < 10 ? '0' + maxM : maxM);

            var mType = "";
            if (radioMarketTypeAll$.is(':checked'))
                mType = [radioMarketTypeOpen$.val(), radioMarketTypeSub$.val()];
            if (radioMarketTypeOpen$.is(':checked'))
                mType = [radioMarketTypeOpen$.val()];
            if (radioMarketTypeSub$.is(':checked'))
                mType = [radioMarketTypeSub$.val()];

            var toRet = {
                fertilizer_code: listProducts$.val(),
                country_code: listCountries$.jstree(true).get_selected(),
                market_type: mType,
                month_from_yyyymm: minDate,
                month_to_yyyymm: maxDate
            }
            return toRet;
        }
        //TODO: add the other set-s if needed
        function setSelection(sel) {
            if (sel.country_code && sel.country_code.length > 0)
                listCountries$.jstree(true).check_node(sel.country_code);
            if (sel.fertilizer_code)
                listProducts$.val(sel.fertilizer_code);
        }

        var map = L.map('prices_retail_map', {
            zoom: 11,
            zoomControl: false,
            scrollWheelZoom: false,
            center: L.latLng(0, 0),
            layers: L.tileLayer(Config.url_baselayer)
        }).addControl(L.control.zoom({ position: 'bottomright' }));

        map.attributionControl.setPrefix(Config.map_attribution);

        var layerRetail = new L.MarkerClusterGroup({
            maxClusterRadius: 30,
            showCoverageOnHover: false
        });
        layerRetail.addTo(map);

        function updateResume(selection) {
            if(!selection) {
                afoResumeWrap$.empty();
                return false;
            }
            var from = selection.month_from_yyyymm,
                to = selection.month_to_yyyymm,
                timeRange = formatMonth(from) + ' - ' + formatMonth(to);

            var countries = listCountries$.jstree(true).get_selected(true).map(
                function (c) {
                    return c.text;
                });
            afoResumeWrap$.html(resumeTmpl({
                items: [{
                    label: 'Product: ',
                    value: $("#prices_selectProduct option:selected").text()
                }, {
                    label: 'Time Range: ',
                    value: timeRange
                }, {
                    label: 'Country: ',
                    value: countries.join(', ')
                }, {
                    label: 'Market type: ',
                    value: selection.market_type.replace(/'/g,' ')
                }]
            }));
        }

        function updateUI(selection) {

            if (selection && selection.country_code)
                selection.country_code = selection.country_code.join("', '");
            
            if (selection && selection.market_type)
                selection.market_type = selection.market_type.join("', '");
        
            loadMarkers(selection);
            
            resultsTable(selection, tableresult$);
            
            updateResume(selection);
        }

        function loadMarkers(Selection) {

            wdsClient.retrieve({
                payload: {
                    query: Config.queries.prices_detailed_local_geofilter,
                    queryVars: Selection
                },
                success: function (data) {

                    layerRetail.clearLayers();

                    for (var i in data) {

                        loc = data[i][1].split('|');

                        data[i][0] = data[i][0].replace('[Town]','');
                        data[i][2] += ' USD/tons';

                        L.marker(loc).bindPopup(popupTmpl({
                                title: data[i][0],
                                fert: $("#prices_selectProduct option:selected").text(),
                                val: data[i][2],
                                type: data[i][3],
                            }))
                            .addTo(layerRetail);
                    }

                    map.fitBounds(layerRetail.getBounds().pad(-1.2));
                }
            });
        }

        rangeMonths$.dateRangeSlider(Config.dateRangeSlider.prices_detaild);


        //Events
        rangeMonths$.on('valuesChanged', function (e, data) {
            updateUI(getSelection());
        });

        pricesRangeRadio$.on('click', function (e) {

            var val = parseInt($(this).val()),
                max = moment(Config.dateRangeSlider.prices_detaild.bounds.max),
                min = max.subtract(val, 'months').toDate();
            rangeMonths$.dateRangeSlider('min', min);
        });

        listProducts$.on('change', function (e) {
            updateUI(getSelection());
        });

        listCountries$.on('changed.jstree', function (e) {
            updateUI(getSelection());
        });
        listCountries$.on('ready.jstree', function (e) {
            setSelection(defSelection);
            updateUI();
        });

        pricesTypeRadio$.change(function () {
            updateUI(getSelection());
        });
        $('#country-sel-all-s').on('click', function () { listCountries$.jstree(true).check_all(); });
        $('#country-unsel-all-s').on('click', function () { listCountries$.jstree(true).uncheck_all(); });

        //Events end

        wdsClient.retrieve({
            payload: {
                query: Config.queries.prices_detailed_products
            },
            success: function (data) {
                for (var r in data)
                    listProducts$.append('<option value="' + data[r][0] + '">' + data[r][1] + '</option>');
            }
        });

        wdsClient.retrieve({
            payload: {
                query: Config.queries.countries
            },
            success: function (data) {
                var treeData = [];
                for (var r in data)
                    treeData.push({ id: data[r][0], text: data[r][1],/*state: { selected: true }*/ });
                
                createTree(listCountries$, treeData);
            }
        });


        function createTree(cnt$, data) {
            cnt$.jstree({
                core: {
                    multiple: true,
                    animation: 0,
                    themes: { stripes: true },
                    data: data
                },
                plugins: ['search','wholerow','ui','checkbox'],
                search: {
                    show_only_matches: true
                },
                ui: {
                    initially_select: defSelection.country_code
                }
            });

            //cnt$.jstree(true).select_node('ul > li:first');
        }
    });
});