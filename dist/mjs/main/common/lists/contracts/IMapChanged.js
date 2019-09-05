export let MapChangedType;

(function (MapChangedType) {
  MapChangedType[MapChangedType["Removed"] = 0] = "Removed";
  MapChangedType[MapChangedType["Added"] = 1] = "Added";
  MapChangedType[MapChangedType["Set"] = 2] = "Set";
})(MapChangedType || (MapChangedType = {}));