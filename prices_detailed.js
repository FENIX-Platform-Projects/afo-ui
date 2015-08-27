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
        'scripts/prices/local/results'
    ], function ($, _, bts, jstree, Handlebars, L, LeafletMarkecluster, rangeslider, moment,
		Config,
		renderAuthMenu,
        resultsTable
        ) {

        renderAuthMenu(true);

        var resumeTmpl = Handlebars.compile('<ul id="afo-resume">{{#each items}}<li><span>{{label}} </span><b>{{value}}</b></li>{{/each}}</ul>');

        var listProducts$ = $('#prices_selectProduct'),
            listCountries$ = $('#prices_selectCountry'),
            listMarkets$ = $('#prices_selectMarket'),
        	rangeMonths$ = $('#prices_rangeMonths'),
        	Selection = {
        	    fertilizer_code: '3105300000',
        	    country_code: '270',
        	    month_from_yyyymm: '201003',
        	    month_to_yyyymm: '201501'
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
                datasource: Config.dbName,
                thousandSeparator: ',',
                decimalSeparator: '.',
                decimalNumbers: 2,
                cssFilename: '',
                nowrap: false,
                valuesIndex: 0,
                json: JSON.stringify({ query: sql })
            };

            $.ajax({
                url: Config.wdsUrl,
                data: data,
                type: 'POST',
                dataType: 'JSON',
                success: callback
            });
        }

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
            if ($('#marketTypeOpen').is(':checked')) {
                mType = $('#marketTypeOpen').val();
            }
            if ($('#marketTypeSub').is(':checked')) {
                if (mType != '')
                    mType += ",";
                mType += $('#marketTypeSub').val();
            }

            var toRet = {
                fertilizer_code: listProducts$.val(),
                country_code: $('#country-s').jstree(true).get_selected().join("', '"),
                marketType: mType,
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

        //TODO: Add the other fields (Country, market)
        function updateResume(Selection) {

            var from = Selection.month_from_yyyymm,
				to = Selection.month_to_yyyymm,
				timeRange = formatMonth(from) + ' - ' + formatMonth(to);

            $('#afo-resume-wrap').html(resumeTmpl({
                items: [{
                    label: 'Product',
                    value: $("#prices_selectProduct option:selected").text()
                }, {
                    label: 'Time Range',
                    value: timeRange
                }/*, {
                    label: 'Country',
                    value:'CCC'
                }*/
                ]
            }));
        }

        function loadMarkers(Selection) {

            getWDS(Config.queries.prices_detailed_local_geofilter, Selection, function (data) {

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

                resultsTable(Selection, $('#table-result'));
                updateResume(Selection);
            });
        }

        /*			rangeMonths$.dateRangeSlider();
                rangeMonths$.dateRangeSlider("option","bounds", {
                    min: new Date(2010, 2, 0),
                    max: new Date(2015, 4, 0)
                });*/

        rangeMonths$.dateRangeSlider(Config.dateRangeSlider.prices_detaild);

        rangeMonths$.on('valuesChanged', function (e, data) {

            /*var values = data.values,

				minD = new Date(values.min),
				maxD = new Date(values.max),

				minM = minD.getMonth() + 1,
				maxM = maxD.getMonth() + 1;

            var minDate = "" + minD.getFullYear() + (minM < 10 ? '0' + minM : minM),
				maxDate = "" + maxD.getFullYear() + (maxM < 10 ? '0' + maxM : maxM);

            Selection = {
                fertilizer_code: $("#prices_selectProduct").val(),
                country_code: listCountries$.val(),
                month_from_yyyymm: minDate,
                month_to_yyyymm: maxDate
            };
            loadMarkers(Selection);*/
            loadMarkers(getSelection());
        });

        $('input[name=prices_range_radio]').on('click', function (e) {

            var val = parseInt($(this).val()),
				max = moment(Config.dateRangeSlider.prices_detaild.bounds.max),
				min = max.subtract(val, 'months').toDate();
            rangeMonths$.dateRangeSlider('min', min);
        });

        $(listProducts$).on('change', function (e) {
            /*Selection.fertilizer_code = $(e.target).val();
            loadMarkers(Selection);*/
            loadMarkers(getSelection());
        });

        listCountries$.on('change', function (e) {
            /*Selection.country_code = $(e.target).val();
            loadMarkers(Selection);*/
            loadMarkers(getSelection());
        });

        getWDS(Config.queries.prices_detailed_products, null, function (products) {
            for (var r in products)
                listProducts$.append('<option value="' + products[r][0] + '">' + products[r][1] + '</option>');
        });
        getWDS(Config.queries.countries, null, function (countries) {
            /*for (var r in countries)
                listCountries$.append('<option value="' + countries[r][0] + '">' + countries[r][1] + '</option>');*/

            var treeData = [];
            for (var r in countries)
                treeData.push({ id: countries[r][0], text: countries[r][1], state: { selected: true } });
            createTree($('#country-s'), treeData);
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
                "ui": { "initially_select": ['2814200000'] }
            });

            cnt$.jstree(true).select_node('ul > li:first');
        }
        /*END ORGANIZE*/

        loadMarkers(Selection);

    });
});