define([
	"jquery",
    "require",
	"text!fenix-ui-topmenu/templates/blank.html"
	, "bootstrap"
	], function($, Require, template){
	
	'use strict';

	var defaultOptions = {
		container : 'body',
		url : 'fenix-ui-topmenu/config/default.json',
		$template : $(template),
		selectors : {
			brand : ".navbar-brand",
			ul : ".fx-ul",
			right : ".navbar-right"
		}, 
		lang : "EN",
		css : 'fenix-ui-topmenu/css/TopMenu.css'
	};

	function TP( o ){

		this.o = $.extend(true, defaultOptions, o);
		this.o.lang = this.o.lang.toUpperCase();
		
		if (this.o.conf) {
			this.render();
		} else {
			this.loadConfiguration();
		}
	}

	TP.prototype.loadConfiguration = function () {

		var self = this;

		$.getJSON( this.o.url , function ( data ) {
			self.o.conf = data;
			self.render	();
		}).error(function(){
			throw new Error('FENIX Top Menu: please specify a valid configuration file.')
		})
	};

	TP.prototype.render = function(){
		this.initVariables();
		this.importCss();
		this.$container.prepend(this.compileTemplate());
		this.selectCurrentItem();
		if (this.o.callback){
			this.o.callback();
		}
	};

	TP.prototype.initVariables = function () {	
		this.$ul = this.o.$template.find(this.o.selectors.ul);
		this.$brand = this.o.$template.find(this.o.selectors.brand);
		this.$right = this.o.$template.find(this.o.selectors.right);
		this.$container = $(this.o.container);
	};

	TP.prototype.importCss = function () {

		if ( this.o.css && this.o.css !== null ) {
			var link = document.createElement("link");
		    link.type = "text/css";
		    link.rel = "stylesheet";
		    link.href = Require.toUrl(this.o.css);
		    document.getElementsByTagName("head")[0].appendChild(link);
		}

		return false;
	};

	TP.prototype.compileTemplate = function () {
		this.renderBrand();
		this.renderItems( this.$ul );
		this.renderLeftItems();
		this.renderRightItems();
		this.renderLanguagePicker();
		return this.o.$template;
	};

	TP.prototype.renderItems = function ( $ul ) {

		var self = this;

		if (this.o.conf.items) {
			$(this.o.conf.items).each(function( index, item ) {
				if (item.type === 'dropdown'){
					self.renderDropdown( $ul, item );
				} else {
					self.renderItem( $ul, item );
				}
			});
		}
	};

	TP.prototype.renderItem = function ( $container, item ) { 

		var $li = $("<li></li>"),
            $a = $("<a href='" + ( item.target || '#') + "'>" + item.label[this.o.lang] + "</a>");

        this.addItemAttrs($li, item);

        $li.append($a);
        $container.append($li);
	};

	TP.prototype.renderDropdown = function ($ul, item ) {

		var self = this;

        var $li = $('<li class="dropdown"></li>'),
            $a = $('<a href="#" class="dropdown-toggle" data-toggle="dropdown">' + item.label[this.o.lang] + ' <b class="caret"></b></a>'),
            $children = $('<ul class="dropdown-menu"></ul>');

        $li.append($a).append($children);

        //Append dropdown children
        if (item.hasOwnProperty( 'children' ) && item['children' ] !== null ) {
            for (var i = 0; i < item['children' ].length; i++) {

            	if ( item['children'][i].type === 'divider') {
            		$children.append('<li class="divider"></li>');
            	} else {
            		self.renderItem($children, item['children'][i]);
            	}
            }
        }

        this.addItemAttrs($li, item);
        $ul.append($li)
	};

	TP.prototype.addItemAttrs = function ( $item, conf) {

		if (conf.hasOwnProperty('attrs')){
            var attrs = Object.keys(conf['attrs']);

            for (var i=0; i< attrs.length; i++){
                if ( conf['attrs'].hasOwnProperty(attrs[i]) ){
                    $item.attr(attrs[i], conf['attrs'][attrs[i]] );
                }
            }
        }

        return $item;
	};

	TP.prototype.renderBrand = function () {
		
		if (this.o.conf.brand) {
			this.$brand.attr('href', this.o.conf.brand.target || '#' );
            if (this.o.conf.brand.url)   {
                this.$brand.css('background-image', 'url(' + this.o.conf.brand.url + ')');
            }
		}

		return this.o.$template;
	};

	TP.prototype.renderLeftItems = function () {

		if (this.o.conf.left) {
		}

		return this.o.$template;
	};

	TP.prototype.renderRightItems = function () {

		if (this.o.conf.right) {
			this.renderItems(this.$right)
		}

		return this.o.$template;
	}; 

	TP.prototype.renderLanguagePicker = function ( ) {

		var $li = $('<li></li>'),
			$langPicker = $('<ul class="lang_picker"></ul>'),
			self = this;

		if (this.o.conf.languages) {
			$(this.o.conf.languages).each(function( index, lang ) {
				var $lang = $("<li></li>"),
            		$a = $("<a href='" + ( lang.target || '#') + "'>" + lang.label + "</a>");
            	$lang.prepend($a);
            	$langPicker.prepend($lang);
			});
		}

		this.$right.append($li.append($langPicker));
		return this.o.$template;
	};

	TP.prototype.selectCurrentItem = function () {

		if (this.o.conf) {
			this.o.$template.find('li[id="'+this.o.active+'"] ').addClass("active")
			.find("a").attr("href" , "#");
		} else {
			if (this.o.conf.active) {
				this.o.$template.find('li[id="'+this.o.conf.active+'"] ').addClass("active")
				.find("a").attr("href" , "#");
			}
		}

		return this.o.$template;
	}

	return TP;
});