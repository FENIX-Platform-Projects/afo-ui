/*global define*/
define([
    "underscore",
    "commons/Wds",
    'text!config/services.json',
    'webix'
], function (_, Wds, C) {

    'use strict';

    var s = {
        PRODUCT: '#dirs_selectProducts',
        COUNTRY: '#dirs_selectCountries',
        BTN    : '#search-btn',
        CONTAINER : 'table-result'
    }


    var CONFIG = {
        "Company": 0,
        "City": 1,
        "Fertilizer":2,
        "Others":3
    }

    var grid;





    function Selectors() {

        this.config = JSON.parse(C);
        this._initMapSelector();
        this._applyListener();
    //    this._initElementSelector();
    //    this._initProductNutrientSelector();
    //    this._initCompareSelector();
    //    this._initShowAsSelector();
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
            for(var i=0; i < data.length; i++) {
                $(s.COUNTRY).append("<option value='"+ data[i][0] + "'>"+ data[i][1]+"</option>")
            }
        }

    };


    Selectors.prototype._applyListener = function(){


        var self = this;
        $(s.BTN).on('click', function(e){

            self.startTable($(s.COUNTRY).val())
        })

    }

    Selectors.prototype.startTable = function (countrySelected){

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


    Selectors.prototype.createDataTableModel=  function(){

        var columns = [];

        var titles = Object.keys(CONFIG)

        for(var i = 0; i<titles.length; i++) {

            columns.push({id: "data" + CONFIG[titles[i]], header: titles[i]})
        }

        return columns;
    }


    Selectors.prototype.renderGrid = function( dataSource){


        var columns = this.createDataTableModel()

        if(grid && grid.destructor){
            grid.destructor()
        }

        console.log(columns)

        console.log(dataSource)


        grid = webix.ui({
            container: s.CONTAINER,
            view: "datatable",
            rowHeight: 29,
            columnWidth: 200,
            clipboard: "selection",
            columns: columns,
            datatype: "jsarray",
            visibleBatch: 1,
            data: dataSource
        });
    }

    return Selectors;
});