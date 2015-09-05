/*global define*/
define([
    "underscore",
    "src/commons/Wds",
    'config/services'
], function (_, Wds, Config) {

    'use strict';

    var s = {
        PRODUCT: '#dirs_selectProducts',
        SECTOR: '#dirs_selectSector',
        COUNTRY: '#dirs_selectCountries',

        BTN: '#search-btn',
        CONTAINER: '#table-result'
    }

    var PRODUCTS = [
        "Fertilizers",
        "Seeds",
        "Crop Protection Products",
        "Farm Equipment",
        "Engrais, Pesticides, petits matériel agricole",
        "All"
    ]

    var SECTORS =
        [
            "Production",
            "Blending / Granulation",
            "Logistics",
            "Logistics (transport, warehouse)",
            "Import / Export",
            "Research / Extension",
            "Research",
            "Distribution (wholesale, retail)",
            "Regulations / Policies",
            "Finance / Insurance",
            "Training /  Technical Assistance",
            "Labs / Analysis",
            "Projects / Consultancy",
            "Media",
            "All"
        ]


    var CONFIG = {
        "Company": 0,
        "City": 1,
        "Services": 2,
        "Sector": 3
    }

    var grid;


    function Selectors() {

        this.config = Config;
        this._initMapSelector();
        this._applyListener();
    }

    Selectors.prototype._initMapSelector = function () {

        var self = this;

        Wds.get({
            query: this.config.queries.directory_business_country,
            success: function (res) {
                createCountryOption(res)
            }
        });


        createProductOption(PRODUCTS)

        createSectorOption(SECTORS)


        function createCountryOption(data) {
        	data.unshift([0,'All']);
            for (var i = 0; i < data.length; i++)
				$(s.COUNTRY).append("<option value='" + data[i][0] + "'>" + data[i][1] + "</option>");
        }

        function createProductOption(data) {
            data.sort();
            for (var i = 0; i < data.length; i++)
                $(s.PRODUCT).append("<option value='" + data[i] + "'>" + data[i] + "</option>");
        }

        function createSectorOption(data) {
            data.sort();
            for (var i = 0; i < data.length; i++)
                $(s.SECTOR).append("<option value='" + data[i] + "'>" + data[i] + "</option>");
        }

    };


    Selectors.prototype._applyListener = function () {


        var self = this;
        $(s.BTN).on('click', function (e) {
            $(s.CONTAINER).empty()

            self.startTable($(s.COUNTRY).val(), $(s.PRODUCT).val(), $(s.SECTOR).val())
        })


        $(s.COUNTRY).on('change', function (e) {
            $(s.BTN).click();
        })

        $(s.PRODUCT).on('change', function (e) {
            $(s.BTN).click();
        })

        $(s.SECTOR).on('change', function (e) {
            $(s.BTN).click();
        })


    }

    Selectors.prototype.startTable = function (countrySelected, productSelected, sectorSelected) {

        var self = this;


        if (productSelected != 'All' && sectorSelected != 'All') {
            var query = this.config.queries.directory_business_result;
            query = query.replace('{COUNTRY}', "'" + countrySelected + "'")
            query = query.replace(/{SERVICE}/g, "'" + sectorSelected + "'")
            query = query.replace(/{SECTOR}/g, "'" + productSelected + "'")

        }


        // every is product All
        else if (productSelected == 'All' && sectorSelected == 'All') {
            var query = this.config.queries.directory_business_only_country_all;
            query = query.replace('{COUNTRY}', "'" + countrySelected + "'")
        }

        // only productSelected All
        else if (productSelected == 'All' && sectorSelected != 'All') {
            var query = this.config.queries.directory_business_only_product_all;
            query = query.replace('{COUNTRY}', "'" + countrySelected + "'")
            query = query.replace(/{SERVICE}/g, "'" + sectorSelected + "'")
        }


        // only productSelected All
        else {
            var query = this.config.queries.directory_business_only_sector_all;
            query = query.replace('{COUNTRY}', "'" + countrySelected + "'")
            query = query.replace(/{SECTOR}/g, "'" + productSelected + "'")
        }


        Wds.get({
            query: query,
            success: function (res) {
                self.renderGrid(res);
            }
        });

    }


    Selectors.prototype.createDataTableModel = function () {

        var columns = [];

        var titles = Object.keys(CONFIG)

        for (var i = 0; i < titles.length; i++) {

            columns.push({id: "data" + CONFIG[titles[i]], header: titles[i]})
        }

        return columns;
    }


    Selectors.prototype.renderGrid = function (dataSource) {


        var titles = Object.keys(CONFIG)


        if (dataSource.length > 0) {


            $(s.CONTAINER).append(' <h3 class="afo-title">table: result</h3><table class="table table-hover" id="tableToAppend"></table>');

            var toAppend;

            for (var i = 0; i < dataSource.length + 1; i++) {

                if (i == 0) {
                    toAppend += '<thead><tr>';
                    for (var j = 0; j < titles.length; j++) {
                        toAppend += '<th>' + titles[j] + '</th>';
                    }
                    toAppend += '</tr></thead><tbody>';
                } else {
                    toAppend += '<tr>'
                    for (var j = 0; j < titles.length; j++) {
                        var value = (dataSource[i - 1][CONFIG[titles[j]]]) ? dataSource[i - 1][CONFIG[titles[j]]] : ''
                        value = value.replace(/0 /g, " ")
                        value = value.replace(/0/g, "")

                        toAppend += '<td class="cellAfoTable">' + value + '</td>';
                    }
                    toAppend += '</tr>'
                }
            }

            toAppend += '</tbody></table>';

            $('#tableToAppend').append(toAppend);

        }

    }

    return Selectors;
});