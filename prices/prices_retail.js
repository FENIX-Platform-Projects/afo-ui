

var map = L.map('prices_retail_map', {
		zoom: 11,
		center: L.latLng(0,0),
		layers: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
	});

var layerRetail = new L.MarkerClusterGroup();//L.featureGroup();
layerRetail.addTo(map);

$('#prices_retail_grid').load("html/prices_retail.html", function() {
	
	var places = [];

	$('#prices_retail_grid tbody tr').on('click', function(e) {
		$(this).toggleClass('success');

		$('#prices_retail_grid tbody tr.success').each(function() {

			var fert = $(this).find('td').eq(4).text(),
				price = $(this).find('td').eq(6).text(),
				place = $(this).find('td').eq(0).text()+', '+
						$(this).find('td').eq(3).text();
			
			places.push({
				fert: fert,
				place: place,
				loc: []
			});
		});

		var placesquery = _.pluck(places, 'place').join('|');

		layerRetail.clearLayers();
		$.get('http://168.202.28.214:5020/spatialquery/geocoding/'+placesquery, function(json) {

			var bb = L.latLngBounds(json);

			for(var i in json)
			{
				L.marker(L.latLng(json[i]), {
					title: places[i].place
				})
				.bindPopup([
					'<b>'+places[i].place+'</b>',
					places[i].fert,
					places[i].price
					].join('<br>')
				).addTo(layerRetail);
			}

			map.fitBounds( bb.pad(1) );
		});
	});
});

