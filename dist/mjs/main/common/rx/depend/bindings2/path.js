import { depend } from '../../../rx/depend/core/depend';
import { Path, PathGetSet, pathGetSetBuild } from '../../object/properties/path/builder';

// region helpers
function resolvePathOrBuilder(pathOrBuilder) {
  return typeof pathOrBuilder === 'function' ? pathOrBuilder(new Path()).init() : pathOrBuilder;
} // endregion
// region createPathGetValue
// tslint:disable-next-line:no-shadowed-variable


const _createPathGetValue = depend(function _createPathGetValue(pathOrBuilder) {
  const path = resolvePathOrBuilder(pathOrBuilder);

  if (path == null) {
    throw new Error('path == null');
  }

  if (!path.canGet) {
    throw new Error('path.canGet is false');
  }

  return object => path.get(object);
});

export function createPathGetValue(pathOrBuilder) {
  return pathOrBuilder == null ? _createPathGetValue : _createPathGetValue(pathOrBuilder);
} // endregion
// region createPathSetValue
// tslint:disable-next-line:no-shadowed-variable

const _createPathSetValue = depend(function _createPathSetValue(pathOrBuilder) {
  const path = resolvePathOrBuilder(pathOrBuilder);

  if (path == null) {
    throw new Error('path == null');
  }

  if (!path.canSet) {
    throw new Error('path.canSet is false');
  }

  return (object, value) => path.set(object, value);
});

export function createPathSetValue(pathOrBuilder) {
  return pathOrBuilder == null ? _createPathSetValue : _createPathSetValue(pathOrBuilder);
} // endregion
// region createPathGetSetValue
// tslint:disable-next-line:no-shadowed-variable

const _createPathGetSetValue = depend(__createPathGetSetValue);

function __createPathGetSetValue(pathOrBuilderCommon, pathOrBuilderGetSet) {
  let pathGetSet;

  if (typeof pathOrBuilderCommon === 'function') {
    pathGetSet = pathGetSetBuild(pathOrBuilderCommon, pathOrBuilderGetSet);
  } else if (pathOrBuilderCommon instanceof PathGetSet) {
    if (pathOrBuilderGetSet != null) {
      throw new Error('The second argument should be null: ' + typeof pathOrBuilderGetSet);
    }

    pathGetSet = pathOrBuilderCommon;
  }

  let pathGet;
  let pathSet;

  if (pathGetSet != null) {
    pathGet = pathGetSet.pathGet;
    pathSet = pathGetSet.pathSet;
  } else {
    pathGet = pathOrBuilderCommon;
    pathSet = pathOrBuilderGetSet;
  }

  const getValue = createPathGetValue(pathGet);
  const setValue = createPathSetValue(pathSet);
  return {
    getValue,
    setValue
  };
}

export function createPathGetSetValue(pathOrBuilderCommon, pathOrBuilderGetSet) {
  return pathOrBuilderCommon == null && pathOrBuilderGetSet == null ? _createPathGetSetValue : _createPathGetSetValue(pathOrBuilderCommon, pathOrBuilderGetSet);
} // endregion