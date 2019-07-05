import _defineProperty from '@babel/runtime/helpers/esm/defineProperty'

function definePropertyIgnoreNull(target, key, value) {
	if (value == null) {
		return
	}

	_defineProperty(target, key, value)
}

export function objectSpreadIgnoreNull(target, ...sources) {
	for (let i = 0, len = sources.length; i < len; i++) {
		const source = sources[i]
		if (source != null) {
			for (const key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					definePropertyIgnoreNull(target, key, source[key])
				}
			}
			if (typeof Object.getOwnPropertySymbols === 'function') {
				for (const sym in Object.getOwnPropertySymbols(source)) {
					if (Object.getOwnPropertyDescriptor(source, sym).enumerable) {
						definePropertyIgnoreNull(target, sym, source[sym])
					}
				}
			}
		}
	}
	return target
}
