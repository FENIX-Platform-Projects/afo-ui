
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
		'text!html/publication.html'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,
		Config,
		renderAuthMenu,
		tmplPublication) {

		renderAuthMenu(true);


		function getWDS(queryTmpl, queryVars, callback) {

			var sqltmpl, sql;

			if(queryVars) {
				sqltmpl = _.template(queryTmpl);
				sql = sqltmpl(queryVars);
			}
			else
				sql = queryTmpl;

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


		publicationTmpl = Handlebars.compile(tmplPublication);


		//$.getJSON('data/publications.json', function(json) {	
		
		function getData(sql){getWDS(sql, null, function(json)	{
			$('#listPubs').empty();

			var idPub = 0;

			_.each(json, function(pub2) {

				var pub = {
					"PublicationId": idPub++,
					"Category": pub2[0],
					"PublicationName": pub2[1],
					"PublicationDescription": pub2[2],
					"PublicationSource": pub2[5],
					"PublicationAuthorName": pub2[6],
					"PublicationSector&Theme": pub2[7],
					"PublicationDate":pub2[4],
					"DocumentLanguage":pub2[8],
					"REC":pub2[9],
					"Countries":pub2[10],
					"DocumentTags":pub2[15],
					"PublicationRating":pub2[16],
					"PublicationComments":"",
					"DocumentType":pub2[11],
					"DocumentSource":pub2[13]
				};

				pub.DocumentTags = pub.DocumentTags ? pub.DocumentTags.split(', ') : '';
				pub.Category = pub.Category ? pub.Category.split('|') : '';
				pub.DocumentType = pub.DocumentType.replace('.','');

				$('#listPubs').append( publicationTmpl(pub) );

			});		
		});}
		
		
		getData(Config.queries.pubs_reformat);
		Config.queries.pubs_reformat2=Config.queries.pubs_reformat;


		$("#txtSearch").on("input" ,function(){
		$(".afo-category-list-li").removeClass("active");
		$(".afo-category-list-li").addClass("noactive");
		getData(Config.queries.pubs_reformat+" where upper(description) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' or upper(title) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' or upper(author_name) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' or upper(source) like '%"+this.value.toUpperCase().split(" ").join("%")+"%'");
		
		Config.queries.pubs_reformat2=Config.queries.pubs_reformat+" where upper(description) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' or upper(title) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' or upper(author_name) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' or upper(source) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' "
		});
		
		
		/*getWDS("select * from publications",null,function(data)	{
		console.log(data);
		});*/
		
		
		$(".afo-category-list-li").click(function(){
		$(".afo-category-list-li").removeClass("active");
		$(".afo-category-list-li").addClass("noactive");
		//console.log(this.innerHTML)
		document.getElementById("txtSearch").value="";
		if(this.innerHTML=="All")
		{
			getData(Config.queries.pubs_reformat);
		Config.queries.pubs_reformat2=Config.queries.pubs_reformat;
		
			
		}
		else{
		getData(Config.queries.pubs_reformat+" where upper(category) like '%"+this.innerHTML.toUpperCase()+"%' ");
		Config.queries.pubs_reformat2=Config.queries.pubs_reformat+" where upper(category) like '%"+this.innerHTML.toUpperCase()+"%' ";
		}
		//console.log(Config.queries.pubs_reformat+" where upper(category) like '%"+this.innerHTML.toUpperCase()+"%' ")
		this.className="afo-category-list-li active";
		});
		
		$("#mostRecentOreder").click(function(){
		
		getData(Config.queries.pubs_reformat2 +"  order by posting_date DESC");
		
		});
		
		$("#alphabeticOrder").click(function(){
		
		getData(Config.queries.pubs_reformat2 +"  order by title");
		
		});
		$("#alphabeticOrderInv").click(function(){
		
		getData(Config.queries.pubs_reformat2 +"  order by title DESC");
		
		});	
		
	});
});