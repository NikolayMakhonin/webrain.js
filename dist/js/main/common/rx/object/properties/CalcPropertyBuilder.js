"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.calcPropertyFactory = calcPropertyFactory;

var _CalcProperty = require("./CalcProperty");

var _CalcPropertyDependenciesBuilder = require("./CalcPropertyDependenciesBuilder");

var _DependenciesBuilder = require("./DependenciesBuilder");

function calcPropertyFactory(calcFunc, calcOptions, valueOptions, initValue, buildDependencies) {
  var dependencies;

  if (buildDependencies) {
    var _dependenciesBuilder = new _CalcPropertyDependenciesBuilder.CalcPropertyDependenciesBuilder(function (b) {
      return b.propertyName('input');
    });

    buildDependencies(_dependenciesBuilder);
    dependencies = _dependenciesBuilder.dependencies;
  }

  return function () {
    var calcProperty = new _CalcProperty.CalcProperty(calcFunc, calcOptions, valueOptions, initValue);

    if (dependencies) {
      (0, _DependenciesBuilder.subscribeDependencies)(calcProperty, calcProperty, dependencies);
    }

    return calcProperty;
  };
}