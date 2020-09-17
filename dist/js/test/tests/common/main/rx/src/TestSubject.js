"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.TestSubject = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _observable = require("../../../../../../main/common/rx/subjects/observable");

function _createForOfIteratorHelperLoose(o) { var _context3; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context3 = i.next).call(_context3, i); }

function _unsupportedIterableToArray(o, minLen) { var _context2; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context2 = Object.prototype.toString.call(o)).call(_context2, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

function deleteFromArray(array, item) {
  var index = (0, _indexOf.default)(array).call(array, item);

  if (index > -1) {
    (0, _splice.default)(array).call(array, index, 1);
  }
}

var TestSubject = /*#__PURE__*/function (_Observable) {
  (0, _inherits2.default)(TestSubject, _Observable);

  var _super = _createSuper(TestSubject);

  function TestSubject() {
    var _context;

    var _this;

    (0, _classCallCheck2.default)(this, TestSubject);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, (0, _concat.default)(_context = [this]).call(_context, args));
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
      for (var _iterator = _createForOfIteratorHelperLoose(this._testSubscribers), _step; !(_step = _iterator()).done;) {
        var subscriber = _step.value;
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