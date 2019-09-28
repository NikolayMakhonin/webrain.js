"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _funcPropertiesPath = require("../../../../../../../main/common/rx/deep-subscribe/helpers/func-properties-path");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../../main/common/test/Mocha");

var _funcPropertiesPath2 = require("./src/func-properties-path");

/* eslint-disable no-useless-escape,computed-property-spacing */
(0, _Mocha.describe)('common > main > rx > deep-subscribe > func-properties-path', function () {
  (0, _Mocha.it)('parsePropertiesPathString', function () {
    var path = '. o[ "\\`\\"\\\'\\\\`\'[]]" ] . o [ 0 ] . o [ \'\\`\\"\\\'\\\\`"][]\' ] . o';

    function testParse(funcStr) {
      _Assert.assert.strictEqual((0, _funcPropertiesPath.parsePropertiesPathString)(funcStr), path);
    }

    testParse("(a) => a " + path);
    testParse("b => ( ( ( b " + path + " ) ) ) ");
    testParse("c =>  {  return c " + path + " ; }");
    testParse("function  (d)  {  return d " + path + "}");
    testParse("function funcName (e)  {  return e " + path + "}");
    testParse(" funcName (f)  {  return f " + path + "}");
    testParse(new Function('o', "return o" + path));
    testParse("(a /* comment */ ) => coverage(), coverage(), a " + path);
    testParse("b /* comment */ => coverage(), ( coverage(), coverage(), ( coverage(), ( coverage(), b " + path + " ) ) ) ");
    testParse("c /* comment */ =>  { coverage()\n return coverage(), c " + path + " ; }");
    testParse("function  (d /* comment */ )  { coverage() \n return ( coverage(), ( coverage(), d " + path + "} ) )");
    testParse("function funcName (e /*/** comment ***/ )  {  coverage() \n return ( coverage(), ( coverage(), e " + path + "}");
    testParse(" funcName (f /* comment */ )  {  coverage()  return f " + path + "}");
    testParse(new Function('o', "coverage() \n return o" + path));

    _Assert.assert.throws(function () {
      return (0, _funcPropertiesPath.parsePropertiesPathString)('');
    }, Error);

    _Assert.assert.throws(function () {
      return (0, _funcPropertiesPath.parsePropertiesPathString)("(a) => b " + path);
    }, Error);

    _Assert.assert.throws(function () {
      return (0, _funcPropertiesPath.parsePropertiesPathString)("b => ( ( c " + path + " ) ) ");
    }, Error);

    _Assert.assert.throws(function () {
      return (0, _funcPropertiesPath.parsePropertiesPathString)(new Function('w', "return o" + path));
    }, Error);
  });
  (0, _Mocha.it)('parsePropertiesPath', function () {
    var _context;

    var path = '. o[ "\\`\\"\\\'\\\\`\'[]]" ] // [0]\r\n/*\r\n*/ . o [ 0 ] . o [ \'\\`\\"\\\'\\\\`"][]\' ] . o';

    function assertParse(properties) {
      _Assert.assert.deepStrictEqual(properties, ['o', '`\"\'\\`\'[]]', 'o', '0', 'o', '`\"\'\\`\"][]', 'o']);
    }

    function testParse(propertiesPath) {
      assertParse((0, _funcPropertiesPath.parsePropertiesPath)(propertiesPath));
    }

    function testParseFunc(func) {
      assertParse((0, _funcPropertiesPath.getFuncPropertiesPath)(func));
      assertParse((0, _funcPropertiesPath.getFuncPropertiesPath)(func));
    }

    testParse(path);
    testParseFunc(new Function('o', "return o" + path + " ; "));
    testParseFunc(function (o) {
      return o.o["\`\"\'\\`'[]]"].o[0].o['\`\"\'\\`"][]'].o;
    });
    (0, _forEach.default)(_context = (0, _funcPropertiesPath2.compileTest)()).call(_context, function (result) {
      assertParse(result);
    });

    _Assert.assert.throws(function () {
      return (0, _funcPropertiesPath.parsePropertiesPath)('.' + path);
    }, Error);
  });
});