
define([
	'text!../config/services.json',
	'jquery','underscore','bootstrap','highcharts','jstree','handlebars','leaflet','leaflet-markecluster',
	], function(
		Config,
		$, _, bts, highcharts, jstree, Handlebars, L, Lmarkers) {

	Config = JSON.parse(Config);

	var map = L.map('prices_retail_map', {
			zoom: 11,
			center: L.latLng(0,0),
			layers: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
		});

	var layerRetail = new L.MarkerClusterGroup({
		maxClusterRadius:30
	});
	layerRetail.addTo(map);


	function loadMarkers() {

		var markers = {},
			places = [],
			placesquery = [];

		$('#prices_retail_grid tbody tr.warning').each(function() {

				var fert = $(this).find('td').eq(4).text(),
					price = $(this).find('td').eq(6).text(),
					place = $(this).find('td').eq(0).text()+', '+
							$(this).find('td').eq(3).text();
							
				places.push({
					fert: fert,
					place: place,
					loc: []
				});
			});

			placesquery = _.pluck(places, 'place').join('|');

			layerRetail.clearLayers();
			$.get(Config.url_geocoding+placesquery, function(json) {

				var bb = L.latLngBounds(json);

				for(var i in json)
				{
					markers[ json[i].join() ] = L.marker(L.latLng(json[i]), {
						title: places[i].place
					})
					.bindPopup([
						'<b>'+places[i].place+'</b>',
						places[i].fert,
						places[i].price
						].join('<br>')
					);
					//.addTo(layerRetail);
				}

				for(var l in markers)
					markers[l].addTo(layerRetail);

				map.fitBounds( bb.pad(1) );
			});
	}

	$('#prices_retail_grid tbody tr').on('click', function(e) {
		$(this).toggleClass('warning');

		loadMarkers();
	});

	loadMarkers();


//////CHART

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
	        enabled: false //Attiva la legenda
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
	        /*plotLines: [{ //linea custom possono essere anche più di una, è un array
	         color: '#666666',
	         width: 1,
	         value: 11.5,
	         dashStyle: 'dash',
	         zIndex: 3
	         }, { //linea custom possono essere anche più di una, è un array
	         color: '#FFFFFF',
	         width: 1,
	         value: 11.5,
	         zIndex: 2
	         }]*/
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

	    $('#prices_retail_chart').highcharts(chart_options);
	});

});
