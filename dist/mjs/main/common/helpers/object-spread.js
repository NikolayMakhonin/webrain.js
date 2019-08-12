export function objectSpreadIgnoreNull(target) {
  for (var i = 0, len = arguments.length <= 1 ? 0 : arguments.length - 1; i < len; i++) {
    var source = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];

    if (source != null) {
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          var value = source[key];

          if (value != null) {
            target[key] = value;
          }
        }
      }
    }
  }

  return target;
}