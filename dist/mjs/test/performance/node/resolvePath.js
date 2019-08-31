import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";

/* tslint:disable:no-empty */
import { calcPerformance } from 'rdtsc';
import { ThenableSync } from '../../../main/common/async/ThenableSync';
import { ObservableObject } from '../../../main/common/rx/object/ObservableObject';
import { CalcObjectBuilder } from '../../../main/common/rx/object/properties/CalcObjectBuilder';
import { calcPropertyFactory } from '../../../main/common/rx/object/properties/CalcPropertyBuilder';
import { resolvePath } from '../../../main/common/rx/object/properties/helpers';
describe('resolvePath', function () {
  this.timeout(300000);

  var Class =
  /*#__PURE__*/
  function (_ObservableObject) {
    _inherits(Class, _ObservableObject);

    function Class() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Class);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Class)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.simple = {
        value: _assertThisInitialized(_this)
      };
      return _this;
    }

    return Class;
  }(ObservableObject);

  var simple = {};
  new CalcObjectBuilder(Class.prototype).writable('observable').calc('calc', simple, calcPropertyFactory(function (input, valueProperty) {
    valueProperty.value = input.value;
    return ThenableSync.createResolved(null);
  }));
  var object = new Class();
  object.simple = simple;
  simple.value = object;
  it('simple', function () {
    var test = resolvePath(object)();
    var result = calcPerformance(20000, function () {}, function () {
      return resolvePath(true)();
    }, function () {
      return resolvePath(object)();
    }, function () {
      return resolvePath(object)(function (o) {
        return o.simple;
      })();
    }, function () {
      return resolvePath(object)(function (o) {
        return o.observable;
      })();
    }, function () {
      return resolvePath(object)(function (o) {
        return o.wait;
      }, true)();
    }, function () {
      return resolvePath(object)(function (o) {
        return o.calc;
      })();
    }, function () {
      return resolvePath(object)(function (o) {
        return o.calc;
      })(function (o) {
        return o.wait;
      }, true)();
    });
    console.log(result);
  });
});