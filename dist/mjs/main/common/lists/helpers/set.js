export function fillCollection(collection, arrayOrIterable, add) {
  if (Array.isArray(arrayOrIterable)) {
    for (var i = 0, len = arrayOrIterable.length; i < len; i++) {
      add(collection, arrayOrIterable[i]);
    }
  } else {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = arrayOrIterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _item = _step.value;
        add(collection, _item);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  return collection;
}
export function fillSet(set, arrayOrIterable) {
  return fillCollection(set, arrayOrIterable, function (c, o) {
    return c.add(o);
  });
}
export function fillMap(map, arrayOrIterable) {
  return fillCollection(map, arrayOrIterable, function (c, o) {
    return c.set.apply(c, o);
  });
}
export function fillObject(object, arrayOrIterable) {
  return fillCollection(object, arrayOrIterable, function (c, o) {
    return c[o[0]] = o[1];
  });
}
export function fillObjectKeys(object, arrayOrIterable) {
  return fillCollection(object, arrayOrIterable, function (c, o) {
    return c[o] = true;
  });
}