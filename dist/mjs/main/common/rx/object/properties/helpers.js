import { ObservableClass } from '../ObservableClass';
export function observableClass(build, baseClass) {
  class NewPropertyClass extends (baseClass != null ? baseClass : ObservableClass) {}

  build(NewPropertyClass.prototype);
  return NewPropertyClass;
}
export function createConnector(object, factory) {
  return factory(object);
}