// FMStyleCodePanel it's the panel used to write the code
(function() {
    var global = this;
    // widget constructor function
    global.FMStyleCodePanel = function() {
        var o = {
            id: '', // id of the panel
            defaultText: '', // useful? In case implement it
            editor : null,
            editorOptions: {
                mode: 'css',
                lineNumbers : true,
                tabSize : 3,
                lineWrapping : true,
                styleActiveLine: true
            }
        };

        // private instance methods
        var init = function(obj) {
            o = $.extend(true, {}, o, obj);
            o.editor = CodeMirror.fromTextArea(document.getElementById(o.id), o.editorOptions);
        };

        var getValue = function() {
            return o.editor.getValue();
        }

        // public instance methods
        return {
            init: init,
            getValue: getValue
        };
    };
})();