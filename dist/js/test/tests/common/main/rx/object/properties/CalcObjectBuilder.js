"use strict";

var _ObservableObject = require("../../../../../../../main/common/rx/object/ObservableObject");

var _CalcObjectBuilder = require("../../../../../../../main/common/rx/object/properties/CalcObjectBuilder");

var _Connector = require("../../../../../../../main/common/rx/object/properties/Connector");

/* tslint:disable:no-duplicate-string */

/* eslint-disable guard-for-in */
describe('common > main > rx > properties > CalcObjectBuilder', function () {
  it('calc', function () {
    class Class1 extends _ObservableObject.ObservableObject {}

    const result = new _CalcObjectBuilder.CalcObjectBuilder(Class1.prototype).calc('prop1', (0, _Connector.connector)(c => c.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source['@wait']))), {
      dependencies: b => b.path(o => o.connectValue1),

      calcFunc(input, valueProperty) {
        valueProperty.value = new Date(0);
      }

    }).object.prop1;
  });
});