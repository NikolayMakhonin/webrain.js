/* eslint-disable eqeqeq */
const fastDeepStrictEqual = require('fast-equals').deepEqual

;(function() {
	const {assert} = global

	const {
		strictEqual,
		notStrictEqual,
		deepStrictEqual,
		equal,
		notEqual,
	} = assert

	assert.strictEqual = (o1, o2, message) => {
		if (o1 !== o2) {
			strictEqual(o1, o2, message)
		}
	}

	assert.notStrictEqual = (o1, o2, message) => {
		if (o1 === o2) {
			notStrictEqual(o1, o2, message)
		}
	}

	assert.deepStrictEqual = (o1, o2, message) => {
		if (!fastDeepStrictEqual(o1, o2)) {
			deepStrictEqual(o1, o2, message)
		}
	}

	assert.equal = (o1, o2, message) => {
		// noinspection EqualityComparisonWithCoercionJS
		if (o1 != o2) {
			equal(o1, o2, message)
		}
	}

	assert.notEqual = (o1, o2, message) => {
		// noinspection EqualityComparisonWithCoercionJS
		if (o1 == o2) {
			notEqual(o1, o2, message)
		}
	}
})()
