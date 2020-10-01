// eslint-disable-next-line no-undef
module.exports = {
	env: {
		browser: false,
		node   : false
	},
	rules: {
		'no-empty-function': 'off',
		'no-unused-vars'   : 'off',
		'no-new-wrappers'  : 'off',
		'no-sync'          : 'off',
		'no-undefined'     : 'off',
		'dot-notation'     : 'off',
		'no-process-env'   : 'off',

		// new

		'no-shadow'       : 'off',
		'no-await-in-loop': 'off',

		'@typescript-eslint/no-unused-vars'   : 'off',
		'@typescript-eslint/no-empty-function': 'off',

		'@typescript-eslint/no-use-before-define': ['error', {
			functions           : false,
			classes             : true,
			variables           : true,
			enums               : true,
			typedefs            : false,
			ignoreTypeReferences: true,
		}],

		// '@typescript-eslint/no-unused-array'             : 'off',
		// '@typescript-eslint/no-dead-store'               : 'off',
		// '@typescript-eslint/prefer-const'                : 'off',
		// '@typescript-eslint/no-invalid-await'            : 'off',
		// '@typescript-eslint/no-array-delete'             : 'off',
		// '@typescript-eslint/no-misleading-array-reverse' : 'off',
		// '@typescript-eslint/no-useless-cast'             : 'off',
		// '@typescript-eslint/no-identical-functions'      : 'off',
		// '@typescript-eslint/no-use-of-empty-return-value': 'off',
	},
	globals: {
		console: true
	}
}
