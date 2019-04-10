"use strict";

var _funcPropertiesPath = require("../../../../../../../main/common/rx/deep-subscribe/helpers/func-properties-path");

/* eslint-disable no-useless-escape,computed-property-spacing */
describe('common > main > rx > deep-subscribe > func-properties-path', function () {
  it('parsePropertiesPathString', function () {
    const path = '. o[ "\\`\\"\\\'\\\\`\'[]]" ] . o [ 0 ] . o [ \'\\`\\"\\\'\\\\`"][]\' ] . o';

    function testParse(funcStr) {
      assert.strictEqual((0, _funcPropertiesPath.parsePropertiesPathString)(funcStr), path);
    }

    testParse(`(a) => a ${path}`);
    testParse(`b => ( ( b ${path} ) ) `);
    testParse(`c =>  {  return c ${path} ; }`);
    testParse(`function  (d)  {  return d ${path}}`);
    testParse(`function funcName (e)  {  return e ${path}}`);
    testParse(` funcName (f)  {  return f ${path}}`);
    testParse(new Function('o', `return o${path}`));
    assert.throws(() => (0, _funcPropertiesPath.parsePropertiesPathString)(''), Error);
    assert.throws(() => (0, _funcPropertiesPath.parsePropertiesPathString)(`(a) => b ${path}`), Error);
    assert.throws(() => (0, _funcPropertiesPath.parsePropertiesPathString)(`b => ( ( c ${path} ) ) `), Error);
    assert.throws(() => (0, _funcPropertiesPath.parsePropertiesPathString)(new Function('w', `return o${path}`)), Error);
  });
  it('parsePropertiesPath', function () {
    const path = '. o[ "\\`\\"\\\'\\\\`\'[]]" ] . o [ 0 ] . o [ \'\\`\\"\\\'\\\\`"][]\' ] . o';

    function assertParse(properties) {
      assert.deepStrictEqual(properties, ['o', '`\"\'\\`\'[]]', 'o', '0', 'o', '`\"\'\\`\"][]', 'o']);
    }

    function testParse(propertiesPath) {
      assertParse((0, _funcPropertiesPath.parsePropertiesPath)(propertiesPath));
    }

    function testParseFunc(func) {
      assertParse((0, _funcPropertiesPath.getFuncPropertiesPath)(func));
      assertParse((0, _funcPropertiesPath.getFuncPropertiesPath)(func));
    }

    testParse(path);
    testParseFunc(new Function('o', `return o${path} ; `));
    testParseFunc(o => o.o["\`\"\'\\`'[]]"].o[0].o['\`\"\'\\`"][]'].o);
    assert.throws(() => (0, _funcPropertiesPath.parsePropertiesPath)('.' + path), Error);
  });
});