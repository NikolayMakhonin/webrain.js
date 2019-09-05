"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _isNan = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/is-nan"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _serializers = require("../../../../../../main/common/extensions/serialization/serializers");

var _SortedList = require("../../../../../../main/common/lists/SortedList");

var _Assert = require("../../../../../../main/common/test/Assert");

var _DeepCloneEqual = require("../../../../../../main/common/test/DeepCloneEqual");

var _helpers = require("../../src/helpers/helpers");

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context2; (0, _forEach.default)(_context2 = ownKeys(source, true)).call(_context2, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context3; (0, _forEach.default)(_context3 = ownKeys(source)).call(_context3, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

var assert = new _Assert.Assert(new _DeepCloneEqual.DeepCloneEqual({
  commonOptions: {},
  equalOptions: {
    noCrossReferences: true,
    equalInnerReferences: true
  }
}));

var assertDeepEqualExt = function assertDeepEqualExt(o1, o2) {
  assert.circularDeepStrictEqual(o1, o2);
  assert.circularDeepStrictEqual(o1, o2, null, {
    equalTypes: true
  });
  assert.circularDeepStrictEqual(o1, o2, null, {
    equalMapSetOrder: true
  });
  assert.circularDeepStrictEqual(o1, o2, null, {
    equalMapSetOrder: true,
    equalTypes: true
  });
};

describe('common > extensions > serialization > serializers', function () {
  // function testSerializer(
  // 	type: TClass,
  // 	constructorProps: string[],
  // 	serializableProps: string[],
  // 	notSerializableProps: string[],
  // ) {
  // 	const obj = new type(constructorProps.map(o => o + '_ctor changed'))
  // 	for (let i = 0; i < constructorProps.length; i++) {
  // 		assert.strictEqual(obj[constructorProps[i]], constructorProps[i] + '_ctor changed')
  // 	}
  //
  // 	const constructorPropsChanged = [...constructorProps]
  //
  // 	for (let i = 0; i < notSerializableProps.length; i++) {
  // 		const ctorIndex = constructorPropsChanged.indexOf(notSerializableProps[i])
  // 		if (ctorIndex >= 0) {
  // 			constructorPropsChanged[ctorIndex] = notSerializableProps[i] + ' changed'
  // 		}
  // 		obj[notSerializableProps[i]] = notSerializableProps[i] + ' changed'
  // 		assert.strictEqual(obj[notSerializableProps[i]], notSerializableProps[i] + ' changed')
  // 	}
  //
  // 	for (let i = 0; i < serializableProps.length; i++) {
  // 		obj[serializableProps[i]] = serializableProps[i] + ' changed'
  // 		assert.strictEqual(obj[serializableProps[i]], serializableProps[i] + ' changed')
  // 	}
  //
  // 	const serialized = ObjectSerializer.default.serialize(obj)
  // 	const result = ObjectSerializer.default.deSerialize(
  // 		serialized,
  // 		() => new type(constructorProps.map(o => o + '_ctor changed 2')),
  // 	)
  //
  // 	for (let i = 0; i < constructorProps.length; i++) {
  // 		if (serializableProps.indexOf(constructorProps[i]) < 0) {
  // 			assert.strictEqual(obj[constructorProps[i]], constructorProps[i] + '_ctor changed 2')
  // 			assert.strictEqual(obj[constructorProps[i]], constructorProps[i] + '_ctor changed 2')
  // 		}
  // 	}
  //
  // 	for (let i = 0; i < notSerializableProps.length; i++) {
  // 		const ctorIndex = constructorPropsChanged.indexOf(notSerializableProps[i])
  // 		if (ctorIndex >= 0) {
  // 			constructorPropsChanged[ctorIndex] = notSerializableProps[i] + ' changed'
  // 		}
  // 		obj[notSerializableProps[i]] = notSerializableProps[i] + ' changed'
  // 		assert.strictEqual(obj[notSerializableProps[i]], notSerializableProps[i] + ' changed')
  // 	}
  //
  // 	delete obj.prop1
  //
  // 	assert.notStrictEqual(result, obj)
  // 	assert.deepStrictEqual(result, obj)
  // }
  var serializeValue = _serializers.ObjectSerializer.default.serialize;
  serializeValue = (0, _bind.default)(serializeValue).call(serializeValue, _serializers.ObjectSerializer.default);
  var deSerializeValue = _serializers.ObjectSerializer.default.deSerialize;
  deSerializeValue = (0, _bind.default)(deSerializeValue).call(deSerializeValue, _serializers.ObjectSerializer.default);

  function testComplexObject(options, prepare, log) {
    var object = (0, _helpers.createComplexObject)(_objectSpread({
      array: true,
      undefined: true
    }, options));
    var checkObject = (0, _helpers.createComplexObject)(_objectSpread({
      array: true
    }, options, {
      undefined: false
    }));

    if (prepare) {
      object = prepare(object);
      checkObject = prepare(checkObject);
    }

    var serialized = serializeValue(object);
    var result = deSerializeValue(serialized);
    assert.notStrictEqual(result, object);

    if (log) {
      console.log(object);
      console.log(result);
    }

    assertDeepEqualExt(result, checkObject);
  }

  it('primitives', function () {
    function testPrimitive(value) {
      assert.strictEqual(deSerializeValue(serializeValue(value)), value);
    }

    testPrimitive(null);
    testPrimitive(undefined);
    testPrimitive(123);
    assert.ok((0, _isNan.default)(deSerializeValue(serializeValue(NaN))));
    testPrimitive(Infinity);
    testPrimitive(true);
    testPrimitive(false);
    testPrimitive('');
    testPrimitive('str');
  }); // const array = []
  //
  // const obj: any = {
  // 	p1: 'p1',
  // 	p2: 123,
  // 	p3: true,
  // 	p4: null,
  // 	p5: undefined,
  // 	p6: new Date(),
  // 	// p7: new CircularClass(array),
  // }
  // obj.p8 = {
  // 	...obj,
  // }
  // // obj.p8.value = obj
  // // obj.p9 = obj
  // obj.p10 = Object.values(obj)

  it('simple circular', function () {
    var array = [];
    var object = new _helpers.CircularClass(array);
    array[0] = object;
    var serialized = serializeValue(object);
    var result = deSerializeValue(serialized);
    assert.notStrictEqual(result, object);
    assert.notStrictEqual(result.array, object.array);
    assertDeepEqualExt(result, object);
  });
  it('Object', function () {
    testComplexObject({});
  });
  it('Array', function () {
    testComplexObject({}, function (o) {
      return o.array;
    });
  });
  it('Map', function () {
    var map = new _map.default();
    var arr = (0, _helpers.createComplexObject)({
      array: true
    }).array;

    for (var i = 1; i < arr.length; i++) {
      map.set(arr[i - 1], arr[i]);
    }

    var serialized = serializeValue(map);
    var result = deSerializeValue(serialized);
    assert.notStrictEqual(result, map);
    assertDeepEqualExt(result, map);
  });
  it('Set', function () {
    var arr = (0, _helpers.createComplexObject)({
      array: true
    }).array;
    var set = new _set.default(arr);
    var serialized = serializeValue(set);
    var result = deSerializeValue(serialized);
    assert.notStrictEqual(result, set);
    assertDeepEqualExt(result, set);
  });
  it('Date', function () {
    var date = new Date();
    var serialized = serializeValue(date);
    var result = deSerializeValue(serialized);
    assert.notStrictEqual(result, date);
    assertDeepEqualExt(result, date);
  });

  var Class1 = function Class1() {
    (0, _classCallCheck2.default)(this, Class1);
  };

  it('Class: Simple', function () {
    var obj1 = new Class1();
    obj1.prop1 = 'p1';
    assert.throws(function () {
      return serializeValue(obj1);
    }, Error);
    var serializer = new _serializers.ObjectSerializer();
    assert.throws(function () {
      return serializer.serialize(obj1);
    }, Error);
    serializer.typeMeta.putType(Class1, {
      uuid: 'Class1 uuid',
      serializer: _serializers.TypeMetaSerializerCollection.default.getMeta(Object).serializer // valueFactory: () => new Class1(),

    });
    assert.throws(function () {
      return serializeValue(obj1);
    }, Error);
    var serialized = serializer.serialize(obj1);
    assert.throws(function () {
      return deSerializeValue(obj1);
    }, Error);
    var result = serializer.deSerialize(serialized);
    assert.notStrictEqual(result, obj1);
    assertDeepEqualExt(result, obj1);
  });

  var Class2 =
  /*#__PURE__*/
  function (_Class) {
    (0, _inherits2.default)(Class2, _Class);

    function Class2(prop2) {
      var _this;

      (0, _classCallCheck2.default)(this, Class2);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Class2).call(this));
      _this.prop3 = 'prop3';
      _this.prop2 = prop2;
      return _this;
    }

    (0, _createClass2.default)(Class2, [{
      key: "serialize",
      value: function serialize(_serialize) {
        return {
          prop3: _serialize(this.prop3)
        };
      }
    }, {
      key: "deSerialize",
      value: function deSerialize(_deSerialize, serializedValue) {
        var _this2 = this;

        _deSerialize(serializedValue.prop3, function (o) {
          _this2.prop3 = o;
        });
      }
    }]);
    return Class2;
  }(Class1);

  Class2.uuid = '3cd346429e194a0d8a57ff526b445100';
  it('Class: Serializable', function () {
    var obj2 = new Class2('p_2');
    obj2.prop1 = 'p1';
    obj2.prop2 = 'p2';
    obj2.prop3 = 'p3';
    assert.throws(function () {
      return serializeValue(obj2);
    }, Error);
    (0, _serializers.registerSerializable)(Class2, {
      valueFactory: function valueFactory() {
        return new Class2('prop2');
      }
    });
    var serialized = serializeValue(obj2);
    var result = deSerializeValue(serialized, {
      valueFactory: function valueFactory() {
        return new Class2('p2');
      }
    });
    delete obj2.prop1;
    assert.notStrictEqual(result, obj2);
    assertDeepEqualExt(result, obj2);
  });

  var Class3 =
  /*#__PURE__*/
  function (_Class2) {
    (0, _inherits2.default)(Class3, _Class2);

    function Class3(prop2) {
      (0, _classCallCheck2.default)(this, Class3);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Class3).call(this, prop2));
    }

    (0, _createClass2.default)(Class3, [{
      key: "serialize",
      value: function serialize(_serialize2) {
        return _objectSpread({}, (0, _get2.default)((0, _getPrototypeOf2.default)(Class3.prototype), "serialize", this).call(this, _serialize2), {
          prop4: _serialize2(this.prop4)
        });
      }
    }, {
      key: "deSerialize",
      value:
      /*#__PURE__*/
      _regenerator.default.mark(function deSerialize(_deSerialize2, serializedValue) {
        return _regenerator.default.wrap(function deSerialize$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, _get2.default)((0, _getPrototypeOf2.default)(Class3.prototype), "deSerialize", this).call(this, _deSerialize2, serializedValue);
                _context.next = 3;
                return _deSerialize2(serializedValue.prop4);

              case 3:
                this.prop4 = _context.sent;

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, deSerialize, this);
      })
    }]);
    return Class3;
  }(Class2);

  Class3.uuid = 'c2a26bc91cc542499f10f8e087fd6a1b';
  it('Class: Serializable inherit', function () {
    var obj3 = new Class3('prop2');
    obj3.prop1 = 'p1';
    obj3.prop2 = 'p2';
    obj3.prop3 = 'p3';
    obj3.prop4 = 'p4';
    assert.throws(function () {
      return serializeValue(obj3);
    }, Error);
    (0, _serializers.registerSerializable)(Class3, {
      valueFactory: function valueFactory() {
        return new Class3('prop2');
      }
    });
    var serialized = serializeValue(obj3);
    var result = deSerializeValue(serialized);
    delete obj3.prop1;
    obj3.prop2 = 'prop2';
    assert.notStrictEqual(result, obj3);
    assertDeepEqualExt(result, obj3);
  });
  it('SortedList circular', function () {
    var sortedList = new _SortedList.SortedList();
    sortedList.add(sortedList);
    var serialized = serializeValue(sortedList);
    var result = deSerializeValue(serialized);
    assert.notStrictEqual(result, sortedList);
    console.log(sortedList);
    console.log(result);
    assertDeepEqualExt(result, sortedList);
  });
  it('complex object', function () {
    testComplexObject({
      circular: true,
      circularClass: true,
      sortedList: true,
      set: true,
      arraySet: true,
      objectSet: true,
      observableSet: true,
      map: true,
      arrayMap: true,
      objectMap: true,
      observableMap: true
    }, null, false);
  });
});