module.exports = {
	'extends': [
		'pro',
		// 'plugin:@typescript-eslint/recommended',
		// 'plugin:@typescript-eslint/recommended-requiring-type-checking',
	],
	rules: {

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
