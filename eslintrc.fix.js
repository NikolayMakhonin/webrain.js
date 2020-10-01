const base = require('./.eslintrc.js')

const rules = {
	'key-spacing': [
		'warn',
		{
			singleLine: {
				beforeColon: false,
				afterColon : true,
				mode       : 'strict',
			},
			multiLine: {
				beforeColon: false,
				afterColon : true,
				align      : 'colon',
			},
		},
	],
	'space-before-function-paren': [
		'warn', {
			anonymous : 'always',
			named     : 'never',
			asyncArrow: 'always',
		},
	],
	'generator-star-spacing': [
		'warn',
		{
			before: true,
			after : false,
		},
	],
	'array-bracket-spacing': [
		'warn',
		'never',
		{
			singleValue    : false,
			arraysInArrays : false,
			objectsInArrays: false,
		},
	],
	'semi-style'        : ['error', 'first'],
	semi                : ['error', 'never', {beforeStatementContinuationChars: 'never'}],
	'operator-linebreak': [
		'error', 'before', {
			overrides: {'=': 'after'},
		},
	],
	'no-mixed-spaces-and-tabs': 'error',
	// '@typescript-eslint/no-extra-parens': [
	// 	'error',
	// 	'all',
	// 	{
	// 		returnAssign                      : false,
	// 		nestedBinaryExpressions           : false,
	// 		enforceForArrowConditionals       : false,
	// 		enforceForNewInMemberExpressions  : false,
	// 		enforceForFunctionPrototypeMethods: true,
	// 	},
	// ],
}

const rulesOff = {}
for (const key in rules) {
	if (Object.prototype.hasOwnProperty.call(rules, key)) {
		rulesOff[key] = 'off'
	}
}

module.exports = {
	root: true,

	rules,

	env: base.env,

	parser       : base.parser,
	parserOptions: base.parserOptions,

	plugins : base.plugins && base.plugins.filter(o => /^@typescript-eslint/.test(o)),
	settings: base.settings,

	overrides: base.overrides && base.overrides.map(o => ({
		...o,
		rules: rulesOff,
	}))
}
