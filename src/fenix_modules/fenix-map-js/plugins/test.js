// Wrap code with module pattern.
(function() {
    var global = this;

    // helper functions
    var escapeHTML = function(msg) {
        return (String(msg)).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
    };

    // widget constructor function
    global.MY_makeLogger = function() {

        var test;

        // private instance methods
        var clear = function(a) {
            console.log('clear: ' + a + ' - ' + test);
        };

        var log = function() {

            var app = test;
             $.get('http://168.202.23.224:8085/fenix-map-js/projects/countrystat/csv/GAUL1_NGA_rainfall_2005-2006.csv', { test: "asdasd"}).done(function( data ) {
               //console.log(data);
                clear(app);
            });
        };

        var setTest = function(msg) {
            test = msg;
        };



        // public instance methods
        return {
            getRootEl: function() {return rootEl;},
            log      : log,
            setTest  : setTest,
            error    : function(msg) {append(msg, 'error');}
        };

    };

})();