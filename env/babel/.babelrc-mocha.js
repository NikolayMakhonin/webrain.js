module.exports = {
	presets: [
		[
			// see plugins list here: https://github.com/babel/babel/blob/ef3f555be9ce1ef780e05cd1594a98e9567a1b80/packages/babel-preset-env/package.json
			"@babel/preset-env", {
				targets: {
					node: '8.6.0'
				}
			}
		]
	],
	plugins: [
		'@babel/plugin-transform-typescript',

		[
			'@babel/plugin-transform-runtime', {
				corejs: 3,
			}
		],

		"@babel/plugin-proposal-optional-chaining",
		"@babel/plugin-proposal-throw-expressions",
		["@babel/plugin-proposal-class-properties", { loose: true }],
	]
}
