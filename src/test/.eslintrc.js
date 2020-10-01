// eslint-disable-next-line no-undef
module.exports = {
	env: {
		browser: false,
		node   : false
	},
	rules: {
		'no-empty-function'                   : ['off'],
		'no-unused-vars'                      : ['off'],
		'no-new-wrappers'                     : ['off'],
		'no-sync'                             : ['off'],
		'no-undefined'                        : ['off'],
		'dot-notation'                        : ['off'],
		'no-process-env'                      : 'off',
		'@typescript-eslint/no-unused-vars'   : 'off',
		'@typescript-eslint/no-empty-function': 'off',
	},
	globals: {
		console: true
	}
}
