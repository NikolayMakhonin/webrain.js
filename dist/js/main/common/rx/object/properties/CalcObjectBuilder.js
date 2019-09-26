"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.CalcObjectBuilder = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _CalcPropertyBuilder = require("./CalcPropertyBuilder");

var CalcObjectBuilder =
/*#__PURE__*/
function (_ObservableObjectBuil) {
  (0, _inherits2.default)(CalcObjectBuilder, _ObservableObjectBuil);

  function CalcObjectBuilder() {
    (0, _classCallCheck2.default)(this, CalcObjectBuilder);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CalcObjectBuilder).apply(this, arguments));
  }

  (0, _createClass2.default)(CalcObjectBuilder, [{
    key: "calc",
    value: function calc(name, inputOrFactory, calcFactory, initValue) {
      return this.readable(name, {
        factory: function factory() {
          var property = calcFactory(initValue);

          if (typeof inputOrFactory !== 'undefined') {
            property.input = typeof inputOrFactory === 'function' ? inputOrFactory(this) : inputOrFactory;
          }

          return property;
        }
      });
    }
  }, {
    key: "calcChanges",
    value: function calcChanges(name, buildRule) {
      return this.calc(name, void 0, (0, _CalcPropertyBuilder.calcPropertyFactory)(function (dependencies) {
        return dependencies.invalidateOn(buildRule);
      }, function (input, property) {
        property.value++;
      }, null, null, 0));
    }
  }]);
  return CalcObjectBuilder;
}(_ObservableObjectBuilder.ObservableObjectBuilder); // const builder = new CalcObjectBuilder(true as any)
//
// export function calc<
// 	TObject extends ObservableObject,
// 	TInput extends new (object: TObject) => any | NotFunction<any>,
// 	TValue = any,
// 	TMergeSource = any
// >(
// 	options?: IConnectPropertyOptions<TObject, TInput, TValue, TMergeSource>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.calc(propertyKey, options, initValue)
// 	}
// }
// class Class1 extends ObservableObject {
// }
// class Class extends Class1 {
// 	@calc()
// 	public prop: number
// }


exports.CalcObjectBuilder = CalcObjectBuilder;