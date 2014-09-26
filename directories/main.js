var fx_controller = (function() {

  function init() {

    initLogin();

//TODO MAKE SELECT BOX FROM fertilizers.js

    var data = {},
        q = "SELECT * FROM countries WHERE name";

    data.datasource = 'africanfertilizers';
    data.thousandSeparator = ',';
    data.decimalSeparator = '.';
    data.decimalNumbers = 2;
    
    //CREATE TABLE countries (s varchar(60), name varchar(60), country varchar(3), value INT);
    
    data.json = JSON.stringify({query: q});
    data.cssFilename = '';
    data.nowrap = false;
    data.valuesIndex = 0;

    $.ajax({
        type    :   'POST',
        url     :   'http://faostat3.fao.org/wds/rest/table/json',
        data    :   data,
        success: function (resp) {
            console.log(resp);
        },
        error: function (e, b, c) {
        }
    });
  
    var frameUrl = "http://fenixapps.fao.org/maps/api?"+
      "baselayers=mapquest&layers=gaul0_faostat_3857&styles=join&joincolumn=iso3_code"+
      "&lat=0&lon=20&zoom=4"+
      "&joindata=[(EGY,1),(GHA,0),(NGR,1),(MOZ,1)]"+
      "&enablejoingfi=true&legendtitle=fertilizers&mu=fertilizers&lang=E&colors=238B45,ffffff&ranges=1&classification=custom";
    
    $('#mapFrame').attr({src: frameUrl});
  };

  function initLogin() {

    $('.protected').hide();

    $('.btn-login').on('click', function(){
        $('.protected').show();
    });

  }

  return { init : init }

})();

window.addEventListener('load', fx_controller.init, false);