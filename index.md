---
title: Home
layout: index
version: 0.1
dev-version: 0.1
---

## Introduction

So you've been forced to use JavaScript, eh? Well, don't write your will just yet, this library is what you want to
model all those monadic types that JavaScript (and well most languages) thoughtlessly omit.

If you know what a monad is then you are already an awesome programmer and if you don't, well... awesome is what you are
about to become.

This library is inspired by those that have come before, especially the [FunctionalJava][functionalJava] project.

We are still in the early stages of development and have only implemented a few types, but stay tuned for more monadic
goodness.

##Download

Download the [zip][gitZip] or [tar][gitTar] ball.
## Option

The `Option` type is the most common way of represented the `null` type with making the possibilities of `NullPointer`
issues disappear.

Option has effectively abstract and as two concrete subtypes: `Some` and `None`.

#### Creating an Option

	var option = new Some(val);
	var option = new None();
	
### Functions
#### map(fn)
`map` takes a function (a -> b) and applies that function to the value inside the option and returns another `Option`
	
	Option.map(fn) : Option

For example:

	new Some(123).map(function(val) {
		return val+1
	})
	=> 124

#### bind(fn)
`bind` takes a function that takes a value and returns an `Option`
            
	option.bind(fn) : option

For example:

	option.bind(function(val) {
		if (val == "hi") {
			return new Some("world")
		} else {
			return new None()
		}
	})


#### isSome()
`isSome` on a `Some` value will return `true` and `false` on a `None`

	new Some("hi").isSome()
	=> true


#### isNone()
`isNone` on a `None` value will return `true` and `false` on a `Some`

####some()
`some` will 'reduce' the `Option` to its value.

	new Some("hi").some()
	=> "hi"



            
[functionalJava]: http://functionaljava.org/
[gitZip]: https://github.com/cwmyers/monad.js/zipball/master (zip format)
[gitTar]: https://github.com/cwmyers/monad.js/tarball/master (tar format)