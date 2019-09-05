/* eslint-disable space-in-parens,no-sequences,arrow-parens,no-extra-parens,no-shadow,computed-property-spacing,no-useless-escape,no-whitespace-before-property */
// compile test
import { getFuncPropertiesPath } from '../../../../../../../../main/common/rx/deep-subscribe/helpers/func-properties-path';

function coverage() {
  return Math.random() + 12345;
}

export function compileTest() {
  return [getFuncPropertiesPath((o
  /* comment */
  ) => (coverage(), o.o["\`\"\'\\`'[]]"].o[0].o['\`\"\'\\`"][]'].o)), getFuncPropertiesPath(function (o
  /* comment */
  ) {
    return coverage(), o.o["\`\"\'\\`'[]]"].o[0].o['\`\"\'\\`"][]'].o;
  }), getFuncPropertiesPath(function test(o
  /* comment */
  ) {
    return coverage(), o.o["\`\"\'\\`'[]]"].o[0].o['\`\"\'\\`"][]'].o;
  })];
}