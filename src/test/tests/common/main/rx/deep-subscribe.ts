/* eslint-disable no-useless-escape,computed-property-spacing */
import {parsePropertiesPath, parsePropertiesPathString} from '../../../../../main/common/rx/deep-subscribe'

declare const assert: any

describe('common > main > rx > deep-subscribe', function() {
	it('parsePropertiesPathString', function() {
		const path = '. o[ "\\`\\"\\\'\\\\`\'[]]" ] . o [ 0 ] . o [ \'\\`\\"\\\'\\\\`"][]\' ] . o'
		
		function testParse(funcStr) {
			console.log(funcStr)
			assert.strictEqual(parsePropertiesPathString(funcStr), path)
		}

		testParse(`(a) => a ${path}`)
		testParse(`b => ( ( b ${path} ) ) `)
		testParse(`c =>  {  return c ${path}}`)
		testParse(`function  (d)  {  return d ${path}}`)
		testParse(`function funcName (e)  {  return e ${path}}`)
		testParse(` funcName (f)  {  return f ${path}}`)

		assert.throws(() => parsePropertiesPathString(''), Error)
		assert.throws(() => parsePropertiesPathString(`(a) => b ${path}`), Error)
		assert.throws(() => parsePropertiesPathString(`b => ( ( c ${path} ) ) `), Error)
	})

	it('parsePropertiesPath', function() {
		const path = '. o[ "\\`\\"\\\'\\\\`\'[]]" ] . o [ 0 ] . o [ \'\\`\\"\\\'\\\\`"][]\' ] . o'

		assert.deepStrictEqual(parsePropertiesPath(path), [
			'o',
			'"\\`\\"\\\'\\\\`\'[]]"',
			'o',
			'0',
			'o',
			'\'\\`\\"\\\'\\\\`"][]\'',
			'o',
		])

		assert.throws(() => parsePropertiesPathString('.' + path), Error)
	})
})
