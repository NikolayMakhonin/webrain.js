export let SetChangedType;

(function (SetChangedType) {
  SetChangedType[SetChangedType["Removed"] = 0] = "Removed";
  SetChangedType[SetChangedType["Added"] = 1] = "Added";
})(SetChangedType || (SetChangedType = {}));