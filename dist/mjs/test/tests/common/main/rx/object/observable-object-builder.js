import _typeof from "@babel/runtime/helpers/typeof";

/* eslint-disable guard-for-in */
import { ObservableObject } from '../../../../../../main/common/rx/object/ObservableObject';
import { ObservableObjectBuilder } from '../../../../../../main/common/rx/object/ObservableObjectBuilder';
describe('common > main > rx > observable-object-builder', function () {
  function assertEvents(events, check) {
    events = events && events.map(function (o) {
      var result = {};

      if ('name' in o) {
        result.name = o.name;
      }

      if ('oldValue' in o) {
        result.oldValue = o.oldValue;
      }

      if ('newValue' in o) {
        result.newValue = o.newValue;
      }

      return result;
    });
    assert.deepStrictEqual(events, check);
  }

  it('enumerate properties', function () {
    var _writable$readable = new ObservableObjectBuilder().writable('writable').readable('readable', null, '1'),
        object = _writable$readable.object;

    assert.deepStrictEqual(Object.keys(object), ['writable', 'readable']); // tslint:disable-next-line:forin

    for (var key in object) {
      assert.ok(key === 'writable' || key === 'readable', "key = ".concat(key));
    }

    assert.ok(object.propertyChanged);
    assert["throws"](function () {
      return object.propertyChanged = '1';
    }, TypeError);
    Object.defineProperty(object, 'propertyChanged', {
      value: '2'
    });
    assert.strictEqual(object.propertyChanged, '2');
  });
  it('propertyChanged property', function () {
    var _ref = new ObservableObjectBuilder(),
        object = _ref.object;

    assert.ok(object.propertyChanged);
    assert["throws"](function () {
      return object.propertyChanged = '1';
    }, TypeError);
    Object.defineProperty(object, 'propertyChanged', {
      value: '2'
    });
    assert.strictEqual(object.propertyChanged, '2');
  });
  it('onPropertyChanged', function () {
    var _ref2 = new ObservableObjectBuilder(),
        object = _ref2.object;

    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    assert.ok(object.propertyChanged);
    assert.notOk(object.propertyChangedIfCanEmit);
    assert.strictEqual(object.propertyChanged.onPropertyChanged(), object.propertyChanged);
    assert.strictEqual(object.propertyChanged.onPropertyChanged('prop'), object.propertyChanged);
    var unsubscribe = [];
    assert.strictEqual(_typeof(unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function');
    assertEvents(results, []);
    assert.ok(object.propertyChangedIfCanEmit);
    assert.strictEqual(object.propertyChangedIfCanEmit.onPropertyChanged(), object.propertyChangedIfCanEmit);
    assertEvents(results, []);
    assert.strictEqual(object.propertyChangedIfCanEmit.onPropertyChanged(null), object.propertyChangedIfCanEmit);
    assertEvents(results, [{}]);
    results = [];
    assert.strictEqual(object.propertyChangedIfCanEmit.onPropertyChanged(''), object.propertyChangedIfCanEmit);
    assertEvents(results, [{
      name: '',
      newValue: undefined,
      oldValue: undefined
    }]);
    results = []; // assert.strictEqual(object.propertyChangedIfCanEmit
    // 	.onPropertyChanged('', '', '', '', ''), object.propertyChangedIfCanEmit)
    // assertEvents(results, [
    // 	{
    // 		name    : '',
    // 		newValue: undefined,
    // 		oldValue: undefined
    // 	}
    // ])
    // results = []

    object[4] = null;
    object[1] = 11;
    object.z = 'zz';
    assert.strictEqual(object.propertyChangedIfCanEmit.onPropertyChanged(2, 'z', 'a', '1', 4), object.propertyChangedIfCanEmit);
    assertEvents(results, [{
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
    results = [];
  });
  it('readable simple', function () {
    var _ref3 = new ObservableObjectBuilder(),
        object = _ref3.object;

    assert.ok(object instanceof ObservableObject);
    var builder = new ObservableObjectBuilder(object);
    assert.strictEqual(builder.object, object);
    assert.strictEqual(builder.readable('prop'), builder);
    assert.strictEqual(builder.object.prop, undefined);
    assert.strictEqual(builder.readable('prop', null, '1'), builder);
    assert.strictEqual(builder.object.prop, '1');
    assert.strictEqual(builder.readable('prop'), builder);
    assert.strictEqual(builder.object.prop, '1');
    assert.strictEqual(builder.readable('prop', null, undefined), builder);
    assert.strictEqual(builder.object.prop, '1');
    assert.strictEqual(builder.readable('prop', null, null), builder);
    assert.strictEqual(builder.object.prop, null);
    assert["throws"](function () {
      return builder.object.prop = '2';
    }, TypeError);
    assert.strictEqual(builder.object.prop, null);
    assert.strictEqual(builder.object, object);
  });
  it('readable factory', function () {
    var _ref4 = new ObservableObjectBuilder(),
        object = _ref4.object;

    assert.ok(object instanceof ObservableObject);
    var builder = new ObservableObjectBuilder(object);
    assert.strictEqual(builder.object, object);
    assert.strictEqual(builder.readable('prop'), builder);
    assert.strictEqual(builder.object.prop, undefined);
    var valueCreated = false;
    assert.strictEqual(builder.readable('prop', {
      factory: function factory() {
        valueCreated = true;
        return '2';
      }
    }), builder);
    assert.strictEqual(valueCreated, false);
    assert.strictEqual(builder.object.prop, '2');
    assert.strictEqual(valueCreated, true);
  });
  it('writable simple', function () {
    var _ref5 = new ObservableObjectBuilder(),
        object = _ref5.object;

    assert.ok(object instanceof ObservableObject);
    var builder = new ObservableObjectBuilder(object);
    assert.strictEqual(builder.object, object);
    assert.strictEqual(builder.writable('prop'), builder);
    assert.strictEqual(builder.object.prop, undefined);
    assert.strictEqual(builder.writable('prop', null, '1'), builder);
    assert.strictEqual(builder.object.prop, '1');
    assert.strictEqual(builder.readable('prop'), builder);
    assert.strictEqual(builder.object.prop, '1');
    assert.strictEqual(builder.writable('prop', null, undefined), builder);
    assert.strictEqual(builder.object.prop, '1');
    assert.strictEqual(builder.writable('prop', null, null), builder);
    assert.strictEqual(builder.object.prop, null);
    builder.object.prop = '2';
    assert.strictEqual(builder.object.prop, '2');
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
    assert.strictEqual(_typeof(hasSubscribersUnsubscribe[0] = object.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');
    assert.deepStrictEqual(hasSubscribers, [false]);
    hasSubscribers = [];
    var unsubscribe = [];
    assert.strictEqual(_typeof(unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function');
    assertEvents(results, []);
    assert.deepStrictEqual(hasSubscribers, [true]);
    hasSubscribers = [];
    assert.strictEqual(builder.readable('prop'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, []);
    assert.strictEqual(object.prop, undefined);
    assert.strictEqual(builder.readable('prop', null, undefined), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, []);
    assert.strictEqual(object.prop, undefined);
    assert.strictEqual(builder.readable('prop', null, null), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, [{
      name: 'prop',
      newValue: null,
      oldValue: undefined
    }]);
    results = [];
    assert.strictEqual(object.prop, null);
    assert.strictEqual(builder.readable('prop', null, '1'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, [{
      name: 'prop',
      newValue: '1',
      oldValue: null
    }]);
    results = [];
    assert.strictEqual(object.prop, '1');
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
    assertEvents(results, [{
      name: 'prop',
      newValue: '1',
      oldValue: '1'
    }]);
    results = [];
    assert.strictEqual(valueCreated, true);
    assert.strictEqual(object.prop, '1');
    assert.strictEqual(builder.readable('prop', null, 1), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, [{
      name: 'prop',
      newValue: 1,
      oldValue: '1'
    }]);
    results = [];
    assert.strictEqual(object.prop, 1);
    assert["throws"](function () {
      return builder.object.prop = '2';
    }, TypeError);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, []);
    results = [];
    assert.strictEqual(object.prop, 1);
    assert["throws"](function () {
      return builder.object.prop = 2;
    }, TypeError);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, []);
    results = [];
    assert.strictEqual(object.prop, 1);
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
    assert.strictEqual(_typeof(hasSubscribersUnsubscribe[0] = object.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');
    assert.deepStrictEqual(hasSubscribers, [false]);
    hasSubscribers = [];
    var unsubscribe = [];
    assert.strictEqual(_typeof(unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function');
    assertEvents(results, []);
    assert.deepStrictEqual(hasSubscribers, [true]);
    hasSubscribers = [];
    assert.strictEqual(builder.writable('prop'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, []);
    assert.strictEqual(object.prop, undefined);
    assert.strictEqual(builder.writable('prop', null, undefined), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, []);
    assert.strictEqual(object.prop, undefined);
    assert.strictEqual(builder.writable('prop', null, null), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, [{
      name: 'prop',
      newValue: null,
      oldValue: undefined
    }]);
    results = [];
    assert.strictEqual(object.prop, null);
    assert.strictEqual(builder.writable('prop', null, '1'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, [{
      name: 'prop',
      newValue: '1',
      oldValue: null
    }]);
    results = [];
    assert.strictEqual(object.prop, '1');
    assert.strictEqual(builder.writable('prop', null, '1'), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, []);
    assert.strictEqual(object.prop, '1');
    assert.strictEqual(builder.writable('prop', null, 1), builder);
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, [{
      name: 'prop',
      newValue: 1,
      oldValue: '1'
    }]);
    results = [];
    assert.strictEqual(object.prop, 1);
    object.prop = '2';
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, [{
      name: 'prop',
      newValue: '2',
      oldValue: 1
    }]);
    results = [];
    assert.strictEqual(object.prop, '2');
    object.prop = '2';
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, []);
    assert.strictEqual(object.prop, '2');
    object.prop = 2;
    assert.deepStrictEqual(hasSubscribers, []);
    assertEvents(results, [{
      name: 'prop',
      newValue: 2,
      oldValue: '2'
    }]);
    results = [];
    assert.strictEqual(object.prop, 2);
  });
});