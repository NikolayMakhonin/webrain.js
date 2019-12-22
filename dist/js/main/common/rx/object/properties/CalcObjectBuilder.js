"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.CalcObjectBuilder = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _CalcPropertyBuilder = require("./CalcPropertyBuilder");

var _ConnectorBuilder2 = require("./ConnectorBuilder");

var CalcObjectBuilder =
/*#__PURE__*/
function (_ConnectorBuilder) {
  (0, _inherits2.default)(CalcObjectBuilder, _ConnectorBuilder);

  function CalcObjectBuilder() {
    (0, _classCallCheck2.default)(this, CalcObjectBuilder);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CalcObjectBuilder).apply(this, arguments));
  }

  (0, _createClass2.default)(CalcObjectBuilder, [{
    key: "writable",
    // @ts-ignore
    value: function writable(name, options, initValue) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(CalcObjectBuilder.prototype), "writable", this).call(this, name, options, initValue);
    } // @ts-ignore

  }, {
    key: "readable",
    value: function readable(name, options, initValue) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(CalcObjectBuilder.prototype), "readable", this).call(this, name, options, initValue);
    }
  }, {
    key: "calc",
    value: function calc(name, inputOrFactory, calcFactory, initValue) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(CalcObjectBuilder.prototype), "readable", this).call(this, name, {
        factory: function factory() {
          var property = calcFactory(initValue);

          if (property.state.name == null) {
            property.state.name = this.constructor.name + "." + name;
          }

          return property;
        },
        init: function init(property) {
          if (typeof inputOrFactory !== 'undefined') {
            property.state.input = typeof inputOrFactory === 'function' ? inputOrFactory(this, this.constructor.name) : inputOrFactory;
          }
        }
      });
    }
  }, {
    key: "calcChanges",
    value: function calcChanges(name, buildRule) {
      return this.calc(name, void 0, (0, _CalcPropertyBuilder.calcPropertyFactory)({
        dependencies: function dependencies(_dependencies) {
          return _dependencies.invalidateOn(buildRule);
        },
        calcFunc: function calcFunc(state) {
          state.value++;
        },
        initValue: 0
      }));
    }
  }, {
    key: "calcConnect",
    value: function calcConnect(name, _buildRule, options, initValue) {
      return this.calc(name, (0, _ConnectorBuilder2.connectorFactory)({
        buildRule: function buildRule(c) {
          return c.connect('value', _buildRule);
        }
      }), (0, _CalcPropertyBuilder.calcPropertyFactory)({
        dependencies: function dependencies(d) {
          return d.invalidateOn(function (b) {
            return b.p('value');
          });
        },
        calcFunc: function calcFunc(state) {
          state.value = state.input.value;
        }
      }));
    }
  }]);
  return CalcObjectBuilder;
}(_ConnectorBuilder2.ConnectorBuilder); // const builder = new CalcObjectBuilder(true as any)
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


exports.CalcObjectBuilder = CalcObjectBuilder;