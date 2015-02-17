/*global define*/
define([
    "underscore",
    "commons/Wds",
    'text!config/services.json'
], function (_, Wds, C) {

    'use strict';

    var s = {
        PRODUCT: '#dirs_selectProducts',
        COUNTRY: '#dirs_selectCountries',
        BTN: '#search-btn',
        CONTAINER: '#table-result'
    }


    var CONFIG = {
        "Company": 0,
        "City": 1,
        "Fertilizer": 2,
        "Other Fertilizers": 3
    }

    var grid;


    function Selectors() {

        this.config = JSON.parse(C);
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


        function createCountryOption(data) {
            for (var i = 0; i < data.length; i++) {
                if (i == 0) {
                    $(s.COUNTRY).append("<option value='" + data[i][0] + "' selected>" + data[i][1] + "</option>")
                    self.startTable(data[i][0])
                }
                else {
                    $(s.COUNTRY).append("<option value='" + data[i][0] + "'>" + data[i][1] + "</option>")
                }
            }
        }

    };


    Selectors.prototype._applyListener = function () {


        var self = this;
        $(s.COUNTRY).on('change', function (e) {

            self.startTable($(s.COUNTRY).val())
        })


    }

    Selectors.prototype.startTable = function (countrySelected) {

        var self = this;

        var query = this.config.queries.directory_business_result;

        query = query.replace('{COUNTRY}', "'" + countrySelected + "'")

        Wds.get({
            query: query,
            success: function (res) {
                console.log('asdasdasdsa')
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


        console.log('here')


        var titles = Object.keys(CONFIG)

        $(s.CONTAINER).empty();

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
                        var value = (dataSource[CONFIG[titles[j]]]) ? dataSource[CONFIG[titles[j]]] : ''
                        toAppend += '<td>' + value + '</td>';
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