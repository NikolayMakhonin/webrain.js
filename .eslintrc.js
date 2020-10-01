module.exports = {
	'extends': [
		'pro',
		'plugin:@typescript-eslint/recommended',
		// 'plugin:@typescript-eslint/recommended-requiring-type-checking',
	],
	rules: {
		// Temporary disable: TypeError: Cannot read property 'value' of null (waiting for update babel-eslint)
		'template-curly-spacing'                           : 'off',
		'object-curly-spacing'                             : 'off',
		indent                                             : 'off',
		'prefer-destructuring'                             : 'off',
		'no-sync'                                          : 'off',
		'no-warning-comments'                              : 'warn',
		'array-bracket-newline'                            : 'off',
		'require-atomic-updates'                           : 'off',
		'sort-imports'                                     : 'off',
		'lines-between-class-members'                      : 'off',
		'no-new-wrappers'                                  : 'off',
		'generator-star-spacing'                           : ['error', {before: true, after: false}],
		'object-property-newline'                          : 'off',
		'@typescript-eslint/ban-ts-comment'                : 'off',
		'@typescript-eslint/no-var-requires'               : 'off',
		'@typescript-eslint/no-this-alias'                 : 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'arrow-body-style'                                 : 'off',
		'object-shorthand'                                 : 'off',

		// new

		'no-shadow': [
			'error',
			{
				builtinGlobals: true ,
				hoist         : 'all',
				allow         : [],
			},
		],
		'prefer-template'       : 'off',
		'class-methods-use-this': 'off',

		'space-before-function-paren': [
			'warn', {
				anonymous : 'always',
				named     : 'never',
				asyncArrow: 'always',
			},
		],
		'brace-style'       : 'off',
		'no-confusing-arrow': 'off',

		// typescript

		'no-use-before-define'                   : 'off',
		'@typescript-eslint/no-use-before-define': ['error', {
			functions           : true,
			classes             : true,
			variables           : true,
			enums               : true,
			typedefs            : false,
			ignoreTypeReferences: true,
		}],

		'@typescript-eslint/no-inferrable-types': 'off',

		'no-extra-parens'                   : 'off',
		'@typescript-eslint/no-extra-parens': 'error',

		'@typescript-eslint/no-explicit-any': 'off',
	},

	env: {
		node: true,
		es6 : true
	},

	// parser       : 'babel-eslint',
	parser       : '@typescript-eslint/parser', // incorrect fix ";(value as any)" and many other problems (v3.0.1)
	parserOptions: {
		ecmaVersion                : 6,
		sourceType                 : 'module',
		allowImportExportEverywhere: false,
		codeFrame                  : true,
		babelOptions               : {
			configFile: './env/babel/configs/minimal.js'
		},
		project: 'tsconfig.eslint.json',
	},

	plugins: [
		'@typescript-eslint',
		'@typescript-eslint/tslint',
		'sonarjs',
		'html'
	],
	settings: {
		'html/indent'           : '+tab',
		'html/report-bad-indent': 'error',
		'html/html-extensions'  : ['.html', '.svelte']
	},

	overrides: [
		{
			files: ['src/*.html'],
			rules: {
				semi                : ['error', 'always'],
				'semi-style'        : ['error', 'last'],
				'prefer-rest-params': 'off',
				'no-var'            : 'off',
				'vars-on-top'       : 'off'
			},
			env: {
				browser: true,
				es6    : false,
				node   : false
			},
			parser       : 'espree',
			parserOptions: {
				ecmaVersion: 5
			}
		}
	]
}
