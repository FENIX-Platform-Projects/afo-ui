define(['underscore',
    'fx-common/js/WDSClient',
    'glance/Results',
    'glance/Selectors',
    'config/services',
    'amplify'
], function (_,
    WDSClient,
    Results,
    Selectors,
    Config) {

    'use strict';

    var s = {
        FOOTER: '.footer',
        SEARCH_BTN: '#search-btn',
        COURTESY: '#afo-courtesy',
        RESULTS: '#afo-results',
        RESUME: '#afo-resume'
    };

    var wdsClient = new WDSClient({
        datasource: Config.dbName,
        outputType: 'array'
    });

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

        _.each(keys, function (key) {

            if (resume.hasOwnProperty(key) && resume[key] && Array.isArray(resume[key]) && resume[key].length > 0) {
                var v = resume[key],
                    text = (_.isArray(v) ? v.map(function (elem) { return elem.text }).join(',') : v),
                    $li = $('<li>'),
                    $label = $('<span>'),
                    $value = $('<b>', { text: text }),
                    lab;

                switch (key) {
                    case 'COUNTRY': lab = 'Africa Countries '; break;
                    case 'KIND': lab = 'View in '; break;
                    case 'SOURCE': lab = 'Data Source '; break;
                    case 'PRODUCT': lab = 'Fertilizer '; break;
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

    App.prototype._showqueriesCourtesyMessage = function () {
        var $btn = $('#search-btn'),
            t = $btn.text();

        $btn.text('No Results Found!');
        setTimeout(function () {
            $btn.text(t);
        }, 2000);
    };

    //Table
    App.prototype.selectQuery = function (results) {

        var sql, res;

        if (results.SOURCE[0].code === 'cstat')
            sql = this.config.queries.select_from_compare_cstat;

        else if (results.SOURCE[0].code === 'ifa')
            sql = this.config.queries.select_from_compare_ifa;

        else
            sql = this.config.queries.select_from_compare;

        return sql;
    };

    App.prototype.queryTable = function (results) {
        var qVars = {
            COUNTRY: results.COUNTRY.map(function (elem) { return "'" + elem.code + "'" }).join(','),
            SOURCE: results.SOURCE[0].code,
            KIND: results.KIND[0].code,
            PRODUCT: results.PRODUCT.map(function (elem) { return "'" + elem.code + "'" }).join(','),
        };
        wdsClient.retrieve({
            payload: {
                query: this.selectQuery(results),
                queryVars: qVars
            },
            success: _.bind(function (data) {
                this.results.printTable(data, this.selectors.getFilter());
            }, this)
        });
    };

    return App;
});