var fx_controller = (function() {

  function init() {

    initLogin();

//TODO MAKE SELECT BOX FROM fertilizers.js

  function initLogin() {

    $('.protected').hide();

    $('.btn-login').on('click', function(){
        $('.protected').show();
    });

  }

  return { init : init }

})();

window.addEventListener('load', fx_controller.init, false);