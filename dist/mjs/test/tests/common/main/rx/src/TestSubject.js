import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { Observable } from '../../../../../../main/common/rx/subjects/observable';

function deleteFromArray(array, item) {
  var index = array.indexOf(item);

  if (index > -1) {
    array.splice(index, 1);
  }
}

export var TestSubject =
/*#__PURE__*/
function (_Observable) {
  _inherits(TestSubject, _Observable);

  function TestSubject() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, TestSubject);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TestSubject)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this._testSubscribers = [];
    return _this;
  }

  _createClass(TestSubject, [{
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
        for (var _iterator = this._testSubscribers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var subscriber = _step.value;
          subscriber(value);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
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
}(Observable);