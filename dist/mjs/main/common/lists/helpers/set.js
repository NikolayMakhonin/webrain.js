export function fillCollection(collection, arrayOrIterable, add) {
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
export function fillSet(set, arrayOrIterable) {
  return fillCollection(set, arrayOrIterable, (c, o) => c.add(o));
}
export function fillMap(map, arrayOrIterable) {
  return fillCollection(map, arrayOrIterable, (c, o) => c.set.apply(c, o));
}
export function fillObject(object, arrayOrIterable) {
  return fillCollection(object, arrayOrIterable, (c, o) => c[o[0]] = o[1]);
}
export function fillObjectKeys(object, arrayOrIterable) {
  return fillCollection(object, arrayOrIterable, (c, o) => c[o] = true);
}