define([
    'handlebars',
    'i18n!fx-editor/nls/langProperties'
], function (Handlebars, langProps) {

    function format(template, context) {
        var compiled = Handlebars.compile(template);
        return compiled(context);
    }

    function Fx_Lang_Utils() {
        var ob = {};
        for (var i in langProps) {
            ob[i] = format.bind(null, langProps[i]);
        }
        return ob;
    }

    Fx_Lang_Utils.prototype.init = function () { };

    //Public API
    return Fx_Lang_Utils;

});
