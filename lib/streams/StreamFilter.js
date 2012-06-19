var assert = require('assert'),
    FuncWrapper = require('./FuncWrapper'),
    util = require('util');

// async only!
function StreamFilter(func, async) {
    var stream = this;
    FuncWrapper.call(stream,
        function (item, callback) {
            if (!async) {
                if (stream.origFunc(item)) {
                    callback(null, item);
                }
            } else {
                stream.origFunc(item, function (err, result) {
                    if (result) { callback(null, item); }
                });
            }
        }, true);
    stream.origFunc = func;
}
util.inherits(StreamFilter, FuncWrapper);
module.exports = StreamFilter;