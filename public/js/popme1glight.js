var PageTransitions = (function() {
	var Modernizr = window.Modernizr;

	var curDegree = 0;
	var colorShift = "hsl(0,100%,100%)";
	var colorShift2 = "hsl(0,100%,100%)";

	var containerAdd = 0;

	var $main = $( '#pt-main' ),
		$pages = $main.children( 'div.pt-page' ),
		$page1 = $('#page1'),
		$page2 = $('#page2'),
		$testclick = $('#testclick'),
		$steamFrame = $('#steamFrame'),
		$slide1 = $('#slide1'),
		$slide2 = $('#slide2'),
		$slideinfo = $(".slideinfo"),
		$header = $('#header'),
		$title = $('#title'),
		$sliderContainer = $("#sliderContainer"),
		$doitcontainer = $('#doingItContainer'),
		$doitcolumncontainer = $(".doitcolumncontainer"),
		$steamFrameContainer = $("#steamFrameContainer"),
		$steamLoginButton = $("#steamLoginButton"),
		$columnCovers = $(".columnCover"),
		$column1cover = $("#column1cover"),
		$column2cover = $("#column2cover"),
		$column3cover = $("#column3cover"),
		$codeGenerate = $("#codeGenerate"),
		$stepColumns = $('.stepColumns'),
		$slide1svg = $('.slide1svg'),
		$slide1arrow = $('.slide1arrow'),
		$slide1centerer = $('.centerer'),
		$slide1infotext = $('.infotext'),
		$backDiv = $('#backDiv'),
		$downArrow = $('.downArrow'),
		$topLeftFrame = $('#topLeftFrame'),
		$topFrame = $('#topFrame'),
		$topRightFrame = $('#topRightFrame'),
		$leftFrame = $('#leftFrame'),
		$rightFrame = $('#rightFrame'),
		$bottomLeftFrame = $('#bottomLeftFrame'),
		$bottomFrame = $('#bottomFrame'),
		$bottomRightFrame = $('#bottomRightFrame'),
		$topLeftPattern = $('#topLeftPattern'),
		$topPattern = $('#topPattern'),
		$topRightPattern = $('#topRightPattern'),
		$leftPattern = $('#leftPattern'),
		$rightPattern = $('#rightPattern'),
		$bottomLeftPattern = $('#bottomLeftPattern'),
		$bottomPattern = $('#bottomPattern'),
		$bottomRightPattern = $('#bottomRightPattern'),
		animateVoteYes = true,
		animateSVGiter = 0,
		pagesCount = $pages.length,
		current = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		// support css animations
		support = Modernizr.cssanimations;

	var loggedIn = false;

	window.onload = init();

	function update(){
		curDegree +=4; 
		colorShift = hslToHex(curDegree , 0.6, 0.6); //"hsl(" + (curDegree + scrollAmt/4) + ", 60%, 60%)";
		colorShift2 = hslToHex(curDegree+180 , 0.6, 0.6);

		$('.lachCursor').css("background-color", colorShift);		
		$page1.css({
			"background": colorShift,
			"color": colorShift
		});
		$page2.css({
			"background": colorShift2,
			"color": colorShift2
		});;
		$('#linePattern1').attr('stroke',colorShift);
		$('#linePattern2').attr('stroke',colorShift);

		$('h3').css({
			'color': colorShift2
		});

		var titleHeight = $title.outerHeight();
		var headerHeight = $header.outerHeight();
		var containerHeight = headerHeight-titleHeight+containerAdd;
		$sliderContainer.css('height', containerHeight+"px");
		
		var slideinfoMarginsize = ($slideinfo.outerWidth(true) - $slideinfo.outerWidth());
		$slideinfo.css({
			'height': containerHeight-slideinfoMarginsize+"px",
			'margin-top': slideinfoMarginsize/2+'px',
			});

		$slide1svg.css({
			'fill': colorShift
		});

		$slide1arrow.css({
			'fill': colorShift
		});

		$slide1centerer.css({
			'line-height': $slide1infotext.outerHeight() +"px"
		});

		$doitcolumncontainer.css({
			'height': $doitcontainer.outerHeight() - slideinfoMarginsize + 'px',
			'width': $doitcontainer.outerWidth() - slideinfoMarginsize + 'px',
			'top': slideinfoMarginsize/2 + 'px',
			'left': slideinfoMarginsize/2 + 'px'
		});

		$columnCovers.css({
			'height': $doitcolumncontainer.outerHeight() + 'px',
			'padding-top': $doitcolumncontainer.outerHeight()/2 +'px'
		})

		$steamFrameContainer.css({
			'border-color': colorShift
		});

		$codeGenerate.css({
			'border-color': colorShift
		});

 	//console.log($steamFrame.contents().find("#ig_bottom").height());

	};


	function rgb2hex(r,g,b) {
	  var rgb = [r.toString(16),g.toString(16),b.toString(16)]
	  for (var i=0;i<3;i++) {
	    if (rgb[i].length==1) rgb[i]=rgb[i]+rgb[i];
	  }
	  if(rgb[0][0]==rgb[0][1] && rgb[1][0]==rgb[1][1] && rgb[2][0]==rgb[2][1])
	    return '#'+rgb[0][0]+rgb[1][0]+rgb[2][0];
	  return '#'+rgb[0]+rgb[1]+rgb[2];
	};

	function hslToHex(h, s, l) {
		while(h>360){ h = h - 360;}
		h/=360;
		var r, g, b;
		 
		if (s == 0) {
		    r = g = b = l; // achromatic
		 } else {
		    function hue2rgb(p, q, t) {
			      if (t < 0) t += 1;
			      if (t > 1) t -= 1;
			      if (t < 1/6) return p + (q - p) * 6 * t;
			      if (t < 1/2) return q;
			      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			      return p;
		    }
	 
		    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		    var p = 2 * l - q;
		 
		    r = Math.floor(hue2rgb(p, q, h + 1/3) * 255);
		    g = Math.floor(hue2rgb(p, q, h) * 255);
		    b = Math.floor(hue2rgb(p, q, h - 1/3) * 255);
	  	}
	 
	 	return rgb2hex(r,g,b);
	 };

	function init() {

		$.post( "/readyToVote", function( data ) {
				if(data.steamID){
					$column1cover.css({
					'width': '100%'
				});
					$steamFrame[0].src = 'http://steamcommunity.com/sharedfiles/filedetails/?id=93935251#VoteUpBtn';
				}
			});

		$.get("/percentKeys", function(data){
			if(data){
				var percentLeft = data.keysLeft;
				var inverse = 100 - percentLeft;
				$('#giftBar').css('right', (inverse + 0.5)+"%");
				$('#giftKeyPercentLeft').text(percentLeft+"% OF KEYS LEFT");
			}
		});

		$('#faq').niceScroll({
			cursorwidth: "7px",
			cursorborder: "none",
			bouncescroll: 'true',
			cursorcolor: '#ffffff',
			cursorborderradius: '0'
		});

		setInterval(function(){
			update();
		}, 100);

		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );

		$pages.eq( current ).addClass( 'pt-page-current' );

		$slide1.click(function() {
		  $slide1.css("left","-100%");
		  $slide2.css("left","0");
		  $backDiv.css("opacity", "1");
		});

		$backDiv.click(function() {
		  $slide1.css("left","0");
		  $slide2.css("left","100%");
		  $backDiv.css("opacity", "0");
		  containerAdd = 0;
		  $('#downDiv').removeClass("hovered");
		  $downArrow.css({
					'transform': 'rotate(0deg)',
					'-ms-transform': 'rotate(0deg)',
					'-webkit-transform': 'rotate(0deg)'
		   });
		});


		$('#downDiv').click(function(event){
			event.stopPropagation();

			$('#downDiv').toggleClass("hovered");
			if(containerAdd > 0){
				containerAdd = 0;
				$downArrow.css({
					'transform': 'rotate(0deg)',
					'-ms-transform': 'rotate(0deg)',
					'-webkit-transform': 'rotate(0deg)'
				});
			}
			else{
				containerAdd = $doitcontainer.outerHeight() + ($doitcontainer.offset().top - ($header.offset().top + $header.outerHeight()));
				$downArrow.css({
					'transform': 'rotate(180deg)',
					'-ms-transform': 'rotate(180deg)',
					'-webkit-transform': 'rotate(180deg)'
				});
			}
		});


		$('#linePattern1').attr('stroke','#FFFFFF');
		//$('#linePattern2').attr('stroke','#FF00FF');

		$doitcolumncontainer.scroll(function(event){
			$doitcolumncontainer.scrollTop(0);
		});

		$column1cover.css({
			'width': '0'
		});

		$steamLoginButton.click(function(){
			//?
			
		});
		
		//$steamFrame.load(steamFrameLoaded());

		$steamFrame.iframeTracker({
			blurCallback: function(){
				$.post( "/upvoted", function( data ) {
					if(data.giftkey){
						$column3cover.css({
							'width': '0'
						});

						$column2cover.css({
							'width': '100%'
						});

						setTimeout(function() {
     						$steamFrameContainer.empty();
						}, 3000);

						$column3cover.empty();
						$('#giftCodeBro').find("a").attr("href",data.giftkey);
						$('#giftCodeBro').find("a").text(data.giftkey);
					}
				});
			}
		});

		$codeGenerate.click(function(){
			if( isAnimating ) {
				return false;
			}
			nextPage();
		});
	};

	steamFrameLoaded = function steamFrameLoaded(){
		$column2cover.css({
			'width': '0'
		});
		$column2cover.empty();
	};

	function nextPage() {

		if( isAnimating ) {
			return false;
		}

		isAnimating = true;
		
		var $currPage = $pages.eq( current );

		if( current < pagesCount - 1 ) {
			++current;
		}
		else {
			current = 0;
		}

		var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
			outClass = 'pt-page-rotateBottomSideFirst', inClass = 'pt-page-moveFromBottom pt-page-delay300 pt-page-ontop';

		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}

	}

	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage( $outpage, $inpage );
		isAnimating = false;
	}

	function resetPage( $outpage, $inpage ) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
	}
	return { init : init };

})();