import {getOrCreateCallState, subscribeCallState} from '../../../rx/depend/core/CallState'
import {depend} from '../../../rx/depend/core/depend'
import {Binder} from '../bindings/Binder'
import {noSubscribe} from '../core/current-state'
import {IBinder, IGetSetValue, IUnBind, TGetValue, TSetValue} from './contracts'

// tslint:disable-next-line:no-shadowed-variable
const _propagateValue = depend(function *_propagateValue<TSource, TDest, TValue>(
	source: TSource,
	getValue: TGetValue<TSource, TValue>,
	dest: TDest,
	setValue: TSetValue<TDest, TValue>,
) {
	const value: TValue = yield getValue(source)
	noSubscribe(() => setValue(dest, value))
})

// tslint:disable-next-line:no-shadowed-variable
const _getOneWayBinder = depend(function _getOneWayBinder<TSource, TDest, TValue>(
	source: TSource,
	getValue: TGetValue<TSource, TValue>,
	dest: TDest,
	setValue: TSetValue<TDest, TValue>,
): IBinder {
	function bind(): IUnBind {
		return subscribeCallState(getOrCreateCallState(_propagateValue)(
			source, getValue, dest, setValue,
		))
	}

	return new Binder(bind)
})

// tslint:disable-next-line:no-shadowed-variable
const _getTwoWayBinder = depend(function _getTwoWayBinder<TSourceDest1, TSourceDest2, TValue>(
	sourceDest1: TSourceDest1,
	getSetValue1: IGetSetValue<TSourceDest1, TValue>,
	sourceDest2: TSourceDest2,
	getSetValue2: IGetSetValue<TSourceDest2, TValue>,
): IBinder {
	const binder1 = _getOneWayBinder(
		sourceDest1, getSetValue1.getValue, sourceDest2, getSetValue2.setValue,
	)
	const binder2 = _getOneWayBinder(
		sourceDest2, getSetValue2.getValue, sourceDest1, getSetValue1.setValue,
	)

	function bind(): IUnBind {
		const unbind1 = binder1.bind()
		const unbind2 = binder2.bind()

		return () => {
			unbind1()
			unbind2()
		}
	}

	return new Binder(bind)
})

export function getOneWayBinder<TSource, TDest, TValue>(
	source: TSource,
	getValue: TGetValue<TSource, TValue>,
	dest: TDest,
	setValue: TSetValue<TDest, TValue>,
): IBinder {
	return _getOneWayBinder(source, getValue, dest, setValue)
}

export function getTwoWayBinder<TSourceDest1, TSourceDest2, TValue>(
	sourceDest1: TSourceDest1,
	getSetValue1: IGetSetValue<TSourceDest1, TValue>,
	sourceDest2: TSourceDest2,
	getSetValue2: IGetSetValue<TSourceDest2, TValue>,
): IBinder {
	return _getTwoWayBinder(sourceDest1, getSetValue1, sourceDest2, getSetValue2)
}
