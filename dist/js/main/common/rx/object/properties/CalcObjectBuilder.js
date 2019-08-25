"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalcObjectBuilder = void 0;

var _deepSubscribe = require("../../deep-subscribe/deep-subscribe");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _CalcProperty = require("./CalcProperty");

class CalcObjectBuilder extends _ObservableObjectBuilder.ObservableObjectBuilder {
  calc(name, input, {
    dependencies,
    calcFunc,
    calcOptions,
    valuePropertyOptions
  }, initValue) {
    return this.readable(name, {
      factory() {
        const property = new _CalcProperty.CalcProperty(calcFunc, calcOptions, valuePropertyOptions, initValue);
        property.input = typeof input === 'function' ? input(this) : input;

        if (dependencies) {
          (0, _deepSubscribe.deepSubscribe)(property, () => {
            property.invalidate();
            return null;
          }, false, b => {
            dependencies(b.path(o => o.input));
            return b;
          });
        }

        return property;
      }

    });
  }

} // const builder = new CalcObjectBuilder(true as any)
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