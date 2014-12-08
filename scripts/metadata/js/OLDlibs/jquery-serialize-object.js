(function(jQuery) {
    jQuery.fn.serializeObject = function() {
        var self = this;
        var raw = this.serializeArray().map(function(input) {
            return [input.name, input.value]
        })
        var obj = {}
        raw.forEach(function(pair) {
            var key = pair[0],
                value = pair[1];
             if(isArray(key)){
                key = key.replace("[]", "");
                var rootParent = key,
                codesArray = [],
                codeObj = {};

                if(hasPeriod(key))  {
                    var keys = key.split('.');
                    rootParent = keys[0];
                    nestArray(keys, value, obj, codeObj, codesArray);
                } else {
                    if(key in obj ) {
                        codesArray =  obj[key];
                    }

                    codeObj.code = value;
                    codesArray.push(codeObj);
                    obj[key] = codesArray;
                }

                 setCodeListDetails(rootParent, self.attr('id'), obj);
            }
            else if (!isArray(key) && hasPeriod(key)) {
                 var keys = key.split('.');
                 nest(keys, value, obj);
            }
          else {
                obj[key] = value
            }
        })
        return obj
    }
    function hasPeriod(str) {
        return /\./.test(str);
    }
    function isArray(str) {
        return /\[]/.test(str);
    }
    function isCodeList(key, id) {
        var $select = jQuery('#'+id + ' #'+key);
        if ($select.length){
            var selectCodeList = $select.data("IDcodeList");
            var selectCodeListVersion = $select.data("version");

            if (selectCodeList === undefined || selectCodeListVersion === undefined) {
                return false;
            } else {
                if(selectCodeList.length && selectCodeListVersion.length){
                    return true;
                }
            }

        }
       return false;
    }

    function setCodeListDetails(key, id, obj) {
        if (isCodeList(key,id)) {
            var $select = jQuery('#'+id + ' #'+key);
            var selectCodeList = $select.data("IDcodeList");
            var selectCodeListVersion = $select.data("version");
            if (obj[key] != undefined) {
                obj[key].codeList = selectCodeList;
                obj[key].version = selectCodeListVersion;
            }
        }
    }

    function nest(keys, value, obj) {
          if (keys.length > 0) {
            var key = keys.shift();
            if (obj[key] === undefined) {
                if (keys.length === 0) {
                    obj[key] = value;
                } else {
                    obj[key] = {};
                }
            }
            var nestingBookmark = obj[key];
        }
        if (keys.length !== 0) {
            nest(keys, value, nestingBookmark);
        }
   }

    function nestArray(keys, value, obj, codeObj, codesArray) {
        if (keys.length > 0) {
            var key = keys.shift()

           if (obj[key] === undefined) {
                if (keys.length === 0) {
                   createCodes(key, value, obj, codeObj, codesArray);
                   obj[key] = codesArray;
                } else {
                    obj[key] = {}
                }
            }
            else {
                 if (keys.length === 0) {
                     createCodes(key, value, obj, codeObj, codesArray);
                } else {
                    obj[key] = obj[key];
               }
            }

            var nestingBookmark = obj[key];
        }
        if (keys.length !== 0) {
            nestArray(keys, value, nestingBookmark, codeObj, codesArray);
        }
    }


    function createCodes(key, value, obj, codeObj, codesArray) {
        if(key in obj) {
            codesArray =  obj[key];
        }

        codeObj.code = value;
        codesArray.push(codeObj);
    }



    function getText(element, find) {
        if(jQuery(element).is('select')){
            return jQuery(element).find("option[value='"+find+"']").text();
        }
    }


    /** function serializeObject(form) {
//    $.fn.serializeObject = function() {
        var o = {};
//    var a = this.serializeArray();
        $(form).find('input[type="hidden"], input[type="text"], input[type="password"], input[type="checkbox"]:checked, input[type="radio"]:checked, select').each(function() {
            if ($(this).attr('type') == 'hidden') { //if checkbox is checked do not take the hidden field
                var $parent = $(this).parent();
                var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb != null) {
                    if ($chb.prop('checked')) return;
                }
            }
            if (this.name === null || this.name === undefined || this.name === '') return;
            var elemValue = null;
            if ($(this).is('select')) elemValue = $(this).find('option:selected').val();
            else elemValue = this.value;
            if (o[this.name] !== unde\
            ]';lkijuhyyufined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(elemValue || '');
            } else {
                o[this.name] = elemValue || '';
            }
        });
        return o;
    }     **/

}($))