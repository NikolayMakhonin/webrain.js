import { missingSetter } from '../../../helpers/helpers';
import { getOrCreateCallState } from '../../../rx/depend/core/CallState';
import { depend } from '../../../rx/depend/core/depend';
import { dependWait } from '../../../rx/depend/helpers';
import { makeDependPropertySubscriber } from '../helpers';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { Connector } from './Connector';
import { observableClass } from './helpers';
import { Path, PathGetSet } from './path/builder';
export class ConnectorBuilder extends ObservableObjectBuilder {
  constructor(object, sourcePath) {
    super(object);
    this.sourcePath = sourcePath;
  } // region connectSimple


  connectSimple(name, common, getSet, options) {
    return this._connect(name, common, getSet, options);
  } // endregion
  // region connect


  connect(name, common, getSet, options) {
    return this._connect(name, common, getSet, options ? { ...options,
      isDepend: true
    } : {
      isDepend: true
    });
  } // endregion
  // region connectLazy


  connectLazy(name, common, getSet, options) {
    return this._connect(name, common, getSet, options ? { ...options,
      isDepend: true,
      isLazy: true
    } : {
      isDepend: true,
      isLazy: true
    });
  } // endregion
  // region connectWait


  connectWait(name, common, getSet, options) {
    return this._connect(name, common, getSet, options ? { ...options,
      isDepend: true,
      isWait: true
    } : {
      isDepend: true,
      isWait: true
    });
  } // endregion
  // region connectWaitLazy


  connectWaitLazy(name, common, getSet, options) {
    return this._connect(name, common, getSet, options ? { ...options,
      isDepend: true,
      isLazy: true,
      isWait: true
    } : {
      isDepend: true,
      isLazy: true,
      isWait: true
    });
  } // endregion
  // region _connect


  _connect(name, common, getSet, options) {
    let path = PathGetSet.build(common, getSet);
    const {
      sourcePath
    } = this;

    if (sourcePath != null) {
      path = PathGetSet.concat(sourcePath, path);
    }

    const {
      hidden,
      isDepend,
      isLazy,
      isWait,
      waitCondition,
      waitTimeout
    } = options || {};
    const {
      object
    } = this;

    if (!path.canGet) {
      throw new Error('path.canGet == false');
    }

    let getValue = function () {
      return path.get(this);
    };

    if (isDepend) {
      getValue = depend(getValue, null, makeDependPropertySubscriber(name));

      if (isWait) {
        getValue = dependWait(getValue, waitCondition, waitTimeout, isLazy);
      } else if (isLazy) {
        const _getValue = getValue;

        getValue = function () {
          const state = getOrCreateCallState(_getValue).apply(this, arguments);
          return state.getValue(true);
        };
      }
    }

    Object.defineProperty(object, name, {
      configurable: true,
      enumerable: !hidden,
      get: getValue,
      set: !path.canSet ? missingSetter : function (value) {
        return path.set(this, value);
      }
    });
    return this;
  } // endregion


}
export function dependConnectorClass(build, baseClass) {
  const sourcePath = new Path().f(o => o.connectorState).f(o => o.source).init();
  return observableClass(object => build(new ConnectorBuilder(object, sourcePath)).object, baseClass != null ? baseClass : Connector);
}
export function connectorFactory({
  name,
  build,
  baseClass
}) {
  const NewConnector = dependConnectorClass(build, baseClass);
  return (source, _name) => new NewConnector(source, _name != null ? _name : name);
}