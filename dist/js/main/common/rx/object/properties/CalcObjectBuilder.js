"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalcObjectBuilder = void 0;

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

class CalcObjectBuilder extends _ObservableObjectBuilder.ObservableObjectBuilder {
  calc(name, inputOrFactory, calcPropertyFactory, initValue) {
    return this.readable(name, {
      factory() {
        const property = calcPropertyFactory(initValue);
        property.input = typeof inputOrFactory === 'function' ? inputOrFactory(this) : inputOrFactory;
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