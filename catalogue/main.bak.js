
var fx_controller = (function() {

  var $frameMap = $('#frameMap'),
      $listFertilizers = $('#listFertilizers'),
      
      defaultCountry = 'CAN';

  function init() {

    initLogin();
    
    initMap( defaultCountry );

    initList( defaultCountry );

  };

  function initList(fert) {

    $.getJSON('../config/sampleData.json', function(sampleData) {

      var sel = false;
      for(var i in sampleData.fertilizers) {
        sel = sampleData.fertilizers[i] === fert ? 'selected="selected"' : '';
        $listFertilizers.append('<option '+sel+' value="'+sampleData.fertilizers[i]+'">'+sampleData.fertilizers[i]+'</option>');
      }

      $listFertilizers.on('change', function() {
          var fert = this.value;
          initMap(fert);
      });
    });    

    /*      $listFertilizers
      .jqxListBox({
        source:  {
          url: '../config/sampleData.json'
          root: 'countriesCodes',
          datatype: 'json'
        },
        width: '100%', height: '700px'
      })
      .on('change', function(e) {
        console.log(e.args.item.label);
          //initMap(e.args.item.label);
      });*/  
  }

  function initMap(fert) {

    //fert: DAP,MKP,MOP,MRP

      var query = "SELECT country FROM countries WHERE name = '"+ fert +"' AND value=1",
          data = {};

      //CREATE TABLE countries (s varchar(60), name varchar(60), country varchar(3), value INT);

      data.datasource = 'africafertilizer';
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

            var ccodes = _.map(resp, function(val) {
              return "("+val[0]+",1)";
            }).join(',');

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

  function initLogin() {

    $('.protected').hide();

    $('.btn-login').on('click', function(){
        $('.protected').show();
    });

  }

  return { init : init }

})();

window.addEventListener('load', fx_controller.init, false);

