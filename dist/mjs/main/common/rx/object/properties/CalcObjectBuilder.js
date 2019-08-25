import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { deepSubscribe } from '../../deep-subscribe/deep-subscribe';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { CalcProperty } from './CalcProperty';
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
    value: function calc(name, input, _ref, initValue) {
      var dependencies = _ref.dependencies,
          calcFunc = _ref.calcFunc,
          calcOptions = _ref.calcOptions,
          valuePropertyOptions = _ref.valuePropertyOptions;
      return this.readable(name, {
        factory: function factory() {
          var property = new CalcProperty(calcFunc, calcOptions, valuePropertyOptions, initValue);
          property.input = typeof input === 'function' ? input(this) : input;

          if (dependencies) {
            deepSubscribe(property, function () {
              property.invalidate();
              return null;
            }, false, function (b) {
              dependencies(b.path(function (o) {
                return o.input;
              }));
              return b;
            });
          }

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