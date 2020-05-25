module.exports = {
	parserOpts: {
		plugins: ['v8intrinsic'],
	},
	plugins: [
		'@babel/plugin-transform-typescript',
		'@babel/plugin-syntax-dynamic-import',

		'@babel/plugin-proposal-optional-chaining',
		'@babel/plugin-proposal-throw-expressions',
		['@babel/plugin-proposal-class-properties', {loose: true}],
	]
}
