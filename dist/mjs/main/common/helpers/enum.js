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
export function forEachEnumFlags(enumType, callback) {
  let flag = 1;

  while (true) {
    const name = enumType[flag];

    if (name == null) {
      break;
    }

    if (callback(flag, name)) {
      return;
    }

    flag <<= 1;
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
const enumFlagsCache = new Map();
export function getEnumFlags(enumType) {
  let values = enumFlagsCache.get(enumType);

  if (values == null) {
    values = [];
    forEachEnumFlags(enumType, value => {
      values.push(value);
    });
  }

  return values;
}