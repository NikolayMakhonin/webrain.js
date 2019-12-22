/* tslint:disable:no-array-delete*/
import { checkIsFuncOrNull } from '../../helpers/helpers';
import { getObjectUniqueId } from '../../helpers/object-unique-id';
import { binarySearch } from '../../lists/helpers/array';
import { Debugger } from '../Debugger';
import { ValueChangeType } from './contracts/common';
import { PropertiesPath } from './helpers/PropertiesPath';
const undefinedSubscribedValue = {
  value: void 0,
  parent: null,
  key: null,
  keyType: null
};

function valuesEqual(v1, v2) {
  return v1 === v2 || Number.isNaN(v1) && Number.isNaN(v2);
}

function subscribedValueEquals(o1, o2) {
  if (o1 === o2) {
    return true;
  }

  if (!o1 || !o2) {
    return false;
  }

  return valuesEqual(o1.value, o2.value) && o1.parent === o2.parent && o1.keyType === o2.keyType && o1.key === o2.key;
}

function compareSubscribed(o1, o2) {
  if (typeof o1.value !== 'undefined') {
    if (typeof o2.value !== 'undefined') {
      return 0;
    }

    return 1;
  }

  if (typeof o2.value !== 'undefined') {
    return -1;
  }

  if (typeof o1.isOwnProperty !== 'undefined' && typeof o2.isOwnProperty !== 'undefined') {
    if (o1.isOwnProperty) {
      if (o2.isOwnProperty) {
        return 0;
      }

      return 1;
    }

    if (o2.isOwnProperty) {
      return -1;
    }
  }

  return 0;
}

export class ObjectSubscriber {
  constructor(changeValue, lastValue, debugTarget) {
    this._changeValue = changeValue;
    this._lastValue = lastValue;
    this.debugTarget = debugTarget;
  }

  insertSubscribed(subscribedValue) {
    let {
      _subscribedValues
    } = this;

    if (!_subscribedValues) {
      this._subscribedValues = _subscribedValues = [];
    }

    let index = binarySearch(_subscribedValues, subscribedValue, null, null, compareSubscribed, 1);
    const len = _subscribedValues.length;

    if (index < 0) {
      index = ~index;

      if (index === len) {
        _subscribedValues.push(subscribedValue);

        return subscribedValue;
      }
    }

    for (let i = len - 1; i >= index; i--) {
      _subscribedValues[i + 1] = _subscribedValues[i];
    }

    _subscribedValues[index] = subscribedValue;
  }

  removeSubscribed(subscribedValue) {
    const {
      _subscribedValues
    } = this;

    if (_subscribedValues) {
      let index = binarySearch(_subscribedValues, subscribedValue, null, null, compareSubscribed, -1);

      if (index >= 0) {
        const len = _subscribedValues.length;

        for (; index < len; index++) {
          if (subscribedValueEquals(_subscribedValues[index], subscribedValue)) {
            break;
          }
        }

        if (index >= 0 && index < len) {
          for (let i = index + 1; i < len; i++) {
            _subscribedValues[i - 1] = _subscribedValues[i];
          }

          _subscribedValues.length = len - 1;

          if (len === 1) {
            return undefinedSubscribedValue;
          } else if (index === len - 1) {
            const nextSubscribedValue = _subscribedValues[len - 2];
            return nextSubscribedValue;
          }

          return null;
        }
      }
    }

    if (typeof subscribedValue.value !== 'undefined') {
      throw new Error(`subscribedValue no found: ${subscribedValue.parent.constructor.name}.${subscribedValue.key} = ${subscribedValue.value}`);
    }
  }

  change(key, oldValue, newValue, parent, changeType, keyType, propertiesPath, rule) {
    let unsubscribedLast;
    let nextChangeType = ValueChangeType.None;

    if (this._changeValue) {
      if ((changeType & ValueChangeType.Unsubscribe) !== 0) {
        let unsubscribed;

        if (oldValue instanceof Object) {
          const {
            _unsubscribersCount
          } = this;

          if (_unsubscribersCount) {
            const itemUniqueId = getObjectUniqueId(oldValue);
            const unsubscribeCount = _unsubscribersCount[itemUniqueId];

            if (unsubscribeCount != null) {
              if (unsubscribeCount) {
                if (unsubscribeCount > 1) {
                  _unsubscribersCount[itemUniqueId] = unsubscribeCount - 1;
                } else {
                  const {
                    _unsubscribers
                  } = this;
                  const unsubscribe = _unsubscribers[itemUniqueId]; // unsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls

                  delete _unsubscribers[itemUniqueId];
                  delete _unsubscribersCount[itemUniqueId];

                  if (Array.isArray(unsubscribe)) {
                    for (let i = 0, len = unsubscribe.length; i < len; i++) {
                      unsubscribe[i]();
                    }
                  } else {
                    unsubscribe();
                  }

                  unsubscribedLast = true;
                }
              }

              unsubscribed = true;
            }
          }
        }

        if (unsubscribedLast || !unsubscribed) {
          nextChangeType |= ValueChangeType.Unsubscribe;
        }
      }

      if ((changeType & ValueChangeType.Subscribe) !== 0) {
        if (!(newValue instanceof Object)) {
          const unsubscribeValue = checkIsFuncOrNull(this._changeValue(key, oldValue, newValue, parent, nextChangeType | ValueChangeType.Subscribe, keyType, propertiesPath, rule, unsubscribedLast));

          if (unsubscribeValue) {
            unsubscribeValue();
            throw new Error('You should not return unsubscribe function for non Object value.\n' + 'For subscribe value types use their object wrappers: Number, Boolean, String classes.\n' + `Unsubscribe function: ${unsubscribeValue}\nValue: ${newValue}\n` + `Value property path: ${new PropertiesPath(newValue, propertiesPath, key, keyType, rule)}`);
          }
        } else {
          const itemUniqueId = getObjectUniqueId(newValue);
          let {
            _unsubscribers,
            _unsubscribersCount
          } = this;

          if (_unsubscribers && _unsubscribers[itemUniqueId]) {
            this._changeValue(key, oldValue, newValue, parent, nextChangeType, keyType, propertiesPath, rule, unsubscribedLast);

            _unsubscribersCount[itemUniqueId]++;
          } else {
            if (!_unsubscribers) {
              this._unsubscribers = _unsubscribers = [];
              this._unsubscribersCount = _unsubscribersCount = [];
            }

            const unsubscribeValue = checkIsFuncOrNull(this._changeValue(key, oldValue, newValue, parent, nextChangeType | ValueChangeType.Subscribe, keyType, propertiesPath, rule, unsubscribedLast));

            if (unsubscribeValue) {
              _unsubscribers[itemUniqueId] = unsubscribeValue;
              _unsubscribersCount[itemUniqueId] = 1; // return this._setUnsubscribeObject(itemUniqueId, unsubscribeValue)
            }
          }
        }
      } else {
        this._changeValue(key, oldValue, newValue, parent, nextChangeType, keyType, propertiesPath, rule, unsubscribedLast);
      }
    }

    if (this._lastValue || Debugger.Instance.deepSubscribeLastValueHasSubscribers) {
      let unsubscribedValue;

      if ((changeType & ValueChangeType.Unsubscribe) !== 0) {
        unsubscribedValue = this.removeSubscribed({
          value: oldValue,
          parent,
          key,
          keyType
        });
      }

      let subscribedValue;

      if ((changeType & ValueChangeType.Subscribe) !== 0) {
        subscribedValue = this.insertSubscribed({
          value: newValue,
          parent,
          key,
          keyType,
          isOwnProperty: parent != null && key in parent
        });
      }

      if (!subscribedValueEquals(subscribedValue, unsubscribedValue)) {
        const lastValue = subscribedValue || unsubscribedValue;

        if (lastValue) {
          Debugger.Instance.onDeepSubscribeLastValue(unsubscribedValue, subscribedValue, this.debugTarget);

          if (this._lastValue) {
            this._lastValue(lastValue.value, lastValue.parent, lastValue.key, lastValue.keyType);
          }
        }
      }
    }

    if ((changeType & ValueChangeType.Subscribe) !== 0) {
      return () => {
        this.change(key, newValue, void 0, parent, ValueChangeType.Unsubscribe, keyType, propertiesPath, rule);
      };
    }
  }

}