"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.TestSubject = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator2.default)(this._testSubscribers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var subscriber = _step.value;
          subscriber(value);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
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