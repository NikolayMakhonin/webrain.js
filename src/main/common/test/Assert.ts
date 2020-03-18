/* tslint:disable:no-var-requires triple-equals */
import {TClass} from '../helpers/helpers'
import {DeepCloneEqual, IDeepEqualOptions} from './DeepCloneEqual'

export const AssertionError = typeof require === 'function'
	? require('assertion-error')
	: class extends Error { }

const deepCloneEqualDefault = new DeepCloneEqual()

if (!console.debug) {
	console.debug = console.info
}

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

	private assertError(err: Error, errType?: TClass<any>|Array<TClass<any>>, regExp?: RegExp, message?: string) {
		this.ok(err)

		if (err instanceof AssertionError) {
			const index = Assert.errors.indexOf(err)
			Assert.errors.splice(index, 1)
		}

		if (errType) {
			const actualErrType = err.constructor
			if (Array.isArray(errType)) {
				if (!errType.some(o => o === actualErrType)) {
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
			this.ok(
				regExp.test(err.message),
				err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message,
			)
		}
	}

	public async throwsAsync(
		fn: () => Promise<void>,
		errType?: TClass<any>|Array<TClass<any>>,
		regExp?: RegExp, message?: string,
	): Promise<void> {
		let err
		try {
			await fn()
		} catch (ex) {
			err = ex
		}

		this.assertError(err, errType, regExp, message)
	}

	public throws(
		fn: () => void,
		errType?: TClass<any>|Array<TClass<any>>,
		regExp?: RegExp, message?: string,
	): void {
		let err
		try {
			fn()
		} catch (ex) {
			err = ex
		}

		this.assertError(err, errType, regExp, message)
	}

	public assertNotHandledErrors() {
		if (Assert.errors.length) {
			const firstError = Assert.errors[0]
			Assert.errors = []
			throw firstError
		}
	}

	public static errors: Error[] = []

	// noinspection JSMethodCanBeStatic
	public throwAssertionError(actual, expected, message?: string) {
		console.debug('actual: ', actual)
		console.debug('expected: ', expected)
		const error = new AssertionError(message, {
			actual,
			expected,
			showDiff: true,
		})

		if (!Assert.errors) {
			Assert.errors = [error]
		} else {
			Assert.errors.push(error)
		}

		throw error
	}
}

export const assert = new Assert()
