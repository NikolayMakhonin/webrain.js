import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { RuleType } from './contracts/rules';
import { getFuncPropertiesPath } from './helpers/func-properties-path';
export var RuleBuilder =
/*#__PURE__*/
function () {
  function RuleBuilder() {
    _classCallCheck(this, RuleBuilder);
  }

  _createClass(RuleBuilder, [{
    key: "path",
    value: function path(getValueFunc) {
      var _this = this;

      var ruleLast = this._ruleLast;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var propertyName = _step.value;
          var rule = {
            type: RuleType.Property,
            predicate: function predicate(name) {
              return name === propertyName;
            },
            description: propertyName
          };

          if (ruleLast) {
            ruleLast.next = rule;
          } else {
            _this.rule = rule;
          }

          ruleLast = rule;
        };

        for (var _iterator = getFuncPropertiesPath(getValueFunc)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this._ruleLast = ruleLast;
      return this;
    }
  }, {
    key: "property",
    value: function property(predicate) {
      var ruleLast = this._ruleLast;
      var rule = {
        type: RuleType.Property,
        predicate: predicate
      };

      if (ruleLast) {
        ruleLast.next = rule;
      } else {
        this.rule = rule;
      }

      this._ruleLast = rule;
      return this;
    }
  }, {
    key: "any",
    value: function any() {
      var ruleLast = this._ruleLast;

      for (var _len = arguments.length, getChilds = new Array(_len), _key = 0; _key < _len; _key++) {
        getChilds[_key] = arguments[_key];
      }

      var rule = {
        type: RuleType.Any,
        rules: getChilds.map(function (o) {
          return o(new RuleBuilder()).rule;
        })
      };

      if (ruleLast) {
        ruleLast.next = rule;
      } else {
        this.rule = rule;
      }

      this._ruleLast = rule;
      return this;
    }
  }, {
    key: "repeat",
    value: function repeat(countMin, countMax, getChild) {
      var ruleLast = this._ruleLast;
      var rule = {
        type: RuleType.Repeat,
        countMin: countMin,
        countMax: countMax,
        rule: getChild(new RuleBuilder()).rule
      };

      if (ruleLast) {
        ruleLast.next = rule;
      } else {
        this.rule = rule;
      }

      this._ruleLast = rule;
      return this;
    }
  }]);

  return RuleBuilder;
}();