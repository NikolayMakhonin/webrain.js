module.exports = {
	include     : ['{src,dist/{js,mjs}}/{main,test/**/src}/**/*.js'],
	exclude     : ['**/v8/**/*'],
	reporter    : ['json'],
	'temp-dir'  : './tmp/coverage/nyc/tmp',
	'report-dir': './tmp/coverage/nyc/json'
}
