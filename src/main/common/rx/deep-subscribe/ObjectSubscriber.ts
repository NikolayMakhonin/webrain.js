/* tslint:disable:no-array-delete*/
import {checkIsFuncOrNull} from '../../helpers/helpers'
import {getObjectUniqueId} from '../../helpers/object-unique-id'
import {binarySearch} from '../../lists/helpers/array'
import {Debugger} from '../Debugger'
import {IUnsubscribe, IUnsubscribeOrVoid} from '../subjects/observable'
import {
	IChangeValue,
	ILastValue,
	IPropertiesPath,
	IValueSubscriber,
	ValueChangeType,
	ValueKeyType,
} from './contracts/common'
import {ISubscribedValue} from './contracts/deep-subscribe'
import {IRule} from './contracts/rules'
import {PropertiesPath} from './helpers/PropertiesPath'

const undefinedSubscribedValue: ISubscribedValue = {
	value: void 0,
	parent: null,
	key: null,
	keyType: null,
}

function valuesEqual(v1, v2) {
	return v1 === v2 || Number.isNaN(v1) && Number.isNaN(v2)
}

function subscribedValueEquals(o1: ISubscribedValue, o2: ISubscribedValue): boolean {
	if (o1 === o2) {
		return true
	}
	if (!o1 || !o2) {
		return false
	}
	return valuesEqual(o1.value, o2.value)
		&& o1.parent === o2.parent
		&& o1.keyType === o2.keyType
		&& o1.key === o2.key
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

interface ILastChangeValue<TValue> {
	key: any,
	newValue: TValue,
	parent: any,
	keyType: ValueKeyType,
	propertiesPath: IPropertiesPath,
	rule: IRule,
}

export class ObjectSubscriber<TObject> implements IValueSubscriber<TObject> {
	public readonly debugTarget: any
	private readonly _changeValue: Array<IChangeValue<TObject>>
	private readonly _lastValue: Array<ILastValue<TObject>>
	private _lastChangeValue: ILastChangeValue<TObject>
	private _unsubscribers: Array<IUnsubscribe|IUnsubscribe[]>
	private _unsubscribersCount: number[]
	private _subscribedValues: ISubscribedValue[]
	constructor(
		changeValue?: IChangeValue<TObject>,
		lastValue?: ILastValue<TObject>,
		debugTarget?: any,
	) {
		this._changeValue = changeValue && [changeValue]
		this._lastValue = lastValue && [lastValue]
		this.debugTarget = debugTarget
	}

	private assertAttached(valueSubscriber: IValueSubscriber<TObject>): void {
		// region assert common

		if (!(valueSubscriber instanceof ObjectSubscriber)) {
			throw new Error('valueSubscriber is not instanceof ObjectSubscriber: '
				+ valueSubscriber && valueSubscriber.constructor && valueSubscriber.constructor.name)
		}

		// endregion

		// region assert lastValue

		if (!valueSubscriber._lastValue) {
			if (this._lastValue) {
				throw new Error('valueSubscriber._lastValue == null but this._lastValue != null')
			}
			return
		}

		if (!this._lastValue) {
			throw new Error('valueSubscriber._lastValue != null but this._lastValue == null')
		}

		if (valueSubscriber._lastValue.length !== 1) {
			throw new Error('valueSubscriber._lastValue.length !== 1')
		}

		// endregion

		// region assert changeValue

		if (!valueSubscriber._changeValue) {
			if (this._changeValue) {
				throw new Error('valueSubscriber._changeValue == null but this._changeValue != null')
			}
			return
		}

		if (!this._changeValue) {
			throw new Error('valueSubscriber._changeValue != null but this._changeValue == null')
		}

		if (valueSubscriber._changeValue.length !== 1) {
			throw new Error('valueSubscriber._changeValue.length !== 1')
		}

		// endregion
	}

	// public attach(valueSubscriber: IValueSubscriber<TObject>): void {
	// 	this.assertAttached(valueSubscriber)
	//
	// 	const _changeValue = (valueSubscriber as ObjectSubscriber<TObject>)._changeValue[0]
	// 	if (_changeValue) {
	// 		this._changeValue.push(_changeValue)
	//
	// 		if (!this._lastChangeValue) {
	// 			throw new Error('!this._lastChangeValue')
	// 		}
	//
	// 		// TODO
	// 	}
	//
	// 	const _lastValue = (valueSubscriber as ObjectSubscriber<TObject>)._lastValue[0]
	// 	if (_lastValue) {
	// 		this._lastValue.push(_lastValue)
	//
	// 		if (!this._subscribedValues || !this._subscribedValues.length) {
	// 			throw new Error('!this._subscribedValues || !this._subscribedValues.length')
	// 		}
	//
	// 		const lastValue = this._subscribedValues[this._subscribedValues.length - 1]
	// 		_lastValue(
	// 			lastValue.value,
	// 			lastValue.parent,
	// 			lastValue.key,
	// 			lastValue.keyType,
	// 		)
	// 	}
	// }
	//
	// public detach(valueSubscriber: IValueSubscriber<TObject>): boolean {
	// 	this.assertAttached(valueSubscriber)
	//
	// 	const _changeValue = (valueSubscriber as ObjectSubscriber<TObject>)._changeValue[0]
	// 	if (_changeValue) {
	// 		const index = this._changeValue.indexOf(_changeValue)
	// 		if (index < 0) {
	// 			throw new Error('_changeValue not found in this._changeValue')
	// 		}
	//
	// 		for (let i = index + 1, len = this._changeValue.length; i < len; i++) {
	// 			this._changeValue[i - 1] = this._changeValue[i]
	// 		}
	//
	// 		if (!this._lastChangeValue) {
	// 			throw new Error('!this._lastChangeValue')
	// 		}
	//
	// 		_changeValue(
	// 			this._lastChangeValue.key,
	// 			void 0,
	// 			this._lastChangeValue.newValue,
	// 			this._lastChangeValue.parent,
	// 			ValueChangeType.Unsubscribe,
	// 			this._lastChangeValue.keyType,
	// 			this._lastChangeValue.propertiesPath,
	// 			this._lastChangeValue.rule,
	// 			null,
	// 		)
	// 	}
	//
	// 	const _lastValue = (valueSubscriber as ObjectSubscriber<TObject>)._lastValue[0]
	// 	if (_lastValue) {
	// 		const index = this._lastValue.indexOf(_lastValue)
	// 		if (index < 0) {
	// 			throw new Error('_lastValue not found in this._lastValue')
	// 		}
	//
	// 		for (let i = index + 1, len = this._lastValue.length; i < len; i++) {
	// 			this._lastValue[i - 1] = this._lastValue[i]
	// 		}
	//
	// 		if (!this._subscribedValues || !this._subscribedValues.length) {
	// 			throw new Error('!this._subscribedValues || !this._subscribedValues.length')
	// 		}
	//
	// 		const lastValue = this._subscribedValues[0]
	// 		_lastValue(
	// 			lastValue.value,
	// 			lastValue.parent,
	// 			lastValue.key,
	// 			lastValue.keyType,
	// 		)
	// 	}
	// }

	private insertSubscribed(subscribedValue: ISubscribedValue): ISubscribedValue {
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
				return subscribedValue
			}
		}

		for (let i = len - 1; i >= index; i--) {
			_subscribedValues[i + 1] = _subscribedValues[i]
		}
		_subscribedValues[index] = subscribedValue
	}

	private removeSubscribed(subscribedValue: ISubscribedValue): ISubscribedValue {
		const {_subscribedValues} = this

		if (_subscribedValues) {
			let index = binarySearch(_subscribedValues, subscribedValue, null, null, compareSubscribed, -1)
			if (index >= 0) {
				const len = _subscribedValues.length
				for (; index < len; index++) {
					if (subscribedValueEquals(_subscribedValues[index], subscribedValue)) {
						break
					}
				}
				if (index >= 0 && index < len) {
					for (let i = index + 1; i < len; i++) {
						_subscribedValues[i - 1] = _subscribedValues[i]
					}
					_subscribedValues.length = len - 1
					if (len === 1) {
						return undefinedSubscribedValue
					} else if (index === len - 1) {
						const nextSubscribedValue = _subscribedValues[len - 2]
						return nextSubscribedValue
					}
					return null
				}
			}
		}

		if (typeof subscribedValue.value !== 'undefined') {
			throw new Error(`subscribedValue no found: ${subscribedValue.parent.constructor.name}.${subscribedValue.key} = ${subscribedValue.value}`)
		}
	}

	public change(
		key: any,
		oldValue: TObject,
		newValue: TObject,
		parent: any,
		changeType: ValueChangeType,
		keyType: ValueKeyType,
		propertiesPath: IPropertiesPath,
		rule: IRule,
	): IUnsubscribeOrVoid {
		let unsubscribedLast
		let nextChangeType = ValueChangeType.None

		if (this._changeValue) {
			for (
				let changeValueIndex = 0, changeValueLength = this._changeValue.length;
				changeValueIndex < changeValueLength;
				changeValueIndex++
			) {
				const changeValue = this._changeValue[changeValueIndex]

				if ((changeType & ValueChangeType.Unsubscribe) !== 0) {
					let unsubscribed
					if (oldValue instanceof Object) {
						const {_unsubscribersCount} = this
						if (_unsubscribersCount) {
							const itemUniqueId = getObjectUniqueId(oldValue as any)
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

					if (unsubscribedLast || !unsubscribed) {
						nextChangeType |= ValueChangeType.Unsubscribe
					}
				}

				if ((changeType & ValueChangeType.Subscribe) !== 0) {
					this._lastChangeValue = {
						key,
						newValue,
						parent,
						keyType,
						propertiesPath,
						rule,
					}

					if (!(newValue instanceof Object)) {
						const unsubscribeValue = checkIsFuncOrNull(changeValue(
							key,
							oldValue,
							newValue,
							parent,
							nextChangeType | ValueChangeType.Subscribe,
							keyType,
							propertiesPath,
							rule,
							unsubscribedLast,
						))

						if (unsubscribeValue) {
							unsubscribeValue()

							throw new Error('You should not return unsubscribe function for non Object value.\n'
								+ 'For subscribe value types use their object wrappers: Number, Boolean, String classes.\n'
								+ `Unsubscribe function: ${unsubscribeValue}\nValue: ${newValue}\n`
								+ `Value property path: ${new PropertiesPath(newValue, propertiesPath, key, keyType, rule)}`)
						}
					} else {
						const itemUniqueId = getObjectUniqueId(newValue as any)

						let {_unsubscribers, _unsubscribersCount} = this
						if (_unsubscribers && _unsubscribers[itemUniqueId]) {
							changeValue(
								key,
								oldValue,
								newValue,
								parent,
								nextChangeType,
								keyType,
								propertiesPath,
								rule,
								unsubscribedLast,
							)

							_unsubscribersCount[itemUniqueId]++
						} else {
							if (!_unsubscribers) {
								this._unsubscribers = _unsubscribers = []
								this._unsubscribersCount = _unsubscribersCount = []
							}

							const unsubscribeValue = checkIsFuncOrNull(changeValue(
								key,
								oldValue,
								newValue,
								parent,
								nextChangeType | ValueChangeType.Subscribe,
								keyType,
								propertiesPath,
								rule,
								unsubscribedLast,
							))

							if (unsubscribeValue) {
								const chainUnsubscribe = _unsubscribers[itemUniqueId]
								if (!chainUnsubscribe) {
									_unsubscribers[itemUniqueId] = unsubscribeValue
									_unsubscribersCount[itemUniqueId] = 1
								} else {
									if (Array.isArray(chainUnsubscribe)) {
										chainUnsubscribe.push(unsubscribeValue)
									} else {
										_unsubscribers[itemUniqueId] = [chainUnsubscribe, unsubscribeValue]
										_unsubscribersCount[itemUniqueId] = 1
									}
								}
							}
						}
					}
				} else {
					changeValue(
						key,
						oldValue,
						newValue,
						parent,
						nextChangeType,
						keyType,
						propertiesPath,
						rule,
						unsubscribedLast,
					)
				}
			}
		}

		if (this._lastValue || Debugger.Instance.deepSubscribeLastValueHasSubscribers) {
			let unsubscribedValue: ISubscribedValue
			if ((changeType & ValueChangeType.Unsubscribe) !== 0) {
				unsubscribedValue = this.removeSubscribed({value: oldValue, parent, key, keyType})
			}

			let subscribedValue: ISubscribedValue
			if ((changeType & ValueChangeType.Subscribe) !== 0) {
				subscribedValue = this.insertSubscribed({
					value: newValue,
					parent,
					key,
					keyType,
					isOwnProperty: parent != null && key in parent,
				})
			}

			if (!subscribedValueEquals(subscribedValue, unsubscribedValue)) {
				const lastValue = subscribedValue || unsubscribedValue
				if (lastValue) {
					Debugger.Instance.onDeepSubscribeLastValue(
						unsubscribedValue,
						subscribedValue,
						this.debugTarget,
					)

					if (this._lastValue) {
						for (let i = 0, len = this._lastValue.length; i < len; i++) {
							this._lastValue[i](
								lastValue.value,
								lastValue.parent,
								lastValue.key,
								lastValue.keyType,
							)
						}
					}
				}
			}
		}

		if ((changeType & ValueChangeType.Subscribe) !== 0) {
			return () => {
				this.change(
					key,
					newValue,
					void 0,
					parent,
					ValueChangeType.Unsubscribe,
					keyType,
					propertiesPath,
					rule,
				)
			}
		}
	}
}
