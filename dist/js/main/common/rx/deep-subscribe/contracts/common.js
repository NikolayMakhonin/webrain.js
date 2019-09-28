"use strict";

exports.__esModule = true;
exports.ValueKeyType = exports.ValueChangeType = void 0;
var ValueChangeType;
exports.ValueChangeType = ValueChangeType;

(function (ValueChangeType) {
  ValueChangeType[ValueChangeType["None"] = 0] = "None";
  ValueChangeType[ValueChangeType["Unsubscribe"] = 1] = "Unsubscribe";
  ValueChangeType[ValueChangeType["Subscribe"] = 2] = "Subscribe";
  ValueChangeType[ValueChangeType["Changed"] = 3] = "Changed";
})(ValueChangeType || (exports.ValueChangeType = ValueChangeType = {}));

var ValueKeyType;
exports.ValueKeyType = ValueKeyType;

(function (ValueKeyType) {
  ValueKeyType[ValueKeyType["Property"] = 0] = "Property";
  ValueKeyType[ValueKeyType["ValueProperty"] = 1] = "ValueProperty";
  ValueKeyType[ValueKeyType["MapKey"] = 2] = "MapKey";
  ValueKeyType[ValueKeyType["CollectionAny"] = 3] = "CollectionAny";
})(ValueKeyType || (exports.ValueKeyType = ValueKeyType = {}));