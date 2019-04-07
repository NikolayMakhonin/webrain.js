// region Test

interface IObj {
	a__: boolean
	b: Set<{
		e: number[],
	}>
	c: {
		d: string,
	}
}

declare global {
	export interface Set<T> {
		0: T
	}
}

export function test(o: any|IObj) {
	return o
}

test({
	a__: 'true',
})

// endregion

const variablePattern = '([$A-Za-z_][$A-Za-z_]*)'
const propertyPattern = variablePattern

export function parsePropertiesPathString(
	getValueFuncStr: string,
): string {
	const match = getValueFuncStr
		.match(/^.*?(?:\(\s*)?(\w+)(?:\s*\))?\s*(?:(?:=>\s*)?{\s*return\s|=>)[\s(]*\1\s*(.*?)\s*}?[\s)]*$/)

	const path = match && match[2]

	if (!path) {
		throw new Error(`Error parse getValueFunc:\n${getValueFuncStr}\n\n` +
		'This parameter should be a function which simple return nested property value, like that:\n' +
		'(o) => o.o["/\\"\'"].o[0].o.o\n' +
		'o => (o.o["/\\"\'"].o[0].o.o)\n' +
		'(o) => {return o.o["/\\"\'"].o[0].o.o}\n' +
		'function (o) { return o.o["/\\"\'"].o[0].o.o }\n' +
		'y(o) {\n' +
		'\t\treturn o.o["/\\"\'"].o[0].o.o\n' +
		'}')
	}

	return path
}
// if (typeof getValueFunc !== 'function') {
// 	throw new Error('getValueFunc param must be a function: ' + getValueFunc)
// }
//
// const funcStr = getValueFunc.toString()
//

export function parsePropertiesPath(
	propertiesPathStr: string,
): string[] {
	const found = []
	const remains = propertiesPathStr
		.replace(/(?:\.\s*(\w+)\s*|\[\s*('(?:[^\\']*|\\.)+'|"(?:[^\\"]*|\\.)+"|\d+)\s*\]\s*)/g, (s, r, r2) => {
			found.push(r || r2)
			return ''
		})

	if (remains) {
		throw new Error(`Error parse properties path from:\n${propertiesPathStr}\nerror in: ${remains}`)
	}

	return found
}
