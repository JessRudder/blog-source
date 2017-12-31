var youTube = (function() {
  'use strict';

  var youTube = {
    init: function() {
      $(".bt-video-container a.youtube").each(function(index) {
        var $this = $(this);

        var youtubeId = $this.data("videoid");
        $this.html(''); // empty any placeholders
        $this.prepend('<div class="bt-video-container-div"></div>&nbsp;'); 
        $this.css("background", "#000 url(http://i2.ytimg.com/vi/"+youtubeId+"/maxresdefault.jpg) center center no-repeat"); // Use poster image from YT as background
        
        
        var embedUrl = '//www.youtube-nocookie.com/embed/'+youtubeId+'?autoplay=1&rel=0'; // create an embed url.
        // no protocol
        // youtube-nocookie: prevent additional user tracking
        // autoplay: because user already clicked
        // rel=0: no "Related Videos" at end
        
        // set up the embed iframe
        var videoFrame = '<iframe width="'+parseInt($this.data("width"),10)+'" height="'+parseInt($this.data("height"),10)+'" style="vertical-align:top;" src="'+embedUrl+'" frameborder="0" allowfullscreen></iframe>';

        $this.click(function(ev){ // replace link with iframe on click
          ev.preventDefault();
          $this.replaceWith(videoFrame);
          return false;
        });
      });
    }
  }

  return youTube;

})();

// init at an opportune time
youTube.init();
