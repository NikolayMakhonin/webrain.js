"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThenableSync = exports.ThenableSyncStatus = void 0;

var _helpers = require("./helpers");

let ThenableSyncStatus;
exports.ThenableSyncStatus = ThenableSyncStatus;

(function (ThenableSyncStatus) {
  ThenableSyncStatus["Resolving"] = "Resolving";
  ThenableSyncStatus["Resolved"] = "Resolved";
})(ThenableSyncStatus || (exports.ThenableSyncStatus = ThenableSyncStatus = {}));

class ThenableSync {
  constructor(executor) {
    if (executor) {
      executor(this.resolve.bind(this));
    }
  }

  resolve(value) {
    if (this._status != null) {
      throw new Error(`Multiple call resolve() is forbidden; status = ${this._status}`);
    }

    return this._resolve(value);
  }

  _resolve(value) {
    const {
      _status
    } = this;

    if (_status != null && _status !== ThenableSyncStatus.Resolving) {
      throw new Error(`Multiple call resolve() is forbidden; status = ${_status}`);
    }

    value = ThenableSync.resolve(value);

    if (ThenableSync.isThenableSync(value)) {
      this._status = ThenableSyncStatus.Resolving;
      return value.thenLast(this._resolve.bind(this));
    }

    this._status = ThenableSyncStatus.Resolved;
    this._value = value;
    const {
      _onfulfilled
    } = this;

    if (_onfulfilled) {
      this._onfulfilled = void 0;

      for (let i = 0, len = _onfulfilled.length; i < len; i++) {
        _onfulfilled[i](value);
      }
    }

    return value;
  }

  _then(onfulfilled, lastExpression) {
    if (Object.prototype.hasOwnProperty.call(this, '_value')) {
      const {
        _value
      } = this;

      if (!onfulfilled) {
        return _value;
      }

      const result = ThenableSync.resolve(onfulfilled(_value));
      return lastExpression || ThenableSync.isThenableSync(result) ? result : ThenableSync.createResolved(result);
    } else {
      if (!onfulfilled) {
        return this;
      }

      let {
        _onfulfilled
      } = this;

      if (!_onfulfilled) {
        this._onfulfilled = _onfulfilled = [];
      }

      const result = new ThenableSync();

      _onfulfilled.push(value => {
        result.resolve(onfulfilled(value));
      });

      return result;
    }
  }

  then(onfulfilled) {
    return this._then(onfulfilled, false);
  }

  thenLast(onfulfilled) {
    return this._then(onfulfilled, true);
  }

  static createResolved(value) {
    const thenable = new ThenableSync();
    thenable._status = ThenableSyncStatus.Resolved;
    thenable._value = value;
    return thenable;
  }

  static isThenableSync(value) {
    return value instanceof ThenableSync;
  }

  static resolve(value, onfulfilled) {
    if (ThenableSync.isThenableSync(value)) {
      value = value.thenLast(onfulfilled);
      return value;
    }

    if (value && (0, _helpers.isIterable)(value) && typeof value.next === 'function') {
      const iterator = value;

      const resolveIterator = iteration => {
        if (iteration.done) {
          return iteration.value;
        } else {
          return ThenableSync.resolve(iteration.value, o => {
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

}

exports.ThenableSync = ThenableSync;