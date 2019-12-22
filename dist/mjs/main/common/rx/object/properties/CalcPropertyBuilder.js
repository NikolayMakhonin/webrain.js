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
      // subscribeDependencies(calcProperty.state, calcProperty, dependencies)
      let states;
      let unsubscribe;
      calcProperty.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribers => {
        if (unsubscribe) {
          states = unsubscribe();
          unsubscribe = null;
        }

        if (hasSubscribers) {
          unsubscribe = subscribeDependencies(calcProperty.state, calcProperty, dependencies, states);
        }
      }, `CalcProperty.${calcProperty.state.name}.hasSubscribersObservable for subscribeDependencies`);
    }

    return calcProperty;
  };
}