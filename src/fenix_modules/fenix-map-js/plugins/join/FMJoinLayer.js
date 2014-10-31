var FMJoinLayer = (function() {

    var o = {

        joinlayer: {

        }

    }

    function init(obj) {
        o = $.extends(true, {}, o, obj)

        var layer = FMDEFAULTLAYER.getLayer($('#GAUL-TYPE').val())
    }

    function initWithFiles(files) {

        // todo: parse files

        // get layertyype (with defaults layer values

        // create map

    }

    return {
        init : init
    }

})();