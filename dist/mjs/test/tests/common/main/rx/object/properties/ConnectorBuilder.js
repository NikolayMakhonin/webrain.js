/* tslint:disable:no-duplicate-string */

/* eslint-disable guard-for-in */
import { ObservableObjectBuilder } from '../../../../../../../main/common/rx/object/ObservableObjectBuilder';
import { Connector } from '../../../../../../../main/common/rx/object/properties/Connector';
import { ConnectorBuilder } from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder';
import { assert } from '../../../../../../../main/common/test/Assert';
import { describe, it } from '../../../../../../../main/common/test/Mocha';
import { createObject } from '../../deep-subscribe/helpers/src/TestDeepSubscribe';
describe('common > main > rx > properties > ConnectorBuilder', function () {
  it('connect', function () {
    const source = new ObservableObjectBuilder(createObject().observableObject).writable('baseProp1').writable('baseProp2').writable('prop1').writable('prop2').object;
    source.baseProp1 = 'baseProp1_init_source';

    class BaseClass1 extends Connector {}

    class BaseClass2 extends BaseClass1 {}

    class Class1 extends BaseClass1 {}

    class Class2 extends BaseClass2 {}

    new ConnectorBuilder(BaseClass1.prototype).connect('baseProp1', b => b.path(o => o.property['@value_property'].observableMap['#observableList']['#'].baseProp1));
    new ConnectorBuilder(BaseClass2.prototype).connectWritable('baseProp2', b => b.path(o => o['@value_property'].property['@value_property'].observableMap['#observableList']['#'].baseProp2), null, 'baseProp2_init');
    new ConnectorBuilder(Class1.prototype).connect('prop1', b => b.path(o => o['@value_property'].property['@value_property'].observableMap['#observableList']['#'].prop1), null, 'prop1_init');
    new ConnectorBuilder(Class2.prototype).connectWritable('prop2', b => b.path(o => o['@value_property'].property['@value_property'].observableMap['#observableList']['#'].prop2), null, 'prop2_init');
    const baseObject1 = new BaseClass1(source);
    const baseObject2 = new BaseClass2(source);
    const object1 = new Class1(source);
    const object2 = new Class2(source); // eslint-disable-next-line prefer-const

    let baseResults1 = [];

    const baseSubscriber1 = value => {
      baseResults1.push(value);
    }; // eslint-disable-next-line prefer-const


    let baseResults2 = [];

    const baseSubscriber2 = value => {
      baseResults2.push(value);
    }; // eslint-disable-next-line prefer-const


    const results1 = [];

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
    assert.strictEqual(typeof (baseUnsubscribe1[0] = baseObject1.propertyChanged.subscribe(baseSubscriber1)), 'function');
    assert.strictEqual(typeof (baseUnsubscribe2[0] = baseObject2.propertyChanged.subscribe(baseSubscriber2)), 'function');
    assert.strictEqual(typeof (unsubscribe1[0] = object1.propertyChanged.subscribe(subscriber1)), 'function');
    assert.strictEqual(typeof (unsubscribe2[0] = object2.propertyChanged.subscribe(subscriber2)), 'function'); // assert.strictEqual(baseObject2.baseProp1, void 0)

    assert.strictEqual(baseObject1.baseProp1, 'baseProp1_init_source');
    source.baseProp1 = '1';
    assert.deepStrictEqual(baseResults1, [{
      name: 'baseProp1',
      newValue: '1',
      oldValue: 'baseProp1_init_source'
    }]);
    baseResults1 = [];
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '1');
    assert.deepStrictEqual(object1.baseProp1, '1');
    assert.deepStrictEqual(object2.baseProp1, '1');
    assert.strictEqual(baseObject2.baseProp2, 'baseProp2_init');
    baseObject2.baseProp2 = '1';
    assert.deepStrictEqual(source.baseProp2, '1');
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, [{
      name: 'baseProp2',
      newValue: '1',
      oldValue: 'baseProp2_init'
    }]);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '1');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, '1');
    object2.baseProp2 = '2';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, [{
      name: 'baseProp2',
      newValue: '2',
      oldValue: '1'
    }]);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp2',
      newValue: '2',
      oldValue: '1'
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '2');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, '2');
    source.baseProp2 = '3';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, [{
      name: 'baseProp2',
      newValue: '3',
      oldValue: '2'
    }]);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp2',
      newValue: '3',
      oldValue: '2'
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '3');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, '3');
    new ConnectorBuilder(object2).readable('baseProp1', null, '7');
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp1',
      newValue: '7',
      oldValue: '1'
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '1');
    assert.deepStrictEqual(object1.baseProp1, '1');
    assert.deepStrictEqual(object2.baseProp1, '7');
    unsubscribe1[0]();
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '1');
    assert.deepStrictEqual(object1.baseProp1, void 0);
    assert.deepStrictEqual(object2.baseProp1, '7');
    unsubscribe2[0]();
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '1');
    assert.deepStrictEqual(object1.baseProp1, void 0);
    assert.deepStrictEqual(object2.baseProp1, void 0);
    baseUnsubscribe1[0]();
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, void 0);
    assert.deepStrictEqual(baseObject2.baseProp1, '1');
    assert.deepStrictEqual(object1.baseProp1, void 0);
    assert.deepStrictEqual(object2.baseProp1, void 0);
    baseUnsubscribe2[0]();
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, void 0);
    assert.deepStrictEqual(baseObject2.baseProp1, void 0);
    assert.deepStrictEqual(object1.baseProp1, void 0);
    assert.deepStrictEqual(object2.baseProp1, void 0);
  });
});