import { createFunction } from '../../../helpers/helpers';
import { deepSubscribeRule } from '../../deep-subscribe/deep-subscribe';
import { cloneRule, RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { _set, _setExt } from '../ObservableObject';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { CalcObjectDebugger } from './CalcObjectDebugger';
import { Connector } from './Connector';
export class ConnectorBuilder extends ObservableObjectBuilder {
  constructor(object, buildSourceRule) {
    super(object);
    this.buildSourceRule = buildSourceRule;
  }

  connect(name, buildRule, options, initValue) {
    const {
      object,
      buildSourceRule
    } = this;
    let ruleBuilder = new RuleBuilder();

    if (buildSourceRule) {
      ruleBuilder = buildSourceRule(ruleBuilder);
    }

    ruleBuilder = buildRule(ruleBuilder);
    const ruleBase = ruleBuilder && ruleBuilder.result;

    if (ruleBase == null) {
      throw new Error('buildRule() return null or not initialized RuleBuilder');
    }

    const setOptions = options && options.setOptions; // optimization

    const getValue = createFunction('o', `return o.__fields["${name}"]`);
    const setValue = createFunction('o', 'v', `o.__fields["${name}"] = v`);
    const set = setOptions ? _setExt.bind(null, name, getValue, setValue, setOptions) : _set.bind(null, name, getValue, setValue);
    return this.readable(name, {
      setOptions,
      hidden: options && options.hidden,

      // tslint:disable-next-line:no-shadowed-variable
      factory(initValue) {
        let setVal = (obj, value) => {
          if (typeof value !== 'undefined') {
            initValue = value;
          }
        };

        const receiveValue = (value, parent, propertyName) => {
          CalcObjectDebugger.Instance.onConnectorChanged(this, value, parent, propertyName);
          setVal(this, value);
          return null;
        };

        const rule = this === object ? ruleBase : cloneRule(ruleBase);
        this.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribers => {
          this._setUnsubscriber(name, null);

          if (hasSubscribers) {
            const unsubscribe = deepSubscribeRule(this, receiveValue, true, rule);

            this._setUnsubscriber(name, unsubscribe);
          }
        });
        setVal = set;
        return initValue;
      }

    }, initValue);
  }

}
export function connectorClass(build, baseClass) {
  class NewConnector extends (baseClass || Connector) {}

  build(new ConnectorBuilder(NewConnector.prototype, b => b.propertyName('connectorSource')));
  return NewConnector;
}
export function connectorFactory(build, baseClass) {
  const NewConnector = connectorClass(build, baseClass);
  return source => new NewConnector(source);
} // const builder = new ConnectorBuilder(true as any)
//
// export function connect<TObject extends ObservableObject, TValue = any>(
// 	options?: IConnectFieldOptions<TObject, TValue>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.connect(propertyKey, options, initValue)
// 	}
// }
// class Class1 extends ObservableObject {
// }
// class Class extends Class1 {
// 	@connect()
// 	public prop: number
// }