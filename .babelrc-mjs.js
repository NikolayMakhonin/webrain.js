module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false
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

		'@babel/plugin-transform-runtime',
		'@babel/plugin-proposal-optional-chaining',

		['@babel/plugin-proposal-class-properties', {loose: true}],
		'@babel/plugin-transform-for-of',
		'@babel/plugin-transform-regenerator'
	]
}
