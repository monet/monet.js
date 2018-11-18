function getCustomMatcher(fn) {
    return function () {
        return {
            compare: function (actual, expected) {
                return { pass: fn(actual, expected) }
            }
        }
    }
}

try {
    // allow in node
    global.getCustomMatcher = getCustomMatcher;
} catch (e) {}
