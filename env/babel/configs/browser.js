module.exports = {
	presets: [
		[
			// see plugins list here: https://github.com/babel/babel/blob/ef3f555be9ce1ef780e05cd1594a98e9567a1b80/packages/babel-preset-env/package.json
			'@babel/preset-env', {
				loose  : true, // simple set property instead readonly defineProperty; +support named export for rollup-plugin-commonjs
				// corejs: 3,
				// useBuiltIns: 'usage',
				// shippedProposals: true,
				modules: false,
				// Use browsersList if targets is not set
			}
		]
	],
	plugins: [
		[
			'@babel/plugin-transform-runtime', {
				corejs      : 3,
				useESModules: true,
			}
		],

		// preset/env no loose:
		['@babel/plugin-transform-classes', {loose: false}]
	]
}
