define([
    "jquery"], function ($) {


    function Fx_ui_CloneButton() {
    }

    Fx_ui_CloneButton.prototype.validate = function (e) {
        return true;
    };

    Fx_ui_CloneButton.prototype.render = function (e, name, key, o, callback) {

        var rule, css = 'btn btn-default';
        var counter = 1;

        var bootstrapValidator_Utils;

        if(o.validationUtils != undefined) {
            bootstrapValidator_Utils = o.validationUtils;
        }

        if(e.hasOwnProperty("rule")){
            rule = e.rule;
        }

        if(e.type.hasOwnProperty("style")) {
           css = e.type.style;
        }

        var element = $("<button/>", {
            "class": 'btn btn-default fnx-clone-button',
            "name" : key,
            "type" : 'button'
        });


        if(e.type.hasOwnProperty("icon")) {
            var span = $("<span/>", {
                "class": e.type.icon
            });

            element.append(span);
        }

        if(rule &&  bootstrapValidator_Utils){
            bootstrapValidator_Utils.setValidationAttributes(element, rule, o.lang);
        }



       //console.log("Buttons element ....");
       //console.log(e);
        // Add button click handler



        if(e.type.hasOwnProperty("clone")) {
            var clone = e.type.clone;


            // set button disabled, by default
            element.prop("disabled",true);

            //console.log('e.clone = '+ clone);
            element.on('click', {clone: clone}, function() {

                if(clone.hasOwnProperty("property")){
                    //console.log("id = #"+clone.property);

                    // set data about the template
                    element.attr("data", {"template": "#"+clone.property});


                    // find and clone the field set
                    var $template = $("#"+clone.property),
                        $clone    = $template.clone(true, true)
                                    .removeAttr('id');

                    $clone.attr("id", clone.property+counter);
                    $clone.insertAfter($template);
                    $clone.find("*:not(legend, legend *)").show();
                   // var label = $template.find("legend:first").html();
                    //console.log("template LABEL = "+label);
                   // $template.find("legend:first").html(label + ' added '+counter);

                    $template.find("*:not(legend, legend *)").hide();

                    counter++;
                }




                //Find first fieldset template







               //     console.log('ONCLICK!! '+ e.template);
             //   console.log($('#'+ e.template))
              //  var $template = $('#'+ e.template) ;
                   // $clone    = $template
                     //   .clone()
                      //  .removeClass('hide')
                       // .removeAttr('id')
                       // .insertBefore($template);

               // var $clone =  $template.clone().insertBefore($template);
               //$(".hide",$clone).removeClass("hide").insertBefore($template);




             //  $clone.insertBefore($template);
              // $clone.find('*').removeClass('hide').removeAttr('id').insertBefore($template);


               // .removeClass('hide').insertBefore($template);
                   // .removeClass('hide')
                   // .removeAttr('id')
                  //  .insertBefore($template);
                   // $option   = $clone.find('[name="contacts[]"]');
                // $option   = $clone.find('[name="contacts[]"]');

                // Add new field
                //$('#fx-editor-form form').bootstrapValidator('addField', $option);
            });
       }

       // console.log('SELECT validate '+ e.type + ' for '+name);

        var containerId = '#'+ o.container + key;
        if(e.hasOwnProperty("fieldSetId"))  {
            containerId = '#'+o.container + e.fieldSetId+'-'+key;
        }
        element.appendTo(containerId);

        callback();

    };

    Fx_ui_CloneButton.prototype.getValue = function (e) {
        return $("#" + e.id).val();
    };


    return Fx_ui_CloneButton;
});