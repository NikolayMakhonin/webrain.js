import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { isIterable } from './helpers';
export var ThenableSyncStatus;

(function (ThenableSyncStatus) {
  ThenableSyncStatus["Resolving"] = "Resolving";
  ThenableSyncStatus["Resolved"] = "Resolved";
})(ThenableSyncStatus || (ThenableSyncStatus = {}));

export var ThenableSync =
/*#__PURE__*/
function () {
  function ThenableSync(executor) {
    _classCallCheck(this, ThenableSync);

    if (executor) {
      executor(this.resolve.bind(this));
    }
  }

  _createClass(ThenableSync, [{
    key: "resolve",
    value: function resolve(value) {
      if (this._status != null) {
        throw new Error("Multiple call resolve() is forbidden; status = ".concat(this._status));
      }

      return this._resolve(value);
    }
  }, {
    key: "_resolve",
    value: function _resolve(value) {
      var _status = this._status;

      if (_status != null && _status !== ThenableSyncStatus.Resolving) {
        throw new Error("Multiple call resolve() is forbidden; status = ".concat(_status));
      }

      value = ThenableSync.resolve(value);

      if (ThenableSync.isThenableSync(value)) {
        this._status = ThenableSyncStatus.Resolving;
        return value.thenLast(this._resolve.bind(this));
      }

      this._status = ThenableSyncStatus.Resolved;
      this._value = value;
      var _onfulfilled = this._onfulfilled;

      if (_onfulfilled) {
        this._onfulfilled = void 0;

        for (var i = 0, len = _onfulfilled.length; i < len; i++) {
          _onfulfilled[i](value);
        }
      }

      return value;
    }
  }, {
    key: "_then",
    value: function _then(onfulfilled, lastExpression) {
      if (Object.prototype.hasOwnProperty.call(this, '_value')) {
        var _value = this._value;

        if (!onfulfilled) {
          return _value;
        }

        var result = ThenableSync.resolve(onfulfilled(_value));
        return lastExpression || ThenableSync.isThenableSync(result) ? result : ThenableSync.createResolved(result);
      } else {
        if (!onfulfilled) {
          return this;
        }

        var _onfulfilled = this._onfulfilled;

        if (!_onfulfilled) {
          this._onfulfilled = _onfulfilled = [];
        }

        var _result = new ThenableSync();

        _onfulfilled.push(function (value) {
          _result.resolve(onfulfilled(value));
        });

        return _result;
      }
    }
  }, {
    key: "then",
    value: function then(onfulfilled) {
      return this._then(onfulfilled, false);
    }
  }, {
    key: "thenLast",
    value: function thenLast(onfulfilled) {
      return this._then(onfulfilled, true);
    }
  }], [{
    key: "createResolved",
    value: function createResolved(value) {
      var thenable = new ThenableSync();
      thenable._status = ThenableSyncStatus.Resolved;
      thenable._value = value;
      return thenable;
    }
  }, {
    key: "isThenableSync",
    value: function isThenableSync(value) {
      return value instanceof ThenableSync;
    }
  }, {
    key: "resolve",
    value: function resolve(value, onfulfilled) {
      if (ThenableSync.isThenableSync(value)) {
        value = value.thenLast(onfulfilled);
        return value;
      }

      if (value && isIterable(value) && typeof value.next === 'function') {
        var iterator = value;

        var resolveIterator = function resolveIterator(iteration) {
          if (iteration.done) {
            return iteration.value;
          } else {
            return ThenableSync.resolve(iteration.value, function (o) {
              return resolveIterator(iterator.next(o));
            });
          }
        };

        value = resolveIterator(value.next());
        return this.resolve(value, onfulfilled);
      }

      if (onfulfilled) {
        value = onfulfilled(value);
        return this.resolve(value);
      }

      return value;
    }
  }]);

  return ThenableSync;
}();