import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { calcPropertyFactory } from './CalcPropertyBuilder';
export class CalcObjectBuilder extends ObservableObjectBuilder {
  calc(name, inputOrFactory, calcFactory, initValue) {
    return this.readable(name, {
      factory() {
        const property = calcFactory(initValue);

        if (typeof inputOrFactory !== 'undefined') {
          property.input = typeof inputOrFactory === 'function' ? inputOrFactory(this) : inputOrFactory;
        }

        return property;
      }

    });
  }

  calcChanges(name, buildRule) {
    return this.calc(name, void 0, calcPropertyFactory((input, property) => {
      property.value++;
    }, null, null, 0, dependencies => dependencies.invalidateOn(buildRule)));
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