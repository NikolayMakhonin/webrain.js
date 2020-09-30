"use strict";

exports.__esModule = true;
exports.createPathGetValue = createPathGetValue;
exports.createPathSetValue = createPathSetValue;
exports.createPathGetSetValue = createPathGetSetValue;

var _depend = require("../../../rx/depend/core/depend");

var _builder = require("../../object/properties/path/builder");

// region helpers
function resolvePathOrBuilder(pathOrBuilder) {
  return typeof pathOrBuilder === 'function' ? pathOrBuilder(new _builder.Path()).init() : pathOrBuilder;
} // endregion
// region createPathGetValue
// tslint:disable-next-line:no-shadowed-variable


var _createPathGetValue = (0, _depend.depend)(function _createPathGetValue(pathOrBuilder) {
  var path = resolvePathOrBuilder(pathOrBuilder);

  if (path == null) {
    throw new Error('path == null');
  }

  if (!path.canGet) {
    throw new Error('path.canGet is false');
  }

  return function (object) {
    return path.get(object);
  };
});

function createPathGetValue(pathOrBuilder) {
  return pathOrBuilder == null ? _createPathGetValue : _createPathGetValue(pathOrBuilder);
} // endregion
// region createPathSetValue
// tslint:disable-next-line:no-shadowed-variable


var _createPathSetValue = (0, _depend.depend)(function _createPathSetValue(pathOrBuilder) {
  var path = resolvePathOrBuilder(pathOrBuilder);

  if (path == null) {
    throw new Error('path == null');
  }

  if (!path.canSet) {
    throw new Error('path.canSet is false');
  }

  return function (object, value) {
    return path.set(object, value);
  };
});

function createPathSetValue(pathOrBuilder) {
  return pathOrBuilder == null ? _createPathSetValue : _createPathSetValue(pathOrBuilder);
} // endregion
// region createPathGetSetValue
// tslint:disable-next-line:no-shadowed-variable


var _createPathGetSetValue = (0, _depend.depend)(__createPathGetSetValue);

function __createPathGetSetValue(pathOrBuilderCommon, pathOrBuilderGetSet) {
  var pathGetSet;

  if (typeof pathOrBuilderCommon === 'function') {
    pathGetSet = (0, _builder.pathGetSetBuild)(pathOrBuilderCommon, pathOrBuilderGetSet);
  } else if (pathOrBuilderCommon instanceof _builder.PathGetSet) {
    if (pathOrBuilderGetSet != null) {
      throw new Error('The second argument should be null: ' + typeof pathOrBuilderGetSet);
    }

    pathGetSet = pathOrBuilderCommon;
  }

  var pathGet;
  var pathSet;

  if (pathGetSet != null) {
    pathGet = pathGetSet.pathGet;
    pathSet = pathGetSet.pathSet;
  } else {
    pathGet = pathOrBuilderCommon;
    pathSet = pathOrBuilderGetSet;
  }

  var getValue = createPathGetValue(pathGet);
  var setValue = createPathSetValue(pathSet);
  return {
    getValue: getValue,
    setValue: setValue
  };
}

function createPathGetSetValue(pathOrBuilderCommon, pathOrBuilderGetSet) {
  return pathOrBuilderCommon == null && pathOrBuilderGetSet == null ? _createPathGetSetValue : _createPathGetSetValue(pathOrBuilderCommon, pathOrBuilderGetSet);
} // endregion