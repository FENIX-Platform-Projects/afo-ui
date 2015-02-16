

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

				'domReady': "//fenixapps.fao.org/repository/js/requirejs/plugins/domready/2.0.1/domReady",
				'swiper': "//fenixapps.fao.org/repository/js/swiper/2.7.5/dist/idangerous.swiper.min",
				'bootstrap': "//fenixapps.fao.org/repository/js/bootstrap/3.3.2/js/bootstrap.min",
				'draggabilly': "//fenixapps.fao.org/repository/js/draggabilly/dist/draggabilly.pkgd.min",
				'intro': "//fenixapps.fao.org/repository/js/introjs/1.0.0/intro",
				'isotope': "//fenixapps.fao.org/repository/js/isotope/2.1.0/dist/isotope.pkgd.min",
				'jquery': "//fenixapps.fao.org/repository/js/jquery/2.1.1/jquery.min",
				'jqwidgets': "//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-light",
				'jstree': "//fenixapps.fao.org/repository/js/jstree/3.0.8/dist/jstree.min",

				//fenix-map-js
				'fenix-map': "submodules/fenix-map-js/dist/latest/fenix-map-min",
				'fenix-map-config': "submodules/fenix-map-js/dist/latest/fenix-map-config",
				'chosen': "//fenixapps.fao.org/repository/js/chosen/1.0.0/chosen.jquery.min",
				'leaflet': "//fenixapps.fao.org/repository/js/leaflet/0.7.3/leaflet",
				'leaflet-markecluster': '//fenixapps.fao.org/repository/js/leaflet/plugins/leaflet.markecluster/1.1/leaflet.markercluster',

				'jquery.power.tip': "//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min",
				'jquery-ui': "//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min",
				'jquery.hoverIntent': "//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent",
				'jquery.i18n.properties': "//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min",
				'import-dependencies': "//fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0",

                'jquery.rangeSlider': '//fenixapps.fao.org/repository/js/jquery.rangeslider/5.7.0/jQDateRangeSlider-min',
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
                'jquery.rangeSlider': ['jquery', 'jquery-ui'],
		        'underscore': {
		            exports: '_'
		        },
                'amplify': {
                    deps: ['jquery'],
                    exports: 'amplifyjs'
                },		        
		        'fenix-map': {
		            deps: [
		                'i18n',
		                'jquery',
		                'chosen',
		                'leaflet',
		                'jquery-ui',
		                'jquery.hoverIntent',
		                'jquery.power.tip',
		                'jquery.i18n.properties',
		                'import-dependencies',
		                'fenix-map-config'
		            ]
		        }	        
		    }
		}
    });

	require([
	    'jquery', 'underscore', 'bootstrap', 'highcharts', 'jstree', 'handlebars', 'swiper', 'leaflet', 'leaflet-markecluster',
	    'text!config/services.json',

		'fx-menu/start',
        './scripts/components/AuthenticationManager',

        'amplify',
        'jquery.rangeSlider',
		'domready!'
	], function($,_,bts,highcharts,jstree,Handlebars,Swiper,L,LeafletMarkecluster,
		Config,

		TopMenu,
		AuthenticationManager
		) {

		Config = JSON.parse(Config);

        //JQUERY range slider
        $(".afo-range").dateRangeSlider();

        new TopMenu({
            active: 'prices_detailed',
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

		$('.footer').load('html/footer.html');

		require(['prices/prices_retail']);

		var chart_options ={

		    //Line chart

		    chart: {
		        type: 'line', //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline

		        alignTicks: false,
		        backgroundColor: '#ffffff', //Colore di background
		        //borderColor: '#3fa8da', //Colore bordo intorno
		        //borderWidth: 1, //Spessore bordo intorno
		        //borderRadius: 0, //Smusso bordo intorno
		        //margin: [5,5,5,5], //Margine intorno (vince sullo spacing)
		        spacing: [20, 1, 1, 1],//Spacing intorno (molto simile al margin - Di default il bottom è 15, qui l'ho messo a 10 per essere uguale agli altri)
		        //plotBackgroundColor: 'red', //Colore di background solo area chart
		        plotBorderColor: '#f9f7f3', //Colore bordo intorno solo area chart
		        plotBorderWidth: 0, //Spessore bordo intorno solo area chart
		        //showAxes: false, //Mostra gli assi quando le serie sono aggiunte dinamicamente
		        style: {
		            fontFamily: 'Roboto Condensed', // Font di tutto
		            fontSize: '12px', // La dimensione qui vale solo per i titoli
		            fontWeight: 300 // Con Roboto è molto bello giocare con i pesi
		        },
		        zoomType: 'false', //Attiva lo zoom e stabilisce in quale dimensione
		        //selectionMarkerFill: 'rgba(0,0,0,0.25)',//Colore di fonfo della selezione per lo zoom (trasparente per far vedere sotto)
		        resetZoomButton: {
		            position: {
		                align: 'right', //Allineamento zoom orizzontale
		                //verticalAlign:'middle' //Allineamento zoom verticale
		                x: -10 //Posizione del pulsante rispetto all'allineamento (valori positivi > destra) e al PLOT

		            },
		            theme: {
		                fill: '#f9f7f3', //Colore di background pulsante reset zoom
		                stroke: '#666666', //Colore di stroke pulsante reset zoom
		                width: 60, //Larghezza del pulsante reset
		                //r:0, //Smusso pulsante reset zoom
		                style: {
		                    textAlign: 'center', //CSS style aggiunto da me per centrare il testo
		                    fontSize: 10
		                },
		                states: {
		                    hover: {
		                        fill: '#e6e6e6', //Colore di background hover pulsante reset zoom
		                        stroke: '#666666', //Colore di stroke hover pulsante reset zoom
		                        style: {
		                            //color: 'white' //Colore testo hover pulsante reset zoom
		                        }
		                    }
		                }
		            }

		        }
		    },
		    colors: [ //Colori delle charts
		        '#336600',
		        '#336600',
		        '#744490',
		        '#E10079',
		        '#2D1706',
		        '#F1E300',
		        '#F7AE3C',
		        '#DF3328'
		    ],
		    credits: {
		        enabled: false //Attiva o disattiva il link di HighCharts dalla chart
		    },
		    exporting: {
		        enabled: false
		    },
		    navigation: { //Modifica lo stile dei bottoni e spesso del solo bottone dell'esportazione (lo sfondo)
		        buttonOptions: {
		            theme: {
		                'stroke-width': 1, // Peso stroke del bottone
		                stroke: '#666666', // Colore stroke del bottone
		                r: 0, // Smusso stroke del bottone,
		                states: {
		                    hover: {
		                        stroke: '#666666', // Press stroke del bottone
		                        fill: '#e6e6e6' // Rollover del bottone
		                    },
		                    select: {
		                        stroke: '#666666', // Press stroke del bottone
		                        fill: '#e6e6e6' // Press Fill del bottone
		                    }
		                }
		            }
		        }
		    },
		    legend: { //Modifica style della legenda
		        enabled: true, //Attiva la legenda
		        floating: false, // IMPORTANTE - Permette alla plot area di stare sotto alla legenda - si guadagna molto spazio

		        //margin: 100, //Margine dell'intero blocco legenda dall'area di PLOT (Solo quando non è floating)
		        //padding: 20, //Padding del box legenda (Ingrandisce il box)
		        backgroundColor: '#ffffff', //Colore di sfondo della legenda
		        layout: 'vertical', //Tipologia di legenda
		        verticalAlign: 'top',
		        align: 'right', //Allineamento orizzontale del box della legenda (left, center, right)

		        borderWidth: 0, //Spessore bordo della legenda


		        itemStyle: {
		            cursor: 'pointer',
		            color: '#666666',
		            fontSize: '14px',
		            fontWeight: 300
		        },
		        itemHiddenStyle: { //Colore dell'elemento legenda quando è disattivato
		            color: '#eeeeee'
		        },
		        itemHoverStyle: { //Colore dell'elemento legenda in rollover
		            color: '#3ca7da'
		        }
		    },
		    plotOptions: {
		        series: {
		            allowPointSelect: false, //Permette di selezionare i punti della chart
		            //pointPlacement: "on", Per partire dall'origine
		            animation: { // Configura l'animazione di entrata
		                duration: 1000,
		                easing: 'swing'
		            },
		            connectNulls: true,
		            cropThreshold: 3,
		            lineWidth: 1, // IMPORTANTE - Cambia lo spessore delle linee della chart
		            states: {
		                hover: {
		                    lineWidth: 1
		                }
		            },
		            fillColor: {
		                linearGradient: [0, 0, 0, 350],
		                stops: [
		                    [0, 'rgba(55, 155, 205,0.5)'],
		                    [1, 'rgba(255,255,255,0)']
		                ]
		            },
		            marker: {
		                enabled: false, //Attiva o disattiva i marker
		                //symbol: 'url(http://www.mentaltoy.com/resources/logoChart.png)', //Questo paramentro carica un simbolo personalizzato. Si può anche avere una chart con marker diverse sulle linee
		                symbol: 'circle', // Tipologia di marker
		                radius: 4,
		                lineWidth: 1,
		                lineColor: '#336600',
		                fillColor: '#FFFFFF',
		                states: {
		                    hover: {
		                        enabled: false, // Attiva o disattiva il marker quando si passa sopra la chart
		                        symbol: 'circle',
		                        fillColor: '#FFFFFF',
		                        lineColor: '#336600',
		                        radius: 5,
		                        lineWidth: 2
		                    }
		                }
		            }
		        }
		    },
		    //END


		    title: {
		        enabled: false,
		        text: null,
		        x: -20 //center
		    },
		    subtitle: {
		        text: null,
		        x: -20
		    },
		    xAxis: {
		        categories: [],
		        gridLineWidth: 1, // IMPORTANTE - Attiva le linee verticali
		        lineColor: '#e0e0e0',
		        tickColor: '#e0e0e0',
		        gridLineColor: '#eeeeee',
		        tickLength: 7,
		        //tickmarkPlacement: 'on', Per partire dall'origine
		        labels: {
		            y: 25,
		            style: {
		                color: '#666666',
		                fontWeight: '300',
		                fontSize: 12
		            }
		        }
		    },
		    yAxis: {
		        gridLineWidth: 1, // IMPORTANTE - Attiva le linee verticali
		        lineWidth: 1,
		        //tickWidth: 1,
		        lineColor: '#e0e0e0',
		        gridLineColor: '#eeeeee',
		        labels: {
		            style: {
		                color: '#666666',
		                fontWeight: '300',
		                fontSize: 12
		            }
		        },
		        title: {
		            enabled: false,
		            text: 'null'
		        },
		        plotLines: [
		            {
		                value: 0,
		                width: 1
		            }
		        ]
		    },
			tooltip: {
		        enabled: false
		    },
		    series: [
		    ]
		};

		$.get('data/prices_international.csv', function(data) {

		    var lines = data.split('\n');
		    
		    $.each(lines, function(lineNo, line) {
		        var items = line.split(';');

		        items = items.splice(1, items.length-3);
		        
		        // header line containes categories
		        if (lineNo == 0) {
		            $.each(items, function(itemNo, item) {
		                if (itemNo > 0) chart_options.xAxis.categories.push(item);
		            });
		        }
		        else {
		            var series = {
		                data: []
		            };
		            $.each(items, function(itemNo, item) {
		                if (itemNo == 0)
		                    series.name = item;
		                else
		                    series.data.push(parseFloat(item));
		            });
		            chart_options.series.push(series);
		        }
		    });
		    $('#chart_prices_inter').highcharts(chart_options);
		});

		$('#prices_international_grid').load("prices/html/prices_international.html");

    });
});