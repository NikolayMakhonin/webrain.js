/* tslint:disable:no-var-requires triple-equals */
import _AssertionError from 'assertion-error'
import {TClass} from '../helpers/helpers'
import {DeepCloneEqual, IDeepEqualOptions} from './DeepCloneEqual'

export const AssertionError = _AssertionError

const deepCloneEqualDefault = new DeepCloneEqual()

export class Assert {
	public deepCloneEqual: DeepCloneEqual

	constructor(deepCloneEqual?: DeepCloneEqual) {
		this.deepCloneEqual = deepCloneEqual || deepCloneEqualDefault
	}

	public fail(message?: string) {
		this.throwAssertionError(null, null, message)
	}

	public ok(value, message?: string) {
		if (!value) {
			this.throwAssertionError(value, true, message)
		}
	}

	public notOk(value, message?: string) {
		if (value) {
			this.throwAssertionError(value, false, message)
		}
	}

	public strictEqual(actual, expected, message?: string) {
		if (actual !== expected) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public notStrictEqual(actual, expected, message?: string) {
		if (actual === expected) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public deepStrictEqual(actual, expected, message?: string, options?: IDeepEqualOptions) {
		if (!this.deepCloneEqual.equal(actual, expected, options)) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public circularDeepStrictEqual(actual, expected, message?: string, options?: IDeepEqualOptions) {
		if (!this.deepCloneEqual.equal(actual, expected, {
			...options,
			circular: true,
		})) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public equal(actual, expected, message?: string) {
		// noinspection EqualityComparisonWithCoercionJS
		if (actual != expected) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public notEqual(actual, expected, message?: string) {
		// noinspection EqualityComparisonWithCoercionJS
		if (actual == expected) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public equalCustom(actual, expected, check, message?: string) {
		if (!check(actual, expected)) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public throws(fn: () => void, errType?: TClass<any>|Array<TClass<any>>, regExp?: RegExp, message?: string): void {
		let err
		try {
			fn()
		} catch (ex) {
			err = ex
		}

		this.ok(err)

		if (errType) {
			const actualErrType = err.constructor
			if (Array.isArray(errType)) {
				if (!(errType as Array<TClass<any>>).some(o => o === actualErrType)) {
					this.throwAssertionError(
						actualErrType.name,
						errType.map(o => o && o.name),
						err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message)
				}
			} else {
				if (actualErrType !== errType) {
					this.throwAssertionError(
						actualErrType.name,
						errType.name,
						err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message)
				}
			}
		}

		if (regExp) {
			this.ok(regExp.test(err.message))
		}
	}

	public throwAssertionError(actual, expected, message?: string) {
		throw new AssertionError(message, {
			actual,
			expected,
			showDiff: true,
		})
	}
}

export const assert = new Assert()
