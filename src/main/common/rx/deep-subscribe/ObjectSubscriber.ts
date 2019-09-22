import {checkIsFuncOrNull} from '../../helpers/helpers'
import {getObjectUniqueId} from '../../helpers/object-unique-id'
import {IUnsubscribe} from '../subjects/observable'
import {ILastValue, ISubscribeValue, IUnsubscribeValue, IValueSubscriber} from './contracts/common'

export class ObjectSubscriber<TObject> implements IValueSubscriber<TObject> {
	private readonly _subscribe: ISubscribeValue<TObject>
	private readonly _unsubscribe: IUnsubscribeValue<TObject>
	private readonly _lastValue: ILastValue<TObject>
	private _unsubscribers: IUnsubscribe[]
	private _unsubscribersCount: number[]
	private _subscribedValues: TObject[]
	constructor(
		subscribe?: ISubscribeValue<TObject>,
		unsubscribe?: IUnsubscribeValue<TObject>,
		lastValue?: ILastValue<TObject>,
	) {
		this._subscribe = subscribe
		this._unsubscribe = unsubscribe
		this._lastValue = lastValue
	}

	public subscribe(
		value: TObject,
		parent: any,
		propertyName: string,
		propertiesPath: () => string,
		ruleDescription: string,
	): IUnsubscribe {
		if (this._subscribe) {
			if (!(value instanceof Object)) {
				const unsubscribeValue = checkIsFuncOrNull(this._subscribe(value, parent, propertyName))
				if (unsubscribeValue) {
					unsubscribeValue()

					throw new Error('You should not return unsubscribe function for non Object value.\n'
						+ 'For subscribe value types use their object wrappers: Number, Boolean, String classes.\n'
						+ `Unsubscribe function: ${unsubscribeValue}\nValue: ${value}\n`
						+ `Value property path: ${(propertiesPath ? propertiesPath() + '.' : '')
						+ (propertyName == null ? '' : propertyName + '(' + ruleDescription + ')')}`)
				}
			} else {
				const itemUniqueId = getObjectUniqueId(value as any)

				let {_unsubscribers, _unsubscribersCount} = this
				if (_unsubscribers && _unsubscribers[itemUniqueId]) {
					_unsubscribersCount[itemUniqueId]++
				} else {
					if (!_unsubscribers) {
						this._unsubscribers = _unsubscribers = []
						this._unsubscribersCount = _unsubscribersCount = []
					}

					const unsubscribeValue = checkIsFuncOrNull(this._subscribe(value, parent, propertyName))
					if (unsubscribeValue) {
						this._unsubscribers[itemUniqueId] = unsubscribeValue
						this._unsubscribersCount[itemUniqueId] = 1
						// return this._setUnsubscribeObject(itemUniqueId, unsubscribeValue)
					}
				}
			}
		}

		if (this._lastValue) {
			let {_subscribedValues} = this
			if (!_subscribedValues) {
				this._subscribedValues = _subscribedValues = []
			}
			_subscribedValues.push(value)
			if (_subscribedValues.length === 1
				&& _subscribedValues[_subscribedValues.length - 2] !== value
			) {
				this._lastValue(value, parent, propertyName)
			}
		}

		return () => this.unsubscribe(value, parent, propertyName)
	}

	public unsubscribe(value: TObject, parent: any, propertyName: string) {
		if (this._subscribe) {
			let isUnsubscribed
			if (value instanceof Object) {
				const {_unsubscribersCount} = this
				if (_unsubscribersCount) {
					const itemUniqueId = getObjectUniqueId(value as any)
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
							}
						}
						isUnsubscribed = true
					}
				}
			}

			if (this._unsubscribe && !isUnsubscribed) {
				this._unsubscribe(value, parent, propertyName)
			}
		}

		if (this._lastValue) {
			const {_subscribedValues} = this
			if (_subscribedValues) {
				const index = _subscribedValues.indexOf(value)
				if (index >= 0) {
					const len = _subscribedValues.length
					if (index === len - 1) {
						_subscribedValues.length = len - 1
						if (len > 1) {
							this._lastValue(_subscribedValues[len - 2], parent, propertyName)
						} else {
							this._lastValue(void 0, parent, propertyName)
						}
					} else {
						if (index !== len - 2) {
							_subscribedValues[index] = _subscribedValues[len - 2]
						}

						_subscribedValues[len - 2] = _subscribedValues[len - 1]
					}
				}
			}
		}
	}

	private _setUnsubscribeObject(
		itemUniqueId: number,
		unsubscribeValue: IUnsubscribe,
	): IUnsubscribe {
		const unsubscribe = () => {
			const {_unsubscribersCount} = this
			if (!_unsubscribersCount) {
				return
			}

			const unsubscribeCount = _unsubscribersCount[itemUniqueId]
			if (!unsubscribeCount) {
				return
			}

			if (unsubscribeCount > 1) {
				_unsubscribersCount[itemUniqueId] = unsubscribeCount - 1
			} else {
				// leafUnsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls
				delete this._unsubscribers[itemUniqueId]
				delete _unsubscribersCount[itemUniqueId]

				// if (unsubscribeValue) {
				const _unsubscribeValue = unsubscribeValue
				unsubscribeValue = null
				_unsubscribeValue()
				// }
			}
		}

		this._unsubscribers[itemUniqueId] = unsubscribe
		this._unsubscribersCount[itemUniqueId] = 1

		return unsubscribe
	}
}
