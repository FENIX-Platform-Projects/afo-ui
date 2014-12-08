define([
    "jquery",
    "moment"
], function ($, moment) {

    var dateTypes = {
            NULL: "null",
            UNDEFINED: "undefined",
            DATE: "date",
            PERIOD: "period",
            UNKNOWN: "Unknown"
    },
        /** ISO8601 Formats
         Year:
         YYYY (eg 1997)
         Year and month:
         YYYY-MM (eg 1997-07)
         Complete date:
         YYYY-MM-DD (eg 1997-07-16)
         Complete date plus hours and minutes:
         YYYY-MM-DDThh:mmTZD (eg 1997-07-16T19:20+01:00)  **/

    dateFormats = {
        DATE: "DD-MM-YYYY",
        DATE_TIME: "DD-MM-YYYY hh:mm:ss.s",
        YEAR: "YYYY",
        MONTH: "MM-YYYY",
        TIME:  "hh:mm:ss.s"
    };

    //Public Component
    function Fx_Date_Utils() {
    }

    function convertToDate(strDate, format){
       if(format == undefined)
            return  moment(strDate);
       else
            return moment(strDate, format);
    }


    // moment(date).format() = convertToDate: ISO8601 (e.g 2014-09-10T17:31:00+02:00)
    Fx_Date_Utils.prototype.formatDate = function(date, format){
        if(format == undefined)
            return  moment(date).format();
        else
            return moment(date).format(format);

     }

    Fx_Date_Utils.prototype.convertFormat = function (value, fromFormat, ToFormat){
        var date = convertToDate(value, fromFormat);
        return this.formatDate(date, ToFormat);
    };



    Fx_Date_Utils.prototype.getTypes = function (){
        return dateTypes;
    };


    Fx_Date_Utils.prototype.getDateFormat = function (){
        return  dateFormats.DATE;
    };

    Fx_Date_Utils.prototype.getDateType = function (){
        return  dateTypes.DATE;
    };

    Fx_Date_Utils.prototype.getDefaultFormat = function (){
        return  dateFormats.DATE;
    };

    Fx_Date_Utils.prototype.findFormatType = function (config, value){

        for (var type in config) {
            if (config.hasOwnProperty(type)) {
             //   console.log("config."+type);
                if (config[type].hasOwnProperty("format")) {
                    //console.log("config."+type+".format");
                    if (config[type]["format"].hasOwnProperty("db")) {
                      //  console.log("config."+type+".format.db");
                        var format =  config[type]["format"]["db"];
                      //  console.log("format "+format + " | "+value);
                        if (moment(value, format).isValid()) {
                            return type;
                        }
                    }
                }
            }
        }

       return false;
    };

    Fx_Date_Utils.prototype.getFormat = function (config, type, formatType) {
        var format;
        if(type === null) {
            for (var prop in config) {
                if (config.hasOwnProperty(prop)) {
                    type = prop;
                    break;
                }
            }
        }

        if(config.hasOwnProperty(type)){
            if(config[type].hasOwnProperty("format")){
                if(config[type]["format"].hasOwnProperty(formatType)){
                    format = config[type]["format"][formatType];
                }
            }

            return format;
        }
    };


    Fx_Date_Utils.prototype.init = function () { };

    //Public API
    return Fx_Date_Utils;

});