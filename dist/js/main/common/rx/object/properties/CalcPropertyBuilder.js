"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcPropertyFactory = calcPropertyFactory;

var _CalcProperty = require("./CalcProperty");

var _CalcPropertyDependenciesBuilder = require("./CalcPropertyDependenciesBuilder");

var _DependenciesBuilder = require("./DependenciesBuilder");

function calcPropertyFactory(calcFunc, calcOptions, valueOptions, initValue, buildDependencies) {
  let dependencies;

  if (buildDependencies) {
    const dependenciesBuilder = new _CalcPropertyDependenciesBuilder.CalcPropertyDependenciesBuilder(b => b.propertyName('input'));
    buildDependencies(dependenciesBuilder);
    dependencies = dependenciesBuilder.dependencies;
  }

  return () => {
    const calcProperty = new _CalcProperty.CalcProperty(calcFunc, calcOptions, valueOptions, initValue);

    if (dependencies) {
      (0, _DependenciesBuilder.subscribeDependencies)(calcProperty, calcProperty, dependencies);
    }

    return calcProperty;
  };
}