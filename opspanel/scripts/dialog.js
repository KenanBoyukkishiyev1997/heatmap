
var dialog = (function($) {

	var _posx;
	var _posy;

	function _showModal(id) {
	
		//Create the mask if it doesn't exist
		if($('#mask').length == 0) {
			$("body").append("<div id='mask'></div>");
			$('#mask').css('position', 'absolute');
			$('#mask').css('z-index', 9000);
			$('#mask').css('background-color', '#000');
			$('#mask').css('display', 'none');
			$('#mask').css('top', '0');
		}
		
		//Get the screen height and width
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();
		
		//Set height and width to mask to fill up the whole screen
        $('#mask').css({'width':maskWidth,'height':maskHeight});
		
		//hide all hideable select elements (for ie6)
		$('select.hide').hide();
		
		//transition effect     
        $('#mask').fadeIn(1000);    
        $('#mask').fadeTo("slow",0.5);  
     
        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();
               
        //Set the popup window to center
        $(id).css('top',  winH/2-$(id).height()/2);
        $(id).css('left', winW/2-$(id).width()/2);
     
        //transition effect
        $(id).fadeIn(2000); 
	}
	
	function _hideModal(id) {
		//show all hideable select elements (for ie6)
		$('select.hide').show();
		
		$(id).hide();
		$('#mask').hide();
	}
	
	function _showError(text) {
		//Create the div if it doesn't exist
		if($('#error').length == 0) {
			$("body").append("<div id='error'></div>");
			$('#error').css('position', 'absolute');
			$('#error').css('border', '2px solid #FFAEAE');
			$('#error').css('background-color', '#FFEEBE');
			$('#error').css('display', 'none');
			$('#error').css('top', '30%');
			$('#error').css('width', '70%');
			$('#error').css('left', '15%');
			$('#error').css('z-index', 9999);
			$('#error').css('padding', '20px');
		}
		
		$('#error').show();
		$('#error').html('<span id="text">' + text + '</span>');
		window.setTimeout("$('#error').hide();", 5000);
	}
	
	function _showInfo(text) {
		//Create the div if it doesn't exist
		if($('#info').length == 0) {
			$("body").append("<div id='info'></div>");
			$('#info').css('position', 'absolute');
			$('#info').css('border', '2px solid #B8E2FB');
			$('#info').css('background-color', '#E8F6FF');
			$('#info').css('display', 'none');
			$('#info').css('top', '30%');
			$('#info').css('width', '70%');
			$('#info').css('left', '15%');
			$('#info').css('z-index', 9999);
			$('#info').css('padding', '20px');
		}
		
		$('#info').show();
		$('#info').html('<span id="text">' + text + '</span>');
		window.setTimeout("$('#info').hide();", 5000);
	}
	
	function _showPopup(divId) {
		//$(divId).css('top', window.event.clientY);
		//$(divId).css('left', window.event.clientX);
		
		$(divId).css('top', _posy);
		$(divId).css('left', _posx);
		
		$(divId).show();
	}
	
	function _hidePopup(divId) {
		$(divId).hide();
	}
	
	function getMouse(e) {
		_posx=0;
		_posy=0;
		var ev=(!e)?window.event:e; //IE:Moz
		
		if (ev.pageX) { //Moz
			_posx=ev.pageX+window.pageXOffset;
			_posy=ev.pageY+window.pageYOffset;
		} else if (ev.clientX) { //IE
			_posx=ev.clientX+document.body.scrollLeft;
			_posy=ev.clientY+document.body.scrollTop;
		} else {
			return false; //old browsers
		}
	}
	document.onmousemove=getMouse
	
	return {
	
		showModal : function(divId) {
			_showModal(divId);
		},
		
		hideModal : function(divId) {
			_hideModal(divId);
		},
		
		showError :  function(text) {
			_showError(text);
		},
		
		showMessage : function(text) {
			_showInfo(text);
		},
		
		showPopup : function(divId) {
			_showPopup(divId);
		},
		
		hidePopup : function(divId) {
			_hidePopup(divId);
		}
		
	}
	
})(jQuery);
