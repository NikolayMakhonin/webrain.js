module.exports = {
	'extends': [
		'pro',
		// 'plugin:@typescript-eslint/recommended',
		// 'plugin:@typescript-eslint/recommended-requiring-type-checking',
	],
	rules: {
		'function-call-argument-newline': 'off',
		'function-paren-newline'        : 'off',
		'lines-around-comment'          : 'off',
		'default-param-last'            : 'off',
		'no-tabs'                       : 'off',
		'newline-per-chained-call'      : ['off', {ignoreChainWithDepth: 2}],
		'object-curly-newline'          : [
			'warn',
			{
				ObjectExpression: {
					consistent   : true,
					minProperties: 6,
				},
				ObjectPattern: {
					consistent   : true,
					minProperties: 6,
				},
				ImportDeclaration: {
					consistent   : true,
					minProperties: 6,
				},
				ExportDeclaration: {
					consistent   : true,
					minProperties: 6,
				},
			},
		],

		'no-dupe-class-members'                   : 'off',
		'@typescript-eslint/no-dupe-class-members': ['error'],

		'no-redeclare'                   : 'off',
		'@typescript-eslint/no-redeclare': 'off',

		'no-unused-vars'                   : 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				vars              : 'all',
				args              : 'after-used',
				ignoreRestSiblings: true,
				caughtErrors      : 'all',
			},
		],
	},

	env: {
		node: true,
		es6 : true,
	},

	// parser       : 'babel-eslint',
	parser       : '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion                : 6,
		sourceType                 : 'module',
		allowImportExportEverywhere: false,
		codeFrame                  : true,
		project                    : 'tsconfig.eslint.json',
		// babelOptions               : {
		// 	configFile: './env/babel/configs/minimal.js'
		// },
	},

	plugins : ['@typescript-eslint', 'sonarjs', 'html'],
	settings: {
		'html/indent'           : '+tab',
		'html/report-bad-indent': 'error',
		'html/html-extensions'  : ['.html', '.svelte'],
	},

	overrides: [
		{
			files: ['src/*.html'],
			rules: {
				semi                : ['error', 'always'],
				'semi-style'        : ['error', 'last'],
				'prefer-rest-params': 'off',
				'no-var'            : 'off',
				'vars-on-top'       : 'off',
			},
			env: {
				browser: true,
				es6    : false,
				node   : false,
			},
			parser       : 'espree',
			parserOptions: {
				ecmaVersion: 5,
			},
		},
	],
}
