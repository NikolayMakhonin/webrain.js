"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.PropertiesPath = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _objectUniqueId = require("../../../helpers/object-unique-id");

var PropertiesPath =
/*#__PURE__*/
function () {
  function PropertiesPath(value, parent, key, keyType, rule) {
    (0, _classCallCheck2.default)(this, PropertiesPath);
    this.value = value;
    this.parent = parent;
    this.key = key;
    this.keyType = keyType;
    this.rule = rule;
  } // region id


  (0, _createClass2.default)(PropertiesPath, [{
    key: "buildId",
    value: function buildId(buffer) {
      if (buffer === void 0) {
        buffer = [];
      }

      if (this.parent) {
        buffer.push(this.parent.id);
        buffer.push((0, _objectUniqueId.getObjectUniqueId)(this.parent.value));
        buffer.push(this.keyType);
        buffer.push(this.key);
      }

      return buffer;
    }
  }, {
    key: "buildString",
    // endregion
    // region description
    value: function buildString(buffer) {
      if (buffer === void 0) {
        buffer = [];
      }

      if (this.parent) {
        buffer.push(this.parent.toString());
        buffer.push('.');
      }

      buffer.push(this.key);

      if (this.rule) {
        buffer.push('(');
        buffer.push(this.rule.description);
        buffer.push(')');
      }

      return buffer;
    }
  }, {
    key: "toString",
    value: function toString() {
      var _description = this._description;

      if (!_description) {
        _description = this.buildString().join('_');
        this._description = _description;
      }

      return _description;
    } // endregion

  }, {
    key: "id",
    get: function get() {
      var _id = this._id;

      if (!_id) {
        _id = this.buildId().join('_');
        this._id = _id;
      }

      return _id;
    }
  }]);
  return PropertiesPath;
}();

exports.PropertiesPath = PropertiesPath;