
var fx_controller = (function() {


  var $listCountries = $('#listCountries'),
  	  $listCompanies =$('#listCompanies');

  function init() {

    initLogin();
    initCountries();

  };

  function initCountries() {

    $listCountries.on('click', 'a', function(e) {
    	$(this).siblings().removeClass('btn-success active');
    	$(this).addClass('btn-success active');
    	selectCompany({country: $(this).text() });
    });
  }

  function selectCompany(filter) {
  	//hide all
  	$listCompanies.find('.tabCompany').hide().each(function() {
  		if( $(this).find('td:eq(11)').text() === filter.country)
  			$(this).show().find('tr:eq(5)').addClass('bg-success');
  	});


  }

    


//TODO MAKE SELECT BOX FROM fertilizers.js

  function initLogin() {

    $('.protected').hide();

    $('.btn-login').on('click', function(){
        $('.protected').show();
    });

  }

  return { init : init }

})();

window.addEventListener('load', fx_controller.init, false);