/*global require*/


// relative or absolute path of Components' main.js

define(['module'], function (module) {

    var userConfig = module.config();

    var override = {

        "fenix-ui-topmenu": '../components/fenix-ui-topmenu',
        'jqxall': "http://fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-all",
        'jquery': '../../node_modules/jquery/dist/jquery.min',
        'bootstrap': '../../node_modules/bootstrap/dist/js/bootstrap.min'
    };

    require(['../../submodules/fenix-ui-metadata-editor/js/paths',
        '../../submodules/fenix-ui-DSDEditor/js/paths',
        '../../submodules/fenix-ui-DataEditor/js/paths',
        '../../submodules/fenix-ui-dataUpload/js/paths'
    ], function (MetadataEditor, Editor, DataEditor, DataUpload) {

        // NOTE: This setTimeout() call is used because, for whatever reason, if you make
        //       a 'require' call in here or in the Cart without it, it will just hang
        //       and never actually go fetch the files in the browser. There's probably a
        //       better way to handle this, but I don't know what it is.
        setTimeout(function () {

            /*
             @param: prefix of Components paths to reference them also in absolute mode
             @param: paths to override
             @param: options passed in to override defaults
             @param: callback function
             */
            MetadataEditor.initialize('../../submodules/fenix-ui-metadata-editor/js', override, userConfig, function () {

                Editor.initialize('../../submodules/fenix-ui-DSDEditor/js', override, function () {

                    DataEditor.initialize('../../submodules/fenix-ui-DataEditor/js', null, function () {

                        DataUpload.initialize('../../submodules/fenix-ui-dataUpload/js', null, function () {


                            require([
                                'fx-editor/start',
                                'fenix-ui-topmenu/main',
                                'fx-DSDEditor/start',
                                'fx-DataEditor/start',
                                'fx-DataUpload/start'
                            ], function (StartUp, TopMenu, E, DE, DUpload) {

                                new StartUp().init(userConfig);

                                new TopMenu({
                                    url: 'json/fenix-ui-topmenu_config.json', active: "createdataset"
                                });

                                


                                var servicesUrls = {
                                    metadataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata",
                                    dsdUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/dsd",
                                    dataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources"
                                };
                                var DSDEditorContainerID = '#DSDEditorMainContainer';
                                E.init(DSDEditorContainerID,
                                        {
                                            subjects: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Subjects.json",
                                            datatypes: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Datatypes.json",
                                            //codelists: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Codelists_UNECA.json",

                                            codelists: "config/submodules/DSDEditor/CodelistsUNECA.json",
                                            servicesUrls: servicesUrls
                                        }, function () {
                                            $('#DSDEditorContainer').hide();
                                        });

                                DUpload.init('#divUplaodCSV');
                                $('body').on("csvUploaded.DataUpload.fenix", function (evt, contents) {
                                    var existingCols = E.getColumns();
                                    var over = true;
                                    if (existingCols && existingCols.length > 0)
                                        over = confirm("Overwrite?");
                                    if (over) {
                                        E.setColumns(contents.columns);
                                        DE.setData(contents.data);
                                    }
                                });

                                $('#btnColsEditDone').click(function () {
                                    var valRes = E.validate();
                                    if (valRes && valRes.length > 0)
                                        return;
                                    var newDSD = { "columns": p.payload };
                                    E.updateDSD(uid, version, newDSD, datasource, contextSys);

                                    $('#DSDEditorContainer').hide();
                                    $('#DataEditorContainer').show();
                                    $('#DataEditorContainer').css('visibility', '');

                                    DE.set({ "dsd": newDSD });
                                })

                                var datasource = "CountrySTAT";
                                var contextSys = "UNECA";

                                var dataEditorContainerID = "#DataEditorMainContainer";
                                DE.init(dataEditorContainerID, { servicesUrls: servicesUrls }, null);

                                var uid = "";
                                var version = "";
                                window.setTimeout(function () {
                                    $('#DataEditorContainer').hide();
                                }, 2000);


                                $('#debug_skipMeta').click(function () {
                                    $('#metadataEditorContainer').hide();
                                    $('#DSDEditorContainer').show();
                                    $('#DSDEditorContainer').css('visibility', '');
                                });

                                document.body.addEventListener("fx.editor.finish", function (e) {
                                    console.log("EDITOR FINISH");

                                    //console.log(e.detail.data);
                                    uid = e.detail.data.uid;

                                    $('#metadataEditorContainer').hide();
                                    $('#DSDEditorContainer').show();
                                    $('#DSDEditorContainer').css('visibility', '');
                                }, false);

                                $('#createDatasetEnd').on('click', function () {

                                    var data = DE.getData();
                                    var meta = DE.getMeta();
                                    var distincts = DE.getDistincts();

                                    if (distincts) {
                                        for (var colI = 0; colI < meta.dsd.columns.length; colI++) {
                                            var colId = meta.dsd.columns[colI].id;
                                            var colType = meta.dsd.columns[colI].dataType;

                                            if (distincts.hasOwnProperty(colId)) {
                                                var col = meta.dsd.columns[colI];
                                                if (colType == "code") {
                                                    var idCL = col.domain.codes[0].idCodeList;
                                                    var verCL = col.domain.codes[0].version;

                                                    if (verCL)
                                                        col.values = {
                                                            codes: [
                                                                { idCodeList: idCL, version: verCL }
                                                            ]
                                                        };
                                                    else
                                                        col.values = {
                                                            codes: [
                                                                { idCodeList: idCL }
                                                            ]
                                                        };
                                                    col.values.codes[0].codes = [];
                                                    for (var i = 0; i < distincts[colId].length; i++) {
                                                        col.values.codes[0].codes.push({ code: distincts[colId][i] });
                                                    }
                                                }
                                                else {
                                                    col.values = { timeList: distincts[colId] };
                                                }
                                            }
                                        }

                                    }

                                    //console.log(meta.dsd);
                                    /*console.log("data");
                                     console.log(data);*/


                                    DE.updateData(uid, null, data, function () {
                                        console.log("rel1");
                                        DE.updateDSD(uid, null, meta.dsd, datasource, contextSys, function () {
                                            console.log("rel2");
                                            window.location.reload();
                                        });
                                    });


                                })
                            });
                        });
                    });
                });
            }, 0);
        });
    });

});