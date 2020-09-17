import { getOrCreateCallState, subscribeCallState } from '../../../rx/depend/core/CallState';
import { CallStatusShort } from '../../../rx/depend/core/contracts';
import { depend } from '../../../rx/depend/core/depend';
import { Path } from '../../object/properties/path/builder';
import { Binder } from './Binder';
export class SourcePath {
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
SourcePath.prototype.getOneWayBinder = depend(SourcePath.prototype.getOneWayBinder);
export class SourcePathBuilder {
  constructor(pathBuilder) {
    this._path = pathBuilder(new Path()).init();
  }

  get(object) {
    const path = this._path;

    const getValue = () => path.get(object);

    return new SourcePath(getValue);
  }

}
SourcePathBuilder.prototype.get = depend(SourcePathBuilder.prototype.get);
export class DestPathBuilder {
  constructor(pathBuilder) {
    this._path = pathBuilder(new Path()).init();
  }

  get(object) {
    const path = this._path;
    return value => path.set(object, value);
  }

}
DestPathBuilder.prototype.get = depend(DestPathBuilder.prototype.get);