/*
 * simpleslide
 * https://github.com/nicolaszhao/simpleslide
 *
 * Copyright (c) 2014 Nicolas Zhao
 * Licensed under the MIT license.
 */

(function($) {

	$.fn.simpleslide = function(options) {
		options = $.extend({}, $.fn.simpleslide.defaults, options);

		return this.each(function() {
			new $.fn.simpleslide.Slide(this, options);
		});
	};
	
	$.fn.simpleslide.defaults = {
		visible: 3,
		scroll: 1,
		duration: 800,
		auto: true,
		circular: true,
		vertical: false,
		prev: null,
		next: null,
		showButtons: true,
		buttonOffset: 0.6,
		easing: null,
		start: 0,
		extra: 0.5,
		
		// callbacks
		beforeSlide: null,
	};
	
	$.fn.simpleslide.Slide = function(target, options) {
		this._$target = $(target);
		this._options = this._adjustOptions(options);
		this._extra = Math.ceil(this._options.extra);
		this._direction = this._options.vertical ? 'top' : 'left';
		this._current = 0;
		this._forward = false;
		this._timer = null;
		
		this._$container = this._$target.wrapInner('<div class="simpleslide" />').find('.simpleslide');
		this._$slide = this._$container.wrapInner('<div class="simpleslide-wrapper">').find('.simpleslide-wrapper');
		this._$items = this._getItems();
		this._itemWidth = this._$items.outerWidth(true);
		this._itemHeight = this._$items.outerHeight(true);
		this._length = this._$items.length;		

		this._create();
	};

	$.fn.simpleslide.Slide.prototype = {
		constructor: $.fn.simpleslide.Slide,
		
		_create: function() {
			var propWidth = this._options.vertical ? 'height' : 'width',
				propHeight = this._options.vertical ? 'width' : 'height',
				that = this;
			
			this._current = this._options.start + (this._options.circular ? this._options.visible + this._extra : 0);
			if (!this._options.circular && (this._current + this._options.visible > this._length)) {
				this._current = this._length - this._options.visible;
			}
			
			this._extraWidth = Math.floor((this._options.vertical ? this._itemHeight : this._itemWidth) * this._options.extra);
			
			this._$items.css({
				width: this._$items.width(),
				height: this._$items.height(),
				overflow: 'hidden',
				'float': 'left'
			});

			this._$slide
				.css({position: 'absolute', 'z-index': 1})
				.css(propWidth, this._calcSize(this._length, false))
				.css(this._direction, -this._calcSize(this._current));

			this._$container
				.css({position: 'relative', 'z-index': 2, overflow: 'hidden'})
				.css(propWidth, this._calcSize(this._options.visible, false) + (this._options.circular ? 
								2 : 
								(this._length > this._options.visible ? 1 : 0)) * 
								this._extraWidth)
								
				.css(propHeight, this._options.vertical ? this._itemWidth : this._itemHeight);

			this._$target.css({
				width: this._options.vertical ? this._itemWidth : this._$container.width(),
				position: 'relative'
			}).on('mouseenter.simpleslide', function() {
				that.stop();
			}).bind('mouseleave.simpleslide', function() {
				that.repeat();
			});
			
			if (this._options.showButtons) {
				this._generateButtons();
			}
			
			if (this._options.auto) {
				this.repeat();
			}
		},
		
		_adjustOptions: function(options) {
			var len = this._$target.children().length;
				
			if (len < options.visible) {
				options.visible = len;
			} 
			
			if (options.scroll > options.visible) {
				options.scroll = options.visible;
			}
			
			if (!(options.extra > 0 && options.extra < 1)) {
				options.extra = 0;
			}
			
			return options;
		},
		
		_getItems: function() {
			var $items = this._$slide.children(), 
				visible = this._options.visible,
				len = $items.length,
				extra = (len > visible ? this._extra : 0);

			if (this._options.circular) {
				this._$slide.prepend($items.slice(len - visible - extra).clone())
					.append($items.slice(0, visible + extra).clone());
				
				if (len <= visible && this._extra !== 0) {
					this._$slide.prepend($items.slice(len - 1).clone())
						.append($items.slice(0, 1).clone());
				}

				$items = this._$slide.children();
			}

			return $items;
		},
		
		_calcSize: function(count, isPos) {
			var size = this._options.vertical ? this._itemHeight : this._itemWidth,
				extraWidth;
			
			isPos = typeof isPos === 'boolean' ? isPos : true;
			extraWidth = (isPos && (this._options.circular || 
					(this._forward && count + this._options.visible === this._length) ||
					(!this._forward && count !== 0)) ? this._extraWidth : 0);
			
			return size * count - extraWidth;
		},
		
		_generateButtons: function() {
			var vertical = this._options.vertical, 
				offset = this._options.buttonOffset, 
				that = this, 
				$target = this._$target.prepend('<a class="simpleslide-button simpleslide-prev" href="">Prev</a>' + 
					'<a class="simpleslide-button simpleslide-next" href="">Next</a>')
					.find('.simpleslide-button').css({position: 'absolute', 'z-index': 3})
					.end()
					.on('click.simpleslide', '.simpleslide-prev', function(event) {
						that.prev();
						event.preventDefault();
					})
					.on('click.simpleslide', '.simpleslide-next', function(event) {
						that.next();
						event.preventDefault();
					}),
					
				$prev = $target.find('.simpleslide-prev'), $next = $target.find('.simpleslide-next'), 
				prevWidth = $prev.outerWidth(), prevHeight = $prev.outerHeight(), 
				nextWidth = $next.outerWidth(), nextHeight = $next.outerHeight(), 
				containerWidth = $target.innerWidth(), containerHeight = $target.innerHeight();
			
			$prev.css({
				top: vertical ? -prevHeight * offset : (containerHeight - prevHeight) / 2,
				left: vertical ? (containerWidth - prevWidth) / 2 : -prevWidth * offset
			});
			
			$next.css({
				top: vertical ? containerHeight - nextHeight * (1 - offset) : (containerHeight - nextHeight) / 2,
				left: vertical ? (containerWidth - nextWidth) / 2 : containerWidth - nextWidth * (1 - offset)
			});
		},
		
		_run: function(to) {
			var that = this, 
				len = this._length, 
				visible = this._options.visible, 
				scroll = this._options.scroll, 
				callback = this._options.beforeSlide, 
				index, size,
				
				generateData = function() {
					var data = {};
					return this._$items.slice(this._current).slice(0, visible);
					return {
						items: this._$items.slice(this._current).slice(0, visible)
					};
				};
			
			this._$slide.finish();
			
			if (this._options.circular) {
				
				// If the next slide items number is less than the default visible number,
				// slide needs to be respositioned to the beginning or end position.
				// Assuming visible is 3, the original slide items numbers is 9, then the resulting slideshow is: [789]123456789[123].
				// Therefore, the number of the beginning and end of the slide can be calculated as: visible * 2.
				if (to + visible + this._extra > len || to + visible - this._extra < visible) {
					if (to + visible + this._extra > len) {
						index = (visible + this._extra) * 2 - (len - this._current);
						to = index + scroll;
					} else {
						index = (len - (visible + this._extra) * 2) + this._current;
						to = index - scroll;
					}
					
					this._$slide.css(this._direction, -this._calcSize(index));
				}
			} else {
				if (to + scroll === 0 || to - scroll + visible === len) {
					return;
				}
				
				if (to + visible > len) {
					to = len - visible;
				}
				
				if (to < 0) {
					to = 0;
				}
			}
			
			if ($.type(callback) === 'function') {
				callback.call(this._$target, {
					oldItems: this._$items.slice(this._current).slice(0, visible),
					newItems: this._$items.slice(to).slice(0, visible)
				});
			}
			
			size = -this._calcSize(to);
			this._$slide.animate(this._options.vertical ? 
					{top: size} : 
					{left: size}, 
				this._options.duration,
				this._options.easing);
			
			this._current = to;
		},
		
		next: function() {
			this._forward = true;
			this._run(this._current + this._options.scroll);
		},
		
		prev: function() {
			this._forward = false;
			this._run(this._current - this._options.scroll);
		},
		
		repeat: function(speed) {
			if (!this._options.auto) {
				return;
			}
			
			var that = this,
				defaultSpeed = 2000;
			
			speed = speed || defaultSpeed;
			
			this._timer = setTimeout(function() {
				that.next();
				that.repeat((that._options.auto === true ? defaultSpeed : that._options.auto) + that._options.duration);
			}, speed);
		},
		
		stop: function() {
			clearTimeout(this._timer);
		}
	};

}(jQuery));
