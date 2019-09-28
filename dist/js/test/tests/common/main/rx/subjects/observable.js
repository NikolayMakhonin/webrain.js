"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _observable = require("../../../../../../main/common/rx/subjects/observable");

var _Assert = require("../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../main/common/test/Mocha");

(0, _Mocha.describe)('common > main > rx > subjects > observable', function () {
  (0, _Mocha.it)('Observable', function () {
    var CustomObservable =
    /*#__PURE__*/
    function (_Observable) {
      (0, _inherits2.default)(CustomObservable, _Observable);

      function CustomObservable() {
        (0, _classCallCheck2.default)(this, CustomObservable);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CustomObservable).apply(this, arguments));
      }

      (0, _createClass2.default)(CustomObservable, [{
        key: "subscribe",
        value: function subscribe(subscriber) {
          throw new Error('Not implemented');
        }
      }]);
      return CustomObservable;
    }(_observable.Observable);

    var observable = new CustomObservable();
    var arg;
    var result = observable.call(function (o) {
      arg = o;
      return 'result';
    });

    _Assert.assert.strictEqual(arg, observable);

    _Assert.assert.strictEqual(result, 'result');
  });
});