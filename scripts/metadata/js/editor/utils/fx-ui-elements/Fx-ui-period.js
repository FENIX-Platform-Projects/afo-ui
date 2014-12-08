define([
    "jquery",
    "fx-editor/utils/Fx-date-utils",
    "fx-editor/utils/Fx-element-utils",
    "i18n!fx-editor/nls/langProperties"
     ], function ($, Date_Utils, Element_Utils, langProperties) {

    var date_Utils, dateFormat, element_Utils;

    function Fx_ui_Period() {
        date_Utils = new Date_Utils();
        element_Utils = new Element_Utils();
    }

    Fx_ui_Period.prototype.validate = function (e, o) {
        if (!o.hasOwnProperty("datesConfig")) {
            throw new Error("NO_DATES_CONFIG");
        }

        return true;
    };

    Fx_ui_Period.prototype.render = function (e, name, key, o, callback) {
        var validationRule, bootstrapValidator_Utils, self = this, value = null,
        valueFormatType, valueFromFormat, valueToFormat,
        $periodSelect;



        if(o.validationUtils != undefined) {
            //console.log("VALIDATION UTILS DEFINED --------------- ");
            bootstrapValidator_Utils = o.validationUtils;
        }else {
           // console.log("VALIDATION UTILS UNDEFINED --------------- "+key);
        }

        if(e.hasOwnProperty("rule")){
            validationRule = e.rule;
        }

        //get Value
        if(o.values!=null){
            value = element_Utils.getElementValue(name, o.values);
        }


        // create the start HTML element
        var start = $("<input/>", {
            "class": "input-sm " +o.cssClass,
            "name" : name+".from"
        });


        // create the end HTML element
        var end = $("<input/>", {
            "class": "input-sm " + o.cssClass,
            "name" : name+".to"
        });


        //set the type
        start.attr('type', 'text');
        //set the id
        start.attr('id', 'from');

        //set the type
        end.attr('type', 'text');
        //set the id
        end.attr('id', 'to');

        var valueFromFormat = date_Utils.getFormat(o.datesConfig, date_Utils.getDateType(), "db");
        var valueToFormat = date_Utils.getFormat(o.datesConfig, date_Utils.getDateType(), "gui");

        //set Value
        if(value !=null){
         //var date = moment(value);
         //var fDate = moment(date).format(dateFormat);

            //console.log("==================== PERIOD value");
           // console.log(value);

           // console.log("==================== PERIOD o.datesConfig ");
           // console.log(o.datesConfig);



          //  console.log("findFormatType = "+valueFormatType);


           // valueFromFormat = date_Utils.getFormat(o.datesConfig, valueFormatType, "db");
            //valueToFormat = date_Utils.getFormat(o.datesConfig, valueFormatType, "gui");

            if(value.from !== "") {
               // valueFormatType = date_Utils.findFormatType(o.datesConfig, value.from);
                var fDate = date_Utils.formatDate(value.from, valueToFormat);
               // var fDate = date_Utils.convertFormat(value.from, valueFromFormat, valueToFormat);
                start.val(fDate);
            }

            if(value.to !== "") {
                var efDate = date_Utils.formatDate(value.to, valueToFormat);
               // var efDate = date_Utils.convertFormat(value.to, valueFromFormat, valueToFormat);
                end.val(efDate);
            }
           // var fDate = date_Utils.convertToDisplayFormat(value, dateFormat)
           //val(fDate);

        }


       // if (e.hasOwnProperty("placeholder")) {
            start.attr('placeholder', langProperties.clickForCalendar);
            end.attr('placeholder', langProperties.clickForCalendar);
       // }

      //  if(validationRule &&  bootstrapValidator_Utils){
          //  bootstrapValidator_Utils.setValidationAttributes(start, validationRule, o.lang);
         //   bootstrapValidator_Utils.setValidationAttributes(end, validationRule, o.lang);
       // }

        start.on("dp.change",function (e) {
           $(end).data("DateTimePicker").setMinDate(e.date);
        });

        end.on("dp.change",function (e) {
            $(start).data("DateTimePicker").setMaxDate(e.date);
        });


       this.setDefaultDateAttributes(start, end, valueFromFormat, valueToFormat);


        // create the select options HTML element
       // if(o.datesConfig != undefined){
         //   $periodSelect = this.createPeriodOptionsSelector(key, o, start, end, valueFormatType);
         //   this.setDateAttributes(o.datesConfig, start, end, valueFromFormat, valueToFormat);
       // }



       //Prepend = Add as first child item
        //console.log("============ DATE: container is #"+ o.container+key);

        var containerId = '#'+o.container + key;
        if(e.hasOwnProperty("fieldSetId"))  {
            containerId = '#'+o.container + e.fieldSetId+'-'+key;
        }


        $(containerId).prepend(start);
        end.appendTo(containerId);

       // $periodSelect.appendTo(containerId+'selector');



        callback();

    };





    Fx_ui_Period.prototype.createPeriodOptionsSelector = function (key, opts, start, end, selectedItem) {
        //set all select names as an array i.e. appending []
        var options = [],
            datesConfig = opts.datesConfig,
            select = $("<select/>", {
            "class": opts.cssClass});


        // set the id
        select.attr('id', key+'Opts');

        for (var type in datesConfig) {
            //console.log("type = "+type);
            if (datesConfig.hasOwnProperty(type)) {
                //console.log("[[[[[[ type = ");
               // console.log(datesConfig[type]);
                options.push( "<option value='" + type + "'>" + datesConfig[type]["label"][opts.lang] + "</option>" );
             }
        }

        select.html(options.join(""));

        if(selectedItem !== undefined){
         select.val(selectedItem);
        }

        select.on('change', function(){
            var dataType = datesConfig[$(this).val()]["format"]["gui"];
            //console.log("======================= PERIOD: onchange: dataType "+dataType);

            if(datesConfig[$(this).val()].hasOwnProperty("format")){
                start.attr('data-date-format', datesConfig[$(this).val()]["format"]["gui"]);
                end.attr('data-date-format', datesConfig[$(this).val()]["format"]["db"]);
            }

            if(datesConfig[$(this).val()].hasOwnProperty("format")){
                start.attr('data-date-db-format', datesConfig[$(this).val()]["format"]["db"]);
                end.attr('data-date-db-format', datesConfig[$(this).val()]["format"]["db"]);
           }


            $("#fx-editor-form form div[class='input-group date-range'] input").each(function(){
                $(this).data("DateTimePicker").format = dataType;
            });

          //  $('.j-start-date').data('datepicker').format = datesConfig[$(this).val()]["format"]["gui"];

        });


        return select;
    };

    Fx_ui_Period.prototype.setDefaultDateAttributes = function (start, end, valueFromFormat, valueToFormat) {

        start.attr('data-date-format', valueToFormat);
        end.attr('data-date-format', valueToFormat);

        start.attr('data-date-db-format', valueFromFormat);
        end.attr('data-date-db-format', valueFromFormat);

    };


    Fx_ui_Period.prototype.setDateAttributes = function (config, start, end, valueFromFormat, valueToFormat) {
        var displayDateFormat, dbDateFormat;

        if(valueFromFormat === undefined || valueToFormat === undefined) {
            var formatType;
            for (var type in config) {
                if (config.hasOwnProperty(type)) {
                    formatType = type;
                    break;
                }
            }

            displayDateFormat =config[formatType]["format"]["gui"];
            dbDateFormat = config[formatType]["format"]["db"];

        } else {
            displayDateFormat = valueToFormat;
            dbDateFormat = valueFromFormat;
        }

        start.attr('data-date-format', displayDateFormat);
        end.attr('data-date-format', displayDateFormat);

        start.attr('data-date-db-format', dbDateFormat);
        end.attr('data-date-db-format', dbDateFormat);

    };




    Fx_ui_Period.prototype.getDefaultFormat = function (o, start, end) {
        var firstOption;

        for (var type in o.datesConfig) {
            if (o.datesConfig.hasOwnProperty(type)) {
                firstOption = type;
            }
        }

        var displayDateFormat = date_Utils.getFormat(o.datesConfig, firstOption, "gui");
        var dbDateFormat = date_Utils.getFormat(o.datesConfig, firstOption, "db");

        start.attr('data-date-format', displayDateFormat);
        end.attr('data-date-format', displayDateFormat);

        start.attr('data-date-db-format', dbDateFormat);
        end.attr('data-date-db-format', dbDateFormat);

    };


    Fx_ui_Period.prototype.getValue = function (e) {
        return $("#" + e.id).val();
    };


    return Fx_ui_Period;
});
