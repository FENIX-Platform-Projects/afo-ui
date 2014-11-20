

var map = L.map('prices_retail_map', {
		zoom: 11,
		center: L.latLng(0,0),
		layers: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
	});

var layerRetail = L.featureGroup();
layerRetail.addTo(map);

$('#prices_retail_grid').load("html/prices_retail.html", function() {
	
	var geocoder = new google.maps.Geocoder();


	$('#prices_retail_grid tr').each(function() {

		var place = $(this).find('td').eq(0).text()+', '+
					$(this).find('td').eq(3).text(),
			fert = $(this).find('td').eq(4).text(),
			price = $(this).find('td').eq(6).text();

		geocoder.geocode({address: place}, function (rawjson) {

			var json = {},
				key, loc, disp = [];

			for(var i in rawjson)
			{
				key = rawjson[i].formatted_address;
				
				loc = L.latLng( rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng() );
				var pop = ['<b>'+place+'</b>',fert,price].join('<br>');
				L.marker(loc,{title: place}).bindPopup(pop).addTo(layerRetail);
			}
		});
		setTimeout(function() {
			map.fitBounds(layerRetail.getBounds());
		},500);
	});
});

