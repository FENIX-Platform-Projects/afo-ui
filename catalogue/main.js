
var fx_controller = (function() {

	var conf = {
			wdsUrl: 'http://faostat3.fao.org/wds/rest/table/json',
			dbName: 'africafertilizer',
			colorBounds: '298A08'
		};

	function init() {

		initLogin();

		$('.nav-tabs')
		.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			switch($(e.target).attr('href'))
			{
				case '#families':
					initListFamilies('Agric Lime');
					initMapFamilies('Agric Lime');
				break;
				case '#crops':
					initListCrops('Beans');
					initMapCrops('Beans');				
				break;
				case '#countries':
					initListCountries();
					//initMapCountries();				
				break;				
			}
		});

		initListFamilies('Agric Lime');
		initMapFamilies('Agric Lime');
	};

	function initLogin() {
		$('.protected').hide();
		$('.btn-login').on('click', function() {
			$('.protected').show();
		});
	}

//FAMILIES

	function initListFamilies(fert) {

		$.getJSON('../data_tools/fertilizers.json', function(families) {

			var sel = false;
			for(var i in families) {
				sel = families[i]===fert ? 'selected="selected"':'';
				$('#listFamilies').append('<option '+sel+' value="'+families[i]+'">'+families[i]+'</option>');
			}

			$('#listFamilies').on('change', function() {
				initMapFamilies( $(this).val() );
			});
		});
	}

	function initMapFamilies(ferts) {

		var data = {
			datasource: conf.dbName,
			thousandSeparator: ',',
			decimalSeparator: '.',
			decimalNumbers: 2,
			cssFilename: '',
			nowrap: false,
			valuesIndex: 0,
			json: JSON.stringify({
				query: "SELECT country,name "+
					"FROM countries "+
					"WHERE name IN ('"+ ferts.join("','") +"') AND value=1"
			})
		};

		console.log(data.json);

		$.ajax({
			type: 'POST',
			url: conf.wdsUrl,
			data: data,
			success: function (resp) {

				console.log(resp);

				//val[1]

				var ccodes = _.map(resp, function(val) {
					return "("+val[0]+","+1+")";
				});

				$('#familiesMap').attr({ src:
					"http://fenixapps.fao.org/maps/api?"+
					"baselayers=mapquest&layers=gaul0_faostat_3857&styles=join&joincolumn=iso3_code"+
					"&lat=0&lon=20&zoom=4&lang=E&"+
					"&joindata=["+ccodes.join(',')+"]"+  //[(EGY,1),(GHA,0),(NGR,1),(MOZ,1)]
					"&enablejoingfi=true&legendtitle=Fertilizers Distribution&mu=<b>"+ferts.join('</b><br><b>')+"</b>&"+
					"colors="+conf.colorBounds+",ffffff&ranges=1&classification=custom"
				});
			}
		});
	}

//CROPS

	function initListCrops(crop) {

		$.getJSON('../data_tools/crops.json', function(crops) {

			var sel = false;
			for(var i in crops) {
				sel = crops[i]===crop ? 'selected="selected"':'';
				$('#listCrops').append('<option '+sel+' value="'+crops[i]+'">'+crops[i]+'</option>');
			}

			$('#listCrops').on('change', function(e) {
				e.preventDefault();
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
					query: "SELECT countries.country "+
						"FROM fertilizers_crops_faostatcodes ferts, countries "+
						"WHERE countries.name = ferts.name AND ferts.crop = '"+crop+"'"
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
						"&enablejoingfi=true&legendtitle=Fertilizer Distribution&mu="+crop+"&lang=E&colors=238B45,ffffff&ranges=1&classification=custom"
					});
				}
			});
	}

	function initListCountries(country) {

		$.getJSON('../data_tools/countries_iso3.json', function(countries) {

			var sel = false;
			for(var i in countries) {
				sel = countries[i].iso3===country ? 'selected="selected"':'';
				$('#listCountries').append('<option '+sel+' value="'+countries[i].iso3+'">'+countries[i].name+'</option>');
			}
			$('#listCountries').on('change', function() {
				initMapCountries( this.value );
			});
		});
	}

	function initMapCountries(country) {


		$('#familiesMap').attr({src:
			"http://fenixapps.fao.org/maps/api?"+
			"baselayers=mapquest&layers=gaul0_faostat_3857&styles=join&joincolumn=iso3_code"+
			"&lat=0&lon=20&zoom=4"+
			"&joindata=["+ccodes+"]"+  //[(EGY,1),(GHA,0),(NGR,1),(MOZ,1)]
			"&enablejoingfi=true&legendtitle=Fertilizer Distribution&mu="+fert+"&lang=E&colors=238B45,ffffff&ranges=1&classification=custom"
		});
	}

  return { init : init }

})();

window.addEventListener('load', fx_controller.init, false);

