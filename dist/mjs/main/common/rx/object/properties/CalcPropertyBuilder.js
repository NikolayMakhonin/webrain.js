import { CalcProperty } from './CalcProperty';
import { CalcPropertyDependenciesBuilder } from './CalcPropertyDependenciesBuilder';
import { subscribeDependencies } from './DependenciesBuilder';
export function calcPropertyFactory(buildDependencies, calcFunc, calcOptions, valueOptions, initValue) {
  let dependencies;

  if (buildDependencies) {
    const dependenciesBuilder = new CalcPropertyDependenciesBuilder(b => b.valuePropertyName('input'));
    buildDependencies(dependenciesBuilder);
    dependencies = dependenciesBuilder.dependencies;
  }

  return () => {
    const calcProperty = new CalcProperty(calcFunc, calcOptions, valueOptions, initValue);

    if (dependencies) {
      subscribeDependencies(calcProperty, calcProperty, dependencies);
    }

    return calcProperty;
  };
}