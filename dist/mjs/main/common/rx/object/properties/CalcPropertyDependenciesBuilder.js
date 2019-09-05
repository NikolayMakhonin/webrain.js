import { CalcObjectDebugger } from './CalcObjectDebugger';
import { DependenciesBuilder } from './DependenciesBuilder';
export class CalcPropertyDependenciesBuilder extends DependenciesBuilder {
  constructor(buildSourceRule) {
    super(buildSourceRule);
  }

  invalidateOn(buildRule, predicate) {
    this.actionOn(buildRule, (target, value, parent, propertyName) => {
      CalcObjectDebugger.Instance.onDependencyChanged(target, value, parent, propertyName);
      target.invalidate();
    }, predicate);
    return this;
  }

  clearOn(buildRule, predicate) {
    this.actionOn(buildRule, (target, value, parent, propertyName) => {
      CalcObjectDebugger.Instance.onDependencyChanged(target, value, parent, propertyName);
      target.clear();
    }, predicate);
    return this;
  }

}