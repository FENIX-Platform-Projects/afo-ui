
require.config({

	baseUrl: 'src/',

	paths: {
		'i18n'                  :'lib/i18n',
		'text'                  :'lib/text',
		'domready'              :'lib/domready',
		'bootstrap'             :'lib/bootstrap',	
		//'backbone'              :'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
		'highcharts'            :'//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts',
		//'highcharts_exporting'  :'//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/modules/exporting',
		//'highcharts-heatmap'    :'http://code.highcharts.com/maps/modules/heatmap',
		//'highcharts-data'       :'http://code.highcharts.com/maps/modules/data',
		'jquery'                :'lib/jquery',
		'underscore'            :'lib/underscore',
		'jstree'                :'lib/jstree/jstree.min',
		'handlebars'            :'lib/handlebars',

		//fenix-map-js
		'fenix-map'             :'../submodules/fenix-map-js/dist/latest/fenix-map-min',
		'fenix-map-config'      :'../submodules/fenix-map-js/dist/latest/fenix-map-config',
		'chosen'                :'//fenixapps.fao.org/repository/js/chosen/1.0.0/chosen.jquery.min',		
		'leaflet'               :'//fenixapps.fao.org/repository/js/leaflet/0.7.3/leaflet',	    
		'import-dependencies'   :'//fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0',
		'jquery.power.tip'      :'//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min',
		'jquery-ui'             :'//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
		'jquery.i18n.properties':'//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min',
		'jquery.hoverIntent'    :'//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent',
		'fenix-ui-topmenu'      :'../scripts/components/fenix-ui-topmenu'
	},

	shim: {
		'bootstrap' : ['jquery'],
		'chosen'    : ['jquery'],
		'highcharts': ['jquery'],
		'jstree'    : ['jquery'],
		'jquery-ui'             : ['jquery'],
		'jquery.power.tip'      : ['jquery'],
		'jquery.i18n.properties': ['jquery'],
		'jquery.hoverIntent'    : ['jquery'],
		'underscore': {
		    exports: '_'
		}
	}
});

require([
	'jquery','underscore','bootstrap','highcharts','jstree','handlebars',
	'text!html/accordion.html',
	'fenix-ui-topmenu/main',
	'domready!'
], function($,_,bts,highcharts,jstree,Handlebars,
	accordion, TopMenu) {

	new TopMenu({
		url: 'json/fenix-ui-topmenu_config.json',
		active: "directories"
	});

    var $listCountries = $('#listCountries'),
        $listCompanies = $('#listCompanies'),
        $cancCompanies = $('#cancCompanies');

    function selectCompany(filter) {
        //hide all
        $listCompanies.find('.tabCompany').hide().each(function() {
            
            if(filter.country && $(this).find('td:eq(11)').text() === filter.country)
            	$(this).show().find('tr:eq(5)').addClass('bg-success');
			
			if(filter.company) {

				var name = $(this).find('td:eq(3)').text();
				
				regSearch = new RegExp(filter.company,'ig');
				if( regSearch.test( name ))
            		$(this).show().find('tr:eq(1)').addClass('bg-success');            
           	}

			if(filter.city) {

				var name = $(this).find('td:eq(7)').text();

				regSearch = new RegExp(filter.city,'ig');
				if( regSearch.test( name ))
            		$(this).show().find('tr:eq(4)').addClass('bg-success');            
           	}           	
        });
    }

    $('#company_name, #city_name').on('blur', function(e) {
    	$(this).val('');
    	$('#cancCompanies').trigger('click');
    });

    $('#cancCompanies').on('click', function(e) {
    	e.preventDefault();
    	e.stopPropagation();
    	$listCountries.find('a').removeClass('btn-success active');
    	$listCompanies.find('.tabCompany').hide();
    });

	$listCountries.on('click', 'a', function(e) {
		
		$(this).siblings().removeClass('btn-success active');
		$(this).addClass('btn-success active');

		selectCompany({
		    country: $(this).text()
		});
	});

    $('#company_name').on('keyup', function(e) {
    	var text = $.trim( $(this).val() );

		$('#cancCompanies').trigger('click');

    	selectCompany({
		    company: text
		});
    });

    $('#city_name').on('keyup', function(e) {
    	var text = $.trim( $(this).val() );

		$('#cancCompanies').trigger('click');

    	selectCompany({
		    city: text
		});
    });    



$listCompanies.find('.tabCompany').show();

});