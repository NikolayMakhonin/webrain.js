const {buildLib} = require('../helpers')

// const fileOutput = path.resolve('static/polyfills/polyfill-custom.js')
// const fileOutput = path.resolve(__dirname, './bundle.js')

buildLib({
	fileInput : require.resolve('./all.js'),
	fileOutput: 'tmp/libs/dependent-func.js',
	name      : 'DependentFunc',
})
	.then(() => {
		console.log('dependent-func build completed')
	})
