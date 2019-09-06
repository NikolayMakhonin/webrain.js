"use strict";

exports.__esModule = true;
exports.compileTest = compileTest;

var _funcPropertiesPath = require("../../../../../../../../main/common/rx/deep-subscribe/helpers/func-properties-path");

/* eslint-disable space-in-parens,no-sequences,arrow-parens,no-extra-parens,no-shadow,computed-property-spacing,no-useless-escape,no-whitespace-before-property */
// compile test
function coverage() {
  return Math.random() + 12345;
}

function compileTest() {
  return [(0, _funcPropertiesPath.getFuncPropertiesPath)(function (o
  /* comment */
  ) {
    return coverage(), o.o["\`\"\'\\`'[]]"].o[0].o['\`\"\'\\`"][]'].o;
  }), (0, _funcPropertiesPath.getFuncPropertiesPath)(function (o
  /* comment */
  ) {
    return coverage(), o.o["\`\"\'\\`'[]]"].o[0].o['\`\"\'\\`"][]'].o;
  }), (0, _funcPropertiesPath.getFuncPropertiesPath)(function test(o
  /* comment */
  ) {
    return coverage(), o.o["\`\"\'\\`'[]]"].o[0].o['\`\"\'\\`"][]'].o;
  })];
}