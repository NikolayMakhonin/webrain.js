"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.propertyClass = propertyClass;
exports.calcPropertyClassX = calcPropertyClassX;
exports.calcPropertyClass = calcPropertyClass;
exports.calcPropertyFactory = calcPropertyFactory;
exports.calcPropertyFactoryX = calcPropertyFactoryX;
exports.CalcPropertyClass = exports.PropertyClass = exports.CalcObjectBuilder = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _valueProperty = require("../../../helpers/value-property");

var _depend = require("../../../rx/depend/core/depend");

var _helpers = require("../helpers");

var _ObservableClass3 = require("../ObservableClass");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _ConnectorBuilder2 = require("./ConnectorBuilder");

var _helpers2 = require("./helpers");

var _builder = require("./path/builder");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

function createGetValue(calcSourcePath, getValue) {
  if (calcSourcePath == null) {
    return getValue;
  } else {
    var path = calcSourcePath.clone().append(function (o) {
      return getValue.call(o);
    }).init();
    return function () {
      return path.get(this);
    };
  }
}

var CalcObjectBuilder = /*#__PURE__*/function (_ConnectorBuilder) {
  (0, _inherits2.default)(CalcObjectBuilder, _ConnectorBuilder);

  var _super = _createSuper(CalcObjectBuilder);

  function CalcObjectBuilder(object, connectorSourcePath, calcSourcePath) {
    var _this;

    (0, _classCallCheck2.default)(this, CalcObjectBuilder);
    _this = _super.call(this, object, connectorSourcePath);
    _this.calcSourcePath = calcSourcePath;
    return _this;
  } // @ts-ignore


  (0, _createClass2.default)(CalcObjectBuilder, [{
    key: "func",
    value: function func(name, _func) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(CalcObjectBuilder.prototype), "func", this).call(this, name, _func);
    } // @ts-ignore

  }, {
    key: "writable",
    value: function writable(name, options, initValue) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(CalcObjectBuilder.prototype), "writable", this).call(this, name, options, initValue);
    } // @ts-ignore

  }, {
    key: "readable",
    value: function readable(name, options, initValue) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(CalcObjectBuilder.prototype), "readable", this).call(this, name, options, initValue);
    }
  }, {
    key: "calcSimple",
    value: function calcSimple(name, func) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(CalcObjectBuilder.prototype), "readable", this).call(this, name, {
        getValue: createGetValue(this.calcSourcePath, func)
      });
    }
  }, {
    key: "calc",
    value: function calc(name, func, deferredOptions) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(CalcObjectBuilder.prototype), "readable", this).call(this, name, {
        getValue: (0, _depend.depend)(createGetValue(this.calcSourcePath, func), deferredOptions, (0, _helpers.makeDependPropertySubscriber)(name))
      });
    }
  }, {
    key: "calcX",
    value: function calcX(name, func, deferredOptions) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(CalcObjectBuilder.prototype), "readable", this).call(this, name, {
        getValue: (0, _depend.dependX)(func, deferredOptions, (0, _helpers.makeDependPropertySubscriber)(name))
      });
    }
  }, {
    key: "nested",
    value: function nested(name, build) {
      var propClass = propertyClass(build);
      return (0, _get2.default)((0, _getPrototypeOf2.default)(CalcObjectBuilder.prototype), "readable", this).call(this, name, {
        factory: function factory() {
          return new propClass(this);
        }
      });
    }
  }, {
    key: "nestedCalc",
    value: function nestedCalc(name, inputOrFactory, calcFactory) {
      // & { object: { readonly [newProp in Name]: TObject[Name] } } {
      return this.readable(name, {
        factory: function factory() {
          var input;

          if (typeof inputOrFactory !== 'undefined') {
            input = typeof inputOrFactory === 'function' ? inputOrFactory(this, name != null ? name : this.constructor.name) : inputOrFactory;
          }

          return calcFactory(input, this.constructor.name + "." + name);
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

  }]);
  return CalcObjectBuilder;
}(_ConnectorBuilder2.ConnectorBuilder); // region PropertyClass


exports.CalcObjectBuilder = CalcObjectBuilder;

var PropertyClass = /*#__PURE__*/function (_ObservableClass) {
  (0, _inherits2.default)(PropertyClass, _ObservableClass);

  var _super2 = _createSuper(PropertyClass);

  /** @internal */
  function PropertyClass(object) {
    var _this2;

    (0, _classCallCheck2.default)(this, PropertyClass);
    _this2 = _super2.call(this);
    (0, _assertThisInitialized2.default)(_this2).$object = object;
    return _this2;
  }

  return PropertyClass;
}(_ObservableClass3.ObservableClass);

exports.PropertyClass = PropertyClass;
new _ObservableObjectBuilder.ObservableObjectBuilder(PropertyClass.prototype).writable('$object', {
  hidden: true
});

function propertyClass(build, baseClass) {
  var objectPath = new _builder.Path().f(function (o) {
    return o.$object;
  }).init();
  return (0, _helpers2.observableClass)(function (object) {
    return build(new CalcObjectBuilder(object, objectPath)).object;
  }, baseClass != null ? baseClass : PropertyClass);
} // endregion
// region CalcPropertyClass


var CalcPropertyClass = /*#__PURE__*/function (_ObservableClass2) {
  (0, _inherits2.default)(CalcPropertyClass, _ObservableClass2);

  var _super3 = _createSuper(CalcPropertyClass);

  function CalcPropertyClass(input, name) {
    var _this3;

    (0, _classCallCheck2.default)(this, CalcPropertyClass);
    _this3 = _super3.call(this);
    _this3.input = input;
    _this3.name = name;
    return _this3;
  }

  return CalcPropertyClass;
}(_ObservableClass3.ObservableClass);

exports.CalcPropertyClass = CalcPropertyClass;
new _ObservableObjectBuilder.ObservableObjectBuilder(CalcPropertyClass.prototype).writable('input');

function calcPropertyClassX(func, deferredOptions, baseClass) {
  // const inputPath = Path.build<TBaseClass>()(o => o.input)()
  return (0, _helpers2.observableClass)(function (object) {
    return new CalcObjectBuilder(object) // , inputPath, inputPath)
    .calcX(_valueProperty.VALUE_PROPERTY_DEFAULT, func, deferredOptions).object;
  }, baseClass != null ? baseClass : CalcPropertyClass);
}

function calcPropertyClass(func, deferredOptions, baseClass) {
  var inputPath = new _builder.Path().fv(function (o) {
    return o.input;
  }).init();
  return (0, _helpers2.observableClass)(function (object) {
    return new CalcObjectBuilder(object, inputPath, inputPath).calc(_valueProperty.VALUE_PROPERTY_DEFAULT, func, deferredOptions).object;
  }, baseClass != null ? baseClass : CalcPropertyClass);
}

function calcPropertyFactory(_ref) {
  var name = _ref.name,
      calcFunc = _ref.calcFunc,
      deferredOptions = _ref.deferredOptions;
  var NewProperty = calcPropertyClass(calcFunc, deferredOptions // baseClass,
  );
  return function (input, _name) {
    return new NewProperty(input, _name != null ? _name : name);
  };
}

function calcPropertyFactoryX(_ref2) {
  var name = _ref2.name,
      calcFunc = _ref2.calcFunc,
      deferredOptions = _ref2.deferredOptions;
  var NewProperty = calcPropertyClassX(calcFunc, deferredOptions // baseClass,
  );
  return function (input, _name) {
    return new NewProperty(input, _name != null ? _name : name);
  };
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