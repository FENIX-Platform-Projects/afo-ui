// Wrap code with module pattern.
(function() {
    var global = this;

    // widget constructor function
    global.FMDDMAp = function() {

        var o = {
            id : '',
            dropdown: {
                // id: '',
                url:'',
                callback: '',
                json: '',
                buttonid: ''
            },
            maps: [
                {
                    //id:'',
                    url: '',
                    fenixmap: '',
                    callback: createFromJSONCallback,
                    selected: true
                }
            ]
        };

        var init = function(obj) {
            o = $.extend(true, {}, o, obj);
            createGUIStructure(o.id);
        };

        var createGUIStructure = function(id) {
            var ddcontentID = randomID();
            o.dropdown.id = randomID();
            o.dropdown.buttonid = randomID();

            // build dropdown
            $('#' + id).append('<div  class="row" id='+ ddcontentID +'></div>');

            $('#' + ddcontentID).append('<div class="col-lg-3" id='+ o.dropdown.id  +'>dd</div>');
            $('#' + ddcontentID).append('<button id='+ o.dropdown.buttonid  +' type="button" class="btn btn-default"> <span class="glyphicon glyphicon-play"></span> Add Layer </button>');


            // build maps
            for(var i=0; i < o.maps.length; i++) {
                o.maps[i].id = randomID();
                $('#' + id).append('<div id='+ o.maps[i].id +'></div>');
            }
            createDropdown();
            createMap();
        };

        var createDropdown = function() {
            $.get(o.dropdown.url).done(function( data ) {
                data = (typeof data == 'string')? $.parseJSON(data): data;
                createDropdownContent(data.overlays);
            });
        };

        var createDropdownContent = function(json) {
                console.log(json)
                o.dropdown.json = json;
                // TODO: dynamic width
                var ddID = o.dropdown.id +'-dd';
                var html = '<select id="'+ ddID +'" style="width:200px" class="">';
                html += '<option value=""></option>';
                for(var i=0; i < json.length; i++) {
                    var l= JSON.stringify(json[i]);
                    console.log(l)
                    html += '<option value="'+ i + '">'+json[i].layertitle +'</option>';
                }
                html += '</select>';

                $('#' + o.dropdown.id).empty();
                $('#' + o.dropdown.id).append(html);

                try {
                   $('#' + ddID).chosen({disable_search_threshold:10, width: '100%'});
                }  catch (e) {}

                // enable on click
                /*$( "#" + ddID ).change({json: o.dropdown.json},  function (event) {
                    var fenixmap =o.maps[0].fenixmap
                    console.log(fenixmap)
                    var layer = event.data.json[$( this ).val()];
                    layer = (typeof layer == 'string')? $.parseJSON(layer): layer;
                    var l = new FM.layer(layer);
                    fenixmap.addLayer(l);
                }); */

                $( "#" + o.dropdown.buttonid ).click({json: o.dropdown.json},  function (event) {
                    var fenixmap =o.maps[0].fenixmap
                    console.log(fenixmap)
                    var layer = event.data.json[ $('#' + ddID).val()];
                    layer = (typeof layer == 'string')? $.parseJSON(layer): layer;
                    var l = new FM.layer(layer);
                    fenixmap.addLayer(l);
                });
        };

        var createMap = function() {
            for(var i=0; i < o.maps.length; i++) {
                var _map = o.maps[i];
                $.get(o.maps[i].url).done(function( data ) {
                   // create map
                    var _data = data;
                    $.ajax({
                        type: "GET",
                        url: '../../plugins/gui/map-bs.html',
                        success: function(data) {
                            var id = FM.Util.randomID();
                            var widget = FM.Util.replaceAll(data, '_REPLACE', id)
                            $('#' + _map.id).append(widget);

                            var mapID = 'm' + id;
                            var widgetID = 'widget' + id;
                            var descriptionID = 'description' + id;
                            var saveMapID = 'save_widget' + id;
                            var removeWidgetID = 'remove_widget' + id;
                            var title = ( title )? title: 'Map' ;
                            var exportImageID = 'export_image' + id;

                            // delete the current object
                            $('#' + removeWidgetID).click({ widgetID: widgetID}, function(event) {
                                $('#' + event.data.widgetID).remove();
                            });

                            var ids = {
                                id: id,
                                mapID: mapID,
                                saveMapID: saveMapID,
                                exportImageID: exportImageID
                            }
                            _map.ids = ids;

                            _data = (typeof _data == 'string')? $.parseJSON(_data): _data;
                            console.log(ids)
                            console.log(_data)
                            _map.callback(_map, _data);
                        }
                    });
                });
            }

        };

        var randomID = function() {
            var randLetter = Math.random().toString(36).substring(7);
            /*var randLetter  = String.fromCharCode(65 + Math.floor(Math.random() * 26));
             var randLetter2 = String.fromCharCode(65 + Math.floor(Math.random() * 26)); */
            return (randLetter + Date.now()).toLocaleLowerCase();
        };

        function createFromJSONCallback(map, json) {
            var fenixmap = new FM.Map(map.ids.mapID, json.map.options, json.map.mapOptions);
            fenixmap.createMap();
            fenixmap.createMapFromJSON(json);
            addListeners(fenixmap, map.ids.mapID, map.ids.saveMapID,  map.ids.exportImageID);
            map.fenixmap = fenixmap;
        }

        function addListeners(fenixmap, mapID, saveMapID, exportImageID) {

            $('#' + saveMapID).click({fenixmap: fenixmap}, function(event) {
                event.data.fenixmap.exportMapToJSONFile();
            });

            $('#' + exportImageID).click({fenixmap: fenixmap}, function(event) {
                L_PREFER_CANVAS = true;
                // i'm deleting the master chart -> send aler
                //leafletImage(fenixMap.map, doImage('', canvas, fenixMap.map));
                console.log( event.data.fenixmap);
                leafletImage( event.data.fenixmap.map, null, doImage);
            });

            // example thing to do with that canvas
            function doImage(err, options, canvas) {
                console.log(err);
                console.log(canvas);
                var img = document.createElement('img');
                var dimensions = fenixmap.map.getSize();
                img.width = dimensions.x;
                img.height = dimensions.y;
                img.src = canvas.toDataURL();
                document.getElementById('exportimage').innerHTML = '';
                document.getElementById('exportimage').appendChild(img);

                // var image = img.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.


                //Canvas2Image.saveAsPNG(img);
            }

            // On Move
            var _fenixmap = fenixmap;
            var GFIchk = {};
            GFIchk["lat-" + fenixmap.id] = 0;
            GFIchk["lng-" + fenixmap.id] = 0;
            GFIchk["globalID-" + fenixmap.id] = 0;
            fenixmap.map.on('mousemove', function (e) {
                var id = Date.now();
                GFIchk["globalID-" + _fenixmap.id] = id;
                var t = setTimeout(function() {
                    if ( id == GFIchk["globalID-" + _fenixmap.id]) {
                        //console.log(e);
                        if ((GFIchk["lat-" + _fenixmap.id] != e.latlng.lat) && (GFIchk["lng-" + _fenixmap.id] != e.latlng.lng)) {
                            GFIchk["lat-" + _fenixmap.id] = e.latlng.lat;
                            GFIchk["lng-" + _fenixmap.id] = e.latlng.lng;
                            // call callback
                            _fenixmap.getFeatureInfo(e, mapID +'-gfioutput');
                            //_m.getFeatureInfo(e);
                        }
                    }
                }, 100);
            });
            fenixmap.map.on('mouseout', function (e) {
                GFIchk["lat-" + fenixmap.id] = 0;
                GFIchk["lng-" + fenixmap.id] = 0;
                GFIchk["globalID-" + fenixmap.id] = 0;
                $('#' + mapID +'-gfioutput').empty();
            });
        }

        // public instance methods
        return {
            init: init
        };
    };

})();

