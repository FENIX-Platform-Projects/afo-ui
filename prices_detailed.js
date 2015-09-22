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
        'src/fxTree',
        'src/prices/local/results'
    ], function ($, _, bts, jstree, Handlebars, L, LeafletMarkecluster, rangeslider, moment,
        Config,
        renderAuthMenu,
        WDSClient,
        fxTree,
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
            radioMarketTypeAll$ = $('#marketTypeAll'),
            radioMarketTypeOpen$ = $('#marketTypeOpen'),
            radioMarketTypeSub$ = $('#marketTypeSub'),
            rangeMonths$ = $('#prices_rangeMonths'),
            tableresult$ = $('#table-result'),
            afoResumeWrap$ = $('#afo-resume-wrap'),
            pricesRangeRadio$ = $('input[name=prices_range_radio]'),
            pricesTypeRadio$ = $('input[type=radio][name=mType_radio]');

        var pricesMap;

        var treeProduct = new fxTree('#product-s', {
            labelVal: 'HS Code',
            labelTxt: 'Product Name',
            multiple: false,
            showTxtValRadio: true,
            showValueInTextMode: true,
            onChange: function() {
                updateUI(getSelection());
            }
        });

        var treeCountry = new fxTree('#country-s', {
                labelVal: 'Country Code <small>( Gaul )</small>',
                labelTxt: 'Country Name',
                showTxtValRadio: true,
                showValueInTextMode: false,
                onChange: function() {
                    updateUI(getSelection());
                }
            });

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
                fertilizer_name: '',
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
                fertilizer_name: listProducts$.find("option:selected").text(),
                country_code: treeCountry.getSelection(),
                market_type: mType,
                month_from_yyyymm: minDate,
                month_to_yyyymm: maxDate
            }
            return toRet;
        }

        pricesMap = L.map('prices_retail_map', {
            zoom: 3,
            zoomControl: false,
            scrollWheelZoom: false,
            center: L.latLng(Config.map_center),            
            layers: L.tileLayer(Config.url_baselayer)
        }).addControl(L.control.zoom({ position: 'bottomright' }));

        pricesMap.attributionControl.setPrefix(Config.map_attribution);

        var layerRetail = new L.MarkerClusterGroup({
            maxClusterRadius: 30,
            showCoverageOnHover: false
        });
        layerRetail.addTo(pricesMap);

        function updateResume(selection) {
            if(!selection) {
                afoResumeWrap$.empty();
                return false;
            }
            var from = selection.month_from_yyyymm,
                to = selection.month_to_yyyymm,
                timeRange = formatMonth(from) + ' - ' + formatMonth(to);

            var countries = _.map(treeCountry.getSelection('full'), function(o) {
                    return $('<div>').html(o.text).text();
                });

            afoResumeWrap$.html(resumeTmpl({
                items: [{
                    label: 'Product: ',
                    value: $("#prices_selectProduct option:selected").text()
                }, {
                    label: 'Country: ',
                    value: countries.join(', ')
                }, {                    
                    label: 'Time Range: ',
                    value: timeRange
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

                    var loc, title, value, type, prod;

                    for (var i in data) {

                        loc = data[i][1].split('|');
                        city = data[i][0].replace('[Town]','');
                        prod = Selection.fertilizer_name;
                        
                        vals = data[i][2].split(',');
                        types = data[i][3].split(',');

                        values = _.map(vals, function(val, k) {
                            return {
                                val: val,
                                type: types[k]
                            };
                        });

                        L.marker(loc)
                        .bindPopup( popupTmpl({
                            title: city,
                            values: values,
                            prod: prod
                        }) )
                        .addTo(layerRetail);
                    }

                    pricesMap.fitBounds(layerRetail.getBounds().pad(-1.2));
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

        pricesTypeRadio$.change(function () {
            updateUI(getSelection());
        });

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
                query: Config.queries.prices_detailed_countries
            },
            success: function (data) {
                var treeData = [];
                
                for (var r in data) {
                    treeData.push({
                        id: data[r][0],
                        text: data[r][1]
                    });
                }

                treeCountry.setData(treeData);
            }
        });
    });
});