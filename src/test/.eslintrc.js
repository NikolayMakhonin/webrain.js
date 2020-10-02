// eslint-disable-next-line no-undef
module.exports = {
	env: {
		browser: false,
		node   : false,
	},
	rules: {
		'func-names'     : 'off',
		'no-process-exit': 'off',

		'no-empty-function'         : 'off',
		'no-unused-vars'            : 'off',
		'no-new-wrappers'           : 'off',
		'no-sync'                   : 'off',
		'no-undefined'              : 'off',
		'dot-notation'              : 'off',
		'no-process-env'            : 'off',
		'no-undef'                  : 'off',
		'no-promise-executor-return': 'off',
		'function-paren-newline'    : 'off',
		'object-curly-newline'      : 'off',
		'max-len'                   : 'off',
		'array-element-newline'     : 'off',
		'lines-around-comment'      : 'off',

		'no-await-in-loop'            : 'off',
		'func-style'                  : 'off',
		'prefer-const'                : 'off',
		'require-await'               : 'off',
		'no-unmodified-loop-condition': 'off',
		'no-return-await'             : 'off',
		'new-cap'                     : 'off',
		'no-loop-func'                : 'off',
		'no-empty'                    : 'off',
		'consistent-return'           : 'off',
		'no-lonely-if'                : 'off',
		'no-else-return'              : 'off',
		'object-property-newline'     : 'off',

		'no-array-constructor'                   : 'off',
		'@typescript-eslint/no-array-constructor': 'off',

		'@typescript-eslint/no-unused-vars'    : 'off',
		'@typescript-eslint/no-empty-function' : 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/ban-ts-comment'    : 'off',

		'no-shadow'                   : 'off',
		'@typescript-eslint/no-shadow': 'off',
	},
	globals: {
		console: true,
	},
}
