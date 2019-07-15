function setProperty(target: object, key: string, value, clone?: boolean) {
	if (typeof value === 'undefined') {
		return
	}

	if (value == null || typeof value !== 'object') {
		target[key] = value
		return
	}

	const targetValue = target[key]
	if (targetValue === value) {
		return
	}

	if (targetValue == null || typeof targetValue !== 'object') {
		target[key] = clone
			? fillObject({}, value, clone)
			: value
		return
	}

	fillObject(targetValue, value)
}

export function fillObject<TObject extends object>(
	target: TObject,
	source: TObject,
	clone?: boolean,
): TObject {
	if (typeof source === 'undefined' || source === target) {
		return target
	}

	if (target == null || typeof target !== 'object') {
		return source
	}

	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			setProperty(target, key, source[key], clone)
		}
	}

	return target
}
