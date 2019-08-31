import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
export var CalcObjectBuilder =
/*#__PURE__*/
function (_ObservableObjectBuil) {
  _inherits(CalcObjectBuilder, _ObservableObjectBuil);

  function CalcObjectBuilder() {
    _classCallCheck(this, CalcObjectBuilder);

    return _possibleConstructorReturn(this, _getPrototypeOf(CalcObjectBuilder).apply(this, arguments));
  }

  _createClass(CalcObjectBuilder, [{
    key: "calc",
    value: function calc(name, inputOrFactory, calcPropertyFactory, initValue) {
      return this.readable(name, {
        factory: function factory() {
          var property = calcPropertyFactory(initValue);
          property.input = typeof inputOrFactory === 'function' ? inputOrFactory(this) : inputOrFactory;
          return property;
        }
      });
    }
  }]);

  return CalcObjectBuilder;
}(ObservableObjectBuilder); // const builder = new CalcObjectBuilder(true as any)
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