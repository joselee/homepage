window.Conmio = window.Conmio || {};

if (typeof(jQuery) != "undefined") {
    (function($) {
        $.fn.scroll = function() {
            this.each(function(index, element) {
                new window.Conmio.SwipeablePagination({
                    yAxis: true,
                    xAxis: false,
                    elements: [ element ],
                    container: element.parentNode,
                    distance: 15
                });
            });
            return this;
        };

        $.fn.page = function(options) {
            if (!options || !options.noStyling) {
                this.css("overflow", "hidden").css("position", "relative");
                this.children()
                    .css("width", "100%")
                    .css("position", "absolute")
                    .css("left", function(index, value) {
                        return (index * 100) + "%";
                    });
            }
            new window.Conmio.SwipeablePagination({
                yAxis: false,
                xAxis: true,
                elements: this.children().get(),
                container: this.get(),
                distance: 10,
                kinetic: false,
                revert: true
            });
            if (options && options.scrollable) {
                this.children().scroll();
            }
            return this;
        };
    })(jQuery);
}

window.Conmio.CallbackStringify = function(func) {
    // generate a random fun (haha) name for our callback
    var funName
    do {
        funName = "_callback" + Math.floor(Math.random() * 10000);
    } while (typeof window[funName] != 'undefined')
    window[funName] = func;
    return "window." + funName;
}

window.Conmio.SwipeablePagination = function(options) {
    this.xAxis = true;
    this.yAxis = true;
    this.elements = [];
    this.kinetic = true;
    this.coordinates = null;
    this.viewport = null;
    this.currentPage = 0;
    this.distance = 0;
    this.isMoving = false;
    this.revert = false;
    // this represents the kinetic energy. How many pixels / sec will the scroll decelerate in one second
    this.elasticity = 1.5;
    this.pageChangeThreshold = 0.1;

    this.canMove = function() {
        return true;
    };
    this.onpagechange = function() {};
    this.getCurrentTranslation = function(element) {
        if (typeof WebKitCSSMatrix != 'undefined') {
            var matrix = new WebKitCSSMatrix(window.getComputedStyle(element).webkitTransform);
            if (matrix) {
                return {
                    x: matrix.e,
                    y: matrix.f
                }
            }
        }
    };
    this.onstop = function(element) {
        var width = $(element).width();
        var translation = this.getCurrentTranslation(element);


        if (this.xAxis) {
            if (translation.x > width * this.pageChangeThreshold) {
                this.scrollToPage(this.currentPage - 1);
                return;
            } else if (translation.x < -(width * this.pageChangeThreshold)) {
                this.scrollToPage(this.currentPage + 1);
                return;
            }
        }

        if (!this.kinetic || !this.yAxis) {
            this.revertIfNeeded(this.getCurrentTranslation(element));
            return;
        }
        // not past boundaries, time for kinetics!
        var speed = this.calculateSpeed(this.coordinates.timeStamps);
        var targetYTranslation = Math.round(translation.y + speed.y);
        var self = this;
        var element = this.currentElement();
        var pastBoundaries = this.wouldBePastBoundaries(element, { y: targetYTranslation });
        if (pastBoundaries) {
            // scale back a bit to allow for revert to kick in
            if (targetYTranslation > 0) {
                targetYTranslation = 10;
            } else {
                targetYTranslation = 0 - element.clientHeight + this.viewport.offsetHeight - 10;
            }
        }

        // iOS always stops in 1.5secs, no matter what the translation, _except_ if we're already past the boundaries...
        var time = this.elasticity;

        if (pastBoundaries && this.wouldBePastBoundaries(element, { y: translation.y })) {
            time = 0.2;
        } else if (this.wouldBePastBoundaries(element, { y: targetYTranslation })) {
            // ...or then there's a corner case that we _would_ go past the edges, in which case we need to zip there really quickly and then have the browser revert
            time = Math.abs((translation.y - targetYTranslation) / speed.y).toPrecision(1);
        }

        $(element)
            .css("-webkit-transition", "all "+time+"s ease-out")
            .css("-webkit-transform", "translate3d(0px,"+targetYTranslation+"px,0px)")
            .one("webkitTransitionEnd", function(e) {
                self.revertIfNeeded(self.getCurrentTranslation(element));
            });

    };
    this.wouldBePastBoundaries = function(element, translation) {
        return (translation.y > 0) ||
            (translation.y < 0 - element.clientHeight + this.viewport.offsetHeight);
    };
    this.revertIfNeeded = function(translation) {
        if (this.yAxis) {
            if (translation.y > 0) {
                this.reset(false);
            } else if (translation.y < 0 - this.elements[this.currentPage].clientHeight + this.viewport.offsetHeight) {
                this.reset(false);
            }
        }

        if (this.revert) {
            this.reset(false);
        }
    };
    this.calculateSpeed = function(timestamps) {
        if (timestamps.length > 1) {
            var last = timestamps.pop();
            var deltas = {
                time: (last.time - timestamps[0].time) / 1000,
                x: last.x - timestamps[0].x,
                y: last.y - timestamps[0].y

            };
            var speeds = {
                y: (deltas.y / deltas.time),
                x: (deltas.x / deltas.time)
            }
            return speeds;
        } else {
            return {x: 0, y: 0};
        }
    };
    this.initialize = function(options) {
        for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
                this[prop] = options[prop];
            }
        }
        if (!this.viewport) {
            this.viewport = options.container;
        }

        $(this.elements).css("-webkit-transform-style", "preserve-3d");

        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (typeof(this[prop]) == "function") {
                    this[prop] = $.proxy(this[prop], this);
                }
            }
        }

        this.enable();
    };
    this.moveStop = function(e) {
        $(this.container).unbind("touchmove", this.moving);
        $(this.container).unbind("mousemove", this.moving);
        $(document).unbind("touchend", this.moveStop);
        $(document).unbind("mouseup", this.moveStop);

        if (this.isMoving) {
            this.onstop(this.elements[this.currentPage]);
        }
    };
    this.moveStart = function(e) {
        this.coordinates = null;
        this.isMoving = false;

        $(this.elements)
            .css("-webkit-transition", "all 0s ease-out")
            .css("-webkit-user-select", "none");
        $(this.container).bind("touchmove", this.moving);
        $(this.container).bind("mousemove", this.moving);
        $(document).bind("touchend", this.moveStop);
        $(document).bind("mouseup", this.moveStop);
    };
    this.moving = function(e) {
        if (!this.canMove()) {
            return;
        }
        // we're actually interested only in the original event
        var event = e.originalEvent;
        var coords = (event.touches ? event.touches[0] : event);
        if (!this.coordinates) {
            this.coordinates = {
                startX: coords.pageX,
                startY: coords.pageY,
                deltaX: 0,
                deltaY: 0,
                previousX: coords.pageX,
                previousY: coords.pageY,
                timeStamps: []
            }
        }

        if (this.coordinates.timeStamps.length > 4) {
            this.coordinates.timeStamps = this.coordinates.timeStamps.slice(1);
        }
        this.coordinates.timeStamps.push({
            x: coords.pageX,
            y: coords.pageY,
            time: new Date().getTime()
        });

        this.coordinates.deltaXFromStart = (coords.pageX - this.coordinates.startX);
        this.coordinates.deltaYFromStart = (coords.pageY - this.coordinates.startY);

        this.coordinates.deltaX = (coords.pageX - this.coordinates.previousX);
        this.coordinates.deltaY = (coords.pageY - this.coordinates.previousY);

        if (this.isMoving ||
            (this.xAxis && Math.abs(this.coordinates.deltaXFromStart) > this.distance) ||
            (this.yAxis && Math.abs(this.coordinates.deltaYFromStart) > this.distance)) {

            this.isMoving = true;

            this.moveElements(this.coordinates);
        }
        this.coordinates.previousX = coords.pageX;
        this.coordinates.previousY = coords.pageY;
        return false;
    };
    this.reset = function(instant) {
        // reset everything else to normal positions, except current page to "leading edge"
        var translation = this.getCurrentTranslation(this.elements[this.currentPage]);

        var self = this;
        $(this.elements)
            .css("-webkit-transition", (instant ? "" : "-webkit-transform 0.3s ease-out"))
            .one("webkitTransitionEnd", function(e) {
                $(e.target).css("-webkit-transition", "");
            })
        .each(function(index, element) {
            var $element = $(element);
            if (index == self.currentPage && self.yAxis) {
                var translation = self.getCurrentTranslation(element);
                var minYTrans = self.viewport.offsetHeight - element.clientHeight;
                if (translation.y > 0) {
                    $element.css("-webkit-transform", "translate3d(0px,0px,0px)");
                } else if (translation.y < minYTrans) {
                    $element.css("-webkit-transform", "translate3d(0px,"+minYTrans+"px,0px)");
                }
            } else {
                $element.css("-webkit-transform", "translate3d(0px,0px,0px)");
            }
        });


    };
    this.currentElement = function() {
        return this.elements[this.currentPage];
    };
    this.firstElement = function() {
        return this.elements[0];
    };
    this.lastElement = function() {
        return this.elements[this.elements.length - 1];
    };
    this.moveElements = function(coordinates) {
        var coords = this.coordinates;

        var resist_factor_x = 1;
        var resist_factor_y = 1;

        var movableElements = [ this.elements[this.currentPage] ];
        if (this.currentPage > 0) {
            movableElements.push(this.elements[this.currentPage - 1]);
        }
        if (this.currentPage < this.numPages() - 1) {
            movableElements.push(this.elements[this.currentPage + 1]);
        }

        if (this.xAxis) {
            if (this.currentPage == 0 && this.getCurrentTranslation(this.firstElement()).x > 0) {
                // we can save cycles by moving just the first element
                movableElements = [ this.firstElement() ];
                resist_factor_x = 10;
            } else if (this.currentPage >= this.numPages() - 1 && this.getCurrentTranslation(this.lastElement()).x < 0) {
                // we can save cycles by moving just the first element
                movableElements = [ this.lastElement() ];
                resist_factor_x = 10;
            }
        }

        var translate = "translate3d(";
        var currentTranslation = this.getCurrentTranslation(movableElements[0]);
        var desiredXTranslation = (currentTranslation.x + (coords.deltaX / resist_factor_x));
        translate += (this.xAxis ? desiredXTranslation+"px," : "0px,");
        translate += (this.yAxis ? (currentTranslation.y + (coords.deltaY / resist_factor_y))+"px,0px)" : "0px,0px)");

        var self = this;
        $(movableElements).css("-webkit-transform", translate);
    };
    this.createBindingCallbackFor = function(event, release, fn) {
        var self = this;
        return function(e) {
            $(self.container)[release ? "unbind" : "bind"](event, fn);
            if (!release) {
                self.coordinates = null;
                self.isMoving = false;
            } else {
                if (self.isMoving) {
                    self.onstop(e.currentTarget);
                }
            }
        }
    };
    this.establishPagePositionsAfterAnimation = function(page, options) {
        var self = this;
        this.currentPage = page;

        $(this.elements).each(function(index, element) {
            $(element)
                .css("-webkit-transition", "all 0s linear")
                .css("-webkit-transform", "translate3d(0px,0px,0px)")
                .css("left", (-(self.currentPage - index) * 100) + "%");
        });
        if (!options || !options.silent) {
            this.onpagechange(page);
        }
    };
    this.numPages = function() {
        return this.elements.length;
    };
    this.scrollToPage = function(page, options) {
        if (page < 0 || page >= this.numPages()) {
            this.reset(false);
            return;
        }

        // reset -webkit-transform if we don't yet have it
        // (this gets around bug of calling scrollToPage() before any swipes)
        var elements = $(this.elements);
        if (!elements.css("-webkit-transform")) {
            elements.css("-webkit-transform", "translate3d(0px,0px,0px)")
        }
        if (options && options.instant) {
            this.establishPagePositionsAfterAnimation(page, options);
        } else {
            var completedTransitions = [];
            var distance = page - this.currentPage;

            var self = this;
            $(this.elements).each(function(index, element) {
                $(element)
                    .css("-webkit-transition", "all 0.3s ease-out")
                    .css("-webkit-transform", "translate3d("+(-distance * $(element).width())+"px,0px,0px)")
                    .one("webkitTransitionEnd", function(e) {
                        // only fire the callbacks once all elements have completed transition
                        completedTransitions.push(e);
                        if (completedTransitions.length == self.elements.length) {
                            self.establishPagePositionsAfterAnimation(page, options);
                        }
                    });
            });

        }
    };
    this.disable = function() {
        $(this.container).unbind("touchstart", this.moveStart);
        $(this.container).unbind("mousedown", this.moveStart);
        $("body").unbind("DOMNodeRemoved", this.maybeRemovedFromDom);
    };
    this.enable = function() {
        $(this.container).bind("touchstart", this.moveStart);
        $(this.container).bind("mousedown", this.moveStart);

        $("body").bind("DOMNodeRemoved", this.maybeRemovedFromDom);
    };
    this.maybeRemovedFromDom = function(e) {
        if (e.target == this.container) {
            this.disable();
        }
    }

    this.initialize(options);
};

(function() {

    this.Conmio = this.Conmio || {};

    this.Conmio.ViewManager = function(options) {
        this.el = options.el;
        _.bindAll(this);
        this.viewStack = [];
        this.views = [];
    };

    _.extend(this.Conmio.ViewManager.prototype, {
        el: null,
        viewStack: [],
        hideCurrent: function() {
            if (this.viewStack.length > 0) {
                _.last(this.viewStack).trigger("detach").el.detach();
            }
        },
        detachAll: function() {
            while (this.viewStack.length > 0) {
                this.viewStack.pop().trigger("detach").el.detach();
            }
        },
        show: function(view) {
            if (this.viewStack.length == 1 && this.viewStack[0] == view) {
                return this;
            }
            this.detachAll();
            this.viewStack.push(view);

            return this._show(view);
        },
        _show: function(view) {
            this.el.append(view.el);
            view.trigger("attach");

            return this;
        },
        push: function(view) {
            if (view == _.last(this.viewStack)) {
                return this;
            }
            this.hideCurrent();

            this.el.append(view.el);
            view.trigger("attach");

            this.viewStack.push(view);
            return this;
        },
        pop: function() {
            var current = _.last(this.viewStack);
            if (current) {
                this.hideCurrent();
            }

            this.viewStack.pop();

            var nextup = _.last(this.viewStack);
            if (nextup) {
                this._show(nextup);
            }
        }
    });
})();