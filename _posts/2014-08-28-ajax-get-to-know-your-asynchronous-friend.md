---
layout: post
title: "AJAX - Get to Know Your Asynchronous Friend"
author: JessRudder
date: 2014-08-28 18:33:35 -0400
categories: ajax xml json
images:
- images/@stock/post-7.jpg
excerpt:
  AJAX!  It's a small acronoym for a heavy weight in the world of web development. It stands for **A**synchronous **J**avascript **a**nd **X**ML.
---

AJAX!  It's a small acronoym for a heavy weight in the world of web development.

It stands for **A**synchronous **J**avascript **a**nd **X**ML.  Which is a fancy way of saying that you can use Javascript and XML (and now JSON or even plain text) to send and receive data on a webpage without having to send the user to a new page or interrupt the activity on the current page.

Here's an example of a simple AJAX call made in jQuery (taken from the [AJAX wikipedia page](http://en.wikipedia.org/wiki/Ajax_\(programming\))):

```javascript
$.get('send-ajax-data.php', function(data) {
    alert(data);
});
```

Let's follow this AJAX call on it's journey through the stack:

1. The visitor initially comes to the page where the jQuery is hanging out
2. The jQuery code is activated (usually when the page loads or a button is pressed depending on how the code is written)
3. A GET request is sent to the 'send-ajax-data.php' page using an XMLHttpRequest object (which is what allows the request to be made asynchronously)
4. The 'send-ajax-data.php' page receives the request and sends a response as XML, JSON, a Javascript file or plain text
5. The initial page the visitor is on opens an alert window which displays the data it received as a response

Thanks to the XMLHttpRequest object, this is all done behind the scenes while the visitor is still able to interact with the initial page that they are on.

Here's a bit more complex example from a recent project I worked on.  The AJAX call hits the Weather Underground hourly data page for NY and returns a JSON object with a ton of data including the temperature, the UV index, wind speed/direction and more.  

I parse that data in the sucess callback, pulling out only what I need for my project.  This data is then used (in a non-excerpted part of the code) to make an hourly graph of the temperature for the past 24 hours.

```javascript
$.ajax({ 
  url: "http://api.wunderground.com/api/API_KEY/hourly/q/NY/New_York.json", 
  dataType: 'jsonp', 
  success: function (weather_data_full) {
    var weather_data_parsed = weather_data_full['hourly_forecast'],
        hourData = [],
        tempData = [],
        i = 0;
    $.each(weather_data_parsed, function() {
        hourData.push(weather_data_parsed[i]['FCTTIME']['hour']),
        tempData.push(weather_data_parsed[i]['temp']['english']);
        i++;
});
```
As you can see, there's more going on, but, at it's core, it's the same as the simpler AJAX request above.

AJAX is definitely useful, but I don't want to pretend it's all sunshine and roses.  This isn't the first technology in history that magically has no tradeoffs.  Here are some of the issues you should consider when deciding whether or not to utilize AJAX:

* Things are happening on a single page so there are no permalinks people can use for bookmarking that specific content on your site.  **PJAX** attempts to address this by providing permalink functionality to AJAX requests, but AJAX itself won't cut it.

* The asynchronisity that makes AJAX so awesome and useful also makes it very hard to test and debug when something goes wrong.  When lines of code are executed in a nice, clean order, it's easier to track down the issue.  AJAX does what it wants, when it wants (not exactly, but you get the idea).  Did something break because the AJAX request isn't correct?  Because the AJAX fired too soon?  Because the AJAX fired too late?  Because of something not at all related to the AJAX and you need to stop blaming Javascript for everything??!?  Have fun spending the next 5 hours of your life figuring that one out.

* Web crawlers usually ignore javascript (and flash and anything else besides text and HTML you've added to your site to make it interesting).  If you're loading key content through AJAX, the crawler won't see it unless you provide it with an alternative way to get that content.  You can pretend you're too cool for webcrawlers, but, at the end of the day, if you're not aready a hot destination on the internet, you'll need search engines to bring you traffic.

What interesting uses of AJAX have you seen?  Have you had any hilarious (or frustrating) AJAX experiences (like Catherine with her [Premature AJAXulation](http://anunexpectedcoder.com/blog/2014/08/10/premature-ajaxulation/))?  Let me know in the comments!  
