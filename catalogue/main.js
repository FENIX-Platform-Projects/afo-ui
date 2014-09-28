
var fx_controller = (function() {

  var $frameMap = $('#frameMap'),
      $listFertilizers = $('#listFertilizers');

  function init() {

    initLogin();
    initMap('CAN');
    initList();

  };

  function initList() {

    var sel = false;
    for(var i in Fertilizers) {
      sel = Fertilizers[i]==='CAN' ? 'selected="selected"':'';
      $listFertilizers.append('<option '+sel+' value="'+Fertilizers[i]+'">'+Fertilizers[i]+'</option>');
    }

    $listFertilizers.on('change', function() {
        var fert = this.value;
        console.log(fert);
        initMap(fert);
    });
  }

  function initMap(fert) {

    //fert: DAP,MKP,MOP,MRP

      var query = "SELECT country FROM countries WHERE name = '"+ fert +"' AND value=1",
          data = {};

      //CREATE TABLE countries (s varchar(60), name varchar(60), country varchar(3), value INT);

      data.datasource = 'africanfertilizers';
      data.thousandSeparator = ',';
      data.decimalSeparator = '.';
      data.decimalNumbers = 2;
      data.json = JSON.stringify({query: query});
      data.cssFilename = '';
      data.nowrap = false;
      data.valuesIndex = 0;

      $.ajax({
          type    :   'POST',
          url     :   'http://faostat3.fao.org/wds/rest/table/json',
          data    :   data,
          success: function (resp) {

            console.log(resp);

            var ccodes = _.map(resp, function(val) {
              return "("+val[0]+",1)";
            }).join(',');

            console.log(ccodes);

            var frameUrl = "http://fenixapps.fao.org/maps/api?"+
              "baselayers=mapquest&layers=gaul0_faostat_3857&styles=join&joincolumn=iso3_code"+
              "&lat=0&lon=20&zoom=4"+
              "&joindata=["+ccodes+"]"+  //[(EGY,1),(GHA,0),(NGR,1),(MOZ,1)]
              "&enablejoingfi=true&legendtitle=Fertilizer Distribution&mu="+fert+"&lang=E&colors=238B45,ffffff&ranges=1&classification=custom";
            
            $('#frameMap').attr({src: frameUrl });

          },
          error: function (e, b, c) {
          }
      });
    
  }

  function initLogin(){

    $('.protected').hide();

    $('.btn-login').on('click', function(){
        $('.protected').show();
    });

  }

  return { init : init }

})();

window.addEventListener('load', fx_controller.init, false);

