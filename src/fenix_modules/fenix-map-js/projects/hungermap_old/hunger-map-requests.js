HMRequests = {

    /**
     * retrieve the elements of the hungermap
     *
     * @param code
     * @param language
     */
    getElements : function(itemcode, language) {

        var query = "SELECT DISTINCT ElementCode,Element_Name" +  language +
            " FROM vData_HungerMap" +
            " WHERE ItemCode IN ("+ itemcode +") " +
            " ORDER BY ElementCode DESC";

        query = query.replace(/\n/g, ' ');

        var data = {};
        var sql = {};
        sql.limit = null;
        sql.query = query;
        sql.frequency = "NONE";
        data.datasource = HM_CONFIG.DATASOURCE;
        data.json = JSON.stringify(sql);
        data.thousandSeparator = ',';
        data.decimalSeparator = '.';

        var r = new RequestHandler();
        var url = HM_CONFIG.WDS_BASE_URL + '/rest/table/json';
        r.open('POST', url);
        r.setContentType('application/x-www-form-urlencoded');
        r.onload( function () {
                // TODO: set interface
                var response =  this.responseText;

                // TODO: load layers
                if (typeof response == 'string')    {
                    response = $.parseJSON(response);
                }
                for(var i=0; i< response.length; i++) {
                    var l = $.extend(true, {}, HM.l);
                    HM.layers.push(l)
                    HM.layersHashMap[i] = response[i][0];

                    HMRequests.loadMenu(i, response, l)
                    if ( i == 0 ) {
                        HMRequests.getValues(l, itemcode, response[i][0], language, true, null)
                    }
                    else {
                        HMRequests.getValues(l, itemcode, response[i][0], language, false, null)
                    }
                }
            }
        );
        r.send(FM.Util.parseLayerRequest(data))
    },

    loadMenu: function(id, response, l) {
        $("#hm-timeline-" + id).click({id: id}, function(event) {
            HM.switchLayer(event.data.id)
        });
    },

    /**
     *
     * retrieve the values of the layer
     *
     * @param layer
     * @param code
     * @param language
     * @param callback
     */
    getValues : function(l, itemcode, elementcode, language, addLayer, callback) {
        var query = "SELECT AreaCode, Value" +
            " FROM vData_HungerMap" +
            " WHERE ElementCode IN ("+ elementcode +")" +
            " AND ItemCode IN (" + itemcode +") " +
            " AND Value IS NOT NULL ";

        query = query.replace(/\n/g, ' ');

        var data = {};
        var sql = {};

        sql.limit = null;
        sql.query = query;
        sql.frequency = "NONE";

        data.datasource = HM_CONFIG.DATASOURCE;
        data.json = JSON.stringify(sql);
        data.thousandSeparator = ',';
        data.decimalSeparator = '.';

        var r = new RequestHandler();
        var url = HM_CONFIG.WDS_BASE_URL + '/rest/table/json';
        r.open('POST', url);
        r.setContentType('application/x-www-form-urlencoded');
        r.onload(function () {
            var response =  this.responseText;
            if (typeof response == 'string') {
                response = $.parseJSON(response);
            }

            var joindata = [];
            for(var i=0; i< response.length; i++) {
                //console.log(response[i][0]);
                var data = {};
                data[response[i][0]] =response[i][1];
                joindata.push(data)
            }
            var s = JSON.stringify(joindata)

            l.layer.joindata = s;
            if ( addLayer)      {
                l.createShadeLayerRequestCached(null, true);
            }
            else
                l.createShadeLayerRequestCached(null, false);
        });
        r.send(FM.Util.parseLayerRequest(data));
    },

    countryGFI: function(l, layerPoint, latlng, map, columnCode) {
        var latlngStr = '(' + latlng.lat.toFixed(3) + ', ' + latlng.lng.toFixed(3) + ')';
        var bounds = map.getBounds(),sw = map.options.crs.project(bounds.getSouthWest()),ne = map.options.crs.project(bounds.getNorthEast());
        var BBOX = sw.x + ',' + sw.y +',' + ne.x + ',' + ne.y;
        var WIDTH = map.getSize().x;
        var HEIGHT = map.getSize().y;
        var X = map.layerPointToContainerPoint(layerPoint).x;
        var Y = map.layerPointToContainerPoint(layerPoint).y;

        // TODO: check it because in theory it shouldn't be needed
        X = new Number(X);
        X = X.toFixed(0) //13.3714
        Y = new Number(Y);
        Y = Y.toFixed(0) //13.3714

        var url = 'http://' + FM.CONFIG.BASEURL_MAPS  + FM.CONFIG.MAP_SERVICE_GFI_STANDARD;
        url += '?SERVICE=WMS';
        url += '&VERSION=1.1.1';
        url += '&REQUEST=GetFeatureInfo';
        url += '&BBOX='+BBOX;
        url += '&HEIGHT='+HEIGHT;
        url += '&WIDTH='+WIDTH+'&FORMAT=image/png';
        url += '&INFO_FORMAT=text/html';
        url += '&X='+X+'' +'&Y='+Y;

        // get the selected layer and layer values
        if ( l != '' && l != null ) {
            url += '&LAYERS=' + l.layer.layername;
            url += '&QUERY_LAYERS=' + l.layer.layername;
            url += '&STYLES=';
            url += '&SRS='+l.layer.srs; //EPSG:3857
            url += '&urlWMS=' + l.layer.urlWMS;

            HMRequests.getFeatureInfoJoinRequest(map, url, 'GET', null ,latlng,  columnCode);
        }
        else {
            // alert('no layer selected')
        }
    },

    getFeatureInfoJoinRequest: function(map, url, requestType, data, latlon, columnCode) {
        var _map = map;
        var r = new RequestHandler();
        r.open(requestType, url);
        r.setContentType('application/x-www-form-urlencoded');
        r.onload(function () {
            var response = this.responseText
            /** TODO: set auto width to the popup **/
            if ( response != null ) {
                $(response).find('value').each(function(){
                    var columnname = $(this).find('columnname').text();
                    var columnvalue = $(this).find('columnvalue').text();
                    /** TODO: remove hardcoded **/
                    if ( columnname == columnCode) {
                        var countryCode = parseInt(columnvalue).toString();
                        HMRequests.getCountryDetails(map, HM_CONFIG.ITEMCODE, HM.layersHashMap[HM.selectedLayerIndex], countryCode, HM.layerLang, latlon);
                    }
                });
            }
        });
        if ( data )
            r.send(FM.Util.parseLayerRequest(data));
        else
            r.send();
    },

    getCountryDetails: function(map, itemcode, elementcode, code, lang, latlon) {
        var query =
            "SELECT " +
                "Area_Name"+ lang +
                ",Item_Name" + lang +
                ",Element_Name" + lang +
                ",Value" +
                ",Unit_Name" + lang +
                " FROM vData_HungerMap " +
                " WHERE ElementCode IN ("+ elementcode +")" +
                " AND ItemCode IN (" + itemcode +") " +
                " AND AreaCode IN (" + code +") " +
                " AND Value IS NOT NULL ";

        query = query.replace(/\n/g, ' ');

        var data = {};
        var sql = {};

        sql.limit = null;
        sql.query = query;
        sql.frequency = "NONE";

        data.datasource = HM_CONFIG.DATASOURCE;
        data.json = JSON.stringify(sql);
        data.thousandSeparator = ',';
        data.decimalSeparator = '.';

        var _map = map;
        var r = new RequestHandler();
        var url = HM_CONFIG.WDS_BASE_URL + '/rest/table/json'
        r.open('POST', url);
        r.setContentType('application/x-www-form-urlencoded');
        r.onload(function () {
            /** TODO set the default div if it's null **/
            // do something to response
            var response = this.responseText
            if ( response != null&& response != '[]' ) {
                if (typeof response == 'string')    {
                    response = $.parseJSON(response);
                }

                // highlight the country
                HM.highlightCountry(code);
                HM.selectedCountryCode = code;

                var value = parseFloat(response[0][3]).toFixed(1);
                var integer = Math.floor(value);
                var decimals = +value.toString().replace(/^[^\.]+/,'0');
                decimals = HMRequests.replaceAll(decimals.toString(), '0', '');

                $('#hm-areaname').html("");
                $('#hm-value').html("");
                $('#hm-valuedecimal').html("");
                $('#hm-unitname').html("");
                $('#hm-itemname').html("");
                $('#hm-elementname').html("");

                if ( value == 0 ) {
                    $('#hm-circle').show();
                    $('#hm-elementaname').show();
                    $('#hm-missingdata').hide();

                    $('#hm-areaname').html(response[0][0]);
                    $('#hm-value').html("<5");
                    $('#hm-unitname').html("%");
                    $('#hm-elementname').html(response[0][1]);

                    $('#hm-valuecircle').removeAttr('class');
                    $('#hm-valuecircle').attr('class', 'hm-circle hm-bgcolor-1');
                    $('#hm-value').removeAttr('class');
                    $('#hm-value').attr('class', 'percent hm-color-1');
                    $('#hm-unitname').removeAttr('class');
                    $('#hm-unitname').attr('class', 'percent hm-color-1');

                }
                else if ( value == -1 ) {
                    $('#hm-circle').hide();
                    $('#hm-elementaname').hide();
                    $('#hm-missingdata').show();

                    $('#hm-areaname').html(response[0][0]);

                    switch(HM.mapLang) {
                        case 'FR':
                            $('#hm-missingdata').html('Données manquantes ou insuffisantes');
                            break;
                        case 'ES':
                            $('#hm-missingdata').html('Información ausente o insuficiente');
                            break;
                        default:
                            $('#hm-missingdata').html('Missing or insufficient data');
                            break
                    }

                    $('#hm-valuecircle').removeAttr('class');
                    $('#hm-value').removeAttr('class');
                    $('#hm-value').attr('class', 'percent hm-color-0');
                    $('#hm-valuedecimal').removeAttr('class');
                    $('#hm-valuedecimal').attr('class', 'percent hm-color-0');
                    $('#hm-unitname').removeAttr('class');
                    $('#hm-unitname').attr('class', 'percent hm-color-0');
                }
                else {
                    $('#hm-circle').show();
                    $('#hm-elementaname').show();
                    $('#hm-missingdata').hide();

                    $('#hm-areaname').html(response[0][0]);
                    $('#hm-value').html(integer);
                    $('#hm-valuedecimal').html(decimals);
                    $('#hm-unitname').html( response[0][4]);
                    $('#hm-itemname').html(response[0][2]);
                    $('#hm-elementname').html(response[0][1]);


                    var j = 0;
                    for( var i =0; i< HM.rangesHM.length; i++) {
                        if ( value <= HM.rangesHM[i]) {
                            break;
                        }
                        j++;
                    }
                    $('#hm-valuecircle').removeAttr('class');
                    $('#hm-valuecircle').attr('class', 'hm-circle hm-bgcolor-'+ j);
                    $('#hm-value').removeAttr('class');
                    $('#hm-value').attr('class', 'percent hm-color-'+ j);
                    $('#hm-valuedecimal').removeAttr('class');
                    $('#hm-valuedecimal').attr('class', 'percent hm-color-'+ j);
                    $('#hm-unitname').removeAttr('class');
                    $('#hm-unitname').attr('class', 'percent hm-color-'+ j);
                }
            }
            else {
                // TODO: nothing because it mean that a country as not been selected
            }
        });
        if ( data )
            r.send(FM.Util.parseLayerRequest(data));
        else
            r.send();
    },

    replaceAll : function(text, stringToFind, stringToReplace) {
        var temp = text;
        var index = temp.indexOf(stringToFind);
        while(index != -1){
            temp = temp.replace(stringToFind,stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
    }
}
