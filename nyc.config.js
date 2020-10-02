module.exports = {
	// include     : ['{src,dist/{js,mjs}}/{main,test/**/src}/**/*.js'],
	include     : ['{src,dist/{js,mjs}}/**/*.{js,ts}'],
	exclude     : ['**/v8/**/*'],
	reporter    : ['json'],
	'temp-dir'  : './tmp/coverage/nyc/tmp',
	'report-dir': './tmp/coverage/nyc/json',
}
