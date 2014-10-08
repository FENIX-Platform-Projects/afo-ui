define(["jquery", "lib/jqwidgets"], function ($) {

    function Fx_ui_w_Tree() {
    };

    Fx_ui_w_Tree.prototype.validate = function (e) {
        if (!e.hasOwnProperty("source")) {
            throw new Error("ELEM_NOT_SOURCE");
        } else {
            if (!e.source.hasOwnProperty("datafields")) {
                throw new Error("ELEM_NOT_DATAFIELDS");
            }
        }

        return true;
    };

    Fx_ui_w_Tree.prototype.render = function (e, container) {

        var source, dataAdapter, records;

        // create data adapter.
        source = $.extend({datatype: "json"}, e.component.source);
        dataAdapter = new $.jqx.dataAdapter(source);
        // perform Data Binding.
        dataAdapter.dataBind();
        // get the tree items. The first parameter is the item's id. The second parameter is the parent item's id.
        // The 'items' parameter represents the sub items collection name.
        // Each jqxTree item has a 'label' property, but in the JSON data, we have a 'text' field.
        // The last parameter specifies the mapping between the 'text' and 'label' fields.
        records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [
            { name: 'text', map: 'label'}
        ]);
        $(container).jqxTree($.extend({source: records}, e.component.rendering));
    };

    Fx_ui_w_Tree.prototype.getValue = function (e) {
        return $("#" + e.id).jqxTree('val') ? $("#" + e.id).jqxTree('val').value : null;
    };

    return Fx_ui_w_Tree;
});
