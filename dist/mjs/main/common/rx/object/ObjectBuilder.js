export class ObjectBuilder {
  constructor(object) {
    this.object = object || {};
  }

  func(name, func) {
    this.object[name] = func;
    return this;
  }

}