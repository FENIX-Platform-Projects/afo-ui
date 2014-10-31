
var FMPopUp = (function() {

    var o = {
        id: null,
        parentID: null,
        content: null,
        //style: 'fm-pop-up-style',
        style: 'display:none; ' +
               'z-index:5000; ' +
               'position:absolute; ' +
               'bottom:10px; right:10px; ' +
               'padding:15px; background-color:#000000; color:#FFFFFF;',
        timeout: 2500
    }

    function init(obj){
        o =  $.extend(true, {}, o, obj);
        renderPopUp();
    };

    function renderPopUp(){
        var id = ( o.id )? o.id : randomID();
        var html = '<div id="'+ id +'" style="'+ o.style +'">' + o.content +' </div>'
        $('#' + o.parentID).append(html);
        $('#' + id).slideDown("slow");
        window.setTimeout(function() {
            $('#'+id).slideUp("slow", function() {
                $('#'+id).remove();
            });
        }, o.timeout);
    };

    function randomID(){
        var randLetter = Math.random().toString(36).substring(7);
        return (randLetter + Date.now()).toLocaleLowerCase();
    };

    return {
        init : init
    }

})();
