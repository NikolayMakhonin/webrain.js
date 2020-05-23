"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.pathsConcat = pathsConcat;
exports.pathGetSetBuild = pathGetSetBuild;
exports.PathGetSet = exports.Path = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _resolve = require("./resolve");

/* tslint:disable:no-circular-imports */
function pathsConcat() {
  var isNewArray = false;
  var result;

  for (var i = 0, len = arguments.length; i < len; i++) {
    var _path = i < 0 || arguments.length <= i ? undefined : arguments[i];

    if (_path instanceof Path) {
      _path = _path.nodes;
    }

    if (_path != null) {
      if ((0, _isArray.default)(_path)) {
        if (result == null) {
          result = _path;
        } else if (!isNewArray) {
          var _context;

          result = (0, _concat.default)(_context = []).call(_context, result, _path);
          isNewArray = true;
        } else {
          var _result;

          (_result = result).push.apply(_result, _path);
        }
      } else {
        if (result == null) {
          result = [isNewArray];
          isNewArray = true;
        } else if (!isNewArray) {
          var _context2;

          result = (0, _concat.default)(_context2 = []).call(_context2, result, [_path]);
          isNewArray = true;
        } else {
          result.push(_path);
        }
      }
    }
  }

  return result == null ? null : new Path(result).init();
}

function pathCanGetSet(pathNodes) {
  if (pathNodes == null) {
    return false;
  }

  var len = pathNodes.length;

  if (len === 0) {
    return false;
  }

  for (var i = 0; i < len - 1; i++) {
    var node = pathNodes[i];

    if (node.getValue == null) {
      return false;
    }
  }

  return true;
}

function pathCanGet(pathNodes) {
  return pathCanGetSet(pathNodes) && pathNodes[pathNodes.length - 1].getValue != null;
}

function pathCanSet(pathNodes) {
  return pathCanGetSet(pathNodes) && pathNodes[pathNodes.length - 1].setValue != null;
}

function pathGetOrSetValue(path, object) {
  var nextValue = (0, _resolve.resolvePath)(object);

  for (var i = 0, len = path.length - 1; i < len; i++) {
    var node = path[i];
    nextValue = nextValue(node.getValue, node.isValueProperty);
  }

  return nextValue;
}

function pathGetValue(path, object) {
  var nextValue = pathGetOrSetValue(path, object);

  if (path.length === 0) {
    return nextValue;
  }

  var lastNode = path[path.length - 1];
  var getResult = nextValue(lastNode.getValue, lastNode.isValueProperty);
  return getResult;
}

function pathSetValue(path, object, newValue) {
  var nextValue = pathGetOrSetValue(path, object);
  var lastNode = path[path.length - 1];
  var getResult = nextValue(lastNode.setValue, lastNode.isValueProperty, newValue);
  return getResult;
} // function concatPropertyPaths(
// 	...paths: Array<IPathNode<any, any>|Array<IPathNode<any, any>>|PropertyPath<any, any>>
// ) {
// 	let get = []
// 	let set = []
//
// 	function appendNode(
// 		nodeGet: IPathNode<any, any>,
// 		nodeSet?: IPathNode<any, any>,
// 	): boolean {
// 		if (nodeGet.getValue == null) {
// 			get = null
// 			if (nodeSet) {
// 				set = null
// 			}
// 		}
// 		if (nodeGet.getValue == null) {
// 			get = null
// 			if (!last) {
// 				set = null
// 			}
// 		}
//
// 		return get == null && set == null
// 	}
//
// 	function appendNodes(
// 		array: Array<IPathNode<any, any>>,
// 		nodes: Array<IPathNode<any, any>>|IPathNode<any, any>,
// 	): boolean {
// 		if (Array.isArray(nodes)) {
// 			for (let i = 0, len = nodes.length; i < len; i++) {
// 				const node = nodes[i]
// 				if (node.getValue == null) {
// 					return false
// 				}
// 				array.push(node)
// 			}
// 		}
// 		return true
// 	}
//
// 	for (let i = 0, len = paths.length; i < len; i++) {
// 		const path = paths[i]
// 		if (i === len - 1) {
//
// 		} else {
// 			if (Array.isArray(path)) {
//
// 			} else if (path instanceof PropertyPath) {
//
// 			} else {
// 				if (path.getValue == null) {
// 					get = null
// 				}
// 			}
// 		}
//
// 		result.push(...paths[i])
// 	}
// 	return result
//
// }
//
// export class ConcatPropertyPaths<TObject, TValue, TNextValue>
// 	implements IPropertyPath<TObject, TNextValue>
// {
// 	private readonly _paths: Array<IPropertyPath<any, any>>
// 	public readonly canGet: boolean
// 	public readonly canSet: boolean
//
// 	constructor(...paths: Array<IPropertyPath<any, any>>) {
// 		this._paths = paths
//
// 		const len = paths.length
// 		if (len === 0) {
// 			throw new Error('paths.length === 0')
// 		}
//
// 		let canGet = true
// 		let canSet = true
//
// 		for (let i = 0; i < len; i++) {
// 			const path = paths[i]
// 			if (!path.canGet) {
// 				canGet = false
// 				if (i < len - 1) {
// 					canSet = false
// 				}
// 			}
// 			if (i >= len - 1 && !path.canSet) {
// 				canSet = false
// 			}
// 		}
//
// 		this.canGet = canGet
// 		this.canSet = canSet
// 	}
//
// 	public get(object: TObject): TGetPropertyValueResult3<TValue> {
// 		if (!this.canGet) {
// 			throw new Error('canGet === false')
// 		}
//
// 		const {_paths} = this
// 		for (let i = 0, len = _paths.length; i < len; i++) {
// 			const path = _paths[i]
//
// 			if (!path.canGet) {
// 				canGet = false
// 				if (i < len - 1) {
// 					canSet = false
// 				}
// 			}
// 			if (i >= len - 1 && !path.canSet) {
// 				canSet = false
// 			}
// 		}
// 		return getOrSet(this._get, object)()
// 	}
//
// 	public set(object: TObject, newValue: TValue): TGetPropertyValueResult3<void> {
// 		return getOrSet(this._set, object, true, newValue)()
// 	}
//
// 	public concat<TNextValue>(
// 		nextPath: IPropertyPath<TValue, TNextValue>,
// 	): IPropertyPath<TObject, TNextValue> {
//
// 	}
// }


var Path = /*#__PURE__*/function () {
  // public nodeFirst: IPathNode<TObject, any>
  // public nodeLast: IPathNode<any, TValue>
  function Path(nodes, canGet, canSet) {
    (0, _classCallCheck2.default)(this, Path);
    this.nodes = nodes || [];
    this.canGet = canGet;
    this.canSet = canSet;
  }

  (0, _createClass2.default)(Path, [{
    key: "get",
    value: function get(object) {
      if (!this.canGet) {
        throw new Error('this.canGet == false');
      }

      return pathGetValue(this.nodes, object)();
    }
  }, {
    key: "set",
    value: function set(object, newValue) {
      if (!this.canSet) {
        throw new Error('this.canSet == false');
      }

      return pathSetValue(this.nodes, object, newValue)();
    }
  }, {
    key: "init",
    value: function init() {
      var canGetSet = pathCanGetSet(this.nodes);
      this.canGet = canGetSet && this.nodes[this.nodes.length - 1].getValue != null;
      this.canSet = canGetSet && this.nodes[this.nodes.length - 1].setValue != null;
      return this;
    }
  }, {
    key: "fv",
    value: function fv(getValue, setValue) {
      return this.append(getValue, setValue, true);
    }
  }, {
    key: "f",
    value: function f(getValue, setValue) {
      return this.append(getValue, setValue, false);
    } // public append(): Path<TObject, AsyncPropertyValueOf<TValue>>
    // public append<TNextValue>(
    // 	getValue: TGetValue1<TValue, TNextValue>,
    // 	isValueProperty: true,
    // ): Path<TObject, TNextValue>
    // public append<TNextValue>(
    // 	getValue: TGetValue2<TValue, TNextValue>,
    // 	isValueProperty?: false,
    // ): Path<TObject, TNextValue>

  }, {
    key: "append",
    value: function append(getValue, setValue, isValueProperty) {
      // let setValue
      // let isValueProperty: boolean
      // if (typeof arg2 === 'function') {
      // 	setValue = arg2
      // 	isValueProperty = !!arg3
      // } else {
      // 	setValue = null
      // 	isValueProperty = !!arg2
      // }
      // if (getValue == null && setValue == null) {
      // 	this.init()
      // 	return null
      // }
      this.nodes.push({
        getValue: getValue,
        setValue: setValue,
        isValueProperty: isValueProperty
      });
      return this;
    }
  }, {
    key: "concat",
    value: function concat(nextPath) {
      return pathsConcat(this, nextPath);
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Path(this.nodes, this.canGet, this.canSet);
    } // public static readonly build = pathBuild

  }]);
  return Path;
}(); // export function pathBuild<
// 	TInput,
// 	TValue = TInput
// >(): TGetPropertyPathGetSet<TInput, TValue> {
// 	const path = new Path()
//
// 	const get: any = <TNextValue>(getPath, arg2?, arg3?) => {
// 		if (path.append(getPath, arg2, arg3) == null) {
// 			return path
// 		}
// 		return get
// 	}
//
// 	return get
// }


exports.Path = Path;
Path.concat = pathsConcat;

var PathGetSet = /*#__PURE__*/function () {
  function PathGetSet(pathGet, pathSet) {
    (0, _classCallCheck2.default)(this, PathGetSet);
    var canGet = pathGet != null && pathGet.canGet;
    var canSet = pathSet != null ? pathSet.canSet : pathGet != null && pathGet.canSet;
    this.pathGet = canGet ? pathGet : null;
    this.pathSet = canSet ? pathSet : null;
  }

  (0, _createClass2.default)(PathGetSet, [{
    key: "get",
    value: function get(object) {
      return this.pathGet.get(object);
    }
  }, {
    key: "set",
    value: function set(object, newValue) {
      return this.pathSet.set(object, newValue);
    }
  }, {
    key: "canGet",
    get: function get() {
      return this.pathGet != null;
    }
  }, {
    key: "canSet",
    get: function get() {
      return this.pathSet != null;
    }
  }], [{
    key: "concat",
    value: function concat(path, pathGetSet) {
      return new PathGetSet(pathGetSet == null ? path : (0, _concat.default)(Path).call(Path, path, pathGetSet.pathGet), pathGetSet == null ? path : (0, _concat.default)(Path).call(Path, path, pathGetSet.pathSet));
    }
  }]);
  return PathGetSet;
}();

exports.PathGetSet = PathGetSet;
PathGetSet.build = pathGetSetBuild;

function pathGetSetBuild(common, getSet) {
  var pathCommon = common == null ? null : common(new Path()).init();
  var pathGet;
  var pathSet;

  if (getSet != null) {
    var get = getSet.get,
        set = getSet.set;

    if (get != null) {
      pathGet = get(new Path()).init();
    }

    if (set != null) {
      pathSet = set(new Path()).init();
    }
  }

  return new PathGetSet(pathsConcat(pathCommon, pathGet), pathsConcat(pathCommon, pathSet));
}