import _typeof from "@babel/runtime/helpers/typeof";

/* eslint-disable guard-for-in */
import { ObservableObject } from '../../../../../../main/common/rx/object/ObservableObject';
import { ObservableObjectBuilder } from '../../../../../../main/common/rx/object/ObservableObjectBuilder';
describe('common > main > rx > observable-object-builder', function () {
  it('enumerate properties', function () {
    var _writable$readable = new ObservableObjectBuilder().writable('writable').readable('readable', null, '1'),
        object = _writable$readable.object;

    assert.deepStrictEqual(Object.keys(object), ['writable', 'readable']);

    for (var key in object) {
      assert.ok(key === 'writable' || key === 'readable', "key = ".concat(key));
    }

    var deepPropertyChanged = object.deepPropertyChanged;
    assert.ok(object.deepPropertyChanged);
    assert.throws(function () {
      return object.deepPropertyChanged = '1';
    }, TypeError);
    Object.defineProperty(object, 'deepPropertyChanged', {
      value: '2'
    });
    assert.strictEqual(object.deepPropertyChanged, '2');
  });
  it('deepPropertyChanged property', function () {
    var _ref = new ObservableObjectBuilder(),
        object = _ref.object;

    assert.ok(object.deepPropertyChanged);
    assert.throws(function () {
      return object.deepPropertyChanged = '1';
    }, TypeError);
    Object.defineProperty(object, 'deepPropertyChanged', {
      value: '2'
    });
    assert.strictEqual(object.deepPropertyChanged, '2');
  });
  it('onDeepPropertyChanged property', function () {
    var _ref2 = new ObservableObjectBuilder(),
        object = _ref2.object;

    assert.ok(object.onDeepPropertyChanged);
    object.onDeepPropertyChanged = '2';
    assert.strictEqual(object.onDeepPropertyChanged, '2');
  });
  it('onDeepPropertyChanged', function () {
    var _ref3 = new ObservableObjectBuilder(),
        object = _ref3.object;

    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    var resultsDeep = [];

    var subscriberDeep = function subscriberDeep(value) {
      resultsDeep.push(value);
    };

    assert.strictEqual(object.onDeepPropertyChanged(), object);
    assert.strictEqual(object.onDeepPropertyChanged([]), object);
    assert.strictEqual(object.onDeepPropertyChanged(['prop']), object);
    var unsubscribe = [];
    assert.strictEqual(_typeof(unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function');
    assert.strictEqual(_typeof(unsubscribe[1] = object.deepPropertyChanged.subscribe(subscriberDeep)), 'function');
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, []);
    assert.strictEqual(object.onDeepPropertyChanged(), object);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, [{}]);
    resultsDeep = [];
    assert.strictEqual(object.onDeepPropertyChanged([]), object);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, []);
    assert.strictEqual(object.onDeepPropertyChanged(null), object);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, []);
    assert.strictEqual(object.onDeepPropertyChanged([null]), object);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, []);
    assert.strictEqual(object.onDeepPropertyChanged(''), object);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, [{
      name: '',
      newValue: undefined,
      oldValue: undefined
    }]);
    resultsDeep = [];
    assert.strictEqual(object.onDeepPropertyChanged('', '', ['', '', ['']]), object);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, [{
      name: '',
      newValue: undefined,
      oldValue: undefined
    }]);
    resultsDeep = [];
    object[4] = null;
    object[1] = 11;
    object['z'] = 'zz';
    assert.strictEqual(object.onDeepPropertyChanged([[2, 'z', ['a', '1', [4]]]]), object);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, [{
      name: 2,
      newValue: undefined,
      oldValue: undefined
    }, {
      name: 'z',
      newValue: 'zz',
      oldValue: 'zz'
    }, {
      name: 'a',
      newValue: undefined,
      oldValue: undefined
    }, {
      name: '1',
      newValue: 11,
      oldValue: 11
    }, {
      name: 4,
      newValue: null,
      oldValue: null
    }]);
    resultsDeep = [];
  });
  it('propertyChanged property', function () {
    var _ref4 = new ObservableObjectBuilder(),
        object = _ref4.object;

    assert.ok(object.propertyChanged);
    assert.throws(function () {
      return object.propertyChanged = '1';
    }, TypeError);
    Object.defineProperty(object, 'propertyChanged', {
      value: '2'
    });
    assert.strictEqual(object.propertyChanged, '2');
  });
  it('onPropertyChanged property', function () {
    var _ref5 = new ObservableObjectBuilder(),
        object = _ref5.object;

    assert.ok(object.onPropertyChanged);
    object.onPropertyChanged = '2';
    assert.strictEqual(object.onPropertyChanged, '2');
  });
  it('onPropertyChanged', function () {
    var _ref6 = new ObservableObjectBuilder(),
        object = _ref6.object;

    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    var resultsDeep = [];

    var subscriberDeep = function subscriberDeep(value) {
      resultsDeep.push(value);
    };

    assert.strictEqual(object.onPropertyChanged(), object);
    assert.strictEqual(object.onPropertyChanged([]), object);
    assert.strictEqual(object.onPropertyChanged(['prop']), object);
    var unsubscribe = [];
    assert.strictEqual(_typeof(unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function');
    assert.strictEqual(_typeof(unsubscribe[1] = object.deepPropertyChanged.subscribe(subscriberDeep)), 'function');
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, []);
    assert.strictEqual(object.onPropertyChanged(), object);
    assert.deepStrictEqual(resultsDeep, [{}]);
    assert.deepStrictEqual(results, resultsDeep);
    results = [];
    resultsDeep = [];
    assert.strictEqual(object.onPropertyChanged([]), object);
    assert.deepStrictEqual(resultsDeep, []);
    assert.deepStrictEqual(results, resultsDeep);
    assert.strictEqual(object.onPropertyChanged(null), object);
    assert.deepStrictEqual(resultsDeep, []);
    assert.deepStrictEqual(results, resultsDeep);
    assert.strictEqual(object.onPropertyChanged([null]), object);
    assert.deepStrictEqual(resultsDeep, []);
    assert.deepStrictEqual(results, resultsDeep);
    assert.strictEqual(object.onPropertyChanged(''), object);
    assert.deepStrictEqual(resultsDeep, [{
      name: '',
      newValue: undefined,
      oldValue: undefined
    }]);
    assert.deepStrictEqual(results, resultsDeep);
    results = [];
    resultsDeep = [];
    assert.strictEqual(object.onPropertyChanged('', '', ['', '', ['']]), object);
    assert.deepStrictEqual(resultsDeep, [{
      name: '',
      newValue: undefined,
      oldValue: undefined
    }]);
    assert.deepStrictEqual(results, resultsDeep);
    results = [];
    resultsDeep = [];
    object[4] = null;
    object[1] = 11;
    object['z'] = 'zz';
    assert.strictEqual(object.onPropertyChanged([[2, 'z', ['a', '1', [4]]]]), object);
    assert.deepStrictEqual(resultsDeep, [{
      name: 2,
      newValue: undefined,
      oldValue: undefined
    }, {
      name: 'z',
      newValue: 'zz',
      oldValue: 'zz'
    }, {
      name: 'a',
      newValue: undefined,
      oldValue: undefined
    }, {
      name: '1',
      newValue: 11,
      oldValue: 11
    }, {
      name: 4,
      newValue: null,
      oldValue: null
    }]);
    assert.deepStrictEqual(results, resultsDeep);
    results = [];
    resultsDeep = [];
  });
  it('readable simple', function () {
    var _ref7 = new ObservableObjectBuilder(),
        object = _ref7.object;

    assert.ok(object instanceof ObservableObject);
    var builder = new ObservableObjectBuilder(object);
    assert.strictEqual(builder.object, object);
    assert.strictEqual(builder.readable('prop'), builder);
    assert.strictEqual(builder.object['prop'], undefined);
    assert.strictEqual(builder.readable('prop', null, '1'), builder);
    assert.strictEqual(builder.object['prop'], '1');
    assert.strictEqual(builder.readable('prop'), builder);
    assert.strictEqual(builder.object['prop'], '1');
    assert.strictEqual(builder.readable('prop', null, undefined), builder);
    assert.strictEqual(builder.object['prop'], '1');
    assert.strictEqual(builder.readable('prop', null, null), builder);
    assert.strictEqual(builder.object['prop'], null);
    assert.throws(function () {
      return builder.object['prop'] = '2';
    }, TypeError);
    assert.strictEqual(builder.object['prop'], null);
    assert.strictEqual(builder.object, object);
  });
  it('readable factory', function () {
    var _ref8 = new ObservableObjectBuilder(),
        object = _ref8.object;

    assert.ok(object instanceof ObservableObject);
    var builder = new ObservableObjectBuilder(object);
    assert.strictEqual(builder.object, object);
    assert.strictEqual(builder.readable('prop'), builder);
    assert.strictEqual(builder.object['prop'], undefined);
    var valueCreated = false;
    assert.strictEqual(builder.readable('prop', {
      factory: function factory() {
        valueCreated = true;
        return '2';
      }
    }), builder);
    assert.strictEqual(valueCreated, false);
    assert.strictEqual(builder.object['prop'], '2');
    assert.strictEqual(valueCreated, true);
  });
  it('writable simple', function () {
    var _ref9 = new ObservableObjectBuilder(),
        object = _ref9.object;

    assert.ok(object instanceof ObservableObject);
    var builder = new ObservableObjectBuilder(object);
    assert.strictEqual(builder.object, object);
    assert.strictEqual(builder.writable('prop'), builder);
    assert.strictEqual(builder.object['prop'], undefined);
    assert.strictEqual(builder.writable('prop', null, '1'), builder);
    assert.strictEqual(builder.object['prop'], '1');
    assert.strictEqual(builder.readable('prop'), builder);
    assert.strictEqual(builder.object['prop'], '1');
    assert.strictEqual(builder.writable('prop', null, undefined), builder);
    assert.strictEqual(builder.object['prop'], '1');
    assert.strictEqual(builder.writable('prop', null, null), builder);
    assert.strictEqual(builder.object['prop'], null);
    builder.object['prop'] = '2';
    assert.strictEqual(builder.object['prop'], '2');
    assert.strictEqual(builder.object, object);
  });
  it('readable simple changed', function () {
    var builder = new ObservableObjectBuilder();
    var object = builder.object;
    var hasSubscribers = [];

    var hasSubscribersSubscriber = function hasSubscribersSubscriber(value) {
      hasSubscribers.push(value);
    };

    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    var hasSubscribersUnsubscribe = [];
    assert.strictEqual(_typeof(hasSubscribersUnsubscribe[0] = object.deepPropertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');
    assert.deepStrictEqual(hasSubscribers, [false]);
    hasSubscribers = [];
    var unsubscribe = [];
    assert.strictEqual(_typeof(unsubscribe[0] = object.deepPropertyChanged.subscribe(subscriber)), 'function');
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(hasSubscribers, [true]);
    hasSubscribers = [];
    assert.strictEqual(builder.readable('prop'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(object['prop'], undefined);
    assert.strictEqual(builder.readable('prop', null, undefined), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(object['prop'], undefined);
    assert.strictEqual(builder.readable('prop', null, null), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      newValue: null,
      oldValue: undefined
    }]);
    results = [];
    assert.strictEqual(object['prop'], null);
    assert.strictEqual(builder.readable('prop', null, '1'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      newValue: '1',
      oldValue: null
    }]);
    results = [];
    assert.strictEqual(object['prop'], '1');
    var valueCreated = false;
    assert.strictEqual(builder.readable('prop', {
      factory: function factory() {
        assert.strictEqual(this, builder.object);
        valueCreated = true;
        return '1';
      }
    }), builder);
    assert.strictEqual(valueCreated, false);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      newValue: '1',
      oldValue: '1'
    }]);
    results = [];
    assert.strictEqual(valueCreated, true);
    assert.strictEqual(object['prop'], '1');
    assert.strictEqual(builder.readable('prop', null, 1), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      newValue: 1,
      oldValue: '1'
    }]);
    results = [];
    assert.strictEqual(object['prop'], 1);
    assert.throws(function () {
      return builder.object['prop'] = '2';
    }, TypeError);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    results = [];
    assert.strictEqual(object['prop'], 1);
    assert.throws(function () {
      return builder.object['prop'] = 2;
    }, TypeError);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    results = [];
    assert.strictEqual(object['prop'], 1);
  });
  it('writable simple changed', function () {
    var builder = new ObservableObjectBuilder();
    var object = builder.object;
    var hasSubscribers = [];

    var hasSubscribersSubscriber = function hasSubscribersSubscriber(value) {
      hasSubscribers.push(value);
    };

    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    var hasSubscribersUnsubscribe = [];
    assert.strictEqual(_typeof(hasSubscribersUnsubscribe[0] = object.deepPropertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');
    assert.deepStrictEqual(hasSubscribers, [false]);
    hasSubscribers = [];
    var unsubscribe = [];
    assert.strictEqual(_typeof(unsubscribe[0] = object.deepPropertyChanged.subscribe(subscriber)), 'function');
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(hasSubscribers, [true]);
    hasSubscribers = [];
    assert.strictEqual(builder.writable('prop'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(object['prop'], undefined);
    assert.strictEqual(builder.writable('prop', null, undefined), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(object['prop'], undefined);
    assert.strictEqual(builder.writable('prop', null, null), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      newValue: null,
      oldValue: undefined
    }]);
    results = [];
    assert.strictEqual(object['prop'], null);
    assert.strictEqual(builder.writable('prop', null, '1'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      newValue: '1',
      oldValue: null
    }]);
    results = [];
    assert.strictEqual(object['prop'], '1');
    assert.strictEqual(builder.writable('prop', null, '1'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(object['prop'], '1');
    assert.strictEqual(builder.writable('prop', null, 1), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      newValue: 1,
      oldValue: '1'
    }]);
    results = [];
    assert.strictEqual(object['prop'], 1);
    object['prop'] = '2';
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      newValue: '2',
      oldValue: 1
    }]);
    results = [];
    assert.strictEqual(object['prop'], '2');
    object['prop'] = '2';
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(object['prop'], '2');
    object['prop'] = 2;
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      newValue: 2,
      oldValue: '2'
    }]);
    results = [];
    assert.strictEqual(object['prop'], 2);
  });
  it('readable nested changed', function () {
    var builder = new ObservableObjectBuilder();
    var object = builder.object;
    var builderNested = new ObservableObjectBuilder();
    var objectNested = builderNested.object;
    var hasSubscribers = [];

    var hasSubscribersSubscriber = function hasSubscribersSubscriber(value) {
      hasSubscribers.push(value);
    };

    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    var hasSubscribersUnsubscribe = [];
    assert.strictEqual(_typeof(hasSubscribersUnsubscribe[0] = object.deepPropertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');
    assert.deepStrictEqual(hasSubscribers, [false]);
    hasSubscribers = [];
    var unsubscribe = [];
    assert.strictEqual(_typeof(unsubscribe[0] = object.deepPropertyChanged.subscribe(subscriber)), 'function');
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(hasSubscribers, [true]);
    hasSubscribers = [];
    assert.strictEqual(builder.readable('prop', null, objectNested), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      newValue: objectNested,
      oldValue: undefined
    }]);
    results = [];
    assert.strictEqual(object['prop'], objectNested);
    objectNested['prop'] = '1';
    assert.strictEqual(builderNested.readable('prop', null, '1'), builderNested);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(objectNested['prop'], '1');
    assert.strictEqual(object['prop'], objectNested);
    assert.strictEqual(builderNested.readable('prop', null, '2'), builderNested);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      next: {
        name: 'prop',
        newValue: '2',
        oldValue: '1'
      }
    }]);
    results = [];
    assert.strictEqual(objectNested['prop'], '2');
    assert.strictEqual(object['prop'], objectNested);
    assert.throws(function () {
      return object['prop'] = new ObservableObjectBuilder().object;
    }, TypeError);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.throws(function () {
      return objectNested['prop'] = '3';
    }, TypeError);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(builderNested.readable('prop', null, '4'), builderNested);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      next: {
        name: 'prop',
        newValue: '4',
        oldValue: '2'
      }
    }]);
    results = [];
    assert.strictEqual(builder.delete('prop'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      oldValue: {
        prop: '4'
      }
    }]);
    results = [];
    assert.strictEqual(object['prop'], undefined);
    assert.strictEqual(builder.delete('prop'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(builderNested.readable('prop', null, '4'), builderNested);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    object['prop'] = objectNested;
    assert.strictEqual(object['prop'], objectNested);
    assert.strictEqual(builder.readable('prop', null, objectNested), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(object['prop'], objectNested);
    delete object['prop'];
    assert.strictEqual(object['prop'], undefined);
    object['prop'] = objectNested;
    assert.strictEqual(object['prop'], objectNested);
    assert.strictEqual(builder.readable('prop', null, objectNested), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(object['prop'], objectNested);
    assert.strictEqual(builderNested.readable('prop', null, '5'), builderNested);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, [{
      name: 'prop',
      next: {
        name: 'prop',
        newValue: '5',
        oldValue: '4'
      }
    }]);
  });
  it('writable nested changed', function () {
    var builder = new ObservableObjectBuilder();
    var object = builder.object;
    var builderNested = new ObservableObjectBuilder();
    var objectNested = builderNested.object;
    var hasSubscribers = [];

    var hasSubscribersSubscriber = function hasSubscribersSubscriber(value) {
      hasSubscribers.push(value);
    };

    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    var resultsDeep = [];

    var subscriberDeep = function subscriberDeep(value) {
      resultsDeep.push(value);
    };

    var hasSubscribersUnsubscribe = [];
    assert.strictEqual(_typeof(hasSubscribersUnsubscribe[0] = object.deepPropertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');
    assert.deepStrictEqual(hasSubscribers, [false]);
    hasSubscribers = [];
    var unsubscribe = [];
    assert.strictEqual(_typeof(unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function');
    assert.strictEqual(_typeof(unsubscribe[1] = object.deepPropertyChanged.subscribe(subscriberDeep)), 'function');
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, []);
    assert.deepStrictEqual(hasSubscribers, [true]);
    hasSubscribers = [];
    assert.strictEqual(builder.writable('prop', null, objectNested), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(resultsDeep, [{
      name: 'prop',
      newValue: objectNested,
      oldValue: undefined
    }]);
    assert.deepStrictEqual(results, resultsDeep);
    results = [];
    resultsDeep = [];
    assert.strictEqual(object['prop'], objectNested);
    objectNested['prop'] = '1';
    assert.strictEqual(builderNested.writable('prop', null, '1'), builderNested);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, []);
    assert.strictEqual(objectNested['prop'], '1');
    assert.strictEqual(object['prop'], objectNested);
    assert.strictEqual(builderNested.writable('prop', null, '2'), builderNested);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(resultsDeep, [{
      name: 'prop',
      next: {
        name: 'prop',
        newValue: '2',
        oldValue: '1'
      }
    }]);
    assert.deepStrictEqual(results, []);
    resultsDeep = [];
    assert.strictEqual(objectNested['prop'], '2');
    assert.strictEqual(object['prop'], objectNested);
    object['prop'] = new ObservableObjectBuilder().object;
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(resultsDeep, [{
      name: 'prop',
      newValue: {},
      oldValue: {
        prop: '2'
      }
    }]);
    assert.deepStrictEqual(results, resultsDeep);
    results = [];
    resultsDeep = [];
    objectNested['prop'] = '3';
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, []);
    object['prop'] = objectNested;
    assert.deepStrictEqual(resultsDeep, [{
      name: 'prop',
      newValue: {
        prop: '3'
      },
      oldValue: {}
    }]);
    assert.deepStrictEqual(results, resultsDeep);
    results = [];
    resultsDeep = [];
    objectNested['prop'] = '4';
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(resultsDeep, [{
      name: 'prop',
      next: {
        name: 'prop',
        newValue: '4',
        oldValue: '3'
      }
    }]);
    assert.deepStrictEqual(results, []);
    resultsDeep = [];
    assert.strictEqual(builder.delete('prop'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(resultsDeep, [{
      name: 'prop',
      oldValue: {
        prop: '4'
      }
    }]);
    assert.deepStrictEqual(results, resultsDeep);
    results = [];
    resultsDeep = [];
    assert.strictEqual(object['prop'], undefined);
    assert.strictEqual(builder.delete('prop'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, []);
    objectNested['prop'] = '4';
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, []);
    object['prop'] = objectNested;
    assert.strictEqual(object['prop'], objectNested);
    assert.strictEqual(builder.writable('prop', null, objectNested), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, []);
    assert.strictEqual(object['prop'], objectNested);
    delete object['prop'];
    assert.strictEqual(object['prop'], undefined);
    object['prop'] = objectNested;
    assert.strictEqual(object['prop'], objectNested);
    assert.strictEqual(builder.writable('prop', null, objectNested), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(results, []);
    assert.deepStrictEqual(resultsDeep, []);
    assert.strictEqual(object['prop'], objectNested);
    objectNested['prop'] = '5';
    assert.deepStrictEqual(hasSubscribers, []);
    assert.deepStrictEqual(resultsDeep, [{
      name: 'prop',
      next: {
        name: 'prop',
        newValue: '5',
        oldValue: '4'
      }
    }]);
    assert.deepStrictEqual(results, []);
    resultsDeep = [];
  });
});