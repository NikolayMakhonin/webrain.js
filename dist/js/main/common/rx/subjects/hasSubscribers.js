"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasSubscribers = hasSubscribers;
exports.HasSubscribersBehaviorSubject = exports.HasSubscribersSubject = void 0;

var _behavior = require("./behavior");

var _subject = require("./subject");

// eslint-disable-next-line no-shadow
// tslint:disable-next-line:no-shadowed-variable
function createHasSubscribersSubjectDefault(hasSubscribers) {
  const subject = new _behavior.BehaviorSubject(hasSubscribers);
  subject.unsubscribeValue = null;
  return subject;
}

function hasSubscribers(base, createHasSubscribersSubject = createHasSubscribersSubjectDefault) {
  return class HasSubscribers extends base {
    subscribe(subscriber) {
      if (!subscriber) {
        return null;
      } // eslint-disable-next-line no-shadow
      // tslint:disable-next-line:no-shadowed-variable


      const {
        hasSubscribers
      } = this;
      const unsubscribe = super.subscribe(subscriber);

      if (!hasSubscribers && this._hasSubscribersSubject && this.hasSubscribers) {
        this._hasSubscribersSubject.emit(true);
      }

      return () => {
        // eslint-disable-next-line no-shadow
        // tslint:disable-next-line:no-shadowed-variable
        const {
          hasSubscribers
        } = this;
        unsubscribe();

        if (hasSubscribers && this._hasSubscribersSubject && !this.hasSubscribers) {
          this._hasSubscribersSubject.emit(false);
        }
      };
    }

    get hasSubscribersObservable() {
      let {
        _hasSubscribersSubject
      } = this;

      if (!_hasSubscribersSubject) {
        this._hasSubscribersSubject = _hasSubscribersSubject = createHasSubscribersSubject(this.hasSubscribers);
      }

      return _hasSubscribersSubject;
    }

  };
}

const HasSubscribersSubject = hasSubscribers(_subject.Subject);
exports.HasSubscribersSubject = HasSubscribersSubject;
const HasSubscribersBehaviorSubject = hasSubscribers(_behavior.BehaviorSubject);
exports.HasSubscribersBehaviorSubject = HasSubscribersBehaviorSubject;