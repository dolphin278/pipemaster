var assert = require('assert'),
    Stream = require('stream'),
    util = require('util');

function FuncWrapper(func, async) {
    Stream.call(this);
    assert.equal(typeof func, 'function', 'Funcwrapper constructor arg should be a function');
    this.async = typeof async !== "undefined" ? async : true;
    this.readable = this.writable = true;
    this.func = func;
}
util.inherits(FuncWrapper, Stream);
FuncWrapper.prototype.write = function () {
    var stream = this,
        args = Array.prototype.slice.call(arguments);
    if (this.async) {
        args[args.length] = function (err, result) {
            if (err) {
                stream.emit('error', err);
            } else {
                stream.emit('data', result);
            }
        };
        stream.func.apply(stream, args);
    } else {
        return stream.func.apply(stream, args);
    }
};
FuncWrapper.prototype.end = function () {
    this.emit('end');
};

module.exports = FuncWrapper;