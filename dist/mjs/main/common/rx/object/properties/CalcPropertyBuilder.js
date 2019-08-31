import { CalcProperty } from './CalcProperty';
import { CalcPropertyDependenciesBuilder } from './CalcPropertyDependenciesBuilder';
import { subscribeDependencies } from './DependenciesBuilder';
export function calcPropertyFactory(calcFunc, calcOptions, valueOptions, initValue, buildDependencies) {
  var dependencies;

  if (buildDependencies) {
    var _dependenciesBuilder = new CalcPropertyDependenciesBuilder(function (b) {
      return b.propertyName('input');
    });

    buildDependencies(_dependenciesBuilder);
    dependencies = _dependenciesBuilder.dependencies;
  }

  return function () {
    var calcProperty = new CalcProperty(calcFunc, calcOptions, valueOptions, initValue);

    if (dependencies) {
      subscribeDependencies(calcProperty, calcProperty, dependencies);
    }

    return calcProperty;
  };
}