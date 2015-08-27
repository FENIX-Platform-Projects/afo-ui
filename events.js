
require([
    "config/paths",
    "submodules/fenix-ui-menu/js/paths",
    "submodules/fenix-ui-common/js/Compiler"    
], function(Paths, menuConfig, Compiler) {

    menuConfig['baseUrl'] = "submodules/fenix-ui-menu/js";

    Compiler.resolve([menuConfig], {
        placeholders : {
            FENIX_CDN: Paths.FENIX_CDN
        },
        config: Paths
    });

	require([
	    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper',
	    'config/services',
	    'src/renderAuthMenu',
	    'fx-common/js/WDSClient',

		'text!html/events.html',

        'amplify'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,
		Config,
		renderAuthMenu,
		WDSClient,

		tmplEvents
	) {

        renderAuthMenu(true);

		var wdsClient = new WDSClient({
			datasource: Config.dbName,
			outputType: 'array'
		});

        var eventCategories = {
			"1":"AFO technical workshops",
			"2":"AFO conferences &amp; events",
			"3":"AFO partners events",
			"4":"AFO partners corner"
		};

		eventsTmpl = Handlebars.compile(tmplEvents);

		function getData(sql) {

			wdsClient.retrieve({
				payload: {
					query: sql
				},
				success: function(data) {
				
					$('#listPubs').empty();

					var idPub = 0;
					_.each(data, function(pub2) {

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

						if(pub2[4]==pub2[6])
							console.log("no long");
						else
							eve["long_description"] = pub2[6];
						
						var nbDoc=pub2[7];
						attachments={L:[],PR:[],D:[],PI:[]};
						
						var EA_type=pub2[8].split('@|');
						var EA_file_name=pub2[9].split('@|');
						var EA_attachment_title=pub2[10].split('@|');
						var EA_attachment_size=pub2[11].split('@|');
						var EA_attachment_description=pub2[12].split('@|');
						for (var nd=0; nd<nbDoc; nd++)
						{
							attachments[EA_type[nd]].push({
								"type":EA_type[nd],
								"file_name": (EA_type[nd]!=='L'?Config.url_events_attachments:'')+EA_file_name[nd],
								"attachment_title":EA_attachment_title[nd],
								"attachment_size":EA_attachment_size[nd],
								"attachment_description":EA_attachment_description[nd],
							});
						}
						
						eve.attachments=attachments;
						
						eve.category = eve.category ? eve.category.split('|') : '';
						
						for(var cat in eve.category)
							eve.category[cat]= eventCategories[ eve.category[cat] ];

						$('#listPubs').append( eventsTmpl(eve) );
					});
				}
			});
		}
		
		getData(Config.queries.events_reformat);
		
		Config.queries.events_reformat2 = Config.queries.events_reformat;

		$("#txtSearch").on("input" ,function() {
			$(".afo-category-list-li").removeClass("active");
			$(".afo-category-list-li").addClass("noactive");
			getData(Config.queries.events_reformat+" where description ilike '%"+this.value.split(" ").join("%")+"%' or title ilike '%"+this.value.split(" ").join("%")+"%'");
			
			Config.queries.events_reformat2 = Config.queries.events_reformat+" where description ilike '%"+this.value.split(" ").join("%")+"%' or title ilike '%"+this.value.split(" ").join("%")+"%' ";
		});

		$(".afo-category-list-li").click(function(){
		$(".afo-category-list-li").removeClass("active");
		$(".afo-category-list-li").addClass("noactive");
		//console.log(this.innerHTML)
		$("#txtSearch").val('');
		var tempCategory = $(this).attr('cat');
		
		//console.log('tempCategory',tempCategory)

		if(tempCategory=="All") {
			getData(Config.queries.events_reformat);
			Config.queries.events_reformat2 = Config.queries.events_reformat;
		}
		else {
			getData(Config.queries.events_reformat+" where category = '"+tempCategory+"'");
			Config.queries.events_reformat2 = Config.queries.events_reformat+" where category = '"+tempCategory+"' ";
		}
		//console.log(Config.queries.events_reformat+" where upper(category) like '%"+this.innerHTML.toUpperCase()+"%' ")
		this.className="afo-category-list-li active";
		});
		
		$("#mostRecentOreder").click(function() {
			getData(Config.queries.events_reformat2 +" order by date_start DESC");
		});
		
		$("#alphabeticOrder").click(function() {
			getData(Config.queries.events_reformat2 +" order by title");
		});

		$("#alphabeticOrderInv").click(function() {
			getData(Config.queries.events_reformat2 +" order by title DESC");
		});	

	});
});