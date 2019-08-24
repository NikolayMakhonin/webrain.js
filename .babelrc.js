module.exports = {
	presets: [
		[
			'@babel/preset-env', {
				targets: {
					chrome: '30'
				}
			}
		]
	],
	plugins: [
		'babel-plugin-ts-nameof',
		'@babel/plugin-transform-typescript',
		// Even prototype decorators is slow - create object x13 times slower
		// [
		// 	'@babel/plugin-proposal-decorators', {
		// 		legacy: false,
		// 		decoratorsBeforeExport: true,
		// 	}
		// ],

		'@babel/plugin-syntax-dynamic-import',
		[
			'@babel/plugin-transform-runtime', {
				useESModules: false
			}
		],

		'@babel/plugin-proposal-optional-chaining',
		'@babel/plugin-proposal-throw-expressions',

		['@babel/plugin-proposal-class-properties', {loose: true}],
		'@babel/plugin-transform-parameters',
		'@babel/plugin-transform-async-to-generator',
		'@babel/plugin-transform-for-of',
		'@babel/plugin-transform-regenerator'
	]
}
