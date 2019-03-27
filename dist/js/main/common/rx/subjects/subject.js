"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subject = subject;
exports.Subject = void 0;

var _observable = require("./observable");

function subject(base) {
  // eslint-disable-next-line no-shadow
  // tslint:disable-next-line:no-shadowed-variable
  return class Subject extends base {
    get hasSubscribers() {
      return !!(this._subscribers && this._subscribers.length);
    }

    subscribe(subscriber) {
      if (!subscriber) {
        return null;
      }

      let {
        _subscribers
      } = this;

      if (!_subscribers) {
        this._subscribers = _subscribers = [subscriber];
      } else {
        _subscribers[_subscribers.length] = subscriber;
      }

      return () => {
        if (!subscriber) {
          return;
        }

        const index = _subscribers.indexOf(subscriber);

        if (index >= 0) {
          _subscribers.splice(index, 1);
        }

        subscriber = null;
      };
    }

    emit(value) {
      let {
        _subscribers
      } = this;

      if (!_subscribers) {
        return this;
      }

      _subscribers = _subscribers.slice();

      for (let i = 0, l = _subscribers.length; i < l; i++) {
        _subscribers[i](value);
      }

      return this;
    }

  };
}

const Subject = subject(_observable.Observable); // export function createSubjectClass(base, ...extensions) {
// 	for (const extension of extensions) {
// 		base = extension(base)
// 	}
//
// 	return base
// }

exports.Subject = Subject;