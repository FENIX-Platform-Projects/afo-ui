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
	    'jquery', 'underscore', 'bootstrap', 'jstree', 'handlebars', 'leaflet', 'leaflet-markercluster', 'jquery.rangeSlider', 'moment',
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

        var resumeTmpl = Handlebars.compile('<ul id="afo-resume">{{#each items}}<li><span>{{label}} </span><b>{{value}}</b></li>{{/each}}</ul>');

        var listProducts$ = $('#prices_selectProduct'),
            listCountries$ = $('#country-s'),
            radioMarketTypeAll$ = $('#marketTypeAll'),
            radioMarketTypeOpen$ = $('#marketTypeOpen'),
            radioMarketTypeSub$ = $('#marketTypeSub'),
        	rangeMonths$ = $('#prices_rangeMonths'),
            tableresult$ = $('#table-result');
        //,
        /*Selection = {
            fertilizer_code: '3105300000',
            country_code: '',
            mType: radioMarketTypeAll$.val(),
            month_from_yyyymm: '201003',
            month_to_yyyymm: '201501'

        };*/

        function formatMonth(date) {
            return [date.slice(0, 4), '/', date.slice(4)].join('')
        }

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
                mType = radioMarketTypeAll$.val();
            if (radioMarketTypeOpen$.is(':checked'))
                mType = radioMarketTypeOpen$.val();
            if (radioMarketTypeSub$.is(':checked'))
                mType = radioMarketTypeSub$.val();

            var toRet = {
                fertilizer_code: listProducts$.val(),
                country_code: listCountries$.jstree(true).get_selected(),
                market_type: mType,
                month_from_yyyymm: minDate,
                month_to_yyyymm: maxDate
            }
            return toRet;
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
            var from = selection.month_from_yyyymm,
                to = selection.month_to_yyyymm,
                timeRange = formatMonth(from) + ' - ' + formatMonth(to);

            var countries = listCountries$.jstree(true).get_selected(true).map(
                function (c) {
                    return c.text;
                });

            $('#afo-resume-wrap').html(resumeTmpl({
                items: [{
                    label: 'Product: ',
                    value: $("#prices_selectProduct option:selected").text()
                }, {
                    label: 'Time Range: ',
                    value: timeRange
                }, {
                    label: 'Country: ',
                    value: countries
                }, {
                    label: 'Market type: ',
                    value: selection.market_type
                }]
            }));
        }

        function updateUI(selection) {
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

                    var popupTmpl = "<div class='fm-popup'>" +
                                        "<div class='fm-popup-join-title'><b>{title}</b></div>" +
                                        "<div class='fm-popup-join-content'>" +
                                            "<i>product name:</i> {fert}<br />" +
                                            "<i>average price:</i> {val}" +
                                        "</div>" +
                                        "</div>";

                    for (var i in data) {

                        data[i][0] = data[i][0].replace('[Town]', '');
                        data[i][1] = data[i][1].split('|');
                        data[i][2] += ' USD/tons';

                        L.marker(data[i][1])
                            .bindPopup(L.Util.template(popupTmpl, {
                                title: data[i][0],
                                fert: $("#prices_selectProduct option:selected").text(),
                                val: data[i][2]
                            }))
                            .addTo(layerRetail);
                    }

                    map.fitBounds(layerRetail.getBounds().pad(-1.2));
                }
            });
        }

        //TODO: Set it at the end of the range as default
        rangeMonths$.dateRangeSlider(Config.dateRangeSlider.prices_detaild);
        

        //Events
        rangeMonths$.on('valuesChanged', function (e, data) {
            updateUI(getSelection());
        });

        $('input[name=prices_range_radio]').on('click', function (e) {

            var val = parseInt($(this).val()),
                max = moment(Config.dateRangeSlider.prices_detaild.bounds.max),
                min = max.subtract(val, 'months').toDate();
            rangeMonths$.dateRangeSlider('min', min);
        });

        $(listProducts$).on('change', function (e) {
            updateUI(getSelection());
        });

        listCountries$.on('changed.jstree', function (e) {
            updateUI(getSelection());
        });

        $('input[type=radio][name=mType_radio]').change(function () {
            updateUI(getSelection());
        });
        $('#country-sel-all-s').on('click', function () {
            listCountries$.jstree(true).check_all();
        });
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

        $('#price_table_download').on('click', function (e) {

            var sqltmpl = _.template(Config.queries.prices_detailed_local_geofilter);
            sql = sqltmpl(Selection),
            query = JSON.stringify({ query: sql });
            //.replace(/[']/g,"\'");//.replace(/[']/g,"`");

            $("<form style='display:none;' id='csvFormWithQuotes' name='csvFormWithQuotes'" +
            "method='POST' action='" + Config.wdsUrlExportCsv + "' target='_new'>" +
            "<div><input type='text' value='faostat' name='cssFilename_WQ' id='cssFilename_WQ_csv'/></div>" +
            "<div><input type='text' value='africafertilizer' name='datasource_WQ_csv' id='datasource_WQ_csv'/></div>" +
            "<div><input type='text' value='2' name='decimalNumbers_WQ_csv' id='decimalNumbers_WQ_csv'/></div>" +
            "<div><input type='text' value='.' name='decimalSeparator_WQ_csv' id='decimalSeparator_WQ_csv'/></div>" +
            "<div><input type='text' value=',' name='thousandSeparator_WQ_csv' id='thousandSeparator_WQ_csv'/></div>" +
            "<div><input type='text' value='6' name='valueIndex_WQ_csv' id='valueIndex_WQ_csv'/></div>" +
            "<div><input type='text' value='" + query + "' name='json_WQ_csv' id='json_WQ_csv'/></div>" +
            "<div><input type='text' value='' name='quote_WQ_csv' id='quote_WQ_csv'/></div>" +
            "<div><input type='text' value='' name='title_WQ_csv' id='title_WQ_csv'/></div>" +
            "<div><input type='text' value='' name='subtitle_WQ_csv' id='subtitle_WQ_csv'/></div>" +
            "</form>").insertAfter(this).submit();
        });







        /*ORGANIZE*/
        function createTree(cnt$, data) {
            cnt$.jstree({
                "core": {
                    "multiple": true,
                    "animation": 0,
                    "themes": { "stripes": true },
                    'data': data
                },
                "plugins": ["search", "wholerow", "ui", "checkbox"],
                "search": {
                    show_only_matches: true
                },
                //"ui": { "initially_select": ['2814200000'] }
            });

            //cnt$.jstree(true).select_node('ul > li:first');
        }

        // $(function () { loadMarkers(getSelection()); });
        /*END ORGANIZE*/
    });
});