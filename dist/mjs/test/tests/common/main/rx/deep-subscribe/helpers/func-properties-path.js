/* eslint-disable no-useless-escape,computed-property-spacing */
import { getFuncPropertiesPath, parsePropertiesPath, parsePropertiesPathString } from '../../../../../../../main/common/rx/deep-subscribe/helpers/func-properties-path';
import { assert } from '../../../../../../../main/common/test/Assert';
import { compileTest } from './src/func-properties-path';
describe('common > main > rx > deep-subscribe > func-properties-path', function () {
  it('parsePropertiesPathString', function () {
    var path = '. o[ "\\`\\"\\\'\\\\`\'[]]" ] . o [ 0 ] . o [ \'\\`\\"\\\'\\\\`"][]\' ] . o';

    function testParse(funcStr) {
      assert.strictEqual(parsePropertiesPathString(funcStr), path);
    }

    testParse("(a) => a ".concat(path));
    testParse("b => ( ( ( b ".concat(path, " ) ) ) "));
    testParse("c =>  {  return c ".concat(path, " ; }"));
    testParse("function  (d)  {  return d ".concat(path, "}"));
    testParse("function funcName (e)  {  return e ".concat(path, "}"));
    testParse(" funcName (f)  {  return f ".concat(path, "}"));
    testParse(new Function('o', "return o".concat(path)));
    testParse("(a /* comment */ ) => coverage(), coverage(), a ".concat(path));
    testParse("b /* comment */ => coverage(), ( coverage(), coverage(), ( coverage(), ( coverage(), b ".concat(path, " ) ) ) "));
    testParse("c /* comment */ =>  { coverage()\n return coverage(), c ".concat(path, " ; }"));
    testParse("function  (d /* comment */ )  { coverage() \n return ( coverage(), ( coverage(), d ".concat(path, "} ) )"));
    testParse("function funcName (e /*/** comment ***/ )  {  coverage() \n return ( coverage(), ( coverage(), e ".concat(path, "}"));
    testParse(" funcName (f /* comment */ )  {  coverage()  return f ".concat(path, "}"));
    testParse(new Function('o', "coverage() \n return o".concat(path)));
    assert["throws"](function () {
      return parsePropertiesPathString('');
    }, Error);
    assert["throws"](function () {
      return parsePropertiesPathString("(a) => b ".concat(path));
    }, Error);
    assert["throws"](function () {
      return parsePropertiesPathString("b => ( ( c ".concat(path, " ) ) "));
    }, Error);
    assert["throws"](function () {
      return parsePropertiesPathString(new Function('w', "return o".concat(path)));
    }, Error);
  });
  it('parsePropertiesPath', function () {
    var path = '. o[ "\\`\\"\\\'\\\\`\'[]]" ] // [0]\r\n/*\r\n*/ . o [ 0 ] . o [ \'\\`\\"\\\'\\\\`"][]\' ] . o';

    function assertParse(properties) {
      assert.deepStrictEqual(properties, ['o', '`\"\'\\`\'[]]', 'o', '0', 'o', '`\"\'\\`\"][]', 'o']);
    }

    function testParse(propertiesPath) {
      assertParse(parsePropertiesPath(propertiesPath));
    }

    function testParseFunc(func) {
      assertParse(getFuncPropertiesPath(func));
      assertParse(getFuncPropertiesPath(func));
    }

    testParse(path);
    testParseFunc(new Function('o', "return o".concat(path, " ; ")));
    testParseFunc(function (o) {
      return o.o["\`\"\'\\`'[]]"].o[0].o['\`\"\'\\`"][]'].o;
    });
    compileTest().forEach(function (result) {
      assertParse(result);
    });
    assert["throws"](function () {
      return parsePropertiesPath('.' + path);
    }, Error);
  });
});