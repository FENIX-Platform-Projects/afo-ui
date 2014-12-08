(function(jQuery) {
    jQuery.fn.serializeObject = function() {
        var self = this;
       // console.log(this);
        var raw = this.serializeArray().map(function(input) {
            //console.log(input);
            return [input.name, input.value]
        })
        var obj = {}
        raw.forEach(function(pair) {
            var key = pair[0],
                value = pair[1];

            if(value === ""){
                value = null;
            }

            if(isArray(key)){
                 var codesArray = [],
                    codeObj = {},
                    isCodeObjEmpty = true,
                    afterSqBrack = key.substr(key.indexOf("]") + 1);


                if(afterSqBrack.length > 0) {
                    key = key.substring(0, key.indexOf(']') + 1);

                    if(hasPeriod(afterSqBrack)) {
                        isCodeObjEmpty = false;
                        var codeKeys = afterSqBrack.split('.');


                        nest(codeKeys, value, codeObj)
                    }
                }

                key = key.replace("[]", "");
                var rootParent = key;

                if(hasPeriod(key))  {
                    var keys = key.split('.');
                    rootParent = keys[0];
                    //console.log("============ SERIALIZE HAS PERIOD obj: "+obj+ " | key: "+ key);
                    nestArray(keys, value, obj, codeObj, codesArray, isCodeObjEmpty);
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
                /** if(hasComma(value))  {
                     var codesArray = [],
                         codeObj = {},
                         isCodeObjEmpty = true;
                     var values = value.split(',')
                     console.log("=========== values "+ values);
                     nest(keys, values, obj);
                   //  for( var z = 0; z< values.length; z++){
                       //  nestArray(keys, value[z], obj, codeObj, values, isCodeObjEmpty);
                   //  }

                 }
                 else    **/

                //set null value to the parent e.g. key = document.title.EN, ao value set to document.title = null (i.e. remove the lang component from the keys e.g. EN)
                var $input = jQuery("input[name='"+key+"']");
                var inputLang = $input.data("multi-lang");
                if(inputLang != undefined && value == null) {
                    var index = $.inArray(inputLang, keys);
                    keys.splice(index, 1);
                }

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
    function hasComma(str) {
        return /\,/.test(str);
    }
    function isArray(str) {
        return /\[]/.test(str);
    }
    function isCodeList(key, id) {
        var $select = jQuery('#'+id + ' #'+key);

        if ($select.length){
            var selectCodeList = $select.data("cl-system");
            var selectCodeListVersion = $select.data("cl-version");

            if (selectCodeList === undefined || selectCodeListVersion === undefined) {
                return false;
            } else {
                if(selectCodeList.length){
                //if(selectCodeList.length && selectCodeListVersion.length){
                    return true;
                }
            }

        }
        return false;
    }

    function setCodeListDetails(key, id, obj) {

        if (isCodeList(key,id)) {
            var $select = jQuery('#'+id + ' #'+key);
            var selectCLSystem = $select.data("cl-system");
            var selectCLVersion = $select.data("cl-version");

            if (obj[key] != undefined) {
                if(selectCLSystem !=undefined){
                    var selectCLSystemPath = $select.data("cl-system-path");
                    if(selectCLSystemPath != undefined){
                        var sPth =  selectCLSystemPath.split(".");
                        setCodeListProps(obj[key], sPth, selectCLSystem);
                    } else {
                        obj[key].system = selectCLSystem;
                    }
                }
                if(selectCLVersion !=undefined){
                    var selectCLVersionPath = $select.data("cl-version-path");
                    if(selectCLVersionPath != undefined){
                        var vPth =  selectCLVersionPath.split(".");
                        setCodeListProps(obj[key], vPth, selectCLVersion.toString());
                    } else {
                        obj[key].version = selectCLVersion.toString();
                    }
                }
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

    function nestArray(keys, value, obj, codeObj, codesArray, isCodeObjEmpty) {
        //console.log(obj+ " | "+ keys );
        if (keys.length > 0) {
            var key = keys.shift()
            //console.log(obj+ " | "+ key );
            if (obj[key] === undefined) {
                if (keys.length === 0) {
                    if(value != null) {
                       createCodes(key, value, obj, codeObj, codesArray, isCodeObjEmpty);
                       obj[key] = codesArray;
                    }  else {
                        obj[key] = value;
                    }
                } else {
                    obj[key] = {}
                }
            }
            else {
                if (keys.length === 0) {
                   // console.log("OBJ = ");
                   // console.log(obj);
                   // if(value != null) {
                     createCodes(key, value, obj, codeObj, codesArray, isCodeObjEmpty);
                   // }
                } else {
                    obj[key] = obj[key];
                }
            }

            var nestingBookmark = obj[key];
        }
        if (keys.length !== 0) {
            nestArray(keys, value, nestingBookmark, codeObj, codesArray, isCodeObjEmpty);
        }
    }

    function createCodes(key, value, obj, codeObj, codesArray, isCodeObjEmpty) {
        if(key in obj) {
            codesArray =  obj[key];
        }

        if(isCodeObjEmpty) {
            codeObj.code = value;
        }

        codesArray.push(codeObj);
    }



    function getText(element, find) {
        if(jQuery(element).is('select')){
            return jQuery(element).find("option[value='"+find+"']").text();
        }
    }

    function setCodeListProps(obj, path, value){

        if(path.length > 0){
            for(var j = 0; j < path.length; j++)
            {
                if(!(path[j] in obj))
                {
                    obj[path[j]] = value;
                }

                obj = obj[path[j]];
            }

        }

        //return obj;
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