import { depend } from '../../../rx/depend/core/depend';
import { Binder } from './Binder';

class SourceDest {
  constructor(source, dest) {
    this.source = source;
    this.dest = typeof dest === 'function' ? dest : value => dest.set(value);
  }

  getOneWayBinder(dest) {
    return this.source.getOneWayBinder(dest);
  } // tslint:disable-next-line:no-shadowed-variable


  getTwoWayBinder(sourceDest) {
    const binder1 = this.source.getOneWayBinder(sourceDest.dest);
    const binder2 = sourceDest.source.getOneWayBinder(this.dest);

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

}

SourceDest.prototype.getOneWayBinder = depend(SourceDest.prototype.getOneWayBinder);
SourceDest.prototype.getTwoWayBinder = depend(SourceDest.prototype.getTwoWayBinder); // tslint:disable-next-line:no-shadowed-variable

export const sourceDest = depend(function sourceDest(source, dest) {
  return new SourceDest(source, dest);
});

class SourceDestBuilder {
  constructor(sourceBuilder, destBuilder) {
    this._sourceBuilder = sourceBuilder;
    this._destBuilder = destBuilder;
  }

  getSource(object) {
    return this._sourceBuilder.getSource(object);
  }

  getDest(object) {
    return this._destBuilder.getDest(object);
  }

  getSourceDest(object) {
    const source = this._sourceBuilder.getSource(object);

    const dest = this._destBuilder.getDest(object);

    return sourceDest(source, dest);
  }

} // region sourceDestBuilder
// tslint:disable-next-line:no-shadowed-variable


const _sourceDestBuilder = depend(function _sourceDestBuilder(sourceBuilder, destBuilder) {
  return new SourceDestBuilder(sourceBuilder, destBuilder);
});

export function sourceDestBuilder(sourceBuilder, destBuilder) {
  return sourceBuilder == null && destBuilder == null ? _sourceDestBuilder : _sourceDestBuilder(sourceBuilder, destBuilder);
} // endregion