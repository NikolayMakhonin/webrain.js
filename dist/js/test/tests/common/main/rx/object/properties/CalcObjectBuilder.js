"use strict";

var _ObservableObject = require("../../../../../../../main/common/rx/object/ObservableObject");

var _CalcObjectBuilder = require("../../../../../../../main/common/rx/object/properties/CalcObjectBuilder");

var _ConnectorBuilder = require("../../../../../../../main/common/rx/object/properties/ConnectorBuilder");

/* tslint:disable:no-duplicate-string */

/* eslint-disable guard-for-in */
xdescribe('common > main > rx > properties > CalcObjectBuilder', function () {
  it('calc', function () {
    class Class1 extends _ObservableObject.ObservableObject {}

    new _CalcObjectBuilder.CalcObjectBuilder(Class1.prototype).calc('prop1', {
      input: (0, _ConnectorBuilder.connector)(b => b.connect('connectValue1'))
    });
  });
});