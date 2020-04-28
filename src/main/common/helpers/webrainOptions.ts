import {equals, equalsObjects} from './helpers'

export const webrainOptions = {
	equalsFunc<TValue>(oldValue: TValue, newValue: TValue): boolean {
		if (oldValue instanceof Date) {
			return (newValue instanceof Date) && oldValue.getTime() === newValue.getTime()
		}
		return equalsObjects(oldValue, newValue)
	},

	debugInfo: true,
	callState: {
		garbageCollect: {
			minLifeTime: 60000,
			bulkSize: 1000,
			interval: 1000,
			disabled: false,
		},
	},
	timeouts: {
		dependWait: 60000,
	},
}

export function webrainEquals(o1, o2) {
	return equals(o1, o2) || webrainOptions.equalsFunc != null
		&& webrainOptions.equalsFunc.call(this, o1, o2)
}
