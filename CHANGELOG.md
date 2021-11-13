# Changelog

## 0.9.3 (12 Nov 2021)
- [fix] add `Maybe.fromEmpty` to typings -- thanks to @tomecko ( #246 )

## 0.9.2 (05 Mar 2021)
- [new] add `apTo` to all Applicatives -- thanks to @iLikeKoffee ( #233 )
- [new] add `lookup` and `nth` to lists -- thanks to @mlrv ( #241 )
- [enhancement] change Maybe `filter` and `filterNot` to work as type guard -- thanks to @mlrv ( #240 )

## 0.9.1 (15 Jan 2020)
- [new] add `fromPromise` and `toPromise` to `Either` -- thanks to @wookieb ( #223 )
- [fix] fix `.isInstance` method -- thanks to @wookieb ( #221 )
- [new] add `Either.fromTry` -- thanks to @rparree ( #211 )
- [new] add `Maybe.fromEmpty` -- thanks to @customcommander ( #214 )

## 0.9.0 (19 Nov 2018)

### rc.3 (18 Nov 2018)

- [fix] broken exports ( #196 )

### rc.2 (18 Nov 2018)

- [fix] broken UMD for node imports ( #193 )

### rc.1 (18 Sep 2018)

- [fix] broken UMD for node imports -- thanks to @jfspencer ( #180 )

### rc.0 (18 Jun 2018)

- [new] add `from` static constructor method to NEL and List
- [fix] fix broken List.equals
- [fix] re-add `cons` and `snoc` to NEL (fix join, also add/fix `flatten` and `flattenMaybe` to collections)
- [fix] drop `.contains()` from Either and Validation
- [new] implement Iterable for List, NEL, Maybe and Identity
- [new] add `.every()`, `.forall()` and `.exists()` to List, NEL, Maybe and Identity
- [new] add `.toSet()` to List and NEL
- [new] add `.toArray()`, `.toSet()` to Maybe
- [new] add `.orUndefined()`, `.getOrElse()`, `.orLazy()` to Maybe
- [new] add `.swap()` to Validation and Either
- [new] add `.catchMap()` to Maybe, Validation and Either
- [enhancement] make `Maybe` types stricter (compile type check for use of nullables) -- thanks to @jleider ( #167 )
- [enhancement] make `.equals()` compatible with other libraries
- [new] add static `.isOfType()` and `.isInstance()` to all types
- [new] add `.fromUndefined()` to Maybe static
- [new] add `.filterNot()` to Maybe, List and NEL -- thanks to @tomecko ( #152 )

### alpha.4 (19 Jun 2017)

- [fix] pre publish build

### alpha.3 (19 Jun 2017)

- [enhancement] make `.chain()` compatible with Fantasy Land
- [enhancement] make `.map()` compatible with Fantasy Land
- [enhancement] make `.equals()` compatible with Fantasy Land
- [enhancement] add lowercase factory functions to satisfy linters -- thanks to @LukaszTheProgrammer ( #107 )
  - `Maybe.some(val)` and `Maybe.none()`
  - `Either.right(val)` and `Either.left(err)`
- [enhancement] make `.ap()` compatible with Fantasy Land and Ramda -- thanks to @char0n ( #112 )
- [new] add `.ap()` to Identity (so it's compatible with FantasyLand) -- thanks to @char0n ( #121 )
- [new] add `.orNoneIf()` (alias `.orNothingIf()`) to Maybe -- thanks to @emmanueltouzery ( #100 )
- [new] add `.fromFalsy()` to Maybe static -- thanks to @kpudlik ( #98 )
- [new] add `.forEach()` to Identity, Maybe, Either, Validation, List and NEL -- thanks to @emmanueltouzery ( #95 ). And:
  - `.orElseRun()` to Maybe
  - `.forEachLeft()` to Either
  - `.forEachFail()` to Validation
- [new] add `.contains()` to Identity, Maybe, Either, Validation, List and NEL -- thanks to @emmanueltouzery ( #93 )
- [new] add `.find()` to List and NEL -- thanks to @emmanueltouzery ( #90 )
- [new] add `.fold()` as alias for `.cata()` to Either and Validation -- thanks to @tbrisbane ( #82 )
- [new] add `.foldLeft()` and `.foldRight()` to Maybe, Either, Validation, List and NEL -- thanks to @tbrisbane ( #82 )
- [new] add `.orNull()` to Maybe -- thanks to @emmanueltouzery ( #86 )
- [fix] fix typings to work with `--noImplicitAny`
- [fix] fix typings to work with `--strictNullChecks` -- thanks to @emmanueltouzery ( #86 )

### alpha.2

- [fix] fix List's `.size()` ( #79 )
- [fix] fix List's `.map` ( #64 )

### alpha.1

- [fix] fix Free monad

### alpha.0

- [new] `.equals()` method added to most entities
- [breaking] all native prototype extensions extracted to `monet-pimp.js`
- [enhancement] typings compatible with TS2.x
- [fix] updated module pattern

## 0.8.10

- [fix] Fixed `bower.json` issues ( #51 )
- [fix] Fixed internal `curry` implementation ( #55 )

## 0.8.9

- [new] add TypeScript typings
- [new] add `.ap()` to List, Free and NonEmptyList -- thanks to @WojciechP ( #44 )
- [new] add `"use strict";` -- thanks to @krjackso ( #41 )

### Typings

TypeScript typings added to repository, so now anyone can:

``` typescript
import { Maybe } from 'monet';

export function getStoredData(key: string): Maybe<SomeData> {
  return Maybe.fromNull(localStorage)
    .flatMap(ls => Maybe.fromNull(ls.getItem(key)))
    .map(JSON.parse);
}
```

## 0.8.7

- [new] add `.cata(…)` to Maybe -- thanks to Crisson Jno-Charles @crisson
