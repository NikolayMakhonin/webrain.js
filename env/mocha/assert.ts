/* tslint:disable:no-var-requires triple-equals */
import {deepEqual, IDeepEqualOptions} from './deep-clone-equal'

const AssertionError = require('assertion-error')

class Assert {
	public strictEqual = (actual, expected, message) => {
		if (actual !== expected) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public notStrictEqual = (actual, expected, message) => {
		if (actual === expected) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public deepStrictEqual = (actual, expected, message, options?: IDeepEqualOptions) => {
		if (!deepEqual(actual, expected, options)) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public circularDeepStrictEqual = (actual, expected, message, options?: IDeepEqualOptions) => {
		if (!deepEqual(actual, expected, {
			...options,
			circular: true,
		})) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public equal = (actual, expected, message) => {
		// noinspection EqualityComparisonWithCoercionJS
		if (actual != expected) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public notEqual = (actual, expected, message) => {
		// noinspection EqualityComparisonWithCoercionJS
		if (actual == expected) {
			this.throwAssertionError(actual, expected, message)
		}
	}

	public equalCustom = (actual, expected, check, message) => {
		if (!check(actual, expected)) {
			throw new AssertionError(message, {
				actual,
				expected,
				showDiff: true,
			})
		}
	}

	public throwAssertionError = (actual, expected, message) => {
		throw new AssertionError(message, {
			actual,
			expected,
			showDiff: true,
		})
	}
}

export const assert = new Assert()
