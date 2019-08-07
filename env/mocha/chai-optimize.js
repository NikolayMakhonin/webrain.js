/* eslint-disable eqeqeq */
const {
	deepEqual: fastDeepStrictEqual,
	circularDeepEqual: fastCircularDeepStrictEqual
} = require('fast-equals')

// const AssertionError = require('assertion-error')

;(function () {
	const {assert} = global

	const {
		strictEqual,
		notStrictEqual,
		deepStrictEqual,
		equal,
		notEqual,
	} = assert

	assert.strictEqual = (actual, expected, message) => {
		if (actual !== expected) {
			strictEqual(actual, expected, message)
		}
	}

	assert.notStrictEqual = (actual, expected, message) => {
		if (actual === expected) {
			notStrictEqual(actual, expected, message)
		}
	}

	assert.deepStrictEqual = (actual, expected, message) => {
		if (!fastDeepStrictEqual(actual, expected, {})) {
			deepStrictEqual(actual, expected, message)
		}
	}

	assert.circularDeepStrictEqual = (actual, expected, message) => {
		if (!fastCircularDeepStrictEqual(actual, expected)) {
			// throw new AssertionError(message, {
			// 	actual,
			// 	expected,
			// 	showDiff: true,
			// })
			deepStrictEqual(actual, expected, message)
		}
	}

	assert.equal = (actual, expected, message) => {
		// noinspection EqualityComparisonWithCoercionJS
		if (actual != expected) {
			equal(actual, expected, message)
		}
	}

	assert.notEqual = (actual, expected, message) => {
		// noinspection EqualityComparisonWithCoercionJS
		if (actual == expected) {
			notEqual(actual, expected, message)
		}
	}
})()
