"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestSubject = void 0;

var _behavior = require("../../../../../../main/common/rx/subjects/behavior");

var _observable = require("../../../../../../main/common/rx/subjects/observable");

function deleteFromArray(array, item) {
  const index = array.indexOf(item);

  if (index > -1) {
    array.splice(index, 1);
  }
}

class TestSubject extends _observable.Observable {
  constructor(...args) {
    super(...args);
    this._testSubscribers = [];
  }

  get hasSubscribers() {
    return !!this._testSubscribers.length;
  } // eslint-disable-next-line no-shadow


  subscribe(subscriber) {
    this._testSubscribers.push(subscriber);

    return () => {
      deleteFromArray(this._testSubscribers, subscriber);
    };
  }

  emit(value) {
    // eslint-disable-next-line no-shadow
    for (const subscriber of this._testSubscribers) {
      subscriber(value);
    }

    return this;
  }

}

exports.TestSubject = TestSubject;