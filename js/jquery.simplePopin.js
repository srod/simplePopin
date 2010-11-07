/* simplePopin - jQuery plugin
 * 
 * This plugin is used to show popins on a web page.
 * 
 * How to use:
 *
 * jQuery(".links").simplePopin({
 *     type: "inline", // iframe, inline, image
 *     width: 300,
 *     height: 300
 * });
 * 
 * Developed with jQuery version: 1.4.3
 * 
 * Version: 0.1
 * Name: simplePopin
 * 
 * Author: Rodolphe Stoclin
 * E-mail: rodolphe@2clics.net
 * Web: http://www.2clics.net
 */
 
(function($) {
	$.fn.simplePopin = function(method){
		var methods = {
			init: function(options){
				var settings = {
					type: "inline",
					width: 500,
					height: 300,
					opacity: 0.5,
					imageLoader: "img/loadingAnimation.gif"
				};
				
				simplePopin.settings = $.extend(settings, options);
				
				simplePopin.createOverlay();
				simplePopin.createPopin();
				simplePopin.createLoader();
				simplePopin.bindClose();
				
				return this.each(function(){
					simplePopin.run(this);
				});
			},
			show: function(){
				simplePopin.showOverlay();
				simplePopin.showPopin();
				simplePopin.hideLoader();
			},
			hide: function(){
				simplePopin.hideOverlay();
				simplePopin.hidePopin();
				simplePopin.hideLoader();
			},
			destroy: function(){
				$("#SP-Overlay").unbind("click.simplePopin");
				$("#SP-Popin .close-popin").die("click.simplePopin");
				$(window).unbind("resize.simplePopin");
				
				simplePopin.destroyOverlay();
				simplePopin.destroyPopin();
				simplePopin.destroyLoader();
			},
			reposition: function(){
				simplePopin.center("#SP-Popin", simplePopin.settings.width, simplePopin.settings.height);
			},
			update: function(content){
				simplePopin.updateContent(content);
			}
		};
		
		var simplePopin = {};
		
		simplePopin.settings = {};
		
		simplePopin.createOverlay = function(){
			if(!$("#SP-Overlay").length){
				$("<div></div>").appendTo("body").attr({ id: "SP-Overlay" }).css("opacity", this.settings.opacity);
				$("#SP-Overlay").bind("click.simplePopin", function(){
					methods.hide();
				});
				
				if(simplePopinTools.isIE6()){
					var overlayHeight = (simplePopinTools.windowHeight() > $("body").height()) ? simplePopinTools.windowHeight() : $("body").height();
					var overlayWidth = $("body").width();
					$("#SP-Overlay").css({ position: "absolute", height: overlayHeight + "px", width: overlayWidth + "px" });
				}
			}
		};
		
		simplePopin.destroyOverlay = function(){
			$("#SP-Overlay").remove();
		};
		
		simplePopin.showOverlay = function(){
			$("#SP-Overlay").fadeIn();
		};
		
		simplePopin.hideOverlay = function(){
			$("#SP-Overlay").fadeOut();
		};
		
		simplePopin.createLoader = function(){
			if(!$("#SP-Loader").length){
				$("<div></div>").appendTo("body").attr({ id: "SP-Loader" });
				
				var img = new Image();
				img.onload = function(){
					img.onload = null;
					
					simplePopin.settings.imageLoaderWidth = img.width;
					simplePopin.settings.imageLoaderHeight = img.height;
					
					$("<img />")
						.appendTo("#SP-Loader")
						.attr({ src: simplePopin.settings.imageLoader });
					
					simplePopin.fixLoader();
				}
				img.src = this.settings.imageLoader;
			}
		};
		
		simplePopin.destroyLoader = function(){
			$("#SP-Loader").remove();
		};
		
		simplePopin.showLoader = function(){
			simplePopin.fixLoader();
			$("#SP-Loader").fadeIn();
		};
		
		simplePopin.hideLoader = function(){
			$("#SP-Loader").fadeOut();
		};
		
		simplePopin.fixLoader = function(){
			$("#SP-Loader").css({ width: simplePopin.settings.imageLoaderWidth + "px", height: simplePopin.settings.imageLoaderHeight + "px" });
			this.center("#SP-Loader", simplePopin.settings.imageLoaderWidth, simplePopin.settings.imageLoaderHeight);
		};
		
		simplePopin.createPopin = function(){
			if(!$("#SP-Popin").length){
				$("<div></div>").appendTo("body").attr({ id: "SP-Popin" });
			}
		};
		
		simplePopin.destroyPopin = function(){
			$("#SP-Popin").remove();
		};
		
		simplePopin.showPopin = function(){
			simplePopin.fixPopin();
			$("#SP-Popin").fadeIn();
		};
		
		simplePopin.hidePopin = function(){
			$("#SP-Popin").fadeOut(function(){
				$(this).empty();
			});
		};
		
		simplePopin.fixPopin = function(){
			$("#SP-Popin").css({ width: this.settings.width + "px", height: this.settings.height + "px" });
			this.center("#SP-Popin", this.settings.width, this.settings.height);
		};
		
		simplePopin.center = function(elt, width, height){
			if((height > simplePopinTools.windowHeight()) && (width > simplePopinTools.windowWidth())){
				$(elt).css("left", 0);
				$(elt).css("top", 0);
			} else if(height > simplePopinTools.windowHeight()){
				$(elt).css("left", Math.round(simplePopinTools.windowWidth()/2) - Math.round(width/2));
				$(elt).css("top", 0);
			} else if(width > simplePopinTools.windowWidth()){
				$(elt).css("left", 0);
				$(elt).css("top", Math.round(simplePopinTools.windowHeight()/2) - Math.round(height/2));
			} else {
				$(elt).css("left", Math.round(simplePopinTools.windowWidth()/2) - Math.round(width/2));
				$(elt).css("top", Math.round(simplePopinTools.windowHeight()/2) - Math.round(height/2));
			}
		};
		
		simplePopin.createIframeContent = function(){
			simplePopin.showLoader();
			simplePopin.fixPopin();
			
			$('<iframe src="' + this.settings.url + '" frameborder="0" hspace="0" onload="javascript:jQuery().simplePopin(\'show\');"></iframe>')
				.appendTo("#SP-Popin")
				.attr({ id: "SP-Iframe", name: "SP-Iframe" })
				.css({ width: this.settings.width + "px", height: this.settings.height + "px" });
		};
		
		simplePopin.createInlineContent = function(){
			$("#SP-Popin").html( $("#" + this.settings.url.split("#")[1]).html() );
		};
		
		simplePopin.createImageContent = function(){
			simplePopin.showLoader();
			
			var img = new Image();
			img.onload = function(){
				img.onload = null;
				
				var arraySize = simplePopinTools.resizeImage(img);
				
				simplePopin.settings.width = arraySize[0];
				simplePopin.settings.height = arraySize[1];
				
				$("<img />")
					.appendTo("#SP-Popin")
					.attr({ src: simplePopin.settings.url, width: simplePopin.settings.width, height: simplePopin.settings.height });
				
				methods.show();
			}
			img.src = this.settings.url;
		};
		
		simplePopin.bindClose = function(){
			$("#SP-Popin .close-popin").unbind("click.simplePopin").live("click.simplePopin", function(e){
				e.preventDefault();
				methods.hide();
			});
			
			document.onkeyup = function(e){ 	
				var keycode = event.keyCode || e.which;
				if(keycode == 27){
					methods.hide();
				}	
			};
		};
		
		simplePopin.bindResize = function(){
			$(window).unbind("resize.simplePopin").bind("resize.simplePopin", function(){
				simplePopin.center("#SP-Popin", simplePopin.settings.width, simplePopin.settings.height);
			});
		};
		
		simplePopin.updateContent = function(content){
			$("#SP-Popin").html(content);
		};
		
		simplePopin.run = function(elt){
			var obj = $(elt);
			simplePopin.settings.url = elt.href;
			
			obj.click(function(e){
				e.preventDefault();
				
				simplePopin.bindResize();
				
				switch(simplePopin.settings.type){
					case "iframe":
						simplePopin.createIframeContent();
						break;
					case "inline":
						simplePopin.createInlineContent();
						methods.show();
						break;
					case "image":
						simplePopin.createImageContent();
						break;
				}
				
				simplePopin.showOverlay();
			});
		};
		
		var simplePopinTools = {}
		
		simplePopinTools.windowHeight = function(){
			return $(window).height();
		};
		
		simplePopinTools.windowWidth = function(){
			return $(window).width();
		};
		
		simplePopinTools.resizeImage = function(img){ // image resizing - original by ThickBox 3.1 - http://jquery.com/demo/thickbox/
			var x = simplePopinTools.windowWidth() - 50;
			var y = simplePopinTools.windowHeight() - 50;
			var imageWidth = img.width;
			var imageHeight = img.height;
			if(imageWidth > x){
				imageHeight = imageHeight * (x / imageWidth);
				imageWidth = x;
				if(imageHeight > y){
					imageWidth = imageWidth * (y / imageHeight);
					imageHeight = y;
				}
			} else if (imageHeight > y){
				imageWidth = imageWidth * (y / imageHeight);
				imageHeight = y;
				if(imageWidth > x) {
					imageHeight = imageHeight * (x / imageWidth);
					imageWidth = x;
				}
			}
			
			return [imageWidth, imageHeight];
		};
		
		simplePopinTools.isIE6 = function(){
			return (jQuery.browser.msie && jQuery.browser.version == 6) ? true : false;
		};
		
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ( typeof method === 'object' || ! method ){
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.simplePopin');
		}
	};
})(jQuery);