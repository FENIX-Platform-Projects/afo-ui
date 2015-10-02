define(['jquery',
    'underscore',
    'handlebars',
    'jstree',
    'text!html/fxTreeNutrient.html'
], function ($, _, Handlebars, jstree, fxTreeHTML) {

    'use strict';

    var defConfig = {
        showTxtValRadio: false,
        showValueInTextMode: false,
        showTextInValueMode: false,
        labelTxt: 'Name',
        labelVal: 'Code',
        labelNutrient: 'Nutr...',
        textPlaceholder: 'Search...',
        textSelAll: 'All',
        textUnselAll: 'None',
        multiple: true,
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
        radiosContainer: '.fxTreeRadios',
        search: '.fxTreeSearch',
        selAll: '.fxTreeSelAll',
        unselAll: '.fxTreeUnselAll',
        sortNutrients: '.fxTreeSortNutrients'
    };

    var _modeTxtVal = { text: 'text', value: 'val', nutrient: 'nutrient' };

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
        this.sortedBy = { field: '', inv: false };

        //templating
        var ht = treeTmpl({
            jsTreeId: compIDs.jsTreeId + id,
            rTxtId: compIDs.rTxtId + id,
            rValId: compIDs.rValId + id,
            rNutrientId: compIDs.rNutrientId + id,
            rGroupName: compIDs.rGroupName + id,
            rModeText: _modeTxtVal.text,
            rModeVal: _modeTxtVal.value,
            rModeNutrient: _modeTxtVal.nutrient,
            rTxtLabel: this.config.labelTxt,
            rValLabel: this.config.labelVal,
            rNutrientLabel: this.config.labelNutrient,
            textPlaceholder: this.config.textPlaceholder,
            textSelAll: this.config.textSelAll,
            textUnselAll: this.config.textUnselAll,
            multiple: this.config.multiple
        });
        this.$cnt.html(ht);

        this.$searchBox = this.$cnt.find(htmlIDs.search);
        this.$chkTxt = this.$cnt.find('#' + compIDs.rTxtId + id);
        this.$chkVal = this.$cnt.find('#' + compIDs.rValId + id);
        this.$chkNutrient = this.$cnt.find('#' + compIDs.rNutrientId + id);
        this.$t = this.$cnt.find('#' + compIDs.jsTreeId + id);
        this.$SelAll = this.$cnt.find(htmlIDs.selAll);
        this.$UnselAll = this.$cnt.find(htmlIDs.unselAll);
        this.$sortNutrients = this.$cnt.find(htmlIDs.sortNutrients);

        this.tree = this.$t.jstree({
            core: {
                themes: { icons: false }
            },
            plugins: ['search', 'wholerow', this.config.multiple ? 'checkbox' : ''],
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

    fxTree.prototype.setFirst = function (first) {

        /*        var first = {id:'3102100000', text:'Urea'},
                    tree =_.map(data, function(d) {
                        return { id: d[0], text: d[1] };
                    }); */
        var tree = this.data;

        tree = _.without(tree, _.findWhere(tree, first));
        tree = _.union([first], tree);

        this.setData(tree);
        return this;
    };

    fxTree.prototype.getSelection = function (arg) {
        return this.$t.jstree(true).get_selected(arg);
    };

    fxTree.prototype.selectFirst = function () {
        this.$t.jstree(true).select_node('ul > li:first');
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
        if (mode != _modeTxtVal.text && mode != _modeTxtVal.value && mode != _modeTxtVal.nutrient)
            mode = _modeTxtVal.text;

        if (mode == _modeTxtVal.text)
            this.$chkTxt.prop('checked', true);
        else if (mode == _modeTxtVal.value)
            this.$chkVal.prop('checked', true);
        else if (mode == _modeTxtVal.nutrient)
            this.$chkNutrient.prop('checked', true);

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
        else if (mode == _modeTxtVal.value) {
            toRet.text = node.id;
            if (cfg.showTextInValueMode)
                toRet.text += '<span class="fxTreeAddInfo"> (' + node.text + ')</span>';
        }
        else {
            toRet.text = '<span class="fxTreeCell"> ' + (node.n||'-') + '</span>'+
                         '<span class="fxTreeCell"> ' + (node.p||'-') + '</span>'+
                         '<span class="fxTreeCell"> ' + (node.k||'-') + '</span>';

            toRet.text += ' <span class="fxTreeAddInfo">' + node.text + '</span>';
        }
        return toRet;
    };

    fxTree.prototype._bindEvents = function () {
        var me = this;
        var to = false;

        this.$chkTxt.on('change', function (e) {
            me._changeTxtValMode();
            me._updateTreeData();
            me._changeSearchMode('');
        });
        this.$chkVal.on('change', function (e) {
            me._changeTxtValMode();
            me._updateTreeData();
            me._changeSearchMode('');
        });
        this.$chkNutrient.on('change', function (e) {
            me._changeTxtValMode();
            me._updateTreeData();
            me._changeSearchMode('nutrient');
        });

        this.$sortNutrients.on('click','.fxTreeBtn', function(e) {
            var val = $(this).data('value'),
                inv = me._sortByNutrient( val );

            $(this).siblings('.fxTreeBtn').each(function() {
                $(this).find('i').attr('class','');
            });
            
            $(this).find('i').attr('class',inv?'glyphicon glyphicon-arrow-down':'glyphicon glyphicon-arrow-up');

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

        this.$t.on('changed.jstree', function (e, data) {
            e.preventDefault();
            me.config.onChange(data.selected, data);
        })
        .on('open_node.jstree', function (e, node) {
            e.preventDefault();
            me.config.onExpand(node);
        });

        this.$SelAll.on('click', function (e) {
            e.preventDefault();
            me.$t.jstree(true).check_all();
        });
        this.$UnselAll.on('click', function (e) {
            e.preventDefault();
            me.$t.jstree(true).uncheck_all();
        });

    };

    fxTree.prototype._changeSearchMode = function (mode) {
        if (mode == 'nutrient') {
            this.$cnt.find('#fxTreeFind').hide();
            this.$cnt.find('#fxTreeFindBtns').hide();
            this.$sortNutrients.show();
        }
        else {
            this.$cnt.find('#fxTreeFind').show();
            this.$cnt.find('#fxTreeFindBtns').show();
            this.$sortNutrients.hide();
        }
    };

    fxTree.prototype._changeTxtValMode = function () {
        this.sortedBy.field = "";
        this.sortedBy.inv = false;

        this.txtValMode = _modeTxtVal.text;
        if (this.$chkVal.is(':checked'))
            this.txtValMode = _modeTxtVal.value;
        else if (this.$chkNutrient.is(':checked'))
            this.txtValMode = _modeTxtVal.nutrient;
    };

    fxTree.prototype._sortByNutrient = function (n) {
        this.sortedBy.inv = !this.sortedBy.inv;
        if (!this.data)
            return;
        if (this.sortedBy.field == n) {
            this.data.reverse();
        }
        else {
            this._sortByNutrient_node(this.data, n, this.sortedBy.inv);
        }
        this.sortedBy.field = n;
        this._updateTreeData();

        return this.sortedBy.inv;
    };

    fxTree.prototype.naturalSort = function (ar, index) {
        var L= ar.length, i, who, next, 
            isi= typeof index== 'number', 
            rx=  /(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.(\D+|$))/g;
        function nSort(aa, bb){
            var a= aa[0], b= bb[0], a1, b1, i= 0, n, L= a.length;
            while(i<L){
                if(!b[i]) return 1;
                a1= a[i];
                b1= b[i++];
                if(a1!== b1){
                    n= a1-b1;
                    if(!isNaN(n)) return n;
                    return a1>b1? 1: -1;
                }
            }
            return b[i]!= undefined? -1: 0;
        }
        for(i= 0; i<L; i++){
            who= ar[i];
            next= isi? ar[i][index] || '': who;
            ar[i]= [String(next).toLowerCase().match(rx), who];
        }
        ar.sort(nSort);
        for(i= 0; i<L; i++){
            ar[i]= ar[i][1];
        }
    };
    
    fxTree.prototype._sortByNutrient_node = function (arr, n, inverse) {
        if (!arr)
            return;
        if (arr.children)
            this._sortByNutrient_node(arr.children, n);

        if(typeof arr[0] === 'string')
            this.naturalSort(arr);
        else
            arr.sort(function (a, b) {
                if (!b[n])
                    return 1;
                if (!a[n])
                    return -1;
                if (a[n] > b[n])
                    return 1;
                if (a[n] < b[n])
                    return -1;
                return 0;
            });
    };


    fxTree.prototype._unbindEvents = function () {
        this.$searchBox.off('keyup');
        this.$chkTxt.off('change');
        this.$chkVal.off('change');
        this.$chkNutrient.off('change');
        this.$t.off('changed.jstree');
        this.$t.off('open_node.jstree');
        this.$sortNutrients.off('click','.fxTreeBtn');
    };
    fxTree.prototype.destroy = function () {
        this._unbindEvents();
        this.$t.jstree(true).destroy();
    };

    return fxTree;
});