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
		auto: 0,
		circular: true,
		vertical: false,
		prev: null,
		next: null,
		showButtons: true,
		easing: null,
		start: 0
	};
	
	$.fn.simpleslide.Slide = function(target, options) {
		this.$target = $(target);
		this._options = this._adjustOptions(options);

		
		this.$slide = this.$target.wrapInner('<div class="simpleslide" />').find('.simpleslide');
		this.$container = this.$slide.wrapInner('<div class="simpleslide-container">').find('.simpleslide-container');
		this.$items = this._getItems();

		this.itemWidth = this.$items.outerWidth(true);
		this.itemHeight = this.$items.outerHeight(true);
		
		this._length = this.$items.length < this._options.visible ? this._options.visible : this.$items.length;

		this._direction = this._options.vertical ? 'top' : 'left';
		this._current = this._options.circular ? this._options.visible : 0;
		this._current = this._current + this._options.start;
		if (!this._options.circular && (this._current + this._options.visible > this._length)) {
			this._current = this._length - this._options.visible;
		}

		this._running = false;
		this.autoTimeId = null;

		this._setStyle();
		this._createButton();
		if (this._options.auto) {
			this._auto();
			this.stopSlide();
		}
	};

	$.fn.simpleslide.Slide.prototype = {
		constructor: $.fn.simpleslide.Slide,
		
		_adjustOptions: function(options) {
			var len = this.$target.children().length,
				scroll = Math.abs(options.scroll),
				visible = options.visible;
				
			options.visible = len < visible ? len : visible;
			options.scroll = scroll > visible ? visible : scroll;
			
			return options;
		},
		
		_getItems: function() {
			var $items = this.$container.children(), len = $items.length, v = this._options.visible;

			if (this._options.circular) {
				this.$container.prepend($items.slice(len - v).clone()).append($items.slice(0, v).clone());

				$items = this.$container.children();
			}

			return $items;
		},
		_getMergedMargin: function(length, isAnim) {
			var margin = 0;

			if (this._options.vertical && length) {
				length = isAnim ? length : length - 1;
				margin = Math.min(parseInt(this.$items.css('margin-top')), parseInt(this.$items.css('margin-bottom')));
				margin = margin * length;
			}

			return margin;
		},
		_calcSize: function(length, isAnim) {
			var itemSize = this._options.vertical ? this.itemHeight : this.itemWidth;
			return itemSize * length - this._getMergedMargin(length, isAnim);
		},
		_setStyle: function() {
			var sizeCss = this._options.vertical ? 'height' : 'width';

			this.$items.css({
				overflow: 'hidden',
				width: this.$items.width(),
				height: this.$items.height(),
				'float': this._options.vertical ? 'none' : 'left'
			});

			this.$container.css({
				position: 'relative',
				'z-index': 1
			}).css(sizeCss, this._calcSize(this._length)).css(this._direction, -(this._calcSize(this._current, true)));

			this.$slide.css({
				position: 'relative',
				overflow: 'hidden',
				'z-index': 2
			}).css(sizeCss, this._calcSize(this._options.visible));

			this.$target.css({
				width: this._options.vertical ? this.itemWidth : this.$slide.width(),
				position: 'relative'
			});
		},
		_createButton: function() {
			var slide = this, vertical = this._options.vertical, $target = this.$target, $prev, $next;

			if (!this._options.auto) {
				$target.prepend('<a class="simpleslide-prev" href="">Prev</a>')
					.append('<a class="simpleslide-next" href="">Next</a>');

				$prev = $target.find('.simpleslide-prev');
				$next = $target.find('.simpleslide-next');

				//$prev.add($next).css('position', 'absolute');

				$prev.css({
					top: vertical ? -$prev.outerHeight() : ($target.innerHeight() - $prev.outerHeight() ) / 2,
					left: vertical ? ($target.innerWidth() - $prev.outerWidth() ) / 2 : -$prev.outerWidth()
				});

				if (vertical) {
					$next.css({
						bottom: -$next.outerHeight(),
						left: ($target.innerWidth() - $next.outerWidth() ) / 2
					});
				} else {
					$next.css({
						top: ($target.innerHeight() - $next.outerHeight() ) / 2,
						right: -$next.outerWidth()
					});
				}

				$next.bind('click.simpleslide', function(e) {
					e.preventDefault();
					slide.toNext();
				});

				$prev.bind('click.simpleslide', function(e) {
					e.preventDefault();
					slide.toPrevious();
				});
			}
		},
		_auto: function() {
			var slide = this;
			this.autoTimeId = setTimeout(function() {
				slide.toNext();
				slide.autoTimeId = setTimeout(arguments.callee, slide._options.auto + slide._options.duration);
			}, this._options.auto);
		},
		
		_run: function(to) {
			var that = this, 
				len = this._length, 
				visible = this._options.visible, 
				scroll = this._options.scroll,
				index;

			if (this._running) {
				return;
			}
			
			if (this._options.circular) {
				
				// 确认下一个幻灯的显示数量是否有缺少项
				if (to + visible > len || to + visible < visible) {
					if (to + visible > len) {
						index = visible * 2 - (len - this._current);
						to = index + scroll;
					} else {
						index = (len - visible * 2) + this._current;
						to = index - scroll;
					}
					
					this.$container.css(this._direction, -(this._calcSize(index)));
				}
			} else {
				if (to + scroll == 0 || to - scroll + visible == len) {
					return;
				}
				if (len - to < visible) {
					to = len - visible;
				}
				if (to < 0) {
					to = 0;
				}
			}

			this._current = to;
			this._running = true;
			this.$container.animate(this._options.vertical ? {
				top: -(this._calcSize(to, true))
			} : {
				left: -(this._calcSize(to, true))
			}, this._options.duration, this._options.easing, function() {
				that._running = false;
			});
		},

		toNext: function() {
			this._run(this._current + this._options.scroll);
		},
		toPrevious: function() {
			this._run(this._current - this._options.scroll);
		},
		stopSlide: function() {
			var slide = this;

			this.$target.bind('mouseenter', function() {
				clearTimeout(slide.autoTimeId);
			}).bind('mouseleave', function() {
				slide._auto();
			});
		}
	};

}(jQuery));
