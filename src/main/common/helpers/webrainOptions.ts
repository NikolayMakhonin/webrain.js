import {equalsObjects} from './helpers'

export const webrainOptions = {
	equalsFunc<TValue>(oldValue: TValue, newValue: TValue): boolean {
		if (oldValue instanceof Date) {
			return (newValue instanceof Date) && oldValue.getTime() === newValue.getTime()
		}
		return equalsObjects(oldValue, newValue)
	},

	debugInfo: true,
}
