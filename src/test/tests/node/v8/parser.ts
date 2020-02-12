/* tslint:disable:no-var-requires */
import {assert} from '../../../../main/common/test/Assert'
import {describe, it, xit} from '../../../../main/common/test/Mocha'
import {v8_runtime_h_to_js_functions} from './src/helpers/parser'
const fs = require('fs')
const path = require('path')

describe('node > v8 > parser', function() {
	it('parser', function() {
		const dir = path.resolve(__dirname, './src/helpers/node_4_9_1')
		const sourceFile = path.resolve(dir, 'runtime.h.txt')
		const jsFile = path.resolve(dir, 'runtime.js')
		const d_tsFile = path.resolve(dir, 'runtime.d.ts')

		if (!fs.existsSync(jsFile) || !fs.existsSync(d_tsFile)) {
			const content = fs.readFileSync(sourceFile, 'utf8')
			const result = v8_runtime_h_to_js_functions(content)
			assert.ok(result.js && result.js.length)
			assert.ok(result.d_ts && result.d_ts.length)
			if (!fs.existsSync(jsFile)) {
				fs.writeFileSync(jsFile, result.js, 'utf-8')
			}
			if (!fs.existsSync(d_tsFile)) {
				fs.writeFileSync(d_tsFile, result.d_ts, 'utf-8')
			}
		}
	})
})
