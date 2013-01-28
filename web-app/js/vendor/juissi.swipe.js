(function() {

    // set up a namespace for Conmio
    window.Conmio = window.Conmio || {};

    // declare a jQuery plugin if jQuery is available
    if (typeof(jQuery) != "undefined") {
        (function($) {
            // set up the jQuery .scroll() extension
            $.fn.scroll = function(options) {

                // loop through each selected elements
                this.each(function(index, element) {

                    // set up a scroll for each element

                    var scroll = new window.Conmio.SwipeablePagination({
                        yAxis: !(options && options.horizontal),
                        xAxis: (options && options.horizontal),
                        elements: [ element ],
                        viewport: (options && options.viewport) ||element.parentNode,
                        eventTarget: element,
                        distance: 15
                    });

                    // store the scroll object inside the element as jQuery data
                    $(element).data("scroll", scroll);
                });

                // enable jQuery chaining
                return this;
            };
			
			// ribbon plugin
			$.fn.ribbon = function(options)
			{
				
				this.each(function(index, element)
				{
					// Creating new instance of step pagination object
					var ribbon = new window.Conmio.Ribbon($(element), options);
					$(element).data("ribbon", ribbon);
					
				});
			}
			

            // do the same for .page()
            $.fn.page = function(options) {
                
				
				if (arguments.length > 1) {
                    // If the first argument is "append", we add a new page to the page list
                    if (arguments[0] == "append") {
                        var paging = this.data("page");
                        paging.elements.push(arguments[1].get()[0]);
						
                        this.append(arguments[1].get()[0]);
                        paging.resetOffsets();
                    // If the first argument is "remove", we remove the selected page from the page list
                    }
					else if ( arguments[0] == "prepend" ){
						var paging = this.data("page");
                        paging.elements.unshift(arguments[1].get()[0]);
                        this.append(arguments[1].get()[0]);
						
                        paging.resetOffsets();
					}
					 else if (arguments[0] == "remove") {
                        var paging = this.data("page");
                        $(paging.elements.splice(arguments[1], 1)).remove();
                        paging.resetOffsets();
                    };

                    return this;
                }
                if (!options || !options.noStyling) {
                    var startFrom = (options && options.hasOwnProperty("start") ? options.start : 0);
                    this.css("overflow", "hidden").css("position", "relative");
                    this.children()
                        .css("width", "100%")
                        .css("position", function(index, value) {
                            return (index == startFrom ? "static" : "absolute")
                        })
                        .css("left", function(index, value) {
                            return ((index - startFrom) * 100) + "%";
                        })
                        .css("top", function(index, value) {
                            return (index == startFrom ? "" : "0%");
                        });
                };
                var elements = this.children();

                // ...and finally set up a swipe object.
                var paging = new window.Conmio.SwipeablePagination({
                    yAxis: false,
                    xAxis: true,
                    // ...which will contain all the child elements of the currently .page():able element.
                    elements: elements.get(),
                    container: this.get()[0],
                    distance: 10,
                    kinetic: false,
                    revert: true
                });
                // If we've set up options.scrollable = true, make all the child elements scrollable.
                if (options && options.scrollable) {
                    elements.scroll();
					paging.scrollable = options.scrollable;
                };
				
				
				paging.container = this;
                // ...and finally we store the paging object in jQuery data as well.
                this.data("page", paging);
                return this;
            };
        })(jQuery);
    };

    // SwipeIsMoving is a global lock object to prevent any other swipe from moving while some swipe is moving.
    window.Conmio.SwipeIsMoving = null;
	
	
	window.Conmio.SpeedCalculation = function( options )
	{
		// Dict where we store data
		this.dictionary = [];
		// Max Speed
		this.maxSpeed = (options && options.maxSpeed) || 3000, 
		
		// Adding coordinates
		this.add = function( x, y )
		{
			this.dictionary.push( { x : x, y : y, time : new Date().getTime() })
		}
		// Reseting
		this.reset = function()
		{
			this.dictionary = [];
		}
		// Speed calculations
		// Returs { x: [value], y : [value] }
		this.calculateSpeed = function()
		{
			var vector = { x: 0, y: 0 };
			
			if ( this.dictionary.length < 2) {
                return vector;
            }	
			var measurement_copy = this.dictionary.slice(0);
            // get the last two measurements
            var last = measurement_copy.pop();
            var prev = measurement_copy.pop();
			
			var dx = last.x - prev.x;
			var dy = last.y - prev.y;
            var dt = last.time - prev.time;
			
			// don't go past maxSpeed
			vector.x = (dx / dt > this.maxSpeed ? this.maxSpeed : dx / dt); 
            vector.y = (dy / dt > this.maxSpeed ? this.maxSpeed : dy / dt);
            
			// round small enough speeds to zero
            vector.x = Math.abs(vector.x) > 0.1 ? vector.x : 0;
            vector.y = Math.abs(vector.y) > 0.1 ? vector.y : 0;
            return vector
		}
	}


    // window.Conmio.SwipeablePagination is a JavaScript function which enables swiping and paging.
    //
    // Usage: new window.Conmio.SwipeablePagination({
    //  [options]
    // })
    //
    // Calling the constructor will automatically enable scrolling or swiping in the passed elements.
    window.Conmio.SwipeablePagination = function(options) {

        // List of options:
		
		this.speed = new window.Conmio.SpeedCalculation();
		
		// Current container
		this.container = null;
		
		// Scrollable ?
		this.scrollable = false;
		
		// Rigth click detector
		this.right_click = false;
		
        // Enables movement on x-axis (optional)
        this.xAxis = true;

        // Enables movement on y-axis (optional)
        this.yAxis = true;

        // Elements is a list of pages (actual DOM elements, not jQuery elements) that represents the list of pages.
        // You need to pass in at least one element. You always need to pass in a JavaScript array (a bit dorky).
        this.elements = [];

        // Enables or disables kinetic scrolling (release your finger and scrolling continues)
        this.kinetic = true;

        // The viewport for scrolling (required)
        this.viewport = null;

        // Minimum distance required to initiate scroll or page
        this.distance = 0;

        // Revert to starting position when finger is released?
        this.revert = false;

        // The maximum movement speed of the scrolling
        this.maxSpeed = 3000;

        // Represents the kinetic energy. How many secs will it take to stop from top speed
        this.elasticity = 1;

        // Will detach non-visible items from DOM
        this.detachNonVisible = true;

        // How far the page needs to be swiped sideways before the next page changes in percents
        this.pageChangeThreshold = 0.1;

        // Internal variables (maybe should prefix with an underscore):
        //
        // Tracks the touch coordinates
        this.coordinates = null;

        // Tracks the index of the currently selected page
        this.currentPage = 0;

        // Tracks whether or not this swipe is moving
        this.isMoving = false;

        // Tracks whether or not this swipe is enabled
        this.enabled = false;

        this.defaultPrefixes = {
            css: "",
            dom: "",
            aliases: {
                transitionend: "transitionend",
                transform: "transform",
                transition: "transition"
            },
            supports3d: false
        };


        // OVERRIDEABLE FUNCTIONS (can be overridden from options):
        //
        // A callback whether or not this particular swipe is allowed to start moving
        this.canMove = function() {
            // by default we allow moving if not other swipe is moving
            if (!window.Conmio.SwipeIsMoving) {
                return true;
            } else {
                // ...or if the currently moving swipe is this swipe.
                return (window.Conmio.SwipeIsMoving == this);
            }
        };
        // A callback whenever user changes pages
        // You can get the currentpage from this.currentPage (which is an index)
        this.onpagechange = function() {};

        // An internal function to get the current 3d translation of a DOM element
        this.getCurrentTranslation = function(element) {
			if ( element == null )
				return {x :0, y : 0}
            // if we have a css matrix object available, prefer that (easier)
            if (typeof window[this.prefixes.dom + "CSSMatrix"] != 'undefined') {
                var transform = window.getComputedStyle(element)[this.prefixes.aliases.transform];
                var matrix = new window[this.prefixes.dom + "CSSMatrix"](transform);
                if (matrix) {
                    return {
                        x: matrix.e,
                        y: matrix.f
                    }
                }
            } else {
                // Otherwise we need to parse the css matrix object
                // Example matrices:
                //
                // matrix(1, 0, 0, 1, 0px, 0px)
                // matrix(1, 0, 0, 1, -142, 0)
                //
                // on webkit, the last number is y translation, and x is the second
                var matrix = window.getComputedStyle(element)[this.prefixes.aliases.transform];
                var pattern = /-?[0-9]+/gi;
                var parts = [];
                var match = pattern.exec(matrix);
                while (match != null) {
                    parts.push(match);
                    match = pattern.exec(matrix);
                };
                //console.log(parts);
                return {
                    x: parseInt(parts[4][0], 10),
                    y: parseInt(parts[5][0], 10)
                }
            }
        };

        // An internal function that handles when the finger is released and moving stops
        this.onstop = function(element) {
            // First we declare that nobody's moving anymore
            window.Conmio.SwipeIsMoving = null;
            var width = $(element).width();
            var translation = this.getCurrentTranslation(element);

            // ...then we check if we've crossed the pageChangeThreshold
            if (this.xAxis && this.size() > 1) {
                if (translation.x > width * this.pageChangeThreshold) {
                    // and scroll to the the appropriate page if necessary
                    if (this.currentPage > 0) {
                        this.scrollToPage(this.currentPage - 1);
                        return;
                    }
                } else if (translation.x < -(width * this.pageChangeThreshold)) {
                    if (this.currentPage < this.size() - 1) {
                        this.scrollToPage(this.currentPage + 1);
                        return;
                    }
                }
            }

            // If the page threshold has not been crossed, check if we need to revert immediately (user has
            // scrolled past element boundaries)
            if (!this.kinetic) {
                this.revertIfNeeded(this.getCurrentTranslation(element));
                return;
            }
            // User has not scrolled past boundaries, let's calculate the kinetics!
            // 1) get the speed that element was moving at.
            // 1.1) Multiply the speed by 1000 to get pixels / sec
            var spd = this.getCurrentSpeed();
            var speed = {
                x: (spd.x * 1000),
                y: (spd.y * 1000)
            }
            // 1.2) If speed is zero, don't fire kinetics
            if ((speed.x == 0 && speed.y == 0) ||
                (!this.yAxis && speed.x == 0) ||
                (!this.xAxis && speed.y == 0)) {

                    this.revertIfNeeded(this.getCurrentTranslation(element));
                    return;
            }

            // 2) Calculate what would be the end position of the element after kinetic movement

            var targetYTranslation = (this.yAxis ? Math.round(translation.y + speed.y) : translation.y);
            var targetXTranslation = (this.xAxis ? Math.round(translation.x + speed.x) : translation.x);

            var self = this;
            var element = this.currentElement();
            // 3) Find out if end result would be past element boundaries
            var pastBoundaries = this.wouldBePastBoundaries(element, { y: targetYTranslation, x: targetXTranslation });
            if (pastBoundaries) {
                // If yes, we can just directly scroll near the edge of the element, preferably a bit over the edge
                // to allow for revert to kick in.
                if (this.yAxis) {
                    if (targetYTranslation > 0) {
                        targetYTranslation = 10;
                    } else {
                      
						targetYTranslation = 0 - element.clientHeight + this.viewport.offsetHeight - 10;
                    }
                // (as you can see, we only support either x or y, not both (at least cleanly that is))
                } else if (this.xAxis) {
                    if (targetXTranslation > 0) {
                        targetXTranslation = 10;
                    } else {
                      targetXTranslation = 0 - element.clientWidth + this.viewport.offsetWidth - 10;
                    }
                }
            }


            // Okay, now we know how far to scroll elasticly. The time to scroll there is defined by this.elasticity (seconds).
            var time = this.elasticity;

            // If are already past the boundaries, we can just quickly scroll to the edge.
            if (pastBoundaries && this.wouldBePastBoundaries(element, { y: translation.y, x: translation.x })) {
                time = 0.2;
            } else if (pastBoundaries) {
                // ...or then if we _would_ go past the edges, we need to
                // 1) zip there really quickly and
                // 2) have the browser revert
                //
                // I've used the relative scale of how far we want to go past the edge versus how far the kinetic
                // energy would take us.
                if (this.yAxis) {
                    time = Math.abs((translation.y - targetYTranslation) / speed.y).toPrecision(1);
                } else {
                    time = Math.abs((translation.x - targetXTranslation) / speed.x).toPrecision(1);
                }
            }

            // Finally we set a transition to go where the kinetics would take us
            $(element)
                .css(this.prefixes.aliases.transition, "all "+time+"s ease-out")
                .css(this.prefixes.aliases.transform, "translate3d("+targetXTranslation+"px,"+targetYTranslation+"px,0px)")
                .one(this.prefixes.aliases.transitionend, function(e) {
                    // After the transition ends, we might be outside the boundaries, so we will revert the scroll
                    // to the edge if needed.
                    self.revertIfNeeded(self.getCurrentTranslation(element));
                });

        };

        // Helper function to determine if a given translation would be outside the element's boundaries
        this.wouldBePastBoundaries = function(element, translation) {
            if (this.yAxis) {
                return ((translation.y > 0) ||
                    (translation.y < 0 - element.clientHeight + (this.viewport != undefined ? this.viewport.offsetHeight : 0 )));
            } else if (this.xAxis) {
                return ((translation.x > 0) ||
                    (translation.x < 0 - element.clientWidth +(this.viewport != undefined ? this.viewport.offsetWidth : 0 )));
            }
        };
        // Reverts the element to the edge of the boundary if needed
        this.revertIfNeeded = function(translation) {
            var element = this.currentElement();
			if ( element == undefined )
				return;
				
            if (this.yAxis) {
                if (translation.y > 0) {
                    this.reset(false);
                } else if (translation.y < 0 - element.clientHeight + this.viewport.offsetHeight) {
                    this.reset(false);
                }
            } else if (this.xAxis) {
                if (translation.x > 0) {
                    this.reset(false);
                } else if (translation.x < 0 - element.clientWidth + this.viewport.offsetWidth) {
                    this.reset(false);
                }
            }

            if (this.revert) {
                this.reset(false);
            }
        };
		
        // Finds out the correct vendor prefix for current browser
        this.determineBrowserPrefix = function() {
            var prefixes = {
                "Webkit": {
                    css: "-webkit-",
                    dom: "WebKit",
                    aliases: {
                        transitionend: "webkitTransitionEnd",
                        transform: "webkitTransform",
                        transition: "webkitTransition"
                    },
                    supports3d: true
                },
                "Moz"   : {
                    css: "-moz-",
                    dom: "Moz",
                    aliases: {
                        transitionend: "transitionend",
                        transform: "MozTransform",
                        transition: "MozTransition"
                    },
                    supports3d: true
                },
                "ms"    : {
                    css: "-ms-",
                    dom: "ms",
                    aliases: {
                        transitionend: "MSTransitionEnd",
                        transform: "msTransform",
                        transition: "msTransition"
                    },
                    supports3d: false
                },
                "O"     : {
                    css: "-o-",
                    dom: "O",
                    aliases: {
                        transitionend: "oTransitionEnd",
                        transform: "OTransform",
                        transition: "OTransition"
                    },
                    supports3d: true
                },
                ""      : this.defaultPrefixes
            }
            var el = document.createElement("div");
            for (var key in prefixes) {
                // If a given prefix is supported, the style property will be an
                // empty string, otherwise it will be undefined.
                if (typeof el.style[key + "Transform"] != "undefined") {
                    return prefixes[key]
                }
            }
            return this.defaultPrefixes;
        };

        // Initializes scrolling, copies all options over local properties
        this.initialize = function(opts) {
           	// Find out what the correct browser prefix is
            this.prefixes = this.determineBrowserPrefix();

            var options = opts || {};
            for (var prop in options) {
                if (options.hasOwnProperty(prop)) {
                    this[prop] = options[prop];
                }
            }
			// This sometimes fails....
            if (!this.viewport) {
                this.viewport = options.container;
				
            }

            if (!this.eventTarget) {
                this.eventTarget = this.viewport;
            }


            // Set webkit-transform-style to each of the scrollable elements
            $(this.elements).css(this.prefixes.css + "transform-style", "preserve-3d");

            // Proxies overridden function to always refer _this_ to the swipe element
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    if (typeof(this[prop]) == "function") {
                        this[prop] = $.proxy(this[prop], this);
                    }
                }
            }

            // Swipe can be disabled if this.enabled = false in the options
            if (!options.hasOwnProperty("enabled") ||
                options.enabled == false) {
                this.enable();
            }

        };
        // A callback function that gets added to touchend and mouseup events
        this.moveStop = function(e) {
            // which unbinds all of the touchmove and mousemove and touchend and mouseup handlers from document.
            $(document.body).unbind("touchmove", this.moving);
            $(document.body).unbind("mousemove", this.moving);
            $(document).unbind("touchend", this.moveStop);
            $(document).unbind("mouseup", this.moveStop);

            if (this.isMoving) {
                // Calls onRelease callback when moving stops if the element was moving
                this.onRelease();

                // TODO: Need to check if we should consider mouseup or touchend coordinates for the speed calculation
                // (likely yes)
                //
                //this.addEventCoordinates(e);
                this.onstop(this.elements[this.currentPage]);
            }
        };

        // A callback function that gets added to touchmove and mousemove events on mousedown or touchstart
        this.moveStart = function(e) {
            if ( this.right_click)
				return;
			// Clear old finger/mouse movement coordinates
            this.onContact();
	    this.coordinates = null;
            // This scroll is not currently moving (it hasn't reached threshold yet)
            this.isMoving = false;
            // Add the touchstart or mousedown coordinates to be considered in speed calculations
            this.addEventCoordinates(e);

            // Clear the webkit transition so that elements can follow finger movements immediately
            $(this.elements)
                .css(this.prefixes.css + "transition", "all 0s ease-out")
                .css(this.prefixes.css + "user-select", "none");

            // Finally, bind movement and move-end callbacks directly to the body so that you can move your finger
            // pretty much anywhere
            if (e.type.indexOf("touch") > -1) {
                $(document.body).bind("touchmove", this.moving);
                $(document).bind("touchend", this.moveStop);
            } else {
                $(document.body).bind("mousemove", this.moving);
                $(document).bind("mouseup", this.moveStop);
            }
        };

        // Add a new set of event coordinates to the list of current movement measurements
        this.addEventCoordinates = function(e) {
            var event = e.originalEvent;
            var coords;

            // checks whether it's a touchend or touchmove or mouse or whatever
            if (event.changedTouches) {
                coords = (event.changedTouches ? event.changedTouches[0] : event.touches[0]);
            } else {
                coords = (event.touches ? event.touches[0] : event);
            }

            // If we don't have current coordinates, we initialize them
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
			this.speed.add(coords.pageX, coords.pageY);
            // We push the latest measurement to the coordinates.
            this.coordinates.timeStamps.push({
                x: coords.pageX,
                y: coords.pageY,
                time: new Date().getTime()
            });

            // ...and we also calculate a delta from the starting point of movement
            this.coordinates.deltaXFromStart = (coords.pageX - this.coordinates.startX);
            this.coordinates.deltaYFromStart = (coords.pageY - this.coordinates.startY);

            this.coordinates.deltaX = (coords.pageX - this.coordinates.previousX);
            this.coordinates.deltaY = (coords.pageY - this.coordinates.previousY);

            // ...and store the current coordinates for delta calculation in the next round
            this.coordinates.previousX = coords.pageX;
            this.coordinates.previousY = coords.pageY;
        };

        // This is a callback for mousemove and touchmove
        this.moving = function(e) {
            // If we're not allowed to move, don't do anything
            if (!this.canMove()) {
                return;
            }
            // If yes, store the current finger/mouse position
            this.addEventCoordinates(e);

            // ..and if we're past the threshold, start moving the actual element.
            if (this.isMoving ||
                (this.xAxis && Math.abs(this.coordinates.deltaXFromStart) > this.distance) ||
                (this.yAxis && Math.abs(this.coordinates.deltaYFromStart) > this.distance)) {

                // Set the private and global lock, we're moving.
                this.isMoving = true;
                window.Conmio.SwipeIsMoving = this;

                // ...and move the DOM elements
                this.moveElements(this.coordinates);
            }
            // If we're moving, prevent default (so that if you drag from a link, the link doesn't fire)
            if (this.shouldPreventDefault()) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        // Checks whether user has dragged their finger/mouse (TODO: consider if this should be after threshold has been
        // reached)//
        this.shouldPreventDefault = function() {
            if (this.xAxis && this.coordinates.deltaXFromStart != 0) {
                return true;
            } else if (this.yAxis && this.coordinates.deltaYFromStart != 0) {
                return true;
            }
            return false;
        };

        // Get the current speed of movement at this point in time
        this.getCurrentSpeed = function() {
            if (!this.coordinates) {
                return { x: 0, y: 0 };
            }
			var cspeed = this.speed.calculateSpeed();
			this.speed.reset();
			 
            return cspeed;
        };

        // Reset everything else to normal positions, except current page to "leading edge"
        this.reset = function(instant) {
			if ( this.size() == 0 )
				return;
			
            var translation = this.getCurrentTranslation(this.elements[this.currentPage]);

            var self = this;

            // Set a relative quick transition (unless instant == true)
            $(this.elements)
                .css(this.prefixes.aliases.transition, (instant ? "" : this.prefixes.css + "transform 0.3s ease-out"))
                .one(this.prefixes.aliases.transitionend, function(e) {
                    // ...and clear it after it's complete
                    $(e.target).css(self.prefixes.css + "transition", "");
                })
            .each(function(index, element) {
                var $element = $(element);
                var translation = self.getCurrentTranslation(element);
				if (element != undefined) 
				{
					// Resets the offset of everything but the current page to zero
					if (index == self.currentPage) 
					{
						// ...and current page gets reset to page boundaries if necessary
						if (self.yAxis) 
						{
							var minYTrans = self.viewport.offsetHeight - element.clientHeight;
							if (translation.y > 0) 
							{
								$element.css(self.prefixes.css + "transform", "translate3d(0px,0px,0px)");
							}
							else 
								if (translation.y < minYTrans) 
								{
									$element.css(self.prefixes.css + "transform", "translate3d(0px," + minYTrans + "px,0px)");
								}
						}
						else 
							if (self.xAxis) 
							{
								var minXTrans = self.viewport.offsetWidth - element.clientWidth;
								if (translation.x > 0) 
								{
									$element.css(self.prefixes.css + "transform", "translate3d(0px,0px,0px)");
								}
								else 
									if (translation.x < minXTrans) 
									{
										$element.css(self.prefixes.css + "transform", "translate3d(" + minXTrans + "px,0px,0px)");
									}
							}
					}
					else 
					{
						$element.css(self.prefixes.css + "transform", "translate3d(0px,0px,0px)");
					}
				}
            });
        };

        // Shorthand to get the current DOM element using the current page index
        this.currentElement = function() {
            return this.elements[this.currentPage];
        };

        // Shorthand to get the current DOM element transformation of the current page
        this.currentElementTranslation = function() {
            return this.getCurrentTranslation(this.currentElement());
        };

        // Shorthand to get the first element
        this.firstElement = function() {
            return this.elements[0];
        };

        // Shorthand to get the last element
        this.lastElement = function() {
            return this.elements[this.size() - 1];
        };

        // Moves the DOM elements (translates them) according to the current finger/mouse position
        this.moveElements = function(coordinates) 
		{
            var coords = this.coordinates;

            var resist_factor_x = 1;
            var resist_factor_y = 1;

            // We only move the currently visible page and the one after and before it to conserve GPU.
            var movableElements = [ this.elements[this.currentPage] ];
            if (this.currentPage > 0) {
                movableElements.push(this.elements[this.currentPage - 1]);
            }
            if (this.currentPage < this.numPages() - 1) {
                movableElements.push(this.elements[this.currentPage + 1]);
            }

            // Calculate a resist factor if we're past page boundaries (TODO: doesn't work for the last page for some
            // reason)
            if (this.xAxis) {
                var trans = this.currentElementTranslation();
                if (this.currentPage == 0 && trans.x > 0) {
                    movableElements = [ this.currentElement() ];
                    resist_factor_x = 10;
                } else if (this.currentPage >= this.numPages() - 1 && trans.x < -$(this.currentElement()).width()) {
                    movableElements = [ this.currentElement() ];
                    resist_factor_x = 10;
                }
            }

            // Create the CSS translate property
            var translate = "translate3d(";

            // by calculating what the current translation is
            var currentTranslation = this.getCurrentTranslation(movableElements[0]);
            // and incorporating a "resist factor" if we're past element boundaries
            var desiredXTranslation = (currentTranslation.x + (coords.deltaX / resist_factor_x));
            translate += (this.xAxis ? desiredXTranslation+"px," : "0px,");
            translate += (this.yAxis ? (currentTranslation.y + (coords.deltaY / resist_factor_y))+"px,0px)" : "0px,0px)");

            // And call a callback function that listens for individual element movement
            this.offsetCallback({
                x: currentTranslation.x,
                y: currentTranslation.y
            });

            // and set the translation to the element
            $(movableElements).css(this.prefixes.css + "transform", translate);
		};
		
		/**
		 * Fixing element css
		 * @param {Object} element
		 */
		this._fixInjectedElement = function( element )
		{
			var target = $(element).get()[0];
			$(element).css({width:"100%", "top" : "0%"}); // Fixing css
			return target;
		}
		
		/**
		 * Filter and process options dict
		 * @param {Object} options
		 */
		this._filterOptions = function(options)
		{
			var focus = true;
			var instant = false;
			if ( options != null && options.focus != null  ) focus = options.focus;
			if ( options != null && options.instant != null ) instant = options.instant;
			return {focus : focus, instant : instant }
		}
		
		/**
		 * 
		 * @param {Object} index
		 * @param {Object} element
		 * @return itself
		 */
		this.add = function(index, element, options)
		{
			// Simple consistancy check
			if ( element == null )
				return;
				
			if ( index < 0 )
				return;
			
			
			if ( index > this.size() && this.size() > 0)
				return;
			
			// Filter passed arguments
			var options = this._filterOptions(options); 
			
			// Fix target css, and get native javascript element from jquery
			var target_element = this._fixInjectedElement(element)
			
			// Injecting element to current position
			this.elements.splice(index, 0, target_element);
			
			// iterate over all elements and fixing transition
			$(this.elements).css(this.prefixes.css + "transform-style", "preserve-3d");
			
			var append = this.currentPage < index;
			// Try to distinguish what the operation is possible with existing dom structure
			(append ) 
				? 	this.container.append(target_element) 
				:	this.container.prepend(target_element)
			
			// Scrolling to needed position
			this.scrollToPage(
				this.currentPage + (append == true ? 0 : 1),{
					instant: true
				}
			)
			
			// Fixing bug with first page when prepending
			var gofirst = null;
			if ( append == false && this.size() >= 2 && (first = this.getAt(1)) )
				first.css("top", "0%");
			
			if ( options.focus ) this.scrollToPage(index,{instant : options.instant})
			
			if ( this.scrollable )
				$(target_element).scroll({viewport: this.viewport });
			
			return this;
		}
		
		/**
		 * Returns the size of elements
		 */
		this.size =  function()
		{
			return this.elements.length;
		}
		
		/**
		 * Alias for size
		 */
		this.getLength = function()
		{
			return this.size();
		}
		
		/**
		 * Appending new element
		 * @param {Object} element
		 */
		this.append = function( element, options )
		{
			return this.add(this.size(), element, options)
		}
		
		/**
		 * Prepending new element
		 * @param {Object} element
		 */
		this.prepend = function( element, options )
		{
			return this.add(0, element, options)
		}
		
		/**
		 * Get the element by page index
		 * @param {Object} page
		 */
		this.getAt = function(page)
		{
			var page = parseInt(page); // Just in case, convert it to integer
			if (page != NaN && page >= 0 && page <= this.size()) 
			{
				return $(this.elements[page]);
			}
			return null; 
		}
		/**
		 * Return the jquery object of current page
		 */
		this.getCurrentPage = function()
		{
			return this.getAt(this.currentPage);
		}
		/**
		 * Setting specific css to the element
		 * @param {Object} index
		 * @param {Object} element
		 */
		this._resetElement = function(index, element)
		{
			var css = {
                "position": (this.currentPage == index ? "static" : "absolute"),
                "left": (-(this.currentPage - index) * 100) + "%"
            };
            css[this.prefixes.aliases.transition] = "all 0s linear";
            if (this.prefixes.supports3d) {
                css[this.prefixes.aliases.transform] = "translate3d(0px,0px,0px)";
            } else {
                css[this.prefixes.aliases.transform] = "translate(0px,0px)";
            }

            $(element).css(css);
		}
		
        // A function to reset all the elements to their "initial" positions (0,0,0)
        this.resetOffsets = function() {
            var self = this;
			
            $(this.elements).each(function(index, element) {
                // and also detach non-visible pages from the DOM
                if (self.detachNonVisible) {
                    self.detachIfApplicable(index, element);
                }
				self._resetElement(index, element);
            });
        };

        // Detaches the given element from the DOM if the index specified is (index < -1 < element < 1 < index)
        this.detachIfApplicable = function(index, element) {
            var $el = $(element);
            if (index < this.currentPage - 1 ||
                index > this.currentPage + 1) {
                // Also store the current swipe for the element so that we can re-enable it once it gets reattached
                // to the dom
               	
			    if (!$el.data("swipe.parent")) {
                    $el.data("swipe.parent", {
                        index: index,
                        parent: $el.parent()[0]
                    });
                    $el.detach();
                }
            } else {
                // Or reattach it back if necessary
				
                var swipeParent = $el.data("swipe.parent");
                if (swipeParent) {
                    if (swipeParent.index < this.currentPage) {
                        $(swipeParent.parent).prepend($el);
                    } else {
                        $(swipeParent.parent).append($el);
                    }
                }
                $el.data("swipe.parent", false);
            }
        };

        // Calls resetOffsets after animations are complete, and if applicable, triggers page change callback
        this.establishPagePositionsAfterAnimation = function(page, options) {
            this.currentPage = page;
            this.resetOffsets();

            if (!options || !options.silent) {
                this.onpagechange(page);
            }
        };

        // Shorthand to get the number of pages available
        this.numPages = function() {
            return this.size();
        };

        // Scroll to a given index. Options (array):
        //
        // instant (boolean): animate or not
        // silent (boolean): don't call the callback
        this.scrollToPage = function(page, options) {
            if (page < 0 || page >= this.numPages()) {
                this.reset(false);
                return;
            }

            if (options && options.instant) {
                this.establishPagePositionsAfterAnimation(page, options);
            } else {
                var distance = page - this.currentPage;

                var self = this;

                var testDiv = document.createElement("div");
                if (typeof testDiv.style[self.prefixes.aliases.transition] == "undefined") {
                    // no transitions, use jQuery .animate() instead
                    $(this.currentElement()).css("position", "absolute");
                    $(this.elements).animate({
                        left: "-=" + (distance * 100) + "%"
                    }, 300);
                } else {
                    $(this.elements).each(function(index, element) {
                        if ($(element).data("swipe.parent")) {
                            // this element is not in the DOM, so exclude it from expected callbacks
                            return;
                        }
                        var css = {};
                        css[self.prefixes.aliases.transition] = "all 0.3s ease-out";
                        if (self.prefixes.supports3d) {
                            css[self.prefixes.aliases.transform]  = "translate3d("+(-distance * $(element).width())+"px,0px,0px)";
                        } else {
                            css[self.prefixes.aliases.transform]  = "translate("+(-distance * $(element).width())+"px,0px)";
                        }
                        $(element).css(css);
                    });
                }
                setTimeout(function() {
                    self.establishPagePositionsAfterAnimation(page, options);
                }, 300);

            }
        };

        // Go to next page
        this.nextPage = function() {
            if (this.currentPage < this.size() - 1) {
                this.scrollToPage(this.currentPage + 1);
            }
        };

        // Go to previous page
        this.previousPage = function() {
            if (this.currentPage > 0) {
                this.scrollToPage(this.currentPage - 1);
            }
        };

        // Override this to get a callback for the current element scroll position (TODO: what's the argument?)
        this.offsetCallback = function() {};

        // Override this to get a callback when user's finger/mouse is released
        this.onRelease = function() {};
 	// Override this to get a callback when user's finger/mouse starts contact/starts. (TODO: perhaps a better name?) 
        this.onContact = function() {};
        // Disable this scrolling (won't react anymore and unbinds all callbacks)
        this.disable = function() {
            if (!this.enabled) {
                return;
            }
            $(this.eventTarget).unbind("touchstart", this.moveStart);
            $(this.eventTarget).unbind("mousedown", this.moveStart);

            this.enabled = false;
        };
        // Enable this scrolling object, rebinds callbacks
        this.enable = function() {
            if (this.enabled) {
                return;
            }
			var self = this;
			// Binding annoying inspector show event 
			// When the rigth click trigged and we go to inspetor - rigth after that swiping start bugging
            this.eventTarget.oncontextmenu = function(){
                self.right_click = true;
            }
			// On click reseting rigth click flag
			$(this.eventTarget).click(function(){
                self.right_click = false;
            });
			$(this.eventTarget).bind("touchstart", this.moveStart);
            $(this.eventTarget).bind("mousedown", this.moveStart);

            this.enabled = true;
        };

        this.initialize(options);
    };
	
	
	
	
	
	// window.Conmio.Ribbon is a JavaScript function which enables swiping and paging.
    //
    // Usage: new window.Conmio.Ribbon({
    //  [options]
    // })
    //
    // Calling the constructor will automatically enable scrolling or swiping in the passed elements.
	window.Conmio.Ribbon = function( target, options )
	{
		this.speed = new window.Conmio.SpeedCalculation();
		// Target object
		this.target = target;
		// Passed options
		this.options = options;
		
		// Holder element
		this.holder = null;
		
		//Css engine
		this.engine = null;
		
		// Start coordinates
		// We keep it here, to figure out the distance
		this.startX = null;
		
		// MouseDown flag, this is for desktop browsers
		this.is_mouse_down = false;
		
		// Current user agent
		this.agent = navigator.userAgent.toLowerCase();
		
		// current position of the holder
		this.current_position = null;
		
		// Coord collections
		// We put here x,y coords, and time
		this.coords_collections = [];
		
		// Maximum speed for scrolling
		this.maxSpeed = 3000;

        this.on_change = null;
		
		//Bunch of css styles, that should be applied to the main container
		this.css = {
			"-webkit-touch-callout": "none",
			"-webkit-user-select": "none",
			"-khtml-user-select": "none",
			"-moz-user-select": "none",
			"-ms-user-select": "none",
			"user-select": "none"
		}
		
		this.click_handler = null;
		// Returns the width of the single element
		this.getWidth = function()
		{
			return this.holder.children().eq(0).width();
		}
		// Returns the width of the single element
		this.getHeight = function()
		{
			return this.holder.children().eq(0).height();
		}
		// Returnt the container width
		this.getContainerWidth = function()
		{
            var size = 0;
            var self = this;
            this.holder.children().each(function(index, element){

                var el = $(element);
                var margin_left = parseInt(el.css("margin-left"));
                var margin_right = parseInt(el.css("margin-right"));
                size +=  (margin_left +  margin_right +  el.width());
            });
            return size;
		}
		// The container size
		this.getSize = function()
		{
			return (this.options && this.options.size) || this.holder.children().length;
		}
		// How many items on the viewport
		this.onPage = function()
		{
			return Math.abs(target.width() / this.getWidth());
		}
	
		this.initial_start = null;
		this.shouldBeBouncedToLeftSide = false;
		
		// Onmove trigger
		this.move = function(e, self)
		{

			var event = e.originalEvent;
			if (event.type == "touchend") 
				coords = (event.changedTouches ? event.changedTouches[0] : event.touches[0]);
			else 
				coords = (event.touches ? event.touches[0] : event);
            // If should prevent defaults
            if ( self.startX && Math.abs(self.startX - coords.pageX) >= 5){
                e.preventDefault();
                e.stopPropagation();
            }

			if (self.startX == null) 
			{
				self.current_position = self.getHolderPosition() 
				self.startX = coords.pageX;
				self.initial_start = coords.pageX
			}

			var shift =  self.current_position + coords.pageX - self.startX;
			self.holder.css( self.engine + "-transition", "all 0.0s linear");

            // Bouncing the edges 
            if (shift >= 0) // Slowing down the swiping 
			{
				self.shouldBeBouncedToLeftSide = true;
				shift = shift / 8;
			} else self.shouldBeBouncedToLeftSide = false;
			
            self.holder.css( self.engine + '-transform', "translate3d("+shift+"px,0px,0px)");
			self.speed.add(coords.pageX - self.initial_start, 0);
			
		}
		
		this.click = function( _func )
		{
			this.click_handler = _func;
			this.holder.children().each(function(index, element){
				$(this).data("index", index);
				$(this).click(function(){
					var i = $(this).data("index");
					_func($(this), i);
				})
			});
		}


        this.getClosestPage = function()
        {
            return  Math.abs( Math.round(this.getHolderPosition() / this.getWidth()));
        }

        this.focus = function()
        {
            this.jumpTo( this.getClosestPage() );
        }

        this.currentPage = 0;
		/**
		 * When the uses tap out the finger.
		 * @param {Object} e
		 * @param {Object} self
		 */
		this.stop = function(e, self)
		{
			var current = self.getHolderPosition();
			var speed = self.speed.calculateSpeed();
			
			var target_plus = Math.round(speed.x);
			
			var on_page = self.onPage();
			var size = self.getSize();
			var speed_debug = $("#speed_debug");
            
			if (self.options && self.options.debug) // Debuggin
			{
				// Speed Debug 
				var px = 300 - ((Math.abs(speed.x) * 10) / 100 ) * 300;
				speed_debug.find("div").css( self.engine + '-transform', "translate3d(-"+px+"px,0px,0px)");
				window.setTimeout(function(){
					speed_debug.find("div").css( self.engine + '-transform', "translate3d(-300px,0px,0px)");
				},500)
			}
			//window.Conmio.Log("speed", speed.x);
			
			
			
			// Calculating closest page
			var crucial_percent = 0.3;
			target_plus += ( target_plus > 1) ? Math.round(size * crucial_percent) : 0;
			
			// Calculation the duration of the effect
			var duratation 
				= Math.abs(target_plus) / Math.round(size * crucial_percent) * crucial_percent;
			duratation = (duratation < 0.3 ? 0.3 : duratation ) 
			
			
			//window.Conmio.Log("target_plus",target_plus);
			//window.Conmio.Log("duratation",duratation);
			
			// Adding  some amount of pages, which are depending on speed
			var closest_page = Math.abs(Math.round(current / self.getWidth())) - target_plus;
			if ( (closest_page + on_page) > size ){
                closest_page = size - on_page
				
            } else if (closest_page < 0) {
			    closest_page = 0;
            }  
			// Checking whether we should bounce
			if ( self.shouldBeBouncedToLeftSide )
				closest_page = 0;

            var change_page_trigger = closest_page != self.currentPage && self.on_change;
			
			self.currentPage =  closest_page
			
			// Calculating closest coords	
			var closest_cords = (self.getWidth() * closest_page) * -1;
			self.holder.css(self.engine + '-transform', "translate3d(" + closest_cords + "px,0px,0px)");
			self.holder.css(self.engine + "-transition", "all " + duratation + "s ease-out");
			
			// Reseting stuff
			self.startX  = null;
			self.coords_collections = [];

            window.setTimeout(function(){
                self.calculateHolder();
                if ( change_page_trigger ){
                    self.on_change( self.currentPage, self.getAt(self.currentPage))
                }
            },duratation * 1000)
			
			self.speed.reset();

		}

        this.onChange = function(callback)
        {
            this.on_change = callback;
        }

        this.getAt = function( index )
        {
            if ( index <= this.getSize() -1 )
                return this.holder.children().eq(index);
            return null;
        }
		
		this.nextCube = function()
		{
			this.currentPage = this.getClosestPage() + 1
            this.jumpTo(this.currentPage)
		}
		
		this.prevCube = function()
		{
			this.currentPage = this.getClosestPage()  - 1;
			this.jumpTo(this.currentPage)
		}
		
		this.jumpTo = function(viewport_location)
		{
			if ( viewport_location >= 0 && viewport_location < this.getSize() -2){
				var px = (this.getWidth() * (viewport_location )) * -1;
                this.currentPage =  viewport_location;
				this.holder.css( this.engine + '-transform', "translate3d("+px+"px,0px,0px)");
				this.holder.css( this.engine + "-transition", "all 0.4s ease-out");
				if ( this.on_change){
					this.on_change(  this.currentPage, this.getAt(this.currentPage))
				}
			}
		}
		
		/**
		 * Binding events to the scene
		 */
		this.bindEvents = function()
		{
			var self = this;
			// Firefox events
			if (this.agent.indexOf("mobile") == -1) 
			{
				this.holder.bind("mousedown", function(e){ self.is_mouse_down = true;})
				this.holder.bind("mouseup", function(e){ 
					self.is_mouse_down = false;
					
				})
				this.target.bind("mouseout", function(e){ 
					 self.is_mouse_down = false;
				})
				this.holder.bind("mousemove", function(e)
				{
					if (self.is_mouse_down) 
						self.move(e, self);
				})
			}
				
			// Touch events
			this.holder.bind("touchmove", function(e)
			{
				
				self.move(e, self)
			})
			this.holder.bind("touchend mouseup", function(e)
			{
				self.stop(e, self);
			})
			
		}
		
		// Returns the holder position
		this.getHolderPosition = function()
		{
			var css = this.holder.css(this.engine + "-transform");
			if (css && css != "none")
				return parseInt(css.match(/([0-9-.]+?),\s?0\s?\)/)[1]);
			return 0;
		}
		// Initialize the entire plugin
		this.initialize = function()
		{
			var self = this;
			var kits = {applewebkit: "-webkit", gecko: "-moz", persto: "-o", msie: "-ms"} // Determine the engine
	        for(var t in kits){
	            if(this.agent.match(t)){
	                self.engine = kits[t]
	                break;
	            }
	        }
            target.css({overflow: "hidden"});
			self.holder = $("<div>").addClass("holder"); // Current scrollable element
			var i = 0;
			self.target.children().each(function(index, element){
				self.holder.append(this); // Restructing element
			});
			self.holder.appendTo(target)
			self.calculateHolder();
			for( var key in this.css){
				self.holder.css(key, this.css[key])
			}
			self.bindEvents();
		}

		// Calculates the holder
        this.calculateHolder = function()
        {
            var self = this;
            var closestPage = self.getClosestPage();
            var on_page = self.onPage();
            var maximum = 0;
            for(var i = 0; i < on_page ; i++){
                var check = closestPage + i;
                var element = self.getAt(check)
                if ( element ){
                     if ( maximum < element.height() )
                         maximum = element.height();
                }
            }
            if ( maximum == 0 )
               maximum = this.getAt(this.getSize()-1).height();


            self.holder.css( self.engine + "-transition", "height 0.0s ease-out");
			this.holder.css({
				width: this.getContainerWidth(),
				height :maximum,
				overflow: "hidden",
				position : "relative"
			})

        }
		this.initialize();
	}

})();
