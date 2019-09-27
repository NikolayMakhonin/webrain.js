"use strict";

exports.__esModule = true;
exports.calcPropertyFactory = calcPropertyFactory;

var _CalcProperty = require("./CalcProperty");

var _CalcPropertyDependenciesBuilder = require("./CalcPropertyDependenciesBuilder");

var _DependenciesBuilder = require("./DependenciesBuilder");

function calcPropertyFactory(_ref) {
  var buildDependencies = _ref.dependencies,
      calcFunc = _ref.calcFunc,
      name = _ref.name,
      calcOptions = _ref.calcOptions,
      valueOptions = _ref.valueOptions,
      initValue = _ref.initValue;
  var dependencies;

  if (buildDependencies) {
    var _dependenciesBuilder = new _CalcPropertyDependenciesBuilder.CalcPropertyDependenciesBuilder(function (b) {
      return b.valuePropertyName('input');
    });

    buildDependencies(_dependenciesBuilder);
    dependencies = _dependenciesBuilder.dependencies;
  }

  return function () {
    var calcProperty = new _CalcProperty.CalcProperty({
      calcFunc: calcFunc,
      name: name,
      calcOptions: calcOptions,
      valueOptions: valueOptions,
      initValue: initValue
    });

    if (dependencies) {
      (0, _DependenciesBuilder.subscribeDependencies)(calcProperty, calcProperty, dependencies);
    }

    return calcProperty;
  };
}