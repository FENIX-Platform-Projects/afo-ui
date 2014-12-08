define([
    "jquery"
], function ($) {

    //Public Component
    function Fx_Info() {
    }

    Fx_Info.prototype.createPopOver = function (item, content){
        item.popover({
            content: content,
            trigger: 'focus',
            placement: function(tip, ele) {
                var width = $(window).width();
                var placementparam = width >= 975 ? 'bottom' : ( width < 800 ? 'right' : 'bottom' );
                return placementparam;//'right';//width >= 975 ? 'bottom' : ( width < 600 ? 'right' : 'right' );
            }
        });
    };

    Fx_Info.prototype.createModal = function (item, content, modalId){
        var url = content;
         item.on("click", { module: ""}, function (e) {
            e.preventDefault();
            var myModal = $(modalId),
                modalBody = myModal.find('.modal-body');
            // load content into modal
            modalBody.load(url);
            // display modal
            myModal.modal('show');
        });
    };


    Fx_Info.prototype.init = function () { };

    //Public API
    return Fx_Info;

});