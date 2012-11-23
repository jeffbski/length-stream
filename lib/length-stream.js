'use strict';

var passStream = require('pass-stream');

function lengthStream(lengthListener) {
  if (typeof lengthListener !== 'function') throw new Error('lengthStream requires a lengthListener fn');
  var length = 0;
  function writeFn(data) {
    /*jshint validthis:true */
    length += data.length;
    this.queueWrite(data);
  }
  function endFn() {
    /*jshint validthis:true */
    lengthListener(length); // call with resultant length
    this.queueEnd();
  }
  var stream = passStream(writeFn, endFn);
  return stream;
}

module.exports = lengthStream;