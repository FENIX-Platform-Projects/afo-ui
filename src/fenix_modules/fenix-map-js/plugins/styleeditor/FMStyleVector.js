// Wrap code with module pattern.
(function() {
    var global = this;

    // widget constructor function
    global.FMStyleEditor = function() {

        var o = {
            FMStyleCodePanel: ''
        };

        // private instance methods
        var init = function(obj) {
            o = $.extend(true, {}, o, obj);
        };

        // public instance methods
        return {
            init: init
        };
    };

})();