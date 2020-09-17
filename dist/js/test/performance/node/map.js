"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _padStart = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/pad-start"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _rdtsc = require("rdtsc");

var _objectUniqueId = require("../../../main/common/helpers/object-unique-id");

var _calc = require("../../../main/common/test/calc");

var _calcMemAllocate = require("../../../main/common/test/calc-mem-allocate");

var _Mocha = require("../../../main/common/test/Mocha");

var _MapPolyfill = require("./src/MapPolyfill.js");

// @ts-ignore
(0, _Mocha.describe)('map perf', function () {
  /* tslint:disable */
  // see: https://github.com/garycourt/murmurhash-js
  // see: https://stackoverflow.com/a/22429679/5221762
  function murmurhash2_32_gc(str, seed) {
    var l = str.length,
        h = seed ^ l,
        i = 0,
        k;
    var step = l >= 128 ? l / 128 | 0 : 1;

    while (l >= 4 * step) {
      k = str.charCodeAt(i) & 0xff | (str.charCodeAt(i += step) & 0xff) << 8 | (str.charCodeAt(i += step) & 0xff) << 16 | (str.charCodeAt(i += step) & 0xff) << 24;
      k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
      k ^= k >>> 24;
      k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
      h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;
      l -= 4 * step;
      i += step;
    }

    switch (l) {
      case 3:
        h ^= (str.charCodeAt(i + 2 * step) & 0xff) << 16;

      case 2:
        h ^= (str.charCodeAt(i + step) & 0xff) << 8;

      case 1:
        h ^= str.charCodeAt(i) & 0xff;
        h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    }

    h ^= h >>> 13;
    h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    h ^= h >>> 15;
    return h >>> 0;
  }

  function murmurhash3_32_gc(key, seed) {
    var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;
    remainder = key.length & 3; // key.length % 4

    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
      k1 = key.charCodeAt(i) & 0xff | (key.charCodeAt(++i) & 0xff) << 8 | (key.charCodeAt(++i) & 0xff) << 16 | (key.charCodeAt(++i) & 0xff) << 24;
      ++i;
      k1 = (k1 & 0xffff) * c1 + (((k1 >>> 16) * c1 & 0xffff) << 16) & 0xffffffff;
      k1 = k1 << 15 | k1 >>> 17;
      k1 = (k1 & 0xffff) * c2 + (((k1 >>> 16) * c2 & 0xffff) << 16) & 0xffffffff;
      h1 ^= k1;
      h1 = h1 << 13 | h1 >>> 19;
      h1b = (h1 & 0xffff) * 5 + (((h1 >>> 16) * 5 & 0xffff) << 16) & 0xffffffff;
      h1 = (h1b & 0xffff) + 0x6b64 + (((h1b >>> 16) + 0xe654 & 0xffff) << 16);
    }

    k1 = 0;

    switch (remainder) {
      case 3:
        k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;

      case 2:
        k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;

      case 1:
        k1 ^= key.charCodeAt(i) & 0xff;
        k1 = (k1 & 0xffff) * c1 + (((k1 >>> 16) * c1 & 0xffff) << 16) & 0xffffffff;
        k1 = k1 << 15 | k1 >>> 17;
        k1 = (k1 & 0xffff) * c2 + (((k1 >>> 16) * c2 & 0xffff) << 16) & 0xffffffff;
        h1 ^= k1;
    }

    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = (h1 & 0xffff) * 0x85ebca6b + (((h1 >>> 16) * 0x85ebca6b & 0xffff) << 16) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = (h1 & 0xffff) * 0xc2b2ae35 + (((h1 >>> 16) * 0xc2b2ae35 & 0xffff) << 16) & 0xffffffff;
    h1 ^= h1 >>> 16;
    return h1 >>> 0;
  }
  /* tslint:enable */

  /* tslint:disable:no-empty */


  function stringHashCode(str) {
    var len = str.length;

    if (len < 32) {
      var hash = 0;

      for (var i = 0; i < len; i++) {
        hash ^= str.charCodeAt(i);
        hash = hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24) | 0; // hash  = (((hash << 5) - hash) + str.charCodeAt(i)) | 0
      }

      return hash;
    } else {
      var _hash = len;
      var len_2 = len / 2 | 0;
      var _i = 1;

      while (_i <= len_2) {
        _hash ^= str.charCodeAt(_i - 1);
        _hash = _hash + (_hash << 1) + (_hash << 4) + (_hash << 7) + (_hash << 8) + (_hash << 24) | 0;
        _hash ^= str.charCodeAt(len - _i);
        _hash = _hash + (_hash << 1) + (_hash << 4) + (_hash << 7) + (_hash << 8) + (_hash << 24) | 0; // hash  = (((hash << 5) - hash) + str.charCodeAt(i)) | 0

        _i <<= 1;
      }

      return _hash;
    }
  }

  (0, _Mocha.it)('base', function () {
    this.timeout(300000);
    var map = new _map.default();
    var mapPolyfill = new _MapPolyfill.MapPolyfill();

    function getKey(i) {
      var _context;

      return 'The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and this channel will no longer have a creator.The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and this channel will no longer have a creator.The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and this channel will no longer have a creator.The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and ' + (0, _padStart.default)(_context = (i % 10000).toString()).call(_context, 4, '0') + 'this channel will no longer have a creator.The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and this channel will no longer have a creator.The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and this channel will no longer have a creator.The account of the user that created this channel has been inactive for the last 5 months. If it remains inactive in the next 30 days, that account will self-destruct and this channel will no longer have a creator.';
    }

    for (var i = 0; i < 10000; i++) {
      map.set(getKey(i), i);
      mapPolyfill.set(getKey(i), i);
    }

    var index = 0;
    var key;
    var value;
    var result = (0, _rdtsc.calcPerformance)(10000, function () {}, function () {
      index = Math.floor(Math.random() * 10000);
      key = getKey(index);
    }, // () => {
    // 	value = map.get(key)
    // }, () => {
    // 	value = mapPolyfill.get(key)
    // },
    function () {
      value = stringHashCode(key);
    }, // () => {
    // 	value = murmurhash2_32_gc(key, 1)
    // },
    function () {
      value = murmurhash3_32_gc(key, 1);
    });
    console.log(value);
    console.log(result);
  });
  (0, _Mocha.xit)('memory', function () {
    this.timeout(300000);
    var set = new _set.default();
    var setArray = {};
    var objects = [];

    for (var i = 0; i < 10; i++) {
      objects[i] = {};
      (0, _objectUniqueId.getObjectUniqueId)(objects[i]);
    }

    console.log((0, _calcMemAllocate.calcMemAllocate)(_calc.CalcType.Min, 50000, function () {
      for (var _i2 = 0; _i2 < 10; _i2++) {
        set.add(_i2 * _i2 * 10000000);
      }

      for (var _i3 = 0; _i3 < 10; _i3++) {
        set.delete(_i3 * _i3 * 10000000);
      }
    }).toString());
  });
});