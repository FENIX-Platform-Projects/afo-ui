/*global define */

define([
    'jquery',
    'jqwidgets',
    'highcharts'
], function ($) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        label: {
            UNDEFINED: 'undefined'
        },
        RESOURCES: 'resources',
        DSD: 'dsd',
        COLUMNS: 'columns',
        VALUES: 'values',
        DATA: 'data',
        VIRTUAL: 'virtualColumn',
        COLUMN_ID: "columnId",
        tabs: ['metadata', 'table', 'charts'],
        selectors: {
            content: {
                METADATA: ".tab-metadata-container",
                MAP: ".tab-map-container",
                TABLE: ".tab-table-container",
                AREA_CHART: ".tab-areachart-container",
                LINE_CHART: ".tab-linechart-container",
                PIE_CHART: ".tab-piechart-container"
            }
        },
        events: {
        }
    };

    function DataSetRender(options) {
        this.o = {};
        $.extend(true, this.o, defaultOptions, options);
    }

    DataSetRender.prototype.getSeries = function () {

        var o = Object.keys(this.rawSeries);
        for (var i = 0; i < o.length; i++) {
            this.series.push(this.rawSeries[o[i]]);
        }
    };

    DataSetRender.prototype.updateSeries = function (row) {

        this.rawSeries[row[this.itemIndex]].data.push(row[this.valueIndex]);
    };

    DataSetRender.prototype.createMapCode = function (values) {

        var map = {};
        for (var i = 0; i < values.length; i++) {
            //TODO throw error if the code is not well-formed
            map[values[i].code] = this.getLabel(values[i], 'title');
        }

        return map;
    };

    DataSetRender.prototype.processColumn = function (index, column) {

        //if ( column.hasOwnProperty(this.o.VALUES) && column[this.o.VALUES] !== null && column[this.o.VALUES].length <= -1 ) {
        if (column.hasOwnProperty(this.o.VIRTUAL) && column[this.o.VIRTUAL] === 'INTERNAL') {

            //The column will NOT be displayed
            this.hiddenColumns.push(column);
            this.indexesToDelete.push(index);
        } else {

            //The column WILL be displayed
            this.visibleColumns.push(column);
            this.dataFields.push({ name: column[this.o.COLUMN_ID], type: 'string' });

            if (column.dataType === "code") {

                this.columnsCodeMapping[column.columnId] = this.createMapCode(column.values);
            }

            if (column.columnId === "VALUE") {

                this.valueIndex = index;
            }

            if (column.columnId === "TIME") {
                this.xAxis =[];
                
                if ( typeof column.values[0] === 'string') {

                    for (var i = 0; i <  column.values.length; i++ ){
                        //substrig of portion of Date format - it shows year, month and day
                        this.xAxis.push(column.values[i].substr(5, 11))    
                    }

                } else {
                    this.xAxis = column.values;    
                }
                
            }

            if (column.columnId === "ITEM") {
                
                this.itemIndex = index;

                if (column.dataType === "code") {
                    var a = Object.keys(this.columnsCodeMapping[column.columnId]);
                    for (var i = 0; i < a.length; i++) {
                        this.rawSeries[a[i]] = { name: this.columnsCodeMapping[column.columnId][a[i]], data: [] };
                    }

                } else {

                    for (var i = 0; i < column.values.length; i++) {
                        this.rawSeries[column.values[i]] = { name: column.values[i], data: [] };
                    }
                }
            }
        }
    };

    DataSetRender.prototype.getData = function () {

        for (var i = 0; i < this.rawData.length; i++) {

            //clone array
            var r = this.rawData[i].slice(0);

            //generate Series
            this.updateSeries(r);

            //remove hidden columns
            for (var j = 0; j < this.indexesToDelete.length; j++) {
                r.splice(this.indexesToDelete[j] - j, 1);
            }

            //create jQWidgets model
            var d = {};
            for (j = 0; j < this.visibleColumns.length; j++) {

                if (this.visibleColumns[j].dataType === 'code') {
                    d[this.dataFields[j].name] = r[j] + ' - ' + this.columnsCodeMapping[this.visibleColumns[j].columnId][r[j]];
                } else {
                    d[this.dataFields[j].name] = r[j]
                }
            }

            this.data.push(d);
        }

        return this.data;
    };

    DataSetRender.prototype.getTitle = function () {
        return this.model.metadata
    };

    DataSetRender.prototype.getDataFields = function () {
        return this.dataFields;
    };

    DataSetRender.prototype.getColumns = function () {

        for (var i = 0; i < this.dataFields.length; i++) {
            var c = { datafield: this.dataFields[i].name};
            c.text = this.getColumnLabel(this.visibleColumns [i]);
            c.width = ( 100 / this.dataFields.length ) + "%";
            this.columns.push(c);
        }

        return this.columns;
    };

    DataSetRender.prototype.getColumnLabel = function (column) {

        var label = this.getLabel(column, "title");

        if (label === null) {
            if (column.hasOwnProperty("dimension") && column.dimension !== null) {
                label = this.getLabel(column.dimension, "title");
            }
        }
        return label ? label : this.o.label.UNDEFINED;
    };

    DataSetRender.prototype.getLabel = function (obj, attribute) {

        var label,
            keys;

        if (obj.hasOwnProperty(attribute) && obj.title !== null) {

            if (obj[attribute].hasOwnProperty('EN')) {
                label = obj[attribute]['EN'];
            } else {

                keys = Object.keys(obj[attribute]);

                if (keys.length > 0) {
                    label = obj[attribute][ keys[0] ];
                }
            }
        }

        return label;
    };

    DataSetRender.prototype.initInnerStructures = function () {

        this.dsd = this.model[this.o.DSD];
        this.visibleColumns = [];
        this.hiddenColumns = [];
        this.columnsCodeMapping = {};
        this.columns = [];
        this.indexesToDelete = [];
        this.dataFields = [];
        this.rawColumns = this.dsd[this.o.COLUMNS];
        this.data = [];
        this.series = [];
        this.rawSeries = {};

        for (var i = 0; i < this.rawColumns.length; i++) {
            this.processColumn(i, this.rawColumns[i]);
        }

        this.rawData = this.model[this.o.DATA];

        this.getData();
        this.getSeries();
    };

    DataSetRender.prototype.activatePanels = function () {

        this.$template.find("li[data-tab]").hide();
        for (var i = 0; i < this.o.tabs.length; i++) {
            this.$template.find("li[data-tab='" + this.o.tabs[i] + "']").show();
        }
    };

    DataSetRender.prototype.buildTable = function () {

        var data = this.data;
        // prepare the data
        var source = {
            datatype: "json",
            datafields: this.getDataFields(),
            localdata: data
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        this.$template.find(this.o.selectors.content.TABLE).jqxGrid(
            {
                width: '100%',
                columnsresize: true,
                source: dataAdapter,
                columns: this.getColumns(),
                theme: "fenix"
            });

    };

    DataSetRender.prototype.buildPieChart = function () {

        var conf = {

            //Line chart

            chart: {
                type: 'line', //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline

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
                //enabled: false,
                text: this.getLabel(this.model.metadata, 'title'),
                x: -20 //center
            },
            subtitle: {
                text: null,
                x: -20
            },
            xAxis: {
                categories: this.xAxis,
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
                valueSuffix: 'M',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderWidth: 1,
                shadow: false
            },
            series: this.series
        };

        this.$template.find(this.o.selectors.content.PIE_CHART).highcharts(conf);

    };

    DataSetRender.prototype.buildAreaChart = function () {

        console.log(this.series)


        var conf = {

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
                //enabled: false,
                text: this.getLabel(this.model.metadata, 'title'),
                x: -20 //center
            },
            subtitle: {
                text: null,
                x: -20
            },
            xAxis: {
                categories: this.xAxis,
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
                valueSuffix: 'M',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderWidth: 1,
                shadow: false
            },
            series: this.series
        };

        this.$template.find(this.o.selectors.content.AREA_CHART).highcharts(conf);

    };

    DataSetRender.prototype.buildLineChart = function () {

        var conf = {

            //Line chart

            chart: {
                type: 'line', //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline

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
                //enabled: false,
                text: this.getLabel(this.model.metadata, 'title'),
                x: -20 //center
            },
            subtitle: {
                text: null,
                x: -20
            },
            xAxis: {
                categories: this.xAxis,
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
                valueSuffix: 'M',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderWidth: 1,
                shadow: false
            },
            series: this.series
        };

        this.$template.find(this.o.selectors.content.LINE_CHART).highcharts(conf);

    };

    DataSetRender.prototype.buildChart = function (type) {

        switch (type) {
            case 'line' :
                this.buildLineChart();
                break;
            case 'area' :
                this.buildAreaChart();
                break;
        }
    };

    DataSetRender.prototype.buildMetadata = function () {

        this.$template.find('.meta-uid').html(this.model.metadata.uid);
        this.$template.find('.meta-title').html(this.getLabel(this.model.metadata, 'title'));
        this.$template.find('.meta-language').html(this.model.metadata.language);
        this.$template.find('.meta-datatype').html(this.model.metadata.dataType);
        this.$template.find('.meta-geo').html(this.getLabel(this.model.metadata.geographicExtent, 'title'));
    };

    DataSetRender.prototype.renderItem = function (template, item) {

        this.$template = template;
        this.model = item.resources[0];

        this.initInnerStructures();
        this.activatePanels();
        this.buildTable();
        this.buildMetadata();
    };

    return DataSetRender;
});