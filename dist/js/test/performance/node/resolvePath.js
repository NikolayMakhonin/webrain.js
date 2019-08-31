"use strict";

var _rdtsc = require("rdtsc");

var _ThenableSync = require("../../../main/common/async/ThenableSync");

var _ObservableObject = require("../../../main/common/rx/object/ObservableObject");

var _CalcObjectBuilder = require("../../../main/common/rx/object/properties/CalcObjectBuilder");

var _CalcPropertyBuilder = require("../../../main/common/rx/object/properties/CalcPropertyBuilder");

var _helpers = require("../../../main/common/rx/object/properties/helpers");

/* tslint:disable:no-empty */
describe('resolvePath', function () {
  this.timeout(300000);

  class Class extends _ObservableObject.ObservableObject {
    constructor(...args) {
      super(...args);
      this.simple = {
        value: this
      };
    }

  }

  const simple = {};
  new _CalcObjectBuilder.CalcObjectBuilder(Class.prototype).writable('observable').calc('calc', simple, (0, _CalcPropertyBuilder.calcPropertyFactory)((input, valueProperty) => {
    valueProperty.value = input.value;
    return _ThenableSync.ThenableSync.createResolved(null);
  }));
  const object = new Class();
  object.simple = simple;
  simple.value = object;
  it('simple', function () {
    const test = (0, _helpers.resolvePath)(object)();
    const result = (0, _rdtsc.calcPerformance)(20000, () => {}, () => (0, _helpers.resolvePath)(true)(), () => (0, _helpers.resolvePath)(object)(), () => (0, _helpers.resolvePath)(object)(o => o.simple)(), () => (0, _helpers.resolvePath)(object)(o => o.observable)(), () => (0, _helpers.resolvePath)(object)(o => o.wait, true)(), () => (0, _helpers.resolvePath)(object)(o => o.calc)(), () => (0, _helpers.resolvePath)(object)(o => o.calc)(o => o.wait, true)());
    console.log(result);
  });
});