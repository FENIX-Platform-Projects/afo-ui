var FMFileHandler = (function() {

    function handlefilescatter(e) {
        var files = e.target.files; // FileList object
        // Loop through the FileList and populate the 'outputTable' with the data
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    createScatter(e.target.result);
                };
            })(f);
            reader.readAsText(f);
        }
    }

    function handlefilejoin(e) {
        var files = e.target.files; // FileList object
        // Loop through the FileList and populate the 'outputTable' with the data
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    var obj = {
                        files: e.target.result
                    }
                    FMJoinLayer.init(obj);
                };
            })(f);
            reader.readAsText(f);
        }
    }



    return {
        handlefilescatter : handlefilescatter,
        handlefilejoin: handlefilejoin
    }

})();