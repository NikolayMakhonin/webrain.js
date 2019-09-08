"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.compareFast = compareFast;
exports.compareUniqueId = compareUniqueId;
exports.compareStrict = compareStrict;

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _objectUniqueId = require("../../helpers/object-unique-id");

/* tslint:disable:use-isnan */
function compareFast(o1, o2) {
  if (o1 === o2) {
    return 0;
  }

  if (typeof o1 === 'undefined') {
    return 1;
  }

  if (typeof o2 === 'undefined') {
    return -1;
  }

  if (o1 === null) {
    return 1;
  }

  if (o2 === null) {
    return -1;
  }

  o1 = o1.valueOf();
  o2 = o2.valueOf(); // is NaN

  if (o1 !== o1) {
    if (o2 !== o2) {
      return 0;
    }

    return 1;
  }

  if (o2 !== o2) {
    return -1;
  }

  if (typeof o1 === 'number') {
    if (typeof o2 !== 'number') {
      return -1;
    }

    return o1 > o2 ? 1 : -1;
  }

  if (typeof o2 === 'number') {
    return 1;
  }

  if (typeof o1 === 'boolean') {
    if (typeof o2 !== 'boolean') {
      return -1;
    }

    return o1 > o2 ? 1 : -1;
  }

  if (typeof o2 === 'boolean') {
    return 1;
  }

  if (typeof o1 === 'string') {
    if (typeof o2 !== 'string') {
      return -1;
    }

    return o1 > o2 ? 1 : -1;
  }

  if (typeof o2 === 'string') {
    return 1;
  } // if (typeof o1 === 'symbol') {
  // 	if (typeof o2 !== 'symbol') {
  // 		return -1
  // 	}
  // 	return -1
  // }
  // if (typeof o2 === 'symbol') {
  // 	return 1
  // }


  o1 = (0, _objectUniqueId.getObjectUniqueId)(o1);
  o2 = (0, _objectUniqueId.getObjectUniqueId)(o2);

  if (o1 > o2) {
    return 1;
  }

  return -1;
}

function compareUniqueId(o1, o2) {
  if (o1 === o2) {
    return 0;
  }

  o1 = (0, _objectUniqueId.getObjectUniqueId)(o1);
  o2 = (0, _objectUniqueId.getObjectUniqueId)(o2);

  if (o1 > o2) {
    return 1;
  }

  return -1;
} // noinspection DuplicatedCode


function compareStrict(o1, o2) {
  if (o1 === o2) {
    return 0;
  }

  if (typeof o1 === 'undefined') {
    return 1;
  }

  if (typeof o2 === 'undefined') {
    return -1;
  }

  if (o1 === null) {
    return 1;
  }

  if (o2 === null) {
    return -1;
  }

  o1 = o1.valueOf();
  o2 = o2.valueOf();
  var t1 = typeof o1;
  var t2 = typeof o2;

  if (t1 === t2) {
    // is NaN
    if (o1 !== o1) {
      if (o2 !== o2) {
        return 0;
      }

      return 1;
    }

    if (o2 !== o2) {
      return -1;
    }

    if (o1 > o2) {
      return 1;
    } else if (o1 < o2) {
      return -1;
    }

    o1 = (0, _objectUniqueId.getObjectUniqueId)(o1);
    o2 = (0, _objectUniqueId.getObjectUniqueId)(o2);

    if (o1 > o2) {
      return 1;
    }

    return -1;
  }

  if (t1 === 'number') {
    return -1;
  }

  if (t2 === 'number') {
    return 1;
  }

  if (t1 === 'boolean') {
    return -1;
  }

  if (t2 === 'boolean') {
    return 1;
  }

  if (t1 === 'string') {
    return -1;
  }

  if (t2 === 'string') {
    return 1;
  }

  if ((0, _isArray.default)(o1)) {
    return -1;
  }

  if ((0, _isArray.default)(o2)) {
    return 1;
  }

  if (t1 === 'object') {
    return -1;
  }

  if (t2 === 'object') {
    return 1;
  }

  if (t1 === 'function') {
    return -1;
  }

  if (t2 === 'function') {
    return 1;
  }

  if (t1 < t2) {
    return -1;
  }

  return 1;
}