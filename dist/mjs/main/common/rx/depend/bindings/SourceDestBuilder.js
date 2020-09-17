import { depend } from '../../../rx/depend/core/depend';
import { Binder } from './Binder';
export class SourceDest {
  constructor(source, dest) {
    this._source = source;
    this._dest = typeof dest === 'function' ? dest : value => dest.set(value);
  }

  getOneWayBinder(dest) {
    return this._source.getOneWayBinder(dest);
  }

  getTwoWayBinder(sourceDest) {
    const binder1 = this._source.getOneWayBinder(sourceDest);

    const binder2 = sourceDest.getOneWayBinder(this);

    const bind = () => {
      const unbind1 = binder1.bind();
      const unbind2 = binder2.bind();
      return () => {
        unbind1();
        unbind2();
      };
    };

    return new Binder(bind);
  }

  set(value) {
    this._dest(value);
  }

}
SourceDest.prototype.getOneWayBinder = depend(SourceDest.prototype.getOneWayBinder);
SourceDest.prototype.getTwoWayBinder = depend(SourceDest.prototype.getTwoWayBinder);
export class SourceDestBuilder {
  constructor(sourceBuilder, destBuilder) {
    this._sourceBuilder = sourceBuilder;
    this._destBuilder = destBuilder;
  }

  get(object) {
    const source = this._sourceBuilder.get(object);

    const dest = this._destBuilder.get(object);

    return new SourceDest(source, dest);
  }

}
SourceDestBuilder.prototype.get = depend(SourceDestBuilder.prototype.get);