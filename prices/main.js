
//TODO replace with require()

var initPricesInternational = _.once(function() {
	$.getScript('prices_international.js');
});

var initPricesNational = _.once(function() {
	$.getScript('prices_national.js');
});

var initPricesRetail = _.once(function() {
	$.getScript('prices_retail.js');
});

$(function() {

	initPricesInternational();

	$('#prices_tabs').find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

		switch($(e.target).attr('href'))
		{
			case '#prices_international':
				initPricesInternational();
			break;
			case '#prices_national':
				initPricesNational();
			break;
			case '#prices_retail':
				initPricesRetail();
			break;
		}
	});

});