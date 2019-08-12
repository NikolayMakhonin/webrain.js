"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillCollection = fillCollection;
exports.fillSet = fillSet;
exports.fillMap = fillMap;
exports.fillObject = fillObject;
exports.fillObjectKeys = fillObjectKeys;

function fillCollection(collection, arrayOrIterable, add) {
  if (Array.isArray(arrayOrIterable)) {
    for (let i = 0, len = arrayOrIterable.length; i < len; i++) {
      add(collection, arrayOrIterable[i]);
    }
  } else {
    for (const item of arrayOrIterable) {
      add(collection, item);
    }
  }

  return collection;
}

function fillSet(set, arrayOrIterable) {
  return fillCollection(set, arrayOrIterable, (c, o) => c.add(o));
}

function fillMap(map, arrayOrIterable) {
  return fillCollection(map, arrayOrIterable, (c, o) => c.set.apply(c, o));
}

function fillObject(object, arrayOrIterable) {
  return fillCollection(object, arrayOrIterable, (c, o) => c[o[0]] = o[1]);
}

function fillObjectKeys(object, arrayOrIterable) {
  return fillCollection(object, arrayOrIterable, (c, o) => c[o] = true);
}