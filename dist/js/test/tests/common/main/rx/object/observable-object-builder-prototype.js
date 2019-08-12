"use strict";

var _ObservableObject = require("../../../../../../main/common/rx/object/ObservableObject");

var _ObservableObjectBuilder = require("../../../../../../main/common/rx/object/ObservableObjectBuilder");

/* eslint-disable guard-for-in */
describe('common > main > rx > observable-object-builder-prototype', function () {
  it('writable', function () {
    class BaseClass1 extends _ObservableObject.ObservableObject {}

    class BaseClass2 extends BaseClass1 {}

    class Class1 extends BaseClass1 {}

    class Class2 extends BaseClass2 {}

    const baseBuilder1 = new _ObservableObjectBuilder.ObservableObjectBuilder(BaseClass1.prototype).writable('baseProp1');
    const baseBuilder2 = new _ObservableObjectBuilder.ObservableObjectBuilder(BaseClass2.prototype).writable('baseProp2');
    const builder1 = new _ObservableObjectBuilder.ObservableObjectBuilder(Class1.prototype).writable('prop1');
    const builder2 = new _ObservableObjectBuilder.ObservableObjectBuilder(Class2.prototype).writable('prop2');
    const baseObject1 = new BaseClass1();
    const baseObject2 = new BaseClass2();
    const object1 = new Class1();
    const object2 = new Class2(); // eslint-disable-next-line prefer-const

    let baseResults1 = [];

    const baseSubscriber1 = value => {
      baseResults1.push(value);
    }; // eslint-disable-next-line prefer-const


    let baseResults2 = [];

    const baseSubscriber2 = value => {
      baseResults2.push(value);
    }; // eslint-disable-next-line prefer-const


    let results1 = [];

    const subscriber1 = value => {
      results1.push(value);
    }; // eslint-disable-next-line prefer-const


    let results2 = [];

    const subscriber2 = value => {
      results2.push(value);
    };

    const baseUnsubscribe1 = [];
    const baseUnsubscribe2 = [];
    const unsubscribe1 = [];
    const unsubscribe2 = [];
    assert.strictEqual(typeof (baseUnsubscribe1[0] = baseObject1.deepPropertyChanged.subscribe(baseSubscriber1)), 'function');
    assert.strictEqual(typeof (baseUnsubscribe2[0] = baseObject2.deepPropertyChanged.subscribe(baseSubscriber2)), 'function');
    assert.strictEqual(typeof (unsubscribe1[0] = object1.deepPropertyChanged.subscribe(subscriber1)), 'function');
    assert.strictEqual(typeof (unsubscribe2[0] = object2.deepPropertyChanged.subscribe(subscriber2)), 'function');
    baseObject1.baseProp1 = '1';
    assert.deepStrictEqual(baseResults1, [{
      name: 'baseProp1',
      newValue: '1',
      oldValue: undefined
    }]);
    baseResults1 = [];
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, undefined);
    assert.deepStrictEqual(object1.baseProp1, undefined);
    assert.deepStrictEqual(object2.baseProp1, undefined);
    baseObject2.baseProp1 = '2';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, [{
      name: 'baseProp1',
      newValue: '2',
      oldValue: undefined
    }]);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '2');
    assert.deepStrictEqual(object1.baseProp1, undefined);
    assert.deepStrictEqual(object2.baseProp1, undefined);
    baseObject2.baseProp2 = '3';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, [{
      name: 'baseProp2',
      newValue: '3',
      oldValue: undefined
    }]);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '3');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, undefined);
    object1.baseProp1 = '4';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, [{
      name: 'baseProp1',
      newValue: '4',
      oldValue: undefined
    }]);
    results1 = [];
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '2');
    assert.deepStrictEqual(object1.baseProp1, '4');
    assert.deepStrictEqual(object2.baseProp1, undefined);
    object2.baseProp1 = '5';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp1',
      newValue: '5',
      oldValue: undefined
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '2');
    assert.deepStrictEqual(object1.baseProp1, '4');
    assert.deepStrictEqual(object2.baseProp1, '5');
    object2.baseProp2 = '6';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp2',
      newValue: '6',
      oldValue: undefined
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '3');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, '6');
    new _ObservableObjectBuilder.ObservableObjectBuilder(object2).readable('baseProp1', null, '7');
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp1',
      newValue: '7',
      oldValue: '5'
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '2');
    assert.deepStrictEqual(object1.baseProp1, '4');
    assert.deepStrictEqual(object2.baseProp1, '7');
  });
  it('readable', function () {
    class BaseClass1 extends _ObservableObject.ObservableObject {}

    class BaseClass2 extends BaseClass1 {}

    class Class1 extends BaseClass1 {}

    class Class2 extends BaseClass2 {}

    const baseBuilder1 = new _ObservableObjectBuilder.ObservableObjectBuilder(BaseClass1.prototype).readable('baseProp1');
    const baseBuilder2 = new _ObservableObjectBuilder.ObservableObjectBuilder(BaseClass2.prototype).readable('baseProp2');
    const builder1 = new _ObservableObjectBuilder.ObservableObjectBuilder(Class1.prototype).readable('prop1');
    const builder2 = new _ObservableObjectBuilder.ObservableObjectBuilder(Class2.prototype).readable('prop2');
    const baseObject1 = new BaseClass1();
    const baseObject2 = new BaseClass2();
    const object1 = new Class1();
    const object2 = new Class2(); // eslint-disable-next-line prefer-const

    let baseResults1 = [];

    const baseSubscriber1 = value => {
      baseResults1.push(value);
    }; // eslint-disable-next-line prefer-const


    let baseResults2 = [];

    const baseSubscriber2 = value => {
      baseResults2.push(value);
    }; // eslint-disable-next-line prefer-const


    let results1 = [];

    const subscriber1 = value => {
      results1.push(value);
    }; // eslint-disable-next-line prefer-const


    let results2 = [];

    const subscriber2 = value => {
      results2.push(value);
    };

    const baseUnsubscribe1 = [];
    const baseUnsubscribe2 = [];
    const unsubscribe1 = [];
    const unsubscribe2 = [];
    assert.strictEqual(typeof (baseUnsubscribe1[0] = baseObject1.deepPropertyChanged.subscribe(baseSubscriber1)), 'function');
    assert.strictEqual(typeof (baseUnsubscribe2[0] = baseObject2.deepPropertyChanged.subscribe(baseSubscriber2)), 'function');
    assert.strictEqual(typeof (unsubscribe1[0] = object1.deepPropertyChanged.subscribe(subscriber1)), 'function');
    assert.strictEqual(typeof (unsubscribe2[0] = object2.deepPropertyChanged.subscribe(subscriber2)), 'function');
    baseBuilder1.readable('baseProp1', null, '1');
    assert.deepStrictEqual(baseResults1, []);
    baseResults1 = [];
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '1');
    assert.deepStrictEqual(object1.baseProp1, '1');
    assert.deepStrictEqual(object2.baseProp1, '1');
    baseBuilder2.readable('baseProp1', {
      factory: () => '2'
    });
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '1');
    assert.deepStrictEqual(object1.baseProp1, '1');
    assert.deepStrictEqual(object2.baseProp1, '1');
    delete baseObject1.baseProp1;
    delete baseObject2.baseProp1;
    delete object1.baseProp1;
    delete object2.baseProp1;
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '2');
    assert.deepStrictEqual(object1.baseProp1, '1');
    assert.deepStrictEqual(object2.baseProp1, '2');
    baseBuilder2.readable('baseProp2', null, '3');
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '3');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, '3');
    builder1.readable('baseProp1', {
      factory: () => '4'
    });
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    results1 = [];
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '2');
    assert.deepStrictEqual(object1.baseProp1, '1');
    delete object1.baseProp1;
    assert.deepStrictEqual(object1.baseProp1, '4');
    assert.deepStrictEqual(object2.baseProp1, '2');
    builder2.readable('baseProp1', null, '5');
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '2');
    assert.deepStrictEqual(object1.baseProp1, '4');
    assert.deepStrictEqual(object2.baseProp1, '2');
    delete object2.baseProp1;
    assert.deepStrictEqual(object2.baseProp1, '5');
    builder2.readable('baseProp2', {
      factory: () => '6'
    });
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '3');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, '3');
    delete object2.baseProp2;
    assert.deepStrictEqual(object2.baseProp2, '6');
    new _ObservableObjectBuilder.ObservableObjectBuilder(object2).readable('baseProp1', null, '7');
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp1',
      newValue: '7',
      oldValue: '5'
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '2');
    assert.deepStrictEqual(object1.baseProp1, '4');
    assert.deepStrictEqual(object2.baseProp1, '7');
    new _ObservableObjectBuilder.ObservableObjectBuilder(object2).readable('baseProp2', {
      factory: () => '8'
    });
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp2',
      newValue: '8',
      oldValue: '6'
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '3');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, '8');
  });
});