"use strict";

var _ThenableSync = require("../../../../../../../main/common/async/ThenableSync");

var _ObservableObject = require("../../../../../../../main/common/rx/object/ObservableObject");

var _CalcObjectBuilder = require("../../../../../../../main/common/rx/object/properties/CalcObjectBuilder");

var _CalcPropertyBuilder = require("../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder");

var _ConnectorBuilder = require("../../../../../../../main/common/rx/object/properties/ConnectorBuilder");

var _helpers = require("../../../../../../../main/common/rx/object/properties/helpers");

/* tslint:disable:no-duplicate-string */

/* eslint-disable guard-for-in */
describe('common > main > rx > properties > CalcObjectBuilder', function () {
  class ClassSync extends _ObservableObject.ObservableObject {}

  class ClassAsync extends ClassSync {}

  new _CalcObjectBuilder.CalcObjectBuilder(ClassSync.prototype).calc('prop1', (0, _ConnectorBuilder.connectorFactory)(c => c.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source['@wait']))), (0, _CalcPropertyBuilder.calcPropertyFactory)((input, valueProperty) => {
    valueProperty.value = new Date(123);
    return _ThenableSync.ThenableSync.createResolved(null);
  }));
  new _CalcObjectBuilder.CalcObjectBuilder(ClassAsync.prototype).calc('prop1', (0, _ConnectorBuilder.connectorFactory)(c => c.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source['@wait']))), (0, _CalcPropertyBuilder.calcPropertyFactory)(function* (input, valueProperty) {
    yield new Promise(r => setTimeout(r, 100));
    valueProperty.value = new Date(123);
  }));
  it('calc sync', function () {
    let result = new ClassSync().prop1.last;
    assert.deepStrictEqual(result, new Date(123));
    result = new ClassSync().prop1.wait;
    assert.deepStrictEqual(result, new Date(123));
    result = new ClassSync().prop1.lastOrWait;
    assert.deepStrictEqual(result, new Date(123));
  });
  it('calc sync resolve', function () {
    let val = (0, _helpers.resolvePath)(new ClassSync())(o => o.prop1)();
    assert.deepStrictEqual(val, new Date(123));
    val = (0, _helpers.resolvePath)(new ClassSync())(o => o.prop1)(o => o.last, true)();
    assert.deepStrictEqual(val, new Date(123));
    val = (0, _helpers.resolvePath)(new ClassSync())(o => o.prop1.wait)(o => o.last, true)();
    assert.deepStrictEqual(val, new Date(123));
    val = (0, _helpers.resolvePath)(new ClassSync())(o => o.prop1)(o => o.wait, true)(o => o.last, true)();
    assert.deepStrictEqual(val, new Date(123));
    val = (0, _helpers.resolvePath)(new ClassSync())(o => o.wait, true)(o => o.prop1)(o => o.wait, true)(o => o.last, true)();
    assert.deepStrictEqual(val, new Date(123));
    let object = new ClassSync();
    let obj = (0, _helpers.resolvePath)(object)();
    assert.deepStrictEqual(obj, object);
    object = new ClassSync();
    obj = (0, _helpers.resolvePath)(object)(o => o.wait, true)();
    assert.deepStrictEqual(obj, object);
    object = new ClassSync();
    obj = (0, _helpers.resolvePath)(object)(o => o.wait, true)(o => o.last, true)();
    assert.deepStrictEqual(obj, object);
  });
  it('calc async', async function () {
    assert.deepStrictEqual(new ClassAsync().prop1.last, void 0);
    let object = new ClassAsync().prop1;
    assert.deepStrictEqual((await object.wait), new Date(123));
    assert.deepStrictEqual(object.last, new Date(123));
    object = new ClassAsync().prop1;
    assert.deepStrictEqual((await object.lastOrWait), new Date(123));
    assert.deepStrictEqual(object.last, new Date(123));
  });
  it('calc async resolve', async function () {
    let val = (0, _helpers.resolvePath)(new ClassAsync())(o => o.prop1)();
    assert.deepStrictEqual((await val), new Date(123));
    val = (0, _helpers.resolvePath)(new ClassAsync())(o => o.prop1)(o => o.last, true)();
    assert.deepStrictEqual((await val), new Date(123));
    val = (0, _helpers.resolvePath)(new ClassAsync())(o => o.prop1.wait)(o => o.last, true)();
    assert.deepStrictEqual((await val), new Date(123));
    val = (0, _helpers.resolvePath)(new ClassAsync())(o => o.prop1)(o => o.wait, true)(o => o.last, true)();
    assert.deepStrictEqual((await val), new Date(123));
    val = (0, _helpers.resolvePath)(new ClassAsync())(o => o.wait, true)(o => o.prop1)(o => o.wait, true)(o => o.last, true)();
    assert.deepStrictEqual((await val), new Date(123));
    let object = new ClassAsync();
    let obj = (0, _helpers.resolvePath)(object)();
    assert.deepStrictEqual((await obj), object);
    object = new ClassAsync();
    obj = (0, _helpers.resolvePath)(object)(o => o.wait, true)();
    assert.deepStrictEqual((await obj), object);
    object = new ClassAsync();
    obj = (0, _helpers.resolvePath)(object)(o => o.wait, true)(o => o.last, true)();
    assert.deepStrictEqual((await obj), object);
  });
});