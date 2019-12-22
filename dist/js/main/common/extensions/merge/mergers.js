"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.registerMergeable = registerMergeable;
exports.registerMerger = registerMerger;
exports.registerMergerPrimitive = registerMergerPrimitive;
exports.ObjectMerger = exports.TypeMetaMergerCollection = exports.MergerVisitor = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _isFrozen = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/is-frozen"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _helpers = require("../../helpers/helpers");

var _objectUniqueId = require("../../helpers/object-unique-id");

var _set2 = require("../../lists/helpers/set");

var _TypeMeta = require("../TypeMeta");

var _mergeMaps = require("./merge-maps");

var _mergeSets = require("./merge-sets");

/* tslint:disable:no-nested-switch ban-types use-primitive-type */
var ValueState =
/*#__PURE__*/
function () {
  function ValueState(mergerState, target, preferClone, selfAsValue, refs) {
    (0, _classCallCheck2.default)(this, ValueState);
    this.mergerState = mergerState;
    this.target = target;
    this.preferClone = preferClone;
    this.selfAsValue = selfAsValue;
    this.refs = refs;
    var options = this.mergerState.options;
    this.type = options && options.valueType || target.constructor;
  }

  (0, _createClass2.default)(ValueState, [{
    key: "resolveRef",
    value: function resolveRef() {
      if (this._isRef == null) {
        if (this.selfAsValue) {
          this._isRef = false;
        } else {
          var ref = this.getRef();

          if (ref) {
            this.target = ref;
            this._isRef = true;
          } else {
            this._isRef = false;
          }
        }
      }
    }
  }, {
    key: "getRef",
    value: function getRef() {
      var refs = this.refs;

      if (refs) {
        var id = (0, _objectUniqueId.getObjectUniqueId)(this.target);

        if (id != null) {
          var ref = refs[id];
          return ref;
        }
      }

      return null;
    }
  }, {
    key: "setRef",
    value: function setRef(refObj) {
      var id = (0, _objectUniqueId.getObjectUniqueId)(this.target);

      if (id != null) {
        var refs = this.refs;

        if (refs == null) {
          this.refs = refs = [];
        }

        refs[id] = refObj;
      }
    }
  }, {
    key: "canMerge",
    value: function canMerge(source, target) {
      var canMerge = this.merger.canMerge;

      if (canMerge) {
        if (target == null) {
          target = this.target;

          if (this.isRef || source.isRef) {
            return target === source.target ? null : false;
          }
        }

        var result = canMerge(target, source.target);

        if (result == null) {
          return null;
        }

        if (typeof result !== 'boolean') {
          throw new Error("Unknown canMerge() result (" + result.constructor.name + ") for " + this.type.name);
        }

        return result;
      }

      return this.target.constructor === source.constructor;
    }
  }, {
    key: "isRef",
    get: function get() {
      this.resolveRef();
      return this._isRef;
    }
  }, {
    key: "meta",
    get: function get() {
      var _meta = this._meta;

      if (!_meta) {
        _meta = this.mergerState.mergerVisitor.getMeta(this.type);

        if (!_meta) {
          throw new Error("Class (" + (this.type && this.type.name) + ") have no type meta");
        }

        this._meta = _meta;
      }

      return _meta;
    }
  }, {
    key: "merger",
    get: function get() {
      var _merger = this._merger;

      if (!_merger) {
        var meta = this.meta;
        _merger = meta.merger;

        if (!_merger) {
          throw new Error("Class (" + (this.type && this.type.name) + ") type meta have no merger");
        }

        this._merger = _merger;
      }

      return _merger;
    }
  }, {
    key: "merge",
    get: function get() {
      var merger = this.merger;

      if (!merger.merge) {
        throw new Error("Class (" + (this.type && this.type.name) + ") merger have no merge method");
      }

      return merger.merge;
    }
  }, {
    key: "mustBeCloned",
    get: function get() {
      var _mustBeCloned = this._mustBeCloned;

      if (_mustBeCloned == null) {
        var options = this.mergerState.options;
        var valueType = options && options.valueType;
        var metaPreferClone = this.meta.preferClone;

        if (typeof metaPreferClone === 'function') {
          metaPreferClone = metaPreferClone(this.target);
        }

        this._mustBeCloned = _mustBeCloned = (metaPreferClone != null ? metaPreferClone : this.preferClone && !this.isRef && !this.mergerState.mergerVisitor.getStatus(this.target)) || valueType && valueType !== this.target.constructor;
      }

      return _mustBeCloned;
    }
  }, {
    key: "cloneInstance",
    get: function get() {
      var _this = this;

      var _cloneInstance = this._cloneInstance;

      if (_cloneInstance == null) {
        var target = this.target,
            _type = this.type;
        var options = this.mergerState.options;

        _cloneInstance = (options && options.valueFactory || this.meta.valueFactory || function () {
          return (!options || !options.valueType || _this.target.constructor === (options && options.valueType)) && new _type();
        })(target);

        if (!_cloneInstance) {
          throw new Error("Class (" + (0, _helpers.typeToDebugString)(_type) + ") cannot be clone");
        }

        if (_cloneInstance === target) {
          throw new Error("Clone result === Source for (" + (0, _helpers.typeToDebugString)(_type) + ")");
        }

        if (_cloneInstance.constructor !== _type) {
          throw new Error("Clone type !== (" + (0, _helpers.typeToDebugString)(_type) + ")");
        }

        this._cloneInstance = _cloneInstance;
      }

      return _cloneInstance;
    }
  }, {
    key: "clone",
    get: function get() {
      var _this2 = this;

      var _clone = this._clone;

      if (_clone == null) {
        var target = this.target;

        if (this.mustBeCloned) {
          _clone = this.cloneInstance;
          var canMergeResult = this.canMerge(this, _clone);

          switch (canMergeResult) {
            case null:
              break;

            case true:
              var _this$mergerState = this.mergerState,
                  mergerVisitor = _this$mergerState.mergerVisitor,
                  options = _this$mergerState.options;
              this.setRef(_clone); // mergerVisitor.setStatus(_clone, ObjectStatus.Cloned)

              var preferClone = this.preferClone,
                  refs = this.refs;
              this.merge(mergerVisitor.getNextMerge(preferClone, preferClone, refs, refs, refs, options), _clone, target, target, function () {
                throw new Error("Class (" + _this2.type.name + ") cannot be merged with clone");
              }, preferClone, preferClone // options,
              );
              break;

            case false:
              if (this.merger.merge) {
                throw new Error("Class (" + this.type.name + ") cannot be merged with clone");
              }

              break;
          }
        } else {
          _clone = target;
        }

        this._clone = _clone;
      }

      return _clone;
    }
  }]);
  return ValueState;
}();

var MergeState =
/*#__PURE__*/
function () {
  // noinspection DuplicatedCode
  function MergeState(mergerVisitor, base, older, newer, set, preferCloneBase, preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options) {
    (0, _classCallCheck2.default)(this, MergeState);
    this.mergerVisitor = mergerVisitor;
    this.base = base;
    this.older = older;
    this.newer = newer;
    this.set = set;
    this.preferCloneBase = preferCloneBase;
    this.preferCloneOlder = preferCloneOlder;
    this.preferCloneNewer = preferCloneNewer;
    this.refsBase = refsBase;
    this.refsOlder = refsOlder;
    this.refsNewer = refsNewer;
    this.options = options;
  }

  (0, _createClass2.default)(MergeState, [{
    key: "fillOlderNewer",
    value: function fillOlderNewer() {
      var olderState = this.olderState,
          newerState = this.newerState; // this.mergerVisitor.setStatus(olderState.clone, ObjectStatus.Merged)
      // const idNewer = getObjectUniqueId(newerState.target as any)
      // if (idNewer != null) {
      // 	refsNewer[idNewer] = olderState.clone
      // }

      var older = olderState.clone;
      newerState.setRef(older);
      var options = this.options,
          set = this.set,
          preferCloneNewer = this.preferCloneNewer,
          refsOlder = this.refsOlder,
          refsNewer = this.refsNewer;
      var isSet;
      var result = olderState.merge(this.mergerVisitor.getNextMerge(preferCloneNewer, preferCloneNewer, refsOlder, refsNewer, refsNewer, options), older, newerState.target, newerState.target, set ? function (o) {
        // if (idNewer != null) {
        // 	refsNewer[idNewer] = o
        // }
        set(o);
        isSet = true;
      } : function () {
        throw new Error("Class " + olderState.type.name + " does not need cloning." + 'You should use "preferClone: false" in merger options for this class');
      }, preferCloneNewer, preferCloneNewer // options,
      );

      if (isSet) {
        return;
      }

      if (result || newerState.mustBeCloned) {
        set(older);
        return;
      }

      set(newerState.target);
    }
  }, {
    key: "mergeWithBase",
    value: function mergeWithBase(olderState, newerState) {
      var baseState = this.baseState;
      var base = baseState.clone; // baseState.setRef(base)

      olderState.setRef(base);
      newerState.setRef(base);
      var options = this.options,
          set = this.set;
      var refsBase = baseState.refs;
      var preferCloneOlder = olderState.preferClone,
          refsOlder = olderState.refs;
      var preferCloneNewer = newerState.preferClone,
          refsNewer = newerState.refs;
      var isSet;
      var result = baseState.merge(this.mergerVisitor.getNextMerge(preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options), base, olderState.target, newerState.target, // for String() etc., that cannot be changed
      set ? function (o) {
        baseState.setRef(o);
        olderState.setRef(o);
        newerState.setRef(o);
        set(o);
        isSet = true;
      } : function () {
        if (baseState.mustBeCloned) {
          throw new Error("Class " + baseState.type.name + " does not need cloning." + 'You should use "preferClone: false" in merger options for this class');
        } else {
          isSet = true;
        }
      }, preferCloneOlder, preferCloneNewer // options,
      );

      if (isSet) {
        return !!set;
      }

      if (!result) {
        return false;
      }

      if (baseState.mustBeCloned) {
        set(base);
      }

      return true;
    }
  }, {
    key: "baseState",
    get: function get() {
      var _baseState = this._baseState;

      if (_baseState == null) {
        var options = this.options;
        this._baseState = _baseState = new ValueState(this, this.base, this.preferCloneBase, options && options.selfAsValueBase, this.refsBase);
      }

      return _baseState;
    },
    set: function set(value) {
      this._baseState = value;
    }
  }, {
    key: "olderState",
    get: function get() {
      var _olderState = this._olderState;

      if (_olderState == null) {
        var options = this.options;
        this._olderState = _olderState = new ValueState(this, this.older, this.preferCloneOlder, options && options.selfAsValueOlder, this.refsOlder);
      }

      return _olderState;
    },
    set: function set(value) {
      this._olderState = value;
    }
  }, {
    key: "newerState",
    get: function get() {
      var _newerState = this._newerState;

      if (_newerState == null) {
        var options = this.options;
        this._newerState = _newerState = new ValueState(this, this.newer, this.preferCloneNewer, options && options.selfAsValueNewer, this.refsNewer);
      }

      return _newerState;
    },
    set: function set(value) {
      this._newerState = value;
    }
  }]);
  return MergeState;
}();

function mergePreferClone(o1, o2) {
  if (o1 || o2) {
    return true;
  }

  return o1 == null ? o2 : o1;
}

var ObjectStatus;

(function (ObjectStatus) {
  ObjectStatus[ObjectStatus["Cloned"] = 1] = "Cloned";
  ObjectStatus[ObjectStatus["Merged"] = 2] = "Merged";
})(ObjectStatus || (ObjectStatus = {}));

var MergerVisitor =
/*#__PURE__*/
function () {
  // public refs: IRef[]
  function MergerVisitor(getMeta) {
    (0, _classCallCheck2.default)(this, MergerVisitor);
    this.getMeta = getMeta;
  }

  (0, _createClass2.default)(MergerVisitor, [{
    key: "getStatus",
    value: function getStatus(object) {
      var statuses = this.statuses;

      if (!statuses) {
        return null;
      }

      var id = (0, _objectUniqueId.getObjectUniqueId)(object);

      if (id == null) {
        throw new Error("object is primitive: " + object);
      }

      return statuses[id];
    }
  }, {
    key: "setStatus",
    value: function setStatus(object, status) {
      var statuses = this.statuses;

      if (!statuses) {
        this.statuses = statuses = [];
      }

      var id = (0, _objectUniqueId.getObjectUniqueId)(object);

      if (id == null) {
        throw new Error("object is primitive: " + object);
      }

      statuses[id] = status;
      return object;
    } // noinspection JSUnusedLocalSymbols

  }, {
    key: "getNextMerge",
    value: function getNextMerge(preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options) {
      var _this3 = this;

      return function (next_base, next_older, next_newer, next_set, next_preferCloneOlder, next_preferCloneNewer, next_options) {
        return _this3.merge(next_base, next_older, next_newer, next_set, next_preferCloneOlder == null ? preferCloneOlder : next_preferCloneOlder, next_preferCloneNewer == null ? preferCloneNewer : next_preferCloneNewer, next_options, // next_options == null || next_options === options
        // 	? options
        // 	: (options == null ? next_options : {
        // 		...options,
        // 		...next_options,
        // 	}),
        refsBase, refsOlder, refsNewer);
      };
    }
  }, {
    key: "merge",
    value: function merge(base, older, newer, set, preferCloneOlder, preferCloneNewer, options, refsBase, refsOlder, refsNewer) {
      var preferCloneBase = null;

      if (base === newer) {
        if (base === older) {
          return false;
        }

        preferCloneBase = preferCloneNewer;
        preferCloneNewer = preferCloneOlder;
        newer = older;
      }

      if (isPrimitive(newer)) {
        if (set) {
          set(newer);
          return true;
        }

        return false;
      }

      if (base === older) {
        preferCloneBase = preferCloneOlder = mergePreferClone(preferCloneBase, preferCloneOlder);
      }

      if (older === newer) {
        preferCloneOlder = preferCloneNewer = mergePreferClone(preferCloneOlder, preferCloneNewer);
      }

      var mergeState = new MergeState(this, base, older, newer, set, preferCloneBase, preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options); // region refs

      if (!isPrimitive(base) && mergeState.baseState.isRef) {
        mergeState.newerState.resolveRef();

        if (mergeState.baseState.target === mergeState.newerState.target) {
          if (!isPrimitive(older)) {
            mergeState.olderState.resolveRef();

            if (mergeState.baseState.target === mergeState.olderState.target) {
              return false;
            }
          }

          mergeState.baseState = mergeState.newerState;
          mergeState.newerState = mergeState.olderState;
          newer = mergeState.newerState.target;
        }

        if (!isPrimitive(older)) {
          mergeState.olderState.resolveRef();

          if (mergeState.baseState.target === mergeState.olderState.target) {
            mergeState.olderState.preferClone = mergePreferClone(mergeState.baseState.preferClone, mergeState.olderState.preferClone);
            mergeState.baseState = mergeState.olderState;
          }

          older = mergeState.olderState.target;
        }

        base = mergeState.baseState.target;
      }

      if (!isPrimitive(older)) {
        mergeState.olderState.resolveRef();
        mergeState.newerState.resolveRef();

        if ((mergeState.olderState.isRef || mergeState.newerState.isRef) && mergeState.olderState.target === mergeState.newerState.target) {
          mergeState.newerState.preferClone = mergePreferClone(mergeState.olderState.preferClone, mergeState.newerState.preferClone);
          mergeState.olderState = mergeState.newerState;
        }

        older = mergeState.olderState.target;
        newer = mergeState.newerState.target;
      } // endregion


      var fillOlderNewer = function fillOlderNewer() {
        switch (mergeState.olderState.canMerge(mergeState.newerState)) {
          case null:
            if (mergeState.olderState.mustBeCloned) {
              set(mergeState.newerState.clone);
            } else {
              if (mergeState.newerState.mustBeCloned) {
                set(mergeState.olderState.target);
              } else {
                set(mergeState.newerState.target);
              }
            }

            break;

          case false:
            set(mergeState.newerState.clone);
            break;

          case true:
            mergeState.fillOlderNewer();
            return true;
        }
      };

      if (isPrimitive(base)) {
        if (set) {
          if (isPrimitive(older) || older === newer) {
            set(mergeState.newerState.clone);
          } else {
            fillOlderNewer();
          }

          return true;
        }

        return false;
      }

      if (!set && mergeState.baseState.mustBeCloned) {
        return false;
      }

      if (isPrimitive(older)) {
        switch (mergeState.baseState.canMerge(mergeState.newerState)) {
          case null:
            if (set) {
              set(older);
              return true;
            }

            break;

          case false:
            if (set) {
              set(mergeState.newerState.clone);
              return true;
            }

            break;

          case true:
            if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
              if (set) {
                set(older);
                return true;
              }

              return false;
            }

            return true;
        }

        return false;
      }

      switch (mergeState.baseState.canMerge(mergeState.newerState)) {
        case false:
          if (set) {
            fillOlderNewer();
            return true;
          }

          return false;

        case null:
          switch (mergeState.baseState.canMerge(mergeState.olderState)) {
            case null:
              return false;

            case false:
              if (set) {
                set(mergeState.olderState.clone);
                return true;
              }

              return false;

            case true:
              return mergeState.mergeWithBase(mergeState.olderState, mergeState.olderState);
          }

          throw new Error('Unreachable code');
      }

      switch (mergeState.baseState.canMerge(mergeState.olderState)) {
        case null:
          return mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState);
        // if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
        // 	if (set) {
        // 		throw new Error('base != newer; base == older; base == newer')
        // 	}
        // 	return false
        // }
        // return true

        case false:
          if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
            if (set) {
              set(mergeState.olderState.clone);
              return true;
            }

            return false;
          }

          return true;

        case true:
          return mergeState.mergeWithBase(mergeState.olderState, mergeState.newerState);
      }

      throw new Error('Unreachable code');
    }
  }]);
  return MergerVisitor;
}(); // endregion
// region TypeMetaMergerCollection


exports.MergerVisitor = MergerVisitor;

var TypeMetaMergerCollection =
/*#__PURE__*/
function (_TypeMetaCollection) {
  (0, _inherits2.default)(TypeMetaMergerCollection, _TypeMetaCollection);

  function TypeMetaMergerCollection(_temp) {
    var _this4;

    var _ref = _temp === void 0 ? {} : _temp,
        proto = _ref.proto,
        customMeta = _ref.customMeta;

    (0, _classCallCheck2.default)(this, TypeMetaMergerCollection);
    _this4 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TypeMetaMergerCollection).call(this, proto || TypeMetaMergerCollection.default));
    _this4.customMeta = customMeta;
    return _this4;
  }

  (0, _createClass2.default)(TypeMetaMergerCollection, [{
    key: "getMeta",
    value: function getMeta(type) {
      return this.customMeta && this.customMeta(type) || (0, _get2.default)((0, _getPrototypeOf2.default)(TypeMetaMergerCollection.prototype), "getMeta", this).call(this, type);
    }
  }, {
    key: "putMergeableType",
    value: function putMergeableType(type, meta) {
      return this.putType(type, TypeMetaMergerCollection.makeTypeMetaMerger(type, meta));
    }
  }], [{
    key: "makeTypeMetaMerger",
    value: function makeTypeMetaMerger(type, meta) {
      return (0, _extends2.default)({
        valueFactory: function valueFactory() {
          return new type();
        }
      }, meta, {
        merger: (0, _extends2.default)({
          canMerge: function canMerge(target, source) {
            return target._canMerge ? target._canMerge(source) : target.constructor === source.constructor;
          },
          merge: function merge(_merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
            return base._merge(_merge, older, newer, preferCloneOlder, preferCloneNewer, options);
          }
        }, meta ? meta.merger : {})
      });
    }
  }]);
  return TypeMetaMergerCollection;
}(_TypeMeta.TypeMetaCollection);

exports.TypeMetaMergerCollection = TypeMetaMergerCollection;
TypeMetaMergerCollection.default = new TypeMetaMergerCollection();

function registerMergeable(type, meta) {
  TypeMetaMergerCollection.default.putMergeableType(type, meta);
}

function registerMerger(type, meta) {
  TypeMetaMergerCollection.default.putType(type, meta);
}

function createPrimitiveTypeMetaMerger(meta) {
  return (0, _extends2.default)({
    preferClone: false
  }, meta, {
    merger: (0, _extends2.default)({
      merge: function merge(_merge2, base, older, newer, set) {
        set(newer.valueOf());
        return true;
      }
    }, meta ? meta.merger : {})
  });
}

function registerMergerPrimitive(type, meta) {
  registerMerger(type, createPrimitiveTypeMetaMerger(meta));
} // endregion
// region ObjectMerger


var primitiveTypeMetaMerger = createPrimitiveTypeMetaMerger();
var observableObjectProperties = ['propertyChanged'];

var ObjectMerger =
/*#__PURE__*/
function () {
  function ObjectMerger(typeMeta) {
    var _context;

    (0, _classCallCheck2.default)(this, ObjectMerger);
    this.typeMeta = new TypeMetaMergerCollection({
      proto: typeMeta
    });
    this.merge = (0, _bind.default)(_context = this.merge).call(_context, this);
  }

  (0, _createClass2.default)(ObjectMerger, [{
    key: "merge",
    value: function merge(base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      var _this5 = this;

      var merger = new MergerVisitor(function (type) {
        return _this5.typeMeta.getMeta(type);
      });
      var mergedValue = merger.merge(base, older, newer, set, preferCloneOlder, preferCloneNewer, options);
      return mergedValue;
    }
  }]);
  return ObjectMerger;
}(); // endregion
// region Primitive Mergers
// Handled in MergerVisitor:


exports.ObjectMerger = ObjectMerger;
ObjectMerger.default = new ObjectMerger();
ObjectMerger.observableOnly = new ObjectMerger(new TypeMetaMergerCollection({
  customMeta: function customMeta(type) {
    var prototype = type.prototype;

    for (var i = 0, len = observableObjectProperties.length; i < len; i++) {
      if (Object.prototype.hasOwnProperty.call(prototype, observableObjectProperties[i])) {
        return primitiveTypeMetaMerger;
      }
    }

    return null;
  }
}));

function isPrimitive(value) {
  return !(0, _objectUniqueId.canHaveUniqueId)(value) || typeof value === 'function'; // value == null
  // || typeof value === 'number'
  // || typeof value === 'boolean'
}

registerMerger(String, {
  merger: {
    canMerge: function canMerge(target, source) {
      target = target.valueOf();
      source = source.valueOf();

      if (typeof source !== 'string') {
        return false;
      }

      if (target === source) {
        return null;
      }

      return true;
    },
    merge: function merge(_merge3, base, older, newer, set) {
      // base = base.valueOf()
      // older = older.valueOf()
      // newer = newer.valueOf()
      // if (base === newer) {
      // 	if (base === older) {
      // 		return false
      // 	}
      // 	set(older)
      // 	return true
      // }
      set(newer.valueOf());
      return true;
    }
  },
  preferClone: false
});
registerMergerPrimitive(Number);
registerMergerPrimitive(Boolean);
registerMergerPrimitive(Array);
registerMergerPrimitive(Error); // endregion
// region Array
// @ts-ignore
// registerMerger<any[], any[]>(Array, {
// 	merger: {
// 		canMerge(target: any[], source: any[]): boolean {
// 			return Array.isArray(source)
// 		},
// 		merge(
// 			merge: IMergeValue,
// 			base: any[],
// 			older: any[],
// 			newer: any[],
// 			set?: (value: any[]) => void,
// 			preferCloneOlder?: boolean,
// 			preferCloneNewer?: boolean,
// 			options?: IMergeOptions,
// 		): boolean {
// 			let changed = false
// 			const lenBase = base.length
// 			const lenOlder = older.length
// 			const lenNewer = newer.length
// 			for (let i = 0; i < lenNewer; i++) {
// 				if (i < lenBase) {
// 					if (i < lenOlder) {
// 						changed = merge(base[i], older[i], newer[i], o => base[i] = o, preferCloneOlder, preferCloneNewer)
// 							|| changed
// 					} else {
// 						changed = merge(base[i], newer[i], newer[i], o => base[i] = o, preferCloneNewer, preferCloneNewer)
// 							|| changed
// 					}
// 				} else if (i < lenOlder) {
// 					changed = merge(EMPTY, older[i], newer[i], o => base[i] = o, preferCloneOlder, preferCloneNewer)
// 						|| changed
// 				} else {
// 					changed = merge(EMPTY, newer[i], newer[i], o => base[i] = o, preferCloneNewer, preferCloneNewer)
// 						|| changed
// 				}
// 			}
// 		},
// 	},
// 	preferClone: o => Array.isFrozen(o) ? true : null,
// })
// endregion
// region Object

registerMerger(Object, {
  merger: {
    canMerge: function canMerge(target, source) {
      return source.constructor === Object;
    },
    merge: function merge(_merge4, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return (0, _mergeMaps.mergeMaps)(_mergeMaps.createMergeMapWrapper, _merge4, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }
  },
  preferClone: function preferClone(o) {
    return (0, _isFrozen.default)(o) ? true : null;
  }
}); // endregion
// region Date

registerMerger(Date, {
  merger: {
    canMerge: function canMerge(target, source) {
      if (source.constructor !== Date) {
        return false;
      }

      return target.getTime() === source.getTime() ? null : false;
    }
  },
  valueFactory: function valueFactory(source) {
    return new Date(source);
  }
}); // endregion
// region Set

registerMerger(_set.default, {
  merger: {
    canMerge: function canMerge(target, source) {
      return source.constructor === Object || source[_toStringTag.default] === 'Set' || (0, _isArray.default)(source) || (0, _helpers.isIterable)(source);
    },
    merge: function merge(_merge5, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return (0, _mergeMaps.mergeMaps)(function (target, source) {
        return (0, _mergeSets.createMergeSetWrapper)(target, source, function (arrayOrIterable) {
          return (0, _set2.fillSet)(new _set.default(), arrayOrIterable);
        });
      }, _merge5, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }
  } // valueFactory: (source: Set<any>) => new Set(source),

}); // endregion
// region Map

registerMerger(_map.default, {
  merger: {
    // tslint:disable-next-line:no-identical-functions
    canMerge: function canMerge(target, source) {
      return source.constructor === Object || source[_toStringTag.default] === 'Map' || (0, _isArray.default)(source) || (0, _helpers.isIterable)(source);
    },
    merge: function merge(_merge6, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return (0, _mergeMaps.mergeMaps)(function (target, source) {
        return (0, _mergeMaps.createMergeMapWrapper)(target, source, function (arrayOrIterable) {
          return (0, _set2.fillMap)(new _map.default(), arrayOrIterable);
        });
      }, _merge6, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }
  } // valueFactory: (source: Map<any, any>) => new Map(source),

}); // endregion