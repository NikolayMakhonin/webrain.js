module.exports = {
	parserOpts: {
		plugins: ['v8intrinsic'],
	},
	presets: [
		[
			// see plugins list here: https://github.com/babel/babel/blob/ef3f555be9ce1ef780e05cd1594a98e9567a1b80/packages/babel-preset-env/package.json
			'@babel/preset-env', {
				loose  : true, // simple set property instead readonly defineProperty; +support named export for rollup-plugin-commonjs
				targets: {
					node: '12.4.0',
				}
			}
		]
	],
	plugins: [
		'@babel/plugin-transform-typescript',

		'@babel/plugin-proposal-optional-chaining',
		'@babel/plugin-proposal-throw-expressions',
		['@babel/plugin-proposal-class-properties', {loose: true}],

		// preset/env no loose:
		['@babel/plugin-transform-classes', {loose: false}]
	]
}
