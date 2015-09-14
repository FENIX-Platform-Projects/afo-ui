/*global define*/
define([
    'underscore',
    'glance/Results',
    'glance/Selectors',
    'config/services',
    'amplify'
], function (_, Results, Selectors, Config) {

    'use strict';

    var s = {
        FOOTER: '.footer',
        SEARCH_BTN: '#search-btn',
        COURTESY: '#afo-courtesy',
        RESULTS: '#afo-results',
        RESUME : '#afo-resume'
    };

    function App() {
        this.state = {};
        this.config = Config;
    }

    App.prototype.start = function () {

        this._bindEventListeners();
        this._initPageStructure();
    };

    App.prototype._initPageStructure = function () {

        this.selectors = new Selectors();
        
        this.results = new Results();
    };

    App.prototype._bindEventListeners = function () {

        $(s.SEARCH_BTN).on('click', _.bind(this.query, this));

        amplify.subscribe('afo.selector.select', _.bind(this.updateResume, this));
    };

    App.prototype.updateResume = function () {

        var resume = this.selectors.getSelection(),
            keys = Object.keys(resume);

        $(s.RESUME).empty();

        _.each(keys, function (key ) {

            if (resume.hasOwnProperty(key) && resume[key] && Array.isArray(resume[key]) && resume[key].length > 0){

                var $li = $('<li>'),
                    $label = $('<span>'),
                    $value =  $('<b>', {text : resume[key][0].text }),
                    lab;

                switch(key){
                    case 'COUNTRY': lab = 'Africa Country '; break;
                    case 'KIND' :  lab = 'View in '; break;
                    case 'SOURCE' :  lab = 'Data Source '; break;
                    case 'PRODUCT' :  lab = 'Fertilizer '; break;
                }

                $label.html(lab);

                $li.append($label).append($value);
                $(s.RESUME).append($li)
            }
        })
    };

    App.prototype.query = function () {

        var results = this.selectors.getFilter();

        if (results !== false) {
            $(s.COURTESY).hide();
            $(s.RESULTS).show();

            this.queryTable(results);
        }
    };

    //Chart
    App.prototype.prepareChartQuery = function (results) {
        var url = results.SOURCE[0].code === 'cstat' ? this.config.queries.select_from_compare_chart_cstat : this.config.queries.select_from_compare_chart;

        return this._replace(url, {
            COUNTRY: results.COUNTRY[0].code,
            SOURCE: results.SOURCE[0].code,
            KIND: results.KIND[0].code,
            PRODUCT: results.PRODUCT[0].code
        });
    };

    App.prototype._showqueriesCourtesyMessage = function() {
        var $btn = $('#search-btn'),
            t = $btn.text();

        $btn.text('No Results Found!');
        setTimeout(function() {
            $btn.text(t);
        }, 2000);
    };

    //Table
    App.prototype.prepareTableQuery = function (results) {

        var sql,res;

        if(results.SOURCE[0].code === 'cstat')
            sql = this.config.queries.select_from_compare_cstat;

        else if(results.SOURCE[0].code === 'ifa')
            sql = this.config.queries.select_from_compare_ifa;

        else
            sql = this.config.queries.select_from_compare;

        res = this._replace(sql, {
            COUNTRY: results.COUNTRY[0].code,
            SOURCE: results.SOURCE[0].code,
            KIND: results.KIND[0].code,
            PRODUCT: results.PRODUCT[0].code
        });

        return res;
    };

    App.prototype.queryTable = function (results) {

        var data = {
            datasource: this.config.dbName,
            thousandSeparator: ',',
            decimalSeparator: '.',
            decimalNumbers: 2,
            cssFilename: '',
            nowrap: false,
            valuesIndex: 0,
            json: JSON.stringify({
                query: this.prepareTableQuery(results)
            })
        };

        $.ajax({
            url: this.config.wdsUrl,
            data: data,
            type: 'POST',
            dataType: 'JSON',
            success: _.bind(function (data) {

                this.results.printTable(data, this.selectors.getFilter() );

            }, this),
/*            error: function (e) {
                console.error("WDS error: ");
                console.log(e)
            }*/
        });

    };

    // General
    App.prototype._replace = function (str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            return data[key] || '';
        });
    };

    App.prototype._showCourtesyMessage = function () {
        $(s.COURTESY).show();
        $(s.RESULTS).hide();

    };

    return App;
});