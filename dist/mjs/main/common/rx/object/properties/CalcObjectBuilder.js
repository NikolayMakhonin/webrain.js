import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { calcPropertyFactory } from './CalcPropertyBuilder';
export class CalcObjectBuilder extends ObservableObjectBuilder {
  calc(name, inputOrFactory, calcFactory, initValue) {
    return this.readable(name, {
      factory() {
        const property = calcFactory(initValue);

        if (property.state.name == null) {
          property.state.name = `${this.constructor.name}.${name}`;
        }

        return property;
      },

      init(property) {
        if (typeof inputOrFactory !== 'undefined') {
          property.state.input = typeof inputOrFactory === 'function' ? inputOrFactory(this, this.constructor.name) : inputOrFactory;
        }
      }

    });
  }

  calcChanges(name, buildRule) {
    return this.calc(name, void 0, calcPropertyFactory({
      dependencies: dependencies => dependencies.invalidateOn(buildRule),

      calcFunc(state) {
        state.value++;
      },

      initValue: 0
    }));
  }

} // const builder = new CalcObjectBuilder(true as any)
//
// export function calc<
// 	TObject extends ObservableClass,
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
// class Class1 extends ObservableClass {
// }
// class Class extends Class1 {
// 	@calc()
// 	public prop: number
// }