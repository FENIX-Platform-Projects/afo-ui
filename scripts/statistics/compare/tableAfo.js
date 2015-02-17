define(['webix'], function () {

    var POS = {
        "leftColumns": 1,
        "upPosition": 2,
        "valuePosition": 3,
        "arrayLength": 5,
        container: 'table1'
    };
    var o = {}

    function WebixAdapter() {

        this.leftArray = {};
        this.upArray = {};
    }

    WebixAdapter.prototype.render = function (data) {

        if (this.table && this.table.destructor) {
            this.table.destructor();
        }
        o.errorData = false;

        this.createUniqueArrays(data)


        if (!o.errorData) {

            this.columns = this.createDataTableModel()

            this.dataSource = this.createModelForAdapter(data)

            this.renderGrid(this.columns, this.dataSource)

        }
    }

    WebixAdapter.prototype.createUniqueArrays = function (data) {

        this.leftArray = {};
        this.upArray = {};

        for (var i = 0; i < data.length; i++) {

            this.harmonizeArray(data[i]);

            this.createUniqueArray('up', data[i], this.upArray);

            this.checkIfNullData()

            this.createUniqueArray('left', data[i], this.leftArray);

        }
    };

    WebixAdapter.prototype.harmonizeArray = function (array) {
        if (array[POS.valuePosition] === '-1') {
            array[POS.valuePosition] = '0'
        }
    };

    WebixAdapter.prototype.createUniqueArray = function (versus, dataVector, objectToFill) {

        var versusPosition = (versus == 'up') ? POS.upPosition : POS.leftColumns;
        if (dataVector[versusPosition] && Object.keys(objectToFill).length == 0  && dataVector[versusPosition] != '-1'||
            (dataVector[versusPosition] && dataVector[versusPosition] != null && !objectToFill[versusPosition] == true
            && dataVector[versusPosition] != 'undefined' && dataVector[versusPosition] != '-1')) {
            objectToFill[dataVector[versusPosition]] = true;
        }
    };

    WebixAdapter.prototype.createDataTableModel = function () {

        var columns = [];
        var arrDiffDates = Object.keys(this.upArray)

        columns.push({id: "data0", header: 'Elements', css: "firstColumn"})

        for (var i = 0; i < arrDiffDates.length; i++) {
            if (i == 0) {
                columns.push({
                    id: "data" + 1, header: [
                        {text: 'Years', colspan: arrDiffDates.length},
                        {text: arrDiffDates[i]}
                    ], editor: 'text', fillspace: true, minWidth: 100, css: "datesColumns"
                })
            } else if (i != 0 && i != arrDiffDates.length) {

                columns.push({
                    id: "data" + (i + 1), header: [
                        {text: null},
                        {text: arrDiffDates[i]}
                    ], editor: 'text', fillspace: true, minWidth: 100, css: "datesColumns"
                })
            }
        }
        return columns;
    }

    WebixAdapter.prototype.renderGrid = function (columns, dataSource) {

        this.table = webix.ui({
            container: POS.container,
            view: "datatable",
            rowHeight: 29,
            columnWidth: 200,
            clipboard: "selection",
            columns: columns,
            datatype: "jsarray",
            leftSplit: 1,
            visibleBatch: 1,
            data: dataSource
        });
    };

    WebixAdapter.prototype.createModelForAdapter = function (data) {

        var arrayLeft = Object.keys(this.leftArray);
        var arrayUp = Object.keys(this.upArray);

        var result = [];

        for (var j = 0; j < arrayLeft.length; j++) {
            var left = arrayLeft[j]
            var element = []
            element.push(left);
            for (var k = 0; k < arrayUp.length; k++) {
                for (var n = 0; n < data.length; n++) {
                    if (data[n][POS.upPosition] == arrayUp[k] && data[n][POS.leftColumns] == arrayLeft[j]) {
                        element.push(data[n][POS.valuePosition]);
                        break;
                    }
                }
            }
            result.push(element)
        }

        return result;

    }


    WebixAdapter.prototype.checkIfNullData = function () {

        if (Object.keys(this.upArray).length == 0) {
            o.errorData = true;
        }


    }

    return WebixAdapter;
});