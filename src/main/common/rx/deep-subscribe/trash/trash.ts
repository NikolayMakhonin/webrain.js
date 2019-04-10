// region Test

import {RuleBuilder} from "../deep-subscribe";

interface IObj {
	a__: boolean
	b: Set<{
		e: number[],
	}>
	c: {
		d: string,
	}
}

declare global {
	export interface Set<T> {
		0: T
	}
}

export function test(o: any|IObj) {
	return o
}

test({
	a__: 'true',
})

// endregion

export class DeepSubscribe<TObject> extends RuleBuilder<TObject> {
	private readonly _object: TObject

	constructor(object: TObject) {
		super()
		this._object = object
	}
}
