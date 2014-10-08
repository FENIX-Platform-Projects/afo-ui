/*global define, window:false, document:false, History:false*/

define([
    'jquery',
    'smoothScroll',
    'modernizr',
    'jquery.history',
    'bootstrap'
], function ($, smoothScroll ) {

    'use strict';

    function SideMenuStructure() {

    }

    SideMenuStructure.prototype.options = {
        lang: 'EN',
        offset: 70,
        validate: false,
        css: {
            affix: "affix",
            menu: "bs-docs-sidebar",
            list: "nav bs-docs-sidenav",
            sublist : "nav",
            active: "active"
        },
        json: {
            id: "id",
            class: "className",
            page: "page",
            icon: "icon",
            label: 'label',
            children: "children",
            target: "target",
            callback: "callback",
            content: "content",
            frequency: "frequency",
            function: "function",
            active: "active"
        },
        interaction: {
            press: "click"
        },
        events: {
            FIRST_LEVEL_MENU_ITEM_SELECT: "FIRST_LEVEL_MENU_ITEM_SELECT",
            SECOND_LEVEL_MENU_ITEM_SELECT: "SECOND_LEVEL_MENU_ITEM_SELECT"
        },
        callback: {
            frequency: {
                always: 'always',
                once: "once"
            }
        },
        affix: {
            offset: {
                top: [],
                delta: 20
            }
        },
        scrollspy: {
            element: 'body'
        },
        scroll: {
            target: 'html body',
            durationFast: 200,
            durationSlow: 500,
            ease: "easeOutQuint"
        },
        url: {
            "page": "p",
            "section": "s"
        }
    };

    SideMenuStructure.prototype.callbacks = {};

    SideMenuStructure.prototype.validate = function () {

        return this;
    };

    SideMenuStructure.prototype.obj2querySting = function (obj) {

        var q = '?',
            k;

        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                q += k + '=' + obj[k] + '&';
            }
        }

        return q.substring(0, q.length - 1);
    };

    SideMenuStructure.prototype.initHistory = function () {

        var self = this;

        // Check Location
        if (document.location.protocol === 'file:') {
            window.alert('The HTML5 History API (and thus History.js) do not work on files, please upload it to a server.');
        }

        // Bind to State Change
        History.Adapter.bind(window, 'statechange', function () {

            if (self.manualStateChange === false) {
                self.configure(History.getState().data);
            }
            self.manualStateChange = false;

        });

        // Bind to Push State
        this.$menu.on(this.options.events.FIRST_LEVEL_MENU_ITEM_SELECT, function (e, page) {

            var data = {};
            data[self.options.url.page] = page;

            History.pushState(data, null, self.obj2querySting(data));
        });

        // Bind to Push State
        this.$menu.on(this.options.events.SECOND_LEVEL_MENU_ITEM_SELECT, function (e, target) {

            var State = History.getState(),
                data = {};
            data[self.options.url.page] = State.data[self.options.url.page];
            data[self.options.url.section] = target.substring(1, target.length);
            History.pushState(data, null, self.obj2querySting(data));
        });

        return this;
    };

    SideMenuStructure.prototype.selectItem = function ($item) {

        $item.siblings().removeClass(this.options.css.active);
        $item.addClass(this.options.css.active);

        return this;
    };

    SideMenuStructure.prototype.scrollTo = function (position, duration, callback) {

        smoothScroll.animateScroll(null, position, {
            speed: duration, // Integer. How fast to complete the scroll in milliseconds
            easing: this.options.scroll.ease, // Easing pattern to use
            updateURL: false, // Boolean. Whether or not to update the URL with the anchor hash on scroll
            offset: this.options.offset || 70, // Integer. How far to offset the scrolling anchor location in pixels
            callbackAfter: callback
        });
    };

    SideMenuStructure.prototype.addMenuItem = function ($parent, element) {

        var $li = $('<li></li>'),
            fields = this.options.json,
            label = 'undefined label',
            self = this;

        if (element.hasOwnProperty(fields.id)) {
            $li.attr("id", element[fields.id]);
        }

        if (element.hasOwnProperty(fields.class)) {
            $li.attr("class", element[fields.class]);
        }

        if (element.hasOwnProperty(fields.label) && element[fields.label] !== null) {
            if (element[fields.label].hasOwnProperty(this.options.lang.toUpperCase())) {
                label = element[fields.label][this.options.lang.toUpperCase()];
            } else {
                var keys = Object.keys(element[fields.label]);
                if (keys.length > 0) {
                    label = element[fields.label][keys[0].toUpperCase()];
                }
            }
        }

        //Anchor
        var $a = $('<a>' + label + '</a>');
        if (element.hasOwnProperty(fields.page)) {
            $a.attr("data-page", element.page).on(this.options.interaction.press, function (e) {
                e.preventDefault();
                self.currentSection = undefined;
                $li.trigger(self.options.events.FIRST_LEVEL_MENU_ITEM_SELECT, [ element.page ]);
            });
        } else {
            if (element.hasOwnProperty(fields.target)) {
                $a.attr("href", element.target).on(this.options.interaction.press, function (e) {
                    e.preventDefault();
                    $li.trigger(self.options.events.SECOND_LEVEL_MENU_ITEM_SELECT, [ element.target ]);
                });
            }
        }
        $li.append($a);
        // end anchor

        if (element.hasOwnProperty(fields.children) && element[fields.children].length > 0) {

            var $ul = $('<ul></ul>');
            $ul.addClass(this.options.css.sublist);


            $(element[fields.children]).each(function (index, element) {
                self.addMenuItem($ul, element);
            });

            $li.append($ul);
        }

        $parent.append($li);

        return this;
    };

    SideMenuStructure.prototype.applyAffix = function () {

        var self = this;

        this.$menu.affix(
            {
                offset: {
                    top: function () {

                        var o = 0;

                        if (typeof self.options.affix.offset.top === 'object') {
                            for (var i = 0; i < self.options.affix.offset.top.length; i++) {
                                if ($(self.options.affix.offset.top[i]).length > 0) {

                                    o += $(self.options.affix.offset.top[i]).outerHeight()

                                }
                            }
                        }

                        o -= self.options.affix.offset.delta;

                        return (this.top = o );
                    }
                }
            });

        return this;
    };

    SideMenuStructure.prototype.createMenu = function () {

        var $ul = $('<ul></ul>'),
            self = this;

        this.$menu.addClass(this.options.css.menu).addClass(this.options.css.affix);
        $ul.addClass(this.options.css.list);

        $(this.options.menu.items).each(function (index, element) {
            self.addMenuItem($ul, element);
        });

        this.$menu.append($ul);

        this.applyAffix();

        return this;
    };

    SideMenuStructure.prototype.invokeViewCallback = function (view) {

        var fields = this.options.json;

        if (view.hasOwnProperty(fields.callback) && view[fields.callback] !== null) {
            if (view[fields.callback].hasOwnProperty(fields.function)) {
                if (typeof  this.callbacks[view[fields.callback][fields.function]] === 'function') {
                    this.callbacks[view[fields.callback][fields.function]]();
                }
            }
            if (view[fields.callback].hasOwnProperty(fields.frequency)) {
                if (view[fields.callback][fields.frequency] === this.options.callback.frequency.once) {
                    view[fields.callback] = null;
                }
            }
        }

        return this;
    };

    SideMenuStructure.prototype.updateView = function (container, page, callback) {

        var $section = $(container).children('[data-section="' + page + '"]'),
            view = this.options.views[container][page],
            self = this;

        if (!$section.is(":visible")) {

            self.scrollTo("body", 0, function () {
                if ($section.length === 1) {

                    $(container).children().hide();
                    $section.fadeIn('fast');
                    self.invokeViewCallback(view);
                    if (typeof callback === 'function') {
                        callback();
                    }
                } else {

                    $.ajax({
                        url: view.content[self.options.lang],
                        success: function (data) {
                            $(container).append($('<section data-section="' + page + '">' + data + '</section>'));
                            $(container).children().hide();
                            $(container).children('[data-section="' + page + '"]').fadeIn('fast');
                            self.invokeViewCallback(view);
                            if (typeof callback === 'function') {
                                callback();
                            }
                        },
                        error : function(){
                           alert("Impossible to load content");
                        }
                    });
                }
            });

        } else {
            if (typeof callback === 'function') {
                callback();
            }
        }

        return this;
    };

    SideMenuStructure.prototype.configure = function (data) {

        var keys = Object.keys(this.options.views),
            self = this;

        for (var i = 0; i < keys.length; i++) {
            if (this.options.views[keys[i]].hasOwnProperty(data[this.options.url.page])) {

                this.updateView(keys[i], data[this.options.url.page], function () {

                    //highlight First level Menu item
                    self.selectItem(self.$menu.find('li > a[data-page="' + data[self.options.url.page] + '"]').parent());

                    if (data[self.options.url.section]) {

                        if ($("#" + data[self.options.url.section]).length !== 0){
                            self.scrollTo("#" + data[self.options.url.section], self.options.scroll.durationFast, function () {
                                //highlight Second level menu item
                                self.selectItem(self.$menu.find('li > a[href="#' + data[self.options.url.section] + '"]'));
                            });
                        }
                    }

                    self.applyScrollSpy();
                });
            }
        }

        return this;
    };

    SideMenuStructure.prototype.applyScrollSpy = function () {

        var self = this;

        if (this.scrollspyInitialized !== true) {

            $(this.options.scrollspy.element).on('activate.bs.scrollspy', function (e) {

                //Just for Second Level Menu item
                if ($(e.target).children("A[href]").length === 1) {
                    self.currentSection = $(e.target).children("A[href]").attr('href');
                }
            });

            window.addEventListener("scroll", function (evt) {

                var that = this,
                    $this = $(that);

                if ($this.data('scrollTimeout')) {
                    clearTimeout($this.data('scrollTimeout'));
                }
                $this.data('scrollTimeout', setTimeout(function () {

                    var State = History.getState(),
                        data = {},
                        href = self.currentSection;

                    data[self.options.url.page] = State.data[self.options.url.page];

                    if (href !== undefined){
                        data[self.options.url.section] = href.substring(1, href.length);
                    } 
                  
                    self.manualStateChange = true;
                    History.pushState(data, null, self.obj2querySting(data));
                    self.manualStateChange = false;

                }, 500, that));

            });

            $(this.options.scrollspy.element).scrollspy(
                { target: this.options.menu.container,
                    offset: this.options.offset });
            this.scrollspyInitialized = true;
        } else {
            $(this.options.scrollspy.element).scrollspy('refresh');
        }
    };

    SideMenuStructure.prototype.initPage = function () {

        var data = {},
            queryPage = getQueryVariable(this.options.url.page),
            querySection = getQueryVariable(this.options.url.section);

        if (queryPage !== undefined) {
            data[this.options.url.page] = queryPage;

            if (querySection !== undefined) {
                data[this.options.url.section] = querySection;
            }
        } else {
            //Fallback: first page available
            var views = Object.keys(this.options.views),
                p = Object.keys(this.options.views[views[0]]);
            data[this.options.url.page] = p[0];
        }

        History.replaceState(data, null, this.obj2querySting(data));

        this.configure(data);

        function getQueryVariable(variable) {

            var query = '';

            if (Modernizr.history === true) {
                query = window.location.search.substring(1);
            } else {
                if (window.location.search.substring(1) === undefined) {
                    query = window.location.hash;
                    if (query.length > 1) {
                        query = query.substring(2);
                    }
                } else {
                    query = window.location.search.substring(1);
                }
            }

            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) == variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
        }
    };

    SideMenuStructure.prototype.initialize = function (options, callbacks) {

        $.extend(true, this.options, options);

        if (typeof callbacks === 'object') {
            this.callbacks = callbacks;
        }

        if (this.options.validate) {
            this.validate();
        }

        this.$menu = $(this.options.menu.container);

        this.initHistory();

        this.createMenu();

        this.initPage();

        return this;
    };

    return SideMenuStructure;

});