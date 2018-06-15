/**
 * monet-pimp.js 0.9.0-alpha.4
 *
 * This file needs to be included after monet.js
 *
 * (c) 2012-2017 Chris Myers
 * @license Monet-pimp.js may be freely distributed under the MIT license.
 * For all details and documentation:
 * https://monet.github.io/monet.js/
 */

/* global define */
/* eslint-disable no-extend-native */

/* eslint-disable-next-line complexity */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) { 
        define(['monet'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('monet'))
    } else {
        factory(root.Monet, root)
    }
}(this, function (Monet, rootGlobalObject) {
    'use strict'

    function wrapReader(fn, args) {
        var newArgs = args || []
        return function () {
            var args1 = newArgs.concat(Array.prototype.slice.call(arguments))
            return args1.length + 1 >= fn.length ?
                getStatic('Reader')(function (c) {
                    return fn.apply(null, args1.concat(c))
                }) : wrapReader(fn, args1)
        }
    }

    function getStatic(name) {
        return rootGlobalObject && rootGlobalObject[name] || Monet[name]
    }

    Object.prototype.cons = function (list) {
        return list.cons(this)
    }

    // TODO: Remove some as it's overridden by Array.prototype.some
    Object.prototype.some = Object.prototype.just = function () {
        return getStatic('Some')(this)
    }

    Object.prototype.success = function () {
        return getStatic('Validation').success(this)
    }

    Object.prototype.fail = function () {
        return getStatic('Validation').fail(this)
    }

    Object.prototype.right = function() {
        return getStatic('Either').Right(this)
    }

    Object.prototype.left = function() {
        return getStatic('Either').Left(this)
    }

    Array.prototype.list = function () {
        return getStatic('List').fromArray(this)
    }

    Function.prototype.curry = function() { // TODO: TEST IT !!!!
        return Monet.curry(this)
    }

    Function.prototype.compose = function(g) { // TODO: TEST IT !!!!
        return Monet.compose(this, g)
    }

    Function.prototype.andThen = Function.prototype.map = function (g) { // TODO: TEST IT !!!!
        var f = this
        return function (x) {
            return g(f(x))
        }
    }

    Function.prototype.io = function () { // TODO: TEST IT !!!!
        return getStatic('IO')(this)
    }

    Function.prototype.io1 = function () { // TODO: TEST IT !!!!
        var f = this
        return function (x) {
            return getStatic('IO')(function () {
                return f(x)
            })
        }
    }

    Function.prototype.reader = function () { // TODO: TEST IT !!!!
        return wrapReader(this)
    }

}))
