"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _ObservableClass = require("../../../../../../main/common/rx/object/ObservableClass");

var _ObservableObjectBuilder = require("../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _Assert = require("../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../main/common/test/Mocha");

/* eslint-disable guard-for-in */
(0, _Mocha.describe)('common > main > rx > observable-object-builder', function () {
  function assertEvents(events, check) {
    events = events && (0, _map.default)(events).call(events, function (o) {
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

    _Assert.assert.deepStrictEqual(events, check);
  }

  (0, _Mocha.it)('enumerate properties', function () {
    var _writable$readable = new _ObservableObjectBuilder.ObservableObjectBuilder().writable('writable').readable('readable', null, '1'),
        object = _writable$readable.object;

    _Assert.assert.deepStrictEqual((0, _keys.default)(object), ['writable', 'readable']); // tslint:disable-next-line:forin


    for (var key in object) {
      _Assert.assert.ok(key === 'writable' || key === 'readable', "key = " + key);
    }

    _Assert.assert.ok(object.propertyChanged);

    _Assert.assert.throws(function () {
      return object.propertyChanged = '1';
    }, TypeError);

    (0, _defineProperty.default)(object, 'propertyChanged', {
      value: '2'
    });

    _Assert.assert.strictEqual(object.propertyChanged, '2');
  });
  (0, _Mocha.it)('propertyChanged property', function () {
    var _ref = new _ObservableObjectBuilder.ObservableObjectBuilder(),
        object = _ref.object;

    _Assert.assert.ok(object.propertyChanged);

    _Assert.assert.throws(function () {
      return object.propertyChanged = '1';
    }, TypeError);

    (0, _defineProperty.default)(object, 'propertyChanged', {
      value: '2'
    });

    _Assert.assert.strictEqual(object.propertyChanged, '2');
  });
  (0, _Mocha.it)('onPropertyChanged', function () {
    var _ref2 = new _ObservableObjectBuilder.ObservableObjectBuilder(),
        object = _ref2.object;

    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    _Assert.assert.ok(object.propertyChanged);

    _Assert.assert.notOk(object.propertyChangedIfCanEmit);

    _Assert.assert.strictEqual(object.propertyChanged.onPropertyChanged(), object.propertyChanged);

    _Assert.assert.strictEqual(object.propertyChanged.onPropertyChanged('prop'), object.propertyChanged);

    var unsubscribe = [];

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function');

    assertEvents(results, []);

    _Assert.assert.ok(object.propertyChangedIfCanEmit);

    _Assert.assert.strictEqual(object.propertyChangedIfCanEmit.onPropertyChanged(), object.propertyChangedIfCanEmit);

    assertEvents(results, []);

    _Assert.assert.strictEqual(object.propertyChangedIfCanEmit.onPropertyChanged(null), object.propertyChangedIfCanEmit);

    assertEvents(results, [{}]);
    results = [];

    _Assert.assert.strictEqual(object.propertyChangedIfCanEmit.onPropertyChanged(''), object.propertyChangedIfCanEmit);

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

    _Assert.assert.strictEqual(object.propertyChangedIfCanEmit.onPropertyChanged(2, 'z', 'a', '1', 4), object.propertyChangedIfCanEmit);

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
  (0, _Mocha.it)('readable simple', function () {
    var _ref3 = new _ObservableObjectBuilder.ObservableObjectBuilder(),
        object = _ref3.object;

    _Assert.assert.ok(object instanceof _ObservableClass.ObservableClass);

    var builder = new _ObservableObjectBuilder.ObservableObjectBuilder(object);

    _Assert.assert.strictEqual(builder.object, object);

    _Assert.assert.strictEqual(builder.readable('prop'), builder);

    _Assert.assert.strictEqual(builder.object.prop, undefined);

    _Assert.assert.strictEqual(builder.readable('prop', null, '1'), builder);

    _Assert.assert.strictEqual(builder.object.prop, '1');

    _Assert.assert.strictEqual(builder.readable('prop'), builder);

    _Assert.assert.strictEqual(builder.object.prop, '1');

    _Assert.assert.strictEqual(builder.readable('prop', null, undefined), builder);

    _Assert.assert.strictEqual(builder.object.prop, '1');

    _Assert.assert.strictEqual(builder.readable('prop', null, null), builder);

    _Assert.assert.strictEqual(builder.object.prop, null);

    _Assert.assert.throws(function () {
      return builder.object.prop = '2';
    }, TypeError);

    _Assert.assert.strictEqual(builder.object.prop, null);

    _Assert.assert.strictEqual(builder.object, object);
  });
  (0, _Mocha.it)('readable factory', function () {
    var _ref4 = new _ObservableObjectBuilder.ObservableObjectBuilder(),
        object = _ref4.object;

    _Assert.assert.ok(object instanceof _ObservableClass.ObservableClass);

    var builder = new _ObservableObjectBuilder.ObservableObjectBuilder(object);

    _Assert.assert.strictEqual(builder.object, object);

    _Assert.assert.strictEqual(builder.readable('prop'), builder);

    _Assert.assert.strictEqual(builder.object.prop, undefined);

    var valueCreated = false;

    _Assert.assert.strictEqual(builder.readable('prop', {
      factory: function factory() {
        valueCreated = true;
        return '2';
      }
    }), builder);

    _Assert.assert.strictEqual(valueCreated, false);

    _Assert.assert.strictEqual(builder.object.prop, '2');

    _Assert.assert.strictEqual(valueCreated, true);
  });
  (0, _Mocha.it)('writable simple', function () {
    var _ref5 = new _ObservableObjectBuilder.ObservableObjectBuilder(),
        object = _ref5.object;

    _Assert.assert.ok(object instanceof _ObservableClass.ObservableClass);

    var builder = new _ObservableObjectBuilder.ObservableObjectBuilder(object);

    _Assert.assert.strictEqual(builder.object, object);

    _Assert.assert.strictEqual(builder.writable('prop'), builder);

    _Assert.assert.strictEqual(builder.object.prop, undefined);

    _Assert.assert.strictEqual(builder.writable('prop', null, '1'), builder);

    _Assert.assert.strictEqual(builder.object.prop, '1');

    _Assert.assert.strictEqual(builder.readable('prop'), builder);

    _Assert.assert.strictEqual(builder.object.prop, '1');

    _Assert.assert.strictEqual(builder.writable('prop', null, undefined), builder);

    _Assert.assert.strictEqual(builder.object.prop, '1');

    _Assert.assert.strictEqual(builder.writable('prop', null, null), builder);

    _Assert.assert.strictEqual(builder.object.prop, null);

    builder.object.prop = '2';

    _Assert.assert.strictEqual(builder.object.prop, '2');

    _Assert.assert.strictEqual(builder.object, object);
  });
  (0, _Mocha.it)('readable simple changed', function () {
    var builder = new _ObservableObjectBuilder.ObservableObjectBuilder();
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

    _Assert.assert.strictEqual(typeof (hasSubscribersUnsubscribe[0] = object.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');

    _Assert.assert.deepStrictEqual(hasSubscribers, [false]);

    hasSubscribers = [];
    var unsubscribe = [];

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function');

    assertEvents(results, []);

    _Assert.assert.deepStrictEqual(hasSubscribers, [true]);

    hasSubscribers = [];

    _Assert.assert.strictEqual(builder.readable('prop'), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);

    _Assert.assert.strictEqual(object.prop, undefined);

    _Assert.assert.strictEqual(builder.readable('prop', null, undefined), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);

    _Assert.assert.strictEqual(object.prop, undefined);

    _Assert.assert.strictEqual(builder.readable('prop', null, null), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: null,
      oldValue: undefined
    }]);
    results = [];

    _Assert.assert.strictEqual(object.prop, null);

    _Assert.assert.strictEqual(builder.readable('prop', null, '1'), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: '1',
      oldValue: null
    }]);
    results = [];

    _Assert.assert.strictEqual(object.prop, '1');

    var valueCreated = false;

    _Assert.assert.strictEqual(builder.readable('prop', {
      factory: function factory() {
        _Assert.assert.strictEqual(this, builder.object);

        valueCreated = true;
        return '1';
      }
    }), builder);

    _Assert.assert.strictEqual(valueCreated, false);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: '1',
      oldValue: '1'
    }]);
    results = [];

    _Assert.assert.strictEqual(valueCreated, true);

    _Assert.assert.strictEqual(object.prop, '1');

    _Assert.assert.strictEqual(builder.readable('prop', null, 1), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: 1,
      oldValue: '1'
    }]);
    results = [];

    _Assert.assert.strictEqual(object.prop, 1);

    _Assert.assert.throws(function () {
      return builder.object.prop = '2';
    }, TypeError);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);
    results = [];

    _Assert.assert.strictEqual(object.prop, 1);

    _Assert.assert.throws(function () {
      return builder.object.prop = 2;
    }, TypeError);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);
    results = [];

    _Assert.assert.strictEqual(object.prop, 1);
  });
  (0, _Mocha.it)('writable simple changed', function () {
    var builder = new _ObservableObjectBuilder.ObservableObjectBuilder();
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

    _Assert.assert.strictEqual(typeof (hasSubscribersUnsubscribe[0] = object.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');

    _Assert.assert.deepStrictEqual(hasSubscribers, [false]);

    hasSubscribers = [];
    var unsubscribe = [];

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function');

    assertEvents(results, []);

    _Assert.assert.deepStrictEqual(hasSubscribers, [true]);

    hasSubscribers = [];

    _Assert.assert.strictEqual(builder.writable('prop'), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);

    _Assert.assert.strictEqual(object.prop, undefined);

    _Assert.assert.strictEqual(builder.writable('prop', null, undefined), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);

    _Assert.assert.strictEqual(object.prop, undefined);

    _Assert.assert.strictEqual(builder.writable('prop', null, null), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: null,
      oldValue: undefined
    }]);
    results = [];

    _Assert.assert.strictEqual(object.prop, null);

    _Assert.assert.strictEqual(builder.writable('prop', null, '1'), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: '1',
      oldValue: null
    }]);
    results = [];

    _Assert.assert.strictEqual(object.prop, '1');

    _Assert.assert.strictEqual(builder.writable('prop', null, '1'), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);

    _Assert.assert.strictEqual(object.prop, '1');

    _Assert.assert.strictEqual(builder.writable('prop', null, 1), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: 1,
      oldValue: '1'
    }]);
    results = [];

    _Assert.assert.strictEqual(object.prop, 1);

    object.prop = '2';

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: '2',
      oldValue: 1
    }]);
    results = [];

    _Assert.assert.strictEqual(object.prop, '2');

    object.prop = '2';

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);

    _Assert.assert.strictEqual(object.prop, '2');

    object.prop = 2;

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: 2,
      oldValue: '2'
    }]);
    results = [];

    _Assert.assert.strictEqual(object.prop, 2);
  });
  (0, _Mocha.it)('updatable simple changed', function () {
    var builder = new _ObservableObjectBuilder.ObservableObjectBuilder();
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

    _Assert.assert.strictEqual(typeof (hasSubscribersUnsubscribe[0] = object.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');

    _Assert.assert.deepStrictEqual(hasSubscribers, [false]);

    hasSubscribers = [];
    var unsubscribe = [];

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function');

    assertEvents(results, []);

    _Assert.assert.deepStrictEqual(hasSubscribers, [true]);

    hasSubscribers = [];

    _Assert.assert.strictEqual(builder.updatable('prop', {
      update: function update(v) {
        return v;
      }
    }), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);

    _Assert.assert.strictEqual(object.prop, undefined);

    _Assert.assert.strictEqual(builder.updatable('prop', {
      update: function update(v) {
        return v;
      }
    }, undefined), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);

    _Assert.assert.strictEqual(object.prop, undefined);

    _Assert.assert.strictEqual(builder.updatable('prop', {
      update: function update(v) {
        return v;
      }
    }, null), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: null,
      oldValue: undefined
    }]);
    results = [];

    _Assert.assert.strictEqual(object.prop, null);

    unsubscribe[0]();

    _Assert.assert.strictEqual(builder.updatable('prop', {
      update: function update(v) {
        return v;
      },
      factory: function factory() {
        return '1';
      }
    }, '2'), builder);

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function');

    assertEvents(results, []);

    _Assert.assert.deepStrictEqual(hasSubscribers, [false, true]);

    hasSubscribers = [];
    object.prop = '3';

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);
    results = [];

    _Assert.assert.strictEqual(object.prop, '3');

    _Assert.assert.strictEqual(builder.updatable('prop', {
      update: function update(v) {
        return v;
      }
    }, '3'), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);

    _Assert.assert.strictEqual(object.prop, '3');

    _Assert.assert.strictEqual(builder.updatable('prop', {
      update: function update(v) {
        return v;
      },
      factory: function factory() {
        return 3;
      }
    }), builder);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: 3,
      oldValue: '3'
    }]);
    results = [];

    _Assert.assert.strictEqual(object.prop, 3);

    object.prop = '2';

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: '2',
      oldValue: 3
    }]);
    results = [];

    _Assert.assert.strictEqual(object.prop, '2');

    object.prop = '2';

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, []);

    _Assert.assert.strictEqual(object.prop, '2');

    object.prop = 2;

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    assertEvents(results, [{
      name: 'prop',
      newValue: 2,
      oldValue: '2'
    }]);
    results = [];

    _Assert.assert.strictEqual(object.prop, 2);
  });
});