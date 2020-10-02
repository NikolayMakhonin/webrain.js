/* tslint:disable:no-identical-functions no-shadowed-variable */
import { webrainOptions } from '../../../../../../../main/common/helpers/webrainOptions';
import { Random } from '../../../../../../../main/common/random/Random';
import { getOneWayBinder, getTwoWayBinder } from '../../../../../../../main/common/rx/depend/bindings2/bind';
import { createPathGetSetValue, createPathGetValue, createPathSetValue } from '../../../../../../../main/common/rx/depend/bindings2/path';
import { reduceCallStates } from '../../../../../../../main/common/rx/depend/core/CallState';
import { ObservableClass } from '../../../../../../../main/common/rx/object/ObservableClass';
import { ObservableObjectBuilder } from '../../../../../../../main/common/rx/object/ObservableObjectBuilder';
import { pathGetSetBuild } from '../../../../../../../main/common/rx/object/properties/path/builder';
import { assert } from '../../../../../../../main/common/test/Assert';
import { describe, xit } from '../../../../../../../main/common/test/Mocha';
import { randomTestBuilder, searchBestErrorBuilder, testIterationBuilder, testIteratorBuilder } from '../../../../../../../main/common/test/randomTest';
import { delay } from '../../../../../../../main/common/time/helpers';
import { clearCallStates } from '../src/helpers';
describe('common > main > rx > depend > bindings > stress', function () {
  this.timeout(24 * 60 * 60 * 1000);
  beforeEach(function () {
    webrainOptions.callState.garbageCollect.disabled = false;
    webrainOptions.callState.garbageCollect.bulkSize = 100;
    webrainOptions.callState.garbageCollect.interval = 0;
    webrainOptions.callState.garbageCollect.minLifeTime = 0;
  }); // region helpers

  const propNames = ['prop1', 'prop2', 'prop3'];

  class ObjectClass extends ObservableClass {}

  new ObservableObjectBuilder(ObjectClass.prototype).writable('prop1').writable('prop2').writable('prop3');

  function fillObject(rnd, obj) {
    obj.prop1 = rnd.nextInt(1000);
    obj.prop2 = rnd.nextInt(1000);
    obj.prop3 = rnd.nextInt(1000);
    return obj;
  }

  function generateObject(rnd) {
    return fillObject(rnd, new ObjectClass());
  }

  function generateCheckObject(rnd) {
    return fillObject(rnd, {});
  }

  function generateItems(rnd, count, generateItem) {
    const items = [];

    for (let i = 0; i < count; i++) {
      items.push(generateItem(rnd));
    }

    return items;
  }

  function generateNumber(rnd, pattern) {
    return Array.isArray(pattern) ? rnd.nextInt(pattern[0], pattern[1] + 1) : pattern;
  }

  class ObjectsBase {
    constructor(objects) {
      this.unbinds = [];
      this.objects = objects;
    }

  }

  const getValues = {};
  const setValues = {};
  const getSetValues = {};

  for (let i = 0; i < propNames.length; i++) {
    const propName = propNames[i];
    getSetValues[propName] = [createPathGetSetValue()(b => b.f(o => o[propName], (o, v) => {
      o[propName] = v;
    })), createPathGetSetValue()(pathGetSetBuild(b => b.f(o => o[propName], (o, v) => {
      o[propName] = v;
    }))), createPathGetSetValue()(pathGetSetBuild(b => b.f(o => o[propName], (o, v) => {
      o[propName] = v;
    })).pathGet, pathGetSetBuild(b => b.f(o => o[propName], (o, v) => {
      o[propName] = v;
    })).pathSet), createPathGetSetValue()(b => b.f(o => o), {
      get: b => b.f(o => o[propName]),
      set: b => b.f(null, (o, v) => {
        o[propName] = v;
      })
    }), createPathGetSetValue(b => b.f(o => o[propName], (o, v) => {
      o[propName] = v;
    })), createPathGetSetValue(pathGetSetBuild(b => b.f(o => o[propName], (o, v) => {
      o[propName] = v;
    }))), createPathGetSetValue(pathGetSetBuild(b => b.f(o => o[propName])).pathGet, pathGetSetBuild(b => b.f(null, (o, v) => {
      o[propName] = v;
    })).pathSet), createPathGetSetValue(b => b.f(o => o), {
      get: b => b.f(o => o[propName]),
      set: b => b.f(null, (o, v) => {
        o[propName] = v;
      })
    })];
    getValues[propName] = [...getSetValues[propName].map(o => o.getValue), createPathGetValue()(b => b.f(o => o[propName])), createPathGetValue()(pathGetSetBuild(b => b.f(o => o[propName])).pathGet), createPathGetValue(b => b.f(o => o[propName])), createPathGetValue(pathGetSetBuild(b => b.f(o => o[propName])).pathGet)];
    setValues[propName] = [...getSetValues[propName].map(o => o.setValue), createPathSetValue()(b => b.f(null, (o, v) => {
      o[propName] = v;
    })), createPathSetValue()(pathGetSetBuild(b => b.f(null, (o, v) => {
      o[propName] = v;
    })).pathSet), createPathSetValue(b => b.f(null, (o, v) => {
      o[propName] = v;
    })), createPathSetValue(pathGetSetBuild(b => b.f(null, (o, v) => {
      o[propName] = v;
    })).pathSet)];
  }

  function generateSourceDests(rnd) {
    const result = {
      getValues: {},
      setValues: {},
      getSetValues: {}
    };

    for (let i = 0; i < propNames.length; i++) {
      const propName = propNames[i];
      result.getValues[propName] = rnd.nextArrayItem(getValues[propName]);
      result.setValues[propName] = rnd.nextArrayItem(setValues[propName]);
      result.getSetValues[propName] = {
        getValue: result.getValues[propName],
        setValue: result.setValues[propName]
      };
    }

    return result;
  }

  class Objects extends ObjectsBase {
    constructor(objects, sourcesDests) {
      super(objects);
      this._getSetValues = sourcesDests;
    }

    setValue(objectNumber, propName, value) {
      this.objects[objectNumber][propName] = value;
    }

    bindOneWay(rnd, objectNumberFrom, propNameFrom, objectNumberTo, propNameTo) {
      const getValue = this._getSetValues.getValues[propNameFrom];
      const setValue = this._getSetValues.setValues[propNameTo];
      const sourceObject = this.objects[objectNumberFrom];
      const destObject = this.objects[objectNumberTo];
      const binder = getOneWayBinder(sourceObject, getValue, destObject, setValue);
      this.unbinds.push(binder.bind());
    }

    bindTwoWay(rnd, objectNumber1, propName1, objectNumber2, propName2) {
      const getSetValue1 = this._getSetValues.getSetValues[propName1];
      const getSetValue2 = this._getSetValues.getSetValues[propName2];
      const object1 = this.objects[objectNumber1];
      const object2 = this.objects[objectNumber2];
      const binder = getTwoWayBinder(object1, getSetValue1, object2, getSetValue2);
      this.unbinds.push(binder.bind());
    }

  }

  class CheckObjects extends ObjectsBase {
    constructor(...args) {
      super(...args);
      this.countBindings = 0;
      this._bindings = {};
    }

    setValue(objectNumber, propName, value) {
      if (this.objects[objectNumber][propName] !== value) {
        this.objects[objectNumber][propName] = value;
        this.onChange(objectNumber, propName);
      }
    }

    onChange(objectNumber, propName) {
      const keyFrom = objectNumber + '_' + propName;
      const from = this._bindings[keyFrom];

      if (!from) {
        return;
      }

      const value = this.objects[objectNumber][propName];

      for (const keyTo in from) {
        if (Object.prototype.hasOwnProperty.call(from, keyTo)) {
          const to = from[keyTo];

          if (to.count > 0) {
            this.setValue(to.objectNumber, to.propName, value);
          }
        }
      }
    }

    _bindOneWay(rnd, objectNumberFrom, propNameFrom, objectNumberTo, propNameTo) {
      const keyFrom = objectNumberFrom + '_' + propNameFrom;
      const keyTo = objectNumberTo + '_' + propNameTo;
      let from = this._bindings[keyFrom];

      if (!from) {
        this._bindings[keyFrom] = from = {};
      }

      let to = from[keyTo];

      if (!to) {
        from[keyTo] = to = {
          objectNumber: objectNumberTo,
          propName: propNameTo,
          count: 0
        };
      }

      to.count++;
      this.countBindings++;

      if (to.count === 1) {
        const value = this.objects[objectNumberFrom][propNameFrom];
        this.setValue(to.objectNumber, to.propName, value);
      }

      let unBinded;
      return () => {
        if (unBinded) {
          return;
        }

        unBinded = true;
        assert.ok(to.count >= 0);
        to.count--;
        this.countBindings--;
      };
    }

    bindOneWay(rnd, objectNumberFrom, propNameFrom, objectNumberTo, propNameTo) {
      this.unbinds.push(this._bindOneWay(rnd, objectNumberFrom, propNameFrom, objectNumberTo, propNameTo));
    }

    bindTwoWay(rnd, objectNumber1, propName1, objectNumber2, propName2) {
      const unbind1 = this._bindOneWay(rnd, objectNumber1, propName1, objectNumber2, propName2);

      const unbind2 = this._bindOneWay(rnd, objectNumber2, propName2, objectNumber1, propName1);

      this.unbinds.push(() => {
        unbind1();
        unbind2();
      });
    }

  }

  function simplifyObject(obj) {
    if (obj.constructor === Object) {
      return obj;
    }

    const simplify = {};

    for (let i = 0; i < propNames.length; i++) {
      const propName = propNames[i];
      simplify[propName] = obj[propName];
    }

    return simplify;
  }

  function simplifyObjects(items) {
    return items.map(simplifyObject);
  }

  function assertObjects(actual, expected) {
    actual = simplifyObjects(actual);
    expected = simplifyObjects(expected);
    assert.deepStrictEqual(actual, expected);
  }

  function equalObject(actual, expected) {
    for (let i = 0, len = propNames.length; i < len; i++) {
      const propName = propNames[i];

      if (actual[propName] !== expected[propName]) {
        return false;
      }
    }

    return true;
  }

  function equalObjects(actual, expected) {
    const len = actual.length;

    if (len !== expected.length) {
      return false;
    }

    for (let i = 0; i < len; i++) {
      if (!equalObject(actual[i], expected[i])) {
        return false;
      }
    }

    return true;
  } // endregion
  // region metrics


  function createMetrics(testRunnerMetrics) {
    return {
      garbageCollectMode: null,
      countObjects: null,
      iterations: 0,
      countUnBinds: 0,
      countBinds: 0,
      countSetsLast: 0,
      countChecksLast: 0,
      countSets: 0,
      countChecks: 0,
      countValues: null
    };
  }

  function compareMetrics(metrics, metricsMin) {
    if (metrics.garbageCollectMode !== metricsMin.garbageCollectMode) {
      return metrics.garbageCollectMode < metricsMin.garbageCollectMode ? -1 : 1;
    }

    if (metrics.countObjects !== metricsMin.countObjects) {
      return metrics.countObjects < metricsMin.countObjects ? -1 : 1;
    }

    if (metrics.iterations !== metricsMin.iterations) {
      return metrics.iterations < metricsMin.iterations ? -1 : 1;
    }

    if (metrics.countUnBinds !== metricsMin.countUnBinds) {
      return metrics.countUnBinds < metricsMin.countUnBinds ? -1 : 1;
    }

    if (metrics.countBinds !== metricsMin.countBinds) {
      return metrics.countBinds < metricsMin.countBinds ? -1 : 1;
    }

    if (metrics.countSetsLast !== metricsMin.countSetsLast) {
      return metrics.countSetsLast < metricsMin.countSetsLast ? -1 : 1;
    }

    if (metrics.countChecksLast !== metricsMin.countChecksLast) {
      return metrics.countChecksLast < metricsMin.countChecksLast ? -1 : 1;
    }

    if (metrics.countSets !== metricsMin.countSets) {
      return metrics.countSets < metricsMin.countSets ? -1 : 1;
    }

    if (metrics.countChecks !== metricsMin.countChecks) {
      return metrics.countChecks < metricsMin.countChecks ? -1 : 1;
    }

    if (metrics.countValues !== metricsMin.countValues) {
      return metrics.countValues < metricsMin.countValues ? -1 : 1;
    }

    return 0;
  } // endregion
  // region options


  let GarbageCollectMode;

  (function (GarbageCollectMode) {
    GarbageCollectMode[GarbageCollectMode["deleteImmediate"] = 0] = "deleteImmediate";
    GarbageCollectMode[GarbageCollectMode["disabled"] = 1] = "disabled";
    GarbageCollectMode[GarbageCollectMode["normal"] = 2] = "normal";
  })(GarbageCollectMode || (GarbageCollectMode = {}));

  function optionsPatternBuilder(metrics, metricsMin) {
    return {
      countObjects: [1, metricsMin.countObjects == null ? 3 : metricsMin.countObjects],
      countValues: [1, metricsMin.countValues == null ? 10 : metricsMin.countValues],
      garbageCollectMode: GarbageCollectMode.disabled,
      // TODO
      // [
      // 	GarbageCollectMode.deleteImmediate,
      // 	metricsMin.garbageCollectMode == null ? GarbageCollectMode.normal : metricsMin.garbageCollectMode,
      // ],
      metrics,
      metricsMin
    };
  }

  function optionsGenerator(rnd, options) {
    return {
      countObjects: generateNumber(rnd, options.countObjects),
      countValues: generateNumber(rnd, options.countValues),
      garbageCollectMode: generateNumber(rnd, options.garbageCollectMode),
      metrics: options.metrics,
      metricsMin: options.metricsMin
    };
  }

  // endregion
  // region state
  function createState(rnd, options) {
    switch (options.garbageCollectMode) {
      case GarbageCollectMode.deleteImmediate:
        webrainOptions.callState.garbageCollect.disabled = false;
        webrainOptions.callState.garbageCollect.bulkSize = 1000;
        webrainOptions.callState.garbageCollect.interval = 0;
        webrainOptions.callState.garbageCollect.minLifeTime = 0;
        break;

      case GarbageCollectMode.disabled:
        webrainOptions.callState.garbageCollect.disabled = true;
        break;

      case GarbageCollectMode.normal:
        webrainOptions.callState.garbageCollect.disabled = false;
        webrainOptions.callState.garbageCollect.bulkSize = 100;
        webrainOptions.callState.garbageCollect.interval = 100;
        webrainOptions.callState.garbageCollect.minLifeTime = 50;
        break;

      default:
        throw new Error('Unknown GarbageCollectMode:' + options.garbageCollectMode);
    }

    options.metrics.countObjects = options.countObjects;
    options.metrics.garbageCollectMode = options.garbageCollectMode;
    options.metrics.countValues = options.countValues;
    const seed = rnd.nextSeed();
    const objects = generateItems(new Random(seed), options.countObjects, generateObject);
    const checkObjects = generateItems(new Random(seed), options.countObjects, generateCheckObject);
    assertObjects(objects, checkObjects);
    return {
      objects: new Objects(objects, generateSourceDests(rnd)),
      checkObjects: new CheckObjects(checkObjects),
      unbinds: [],
      options
    };
  }

  // endregion
  // region action
  async function action(rnd, state) {
    state.options.metrics.iterations++;
    const objectNumber = rnd.nextInt(state.objects.objects.length);
    const propName = rnd.nextArrayItem(propNames);
    let shouldWait = false;

    if (rnd.nextBoolean(0.8)) {
      shouldWait = true;
      const value = rnd.nextInt(state.options.countValues);
      state.options.metrics.countSets++;
      state.options.metrics.countSetsLast++;
      state.options.metrics.countChecksLast = 0;
      state.objects.setValue(objectNumber, propName, value);
      state.checkObjects.setValue(objectNumber, propName, value);
    } else if (rnd.nextBoolean()) {
      shouldWait = true;
      const objectNumberTo = rnd.nextInt(state.objects.objects.length);
      const propNameTo = rnd.nextArrayItem(propNames);
      state.options.metrics.countSetsLast = 0;
      state.options.metrics.countChecksLast = 0;

      if (rnd.nextBoolean()) {
        state.options.metrics.countBinds++;
        state.objects.bindOneWay(rnd, objectNumber, propName, objectNumberTo, propNameTo);
        state.checkObjects.bindOneWay(rnd, objectNumber, propName, objectNumberTo, propNameTo);
      } else {
        state.options.metrics.countBinds += 2;
        state.objects.bindTwoWay(rnd, objectNumber, propName, objectNumberTo, propNameTo);
        state.checkObjects.bindTwoWay(rnd, objectNumber, propName, objectNumberTo, propNameTo);
      }
    } else {
      const len = state.checkObjects.unbinds.length;

      if (len > 0) {
        state.options.metrics.countUnBinds++;
        const seed = rnd.nextSeed();
        const unbind = new Random(seed).pullArrayItem(state.objects.unbinds);
        const checkUnbind = new Random(seed).pullArrayItem(state.checkObjects.unbinds);
        unbind();
        checkUnbind();
      }
    }

    assert.strictEqual(state.objects.unbinds.length, state.checkObjects.unbinds.length); // if (shouldWait) {

    for (let i = 0, len = 1 + state.checkObjects.countBindings * 3; i < len; i++) {
      await delay(1); // if (equalObjects(state.objects.objects, state.checkObjects.objects)) {
      // 	return
      // }
    } // }


    assertObjects(state.objects.objects, state.checkObjects.objects);
  } // endregion
  // region testIteration


  const testIteration = testIterationBuilder({
    // waitAsyncAll: {
    // 	weight: 0.05,
    // 	async after(rnd, state) {
    // 		for (let i = 0; i < 50; i++) {
    // 			await delay(1)
    // 		}
    // 		// await delay(1000)
    // 		state.options.metrics.countChecks++
    // 		state.options.metrics.countChecksLast++
    // 		assertObjects(state.objects.objects, state.checkObjects.objects)
    // 	},
    // },
    // waitAsyncRandom: {
    // 	weight: 0.2,
    // },
    action: {
      weight: 1,
      func: action
    }
  }); // endregion
  // region testIterator

  const testIterator = testIteratorBuilder(createState, {
    before(rns, state) {
      reduceCallStates(2000000000, 0);
    },

    after(rnd, state) {
      for (let i = 0, len = state.objects.unbinds.length; i < len; i++) {
        state.objects.unbinds[i]();
        state.checkObjects.unbinds[i]();
      }
    },

    stopPredicate(iterationNumber, timeStart, state) {
      const metrics = state.options.metrics;
      const metricsMin = state.options.metricsMin;

      if (metrics.iterations > metricsMin.iterations) {
        return true;
      }

      if (metrics.countBinds > metricsMin.countBinds) {
        return true;
      }

      if (metrics.countBinds === metricsMin.countBinds) {
        if (metrics.countSetsLast > metricsMin.countSetsLast) {
          return true;
        }

        if (metrics.countSetsLast === metricsMin.countSetsLast) {
          if (metrics.countChecksLast > metricsMin.countChecksLast) {
            return true;
          }

          if (metrics.countChecksLast === metricsMin.countChecksLast) {
            return true;
          }
        }
      }

      return iterationNumber >= 100;
    },

    testIteration,

    consoleThrowPredicate() {
      return this === 'error' || this === 'warn';
    }

  }); // endregion
  // region randomTest

  const randomTest = randomTestBuilder(createMetrics, optionsPatternBuilder, optionsGenerator, {
    compareMetrics,
    // searchBestError: searchBestErrorBuilderNode({
    // 	reportFilePath: './tmp/test-cases/depend/bindings/base.txt',
    // 	consoleOnlyBestErrors: true,
    // }),
    searchBestError: searchBestErrorBuilder({
      consoleOnlyBestErrors: true
    }),
    testIterator
  }); // endregion

  xit('base', async function () {
    /* tslint:disable:max-line-length */
    clearCallStates();
    await randomTest({
      stopPredicate: testRunnerMetrics => {
        return false; // return testRunnerMetrics.timeFromStart >= 30000
      },
      // customSeed: 584765156,
      // metricsMin: {"countObjects":1,"iterations":3,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":1,"countChecks":0},
      // customSeed: 503049265,
      // metricsMin: {"countObjects":1,"iterations":3,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":1,"countChecks":0},
      // customSeed: 783167148,
      // metricsMin: {"countObjects":1,"iterations":3,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":1,"countChecks":0},
      // customSeed: 622515043,
      // metricsMin: {"garbageCollectMode":0,"countObjects":1,"countValues":1,"iterations":5,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":3,"countChecks":0},
      // customSeed: 485614596,
      // metricsMin: {"garbageCollectMode":0,"countObjects":1,"iterations":3,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":1,"countChecks":0,"countValues":1},
      // customSeed: 828925130,
      // metricsMin: {"garbageCollectMode":0,"countObjects":1,"iterations":3,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":1,"countChecks":0,"countValues":1},
      // customSeed: 580113113,
      // metricsMin: {"garbageCollectMode":0,"countObjects":1,"iterations":3,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":1,"countChecks":0,"countValues":1},
      // customSeed: 756600112,
      // metricsMin: {garbageCollectMode: 0, countObjects: 1, iterations: 3, countUnBinds: 0, countBinds: 2, countSetsLast: 0, countChecksLast: 0, countSets: 1, countChecks: 0, countValues: 1},
      // customSeed: 746205876,
      // metricsMin: {"garbageCollectMode":1,"countObjects":3,"iterations":55,"countUnBinds":4,"countBinds":13,"countSetsLast":0,"countChecksLast":0,"countSets":43,"countChecks":0,"countValues":4},
      // customSeed: 47784214,
      // metricsMin: {"garbageCollectMode":1,"countObjects":3,"iterations":28,"countUnBinds":2,"countBinds":6,"countSetsLast":0,"countChecksLast":0,"countSets":22,"countChecks":0,"countValues":4},
      customSeed: 454986460,
      metricsMin: {
        garbageCollectMode: 1,
        countObjects: 1,
        iterations: 5,
        countUnBinds: 1,
        countBinds: 2,
        countSetsLast: 0,
        countChecksLast: 0,
        countSets: 2,
        countChecks: 0,
        countValues: 2
      },
      searchBestError: true
    });
    await delay(1000);
    clearCallStates(); // process.exit(1)

    /* tslint:enable:max-line-length */
  });
});