---
layout: post
title:  "Ruby and the Amazing Splat *"
author: JessRudder
date:   2014-06-24 23:00:25 +0000
categories: code, ruby
images:
- images/@stock/post-2.jpg
- images/@stock/post-3.jpg
excerpt:
  On occasion, while perusing other people's code and marveling at the many ways there are to solve even simple problems, I've come across a mysterious asterisk that appears to have magical properties.
---

On occasion, while perusing other people's code and marveling at the many ways there are to solve even simple problems, I've come across a mysterious asterisk that appears to have magical properties.

It most commonly shows up attached to an argument in a method signature like this:

```ruby
def things_liked(name, *items)
  items.each do |item|
    puts "#{name} likes #{item}."
  end
end
```

That method structure was very familiar, but I was never entirely sure about the asterisk's purpose.  I grabbed a couple variables, tossed them in, and was surprised to see that the method behaved exactly how it would have behaved if the asterisk wasn't there.

```ruby
things_liked("Jessica", "hyenas")
#=> Jessica likes hyenas.
```

It seemed unlikely that the little guy just hangs out and does nothing, so I dug further and discovered that it's called the "splat operator" and it does some amazing things.

Splat can be used in methods when you aren't sure how many variables will be passed in.  Perhaps Jessica likes many things but hyenas are more simple in their passions.  If you use the power of splat, you can handle these variations in a single method.

```
jess = ["hyenas", "ruby", "long runs"]
hyena = ["crunchy bones"]

things_liked("Jessica", jess)
#=> Jessica likes hyenas.
#=> Jessica likes ruby.
#=> Jessica likes long runs.

things_liked("Hyena", hyena)
#=> Hyena likes crunchy bones.
```

That alone should be enough to earn splat its place in your future code...but splat is no lightweight and there's so much more it can do!

I found a great gist from [RubySpec](https://github.com/rubyspec/rubyspec/blob/master/language/splat_spec.rb) that covers the many wonderful (and occassionally odd) behaviors of splat.

Here are a few that I found particularly noteworthy.

Splat automatically puts the values it is called on in an array...

``` ruby 
x = 1
#=> 1

x = *1
#=> [1]
```

...unless you splat nil.  Splat nil and you get an empty array.

```ruby
x = *nil
#=> []
```

It can be used to create hashes from arrays.  All of the items with even indexes become keys while the odds become values.

```ruby
array = [1, "David", 2, "Lillith", 3, "Jessica", 4, "Lucas"]

Hash[*array]

#=> {1 => "David", 2 => "Lillith", 3 => "Jessica", 4 => "Lucas"}
```

Splat can also come in handy when you want to gather up all but the first, last or first and last items in an array.

```ruby
first, *rest = [1,2,3,4]
#=> first = 1, rest = [2,3,4]
*rest, last  = [1,2,3,4]
#=> rest = [1,2,3], last = 4
first, *center, last = [1,2,3,4]
#=> first = 1, center = [2,3], last = 4
```

With visions of splat operators running through my head, I decided to experiment and see if it could be used to grab the first character in a string (which happened to be necessary for an assignment I was working on).  With a little bit of trial and error, I came up with the following:

```ruby
x, *y = "hello".split("")
x => "h"
y => ["e", "l", "l", "o"]
```

WHICH TOTALLY WORKS!!!!

But, if we're going to be responsible coders, we need to remember that just because we can do something doesn't mean we should.  Unless we want our code to confuse people (including ourselves when we come back to it in a few months and wonder what the heck we were doing), we should use the right tools for the job.

So we'll have to say no to peppering our code with splat just for the pure joy we get from yelling splat every time we type it but we'll never again have to be afraid to use it appropriately in our code.
