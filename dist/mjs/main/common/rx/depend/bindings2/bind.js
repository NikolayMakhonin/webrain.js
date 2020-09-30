import { getOrCreateCallState, subscribeCallState } from '../../../rx/depend/core/CallState';
import { depend } from '../../../rx/depend/core/depend';
import { Binder } from '../bindings/Binder';
import { noSubscribe } from '../core/current-state';

// tslint:disable-next-line:no-shadowed-variable
const _propagateValue = depend(function* _propagateValue(source, getValue, dest, setValue) {
  const value = yield getValue(source);
  noSubscribe(() => setValue(dest, value));
}); // tslint:disable-next-line:no-shadowed-variable


const _getOneWayBinder = depend(function _getOneWayBinder(source, getValue, dest, setValue) {
  function bind() {
    return subscribeCallState(getOrCreateCallState(_propagateValue)(source, getValue, dest, setValue));
  }

  return new Binder(bind);
}); // tslint:disable-next-line:no-shadowed-variable


const _getTwoWayBinder = depend(function _getTwoWayBinder(sourceDest1, getSetValue1, sourceDest2, getSetValue2) {
  const binder1 = _getOneWayBinder(sourceDest1, getSetValue1.getValue, sourceDest2, getSetValue2.setValue);

  const binder2 = _getOneWayBinder(sourceDest2, getSetValue2.getValue, sourceDest1, getSetValue1.setValue);

  function bind() {
    const unbind1 = binder1.bind();
    const unbind2 = binder2.bind();
    return () => {
      unbind1();
      unbind2();
    };
  }

  return new Binder(bind);
});

export function getOneWayBinder(source, getValue, dest, setValue) {
  return _getOneWayBinder(source, getValue, dest, setValue);
}
export function getTwoWayBinder(sourceDest1, getSetValue1, sourceDest2, getSetValue2) {
  return _getTwoWayBinder(sourceDest1, getSetValue1, sourceDest2, getSetValue2);
}