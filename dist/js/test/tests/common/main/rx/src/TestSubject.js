"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.TestSubject = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _observable = require("../../../../../../main/common/rx/subjects/observable");

function deleteFromArray(array, item) {
  var index = (0, _indexOf.default)(array).call(array, item);

  if (index > -1) {
    (0, _splice.default)(array).call(array, index, 1);
  }
}

var TestSubject =
/*#__PURE__*/
function (_Observable) {
  (0, _inherits2.default)(TestSubject, _Observable);

  function TestSubject() {
    var _getPrototypeOf2, _context;

    var _this;

    (0, _classCallCheck2.default)(this, TestSubject);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(TestSubject)).call.apply(_getPrototypeOf2, (0, _concat.default)(_context = [this]).call(_context, args)));
    _this._testSubscribers = [];
    return _this;
  }

  (0, _createClass2.default)(TestSubject, [{
    key: "subscribe",
    // eslint-disable-next-line no-shadow
    value: function subscribe(subscriber) {
      var _this2 = this;

      this._testSubscribers.push(subscriber);

      return function () {
        deleteFromArray(_this2._testSubscribers, subscriber);
      };
    }
  }, {
    key: "emit",
    value: function emit(value) {
      // eslint-disable-next-line no-shadow
      for (var _iterator = this._testSubscribers, _isArray = (0, _isArray2.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var subscriber = _ref;
        subscriber(value);
      }

      return this;
    }
  }, {
    key: "hasSubscribers",
    get: function get() {
      return !!this._testSubscribers.length;
    }
  }]);
  return TestSubject;
}(_observable.Observable);

exports.TestSubject = TestSubject;