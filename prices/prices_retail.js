

var map = L.map('prices_retail_map', {
		zoom: 11,
		center: L.latLng(0,0),
		layers: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
	});

var layerRetail = new L.MarkerClusterGroup();//L.featureGroup();
layerRetail.addTo(map);

$('#prices_retail_grid').load("html/prices_retail.html", function() {
	
	var geocoder = new google.maps.Geocoder();

	$('#prices_retail_grid tr').on('click', function(e) {
		$(this).toggleClass('success');

		$('#prices_retail_grid tr.success').each(function() {

			var fert = $(this).find('td').eq(4).text(),
				price = $(this).find('td').eq(6).text(),
				place = $(this).find('td').eq(0).text()+', '+
						$(this).find('td').eq(3).text();

			layerRetail.clearLayers();

			//geocoder.geocode({address: place}, function (rawjson) {
			$.get('http://168.202.28.214:5020/spatialquery/geocoding/'+place, function(json) {

				if(json) {
					loc = L.latLng(json);
					var pop = ['<b>'+place+'</b>',fert,price].join('<br>');
					L.marker(loc,{title: place}).bindPopup(pop).addTo(layerRetail);

/*					console.log(json);
					var json = {},
						key, loc, disp = [];

					for(var i in rawjson)
					{
						key = rawjson[i].formatted_address;
						
						loc = L.latLng( rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng() );
						var pop = ['<b>'+place+'</b>',fert,price].join('<br>');
						L.marker(loc,{title: place}).bindPopup(pop).addTo(layerRetail);
					}*/
				}

			});
			setTimeout(function() {
				map.fitBounds(layerRetail.getBounds().pad(1));
			},800);
		});

	});
});

