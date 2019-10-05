/* tslint:disable:no-empty */
import { calcPerformance } from 'rdtsc';
import { ThenableSync } from '../../../main/common/async/ThenableSync';
import { ObservableClass } from '../../../main/common/rx/object/ObservableClass';
import { CalcObjectBuilder } from '../../../main/common/rx/object/properties/CalcObjectBuilder';
import { calcPropertyFactory } from '../../../main/common/rx/object/properties/CalcPropertyBuilder';
import { resolvePath } from '../../../main/common/rx/object/properties/helpers';
import { describe, it } from '../../../main/common/test/Mocha';
describe('resolvePath', function () {
  this.timeout(300000);

  class Class extends ObservableClass {
    constructor(...args) {
      super(...args);
      this.simple = {
        value: this
      };
    }

  }

  const simple = {};
  new CalcObjectBuilder(Class.prototype).writable('observable').calc('calc', simple, calcPropertyFactory({
    dependencies: null,

    calcFunc(state) {
      state.value = state.input.value;
      return ThenableSync.createResolved(null);
    }

  }));
  const object = new Class();
  object.simple = simple;
  simple.value = object;
  it('simple', function () {
    const test = resolvePath(object)();
    const result = calcPerformance(20000, () => {}, () => resolvePath(true)(), () => resolvePath(object)(), () => resolvePath(object)(o => o.simple)(), () => resolvePath(object)(o => o.observable)(), () => resolvePath(object)(o => o.wait, true)(), () => resolvePath(object)(o => o.calc)(), () => resolvePath(object)(o => o.calc)(o => o.wait, true)());
    console.log(result);
  });
});