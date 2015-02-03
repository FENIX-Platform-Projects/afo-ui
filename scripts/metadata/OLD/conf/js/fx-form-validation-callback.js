//customizable JS, containing all callbacks for form
//Bootstrap validator callback structure: function signature should be either
// (value, validator,  $field) or (value, validator)
// function name, should be referenced in fx-editor-validation-rules.json

function checkAtLeastOnePhoneEmailAddress(value, validator,  $field) {

    //console.log("checkAtLeastOnePhoneEmailAddress called  isField valid !!!!"+$field.attr('id'));
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
                //console.log("============= showSpecifyInputBox called value IS EMPTY ");
                return true;
            }
           else{
                if($specify.val()==''){
                    validator.updateStatus($specify,  validator.STATUS_NOT_VALIDATED);
                    //validator.validateField($specify.attr('name'));
                    return false;
                }  else {
                    validator.updateStatus($field, validator.STATUS_VALID, 'callback');
                    validator.updateStatus($specify, validator.STATUS_VALID, 'callback');
                    return true;
                }
            }
        }

      if($field.attr('id') == 'specify'){
          if(value!=''){
            if($role.val()!=''){
                validator.updateStatus($role,  validator.STATUS_VALID);
                return true;
            }
          } else {
              if($role.val() == ''){
                  return true;
              }  else {
                  validator.updateStatus($field,  validator.STATUS_NOT_VALIDATED);
                  return false;
              }
          }
    }

    return true;
}


function showOrganizationInputBox(value, validator,  $field) {

    var $specify = $("#organization");
    var $role = $("#originOfCollectedData");

    console.log("============= showOrganizationInputBox called field = "+value +" role '"+ $role.val()+"'");

    if($field.attr('id') == 'originOfCollectedData'){
        if(value == ''){
            console.log("============= showOrganizationInputBox called value IS EMPTY ");
            return true;
        }
        else{
            if(value == 'EN'){
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
             if($role.val()=='EN'){
                console.log(" role is EN ");
                validator.updateStatus($role,  validator.STATUS_VALID, 'callback');
                return true;
            } else {
                console.log(" ELSE role!EN ");
                $specify.prop('disabled', true);
                return true;
            }
        } else {
             if($role.val()=='EN'){
                validator.updateStatus($role,  validator.STATUS_NOT_VALIDATED);
                return false;
            }  else {
                console.log(" ELSE role!EN ");
                validator.updateStatus($role,  validator.STATUS_VALID, 'callback');
                return true;
            }
        }

    }

    return true;
}


