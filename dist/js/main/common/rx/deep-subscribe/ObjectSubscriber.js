"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ObjectSubscriber = void 0;

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _helpers = require("../../helpers/helpers");

var _objectUniqueId = require("../../helpers/object-unique-id");

var _array = require("../../lists/helpers/array");

/* tslint:disable:no-array-delete*/
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

var ObjectSubscriber =
/*#__PURE__*/
function () {
  function ObjectSubscriber(subscribe, unsubscribe, lastValue) {
    (0, _classCallCheck2.default)(this, ObjectSubscriber);
    this._subscribe = subscribe;
    this._unsubscribe = unsubscribe;
    this._lastValue = lastValue;
  }

  (0, _createClass2.default)(ObjectSubscriber, [{
    key: "insertSubscribed",
    value: function insertSubscribed(subscribedValue) {
      var _subscribedValues = this._subscribedValues;

      if (!_subscribedValues) {
        this._subscribedValues = _subscribedValues = [];
      }

      var index = (0, _array.binarySearch)(_subscribedValues, subscribedValue, null, null, compareSubscribed, 1);
      var len = _subscribedValues.length;

      if (index < 0) {
        index = ~index;

        if (index === len) {
          _subscribedValues.push(subscribedValue);

          this._lastValue(subscribedValue.value, subscribedValue.parent, subscribedValue.propertyName);

          return;
        }
      }

      for (var i = len - 1; i >= index; i--) {
        _subscribedValues[i + 1] = _subscribedValues[i];
      }

      _subscribedValues[index] = subscribedValue;
    }
  }, {
    key: "removeSubscribed",
    value: function removeSubscribed(subscribedValue) {
      var _subscribedValues = this._subscribedValues;

      if (_subscribedValues) {
        var index = (0, _array.binarySearch)(_subscribedValues, subscribedValue, null, null, compareSubscribed, -1);

        if (index >= 0) {
          var len = _subscribedValues.length;

          for (; index < len; index++) {
            if (_subscribedValues[index].value === subscribedValue.value && _subscribedValues[index].parent === subscribedValue.parent && _subscribedValues[index].propertyName === subscribedValue.propertyName) {
              break;
            }
          }

          if (index >= 0 && index < len) {
            for (var i = index + 1; i < len; i++) {
              _subscribedValues[i - 1] = _subscribedValues[i];
            }

            _subscribedValues.length = len - 1;

            if (len === 1) {
              this._lastValue(void 0, null, null);
            } else if (index === len - 1) {
              var nextSubscribedValue = _subscribedValues[len - 2];

              this._lastValue(nextSubscribedValue.value, nextSubscribedValue.parent, nextSubscribedValue.propertyName);
            }

            return;
          }
        }
      }

      if (typeof subscribedValue.value !== 'undefined') {
        throw new Error("subscribedValue no found: " + subscribedValue.parent.constructor.name + "." + subscribedValue.propertyName + " = " + subscribedValue.value);
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(value, parent, propertyName, propertiesPath, ruleDescription) {
      var _this = this;

      if (this._subscribe) {
        // && typeof value !== 'undefined') {
        if (!(value instanceof Object)) {
          var unsubscribeValue = (0, _helpers.checkIsFuncOrNull)(this._subscribe(value, parent, propertyName));

          if (unsubscribeValue) {
            unsubscribeValue();
            throw new Error('You should not return unsubscribe function for non Object value.\n' + 'For subscribe value types use their object wrappers: Number, Boolean, String classes.\n' + ("Unsubscribe function: " + unsubscribeValue + "\nValue: " + value + "\n") + ("Value property path: " + ((propertiesPath ? propertiesPath() + '.' : '') + (propertyName == null ? '' : propertyName + '(' + ruleDescription + ')'))));
          }
        } else {
          var itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(value);
          var _unsubscribers = this._unsubscribers,
              _unsubscribersCount = this._unsubscribersCount;

          if (_unsubscribers && _unsubscribers[itemUniqueId]) {
            _unsubscribersCount[itemUniqueId]++;
          } else {
            if (!_unsubscribers) {
              this._unsubscribers = _unsubscribers = [];
              this._unsubscribersCount = _unsubscribersCount = [];
            }

            var _unsubscribeValue = (0, _helpers.checkIsFuncOrNull)(this._subscribe(value, parent, propertyName));

            if (_unsubscribeValue) {
              _unsubscribers[itemUniqueId] = _unsubscribeValue;
              _unsubscribersCount[itemUniqueId] = 1; // return this._setUnsubscribeObject(itemUniqueId, unsubscribeValue)
            }
          }
        }
      }

      if (this._lastValue) {
        this.insertSubscribed({
          value: value,
          parent: parent,
          propertyName: propertyName,
          isOwnProperty: parent != null && propertyName in parent
        }); // let {_subscribedValues, _subscribedParents, _subscribedPropertyNames} = this
        // if (!_subscribedValues) {
        // 	this._subscribedValues = _subscribedValues = []
        // 	this._subscribedParents = _subscribedParents = []
        // 	this._subscribedPropertyNames = _subscribedPropertyNames = []
        // }
        // let index
        // const len = _subscribedValues.length
        // for (let i = len - 1; i >= 0; i--) {
        // 	if (_subscribedValues[i] === value
        // 		&& _subscribedParents[i] === parent
        // 		&& _subscribedPropertyNames[i] === propertyName
        // 	) {
        // 		index = i
        // 		break
        // 	}
        // }
        //
        // if (index >= 0) {
        // 	if (index < len - 1) {
        // 		for (let i = len - 1; i > index; i--) {
        // 			_subscribedValues[i + 1] = _subscribedValues[i]
        // 			_subscribedParents[i + 1] = _subscribedParents[i]
        // 			_subscribedPropertyNames[i + 1] = _subscribedPropertyNames[i]
        // 		}
        // 		_subscribedValues[index + 1] = value
        // 		_subscribedParents[index + 1] = parent
        // 		_subscribedPropertyNames[index + 1] = propertyName
        // 	} else {
        // 		_subscribedValues.push(value)
        // 		_subscribedParents.push(parent)
        // 		_subscribedPropertyNames.push(propertyName)
        // 	}
        // } else {
        // 	if (len > 0 && (typeof value === 'undefined' || typeof _subscribedValues[len - 1] !== 'undefined')) {
        // 		if (typeof value === 'undefined') {
        // 			_subscribedValues.unshift(value)
        // 			_subscribedParents.unshift(parent)
        // 			_subscribedPropertyNames.unshift(propertyName)
        // 		} else {
        // 			_subscribedValues[len] = _subscribedValues[len - 1]
        // 			_subscribedParents[len] = _subscribedParents[len - 1]
        // 			_subscribedPropertyNames[len] = _subscribedPropertyNames[len - 1]
        // 			_subscribedValues[len - 1] = value
        // 			_subscribedParents[len - 1] = parent
        // 			_subscribedPropertyNames[len - 1] = propertyName
        // 		}
        // 	} else {
        // 		_subscribedValues.push(value)
        // 		_subscribedParents.push(parent)
        // 		_subscribedPropertyNames.push(propertyName)
        // 		this._lastValue(value, parent, propertyName)
        // 	}
        // }
      }

      return function () {
        _this.unsubscribe(value, parent, propertyName);
      };
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(value, parent, propertyName) {
      if (this._subscribe) {
        //  && typeof value !== 'undefined') {
        var unsubscribed;
        var unsubscribedLast;

        if (value instanceof Object) {
          var _unsubscribersCount = this._unsubscribersCount;

          if (_unsubscribersCount) {
            var itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(value);
            var unsubscribeCount = _unsubscribersCount[itemUniqueId];

            if (unsubscribeCount != null) {
              if (unsubscribeCount) {
                if (unsubscribeCount > 1) {
                  _unsubscribersCount[itemUniqueId] = unsubscribeCount - 1;
                } else {
                  var _unsubscribers = this._unsubscribers;
                  var unsubscribe = _unsubscribers[itemUniqueId]; // unsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls

                  delete _unsubscribers[itemUniqueId];
                  delete _unsubscribersCount[itemUniqueId];

                  if ((0, _isArray.default)(unsubscribe)) {
                    for (var i = 0, len = unsubscribe.length; i < len; i++) {
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

        if (this._unsubscribe && (unsubscribedLast || !unsubscribed)) {
          this._unsubscribe(value, parent, propertyName, unsubscribedLast);
        }
      }

      if (this._lastValue) {
        this.removeSubscribed({
          value: value,
          parent: parent,
          propertyName: propertyName
        }); // const {_subscribedValues, _subscribedParents, _subscribedPropertyNames} = this
        // if (_subscribedValues) {
        // 	let index = -1
        // 	const len = _subscribedValues.length
        // 	for (let i = 0; i < len; i++) {
        // 		if (_subscribedValues[i] === value
        // 			&& _subscribedParents[i] === parent
        // 			&& _subscribedPropertyNames[i] === propertyName
        // 		) {
        // 			index = i
        // 			break
        // 		}
        // 	}
        //
        // 	if (index < 0) {
        // 		if (typeof value !== 'undefined') {
        // 			throw new Error(`subscribedValue no found: ${parent.constructor.name}.${propertyName} = ${value}`)
        // 		}
        // 	} else {
        // 		if (index === len - 1) {
        // 			_subscribedValues.length = len - 1
        // 			_subscribedParents.length = len - 1
        // 			_subscribedPropertyNames.length = len - 1
        // 			if (len > 1) {
        // 				this._lastValue(
        // 					_subscribedValues[len - 2],
        // 					_subscribedParents[len - 2],
        // 					_subscribedPropertyNames[len - 2],
        // 				)
        // 			} else {
        // 				this._lastValue(void 0, null, null)
        // 			}
        // 		} else {
        // 			if (index !== len - 2) {
        // 				_subscribedValues[index] = _subscribedValues[len - 2]
        // 				_subscribedParents[index] = _subscribedParents[len - 2]
        // 				_subscribedPropertyNames[index] = _subscribedPropertyNames[len - 2]
        // 			}
        // 			_subscribedValues[len - 2] = _subscribedValues[len - 1]
        // 			_subscribedParents[len - 2] = _subscribedParents[len - 1]
        // 			_subscribedPropertyNames[len - 2] = _subscribedPropertyNames[len - 1]
        // 			_subscribedValues.length = len - 1
        // 			_subscribedParents.length = len - 1
        // 			_subscribedPropertyNames.length = len - 1
        // 		}
        // 	}
        // }
      }
    }
  }]);
  return ObjectSubscriber;
}();

exports.ObjectSubscriber = ObjectSubscriber;