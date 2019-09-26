"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _rdtsc = require("rdtsc");

var _ThenableSync = require("../../../main/common/async/ThenableSync");

var _ObservableObject2 = require("../../../main/common/rx/object/ObservableObject");

var _CalcObjectBuilder = require("../../../main/common/rx/object/properties/CalcObjectBuilder");

var _CalcPropertyBuilder = require("../../../main/common/rx/object/properties/CalcPropertyBuilder");

var _helpers = require("../../../main/common/rx/object/properties/helpers");

/* tslint:disable:no-empty */
describe('resolvePath', function () {
  this.timeout(300000);

  var Class =
  /*#__PURE__*/
  function (_ObservableObject) {
    (0, _inherits2.default)(Class, _ObservableObject);

    function Class() {
      var _getPrototypeOf2, _context;

      var _this;

      (0, _classCallCheck2.default)(this, Class);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(Class)).call.apply(_getPrototypeOf2, (0, _concat.default)(_context = [this]).call(_context, args)));
      _this.simple = {
        value: (0, _assertThisInitialized2.default)(_this)
      };
      return _this;
    }

    return Class;
  }(_ObservableObject2.ObservableObject);

  var simple = {};
  new _CalcObjectBuilder.CalcObjectBuilder(Class.prototype).writable('observable').calc('calc', simple, (0, _CalcPropertyBuilder.calcPropertyFactory)(null, function (input, property) {
    property.value = input.value;
    return _ThenableSync.ThenableSync.createResolved(null);
  }));
  var object = new Class();
  object.simple = simple;
  simple.value = object;
  it('simple', function () {
    var test = (0, _helpers.resolvePath)(object)();
    var result = (0, _rdtsc.calcPerformance)(20000, function () {}, function () {
      return (0, _helpers.resolvePath)(true)();
    }, function () {
      return (0, _helpers.resolvePath)(object)();
    }, function () {
      return (0, _helpers.resolvePath)(object)(function (o) {
        return o.simple;
      })();
    }, function () {
      return (0, _helpers.resolvePath)(object)(function (o) {
        return o.observable;
      })();
    }, function () {
      return (0, _helpers.resolvePath)(object)(function (o) {
        return o.wait;
      }, true)();
    }, function () {
      return (0, _helpers.resolvePath)(object)(function (o) {
        return o.calc;
      })();
    }, function () {
      return (0, _helpers.resolvePath)(object)(function (o) {
        return o.calc;
      })(function (o) {
        return o.wait;
      }, true)();
    });
    console.log(result);
  });
});