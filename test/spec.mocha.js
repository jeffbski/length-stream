/*global suite:false test:false */
'use strict';

var chai = require('chai-stack');
var spec = require('stream-spec');
var tester = require('stream-tester');
var lengthStream = require('..'); // require('length-stream');

var t = chai.assert;

suite('stream-spec');

test('spec random pausing string stream', function (done) {
  var resultantLength;
  function lengthListener(length) {
    resultantLength = length;
  }
  var ls = lengthStream(lengthListener);
  spec(ls)
    .through({strict: false})
    .validateOnExit();

  var master = tester.createConsistentStream();

  function gen() {
    return 'abc';
  }

  tester.createRandomStream(gen, 1000) //1k 3char strings
    .pipe(master)
    .pipe(tester.createUnpauseStream())
    .pipe(ls)
    .pipe(tester.createPauseStream())
    .pipe(master.createSlave())
    .on('error', function (err) { done(err); })
    .on('end', function () {
      t.equal(resultantLength, 3000);
      done();
    });
});

test('spec random pausing Buffer stream', function (done) {
  var resultantLength;
  function lengthListener(length) {
    resultantLength = length;
  }
  var ls = lengthStream(lengthListener);
  spec(ls)
    .through({strict: false})
    .validateOnExit();

  var master = tester.createConsistentStream();

  function gen() {
    return new Buffer('abc');
  }

  tester.createRandomStream(gen, 1000) //1k 3byte Buffers
    .pipe(master)
    .pipe(tester.createUnpauseStream())
    .pipe(ls)
    .pipe(tester.createPauseStream())
    .pipe(master.createSlave())
    .on('error', function (err) { done(err); })
    .on('end', function () {
      t.equal(resultantLength, 3000);
      done();
    });
});

