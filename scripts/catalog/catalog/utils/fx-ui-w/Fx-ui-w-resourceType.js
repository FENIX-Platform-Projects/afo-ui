define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons"
], function ($, W_Commons) {

    var o = { },
        defaultOptions = {
            widget: {
                lang: 'EN'
            },
            events: {
                READY: 'fx.catalog.module.ready',
                REMOVE: 'fx.catalog.module.remove'
            }
        }, w_commons;

    function Fx_ui_w_ResourcesType() {
        w_commons = new W_Commons();}

    Fx_ui_w_ResourcesType.prototype.validate = function () {
        return true;
    };

    Fx_ui_w_ResourcesType.prototype.render = function (e, container) {

        //Merge options
        $.extend(o, defaultOptions);

        o.container = container;
        o.module = e;

        if (e.hasOwnProperty("component")){
            if (e.component.hasOwnProperty("choices")){
                var choices = e.component.choices,
                    $form = $("<form></form>");

                for (var i = 0; i<choices.length; i++){

                    var id = Math.random(),
                        $label = $('<label for="fx-radio-'+id+'">'+ choices[i].label[o.widget.lang]+'</label>'),
                        $radio = $('<input id="fx-radio-'+id+'" type="radio" name="'+ e.component.name+'" value="'+choices[i].value+'"/>');
                    $form.append($label).append($radio);
                }

                $form.find('input[ name="'+ e.component.name+'" ]:radio').change(function(e) {

                    w_commons.raiseCustomEvent(
                        o.container,
                        o.events.READY,
                        { value : $('label[for="'+e.currentTarget.id+'"]').html(),
                            module:   o.module.type }
                    );

                });

                $(container).append($form);
            }
        }
    };

    Fx_ui_w_ResourcesType.prototype.getValue = function (e) {
        var result = $('#'+e.id).find('input[type=radio]:checked').val();
        return  result.split(",");
    };

    return Fx_ui_w_ResourcesType;
});