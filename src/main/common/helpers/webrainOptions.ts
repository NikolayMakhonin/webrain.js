import {equalsObjects} from './helpers'

export const webrainOptions = {
	equalsFunc<TValue>(oldValue: TValue, newValue: TValue): boolean {
		if (oldValue instanceof Date) {
			return (newValue instanceof Date) && oldValue.getTime() === newValue.getTime()
		}
		if (Number.isNaN(oldValue as any)) {
			return Number.isNaN(newValue as any)
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
