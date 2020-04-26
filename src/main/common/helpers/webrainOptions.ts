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
		minLifeTime: 60000,
		garbageCollectBulkSize: 1000,
		garbageCollectInterval: 1000,
	},
}
