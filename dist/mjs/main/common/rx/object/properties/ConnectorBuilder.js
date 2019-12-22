import { createFunction } from '../../../helpers/helpers';
import { Debugger } from '../../Debugger';
import { deepSubscribeRule } from '../../deep-subscribe/deep-subscribe';
import { setObjectValue } from '../../deep-subscribe/helpers/common';
import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { _set, _setExt } from '../ObservableClass';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { Connector } from './Connector';

const buildSourceRule = b => b.p('source');

export class ConnectorBuilder extends ObservableObjectBuilder {
  constructor(object) {
    super(object);
  }

  connect(name, buildRule, options, initValue) {
    return this._connect(false, name, buildRule, options, initValue);
  }

  connectWritable(name, buildRule, options, initValue) {
    return this._connect(true, name, buildRule, options, initValue);
  }

  _connect(writable, name, buildRule, options, initValue) {
    const {
      object
    } = this;
    let ruleBuilder = new RuleBuilder({
      valuePropertyDefaultName: 'last'
    });

    if (object instanceof Connector) {
      ruleBuilder = buildSourceRule(ruleBuilder);
    }

    ruleBuilder = buildRule(ruleBuilder);
    const ruleBase = ruleBuilder && ruleBuilder.result();

    if (ruleBase == null) {
      throw new Error('buildRule() return null or not initialized RuleBuilder');
    }

    const setOptions = options && options.setOptions; // optimization

    const baseGetValue = options && options.getValue || createFunction(() => function () {
      return this.__fields[name];
    }, `return this.__fields["${name}"]`);
    const baseSetValue = options && options.setValue || createFunction(() => function (v) {
      this.__fields[name] = v;
    }, 'v', `this.__fields["${name}"] = v`);
    const getValue = !writable ? baseGetValue : function () {
      return baseGetValue.call(this).value;
    };
    const setValue = !writable ? baseSetValue : function (value) {
      const baseValue = baseGetValue.call(this);
      baseValue.value = value;
    };
    const set = setOptions ? _setExt.bind(null, name, getValue, setValue, setOptions) : _set.bind(null, name, getValue, setValue);
    return this.updatable(name, {
      setOptions,
      hidden: options && options.hidden,

      // tslint:disable-next-line:no-shadowed-variable
      factory(initValue) {
        if (writable) {
          baseSetValue.call(this, {
            value: initValue,
            parent: null,
            key: null,
            keyType: null
          });
        }

        let setVal = (obj, value) => {
          if (typeof value !== 'undefined') {
            initValue = value;
          }
        };

        const receiveValue = writable ? (value, parent, key, keyType) => {
          Debugger.Instance.onConnectorChanged(this, name, value, parent, key, keyType);
          const baseValue = baseGetValue.call(this);
          baseValue.parent = parent;
          baseValue.key = key;
          baseValue.keyType = keyType;
          setVal(this, value);
          return null;
        } : (value, parent, key, keyType) => {
          Debugger.Instance.onConnectorChanged(this, name, value, parent, key, keyType);
          setVal(this, value);
          return null;
        };
        const rule = this === object ? ruleBase : ruleBase.clone();
        this.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribers => {
          this._setUnsubscriber(name, null);

          if (hasSubscribers) {
            const unsubscribe = deepSubscribeRule({
              object: this instanceof Connector ? this.connectorState : this,
              lastValue: receiveValue,
              debugTarget: this,
              rule
            });

            if (unsubscribe) {
              this._setUnsubscriber(name, unsubscribe);
            }
          }
        }, `Connector.${name}.hasSubscribersObservable for deepSubscribe`);
        setVal = set;
        return initValue;
      },

      update: writable && function (value) {
        const baseValue = baseGetValue.call(this);

        if (baseValue.parent != null) {
          setObjectValue(baseValue.parent, baseValue.key, baseValue.keyType, value);
        } // return value

      },
      getValue,
      setValue
    }, initValue);
  }

}
export function connectorClass({
  buildRule,
  baseClass
}) {
  class NewConnector extends (baseClass || Connector) {}

  buildRule(new ConnectorBuilder(NewConnector.prototype));
  return NewConnector;
}
export function connectorFactory({
  name,
  buildRule,
  baseClass
}) {
  const NewConnector = connectorClass({
    buildRule,
    baseClass
  });
  return (source, sourceName) => new NewConnector(source, name || sourceName);
} // const builder = new ConnectorBuilder(true as any)
//
// export function connect<TObject extends ObservableClass, TValue = any>(
// 	options?: IConnectFieldOptions<TObject, TValue>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.connect(propertyKey, options, initValue)
// 	}
// }
// class Class1 extends ObservableClass {
// }
// class Class extends Class1 {
// 	@connect()
// 	public prop: number
// }