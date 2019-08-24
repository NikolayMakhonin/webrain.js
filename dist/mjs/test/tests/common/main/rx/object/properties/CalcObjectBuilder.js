import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";

/* tslint:disable:no-duplicate-string */

/* eslint-disable guard-for-in */
import { ObservableObject } from '../../../../../../../main/common/rx/object/ObservableObject';
import { CalcObjectBuilder } from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder';
import { connector } from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder';
xdescribe('common > main > rx > properties > CalcObjectBuilder', function () {
  it('calc', function () {
    var Class1 =
    /*#__PURE__*/
    function (_ObservableObject) {
      _inherits(Class1, _ObservableObject);

      function Class1() {
        _classCallCheck(this, Class1);

        return _possibleConstructorReturn(this, _getPrototypeOf(Class1).apply(this, arguments));
      }

      return Class1;
    }(ObservableObject);

    new CalcObjectBuilder(Class1.prototype).calc('prop1', {
      input: connector(function (b) {
        return b.connect('connectValue1');
      })
    });
  });
});