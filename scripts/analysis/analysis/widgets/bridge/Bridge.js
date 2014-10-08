define([
    'jquery',
    'text!fx-ana/json/request.json'
], function ($, request) {

    var o = {},
        defaultOptions = {
            url: 'http://faostat3.fao.org:7788/find/data/',
            method: 'POST'
        };

    function Bridge(opts) {

        $.extend(o, defaultOptions, opts);
    }

    Bridge.prototype.getMetadata = function () {

        $.ajax({
            type: o.method,
            url: o.url,
            context : this,
            contentType: 'application/json',
            data: o.body,
            success: o.success,
            error : function () {
                alert("IPI-side Problems")
            }
        });
    };

    Bridge.prototype.query = function (settings) {

        $.extend(o, settings);

        this.createBodyRequest();
        this.getMetadata();
    };

    Bridge.prototype.createBodyRequest = function () {

        var r = JSON.parse(request);
        r.filter.metadata.uid.push({"enumeration": o.uid});

        o.body = JSON.stringify(r);
    };

    return Bridge;
});
