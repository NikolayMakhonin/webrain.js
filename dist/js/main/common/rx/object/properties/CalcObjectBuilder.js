"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.CalcObjectBuilder = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _CalcPropertyBuilder = require("./CalcPropertyBuilder");

var CalcObjectBuilder =
/*#__PURE__*/
function (_ObservableObjectBuil) {
  (0, _inheritsLoose2.default)(CalcObjectBuilder, _ObservableObjectBuil);

  function CalcObjectBuilder() {
    return _ObservableObjectBuil.apply(this, arguments) || this;
  }

  var _proto = CalcObjectBuilder.prototype;

  _proto.calc = function calc(name, inputOrFactory, calcFactory, initValue) {
    return this.readable(name, {
      factory: function factory() {
        var property = calcFactory(initValue);

        if (typeof inputOrFactory !== 'undefined') {
          property.input = typeof inputOrFactory === 'function' ? inputOrFactory(this) : inputOrFactory;
        }

        return property;
      }
    });
  };

  _proto.calcChanges = function calcChanges(name, buildRule) {
    return this.calc(name, void 0, (0, _CalcPropertyBuilder.calcPropertyFactory)(function (input, property) {
      property.value++;
    }, null, null, 0, function (dependencies) {
      return dependencies.invalidateOn(buildRule);
    }));
  };

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