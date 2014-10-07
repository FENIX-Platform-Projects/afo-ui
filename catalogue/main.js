
var fx_controller = (function() {

	var $frameMap = $('#frameMap'),
		$listFamilies = $('#listFamilies'),
		conf = {
			wdsUrl: 'http://faostat3.fao.org/wds/rest/table/json',
			dbName: 'africafertilizer'
		};

	function init() {

		initLogin();

		$('.nav-tabs')
		.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			switch($(e.target).attr('href'))
			{
				case '#families':
					initListFamilies();
					initMapFamilies();
				break;
/*				case '#countries':
					initListCountries();
					initMapCountries();				
				break;*/
				case '#crops':
					initListCrops();
					initMapCrops();				
				break;
			}
		});

		initListFamilies();
		initMapFamilies();
	};


  function initLogin(){

    $('.protected').hide();

    $('.btn-login').on('click', function() {
        $('.protected').show();
    });

  }

//FAMILIES

	function initListFamilies() {

		$.getJSON('../scripts/fertilizers.json', function(families) {

			var sel = false;
			for(var i in families) {
				sel = families[i]==='CAN' ? 'selected="selected"':'';
				$listFamilies.append('<option '+sel+' value="'+families[i]+'">'+families[i]+'</option>');
			}

			$listFamilies.on('change', function() {
				initMapFamilies( this.value );
			});
		});
	}

	function initMapFamilies(fert) {

		var data = {
			datasource: conf.dbName,
			thousandSeparator: ',',
			decimalSeparator: '.',
			decimalNumbers: 2,
			cssFilename: '',
			nowrap: false,
			valuesIndex: 0,
			json: JSON.stringify({
				query: "SELECT country "+
					"FROM countries "+
					"WHERE name = '"+ fert +"' AND value=1"
			})
		};

		$.ajax({
			type: 'POST',
			url: conf.wdsUrl,
			data: data,
			success: function (resp) {

				var ccodes = _.map(resp, function(val) {
					return "("+val[0]+",1)";
				}).join(',');

				$('#familiesMap').attr({src:
					"http://fenixapps.fao.org/maps/api?"+
					"baselayers=mapquest&layers=gaul0_faostat_3857&styles=join&joincolumn=iso3_code"+
					"&lat=0&lon=20&zoom=4"+
					"&joindata=["+ccodes+"]"+  //[(EGY,1),(GHA,0),(NGR,1),(MOZ,1)]
					"&enablejoingfi=true&legendtitle=Fertilizer Distribution&mu="+fert+"&lang=E&colors=238B45,ffffff&ranges=1&classification=custom"
				});
			}
		});
	}

//CROPS
	function initListCrops() {

		$.getJSON('../scripts/crops.json', function(families) {

			var sel = false;
			for(var i in families) {
				sel = families[i]==='CAN' ? 'selected="selected"':'';
				$listFamilies.append('<option '+sel+' value="'+families[i]+'">'+families[i]+'</option>');
			}

			$listFamilies.on('change', function() {
				initMapFamilies( this.value );
			});
		});
	}

	function initMapCrops(crop) {

		var data = {
				datasource: conf.dbName,
				thousandSeparator: ',',
				decimalSeparator: '.',
				decimalNumbers: 2,
				cssFilename: '',
				nowrap: false,
				valuesIndex: 0,
				json: JSON.stringify({
					query: "SELECT DISTINCT crop "+
						"FROM fertilizers_crops_faostatcodes "+
						"WHERE crop IS NOT NULL ORDER BY crop"
				})			
			};

			$.ajax({
				type:   'POST',
				url:conf.wdsUrl,
				data:   data,
				success: function (resp) {

					var ccodes = _.map(resp, function(val) {
					  return "("+val[0]+",1)";
					}).join(',');

					$('#cropsMap').attr({src: "http://fenixapps.fao.org/maps/api?"+
						"baselayers=mapquest&layers=gaul0_faostat_3857&styles=join&joincolumn=iso3_code"+
						"&lat=0&lon=20&zoom=4"+
						"&joindata=["+ccodes+"]"+  //[(EGY,1),(GHA,0),(NGR,1),(MOZ,1)]
						"&enablejoingfi=true&legendtitle=Fertilizer Distribution&mu="+fert+"&lang=E&colors=238B45,ffffff&ranges=1&classification=custom"
					});
				}
			});
	}

  return { init : init }

})();

window.addEventListener('load', fx_controller.init, false);

