//customizable JS, containing all callbacks for form
//Bootstrap validator callback structure: function signature should be either
// (value, validator,  $field) or (value, validator)
// function name, should be referenced in fx-editor-validation-rules.json

function checkAtLeastOnePhoneEmailAddress(value, validator,  $field) {

    //console.log("checkAtLeastOnePhoneEmailAddress called  isField valid !!!!");//+$field.attr('id'));
    var $groups = [];
    // var $phone = $('#'+$field.closest('fieldset')[0].id + " #phone");
    var $phone = $("#phone");
   // console.log("checkAtLeastOnePhoneEmailAddress called phone !!!!"+$phone);

    var $address = $('#address');
    var $emailAddress = $('#emailAddress');

    $groups.push($phone);
    $groups.push($address);
    $groups.push($emailAddress);

    var total = $groups.length;
    var counter = 0;

    //check and count empty fields
    $.each($groups , function(i, val) {
        var value = $(val[0]).val();
        var id = $(val[0]).attr('id');
        //console.log(id + ' value = '+value);
        if(value == '')  {
            counter ++;
        }
    });

    //console.log('counter = '+counter + " total = "+total + ' current field = '+$field.attr('id'))

    if(counter === total)
    {
        return false;
    }  else {

        // Update the status of this validator to all fields
        $.each($groups , function(i, val) {
            //  console.log('updateStatus = '+ $(val[0]).attr('name'));
            // console.log('updateStatus = '+ $(val[0]).attr('type'));

            var id = $(val[0]).attr('id');
           // var name = $(val[0]).attr('name');

            validator.updateStatus($(val[0]), validator.STATUS_VALID, 'callback');

            if($field.attr('id')!= id){
                validator.validateField($(val[0]));
            }

        });



        // Otherwise, returns true
        return true;
    }


    // Otherwise, returns true
        return true;

}




function showSpecifyInputBox(value, validator,  $field) {

    //console.log("============= showSpecifyInputBox called value = "+value);
    var $specify = $("#specify");
    var $role = $("#role");

        if($field.attr('id') == 'role'){
           if(value == ''){
               if($specify.val()!=''){
                   validator.updateStatus($specify,  validator.STATUS_NOT_VALIDATED);
                   return false;
               }

               return true;
           }
           else{
                validator.updateStatus($specify,  validator.STATUS_NOT_VALIDATED);

                return true;
            }
        }

      if($field.attr('id') == 'specify'){
          if(value!=''){
            if($role.val()==''){
                validator.updateStatus($role,  validator.STATUS_NOT_VALIDATED);
                return false;
            }

            return true;

          } else {

              return true;
          }
    }

    return true;
}


function showOrganizationInputBox(value, validator,  $field) {

    var $specify = $("#organization");
    var $role = $("#originOfCollectedData");

    //console.log("============= showOrganizationInputBox called field = "+value +" role '"+ $role.val()+"'");

    if($field.attr('id') == 'originOfCollectedData'){
        if(value == ''){
           // console.log("============= showOrganizationInputBox called value IS EMPTY ");
            return true;
        }
        else{
            if(value == 'A'){   // Other International Organizations (Other IOs)
                $specify.prop('disabled', false);
                if($specify.val()==''){
                    validator.updateStatus($specify,  validator.STATUS_NOT_VALIDATED);
                    return false;
                } else {
                    validator.updateStatus($specify, validator.STATUS_VALID, 'callback');
                    return true;
                }
            } else {
                validator.updateStatus($specify, validator.STATUS_VALID, 'callback');
                $specify.prop('disabled', true);
                return true;
            }
        }
    }

    if($field.attr('id') == 'organization'){
        if(value!=''){
             if($role.val()=='A'){
                validator.updateStatus($role,  validator.STATUS_VALID, 'callback');
                return true;
            } else {
                $specify.prop('disabled', true);
                return true;
            }
        } else {
             if($role.val()=='A'){
                validator.updateStatus($role,  validator.STATUS_NOT_VALIDATED);
                return false;
            }  else {
                validator.updateStatus($role,  validator.STATUS_VALID, 'callback');
                return true;
            }
        }
    }

    return true;
}

function showDistributionFields(value, validator,  $field) {
    var arry = ["onlineResource", "disseminationFormat", "confidentialityStatus"];

    if($field.attr('id') == 'confidentialityStatus'){
        if(value!=''){
            if(value =='EN'){
                var counter = 0;
                for(var i = 0; i < arry.length; i++ ){
                  if(arry[i] != 'confidentialityStatus'){
                     var val =  $field.attr('fnx-dependant-value-'+arry[i].toLowerCase());
                      if(val!=''){
                         // counter ++;
                          return false;
                      }
                  }
                }

              /**  if(counter == 0){
                    $('onlineResource').prop('disabled', true);
                    $('disseminationFormats').prop('disabled', true);
                    return true;

                } else {
                    $('onlineResource').prop('disabled', false);
                    $('disseminationFormats').prop('disabled', false);

                    return false;
                } **/

                return true;

            } else {
                return true;

            }
        }
    }

    if(($field.attr('id') == 'onlineResource') || ($field.attr('id') == 'disseminationFormat')){
        if(value!=''){
                  var val =  $field.attr('fnx-dependant-value-confidentialitystatus');
                    if(val!=''){
                        if(val =='EN'){
                            return false;
                        }

                    } else {
                        return true;
                    }

        } else {
              return true;
        }
    }

    return true;
}


function checkIsbnIssnFields(value, validator,  $field) {

    var $groups = [];
    var $groupsType = [];
    var $isbn;
    var $issn ;

    $("#ISBN").each(function( index ) {
        $groups.push($(this).attr("name"));
        $groupsType.push($(this).attr("name").replace("ISBN", ""));
    });


    $("#ISSN").each(function( index ) {
        $groups.push($(this).attr("name"));
        $groupsType.push($(this).attr("name").replace("ISSN", ""));
    });


    var fieldName =  $field.attr("name");
    var fieldNameOther;

    if(/ISBN/i.test(fieldName)) {
        $isbn =  $field;
        fieldNameOther =  fieldName.replace("ISBN", "ISSN");
        $issn =  $('input[name="+fieldNameOther+"]');
    } else if(/ISSN/i.test(fieldName)){
        $issn =  $field;
        fieldNameOther =  fieldName.replace("ISSN", "ISBN");
        $isbn =  $('input[name="+fieldNameOther+"]');
    }

    //console.log($field.attr("name"));



    $groups.push($isbn);
    $groups.push($issn);

    var total = $groups.length;
    var counter = 0;

    //check and count empty fields
    $.each($groups , function(i, val) {
        var value = $(val[0]).val();
        var id = $(val[0]).attr('id');
        if(value == '')  {
            counter ++;
        }
    });

    if(counter === total)
    {
        return false;
    }

    // Otherwise, returns true
    return true;

}
