//     Monad.js 0.2

//     (c) 2012-2013 Chris Myers
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://cwmyers.github.com/monad.js


(function(window) {

var Maybe = window.Maybe = {}

Maybe.fromNull= function (val) {
    if (val == undefined || val == null){
        return Maybe.none()
    } else {
        return Maybe.some(val)
    }
}

var Some = Maybe.Some = Maybe.some = function(val) {
    return new Some.fn.init(val)
}

Some.fn = Some.prototype = {
    init: function(val) {
        if (val == null) {
            throw "Illegal state exception"
        }
        this.val = val
    },

    map: function (fn) {
            return new Some(fn(this.val))
    },
    isSome: function () {
        return true
    },
    isNone : function () {
        return false
    },
    bind : function (bindFn) {
        return bindFn(this.val)
    },
    some : function() {
        return this.val
    },
    orSome: function(otherValue) {
        return this.val
    }


}

Some.fn.init.prototype = Some.fn

var None = Maybe.None = Maybe.none = function() {
    return new None.fn.init()
}

None.fn = None.prototype = {
    init: function(val) {
    },

    map: function () {
        return this
    },
    isSome: function () {
      return false
    },
    isNone: function () {
        return true
    },
    bind: function (bindFn) {
        return this
    },
    some: function() {
        throw "Illegal state exception"
    },
    orSome: function(otherValue) {
        return otherValue
    }
}

None.fn.init.prototype = None.fn

var Validation = window.Validation = {}

var Success = Validation.Success = Validation.success = function(val) {
    return new Success.fn.init(val)
}

Success.fn = Success.prototype = {
    init: function(val) {
        this.val = val
    },
    map: function (fn) {
        return new Success(fn(this.val))
    },
    success: function() {
        return this.val;
    },
    isSuccess: function() {
        return true;
    },
    isFail: function() {
        return false;
    },
    fail: function(){
        throw 'Illegal state. Cannot call fail() on a Validation.success'
    },
    bind: function(fn) {
        return fn(this.val);
    }
}

Success.fn.init.prototype = Success.fn

var Fail = Validation.Fail = Validation.fail = function(error) {
    return new Fail.fn.init(error)
}

Fail.fn = Fail.prototype = {
    init: function(error) {
        this.error=error
    },
    map: function (fn) {
        return this;
    },
    fail: function() {
        return this.error
    },
    bind: function(fn) {
        return this;
    },
    isFail: function() {
        return true
    },
    isSuccess: function() {
        return false;
    },
    fail: function() {
        return this.error
    },
    success: function() {
        throw 'Illegal state. Cannot call success() on a Validation.fail'
    }
}

Fail.fn.init.prototype = Fail.fn

return this
}(window || this));

