import {isIterator} from '../../../../main/common/helpers/helpers'

export type Func<TThis, TArgs extends any[], TResult = void> = (this: TThis, ...args: TArgs) => TResult

export type TDelegate<
	TThis,
	TArgs extends any[],
	TFuncResult = void,
	TDelegateResult = void,
> = (func: Func<TThis, TArgs, TFuncResult>) => Func<TThis, TArgs, TDelegateResult>

export enum FuncStatus {
	Calculating = 'Calculating',
	Calculated = 'Calculated',
}

type TChangeState<TValue> = (status: FuncStatus, value?: TValue, error?: any) => void

function changeState<
	TThis,
	TArgs extends any[],
	TResult,
>(func: Func<TThis, TArgs, TResult>): Func<TThis, TArgs, TChangeState<TResult>> {
	return null // TODO
}

type TMeta = TDelegate<any, any, any>

let currentMeta: TMeta

function* makeDependentIterator<
	TThis,
	TArgs extends any[],
	TResult,
	TFunc extends Func<TThis, TArgs, TResult>
>(
	meta: TMeta,
	_changeState: TChangeState<TResult>,
	iterator: Iterator<TResult>,
): Iterator<TResult> {
	currentMeta = meta

	let iteration = iterator.next()
	while (!iteration.done) {
		const value = yield iteration.value
		currentMeta = meta
		iteration = iterator.next(value)
	}

	_changeState(FuncStatus.Calculated, iteration.value)

	return iteration.value
}

export function makeDependentFunc<
	TThis,
	TArgs extends any[],
	TResult,
	TFunc extends Func<TThis, TArgs, TResult>
>(
	func: TFunc,
	meta: TMeta,
): TFunc {
	return function() {
		let _changeState

		const parentMeta = currentMeta

		try {
			currentMeta = meta

			if (parentMeta) {
				parentMeta(func).apply(this, arguments)
			}

			_changeState = changeState(func).apply(this, arguments)

			_changeState(FuncStatus.Calculating)

			const result = func.apply(this, arguments)

			if (isIterator(result)) {
				return makeDependentIterator(meta, _changeState, result as Iterator<any>)
			} else {
				_changeState(FuncStatus.Calculated, result)
			}

			return result
		} catch (error) {
			currentMeta = parentMeta
			_changeState(FuncStatus.Calculated, void 0, error)
		}

	} as any
}
