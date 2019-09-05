module.exports = {
	presets: [
		[
			"@babel/preset-env", {
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
			"@babel/plugin-transform-runtime", {
				corejs: 3,
				useESModules: true,
			}
		],
	]
}
