/*global define*/
define(['config/services'], function (Config) {

    'use strict';

    function WDS() {
        this.config = Config:
    }

    WDS.prototype.get = function( o, context ){

        var data = {
            datasource: this.config.dbName,
            thousandSeparator: ',',
            decimalSeparator: '.',
            decimalNumbers: 2,
            cssFilename: '',
            nowrap: false,
            valuesIndex: 0,
            json: JSON.stringify({
                query: o.query
            })
        }, c = context || this;

        $.ajax({
            url: this.config.wdsUrl,
            data: data,
            type: 'POST',
            dataType: 'JSON',
            success: $.proxy(o.success, context ||  c),
            error: $.proxy((o.error || function (a, b, c) {
                console.error("WDS error: ");
                console.error(a);
                console.error(b);
                console.error(c);
            }), context ||  c)
        });

    };

    return new WDS();
});