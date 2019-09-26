/* tslint:disable:no-duplicate-string */

/* eslint-disable guard-for-in */
import { ThenableSync } from '../../../../../../../main/common/async/ThenableSync';
import { ObservableObject } from '../../../../../../../main/common/rx/object/ObservableObject';
import { CalcObjectBuilder } from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder';
import { calcPropertyFactory } from '../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder';
import { connectorFactory } from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder';
import { resolvePath } from '../../../../../../../main/common/rx/object/properties/helpers';
import { TestDeepSubscribe } from '../../deep-subscribe/helpers/src/TestDeepSubscribe';
describe('common > main > rx > properties > CalcObjectBuilder', function () {
  this.timeout(30000);

  class ClassSync extends ObservableObject {
    constructor(...args) {
      super(...args);
      this.value = 'Value';
      this.source1 = 123;
    }

  }

  class ClassAsync extends ClassSync {}

  ClassSync.prototype.valuePrototype = 'Value Prototype';
  new CalcObjectBuilder(ClassSync.prototype).writable('source1').writable('source2').calc('calc1', connectorFactory(c => c.connect('connectValue1', b => b.v('lastOrWait').p('source1').v('wait'))), // .connect('connectValue1', b => b.p('source1'))),
  // b.path(o => o['@lastOrWait'].source1['@wait']))),
  calcPropertyFactory(d => d.invalidateOn(b => b.propertyAny()), (input, property) => {
    property.value = input.connectValue1 && new Date(input.connectValue1);
    return ThenableSync.createResolved(null);
  })).calc('calc2', connectorFactory(c => c.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source2['@wait']))), calcPropertyFactory(d => d.invalidateOn(b => b.propertyAny()), (input, property) => {
    property.value = input.connectorSource;
    return ThenableSync.createResolved(null);
  }));
  new CalcObjectBuilder(ClassAsync.prototype).calc('calc1', connectorFactory(c => c.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source1['@wait']))), calcPropertyFactory(d => d.invalidateOn(b => b.propertyAny()), function* (input, property) {
    yield new Promise(r => setTimeout(r, 100));
    property.value = new Date(input.connectValue1);
  })).calc('calc2', connectorFactory(c => c.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source2['@wait']))), calcPropertyFactory(d => d.invalidateOn(b => b.propertyAny()), function* (input, property) {
    yield new Promise(r => setTimeout(r, 100));
    property.value = input.connectorSource;
  }));
  it('calc sync', function () {
    let result = new ClassSync().calc1.last;
    assert.deepStrictEqual(result, new Date(123));
    result = new ClassSync().calc1.wait;
    assert.deepStrictEqual(result, new Date(123));
    result = new ClassSync().calc1.lastOrWait;
    assert.deepStrictEqual(result, new Date(123));
  });
  it('calc sync resolve', function () {
    let val = resolvePath(new ClassSync())(o => o.calc1)();
    assert.deepStrictEqual(val, new Date(123));
    val = resolvePath(new ClassSync())(o => o.calc1)(o => o.last, true)();
    assert.deepStrictEqual(val, new Date(123));
    val = resolvePath(new ClassSync())(o => o.calc1.wait)(o => o.last, true)();
    assert.deepStrictEqual(val, new Date(123));
    val = resolvePath(new ClassSync())(o => o.calc1)(o => o.wait, true)(o => o.last, true)();
    assert.deepStrictEqual(val, new Date(123));
    val = resolvePath(new ClassSync())(o => o.wait, true)(o => o.calc1)(o => o.wait, true)(o => o.last, true)();
    assert.deepStrictEqual(val, new Date(123));
    let object = new ClassSync();
    let obj = resolvePath(object)();
    assert.deepStrictEqual(obj, object);
    object = new ClassSync();
    obj = resolvePath(object)(o => o.wait, true)();
    assert.deepStrictEqual(obj, object);
    object = new ClassSync();
    obj = resolvePath(object)(o => o.wait, true)(o => o.last, true)();
    assert.deepStrictEqual(obj, object);
  });
  it('calc async', async function () {
    assert.deepStrictEqual(new ClassAsync().calc1.last, void 0);
    let object = new ClassAsync().calc1;
    assert.deepStrictEqual((await object.wait), new Date(123));
    assert.deepStrictEqual(object.last, new Date(123));
    object = new ClassAsync().calc1;
    assert.deepStrictEqual((await object.lastOrWait), new Date(123));
    assert.deepStrictEqual(object.last, new Date(123));
  });
  it('calc async resolve', async function () {
    let val = resolvePath(new ClassAsync())(o => o.calc1)();
    assert.deepStrictEqual((await val), new Date(123));
    val = resolvePath(new ClassAsync())(o => o.calc1)(o => o.last, true)();
    assert.deepStrictEqual((await val), new Date(123));
    val = resolvePath(new ClassAsync())(o => o.calc1.wait)(o => o.last, true)();
    assert.deepStrictEqual((await val), new Date(123));
    val = resolvePath(new ClassAsync())(o => o.calc1)(o => o.wait, true)(o => o.last, true)();
    assert.deepStrictEqual((await val), new Date(123));
    val = resolvePath(new ClassAsync())(o => o.wait, true)(o => o.calc1)(o => o.wait, true)(o => o.last, true)();
    assert.deepStrictEqual((await val), new Date(123));
    let object = new ClassAsync();
    let obj = resolvePath(object)();
    assert.deepStrictEqual((await obj), object);
    object = new ClassAsync();
    obj = resolvePath(object)(o => o.wait, true)();
    assert.deepStrictEqual((await obj), object);
    object = new ClassAsync();
    obj = resolvePath(object)(o => o.wait, true)(o => o.last, true)();
    assert.deepStrictEqual((await obj), object);
  });
  it('circular calc sync', async function () {
    const object = new ClassSync();
    let value = resolvePath(object)(o => o.calc2)();
    assert.strictEqual(value, object);
    value = resolvePath(object)(o => o.calc2)(o => o.calc2)(o => o.calc2)(o => o.calc2)();
    assert.strictEqual(value, object);
    const value2 = resolvePath(object)(o => o.calc2)(o => o.calc2)(o => o.calc2)(o => o.calc1)();
    assert.deepStrictEqual(value2, new Date(123));
  });
  it('circular calc async', async function () {
    const object = new ClassSync();
    let value = resolvePath(object)(o => o.calc2)();
    assert.strictEqual((await value), object);
    value = resolvePath(object)(o => o.calc2)(o => o.calc2)(o => o.calc2)(o => o.calc2)();
    assert.strictEqual((await value), object);
    const value2 = resolvePath(object)(o => o.calc2)(o => o.calc2)(o => o.calc2)(o => o.calc1)();
    assert.deepStrictEqual((await value2), new Date(123));
  });
  it('deepSubscribe simple', async function () {
    new TestDeepSubscribe({
      object: new ClassSync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.p('value')).subscribe(o => ['Value']).unsubscribe(['Value']);
    new TestDeepSubscribe({
      object: new ClassSync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.p('valuePrototype')).subscribe(o => ['Value Prototype']).unsubscribe(['Value Prototype']);
  });
  it('deepSubscribe calc sync', async function () {
    new TestDeepSubscribe({
      object: new ClassSync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.p('calc1')).subscribe([new Date(123)]).unsubscribe([new Date(123)]);
    new TestDeepSubscribe({
      object: new ClassSync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.p('calc1').p('getTime')).subscribe([Date.prototype.getTime]).unsubscribe([Date.prototype.getTime]);
  });
  it('deepSubscribe calc async', async function () {
    let tester = new TestDeepSubscribe({
      object: new ClassAsync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true,
      asyncDelay: 500
    }, b => b.p('calc1'));
    await tester.subscribeAsync([new Date(123)]);
    await tester.unsubscribeAsync([new Date(123)]);
    tester = new TestDeepSubscribe({
      object: new ClassAsync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true,
      asyncDelay: 500
    }, b => b.p('calc1').p('getTime'));
    await tester.subscribeAsync([Date.prototype.getTime]);
    await tester.unsubscribeAsync([Date.prototype.getTime]);
  });
  it('deepSubscribe calc circular sync', async function () {
    const date234 = new Date(234);
    new TestDeepSubscribe({
      object: new ClassSync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, // b => b.p('calc2').p('calc2').p('calc2').p('calc1'),
    b => b.p('calc2').p('calc2').p('calc1')). // .subscribe([new Date(123)])
    // .unsubscribe([new Date(123)])
    subscribe([new Date(123)]).change(o => o.source1 = 234, [new Date(123)], [new Date(234)]).change(o => o.source2 = 1, [date234], [date234]).change(o => o.source1 = 345, [new Date(234)], [new Date(345)]).unsubscribe([new Date(345)]);
  });
  it('deepSubscribe calc circular async', async function () {
    const tester = new TestDeepSubscribe({
      object: new ClassSync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true,
      asyncDelay: 500
    }, b => b.p('calc2').p('calc2').p('calc2').p('calc1'));
    await tester.subscribe([new Date(123)]);
    await tester.unsubscribe([new Date(123)]);
    await tester.subscribe([new Date(123)]);
    await tester.change(o => o.source1 = 234, [new Date(123)], [new Date(234)]);
    await tester.change(o => o.source2 = 1, [new Date(234)], [new Date(234)]);
    await tester.change(o => o.source1 = 345, [new Date(234)], [new Date(345)]);
    await tester.unsubscribe([new Date(345)]);
  });
});