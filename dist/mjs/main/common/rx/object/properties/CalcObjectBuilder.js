import { calcPropertyFactory } from './CalcPropertyBuilder';
import { ConnectorBuilder, connectorFactory } from './ConnectorBuilder';
export class CalcObjectBuilder extends ConnectorBuilder {
  // @ts-ignore
  writable(name, options, initValue) {
    return super.writable(name, options, initValue);
  } // @ts-ignore


  readable(name, options, initValue) {
    return super.readable(name, options, initValue);
  }

  calc(name, inputOrFactory, calcFactory, initValue) {
    return super.readable(name, {
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

  calcConnect(name, buildRule, options, initValue) {
    return this.calc(name, connectorFactory({
      buildRule: c => c.connect('value', buildRule)
    }), calcPropertyFactory({
      dependencies: d => d.invalidateOn(b => b.p('value')),

      calcFunc(state) {
        state.value = state.input.value;
      }

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