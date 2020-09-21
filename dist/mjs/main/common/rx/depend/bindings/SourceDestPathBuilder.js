import { getOrCreateCallState, subscribeCallState } from '../../../rx/depend/core/CallState';
import { CallStatusShort } from '../../../rx/depend/core/contracts';
import { depend } from '../../../rx/depend/core/depend';
import { Path, PathGetSet, pathGetSetBuild } from '../../object/properties/path/builder';
import { Binder } from './Binder';
import { sourceDestBuilder } from './SourceDestBuilder';

class SourcePath {
  constructor(getValue) {
    this._getValue = depend(getValue);
  }

  getOneWayBinder(dest) {
    const getValue = this._getValue;
    const destFunc = typeof dest === 'function' ? dest : value => dest.set(value);

    const bind = () => {
      return subscribeCallState(getOrCreateCallState(getValue)(), state => {
        if (state.statusShort === CallStatusShort.CalculatedValue) {
          destFunc(state.value);
        }
      });
    };

    return new Binder(bind);
  }

}

SourcePath.prototype.getOneWayBinder = depend(SourcePath.prototype.getOneWayBinder); // tslint:disable-next-line:no-shadowed-variable

export const sourcePath = depend(function sourcePath(getValue) {
  return new SourcePath(getValue);
});

function resolvePathOrBuilder(pathOrBuilder) {
  return typeof pathOrBuilder === 'function' ? pathOrBuilder(new Path()).init() : pathOrBuilder;
}

class SourcePathBuilder {
  constructor(pathOrBuilder) {
    this._path = resolvePathOrBuilder(pathOrBuilder);

    if (this._path == null) {
      throw new Error('path == null');
    }

    if (!this._path.canGet) {
      throw new Error('path.canGet is false');
    }
  }

  getSource(object) {
    const path = this._path;

    const getValue = () => path.get(object);

    return sourcePath(getValue);
  }

}

SourcePathBuilder.prototype.getSource = depend(SourcePathBuilder.prototype.getSource); // region sourcePathBuilder
// tslint:disable-next-line:no-shadowed-variable

const _sourcePathBuilder = depend(function _sourcePathBuilder(pathOrBuilder) {
  return new SourcePathBuilder(pathOrBuilder);
});

export function sourcePathBuilder(pathOrBuilder) {
  return pathOrBuilder == null ? _sourcePathBuilder : _sourcePathBuilder(pathOrBuilder);
} // endregion

class DestPathBuilder {
  constructor(pathOrBuilder) {
    this._path = resolvePathOrBuilder(pathOrBuilder);

    if (this._path == null) {
      throw new Error('path == null');
    }

    if (!this._path.canSet) {
      throw new Error('path.canSet is false');
    }
  }

  getDest(object) {
    const path = this._path;
    return value => path.set(object, value);
  }

}

DestPathBuilder.prototype.getDest = depend(DestPathBuilder.prototype.getDest); // region destPathBuilder
// tslint:disable-next-line:no-shadowed-variable

const _destPathBuilder = depend(function _destPathBuilder(pathOrBuilder) {
  return new DestPathBuilder(pathOrBuilder);
});

export function destPathBuilder(pathOrBuilder) {
  return pathOrBuilder == null ? _destPathBuilder : _destPathBuilder(pathOrBuilder);
} // endregion
// region sourceDestPathBuilder
// tslint:disable-next-line:no-shadowed-variable

const _sourceDestPathBuilder = depend(__sourceDestPathBuilder);

function __sourceDestPathBuilder(pathOrBuilderCommon, pathOrBuilderGetSet) {
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

  const sourceBuilder = sourcePathBuilder(pathGet);
  const destBuilder = destPathBuilder(pathSet);
  return sourceDestBuilder(sourceBuilder, destBuilder);
}

export function sourceDestPathBuilder(pathOrBuilderCommon, pathOrBuilderGetSet) {
  return pathOrBuilderCommon == null && pathOrBuilderGetSet == null ? _sourceDestPathBuilder : _sourceDestPathBuilder(pathOrBuilderCommon, pathOrBuilderGetSet);
} // endregion