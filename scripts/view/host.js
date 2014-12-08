define([
    'jquery',
    'structure/structure',
    'fenix-ui-topmenu/main',
    //'highcharts.export',
    'highstocks',
    'jqwidgets',
    'pivot',
    'i18n'
], function ($, Structure, TopMenu) {

    function Host() {
    }

    Host.prototype.initFenixComponent = function () {

        var self = this;

        var callbacks = {
            "callback 1": function () {
                console.log("Callback One")
            },
            "callback 2": function () {
                self.initChats();
                self.initStocks();
            },
            "callback 3": function () {
                console.log("Callback Three")
            },
            "callback 4": function () {
                self.initGrid();
            },
            "callback 5": function () {
            	self.initPivot();
            }
        };

        $.getJSON("json/fenix_interface_view_conf.json", function (conf) {
            new Structure().initialize(conf, callbacks);
        });

        new TopMenu({
            url: 'json/fenix-ui-topmenu_config.json', active: "view"
        });

    };

    Host.prototype.initChats = function () {

        var conf = {
            'chart-1': {

                //Line chart

                chart: {
                    type: 'area', //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline

                    alignTicks: false,
                    backgroundColor: '#FFFFFF', //Colore di background
                    //borderColor: '#3fa8da', //Colore bordo intorno
                    //borderWidth: 1, //Spessore bordo intorno
                    //borderRadius: 0, //Smusso bordo intorno
                    //margin: [5,5,5,5], //Margine intorno (vince sullo spacing)
                    spacing: [20, 1, 1, 1],//Spacing intorno (molto simile al margin - Di default il bottom è 15, qui l'ho messo a 10 per essere uguale agli altri)
                    //plotBackgroundColor: 'red', //Colore di background solo area chart
                    plotBorderColor: '#ffffff', //Colore bordo intorno solo area chart
                    plotBorderWidth: 0, //Spessore bordo intorno solo area chart
                    //showAxes: false, //Mostra gli assi quando le serie sono aggiunte dinamicamente
                    style: {
                        fontFamily: 'Roboto Condensed', // Font di tutto
                        fontSize: '12px', // La dimensione qui vale solo per i titoli
                        fontWeight: 300 // Con Roboto è molto bello giocare con i pesi
                    },
                    zoomType: 'xy', //Attiva lo zoom e stabilisce in quale dimensione
                    //selectionMarkerFill: 'rgba(0,0,0,0.25)',//Colore di fonfo della selezione per lo zoom (trasparente per far vedere sotto)
                    resetZoomButton: {
                        position: {
                            align: 'right', //Allineamento zoom orizzontale
                            //verticalAlign:'middle' //Allineamento zoom verticale
                            x: -10 //Posizione del pulsante rispetto all'allineamento (valori positivi > destra) e al PLOT

                        },
                        theme: {
                            fill: '#FFFFFF', //Colore di background pulsante reset zoom
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
                    '#ca1a33',
                    '#76BE94',
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
                    backgroundColor: '#FFFFFF', //Colore di sfondo della legenda
                    //layout: 'horizontal', //Tipologia di legenda
                    align: 'center', //Allineamento orizzontale del box della legenda (left, center, right)
                    verticalAlign: 'bottom', //allineamento verticale della legenda (top, middle, bottom)
                    //width: 200, //Larghezza della legenda (Aggiunge Margini e padding)
                    //x: -8,//Offset della posizione della legenda rispetto all'allineamento (valori positivi > destra)
                    //y: -8,//Offset della posizione della legenda rispetto all'allineamento (valori positivi > verso il basso)
                    //maxHeight: 90, //IMPORTANTE - Indica l'altezza massima della legenda, se superata, mostra la paginazione (vedi sotto)
                    //borderColor: '#666666', //Colore del bordo della legenda
                    borderWidth: 0, //Spessore bordo della legenda
                    //borderRadius: 3, //Smusso della legenda
                    //itemDistance: 10, //Distanza X degli elementi quando la legenda è in verticale
                    //symbolWidth: 20, //Larghezza del simbolo rettangolo quando la legenda ne ha uno (accanto al nome - default 16)
                    //symbolHeight: 20, //Altezza del simbolo rettangolo quando la legenda ne ha uno (accanto al nome - default 12)
                    //symbolRadius: 3, //Smusso del simbolo rettangolo quando la legenda ne ha uno (default 2)
                    symbolPadding: 10, //Distanza tra simbolo e legenda (default 5)
                    //itemMarginBottom: 5, //Margine inferiore di ogni elemento della legenda
                    //itemMarginTop: 5, //Margine superiore di ogni elemento della legenda
                    //lineHeight: 20, //Altezza di ogni elemento della legenda (il valore di default è 16)
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
                    },
                    navigation: { //Paginazione Legenda - stilizzazione
                        activeColor: '#3ca7da', //Colore freccia attiva legenda
                        inactiveColor: '#666666', //Colore freccia disattiva legenda
                        arrowSize: 8, //Dimensioni freccia
                        animation: true, //Attiva/Disattiva animazione
                        style: { //Stile CSS applicato solo alla navigazione della legenda
                            color: '#666666',
                            fontSize: '10px'
                        }
                    }
                },
                plotOptions: {
                    series: {
                        allowPointSelect: true, //Permette di selezionare i punti della chart
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
                            enabled: true, //Attiva o disattiva i marker
                            //symbol: 'url(http://www.mentaltoy.com/resources/logoChart.png)', //Questo paramentro carica un simbolo personalizzato. Si può anche avere una chart con marker diverse sulle linee
                            symbol: 'circle', // Tipologia di marker
                            radius: 4,
                            lineWidth: 1,
                            lineColor: '#ca1a33',
                            fillColor: '#FFFFFF',
                            states: {
                                hover: {
                                    enabled: true, // Attiva o disattiva il marker quando si passa sopra la chart
                                    symbol: 'circle',
                                    fillColor: '#FFFFFF',
                                    lineColor: '#ca1a33',
                                    radius: 5,
                                    lineWidth: 2
                                }
                            }
                        }
                        //cursor: 'cell',// Cambia il cursore on rollover del grafico
                        //dashStyle: 'ShortDash', //Tipologia di linea (Solid ShortDash ShortDot ShortDashDot ShortDashDotDot Dot Dash LongDash DashDot LongDashDot LongDashDotDot)
                        /*dataLabels: {
                         enabled: true, //Attiva le label sopra i punti nel grafico
                         backgroundColor: '#FFFFFF',
                         borderRadius: 3,
                         borderWidth: 1,
                         borderColor: '#666666'

                         },*/
                        /*events: {// Aggiunge eventi alla chart
                         show: function(event) { //Aggiunge evento di quando un elemnto ricompare cliccandolo dalla legenda
                         alert ('The series was just shown');
                         }
                         },*/

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
                    categories: ['1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'],
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
                    floor: 800,
                    ceiling: 1100,
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
                    valueSuffix: 'M',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderWidth: 1,
                    shadow: false
                },
                series: [
                    {
                        name: 'Number of undernourished declining',
                        data: [1015, 1030, 1026, 1010, 973, 949, 944, 932, 933, 940, 957, 949, 944, 934, 931, 907, 890, 883, 878, 870, 854, 842]
                    }
                ]
            },
            'chart-2': {

                //MTY ®

                chart: {
                    type: 'pie', //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline

                    alignTicks: false,
                    backgroundColor: '#FFFFFF', //Colore di background
                    //borderColor: '#3fa8da', //Colore bordo intorno
                    //borderWidth: 1, //Spessore bordo intorno
                    //borderRadius: 0, //Smusso bordo intorno
                    //margin: [5,5,5,5], //Margine intorno (vince sullo spacing)
                    spacing: [20, 1, 1, 1],//Spacing intorno (molto simile al margin - Di default il bottom è 15, qui l'ho messo a 10 per essere uguale agli altri)
                    //plotBackgroundColor: 'red', //Colore di background solo area chart
                    plotBorderColor: '#ffffff', //Colore bordo intorno solo area chart
                    plotBorderWidth: 0, //Spessore bordo intorno solo area chart
                    //showAxes: false, //Mostra gli assi quando le serie sono aggiunte dinamicamente
                    style: {
                        fontFamily: 'Roboto', // Font di tutto
                        fontSize: '12px', // La dimensione qui vale solo per i titoli
                        fontWeight: 300 // Con Roboto è molto bello giocare con i pesi
                    },
                    zoomType: 'xy', //Attiva lo zoom e stabilisce in quale dimensione
                    //selectionMarkerFill: 'rgba(0,0,0,0.25)',//Colore di fonfo della selezione per lo zoom (trasparente per far vedere sotto)
                    resetZoomButton: {
                        position: {
                            align: 'right', //Allineamento zoom orizzontale
                            //verticalAlign:'middle' //Allineamento zoom verticale
                            x: -10 //Posizione del pulsante rispetto all'allineamento (valori positivi > destra) e al PLOT

                        },
                        theme: {
                            fill: '#FFFFFF', //Colore di background pulsante reset zoom
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
                    '#71a7d1',
                    '#b6d2e9',
                    '#dbeaf5',
                    '#b6d2e9',
                    '#95bddd'
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
                legend: {
                    align: 'right',
                    verticalAlign: 'middle',
                    layout: 'vertical',

                    itemMarginTop: 5,
                    itemMarginBottom: 5,
                    itemStyle: {
                        cursor: 'pointer',
                        color: '#666666',
                        fontSize: '11px',
                        fontWeight: 300
                    },
                    itemWidth: 150,
                    itemHiddenStyle: { //Colore dell'elemento legenda quando è disattivato
                        color: '#eeeeee'
                    },
                    itemHoverStyle: { //Colore dell'elemento legenda in rollover
                        color: '#3ca7da'
                    }
                },
                plotOptions: {
                    pie: {
                        borderWidth: 1,
                        startAngle: -45,
                        dataLabels: {
                            softConnector: false
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
                tooltip: {
                    valueSuffix: 'M',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderWidth: 1,
                    shadow: false
                },
                series: [
                    {
                        name: 'Number of undernourished declining',
                        showInLegend: true,
                        data: [
                            ['Asia', 43],
                            ['Europe', 14],
                            ['Oceania', 4],
                            ['Africa', 14],
                            ['Americas', 25]

                        ]
                    }
                ]
            },
            'chart-3': {

                //Line chart

                chart: {
                    type: 'line', //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline

                    alignTicks: false,
                    backgroundColor: '#FFFFFF', //Colore di background
                    spacing: [20, 1, 1, 1],//Spacing intorno (molto simile al margin - Di default il bottom è 15, qui l'ho messo a 10 per essere uguale agli altri)
                    //plotBackgroundColor: 'red', //Colore di background solo area chart
                    plotBorderColor: '#ffffff', //Colore bordo intorno solo area chart
                    plotBorderWidth: 0, //Spessore bordo intorno solo area chart
                    //showAxes: false, //Mostra gli assi quando le serie sono aggiunte dinamicamente
                    style: {
                        fontFamily: 'Roboto', // Font di tutto
                        fontSize: '12px', // La dimensione qui vale solo per i titoli
                        fontWeight: 300 // Con Roboto è molto bello giocare con i pesi
                    },
                    zoomType: 'xy', //Attiva lo zoom e stabilisce in quale dimensione
                    //selectionMarkerFill: 'rgba(0,0,0,0.25)',//Colore di fonfo della selezione per lo zoom (trasparente per far vedere sotto)
                    resetZoomButton: {
                        position: {
                            align: 'right', //Allineamento zoom orizzontale
                            //verticalAlign:'middle' //Allineamento zoom verticale
                            x: -10 //Posizione del pulsante rispetto all'allineamento (valori positivi > destra) e al PLOT

                        },
                        theme: {
                            fill: '#FFFFFF', //Colore di background pulsante reset zoom
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
                    '#379bcd',
                    '#76BE94',
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


                    backgroundColor: '#FFFFFF', //Colore di sfondo della legenda

                    align: 'center', //Allineamento orizzontale del box della legenda (left, center, right)
                    verticalAlign: 'bottom', //allineamento verticale della legenda (top, middle, bottom)

                    borderWidth: 0, //Spessore bordo della legenda

                    symbolPadding: 10, //Distanza tra simbolo e legenda (default 5)


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
                    },
                    navigation: { //Paginazione Legenda - stilizzazione
                        activeColor: '#3ca7da', //Colore freccia attiva legenda
                        inactiveColor: '#666666', //Colore freccia disattiva legenda
                        arrowSize: 8, //Dimensioni freccia
                        animation: true, //Attiva/Disattiva animazione
                        style: { //Stile CSS applicato solo alla navigazione della legenda
                            color: '#666666',
                            fontSize: '10px'
                        }
                    }
                },
                plotOptions: {
                    series: {
                        allowPointSelect: true, //Permette di selezionare i punti della chart
                        pointPlacement: "on", //Per partire dall'origine
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
                            lineColor: '#379bcd',
                            fillColor: '#FFFFFF',
                            states: {
                                hover: {
                                    enabled: true, // Attiva o disattiva il marker quando si passa sopra la chart
                                    symbol: 'circle',
                                    fillColor: '#FFFFFF',
                                    lineColor: '#3ca7da',
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
                    categories: ['1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036', '2037', '2038', '2039', '2040', '2041'],
                    gridLineWidth: 1, // IMPORTANTE - Attiva le linee verticali
                    lineColor: '#e0e0e0',
                    tickColor: '#e0e0e0',
                    gridLineColor: '#eeeeee',
                    minTickInterval: 10,
                    tickmarkPlacement: 'on',
                    labels: {
                        y: 25,
                        style: {
                            color: '#666666',
                            fontWeight: '300',
                            fontSize: 12
                        },
                        step: 10
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
                        },
                        formatter: function () {
                            return this.value / 1000000 + ' B';
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
                    valueSuffix: ' B',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderWidth: 1,
                    shadow: false
                },
                series: [
                    {
                        name: 'Rural Population',
                        data: [2032117, 2056987, 2082481, 2109462, 2143789, 2180156, 2218232, 2257601, 2297684, 2337903, 2378672, 2418779, 2457562, 2494631, 2532819, 2569173, 2604763, 2636680, 2665788, 2695109, 2724460, 2755416, 2788505, 2822272, 2856962, 2892361, 2928812, 2964145, 2999543, 3033038, 3063709, 3092959, 3120234, 3145797, 3169730, 3191525, 3211512, 3230308, 3247571, 3263424, 3275614, 3284540, 3292974, 3300961, 3308517, 3315917, 3323190, 3329532, 3335553, 3341208, 3346595, 3352038, 3357429, 3362513, 3367068, 3371092, 3374555, 3377440, 3379737, 3381455, 3382538, 3382991, 3382805, 3381986, 3380551, 3378501, 3375835, 3372548, 3368635, 3364121, 3358995, 3353230, 3346917, 3340045, 3332572, 3324216, 3314996, 3304896, 3293917, 3282074, 3269382]
                    },
                    {
                        name: 'Urban Population',
                        data: [1050714, 1084083, 1118703, 1154274, 1185333, 1217319, 1250283, 1284071, 1318425, 1353269, 1388088, 1424099, 1461630, 1500668, 1538207, 1576970, 1616056, 1658997, 1705736, 1753940, 1803781, 1853542, 1903064, 1954118, 2006647, 2061020, 2116504, 2174065, 2230918, 2287778, 2345207, 2401938, 2458635, 2515302, 2572099, 2629492, 2687176, 2745013, 2803909, 2864280, 2928531, 2996312, 3065022, 3134739, 3205581, 3277312, 3349914, 3424110, 3499170, 3574974, 3651401, 3728022, 3804673, 3881272, 3957705, 4033887, 4109774, 4185318, 4260504, 4335295, 4409674, 4483594, 4557080, 4630160, 4702870, 4775178, 4847096, 4918646, 4989882, 5060824, 5131479, 5201831, 5271863, 5341532, 5410873, 5480185, 5549446, 5618616, 5687687, 5756609, 5825359],
                        marker: {
                            enabled: false, //Attiva o disattiva i marker
                            //symbol: 'url(http://www.mentaltoy.com/resources/logoChart.png)', //Questo paramentro carica un simbolo personalizzato. Si può anche avere una chart con marker diverse sulle linee
                            symbol: 'circle', // Tipologia di marker
                            radius: 4,
                            lineWidth: 1,
                            lineColor: '#379bcd',
                            fillColor: '#FFFFFF',
                            states: {
                                hover: {
                                    enabled: true, // Attiva o disattiva il marker quando si passa sopra la chart
                                    symbol: 'circle',
                                    fillColor: '#FFFFFF',
                                    lineColor: '#76BE94',
                                    radius: 5,
                                    lineWidth: 2
                                }
                            }

                        }
                    }
                ]
            },
            'chart-4': {

                //Line chart

                chart: {
                    type: 'column', //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline
                    alignTicks: false,
                    backgroundColor: '#FFFFFF', //Colore di background
                    spacing: [20, 1, 1, 1],//Spacing intorno (molto simile al margin - Di default il bottom è 15, qui l'ho messo a 10 per essere uguale agli altri)
                    //plotBackgroundColor: 'red', //Colore di background solo area chart
                    plotBorderColor: '#ffffff', //Colore bordo intorno solo area chart
                    plotBorderWidth: 0, //Spessore bordo intorno solo area chart
                    //showAxes: false, //Mostra gli assi quando le serie sono aggiunte dinamicamente
                    style: {
                        fontFamily: 'Roboto', // Font di tutto
                        fontSize: '12px', // La dimensione qui vale solo per i titoli
                        fontWeight: 300 // Con Roboto è molto bello giocare con i pesi
                    },
                    zoomType: 'xy', //Attiva lo zoom e stabilisce in quale dimensione
                    //selectionMarkerFill: 'rgba(0,0,0,0.25)',//Colore di fonfo della selezione per lo zoom (trasparente per far vedere sotto)
                    resetZoomButton: {
                        position: {
                            align: 'right', //Allineamento zoom orizzontale
                            //verticalAlign:'middle' //Allineamento zoom verticale
                            x: -10 //Posizione del pulsante rispetto all'allineamento (valori positivi > destra) e al PLOT

                        },
                        theme: {
                            fill: '#FFFFFF', //Colore di background pulsante reset zoom
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
                    '#F1E300',
                    '#DF3328',
                    '#E10079',
                    '#F7AE3C',
                    '#76BE94'
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


                    backgroundColor: '#FFFFFF', //Colore di sfondo della legenda

                    align: 'center', //Allineamento orizzontale del box della legenda (left, center, right)
                    verticalAlign: 'bottom', //allineamento verticale della legenda (top, middle, bottom)

                    borderWidth: 0, //Spessore bordo della legenda

                    symbolPadding: 10, //Distanza tra simbolo e legenda (default 5)


                    itemStyle: {
                        cursor: 'pointer',
                        color: '#666666',
                        fontSize: '11px',
                        fontWeight: 300
                    },
                    itemHiddenStyle: { //Colore dell'elemento legenda quando è disattivato
                        color: '#eeeeee'
                    },
                    itemHoverStyle: { //Colore dell'elemento legenda in rollover
                        color: '#3ca7da'
                    },
                    navigation: { //Paginazione Legenda - stilizzazione
                        activeColor: '#3ca7da', //Colore freccia attiva legenda
                        inactiveColor: '#666666', //Colore freccia disattiva legenda
                        arrowSize: 8, //Dimensioni freccia
                        animation: true, //Attiva/Disattiva animazione
                        style: { //Stile CSS applicato solo alla navigazione della legenda
                            color: '#666666',
                            fontSize: '10px'
                        }
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'},
                    series: {
                        allowPointSelect: true, //Permette di selezionare i punti della chart
                        //pointPlacement: "on", //Per partire dall'origine
                        animation: { // Configura l'animazione di entrata
                            duration: 1000,
                            easing: 'swing'
                        },
                        connectNulls: false,
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
                            lineColor: '#379bcd',
                            fillColor: '#FFFFFF',
                            states: {
                                hover: {
                                    enabled: true, // Attiva o disattiva il marker quando si passa sopra la chart
                                    symbol: 'circle',
                                    fillColor: '#FFFFFF',
                                    lineColor: '#3ca7da',
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
                    categories: ['1990s', '2000s'],
                    gridLineWidth: 1, // IMPORTANTE - Attiva le linee verticali
                    lineColor: '#e0e0e0',
                    tickColor: '#e0e0e0',
                    gridLineColor: '#eeeeee',
                    minTickInterval: 5,
                    tickmarkPlacement: 'on',
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
                            fontSize: 11
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
                    valueSuffix: ' B',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderWidth: 1,
                    shadow: false
                },
                series: [
                    {
                        name: 'Agriculture',
                        data: [4613.44434369, 4983.83650388]
                    },
                    {
                        name: 'Cultivation of Organic Soils and Peat Fires',
                        data: [914.594537429834, 914.594537429834]
                    },
                    {
                        name: 'Biomass Fires',
                        data: [316.299397989412, 283.031380957249]
                    },
                    {
                        name: 'Net Forest Conversion',
                        data: [4568.07452098443, 3789.39134251719]
                    },
                    {
                        name: 'Forest',
                        data: [-2915.4070717, -1867.96246778]
                    }
                ]
            },
            'chart-5': {

                //Line chart

                chart: {
                    type: 'area', //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline

                    alignTicks: false,
                    backgroundColor: '#FFFFFF', //Colore di background
                    spacing: [20, 1, 1, 1],//Spacing intorno (molto simile al margin - Di default il bottom è 15, qui l'ho messo a 10 per essere uguale agli altri)
                    //plotBackgroundColor: 'red', //Colore di background solo area chart
                    plotBorderColor: '#ffffff', //Colore bordo intorno solo area chart
                    plotBorderWidth: 0, //Spessore bordo intorno solo area chart
                    //showAxes: false, //Mostra gli assi quando le serie sono aggiunte dinamicamente
                    style: {
                        fontFamily: 'Roboto', // Font di tutto
                        fontSize: '12px', // La dimensione qui vale solo per i titoli
                        fontWeight: 300 // Con Roboto è molto bello giocare con i pesi
                    },
                    zoomType: 'xy', //Attiva lo zoom e stabilisce in quale dimensione
                    //selectionMarkerFill: 'rgba(0,0,0,0.25)',//Colore di fonfo della selezione per lo zoom (trasparente per far vedere sotto)
                    resetZoomButton: {
                        position: {
                            align: 'right', //Allineamento zoom orizzontale
                            //verticalAlign:'middle' //Allineamento zoom verticale
                            x: -10 //Posizione del pulsante rispetto all'allineamento (valori positivi > destra) e al PLOT

                        },
                        theme: {
                            fill: '#FFFFFF', //Colore di background pulsante reset zoom
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
                    '#379bcd',
                    '#76BE94',
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


                    backgroundColor: '#FFFFFF', //Colore di sfondo della legenda

                    align: 'center', //Allineamento orizzontale del box della legenda (left, center, right)
                    verticalAlign: 'bottom', //allineamento verticale della legenda (top, middle, bottom)

                    borderWidth: 0, //Spessore bordo della legenda

                    symbolPadding: 10, //Distanza tra simbolo e legenda (default 5)


                    itemStyle: {
                        cursor: 'pointer',
                        color: '#666666',
                        fontSize: '11px',
                        fontWeight: 300
                    },
                    itemHiddenStyle: { //Colore dell'elemento legenda quando è disattivato
                        color: '#eeeeee'
                    },
                    itemHoverStyle: { //Colore dell'elemento legenda in rollover
                        color: '#3ca7da'
                    },
                    navigation: { //Paginazione Legenda - stilizzazione
                        activeColor: '#3ca7da', //Colore freccia attiva legenda
                        inactiveColor: '#666666', //Colore freccia disattiva legenda
                        arrowSize: 8, //Dimensioni freccia
                        animation: true, //Attiva/Disattiva animazione
                        style: { //Stile CSS applicato solo alla navigazione della legenda
                            color: '#666666',
                            fontSize: '10px'
                        }
                    }
                },
                plotOptions: {
                    series: {
                        allowPointSelect: true, //Permette di selezionare i punti della chart
                        pointPlacement: "on", //Per partire dall'origine
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
                            lineColor: '#379bcd',
                            fillColor: '#FFFFFF',
                            states: {
                                hover: {
                                    enabled: true, // Attiva o disattiva il marker quando si passa sopra la chart
                                    symbol: 'circle',
                                    fillColor: '#FFFFFF',
                                    lineColor: '#3ca7da',
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
                    categories: ['1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'],
                    gridLineWidth: 1, // IMPORTANTE - Attiva le linee verticali
                    lineColor: '#e0e0e0',
                    tickColor: '#e0e0e0',
                    gridLineColor: '#eeeeee',
                    minTickInterval: 10,
                    tickmarkPlacement: 'on',
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
                        },
                        formatter: function () {
                            return this.value / 1000000000 + ' B';
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
                    valueSuffix: ' B',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderWidth: 1,
                    shadow: false
                },
                series: [
                    {
                        name: 'Asia',
                        data: [325722780, 343443583, 366573358, 386867823, 382213774, 399995097, 423153982, 435156803, 444996071, 477083953, 487031647, 474858060, 508257068, 511410397, 555697337, 560956934, 569189101, 614411982, 618942059, 629460417, 654774680, 673260250, 741874500, 765969525, 750443777, 770213202, 759830107, 798435431, 827475171, 870189416, 866354791, 927918356, 937993717, 920711372, 941647923, 994054048, 990474355, 1014623391, 1033479484, 994071379, 1000753199, 982753719, 998270233, 1036336991, 1085053240, 1116306012, 1153465662, 1179974735, 1202829956, 1230421429, 1291742689, 1297650399]
                    },
                    {
                        name: 'World',
                        data: [873057116, 929382247, 945416012, 997351526, 994783290, 1074427349, 1119658371, 1156256767, 1166708949, 1188615945, 1296321541, 1254832189, 1353296484, 1322785717, 1355776620, 1460158416, 1452337154, 1578781983, 1534423182, 1547388039, 1629726997, 1689877849, 1624258111, 1783727797, 1818230769, 1831021917, 1768793573, 1725066722, 1868697354, 1949761802, 1887332936, 1971213785, 1904354764, 1953819687, 1895057231, 2069661450, 2093234263, 2082270229, 2082983035, 2058174536, 2108112804, 2030503296, 2089948439, 2277999630, 2265981957, 2233796905, 2353560330, 2524996473, 2498439035, 2476480583, 2591642990, 2545002598],
                        fillColor: {
                            linearGradient: [0, 0, 0, 350],
                            stops: [
                                [0, 'rgba(118, 190, 148,0.5)'],
                                [1, 'rgba(255,255,255,0)']
                            ]
                        }
                    }
                ]
            }
        };

        var charts = Object.keys(conf);

        for (var i = 0; i < charts.length; i++) {
            $('#' + charts[i]).highcharts(conf[charts[i]]);
        }

    };

    Host.prototype.initGrid = function () {

        var theme = 'fenix';

        //DEFAULT
        var url = "sampledata/view/products.xml";
        // prepare the data
        var source = {
            datatype: "xml",
            datafields: [
                { name: 'ProductName', type: 'string' },
                { name: 'QuantityPerUnit', type: 'int' },
                { name: 'UnitPrice', type: 'float' },
                { name: 'UnitsInStock', type: 'float' },
                { name: 'Discontinued', type: 'bool' }
            ],
            root: "Products",
            record: "Product",
            id: 'ProductID',
            url: url
        };
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
            if (value < 20) {
                return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #ff0000;">' + value + '</span>';
            }
            else {
                return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #008000;">' + value + '</span>';
            }
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            downloadComplete: function (data, status, xhr) {
            },
            loadComplete: function (data) {
            },
            loadError: function (xhr, status, error) {
            }
        });
        // initialize jqxGrid
        $("#jqxgrid-1").jqxGrid({
            width: "100%",
            source: dataAdapter,
            pageable: true,
            autoheight: true,
            sortable: true,
            altrows: true,
            enabletooltips: true,
            editable: true,
            theme: theme,
            selectionmode: 'multiplecellsadvanced',
            columns: [
                { text: 'Product Name', columngroup: 'ProductDetails', datafield: 'ProductName' },
                { text: 'Quantity per Unit', columngroup: 'ProductDetails', datafield: 'QuantityPerUnit', cellsalign: 'right', align: 'right' },
                { text: 'Unit Price', columngroup: 'ProductDetails', datafield: 'UnitPrice', align: 'right', cellsalign: 'right', cellsformat: 'c2' },
                { text: 'Units In Stock', datafield: 'UnitsInStock', cellsalign: 'right', cellsrenderer: cellsrenderer },
                { text: 'Discontinued', columntype: 'checkbox', datafield: 'Discontinued' }
            ],
            columngroups: [
                { text: 'Product Details', align: 'center', name: 'ProductDetails' }
            ]
        });


        //SPREADSHEET
        // renderer for grid cells.
        var numberrenderer = function (row, column, value) {
            return '<div style="text-align: center; margin-top: 5px;">' + (1 + value) + '</div>';
        }
        // create Grid datafields and columns arrays.
        var datafields = [];
        var columns = [];
        for (var i = 0; i < 26; i++) {
            var text = String.fromCharCode(65 + i);
            if (i == 0) {
                var cssclass = 'jqx-widget-header';
                if (theme != '') cssclass += ' jqx-widget-header-' + theme;
                columns[columns.length] = {pinned: true, exportable: false, text: "", columntype: 'number', cellclassname: cssclass, cellsrenderer: numberrenderer };
            }
            datafields[datafields.length] = { name: text };
            columns[columns.length] = { text: text, datafield: text, width: 60, align: 'center' };
        }
        var source = {
            unboundmode: true,
            totalrecords: 100,
            datafields: datafields,
            updaterow: function (rowid, rowdata) {
                // synchronize with the server - send update command
            }
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        // initialize jqxGrid
        $("#jqxgrid-2").jqxGrid(
            {
                width: '100%',
                source: dataAdapter,
                editable: true,
                columnsresize: true,
                theme: theme,
                selectionmode: 'multiplecellsadvanced',
                columns: columns
            });
        $("#excelExport-2").click(function () {
            $("#jqxgrid-2").jqxGrid('exportdata', 'xls', 'jqxGrid', false);
        });

        //EXPORT
        // prepare the data
        var data = new Array();
        var firstNames =
            [
                "Andrew", "Nancy", "Shelley", "Regina", "Yoshi", "Antoni", "Mayumi", "Ian", "Peter", "Lars", "Petra", "Martin", "Sven", "Elio", "Beate", "Cheryl", "Michael", "Guylene"
            ];
        var lastNames =
            [
                "Fuller", "Davolio", "Burke", "Murphy", "Nagase", "Saavedra", "Ohno", "Devling", "Wilson", "Peterson", "Winkler", "Bein", "Petersen", "Rossi", "Vileid", "Saylor", "Bjorn", "Nodier"
            ];
        var productNames =
            [
                "Black Tea", "Green Tea", "Caffe Espresso", "Doubleshot Espresso", "Caffe Latte", "White Chocolate Mocha", "Cramel Latte", "Caffe Americano", "Cappuccino", "Espresso Truffle", "Espresso con Panna", "Peppermint Mocha Twist"
            ];
        var priceValues =
            [
                "2.25", "1.5", "3.0", "3.3", "4.5", "3.6", "3.8", "2.5", "5.0", "1.75", "3.25", "4.0"
            ];
        for (var i = 0; i < 200; i++) {
            var row = {};
            var productindex = Math.floor(Math.random() * productNames.length);
            var price = parseFloat(priceValues[productindex]);
            var quantity = 1 + Math.round(Math.random() * 10);
            row["firstname"] = firstNames[Math.floor(Math.random() * firstNames.length)];
            row["lastname"] = lastNames[Math.floor(Math.random() * lastNames.length)];
            row["productname"] = productNames[productindex];
            row["price"] = price;
            row["quantity"] = quantity;
            row["total"] = price * quantity;
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array",
            datafields: [
                { name: 'firstname', type: 'string' },
                { name: 'lastname', type: 'string' },
                { name: 'productname', type: 'string' },
                { name: 'quantity', type: 'number' },
                { name: 'price', type: 'number' },
                { name: 'total', type: 'number' }
            ]
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        $("#jqxgrid-3").jqxGrid(
            {
                width: '100%',
                theme: theme,
                source: dataAdapter,
                columnsresize: true,
                columns: [
                    { text: 'Name', dataField: 'firstname' },
                    { text: 'Last Name', dataField: 'lastname' },
                    { text: 'Product', editable: false, dataField: 'productname' },
                    { text: 'Quantity', dataField: 'quantity', width: 80, cellsalign: 'right' },
                    { text: 'Unit Price', dataField: 'price', width: 90, cellsalign: 'right', cellsformat: 'c2' },
                    { text: 'Total', dataField: 'total', cellsalign: 'right', cellsformat: 'c2' }
                ]
            });
        $("#excelExport").click(function () {
            $("#jqxgrid-3").jqxGrid('exportdata', 'xls', 'jqxGrid');
        });
        $("#xmlExport").click(function () {
            $("#jqxgrid-3").jqxGrid('exportdata', 'xml', 'jqxGrid');
        });
        $("#csvExport").click(function () {
            $("#jqxgrid-3").jqxGrid('exportdata', 'csv', 'jqxGrid');
        });
        $("#tsvExport").click(function () {
            $("#jqxgrid-3").jqxGrid('exportdata', 'tsv', 'jqxGrid');
        });
        $("#htmlExport").click(function () {
            $("#jqxgrid-3").jqxGrid('exportdata', 'html', 'jqxGrid');
        });
        $("#jsonExport").click(function () {
            $("#jqxgrid-3").jqxGrid('exportdata', 'json', 'jqxGrid');
        });

    };

    Host.prototype.initStocks = function () {

        $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {

            // Create the chart
            $('#stock-1').highcharts('StockChart', {


                rangeSelector: {
                    inputEnabled: $('#stock-1').width() > 480,
                    selected: 1
                },

                title: {
                    text: 'Stock Price'
                },

                series: [
                    {
                        name: 'Stock Price',
                        data: data,
                        type: 'areaspline',
                        threshold: null,
                        tooltip: {
                            valueDecimals: 2
                        },
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        }
                    }
                ]
            });
        });

    };

    Host.prototype.initPivot = function () {

		$.ajax({
			async: false,
			dataType: "script",
			url: '../submobules/fenix-ui-olap/dataTest.js'
		});

		var FAOSTATOLAPV3 = {};
		FAOSTATOLAPV3.grouped = true;

		function changechkTreeview()
		{
			FAOSTATOLAPV3.grouped=document.getElementById('chkTreeview').checked;
			FAOSTATOLAPV3.mygrid="";
			$("#testinline").pivotUI(finalData,{"rows":["Area","Item","Year"],"cols":["Element"],"vals":["Value"]},false);
		}

		function newGrid(r){
			   var r2d2=[];
			    console.log(r);
			  $("#myGrid1_div").remove();
			for(ligne in r.tree)
			    {
			        //console.log(ligne);
			   var temp=ligne.split('||');
			    for(col in r.colKeys)
			    { 
			        var coldInd=r.colKeys[col].join("||");//.replace(/[^a-zA-Z0-9]/g,"_")
			      // console.log(coldInd);
			        // for(col in r.tree[ligne])
			  /*      console.log("ligne"+ligne+" "+r.tree[ligne]);
			        console.log(col+":"+r.tree[ligne][col].value());*/
			if( r.tree[ligne][coldInd]!=null){temp.push(r.tree[ligne][coldInd].value());}
			else{temp.push( "");}
			                // r2d2.push([ligne,col,+r.tree[ligne][col].value()]);
			      }
			    //  console.log(temp);
			      r2d2.push(temp);
			     }
			       // console.log(r2d2);
			var grid_demo_id = "myGrid1" ;


			var dsOption= {

				fields :[],

				recordType : 'array',
				data : r2d2
			};
			var colsOption = [];

			for(var i in r.rowAttrs) {
			   r.rowAttrs[i];
			   dsOption.fields.push({name : r.rowAttrs[i]  });
			   colsOption.push({id:  r.rowAttrs[i] , header:  r.rowAttrs[i] , width :150,frozen : true ,grouped : FAOSTATOLAPV3.grouped  });
			}

			for(var i in r.colKeys) {
			   dsOption.fields.push({name : r.colKeys[i].toString().replace(/[^a-zA-Z0-9]/g,"_")  });
			   colsOption.push({id:  r.colKeys[i].toString().replace(/[^a-zA-Z0-9]/g,"_") ,
			       width :150,header:  r.colKeys[i].toString()  });
			   
			}

			Sigma.ToolFactroy.register(
				'mybutton',  
				{
					cls : 'mybutton-cls',  
					toolTip : 'I am a new button',
					action : function(event,grid) {  alert( 'The id of this grid is  '+grid.id)  }
				}
			);

			var gridOption={
				id : grid_demo_id,
				width: "800",  //"100%", // 700,
				height: "330",  //"100%", // 330,
				container :  $(".pvtRendererArea")[0],//'gridbox',
				replaceContainer : true, 
				dataset : dsOption ,
				columns : colsOption,
				pageSize : 15 ,
			        pageSizeList : [15,25,50,150],
			        SigmaGridPath : 'grid/',
				toolbarContent : 'nav | goto | mybutton | pagesize '
			};

			//Sigma.Msg.Grid.en.PAGE_AFTER='okokk'+gridOption.pageSize;
			  FAOSTATOLAPV3.mygrid=new Sigma.Grid( gridOption );
			  
			console.log( FAOSTATOLAPV3.mygrid);
			Sigma.Grid.render( FAOSTATOLAPV3.mygrid)() ;
			
			document.getElementById('page_after').innerHTML="/"+FAOSTATOLAPV3.mygrid.getPageInfo().totalPageNum;
			
			FAOSTATOLAPV3.mygrid.pageSizeSelect.onchange=function() {
			  	document.getElementById('page_after').innerHTML="/"+FAOSTATOLAPV3.mygrid.getPageInfo().totalPageNum;
			};
		 
			if(FAOSTATOLAPV3.grouped)
				$("#myGrid1_div").append($("<label for=\"chkTreeview\">Treeview/sorting columns</label><input checked onchange=\"changechkTreeview()\" type=\"checkbox\" id=\"chkTreeview\">"));
			else
				$("#myGrid1_div").append($("<label for=\"chkTreeview\">Treeview/Sorting columns</label><input  onchange=\"changechkTreeview()\" type=\"checkbox\" id=\"chkTreeview\">"));
		}

		$("#testinline").pivotUI(finalData, {
			"rows": ["Area","Item"],
			"cols": ["Element","Year"],
			"vals": ["Value"]
		});
    };

    return Host;

});