(function ($) {


    if (Object.defineProperties) {
        var

        set = function (obj, prop, val) {
            if (val !== undefined) {
                Object.defineProperty(obj, prop, {
                    value: val
                });
            }
            return val;
        },

        special = {
            pageX: function (original) {
                if (!original) {
                    return;
                }

                var eventDoc = this.target.ownerDocument || document;
                doc = eventDoc.documentElement;
                body = eventDoc.body;
                return original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            },
            pageY: function (original) {
                if (!original) {
                    return;
                }

                var eventDoc = this.target.ownerDocument || document;
                doc = eventDoc.documentElement;
                body = eventDoc.body;
                return original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            },
            relatedTarget: function (original) {
                if (!original) {
                    return;
                }

                return original.fromElement === this.target ? original.toElement : original.fromElement;
            },
            metaKey: function (originalEvent) {
                if (!originalEvent) {
                    return;
                }
                return originalEvent.ctrlKey;
            },
            which: function (original) {
                if (!original) {
                    return;
                }

                return original.charCode != null ? original.charCode : original.keyCode;
            }
        };


        $.each($.event.keyHooks.props.concat($.event.mouseHooks.props).concat($.event.props), function (i, prop) {
            if (prop !== "target") {
                (function () {
                    Object.defineProperty($.Event.prototype, prop, {
                        get: function () {



                            var originalValue = this.originalEvent && this.originalEvent[prop];



                            return this['_' + prop] !== undefined ? this['_' + prop] : set(this, prop,




                            special[prop] && originalValue === undefined ?



                                special[prop].call(this, this.originalEvent) :



                            originalValue)
                        },
                        set: function (newValue) {




                            this['_' + prop] = newValue;
                        }
                    });
                })();
            }
        });

        $.event.fix = function (event) {
            if (event[$.expando]) {
                return event;
            }


            var originalEvent = event,
                event = $.Event(originalEvent);
            event.target = originalEvent.target;




            if (!event.target) {
                event.target = originalEvent.srcElement || document;
            }



            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }

            return event;
        }
    }

    return $;
})(jQuery);

