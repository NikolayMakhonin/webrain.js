module.exports = {
	presets: [
		[
			"@babel/preset-env", {

			}
		]
	],
	plugins: [
		'@babel/plugin-transform-typescript',
		[
			"@babel/plugin-transform-runtime", {
				corejs: 3,
			}
		],

		"@babel/plugin-proposal-optional-chaining",
		"@babel/plugin-proposal-throw-expressions",
		["@babel/plugin-proposal-class-properties", { loose: true }],
	]
}
