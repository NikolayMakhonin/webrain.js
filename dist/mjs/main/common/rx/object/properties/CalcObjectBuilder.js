import { VALUE_PROPERTY_DEFAULT } from '../../../helpers/value-property';
import { depend, dependX } from '../../../rx/depend/core/depend';
import { makeDependPropertySubscriber } from '../helpers';
import { ObservableClass } from '../ObservableClass';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { ConnectorBuilder } from './ConnectorBuilder';
import { observableClass } from './helpers';
import { Path } from './path/builder';

function createGetValue(calcSourcePath, getValue) {
  if (calcSourcePath == null) {
    return getValue;
  } else {
    const path = calcSourcePath.clone().append(o => getValue.call(o)).init();
    return function () {
      return path.get(this);
    };
  }
}

export class CalcObjectBuilder extends ConnectorBuilder {
  constructor(object, connectorSourcePath, calcSourcePath) {
    super(object, connectorSourcePath);
    this.calcSourcePath = calcSourcePath;
  } // @ts-ignore


  func(name, func) {
    return super.func(name, func);
  } // @ts-ignore


  writable(name, options, initValue) {
    return super.writable(name, options, initValue);
  } // @ts-ignore


  readable(name, options, initValue) {
    return super.readable(name, options, initValue);
  }

  calcSimple(name, func) {
    return super.readable(name, {
      getValue: createGetValue(this.calcSourcePath, func)
    });
  }

  calc(name, func, deferredOptions) {
    return super.readable(name, {
      getValue: depend(createGetValue(this.calcSourcePath, func), deferredOptions, makeDependPropertySubscriber(name))
    });
  }

  calcX(name, func, deferredOptions) {
    return super.readable(name, {
      getValue: dependX(func, deferredOptions, makeDependPropertySubscriber(name))
    });
  }

  nested(name, build) {
    const propClass = propertyClass(build);
    return super.readable(name, {
      factory() {
        return new propClass(this);
      }

    });
  }

  nestedCalc(name, inputOrFactory, calcFactory) {
    // & { object: { readonly [newProp in Name]: TObject[Name] } } {
    return this.readable(name, {
      factory() {
        let input;

        if (typeof inputOrFactory !== 'undefined') {
          input = typeof inputOrFactory === 'function' ? inputOrFactory(this, name != null ? name : this.constructor.name) : inputOrFactory;
        }

        return calcFactory(input, `${this.constructor.name}.${name}`);
      }

    });
  } // public nestedCalc<
  // 	Name extends keyof TObject,
  // 	TConnector extends PropertyClass<TObject>
  // >(
  // 	name: Name,
  // 	build: (builder: DependCalcObjectBuilder<PropertyClass<TObject>, TObject>)
  // 		=> { object: TConnector },
  // 	func: (this: TConnector)
  // 		=> ThenableOrIteratorOrValue<TObject[Name]>,
  // 	deferredOptions?: IDeferredOptions,
  // ): this { // & { object: { readonly [newProp in Name]: TObject[Name] } } {
  // 	const inputClass = propertyClass(build)
  // 	const propClass = calcPropertyClass(func, deferredOptions)
  // 	return super.readable(name as any, {
  // 		factory() {
  // 			return new propClass(new inputClass(this))
  // 		},
  // 	}) as any
  // }
  //
  // public nestedCalcX<
  // 	Name extends keyof TObject,
  // 	TConnector extends PropertyClass<TObject>
  // >(
  // 	name: Name,
  // 	build: (builder: DependCalcObjectBuilder<PropertyClass<TObject>, TObject>)
  // 		=> { object: TConnector },
  // 	func: (this: CallState<CalcPropertyClass<TObject[Name], TConnector>, any[], TObject[Name]>)
  // 		=> ThenableOrIteratorOrValue<TObject[Name]>,
  // 	deferredOptions?: IDeferredOptions,
  // ): this & { object: { readonly [newProp in Name]: TObject[Name] } } {
  // 	const inputClass = propertyClass(build)
  // 	const propClass = calcPropertyClassX(func, deferredOptions)
  // 	return super.readable(name as any, {
  // 		factory() {
  // 			return new propClass(new inputClass(this))
  // 		},
  // 	}) as any
  // }


} // region PropertyClass

export class PropertyClass extends ObservableClass {
  /** @internal */
  constructor(object) {
    super();
    this.$object = object;
  }

}
new ObservableObjectBuilder(PropertyClass.prototype).writable('$object', {
  hidden: true
});
export function propertyClass(build, baseClass) {
  const objectPath = new Path().f(o => o.$object).init();
  return observableClass(object => build(new CalcObjectBuilder(object, objectPath)).object, baseClass != null ? baseClass : PropertyClass);
} // endregion
// region CalcPropertyClass

export class CalcPropertyClass extends ObservableClass {
  constructor(input, name) {
    super();
    this.input = input;
    this.name = name;
  }

}
new ObservableObjectBuilder(CalcPropertyClass.prototype).writable('input');
export function calcPropertyClassX(func, deferredOptions, baseClass) {
  // const inputPath = Path.build<TBaseClass>()(o => o.input)()
  return observableClass(object => new CalcObjectBuilder(object) // , inputPath, inputPath)
  .calcX(VALUE_PROPERTY_DEFAULT, func, deferredOptions).object, baseClass != null ? baseClass : CalcPropertyClass);
}
export function calcPropertyClass(func, deferredOptions, baseClass) {
  const inputPath = new Path().fv(o => o.input).init();
  return observableClass(object => new CalcObjectBuilder(object, inputPath, inputPath).calc(VALUE_PROPERTY_DEFAULT, func, deferredOptions).object, baseClass != null ? baseClass : CalcPropertyClass);
}
export function calcPropertyFactory({
  name,
  calcFunc,
  deferredOptions // baseClass,

}) {
  const NewProperty = calcPropertyClass(calcFunc, deferredOptions // baseClass,
  );
  return (input, _name) => new NewProperty(input, _name != null ? _name : name);
}
export function calcPropertyFactoryX({
  name,
  calcFunc,
  deferredOptions // baseClass,

}) {
  const NewProperty = calcPropertyClassX(calcFunc, deferredOptions // baseClass,
  );
  return (input, _name) => new NewProperty(input, _name != null ? _name : name);
} // endregion
// class Class extends ObservableClass {
// 	public prop1: number
// 	public prop2: string
// 	public prop3: string
// }
//
// new DependCalcObjectBuilder(new Class())
// 	.writable('prop1')
// 	// .nestedCalc('prop2', c => c
// 	// 	.connectSimple('prop1', b2 => b2(o => o.prop1)),
// 	// 	function() {
// 	// 		const x = this.prop1
// 	// 		return ''
// 	// 	})
// 	.nestedCalc(
// 		'prop2',
// 		dependConnectorFactory({
// 			build: c => c
// 				.connectSimple('_prop1', b => b.f(o => o.prop1)),
// 		}),
// 		dependCalcPropertyFactory({
// 			*calcFunc() {
// 				const x = this._prop1
// 				// const y = state.prop1
// 				return ''
// 			},
// 		}),
// 	)
// 	// .calc(
// 	// 	'prop2',
// 	// 	connectorFactory({
// 	// 		buildRule: c => c
// 	// 			.connect('_prop1', b2 => b2.p('prop1')),
// 	// 	}),
// 	// 	calcPropertyFactory({
// 	// 		calcFunc(state) {
// 	// 			const x = state.input._prop1
// 	// 		},
// 	// 	}),
// 	// )
// 	.nestedCalc(
// 		'prop3',
// 		dependConnectorFactory({
// 			build: c => c
// 				.connectSimple('_prop1', b => b.f(o => o.prop1)),
// 		}),
// 		dependCalcPropertyFactoryX({
// 			*calcFunc() {
// 				const x = this._this.input._prop1
// 				// const y = state.prop1
// 				return ''
// 			},
// 		}),
// 	)