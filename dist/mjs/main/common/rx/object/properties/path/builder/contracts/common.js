export let ValueKeyType;

(function (ValueKeyType) {
  ValueKeyType[ValueKeyType["Index"] = 0] = "Index";
  ValueKeyType[ValueKeyType["Property"] = 1] = "Property";
  ValueKeyType[ValueKeyType["ValueProperty"] = 2] = "ValueProperty";
  ValueKeyType[ValueKeyType["MapKey"] = 3] = "MapKey";
  ValueKeyType[ValueKeyType["CollectionAny"] = 4] = "CollectionAny";
  ValueKeyType[ValueKeyType["ChangeCount"] = 5] = "ChangeCount";
})(ValueKeyType || (ValueKeyType = {}));