"use strict";

exports.__esModule = true;
exports.Observable = void 0;

var Observable =
/*#__PURE__*/
function () {
  function Observable() {}

  var _proto = Observable.prototype;

  _proto.call = function call(func) {
    return func(this);
  };

  return Observable;
}();

exports.Observable = Observable;