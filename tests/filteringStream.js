var vows = require('vows'),
    assert = require('assert'),
    StreamFilter = require('../lib').StreamFilter;

function filter(item) {
    return item === 3.5;
}

function filterAsync(item, callback) {
    callback(null, item === 4)
}

vows.describe('filteringStream')
    .addBatch(
        {
            'simple sync filtering' : {
                topic: function () { return filter; },
                'when wrapped to stream' : {
                    topic: function (filterfunction) {
                        return new StreamFilter(filterfunction);
                    },
                    'became a StreamFilter stream' : function (streamFunc) {
                        assert.instanceOf(streamFunc, StreamFilter);
                    },
                    'have write() method' : function (streamFunc) {
                        assert.isFunction(streamFunc.write, 'have write method');
                    },
                    'filters properly' : {
                        topic : function (stream) {
                            var context = this;
                            stream.on('data', context.callback);
                            stream.write(3.5);
                            stream.write(3.5);
                            stream.write(1);
                        },
                        'should be 3.5' : function (val, next) {
                            assert.equal(val, 3.5);
                        }
                    }
                }
            }
        }
    )
    .addBatch(
        {
            'simple async filtering' : {
                topic: function () { return filterAsync; },
                'when wrapped to stream' : {
                    topic: function (filterfunction) {
                        return new StreamFilter(filterfunction, true);
                    },
                    'became a StreamFilter stream' : function (streamFunc) {
                        assert.instanceOf(streamFunc, StreamFilter);
                    },
                    'have write() method' : function (streamFunc) {
                        assert.isFunction(streamFunc.write, 'have write method');
                    },
                    'filters properly' : {
                        topic : function (stream) {
                            var context = this;
                            stream.on('data', context.callback);
                            stream.write(3.5);
                            stream.write(3.5);
                            stream.write(4);
                        },
                        'should be 4' : function (val, next) {
                            assert.equal(val, 4);
                        }
                    }
                }
            }
        }
    )
    .export(module);