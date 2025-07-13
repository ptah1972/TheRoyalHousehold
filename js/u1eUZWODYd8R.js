var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

/*
 * Behavior for the automatic file upload
 */

(function ($) {
  Drupal.behaviors.autoUpload = {
    attach: function(context, settings) {
      $('.form-item input.form-submit[value=Upload]', context).hide();
      $('.form-item input.form-file', context).change(function() {
        $parent = $(this).closest('.form-item');

        //setTimeout to allow for validation
        //would prefer an event, but there isn't one
        setTimeout(function() {
          if(!$('.error', $parent).length) {
            $('input.form-submit[value=Upload]', $parent).mousedown();
          }
        }, 100);
      });
    }
  };
})(jQuery);
;
/**
 * @file
 * Makes ajax calls to the shortcodes social oembed URL to embed social posts.
 */

(function ($) {
  'use strict';
  Drupal = Drupal || {};
  Drupal.behaviors = Drupal.behaviors || {};
  Drupal.behaviors.shortcodeSocial = {
    attach: function (context) {
      var embeds = $(".shortcode-social", context);

      embeds.each(function (item) {
        var type = $(this).attr('class').split(' ')[1];
        var current_embed = $(this);
        var embed_url = '';
        switch (type) {
          case 'twitter':
            embed_url = 'https://web.archive.org/web/20210304144719/https://api.twitter.com/1/statuses/oembed.json?url=' + $(this).attr('data');
            break;

          case 'instagram':
            embed_url = 'https://web.archive.org/web/20210304144719/https://instagram.com/publicapi/oembed/?url=' + $(this).attr('data');
            break;

          case 'flickr':
            embed_url = '//web.archive.org/web/20210304144719/https://www.flickr.com/services/oembed.json/?url=' + $(this).attr('data');
            break;

          case 'facebook':
              embed_url = '//web.archive.org/web/20210304144719/https://www.facebook.com/plugins/post/oembed.json/?url=' + $(this).attr('data');
        }

        if ($(this).attr('width')) {
          embed_url = embed_url + '&maxwidth=' + $(this).attr('width');
        }

        // Flickr oembed is broken and doesn't work with jsonp.
        if (type !== 'flickr') {
          $.ajax({
            url: embed_url,
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
              current_embed.html(data.html);
            },
            error: function (e, s, t) {
            }
          });
        }
        else {
          $.ajax({
            url: embed_url,
            dataType: "jsonp",
            jsonp: 'jsoncallback',
            success: function (data) {
              current_embed.html(data.html);
            },
            error: function (e, s, t) {
            }
          });
        }
      });
    }
  };
}(jQuery));
;
/**
 * @file
 * Lazyloader JQuery plugin
 *
 * @author: Daniel Honrade http://drupal.org/user/351112
 *
 * Settings:
 * - distance = distance of the image to the viewable browser screen before it gets loaded
 * - icon     = animating image that appears before the actual image is loaded
 *
 */

(function($){

  // Window jQuery object global reference.
  var $window;

  // Process lazyloader
  $.fn.lazyloader = function(options){
    var settings = $.extend($.fn.lazyloader.defaults, options);
    var images = this;

    if (typeof($window) == 'undefined') {
      $window = $(window);
    }

    // add the loader icon
    if(settings['icon'] != '') $('img[data-src]').parent().css({ position: 'relative', display: 'block'}).prepend('<img class="lazyloader-icon" src="' + settings['icon'] + '" />');

    // Load on refresh
    loadActualImages(images, settings);

    // Load on scroll
    $window.bind('scroll', function(e) {
      loadActualImages(images, settings);
    });

    // Load on resize
    $window.resize(function(e) {
      loadActualImages(images, settings);
    });

    return this;
  };

  // Defaults
  $.fn.lazyloader.defaults = {
    distance: 0, // the distance (in pixels) of image when loading of the actual image will happen
    icon: ''    // display animating icon
  };


  // Loading actual images
  function loadActualImages(images, settings){
    clearTimeout($.fn.lazyloader.timeout);

    $.fn.lazyloader.timeout = setTimeout(function(){
      images.each(function(){
        var $image = $(this);
        var imageHeight = $image.height(), imageWidth = $image.width();
        var iconTop = Math.round(imageHeight/2), iconLeft = Math.round(imageWidth/2), iconFactor = Math.round($image.siblings('img.lazyloader-icon').height()/2);
        $image.siblings('img.lazyloader-icon').css({ top: iconTop - iconFactor, left: iconLeft - iconFactor });

        if (windowView(this, settings) && ($image.attr('data-src'))) {
          loadImage(this);
          $image.fadeIn('slow');
        }
      });
    }, 50);
  };


  // Check if the images are within the window view (top, bottom, left and right)
  function windowView(image, settings){
    var $image = $(image);
    // window variables
    var windowHeight = $window.height(),
        windowWidth  = $window.width(),

        windowBottom = windowHeight + $window.scrollTop(),
        windowTop    = windowBottom - windowHeight,
        windowRight  = windowWidth + $window.scrollLeft(),
        windowLeft   = windowRight - windowWidth,

        // image variables
        imageHeight  = $image.height(),
        imageWidth   = $image.width(),

        imageTop     = $image.offset().top - settings['distance'],
        imageBottom  = imageTop + imageHeight + settings['distance'],
        imageLeft    = $image.offset().left - settings['distance'],
        imageRight   = imageLeft + imageWidth + settings['distance'];

           // This will return true if any corner of the image is within the screen
    return (((windowBottom >= imageTop) && (windowTop <= imageTop)) || ((windowBottom >= imageBottom) && (windowTop <= imageBottom))) &&
           (((windowRight >= imageLeft) && (windowLeft <= imageLeft)) || ((windowRight >= imageRight) && (windowLeft <= imageRight)));
  };


  // Load the image
  function loadImage(image){
    var $image = $(image);
    $image.hide().attr('src', $image.data('src')).removeAttr('data-src');
    $image.load(function() {
      $image.siblings('img.lazyloader-icon').remove();
    });
  };

})(jQuery);
;


}
/*
     FILE ARCHIVED ON 14:47:19 Mar 04, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:48:16 Jul 13, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.57
  exclusion.robots: 0.016
  exclusion.robots.policy: 0.007
  esindex: 0.009
  cdx.remote: 106.729
  LoadShardBlock: 1493.38 (6)
  PetaboxLoader3.resolve: 826.67 (3)
  PetaboxLoader3.datanode: 558.674 (7)
  load_resource: 269.979
*/