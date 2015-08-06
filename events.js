

require(["submodules/fenix-ui-menu/js/paths",
		 "submodules/fenix-ui-common/js/Compiler"
		 ], function(Menu, Compiler) {

    var menuConfig = Menu;
    
    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Compiler.resolve([menuConfig], {
        placeholders : {
            FENIX_CDN: "//fenixapps.fao.org/repository"
        },
        config: {
			paths: {
				'text': "//fenixapps.fao.org/repository/js/requirejs/plugins/text/2.0.12/text",
				'i18n': "//fenixapps.fao.org/repository/js/requirejs/plugins/i18n/2.0.4/i18n",
				'domready': "//fenixapps.fao.org/repository/js/requirejs/plugins/domready/2.0.1/domReady",

				'amplify' : "//fenixapps.fao.org/repository/js/amplify/1.1.2/amplify.min",
				'highcharts': "//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts",

				'underscore': "//fenixapps.fao.org/repository/js/underscore/1.7.0/underscore.min",
				'handlebars': "//fenixapps.fao.org/repository/js/handlebars/2.0.0/handlebars",

				'swiper': "//fenixapps.fao.org/repository/js/swiper/2.7.5/dist/idangerous.swiper.min",
				'bootstrap': "//fenixapps.fao.org/repository/js/bootstrap/3.3.2/js/bootstrap.min",
				'draggabilly': "//fenixapps.fao.org/repository/js/draggabilly/dist/draggabilly.pkgd.min",
				'intro': "//fenixapps.fao.org/repository/js/introjs/1.0.0/intro",
				'isotope': "//fenixapps.fao.org/repository/js/isotope/2.1.0/dist/isotope.pkgd.min",
				'jquery': "//fenixapps.fao.org/repository/js/jquery/2.1.1/jquery.min",
				'jqwidgets': "//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-light",
				'jstree': "//fenixapps.fao.org/repository/js/jstree/3.0.8/dist/jstree.min"
			},

		    shim: {
		        'bootstrap': ['jquery'],
		        'chosen': ['jquery'],
		        'highcharts': ['jquery'],
		        'jstree': ['jquery'],
		        'jquery-ui': ['jquery'],
		        'jquery.power.tip': ['jquery'],
		        'jquery.i18n.properties': ['jquery'],
		        'jquery.hoverIntent': ['jquery'],
		        'underscore': {
		            exports: '_'
		        },
                'amplify': {
                    deps: ['jquery'],
                    exports: 'amplifyjs'
                }        
		    }
		}
    });


	require([
	    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper', 
	    'config/services',
		
		'text!html/events.html',
		'config/event_category',
		'fx-menu/start',
        './scripts/components/AuthenticationManager',

        'amplify',

		'domready!'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,
		Config,
		event,
		matchingCategory,
		TopMenu,
		AuthenticationManager
		) {
        new TopMenu({
            active: 'events',        	
            url: 'config/fenix-ui-menu.json',
            className : 'fx-top-menu',
            breadcrumb : {
                active : true,
                container : "#breadcumb_container",
                showHome : true
            }
        });

        new AuthenticationManager();
        amplify.subscribe('login', function (user) {
            console.warn("Event login intercepted");
            console.log(amplify.store.sessionStorage('afo.security.user'));
        });

		eventsTmpl = Handlebars.compile(event);
		
		
		function getWDS(queryTmpl, queryVars, callback) {

			var sqltmpl, sql;

			if(queryVars) {
				console.log('un');
				sqltmpl = _.template(queryTmpl);
				sql = sqltmpl(queryVars);
			}
			else{

				console.log('deux',queryTmpl);
			sql = queryTmpl;
			}
			var	data = {
					datasource: Config.dbName,
					thousandSeparator: ',',
					decimalSeparator: '.',
					decimalNumbers: 2,
					cssFilename: '',
					nowrap: false,
					valuesIndex: 0,
					json: JSON.stringify({query: sql})
				};
			$.ajax({
				url: Config.wdsUrl,
				data: data,
				type: 'POST',
				dataType: 'JSON',
				success: callback
			});
		}


	


	//$.getJSON('data/publications.json', function(json) {	
	
	function getData(sql){
		var test=2;
		getWDS(sql, null, function(json)	{
			
		$('#listPubs').empty();
			
		//	console.log('listPubs',json);

		var idPub = 0;
 
		_.each(json, function(pub2) {

			var eve = {
				"eventInternalId": idPub++,
				"id": pub2[0],
				"category": pub2[1],
				"date_start": pub2[2],
				"date_end": pub2[3],
				"description": pub2[4],
				"title": pub2[5],
				"venue": pub2[13],
				"country": pub2[14]
			};
			//,"long_description": pub2[6]
			console.log(matchingCategory);

			if(pub2[4]==pub2[6]){console.log("no long");}
			else{eve["long_description"]=pub2[6];}
			
			var nbDoc=pub2[7];
			attachments={L:[],PR:[],D:[],PI:[]};
			
			
			var EA_type=pub2[8].split('@|');
			var EA_file_name=pub2[9].split('@|');
			var EA_attachment_title=pub2[10].split('@|');
			var EA_attachment_size=pub2[11].split('@|');
			var EA_attachment_description=pub2[12].split('@|');
			for (var nd=0;nd<nbDoc;nd++)
			{
				
				attachments[EA_type[nd]].push(
			{
				"type":EA_type[nd],
				"file_name":Config["url_attachment_"+EA_type[nd]]+EA_file_name[nd],
				"attachment_title":EA_attachment_title[nd],
				"attachment_size":EA_attachment_size[nd],
				"attachment_description":EA_attachment_description[nd],
			});}
			eve.attachments=attachments;
			
		/*	pub.DocumentTags = pub.DocumentTags ? pub.DocumentTags.split(', ') : '';*/
			eve.category = eve.category ? eve.category.split('|') : '';
			for(var cat in eve.category){
				eve.category[cat]=matchingCategory[eve.category[cat]];
				}
	/*		pub.DocumentType = pub.DocumentType.replace('.','');
*/
console.log(eve);
			$('#listPubs').append( eventsTmpl(eve) );
			//alert('ok');
			//$('#content_'+eve.id).html(eve.description);

		});		
	});}
	
	
	getData(Config.queries.events_reformat);
	Config.queries.events_reformat2=Config.queries.events_reformat;


	$("#txtSearch").on("input" ,function(){
	$(".afo-category-list-li").removeClass("active");
	$(".afo-category-list-li").addClass("noactive");
	getData(Config.queries.events_reformat+" where description ilike '%"+this.value.split(" ").join("%")+"%' or title ilike '%"+this.value.split(" ").join("%")+"%'");
	
	Config.queries.events_reformat2=Config.queries.events_reformat+" where description ilike '%"+this.value.split(" ").join("%")+"%' or title ilike '%"+this.value.split(" ").join("%")+"%' "
	});
	
	
	/*getWDS("select * from publications",null,function(data)	{
	console.log(data);
	});*/
	
	
	$(".afo-category-list-li").click(function(){
	$(".afo-category-list-li").removeClass("active");
	$(".afo-category-list-li").addClass("noactive");
	//console.log(this.innerHTML)
	document.getElementById("txtSearch").value="";
	var tempCategory = $(this).attr('cat');
	console.log('tempCategory',tempCategory)
	if(tempCategory=="All")
	{
		getData(Config.queries.events_reformat);
		Config.queries.events_reformat2=Config.queries.events_reformat;
	}
	else{
		
	getData(Config.queries.events_reformat+" where category = '"+tempCategory+"'");
	Config.queries.events_reformat2=Config.queries.events_reformat+" where category = '"+tempCategory+"' ";
	}
	//console.log(Config.queries.events_reformat+" where upper(category) like '%"+this.innerHTML.toUpperCase()+"%' ")
	this.className="afo-category-list-li active";
	});
	
	$("#mostRecentOreder").click(function(){
	getData(Config.queries.events_reformat2 +"  order by date_start DESC");
	
	});
	
	$("#alphabeticOrder").click(function(){
	
	getData(Config.queries.events_reformat2 +"  order by title");
	
	});
	$("#alphabeticOrderInv").click(function(){
		getData(Config.queries.events_reformat2 +"  order by title DESC");	});	
	
	
	

	$('.footer').load('html/footer.html');

	});

});