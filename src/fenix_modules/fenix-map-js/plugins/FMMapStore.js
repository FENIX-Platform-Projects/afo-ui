var FMMapStore = (function() {

    var oSave = {
        "title": {
            "EN": "Default Title"
        },
        "description": {
            "EN": "Default Title"
        },
        "dataType": "raster"
    }

    /** TODO: handle update **/
    function savemapview(metadataObj, mapObj, callback, url) {

        var data = $.extend(true, {}, FMMapStore.oSave, metadataObj);
        data.freeExtension = mapObj;

        if ( !data.uid ) data.uid = "mapview-test-" + FM.Util.randomID();
        if ( !data.dataType ) data.dataType = "raster";
        if ( !url ) url = FMCONFIG.D3SP_SERVICE_SAVEMAP;

        ajaxCallSave(url, data, 'POST', callback)
        return data.uid;
    };

    /** TODO: handle append or overwrite **/
    function updatemapview(metadataObj, mapObj, callback, url) {
        var data = $.extend(true, {}, FMMapStore.oSave, metadataObj);
        data.freeExtension = mapObj;

        if ( !data.uid ) data.uid = "mapview-test-" + FM.Util.randomID();
        if ( !data.dataType ) data.dataType = "raster";
        if ( !url ) url = FMCONFIG.D3SP_SERVICE_SAVEMAP;

        ajaxCallSave(url, data, 'PUT', callback)
    };

    function loadmapview(mapid, callback, url) {
        if ( !url ) url = FMCONFIG.D3SP_SERVICE_LOADMAP;
        ajaxCallLoad(url += mapid, 'GET', callback)
    };

    function ajaxCallLoad(url, method, callback) {
        $.ajax({
            url : url,
            type: method.toUpperCase(),
            success: function(data, textStatus, jqXHR) {
                console.log('Map loaded');
                if ( callback ) callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) { console.log(jqXHR); }
        });
    }

    function ajaxCallSave(url, data, method, callback) {
        if ( data == 'string') data = JSON.stringify(data);
        $.ajax({
            url : url,
            type: method.toUpperCase(),
            contentType: 'application/json; charset=utf-8',
            data : data,
            processData  :   false,
            success: function(data, textStatus, jqXHR) {
                console.log('Map saved');
                if ( callback ) callback();
            },
            error: function (jqXHR, textStatus, errorThrown) { console.log(jqXHR); }
        });
    }

    return {
        savemapview : savemapview,
        loadmapview : loadmapview
    }

})();