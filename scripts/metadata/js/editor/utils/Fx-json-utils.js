define([
    "jquery",
    "json2"
], function ($) {

    var types = {
            NULL: "null",
            UNDEFINED: "undefined",
            STRING: "String",
            ARRAY: "Array",
            OBJECT: "Object",
            UNKNOWN: "Unknown"
    },
    stringConstructor = "test".constructor,
    arrayConstructor = [].constructor,
    objectConstructor = {}.constructor;

    //helper functions
    function isNumber(num) {
        return (typeof num == 'string' || typeof num == 'number') && !isNaN(num - 0) && num !== '';
    }


    function returnType(object) {
        if (object === null) {
            return types.NULL;
        }
        else if (object === undefined) {
            return types.UNDEFINED;
        }
        else if (object.constructor === stringConstructor) {
            return types.STRING;
        }
        else if (object.constructor === arrayConstructor) {
            return types.ARRAY;
        }
        else if (object.constructor === objectConstructor) {
            return types.OBJECT;
        }
        else {
            return types.UNKNOWN;
        }
    }


    //Public Component
    function Fx_Json_Utils() {
    }

    //Return path to the parent Json object of the property value
    Fx_Json_Utils.prototype.findParentPathForValue = function (json, value, path){
        var self = this;
       // if(typeof(json) != "object" || Object.keys(json).length == 0)
        //   return { "path" : null , "value" : null};

         if(typeof(json) != "object" || Object.keys(json).length == 0) {
             return null;
         }

        for(var prop in json)  {
            if (json[prop] == value)  {
                 // return { "path" :  path + "['" + prop + "']" , "value" : value};
               return path;//{ "path" :  path , "value" : value};      //return the path to the parent
            }
        }


        for(var prop in json) {
            var result = self.findParentPathForValue(json[prop],value,path === undefined ?  prop  : path + "." + prop );
            //console.log("findParentPathForValue RESULT = "+ result );
            if(isNumber(prop))   {
                result = self.findParentPathForValue(json[prop],value,path === undefined ? "[" + prop + "]" : path + "[" + prop + "]" );
            }

            if (result!=null && typeof(result) !== typeof(undefined) && result.value != "") {
               // console.log("FINAL findParentPathForValue RESULT = "+ result );

                return result;
            }
        }
    };


    //Return path to the parent Json object of the property value
    Fx_Json_Utils.prototype.findParentPathForProperty = function (json, value, path){
        var self = this;

       if(typeof(json) != "object" || Object.keys(json).length == 0) {
            return null;
       }

        for(var prop in json)  {
            if (prop == value)  {
                if(path === undefined){
                  path = "rootProp";
                }
                return path;//return the path to the parent
            }
        }


        for(var prop in json) {
            var result = self.findParentPathForProperty(json[prop],value,path === undefined ?  prop  : path + "." + prop );
            if(isNumber(prop))   {
                result = self.findParentPathForProperty(json[prop],value,path === undefined ? "[" + prop + "]" : path + "[" + prop + "]" );
            }
            if (result!=null && typeof(result) !== typeof(undefined) && result.value != "") {
                return result;
            }
        }
    };

    //Return Json object for a given String path
    // path format: panels[4].modules[2].modules[0].modules[1]
    Fx_Json_Utils.prototype.findObjectByPath = function(json, path) {
       // console.log('path ');
        path = path.replace(/\[(\w+)\]/g, '.$1');  // convert indexes to properties
        path = path.replace(/^\./, ''); // strip leading dot
        var a = path.split('.');
        while (a.length) {
            var n = a.shift();
            if (n in json) {
                json = json[n];
            } else {
                return;
            }
        }
        return json;
    };

    //Return Json object for a given String path
    // path format: panels[4]
    Fx_Json_Utils.prototype.findSingleObjectByPath = function(json, path) {
        //console.log('path1 ========== '+path);
        path = path.replace(/\[(\w+)\]/g, '.$1');  // convert indexes to properties
        //console.log('path2 ========== '+path);
        path = path.replace(/^\./, ''); // strip leading dot
       // console.log('path3 ========== '+path);
        var a = path.split('.');
        while (a.length) {
            var n = a.shift();
            if (n in json) {
                json = json[n];
            } else {
                return;
            }
        }
        return json;
    };


    Fx_Json_Utils.prototype.findValue = function (path, json) {
        var parent = "";
        //console.log("path = "+path);

         while (path.length) {
            var n = path.shift();
            parent += n + ".";
            if (n in json) {
                json = json[n];
                if(json != null)
                  json.parent = parent;

            } else {
                return;
            }
        }


       // console.log("END json = "+json);
       // console.log(json);

        return json;
    };

    Fx_Json_Utils.prototype.setValue = function (path, json, value) {
        while (path.length) {
            var n = path.shift();
            if (n in json) {
                json = json[n];
            } else {
                json =  value;
            }
        }

       // return json;
    };


    Fx_Json_Utils.prototype.nestArray = function(keys, value, obj) {
        var self = this;
        //console.log(obj+ " | "+ keys );
        if (keys.length > 0) {
            var key = keys.shift()
            //console.log(obj+ " | "+ key );
            if (obj[key] === undefined) {
                if (keys.length === 0) {
                    obj[key] = value;
                } else {
                    obj[key] = {}
                }
            }
            else {
                if (keys.length === 0) {
                    obj[key] = value;
                } else {
                    obj[key] = obj[key];
                }
            }

            var nestingBookmark = obj[key];
        }
        if (keys.length !== 0) {
            this.nestArray(keys, value, nestingBookmark);
        }
    }

    Fx_Json_Utils.prototype.isJson= function(object) {
        var isJson= true;

        if(returnType(object) != types.UNKNOWN || returnType(object) != types.UNDEFINED)  {

            var json = object;

            if(returnType(object) !=  types.STRING){
                json = JSON.stringify(object);
            }

            try {
                JSON.parse(json);
            } catch (e) {
                isJson = false;
            }
        } else {
            isJson = false;
        }

        return isJson;
    }


    Fx_Json_Utils.prototype.isJsonObject= function(object) {
        var isJsonObject= true,
            json = object,
            obj;

            if(returnType(object) !=  types.STRING){
                json = JSON.stringify(object);
            }

            try {
                obj = JSON && JSON.parse(json) || $.parseJSON(json);

                if(Object.keys(obj).length == undefined){
                    isJsonObject = false;
                }

            } catch (e) {
                isJsonObject = false;
            }


        return isJsonObject;
    };

    Fx_Json_Utils.prototype.isJsonString= function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };


    Fx_Json_Utils.prototype.parse = function(str) {
        return JSON.parse(str);
    };


    Fx_Json_Utils.prototype.splitJsnByKeys = function (keys, jsn, rootIdentifier) {
        // find storage key Object in Loaded JSON
        // If defined, then the keyObj is set to the key property in the splitJsnObj

      //  console.log(keys + " | "+jsn + " | "+rootIdentifier);
        var splitJsnObj = {};

        for(var i = 0; i < keys.length; i++){
            var keyPath = this.findParentPathForProperty(jsn, keys[i]);
            var keyObj;
            if(keyPath === undefined){
                keyObj = "";
                if(rootIdentifier != undefined){   // If rootIdentifier is defined then the key is the root Object and the whole loadedJsnObj is assigned to keyObj
                    if(keys[i] === rootIdentifier) {
                        keyObj = jsn;
                        keyObj.isRoot = true;
                    }
                    else
                        keyObj = "";
                }
            }
            else {
                if(keyPath == 'rootProp') {  // keyPath = 'rootProp', means that the key is a direct property of the root object  e.g. {"content":{}}
                    keyObj = jsn[keys[i]];
                    keyObj.isRoot = false;
                  //  keyObj.entityPath = keys[i];
                }
                else {
                    keyObj = this.findObjectByPath(jsn, keyPath+"["+keys[i]+"]");
                    keyObj.entityPath = keyPath+"."+keys[i];
                    keyObj.isRoot = false;
                }

            }

            splitJsnObj[keys[i]] = keyObj;

        }

       // console.log(splitJsnObj);
        return splitJsnObj;

    };

    Fx_Json_Utils.prototype.deleteRootProperties = function (deleteProps, jsn) {
        // Delete Obj properties that are identified in deleteProps

        for (var key in jsn) {
            var obj = jsn[key];
            for (var prop in obj) {
                 if(obj.hasOwnProperty(prop)){
                    for(var i = 0; i < deleteProps.length; i++)  {
                         if(prop == deleteProps[i]){   // If property and delete prop match, delete the prop from the object
                            delete obj[prop];
                        }
                    }
                }
            }
        }

        return jsn;
    };




    Fx_Json_Utils.prototype.init = function () { };

    //Public API
    return Fx_Json_Utils;

});