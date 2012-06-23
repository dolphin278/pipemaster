pipemaster
==========

Simple tool to wrap your functions to work as streams. Functions can be both sync and async.
##  Installation

```
npm install pipemaster 
```

## Usage

```javascript
var FuncWrapper = require('pipemaster').FuncWrapper,
    streamFunc;

function asyncExample(x, callback) {
   callback(null, x * x); // first argument is an optional error.
}

streamFunc = new FuncWrapper(asyncExample);

streamFunc.write(2);  // streamFunc emits '4'
streamFunc.write(6);  // streamFunc emits '36'
```

Sync functions also supported:

```
var FuncWrapper = require('pipemaster').FuncWrapper,
    streamFunc;

function syncExample(x) {
   return 2 * x;
}

streamFunc = new FuncWrapper(syncExample, false); // 'false' is a flag for sync function

streamFunc.write(2);  // streamFunc emits '4'
streamFunc.write(6);  // streamFunc emits '12'
```

## Filtering stream

Based on `FuncWrapper`, it takes sync or async function that returns `true` or `false`, and emits `data` event only when function returns `true`. Filtering functions also can be both sync and async ones.

```
var StreamFilter = require('pipemaster').StreamFilter,
    streamFunc;
function filterAsync(item, callback) {
    callback(null, item === 4);
}

streamFunc = new StreamFilter(filterAsync, true);

streamFunc.write(1);
streamFunc.write(4);
streamFunc.write(2);

// streamFunc emits only '4'
```

If you suggest pull requests, please include `vows` test suites.
