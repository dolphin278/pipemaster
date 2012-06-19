var vows = require('vows'),
    assert = require('assert'),
    FuncWrapper = require('../lib').FuncWrapper;

vows.describe('func2stream')
    .addBatch({
        'sum async function': {
            topic: function () { return function (a, b, callback) { callback(null, a + b); }; },
            'is function': function (sumfunction) {
                assert.isFunction(sumfunction);
            },
            'when wrapped to stream' : {
                topic: function (sumfunction) {
                    return new FuncWrapper(sumfunction);
                },
                'became a FuncWrapper stream' : function (streamFunc) {
                    assert.instanceOf(streamFunc, FuncWrapper);
                },
                'have write() method' : function (streamFunc) {
                    assert.isFunction(streamFunc.write, 'have write method');
                },
                'sums properly' : function (streamFunc) {
                    streamFunc.on('data', function (sum) {
                        assert.equal(sum, 4.5);
                    });
                    streamFunc.write(2, 2.5);
                }
            }
        },
        'sum sync function' : {
            topic: function () { return function (a, b) {
                return a + b;
            }; },
            'is function': function (sumfunction) {
                assert.isFunction(sumfunction);
            },
            'when wrapped to stream' : {
                topic: function (sumfunction) {
                    return new FuncWrapper(sumfunction, false);
                },
                'became a stream' : function (streamFunc) {
                    assert.instanceOf(streamFunc, FuncWrapper);
                },
                'have write() method' : function (streamFunc) {
                    assert.isFunction(streamFunc.write, 'have write method');
                },
                'sums properly' : function (streamFunc) {
                    streamFunc.on('data', function (sum) {
                        assert.equal(sum, 5);
                    });
                    streamFunc.write(2, 3);
                }
            }
            
        }
    })
    .export(module);