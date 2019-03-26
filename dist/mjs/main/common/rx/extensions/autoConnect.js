import { Observable } from '../subjects/observable';

Observable.prototype.autoConnect = function (connectPredicate, connectFunc) {
  var disconnect;
  return this.subscribe(function (value) {
    if (connectPredicate && connectPredicate(value) || !connectPredicate && value) {
      if (!disconnect) {
        disconnect = connectFunc();
      }
    } else if (disconnect) {
      disconnect();
    }
  });
};