"use strict";

var _observable = require("../subjects/observable");

_observable.Observable.prototype.autoConnect = function (connectPredicate, connectFunc) {
  let disconnect;
  return this.subscribe(value => {
    if (connectPredicate && connectPredicate(value) || !connectPredicate && value) {
      if (!disconnect) {
        disconnect = connectFunc();
      }
    } else if (disconnect) {
      disconnect();
    }
  });
};