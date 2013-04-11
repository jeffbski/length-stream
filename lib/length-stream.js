'use strict';

var passStream = require('pass-stream');

function lengthStream(options, lengthListener) {
  if (arguments.length === 1) {  // options not provided, shift
    lengthListener = options;
    options = {};
  }
  options = options || {};
  if (typeof lengthListener !== 'function') throw new Error('lengthStream requires a lengthListener fn');
  var length = 0;
  function writeFn(data, encoding, cb) {
    /*jshint validthis:true */
    length += data.length;
    this.push(data);
    cb();
  }
  function endFn(cb) {
    /*jshint validthis:true */
    lengthListener(length); // call with resultant length
    cb();
  }
  var stream = passStream(writeFn, endFn, options);
  return stream;
}

module.exports = lengthStream;