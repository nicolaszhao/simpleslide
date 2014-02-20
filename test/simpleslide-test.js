(function($) {
	
	var getVisibleItemsText = function(items) {
		return items.map(function() {
			return $.trim($(this).text());
		}).get().join(',');
	};
	
	module('simpleslide: options');
	
	test('visible', function() {
		var $slide = $('#simpleslide').simpleslide({extra: 0}),
			itemWidth = $slide.find('.simpleslide-item').outerWidth(true);
		
		equal($slide.width(), itemWidth * 3, 'the default display three items');
		
		$slide.simpleslide('option', {
			visible: 5
		});
		
		// 4 is the original length of items
		equal($slide.width(), itemWidth * 4, 'When visible is greater than the slide number, visible number will set to the slide number');
	});
	
	test('scroll', function() {
		var $slide = $('#simpleslide').simpleslide({
				start: 4,
				beforeSlide: function(data) {
					var ret = getVisibleItemsText(data.newItems);
					equal(ret, '2,3,4');
				}
			});
			
		$slide.simpleslide('next');
	});
	
	asyncTest('auto: true', function() {
		var $items = null;
		
		$('#simpleslide').simpleslide({
			auto: true,
			beforeSlide: function(slide) {
				$items = slide.newItems; 
			}
		});
		
		setTimeout(function() {
			var ret = getVisibleItemsText($items);
			
			equal(ret, '2,3,4', 'default auto: 2000');
			start();
		}, 2000);
	});
	
	asyncTest('auto: 1000', function() {
		var $items = null;
		
		$('#simpleslide').simpleslide({
			auto: 1000,
			beforeSlide: function(slide) {
				$items = slide.newItems; 
			}
		});
			
		setTimeout(function() {
			var ret = getVisibleItemsText($items);
			
			equal(ret, '2,3,4', 'auto: 1000');
			start();
		}, 1000);
	});
	
	test('circular', function() {
		var $items, 
			$slide = $('#simpleslide').simpleslide({
				beforeSlide: function(slide) {
					$items = slide.newItems;
				}
			});
		
		$slide.simpleslide('prev');
		equal(getVisibleItemsText($items), '4,1,2', 'backward');
	});
	
	test('start', function() {
		var $items, 
			$slide = $('#simpleslide').simpleslide({
				start: 5,
				beforeSlide: function(slide) {
					$items = slide.oldItems;
				}
			});
		
		$slide.simpleslide('next');
		equal(getVisibleItemsText($items), '1,2,3', 'when start is greater than the last item index, start will set to the first item index');
	});
	
	test('extra', function() {
		var $slide = $('#simpleslide').simpleslide({
				extra: 0.7
			}),
			itemWidth = $slide.find('.simpleslide-item').outerWidth(true);
		
		equal($slide.width(), Math.floor(itemWidth * 0.7) * 2 + itemWidth * 3);
	});
	
}(jQuery));
