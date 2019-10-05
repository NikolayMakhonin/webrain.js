import { CalcProperty } from './CalcProperty';
import { CalcPropertyDependenciesBuilder } from './CalcPropertyDependenciesBuilder';
import { subscribeDependencies } from './DependenciesBuilder';
export function calcPropertyFactory({
  dependencies: buildDependencies,
  calcFunc,
  name,
  calcOptions,
  initValue
}) {
  let dependencies;

  if (buildDependencies) {
    const dependenciesBuilder = new CalcPropertyDependenciesBuilder(b => b.propertyName('input'));
    buildDependencies(dependenciesBuilder);
    dependencies = dependenciesBuilder.dependencies;
  }

  return () => {
    const calcProperty = new CalcProperty({
      calcFunc,
      name,
      calcOptions,
      initValue
    });

    if (dependencies) {
      subscribeDependencies(calcProperty.state, calcProperty, dependencies);
    }

    return calcProperty;
  };
}