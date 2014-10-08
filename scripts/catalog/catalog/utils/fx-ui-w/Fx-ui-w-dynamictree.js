define([
    "jquery",
    "lib/jqwidgets"
    ], function ($) {

    function Fx_ui_w_DynamicTree() {
    }

    Fx_ui_w_DynamicTree.prototype.validate = function (e) {
        return true;


    };

    Fx_ui_w_DynamicTree.prototype.render = function (e, container) {

        var tree, source;

        tree = $(container);
        //Source initialized with a 'Loading...' feedback for users.
        source = [
            { label: "Loading...", disabled: true}
        ];
        $.ajax({
            dataType: "json",
            async: true,
            url: e.url + "?levels=1",
            success: function (data, status, xhr) {
                tree.jqxListBox('removeAt', 0);
                $.each(data, function (index, element) {
                    element.label = element.title[lang];
                    element.value = element.code;
                    element.items = [
                        {
                            value: element.code,
                            disabled: true,
                            label: "Loading..."
                        }
                    ];
                });
                source = data;
                tree.jqxTree({ source: source });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                handleError("CONNECTION_FAIL");
            }
        });
        tree.jqxTree($.extend({source: source}, e.component.rendering));
        tree.on('expand', {e: e}, function (event) {
            var label, $element, loader, loaderItem, children;

            label = tree.jqxTree('getItem', event.args.element).label;
            $element = $(event.args.element);
            loader = false;
            loaderItem = null;
            children = $element.find('ul:first').children();
            $.each(children, function () {
                var item;
                item = tree.jqxTree('getItem', this);
                if (item && item.label === 'Loading...') {
                    loaderItem = item;
                    loader = true;
                    return false;
                }
            });
            if (loader) {
                $.ajax({
                    dataType: "json",
                    async: true,
                    url: e.url + loaderItem.value + "?levels=1",
                    success: function (d, status, xhr) {
                        var data = d.childs;
                        if (data) {
                            $.each(data, function (index, element) {
                                element.label = element.title[lang];
                                element.value = element.code;
                                if (event.data.e.maxlevels > element.level) {

                                    element.items = [
                                        {
                                            value: element.code,
                                            disabled: true,
                                            label: "Loading..."
                                        }
                                    ];
                                }
                            });

                            tree.jqxTree('addTo', data, $element[0]);
                        }
                        tree.jqxTree('removeItem', loaderItem.element);
                    }
                });
            }
        });
        tree.on('select', function (event) {
            var args, item, label, code;
            args = event.args;
            item = tree.jqxTree('getItem', args.element);
            label = item.label;
            code = item.value;
        });

    };

    Fx_ui_w_DynamicTree.prototype.getValue = function (e) {
        return $("#" + e.id).jqxTree('val') ? $("#" + e.id).jqxTree('val').value : null;
    };

    return Fx_ui_w_DynamicTree;
});