// Wrap code with module pattern.
(function() {
    var global = this;

    // widget constructor function
    global.FMStyleVector = function() {

        var o = {
            id: '',
            layer : '',
            map: ''
        };

        var init = function(obj) {
            o = $.extend(true, {}, o, obj);
            $( "#result" ).load( "ajax/FMStyleGUI.js", function() {
                alert( "Load was performed." );
            });
        };


        return {
            init: init
        };
    };

})();