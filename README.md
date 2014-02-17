# Simple slideshow

A simple slideshow jQuery plugin, practical, flexible, supporting both horizontal and vertical scrolling.

![Simpleslide](https://github.com/nicolaszhao/simpleslide/blob/master/simpleslide.png)

**Current version:** [1.0.0](https://github.com/nicolaszhao/simpleslide/archive/v1.0.0.tar.gz)

## Usage
Include jQuery and the plugin on your page. Then select an element containing multiple sub-items and call the simpleslide method on DOM ready.

	<script src="jquery.js"></script>
	<script src="jquery.timeselector.js"></script>
	<script>
		$(function() {
			$('#simpleslide').simpleslide();
		});
	</script>
	<div id="simpleslide">
		<div>1</div>
		<div>2</div>
		<div>3</div>
		<div>4</div>
	</div>

## Options
**visible** (default: 3)   
Type: Number   
This specifies the number of items visible at all times within the slide.

***

**scroll** (default: 1)   
Type: Number   
The number of items to scroll when you click the next or prev buttons. 

***

**duration** (default: 800)   
Type: Number   
A number determining how long the animation will run.

***

**auto** (default: false)   
Type: Boolean or Number   
Defines a `Boolean` value to determine whether to enable auto-scroll, default is `2000` milliseconds once rolling, or specifying a millisecond value directly。

***

**circular** (default: true)   
Type: Boolean   
Setting it to true enables circular navigation.

***

**vertical** (default: false)   
Type: Boolean    
Determines the direction of the slide.

***

**prev** (default: null)   
Type: jQuery or Element or Selector    
The element to use as event trigger for previous slide.

***

**next** (default: null)   
Type: jQuery or Element or Selector    
The element to use as event trigger for next slide.

***

**showButtons** (default: true)   
Type: Boolean   
Defines whether to display the default 'Previous' and 'Next' buttons.

***

**buttonOffset** (default: 0.5)   
Type: Number   
The default navigation buttons offset relative to the edge of the Slide.

***

**easing** (default: null)   
Type: String   
A string indicating which easing function to use for the transition.

***

**start** (default: 0)   
Type: Number   
Zero-based index of the first slide to be displayed.

***

**extra** (default: 0.5)   
Type: Number   
Visible items on both sides to show extra width there are more items can be displayed, if the `circular` is `true` on both sides of the increase, if it is `false` to increase only on one side. This value is calculated based on the width of the Item.

## Methods
**option( options )**  
Returns: jQuery   
Set one or more options for the simpleslide.
	
* **options**   
	Type: Object   
	A map of option-value pairs to set.
	
**Code example:**
	
	$('#simpleslide').simpleslide('option', {'visible': 4});

***

**next()**   
Returns: jQuery   
This method is used to manually navigate to the next slide.

**Code example:**
	
	$('#simpleslide').simpleslide('next');

***

**prev()**   
Returns: jQuery   
This method is used to manually navigate to the previous slide.

**Code example:**
	
	$('#simpleslide').simpleslide('prev');

***

**repeat()**   
Returns: jQuery   
When the `auto` option is true, and manually run the `.stop()` method, you can manually execute the method to trigger auto-scroll.

**Code example:**
	
	$('#simpleslide').simpleslide('repeat');

***

**stop()**   
Returns: jQuery   
When the `auto` option is true, you can manually execute the method to stop the auto-scroll.

**Code example:**
	
	$('#simpleslide').simpleslide('stop');
	
## Callbacks
**beforeSlide( slide )**  
Triggered the callback before scroll to the next slide.

* **slide**   
	Type: Object   
	* **oldItems**   
		Type: jQuery   
		The elements representing the items that are visible before the transition.
	
	* **newItems**    
		Type: jQuery    
		The elements representing the items that are visible after the transition.
		
## Theming
If the simpleslide specific styling is needed, the following CSS class names can be used:
* `simpleslide`: The outer container of the slide items.
	* `simpleslide-button`: The slide navigation buttons. The previous button will additionally have a `simpleslide-prev` class and the next button will additionally have a `simpleslide-next` class.

## Dependencies
### Required
[jQuery, tested with 1.10.2](http://jquery.com)

## License
Copyright (c) 2014 Nicolas Zhao; Licensed MIT

 		
	

