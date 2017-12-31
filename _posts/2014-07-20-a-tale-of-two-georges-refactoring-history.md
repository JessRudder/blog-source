---
layout: post
title: "A Tale of Two Georges: Refactoring History with the N+1 Problem"
author: JessRudder
date: 2014-07-20 18:26:51 -0400
categories: n-plus-1 sql activerecord
images:
- images/@stock/post-6.jpg
excerpt:
  The lower Manhattan 'hood of the Flatiron School is steeped in history.  But not just any history - Revolutionary History.  And, as any red-blooded American with a patriotic tattoo will attest, there is no more historicky history than that because...'Murica!
---

The lower Manhattan 'hood of the Flatiron School is steeped in history.  But not just any history - Revolutionary History.  And, as any red-blooded American with a patriotic tattoo will attest, there is no more historicky history than that because...__'Murica__.

{% img img-center /images/posts/murica.jpg 500px 900px 'Murica' title:'Murica' %}

The date is July 9, 1776.  Tension has been rising between Great Britain and the colonies over critical issues like taxes, tea and how to spell color.  {% img img-right /images/posts/statue-w-speech.png 400px 750px 'King George and His Statue' title:'Artist Rendition of Statue of King George' %}  The epicenter of much of this tension is Bowling Green park.  Six years earlier, a 4,000 pound statue of King George astride a horse in Roman garb had been erected in the park.  This proved to be too large of a target for the local rabble who couldn't resist vandalizing the statue on their way home from their nightly pub crawls.  In response, the government passed anti-vandalism laws and surrounded the park with a cast iron fence.  That fence looks a lot like the one that's there today - but newer - about 241 years newer.

Now, in July of 1776, war is imminent.  The British are amassing a force of redcoats and Hessian mercenaries on Staten Island in preparation for an invasion (proving that even back then, nothing good came from Staten Island).  George Washington addresses a crowd that has gathered in front of City Hall.  "Yo!  We've dissolved the connection between this country and Great Britain. The United Colonies of North America are now free and independent states."  Then he read the Declaration of Independence.

These days, we yawn when someone starts blathering on about the Declaration, but back then, it was exciting.  The crowd was pumped and needed to do something to celebrate their new freedom.  RIOT!!!  So they stormed down to Bowling Green, tore down the statue of King George, paraded the head around on a pike and sent the rest to Connecticut to be made into musket balls.

Things were about to get real!

As you can imagine, King George did not appreciate the desecration of his statue and he was pretty sure it was a violation of the anti-vandalism laws passed three years earlier.  He knew it was time for a colonial beat down.  The king was a planner though and he wanted to make sure his Army was ready for the task ahead of them.

"Smythe!" he bellowed in a kingly fashion.  "Gather the troops.  Once they're gathered, poll each of them to find out where they are currently stationed."

Smythe was an extremely forward-thinking fellow and decided to build a Rails app with ActiveRecord in order make the data as accessible as possible to the king.

His models looked a little something like this:

```ruby
#in the models

#Soldier model
class Soldier < ActiveRecord::Base
  belongs_to :unit
end
 
#Unit model
class Unit < ActiveRecord::Base
  has_many :soldiers
end
```

While he was forward-thinking, Smythe wasn't too database savvy and he set up his controllers and view like this.

```ruby
#in the controller
@royal_army = Soldier.all
 
#in the view
@royal_army.each do |soldier|
    Name: <%= soldier.name %> 
    Location:<%= soldier.unit.location %>
end
```

On the first call to the database, Smythe's program gathers all the soldiers.  However, it has to make another call to the database for every single soldier in order to determine the soldier's location.  For those of you keeping track, that's N + 1 calls to the database, and, given the latency of databases in 1776, that's a problem.

The app will definitely work, but it could be a long time before the king has the data he needs.

 {% img img-left /images/posts/gw-w-speech.png 450px 825px 'Statue of George Washington with Speech Bubble' title:'N+1 is N+Nothing to the General' %} General Washington was also sure that war was imminent.  Mobs don't tear down statues and turn them into 42,088 'patriot bullets' without intending to use them.  Like King George, George Washington wanted to make sure that his army was ready to fight.

 "Smith!" he said in a very general-esque fashion, "Gather the troops.  I need some information from them."  Smith started to leave when the general (a man with legendary critical thinking skills) called him back.  "Smith...when you gather the troops, it's probably a good idea for you to grab their unit data too.  That way we can easily find out where they are currently stationed without using up too much extra time."

Smith (like Smythe) was a very forward-thinking fellow and decided to build a Rails app of his own.  As you can imagine, their models were identical:

```ruby
#in the models

#Soldier model
class Soldier < ActiveRecord::Base
  belongs_to :unit
end
 
#Unit model
class Unit < ActiveRecord::Base
  has_many :soldiers
end
```

But when he made his controller, Smith followed the general's sage advice and used eager loading.

```ruby
#In our controller
@continental_army = Soldier.includes(:unit).all
 
#in our view file
@continental_army.each do |soldier|
    Name: <%= soldier.name %> 
    Location:<%= soldier.unit.location %>
end
```
On the first call to the database, Smith's program gathers all the soldiers, same as Smythe's program.  Advantage?  No one.  However, on the second call to the database, Smith's program loads up all of the unit data.  Now, as the view loops through each of the soldiers, a soldier's name and location can be provided without any further database queries.

General Washington received the important data about his troop locations much sooner and the rest was history (9 brutal, war filled years of history).

So the next time someone tells you your app has an N + 1 problem, don't shrug it off thinking it doesn't matter.  It might not just be the scalability of your app that's on the line, it could very well be the fate of the entire freaking world.  Don't mess it up!

*\*Some of the history shared here may not be entirely accurate.  George Washington probably didn't invent a solution to the N+1 problem and Smith and Smythe probably weren't building Rails apps.  If you're building a Rails app though, you should care about N+1.  Learn more about Eager Loading by reading the [ActiveRecord documentation](http://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html#module-ActiveRecord::Associations::ClassMethods-label-Eager+loading+of+associations).*
