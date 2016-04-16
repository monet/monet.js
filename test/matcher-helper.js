function getCustomMatcher(fn) {
  return function () {
    return {
      compare: function(actual, expected) {
        return { pass: fn(actual, expected) }
      }
    };
  };
}