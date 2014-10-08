
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
				case '#countries':
					initListCountries('BEN');
					//initMapCountries();
					initResultsCountries('BEN','Benin');
				break;
				case '#crops':
					initListCrops('Beans');
					//initMapCrops('Beans');
					initResultsCrops('Beans');
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

			var sel = false,
				lastInit = '';

			//$('#listFamilies').append('<optgroup>');

			for(var i in families) {
				sel = families[i]===fert ? 'selected="selected"':'';

				if(families[i].split(' ').length>2 && families[i].split(' ')[0]!==lastInit)
					$('#listFamilies').append('<optgroup label="'+lastInit+'"></optgroup>');
				
				$('#listFamilies').append('<option '+sel+' value="'+families[i]+'">'+families[i]+'</option>');

				lastInit = families[i].split(' ')[0];
			}

			//$('#listFamilies').append('</optgroup>');

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

		$.ajax({
			type: 'POST',
			url: conf.wdsUrl,
			data: data,
			success: function (resp) {

				var ccodes = _.map(resp, function(val) {
					return "("+val[0]+",1)";
				});

				$('#familiesMap').attr({ src:
					"http://fenixapps.fao.org/maps/api?"+
					"baselayers=mapquest&layers=gaul0_faostat_3857&styles=join&joincolumn=iso3_code"+
					"&lat=0&lon=20&zoom=4&lang=E&"+
					"&joindata=["+ccodes.join(',')+"]"+  //[(EGY,1),(GHA,0),(NGR,1),(MOZ,1)]
					"&enablejoingfi=true&legendtitle=Fertilizers Distribution&"+
					"mu=<b>"+ferts.join('</b><br><b>')+"</b>&"+
					"colors="+conf.colorBounds+",ffffff&"+
					//"colorramp=Greens&"+
					"ranges=10&classification=custom"
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
				initResultsCrops( $(this).val()[0] );
			});
		});
	}

	function initResultsCrops(crop) {

		var data = {
				datasource: conf.dbName,
				thousandSeparator: ',',
				decimalSeparator: '.',
				decimalNumbers: 2,
				cssFilename: '',
				nowrap: false,
				valuesIndex: 0,
				json: JSON.stringify({
					query: "SELECT DISTINCT name "+
						"FROM fertilizers_crops_faostatcodes "+
						"WHERE crop = '"+crop+"'"
				})			
			};

			$.ajax({
				data: data,
				type: 'POST',
				url: conf.wdsUrl,
				success: function (resp) {
					$('#cropsResults').empty().append('<dt><h2>Fertilizers for <b>'+crop+'</b></h2></dt>');
					_.each(resp, function(val) {
						$('#cropsResults').append('<dd>&bull; '+val+'</dd>');
						//TODO add countries
					});
					
				}
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

var AFO_country = [
"BDI","BEN","BFA","CIV","CMR","COD",
"DZA","EGY","ETH","GHA","GNB","GNQ",
"KEN","LBR","MDG","MLI","MOZ","MRT",
"MWI","NER","NGA","RWA","SDN","SEN",
"SYC","TGO","TZA","UGA","ZMB","ZWE"];

			var sel = false;
			for(var i in countries) {
				sel = countries[i].iso3===country ? 'selected="selected"':'';
				if(_.contains(AFO_country, countries[i].iso3))
					$('#listCountries').append('<option '+sel+' value="'+countries[i].iso3+'">'+countries[i].name+'</option>');
			}
			$('#listCountries').on('change', function(e) {
				e.preventDefault();

				var label = $('#listCountries option:selected').text();

				initResultsCountries( $(this).val()[0], label);
			});
		});
	}

	function initResultsCountries(country,countryName) {

		var data = {
				datasource: conf.dbName,
				thousandSeparator: ',',
				decimalSeparator: '.',
				decimalNumbers: 2,
				cssFilename: '',
				nowrap: false,
				valuesIndex: 0,
				json: JSON.stringify({
					query: "SELECT DISTINCT name "+
						"FROM countries "+
						"WHERE country = '"+country+"' AND value=1"
				})			
			};

			$.ajax({
				data: data,
				type: 'POST',
				url: conf.wdsUrl,				
				success: function (resp) {
					$('#countriesResults').empty().append('<dt><h2>Fertilizers in <b>'+countryName+'</b></h2></dt>');
					_.each(resp, function(val) {
						$('#countriesResults').append('<dd>&bull; '+val+'</dd>');
					});
					
				}
			});
	}

  return { init : init }

})();

window.addEventListener('load', fx_controller.init, false);

