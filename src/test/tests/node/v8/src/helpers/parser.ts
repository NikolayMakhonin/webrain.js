// see: https://github.com/v8/v8/blob/master/src/runtime/runtime.h
// for node 4.9.1: https://github.com/v8/v8/blob/7f211533faba9dd85708b1394186c7fe99b88392/src/runtime/runtime.h
// see: https://www.npmjs.com/package/v8-natives

export function v8_runtime_h_to_js_functions(runtime_h_content: string) {
	const matches = Array.from(runtime_h_content
		.replace(/\/\*.*?\*\//gs, '')
		.matchAll(/\b([IF])\(\s*(\w+)\s*,\s*(-?\d+)\s*,\s*(\d+)\s*\)/gs))

	const argsNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']

	function matchesToStr(matchToStr: (name: string, argsStr: string, returnStr: string) => string) {
		return matches
			.map(o => {
				const type = o[1]
				const name = o[2]
				const argsCount = parseInt(o[3], 10)
				const returnCount = parseInt(o[4], 10)

				let argsStr
				if (argsCount < 0) {
					argsStr = '...args'
				} else {
					const args = []
					for (let i = 0; i < argsCount; i++) {
						args.push(argsNames[i])
					}
					argsStr = args.join(', ')
				}

				if (returnCount < 0) {
					throw new Error(`returnCount = ${returnCount} for ${name}`)
				}

				return matchToStr(name, argsStr, returnCount === 0 ? 'void' : 'any')
			}).join('\r\n') + '\r\n'
	}

	return {
		js: matchesToStr((name, argsStr, returnStr) => {
			if (argsStr === '...args') {
				argsStr = 'a, b, c, d, e, f, g, h, i, j, k, l, m, n'
			}
			return `export function ${name}(${argsStr}) {
	return %${name}(${argsStr})
}
`
		}),
		d_ts: matchesToStr((name, argsStr, returnStr) => {
			return `export declare function ${name}(${argsStr}): ${returnStr}`
		}),
	}
}
