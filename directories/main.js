var fx_controller = (function() {

  function init(){

    initLogin();
  
    var frameUrl = "http://fenixapps.fao.org/maps/api?"+
      "baselayers=mapquest&layers=gaul0_faostat_3857&styles=join&joincolumn=iso3_code"+
      "&lat=0&lon=20&zoom=4"+
      "&joindata=[(EGY,1),(GHA,0),(NGR,1),(MOZ,1)]"+
      "&enablejoingfi=true&legendtitle=fertilizers&mu=fertilizers&lang=E&colors=238B45,ffffff&ranges=1&classification=custom";
    
    $('#mapFrame').attr({src: frameUrl});
  };

  function initLogin(){

    $('.protected').hide();

    $('.btn-login').on('click', function(){
        $('.protected').show();
    });

  }

  return { init : init }

})();

window.addEventListener('load', fx_controller.init, false);