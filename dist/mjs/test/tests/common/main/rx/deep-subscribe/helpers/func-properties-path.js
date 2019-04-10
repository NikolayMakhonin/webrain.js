/* eslint-disable no-useless-escape,computed-property-spacing */
import { getFuncPropertiesPath, parsePropertiesPath, parsePropertiesPathString } from '../../../../../../../main/common/rx/deep-subscribe/helpers/func-properties-path';
describe('common > main > rx > deep-subscribe > func-properties-path', function () {
  it('parsePropertiesPathString', function () {
    var path = '. o[ "\\`\\"\\\'\\\\`\'[]]" ] . o [ 0 ] . o [ \'\\`\\"\\\'\\\\`"][]\' ] . o';

    function testParse(funcStr) {
      assert.strictEqual(parsePropertiesPathString(funcStr), path);
    }

    testParse("(a) => a ".concat(path));
    testParse("b => ( ( b ".concat(path, " ) ) "));
    testParse("c =>  {  return c ".concat(path, " ; }"));
    testParse("function  (d)  {  return d ".concat(path, "}"));
    testParse("function funcName (e)  {  return e ".concat(path, "}"));
    testParse(" funcName (f)  {  return f ".concat(path, "}"));
    testParse(new Function('o', "return o".concat(path)));
    assert.throws(function () {
      return parsePropertiesPathString('');
    }, Error);
    assert.throws(function () {
      return parsePropertiesPathString("(a) => b ".concat(path));
    }, Error);
    assert.throws(function () {
      return parsePropertiesPathString("b => ( ( c ".concat(path, " ) ) "));
    }, Error);
    assert.throws(function () {
      return parsePropertiesPathString(new Function('w', "return o".concat(path)));
    }, Error);
  });
  it('parsePropertiesPath', function () {
    var path = '. o[ "\\`\\"\\\'\\\\`\'[]]" ] . o [ 0 ] . o [ \'\\`\\"\\\'\\\\`"][]\' ] . o';

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
    assert.throws(function () {
      return parsePropertiesPath('.' + path);
    }, Error);
  });
});