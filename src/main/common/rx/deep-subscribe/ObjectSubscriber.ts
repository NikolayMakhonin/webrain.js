/* tslint:disable:no-array-delete*/
import {checkIsFuncOrNull} from '../../helpers/helpers'
import {getObjectUniqueId} from '../../helpers/object-unique-id'
import {binarySearch} from '../../lists/helpers/array'
import {IUnsubscribe, IUnsubscribeOrVoid} from '../subjects/observable'
import {
	ChangeValue,
	ILastValue,
	ISubscribeValue,
	IUnsubscribeValue,
	IValueSubscriber,
	ValueChangeType,
	ValueKeyType,
} from './contracts/common'

interface ISubscribedValue {
	value: any
	parent: any
	propertyName: any
	isOwnProperty?: boolean
}

function compareSubscribed(o1: ISubscribedValue, o2: ISubscribedValue): number {
	if (typeof o1.value !== 'undefined') {
		if (typeof o2.value !== 'undefined') {
			return 0
		}
		return 1
	}
	if (typeof o2.value !== 'undefined') {
		return -1
	}

	if (typeof o1.isOwnProperty !== 'undefined' && typeof o2.isOwnProperty !== 'undefined') {
		if (o1.isOwnProperty) {
			if (o2.isOwnProperty) {
				return 0
			}
			return 1
		}
		if (o2.isOwnProperty) {
			return -1
		}
	}

	return 0
}

function valuesEqual(v1, v2) {
	return v1 === v2 || Number.isNaN(v1) && Number.isNaN(v2)
}

export class ObjectSubscriber<TObject> implements IValueSubscriber<TObject> {
	private readonly _change: ChangeValue<TObject>
	private readonly _subscribe: ISubscribeValue<TObject>
	private readonly _unsubscribe: IUnsubscribeValue<TObject>
	private readonly _lastValue: ILastValue<TObject>
	private _unsubscribers: IUnsubscribe[]
	private _unsubscribersCount: number[]
	private _subscribedValues: ISubscribedValue[]
	constructor(
		subscribe?: ISubscribeValue<TObject>,
		unsubscribe?: IUnsubscribeValue<TObject>,
		lastValue?: ILastValue<TObject>,
		change?: ChangeValue<TObject>,
	) {
		this._change = change
		this._subscribe = subscribe
		this._unsubscribe = unsubscribe
		this._lastValue = lastValue
	}

	private insertSubscribed(subscribedValue: ISubscribedValue) {
		let {_subscribedValues} = this
		if (!_subscribedValues) {
			this._subscribedValues = _subscribedValues = []
		}

		let index = binarySearch(_subscribedValues, subscribedValue, null, null, compareSubscribed, 1)
		const len = _subscribedValues.length
		if (index < 0) {
			index = ~index
			if (index === len) {
				_subscribedValues.push(subscribedValue)
				this._lastValue(subscribedValue.value, subscribedValue.parent, subscribedValue.propertyName)
				return
			}
		}

		for (let i = len - 1; i >= index; i--) {
			_subscribedValues[i + 1] = _subscribedValues[i]
		}
		_subscribedValues[index] = subscribedValue
	}

	private removeSubscribed(subscribedValue: ISubscribedValue) {
		const {_subscribedValues} = this

		if (_subscribedValues) {
			let index = binarySearch(_subscribedValues, subscribedValue, null, null, compareSubscribed, -1)
			if (index >= 0) {
				const len = _subscribedValues.length
				for (; index < len; index++) {
					if (valuesEqual(_subscribedValues[index].value, subscribedValue.value)
						&& _subscribedValues[index].parent === subscribedValue.parent
						&& _subscribedValues[index].propertyName === subscribedValue.propertyName
					) {
						break
					}
				}
				if (index >= 0 && index < len) {
					for (let i = index + 1; i < len; i++) {
						_subscribedValues[i - 1] = _subscribedValues[i]
					}
					_subscribedValues.length = len - 1
					if (len === 1) {
						this._lastValue(void 0, null, null)
					} else if (index === len - 1) {
						const nextSubscribedValue = _subscribedValues[len - 2]
						this._lastValue(nextSubscribedValue.value, nextSubscribedValue.parent, nextSubscribedValue.propertyName)
					}
					return
				}
			}
		}

		if (typeof subscribedValue.value !== 'undefined') {
			throw new Error(`subscribedValue no found: ${subscribedValue.parent.constructor.name}.${subscribedValue.propertyName} = ${subscribedValue.value}`)
		}
	}

	public change(
		key: any,
		oldItem: TObject,
		newItem: TObject,
		parent: any,
		changeType: ValueChangeType,
		keyType: ValueKeyType,
		propertiesPath: () => string,
		ruleDescription: string,
	): IUnsubscribeOrVoid {
		if ((changeType & ValueChangeType.Unsubscribe) !== 0) {
			if (this._subscribe) {
				let unsubscribed
				let unsubscribedLast
				if (oldItem instanceof Object) {
					const {_unsubscribersCount} = this
					if (_unsubscribersCount) {
						const itemUniqueId = getObjectUniqueId(oldItem as any)
						const unsubscribeCount = _unsubscribersCount[itemUniqueId]
						if (unsubscribeCount != null) {
							if (unsubscribeCount) {
								if (unsubscribeCount > 1) {
									_unsubscribersCount[itemUniqueId] = unsubscribeCount - 1
								} else {
									const {_unsubscribers} = this
									const unsubscribe = _unsubscribers[itemUniqueId]
									// unsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls
									delete _unsubscribers[itemUniqueId]
									delete _unsubscribersCount[itemUniqueId]

									if (Array.isArray(unsubscribe)) {
										for (let i = 0, len = unsubscribe.length; i < len; i++) {
											unsubscribe[i]()
										}
									} else {
										unsubscribe()
									}

									unsubscribedLast = true
								}
							}
							unsubscribed = true
						}
					}
				}

				if (this._unsubscribe && (unsubscribedLast || !unsubscribed)) {
					this._unsubscribe(oldItem, parent, key, unsubscribedLast)
				}
			}
		}

		if ((changeType & ValueChangeType.Subscribe) !== 0) {
			if (this._subscribe) { // && typeof value !== 'undefined') {
				if (!(newItem instanceof Object)) {
					const unsubscribeValue = checkIsFuncOrNull(this._subscribe(newItem, parent, key))
					if (unsubscribeValue) {
						unsubscribeValue()

						throw new Error('You should not return unsubscribe function for non Object value.\n'
							+ 'For subscribe value types use their object wrappers: Number, Boolean, String classes.\n'
							+ `Unsubscribe function: ${unsubscribeValue}\nValue: ${newItem}\n`
							+ `Value property path: ${(propertiesPath ? propertiesPath() + '.' : '')
							+ (key == null ? '' : key + '(' + ruleDescription + ')')}`)
					}
				} else {
					const itemUniqueId = getObjectUniqueId(newItem as any)

					let {_unsubscribers, _unsubscribersCount} = this
					if (_unsubscribers && _unsubscribers[itemUniqueId]) {
						_unsubscribersCount[itemUniqueId]++
					} else {
						if (!_unsubscribers) {
							this._unsubscribers = _unsubscribers = []
							this._unsubscribersCount = _unsubscribersCount = []
						}

						const unsubscribeValue = checkIsFuncOrNull(this._subscribe(newItem, parent, key))
						if (unsubscribeValue) {
							_unsubscribers[itemUniqueId] = unsubscribeValue
							_unsubscribersCount[itemUniqueId] = 1
							// return this._setUnsubscribeObject(itemUniqueId, unsubscribeValue)
						}
					}
				}
			}
		}

		if ((changeType & ValueChangeType.Unsubscribe) !== 0) {
			if (this._lastValue) {
				this.removeSubscribed({value: oldItem, parent, propertyName: key})
			}
		}

		if ((changeType & ValueChangeType.Subscribe) !== 0) {
			if (this._lastValue) {
				this.insertSubscribed({value: newItem, parent, propertyName: key, isOwnProperty: parent != null && key in parent})
			}
		}

		if ((changeType & ValueChangeType.Subscribe) !== 0) {
			return () => {
				this.change(
					key,
					newItem,
					void 0,
					parent,
					ValueChangeType.Unsubscribe,
					keyType,
					propertiesPath,
					ruleDescription,
				)
			}
		}
	}
}
