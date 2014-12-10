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

                                //Metadata



                                var uid = "";
                                var version = "";
                                var csvData;

                                var cfgDSDEdit = {
                                    columnEditor: { codelists: "config/submodules/DSDEditor/Codelists_AFO.json" },
                                    D3SConnector: {
                                        datasource: "CountrySTAT",
                                        contextSystem: "AFO",
                                        metadataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata",
                                        dsdUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/dsd",
                                        dataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources",
                                        codelistUrl: "http://faostat3.fao.org:7799/v2/msd/resources/data"
                                    }
                                };
                                var cfgDataEdit = {
                                    D3SConnector: {
                                        datasource: "CountrySTAT",
                                        contextSystem: "AFO",
                                        metadataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata",
                                        dsdUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/dsd",
                                        dataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources",
                                        codelistUrl: "http://faostat3.fao.org:7799/v2/msd/resources/data"
                                    }
                                }
                                var DSDEditorContainerID = '#DSDEditorMainContainer';
                                var dataEditorContainerID = "#DataEditorMainContainer";

                                E.init(DSDEditorContainerID, cfgDSDEdit, function () {
                                    $('#DSDEditorContainer').hide();

                                    //TEST
                                    /*E.loadDSD("dan", null, function (d) {
                                        E.setColumns(d.dsd.columns);
                                    });*/

                                });
                                DUpload.init('#divUplaodCSV');
                                $('body').on("csvUploaded.DataUpload.fenix", function (evt, contents) {
                                    var existingCols = E.getColumns();
                                    var over = true;
                                    if (existingCols && existingCols.length > 0)
                                        over = confirm("Overwrite?");
                                    if (over) {
                                        E.setColumns(contents.columns);
                                        //console.log(contents.data);
                                        csvData = contents.data;
                                    }
                                });

                                //DataEditor
                                DE.init(dataEditorContainerID, cfgDataEdit, function () { $('#DataEditorContainer').hide(); });

                                $('#btnColsEditDone').click(function () {
                                    var valRes = E.validate();
                                    if (valRes && valRes.length > 0)
                                        return;
                                    var newDSD = { columns: E.getColumns() };
                                    E.updateDSD(uid, version, newDSD, null);

                                    $('#DSDEditorContainer').hide();
                                    $('#DataEditorContainer').show();
                                    $('#DataEditorContainer').css('visibility', '');


                                    DE.setDSD(newDSD, function () {
                                        if (csvData) DE.setData(csvData);
                                    });
                                });

                                //METADATA Editor end
                                document.body.addEventListener("fx.editor.finish", function (e) {
                                    console.log("EDITOR FINISH");

                                    //console.log(e.detail.data);
                                    uid = e.detail.data.uid;

                                    $('#metadataEditorContainer').hide();
                                    $('#DSDEditorContainer').show();
                                    $('#DSDEditorContainer').css('visibility', '');
                                }, false);

                                //Data editor end
                                $('#createDatasetEnd').on('click', function () {
                                    var newDSD = DE.getDSDWithDistincts();
                                    var data = DE.getData();

                                    DE.updateDSD(uid, version, newDSD, function () {
                                        DE.updateData(uid, version, data, null);
                                    });
                                })
                                //DEBUG
                                $('#debug_skipMeta').click(function () {
                                    $('#metadataEditorContainer').hide();
                                    $('#DSDEditorContainer').show();
                                    $('#DSDEditorContainer').css('visibility', '');
                                    uid = "dan";
                                });
                            });
                        });
                    });
                });
            }, 0);
        });
    });
});