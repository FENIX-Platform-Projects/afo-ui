define([
    "jquery",
    "text!fx-cat-br/json/fx-catalog-filter-mapping.json",
    "text!fx-cat-br/json/fx-catalog-blank-filter.json"
], function ($, map, blank) {

    var o = { };

    function FilterPlugin(options) {
        $.extend(o, options);

    }

    FilterPlugin.prototype.preValidation = function () {

        if (!o.component) {
            throw new Error("FILTER PLUGIN: no valid filter component during inti()");
        }

    };

    FilterPlugin.prototype.init = function (options) {
        var self = this;
        //Merge options
        $.extend(o, options);

        self.preValidation();

    };

    FilterPlugin.prototype.getFilter = function () {

        var self = this;

        try {
            return self.createJsonFilter(o.component.getValues(true))
        }
        catch (e) {
            throw new Error(e);
        }

    };

    FilterPlugin.prototype.createJsonFilter = function (values) {

        var request = JSON.parse(blank),
            keys = Object.keys(values),
            mapping = JSON.parse(map),
            position = request;

        for (var i = 0; i < keys.length; i++) {
            if (values.hasOwnProperty(keys[i])) {
                if (mapping.hasOwnProperty(keys[i])){

                    if (mapping[keys[i]].conversion) { values[keys[i]] = this.convertValue(values[keys[i]], mapping[keys[i]].conversion); };

                    var path = mapping[keys[i]].path.split(".");

                    for (var j = 0; j < path.length - 1; j++) { position = position[path[j]]; }

                    position[path[ path.length - 1 ]] = values[keys[i]];
                    position = request;
                }
            }
        }

        return request;
    };

    FilterPlugin.prototype.convertValue = function(values, rules ){

        var rulesKeys = Object.keys(rules);

        for (var j=0; j < values.length; j ++){

            for (var i = 0; i < rulesKeys.length; i++){
                if (rules.hasOwnProperty(rulesKeys[i])){
                    if (values[j].hasOwnProperty(rulesKeys[i])){
                        values[j][rules[rulesKeys[i]]] =  values[j][rulesKeys[i]];
                        delete values[j][rulesKeys[i]];
                    }
                }
            }
        }

        return values;

    };

    return FilterPlugin;

});