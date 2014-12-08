define(["jquery", "jstorage"], function ($, jStorage) {

    function Fx_Storage() {
    }

    Fx_Storage.prototype.setItem = function (key, value, options) {
        $.jStorage.set(key, value, options)
    };

    Fx_Storage.prototype.getItem = function (key) {
       return  $.jStorage.get(key)
    };

    Fx_Storage.prototype.deleteItem = function (key) {
        $.jStorage.deleteKey(key)
    };

    Fx_Storage.prototype.clearCache = function () {
        $.jStorage.flush()
    };

    Fx_Storage.prototype.getAllKeys = function () {
       return  $.jStorage.index();
    };


    Fx_Storage.prototype.resetForm = function (key) {
        var self = this;
        var keys = self.getAllKeys();



    // reset form values from json object
     /**   $.each(data, function(name, val){
            var $el = $('[name="'+name+'"]'),
                type = $el.attr('type');

            switch(type){
                case 'checkbox':
                    $el.attr('checked', 'checked');
                    break;
                case 'radio':
                    $el.filter('[value="'+val+'"]').attr('checked', 'checked');
                    break;
                default:
                    $el.val(val);
            }
        })     **/
    };

   /** Fx_Storage.prototype.reDraw = function () {
        var self = this;

        var row, del, keys;
        $("tr[class~=rida]").each(function(c){c.remove();});
        keys = self.getAllKeys();
        for(var i=0; i<keys.length; i++){
            row = new Element("tr",{className:"rida"});
            row.insert(new Element("td").update(keys[i]));
            row.insert(new Element("td").update(self.getItem(keys[i])));
            del = new Element("a",{href:"javascript:void(0)"}).update("DEL");
            (function(i){
               // del.observe("click", function(){
                    self.deleteItem(i);
                    self.reDraw();
               // });
            })(keys[i])
            row.insert(new Element("td").insert(del));
            $("tulemused").insert(row);
        }
    };**/

    return Fx_Storage;

});