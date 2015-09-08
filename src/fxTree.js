define(['jquery',
    'underscore',
    'handlebars',
    'jstree',
    'text!html/fxTree.html'
], function ($, _, Handlebars, jstree, fxTreeHTML) {

    'use strict';

    var defConfig = {
        showTxtValRadio: false,
        showValueInTextMode: false,
        showTextInValueMode: false,
        labelTxt: 'Name',
        labelVal: 'Code',
        textPlaceholder: 'Search...',
        onChange: $.noop,
        onExpand: $.noop
    };

    var compIDs = {
        rTxtId: 'fxt_rTxt_',
        rValId: 'fxt_rVal_',
        rGroupName: 'fxt_rg_',
        jsTreeId: 'fxt_jst_'
    };

    var htmlIDs = {
        radiosContainer: '#fxTreeRadios',
        search: '#fxTreeSearch'
    };

    var _modeTxtVal = { text: 'text', value: 'val' };

    var treeTmpl = Handlebars.compile(fxTreeHTML);


    function fxTree(cnt, cfg) {
        if (!cnt)
            throw new Error('Container must be defined');
        
        var id = _.uniqueId();

        this.config = {};
        $.extend(true, this.config, defConfig, cfg);

        this.$cnt = (cnt instanceof $) ? cnt : $(cnt);
        this.$searchBox;
        this.$t;
        this.$chkTxt;
        this.$chkVal;
        this.tree;
        this.data;
        this.txtValMode = _modeTxtVal.text;

        //templating
        var ht = treeTmpl({
            jsTreeId: compIDs.jsTreeId + id,            
            rTxtId: compIDs.rTxtId + id,
            rValId: compIDs.rValId + id,
            rGroupName: compIDs.rGroupName + id,
            rModeText: _modeTxtVal.text,
            rModeVal: _modeTxtVal.value,
            rTxtLabel: this.config.labelTxt,
            rValLabel: this.config.labelVal,
            textPlaceholder: this.config.textPlaceholder
        });
        this.$cnt.html(ht);

        this.$searchBox = this.$cnt.find(htmlIDs.search);
        this.$chkTxt = this.$cnt.find('#' + compIDs.rTxtId + id);
        this.$chkVal = this.$cnt.find('#' + compIDs.rValId + id);
        this.$t = this.$cnt.find('#' + compIDs.jsTreeId + id);

        this.tree = this.$t.jstree({
            core: {
                themes: { icons: false }
            },
            plugins: ['search', 'wholerow', 'checkbox'],
            search: {
                show_only_matches: true
            }
        });

        if (!this.config.showTxtValRadio)
            this.showTxtValSelection(false);
        this._bindEvents();
    };

    fxTree.prototype.setData = function (data) {
        this.data = data;
        this._updateTreeData();
        return this;
    };

    fxTree.prototype.showTxtValSelection = function (show) {
        if (show)
            this.$cnt.find(htmlIDs.radiosContainer).show();
        else
            this.$cnt.find(htmlIDs.radiosContainer).hide();
        return this;
    };
    fxTree.prototype.setTxtValMode = function (mode) {
        if (mode != _modeTxtVal.text && mode != _modeTxtVal.value)
            throw new Error('Mode can be ' + _modeTxtVal.text + ' or ' + _modeTxtVal.value);
        if (mode == _modeTxtVal.text)
            this.$chkTxt.prop('checked', true);
        else
            this.$chkVal.prop('checked', true);
        this.txtValMode = mode;
        this._updateTreeData();
        return this;
    };
    fxTree.prototype.showValueInTextMode = function (show) {
        this.config.showValueInTextMode = show;
        this._updateTreeData();
        return this;
    };
    fxTree.prototype.showTextInValueMode = function (show) {
        this.config.showTextInValueMode = show;
        this._updateTreeData();
        return this;
    };

    fxTree.prototype._updateTreeData = function () {
        var d = [];
        transformBranch(d, this.data, this.txtValMode, this.config);
        this.$t.jstree(true).settings.core.data = d;
        this.$t.jstree(true).refresh();
    };

    function transformBranch(parent, branch, mode, cfg) {
        if (!branch)
            return;
        if (branch.length == 0)
            return;
        if (!parent)
            parent = [];

        for (var i = 0; i < branch.length; i++) {
            var toAdd = transformNode(branch[i], mode, cfg);
            if (branch[i].children) {
                toAdd.children = [];
                transformBranch(toAdd.children, branch[i].children, mode, cfg);
            }
            parent.push(toAdd);
        }
    };

    function transformNode(node, mode, cfg) {
        var toRet = {
            id: node.id
        };

        if (mode == _modeTxtVal.text) {
            toRet.text = node.text
            if (cfg.showValueInTextMode)
                toRet.text += '<span class="fxTreeAddInfo"> (' + node.id + ')</span>';
        }
        else {
            toRet.text = node.id;
            if (cfg.showTextInValueMode)
                toRet.text += '<small class="fxTreeAddInfo"> (' + node.text + ')</span>';
        }
        return toRet;
    };

    fxTree.prototype._bindEvents = function () {
        var me = this;
        var to = false;

        this.$chkTxt.on('change', function (e) {
            me._changeTxtValMode();
            me._updateTreeData();
        });
        this.$chkVal.on('change', function (e) {
            me._changeTxtValMode();
            me._updateTreeData();
        });

        this.$searchBox.on('keyup', function (e) {
            if (to) {
                clearTimeout(to);
            }
            to = setTimeout(function () {
                var v = $(e.target).val();
                me.$t.jstree(true).search(v);
            }, 250);
        });

        this.$t
        .on('changed.jstree', function (e, data) {
            e.preventDefault();
            me.config.onChange(data);
        })
        .on('open_node.jstree', function(e, data) {
            e.preventDefault();
            me.config.onExpand(data);
        })
    };

    fxTree.prototype._changeTxtValMode = function () {
        this.txtValMode = _modeTxtVal.text;
        if (this.$chkVal.is(':checked')) this.txtValMode = _modeTxtVal.value;
    };

    fxTree.prototype._unbindEvents = function () {
        this.$searchBox.off('keyup');
        this.$chkTxt.off('change');
        this.$chkVal.off('change');
        this.$t.off('changed.jstree');
        this.$t.off('open_node.jstree');
    };
    fxTree.prototype.destroy = function () {
        this._unbindEvents();
        this.$t.jstree(true).destroy();
    };

    return fxTree;
});