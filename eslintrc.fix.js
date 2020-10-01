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
}

const rulesOff = {}
for (const key in rules) {
	if (Object.prototype.hasOwnProperty.call(rules, key)) {
		rulesOff[key] = 'off'
	}
}

module.exports = {
	// 'extends': base.extends && base.extends.filter(o => /@typescript-eslint/.test(o)),

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
