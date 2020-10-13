export function forEachEnum(enumType, callback) {
  for (const key in enumType) {
    if (Object.prototype.hasOwnProperty.call(enumType, key) && isNaN(Number(key))) {
      const value = enumType[key];

      if (callback(value, key)) {
        return;
      }
    }
  }
}
const enumValuesCache = new Map();
export function getEnumValues(enumType) {
  let values = enumValuesCache.get(enumType);

  if (values == null) {
    values = [];
    forEachEnum(enumType, value => {
      values.push(value);
    });
  }

  return values;
}