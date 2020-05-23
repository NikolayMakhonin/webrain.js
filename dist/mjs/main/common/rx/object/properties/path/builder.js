/* tslint:disable:no-circular-imports */
import { resolvePath } from './resolve';
export function pathsConcat(...paths) {
  let isNewArray = false;
  let result;

  for (let i = 0, len = paths.length; i < len; i++) {
    let path = paths[i];

    if (path instanceof Path) {
      path = path.nodes;
    }

    if (path != null) {
      if (Array.isArray(path)) {
        if (result == null) {
          result = path;
        } else if (!isNewArray) {
          result = [...result, ...path];
          isNewArray = true;
        } else {
          result.push(...path);
        }
      } else {
        if (result == null) {
          result = [isNewArray];
          isNewArray = true;
        } else if (!isNewArray) {
          result = [...result, path];
          isNewArray = true;
        } else {
          result.push(path);
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

  const len = pathNodes.length;

  if (len === 0) {
    return false;
  }

  for (let i = 0; i < len - 1; i++) {
    const node = pathNodes[i];

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
  let nextValue = resolvePath(object);

  for (let i = 0, len = path.length - 1; i < len; i++) {
    const node = path[i];
    nextValue = nextValue(node.getValue, node.isValueProperty);
  }

  return nextValue;
}

function pathGetValue(path, object) {
  const nextValue = pathGetOrSetValue(path, object);

  if (path.length === 0) {
    return nextValue;
  }

  const lastNode = path[path.length - 1];
  const getResult = nextValue(lastNode.getValue, lastNode.isValueProperty);
  return getResult;
}

function pathSetValue(path, object, newValue) {
  const nextValue = pathGetOrSetValue(path, object);
  const lastNode = path[path.length - 1];
  const getResult = nextValue(lastNode.setValue, lastNode.isValueProperty, newValue);
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


export class Path {
  // public nodeFirst: IPathNode<TObject, any>
  // public nodeLast: IPathNode<any, TValue>
  constructor(nodes, canGet, canSet) {
    this.nodes = nodes || [];
    this.canGet = canGet;
    this.canSet = canSet;
  }

  get(object) {
    if (!this.canGet) {
      throw new Error('this.canGet == false');
    }

    return pathGetValue(this.nodes, object)();
  }

  set(object, newValue) {
    if (!this.canSet) {
      throw new Error('this.canSet == false');
    }

    return pathSetValue(this.nodes, object, newValue)();
  }

  init() {
    const canGetSet = pathCanGetSet(this.nodes);
    this.canGet = canGetSet && this.nodes[this.nodes.length - 1].getValue != null;
    this.canSet = canGetSet && this.nodes[this.nodes.length - 1].setValue != null;
    return this;
  }

  fv(getValue, setValue) {
    return this.append(getValue, setValue, true);
  }

  f(getValue, setValue) {
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


  append(getValue, setValue, isValueProperty) {
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
      getValue,
      setValue,
      isValueProperty
    });
    return this;
  }

  concat(nextPath) {
    return pathsConcat(this, nextPath);
  }

  clone() {
    return new Path(this.nodes, this.canGet, this.canSet);
  } // public static readonly build = pathBuild


} // export function pathBuild<
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

Path.concat = pathsConcat;
export class PathGetSet {
  constructor(pathGet, pathSet) {
    const canGet = pathGet != null && pathGet.canGet;
    const canSet = pathSet != null ? pathSet.canSet : pathGet != null && pathGet.canSet;
    this.pathGet = canGet ? pathGet : null;
    this.pathSet = canSet ? pathSet : null;
  }

  get canGet() {
    return this.pathGet != null;
  }

  get canSet() {
    return this.pathSet != null;
  }

  get(object) {
    return this.pathGet.get(object);
  }

  set(object, newValue) {
    return this.pathSet.set(object, newValue);
  }

  static concat(path, pathGetSet) {
    return new PathGetSet(pathGetSet == null ? path : Path.concat(path, pathGetSet.pathGet), pathGetSet == null ? path : Path.concat(path, pathGetSet.pathSet));
  }

}
PathGetSet.build = pathGetSetBuild;
export function pathGetSetBuild(common, getSet) {
  const pathCommon = common == null ? null : common(new Path()).init();
  let pathGet;
  let pathSet;

  if (getSet != null) {
    const {
      get,
      set
    } = getSet;

    if (get != null) {
      pathGet = get(new Path()).init();
    }

    if (set != null) {
      pathSet = set(new Path()).init();
    }
  }

  return new PathGetSet(pathsConcat(pathCommon, pathGet), pathsConcat(pathCommon, pathSet));
}