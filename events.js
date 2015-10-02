
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
	    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper', 'amplify',
	    'config/services',
	    'src/renderAuthMenu',
	    'fx-common/js/WDSClient',
		'text!html/events.html'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,amp,
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

		var eventsTmpl = Handlebars.compile(tmplEvents);

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

						if(pub2[4] != pub2[6])
							eve["long_description"] = pub2[6];
						
						var nbDoc = pub2[7];
						eve.attachments = {
							"L": [], "PR": [], "D": [], "PI": []
						};
						
						var EA_type=pub2[8].split('@|');
						var EA_file_name=pub2[9].split('@|');
						var EA_attachment_title=pub2[10].split('@|');
						var EA_attachment_size=pub2[11].split('@|');
						var EA_attachment_description=pub2[12].split('@|');
						for (var nd=0; nd<nbDoc; nd++)
						{
							eve.attachments[EA_type[nd]].push({
								"type": EA_type[nd],
								"file_name": (EA_type[nd]!=='L' ? Config.url_events_attachments : '')+EA_file_name[nd],
								"attachment_title": EA_attachment_title[nd],
								"attachment_size": EA_attachment_size[nd],
								"attachment_description": EA_attachment_description[nd],
							});
						}
						
						eve.category = eve.category ? eve.category.split('|') : '';
						
						for(var cat in eve.category)
							eve.category[cat]= Config.eventCategories[ eve.category[cat] ];

						$('#listPubs').append( eventsTmpl(eve) );
					});
				}
			});
		}
		
		getData(Config.queries.events_reformat);
		
		Config.queries.events_reformat2 = Config.queries.events_reformat;

		$("#txtSearch").on("input", function() {
			$(".afo-category-list-li").removeClass("active");
			$(".afo-category-list-li").addClass("noactive");
			
			getData(Config.queries.events_reformat+" WHERE description ILIKE '%"+this.value.split(" ").join("%")+"%' OR title ILIKE '%"+this.value.split(" ").join("%")+"%'");
			
			Config.queries.events_reformat2 = Config.queries.events_reformat+" WHERE description ilike '%"+this.value.split(" ").join("%")+"%' or title ilike '%"+this.value.split(" ").join("%")+"%' ";
		});

		$(".afo-category-list-li").on('click', function() {
			$(".afo-category-list-li").removeClass("active");
			$(".afo-category-list-li").addClass("noactive");

			$("#txtSearch").val('');

			var tempCategory = $(this).attr('cat');

			if(tempCategory=="All") {
				getData(Config.queries.events_reformat);
				Config.queries.events_reformat2 = Config.queries.events_reformat;
			}
			else {
				getData(Config.queries.events_reformat+" where category = '"+tempCategory+"'");
				Config.queries.events_reformat2 = Config.queries.events_reformat+" where category = '"+tempCategory+"' ";
			}

			$(this).attr('class', "afo-category-list-li active");
		});
		
		$("#mostRecentOreder").on('click', function() {
			getData(Config.queries.events_reformat2 +" ORDER BY date_start DESC");
		});
		
		$("#alphabeticOrder").on('click', function() {
			getData(Config.queries.events_reformat2 +" ORDER BY title");
		});

		$("#alphabeticOrderInv").on('click', function() {
			getData(Config.queries.events_reformat2 +" ORDER BY title DESC");
		});	

	});
});