"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _setPrototypeOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/set-prototype-of"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _preventExtensions = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/prevent-extensions"));

var _isExtensible = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/is-extensible"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _getPrototypeOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-prototype-of"));

var _create = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/create"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _keys2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _iterator = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

/* eslint-disable */
!function () {
  "use strict";

  var _context2;

  var toString = {}.toString,
      _cof = function _cof(it) {
    var _context;

    return (0, _slice.default)(_context = toString.call(it)).call(_context, 8, -1);
  };

  function createCommonjsModule(fn, module) {
    return fn(module = {
      exports: {}
    }, module.exports), module.exports;
  }

  var _core = createCommonjsModule(function (module) {
    var core = module.exports = {
      version: "2.6.5"
    };
    "number" == typeof __e && (__e = core);
  }),
      _global = (_core.version, createCommonjsModule(function (module) {
    var global = module.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
    "number" == typeof __g && (__g = global);
  })),
      _shared = createCommonjsModule(function (module) {
    var store = _global["__core-js_shared__"] || (_global["__core-js_shared__"] = {});
    (module.exports = function (key, value) {
      return store[key] || (store[key] = void 0 !== value ? value : {});
    })("versions", []).push({
      version: _core.version,
      mode: "global",
      copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
    });
  }),
      id = 0,
      px = Math.random(),
      _uid = function _uid(key) {
    return "Symbol(".concat(void 0 === key ? "" : key, ")_", (++id + px).toString(36));
  },
      _wks = createCommonjsModule(function (module) {
    var store = _shared("wks"),
        _Symbol = _global.Symbol,
        USE_SYMBOL = "function" == typeof _Symbol;

    (module.exports = function (name) {
      return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : _uid)("Symbol." + name));
    }).store = store;
  }),
      TAG = _wks("toStringTag"),
      ARG = "Arguments" == _cof(function () {
    return arguments;
  }()),
      _classof = function _classof(it) {
    var O, T, B;
    return void 0 === it ? "Undefined" : null === it ? "Null" : "string" == typeof (T = function (it, key) {
      try {
        return it[key];
      } catch (e) {}
    }(O = Object(it), TAG)) ? T : ARG ? _cof(O) : "Object" == (B = _cof(O)) && "function" == typeof O.callee ? "Arguments" : B;
  },
      _typeof_1 = createCommonjsModule(function (module) {
    function _typeof2(obj) {
      return (_typeof2 = "function" == typeof _symbol.default && "symbol" == typeof _iterator.default ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof _symbol.default && obj.constructor === _symbol.default && obj !== _symbol.default.prototype ? "symbol" : typeof obj;
      })(obj);
    }

    function _typeof(obj) {
      return "function" == typeof _symbol.default && "symbol" === _typeof2(_iterator.default) ? module.exports = _typeof = function _typeof(obj) {
        return _typeof2(obj);
      } : module.exports = _typeof = function _typeof(obj) {
        return obj && "function" == typeof _symbol.default && obj.constructor === _symbol.default && obj !== _symbol.default.prototype ? "symbol" : _typeof2(obj);
      }, _typeof(obj);
    }

    module.exports = _typeof;
  }),
      _isObject = function _isObject(it) {
    return "object" === _typeof_1(it) ? null !== it : "function" == typeof it;
  },
      _anObject = function _anObject(it) {
    if (!_isObject(it)) throw TypeError(it + " is not an object!");
    return it;
  },
      _fails = function _fails(exec) {
    try {
      return !!exec();
    } catch (e) {
      return !0;
    }
  },
      _descriptors = !_fails(function () {
    return 7 != (0, _defineProperty.default)({}, "a", {
      get: function get() {
        return 7;
      }
    }).a;
  }),
      document = _global.document,
      is = _isObject(document) && _isObject(document.createElement),
      _domCreate = function _domCreate(it) {
    return is ? document.createElement(it) : {};
  },
      _ie8DomDefine = !_descriptors && !_fails(function () {
    return 7 != (0, _defineProperty.default)(_domCreate("div"), "a", {
      get: function get() {
        return 7;
      }
    }).a;
  }),
      _toPrimitive = function _toPrimitive(it, S) {
    if (!_isObject(it)) return it;
    var fn, val;
    if (S && "function" == typeof (fn = it.toString) && !_isObject(val = fn.call(it))) return val;
    if ("function" == typeof (fn = it.valueOf) && !_isObject(val = fn.call(it))) return val;
    if (!S && "function" == typeof (fn = it.toString) && !_isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  },
      dP = _defineProperty.default,
      _objectDp = {
    f: _descriptors ? _defineProperty.default : function (O, P, Attributes) {
      if (_anObject(O), P = _toPrimitive(P, !0), _anObject(Attributes), _ie8DomDefine) try {
        return dP(O, P, Attributes);
      } catch (e) {}
      if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported!");
      return "value" in Attributes && (O[P] = Attributes.value), O;
    }
  },
      _propertyDesc = function _propertyDesc(bitmap, value) {
    return {
      enumerable: !(1 & bitmap),
      configurable: !(2 & bitmap),
      writable: !(4 & bitmap),
      value: value
    };
  },
      _hide = _descriptors ? function (object, key, value) {
    return _objectDp.f(object, key, _propertyDesc(1, value));
  } : function (object, key, value) {
    return object[key] = value, object;
  },
      hasOwnProperty = {}.hasOwnProperty,
      _has = function _has(it, key) {
    return hasOwnProperty.call(it, key);
  },
      _functionToString = _shared("native-function-to-string", Function.toString),
      _redefine = createCommonjsModule(function (module) {
    var SRC = _uid("src"),
        TPL = ("" + _functionToString).split("toString");

    _core.inspectSource = function (it) {
      return _functionToString.call(it);
    }, (module.exports = function (O, key, val, safe) {
      var isFunction = "function" == typeof val;
      isFunction && (_has(val, "name") || _hide(val, "name", key)), O[key] !== val && (isFunction && (_has(val, SRC) || _hide(val, SRC, O[key] ? "" + O[key] : TPL.join(String(key)))), O === _global ? O[key] = val : safe ? O[key] ? O[key] = val : _hide(O, key, val) : (delete O[key], _hide(O, key, val)));
    })(Function.prototype, "toString", function () {
      return "function" == typeof this && this[SRC] || _functionToString.call(this);
    });
  }),
      test = {};

  test[_wks("toStringTag")] = "z", test + "" != "[object z]" && _redefine(Object.prototype, "toString", function () {
    return "[object " + _classof(this) + "]";
  }, !0);

  var ceil = Math.ceil,
      floor = Math.floor,
      _toInteger = function _toInteger(it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  },
      _defined = function _defined(it) {
    if (null == it) throw TypeError("Can't call method on  " + it);
    return it;
  },
      _ctx = function _ctx(fn, that, length) {
    if (function (it) {
      if ("function" != typeof it) throw TypeError(it + " is not a function!");
    }(fn), void 0 === that) return fn;

    switch (length) {
      case 1:
        return function (a) {
          return fn.call(that, a);
        };

      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };

      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }

    return function () {
      return fn.apply(that, arguments);
    };
  },
      $export = function $export(type, name, source) {
    var key,
        own,
        out,
        exp,
        IS_FORCED = type & $export.F,
        IS_GLOBAL = type & $export.G,
        IS_PROTO = type & $export.P,
        IS_BIND = type & $export.B,
        target = IS_GLOBAL ? _global : type & $export.S ? _global[name] || (_global[name] = {}) : (_global[name] || {}).prototype,
        exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {}),
        expProto = exports.prototype || (exports.prototype = {});

    for (key in IS_GLOBAL && (source = name), source) {
      out = ((own = !IS_FORCED && target && void 0 !== target[key]) ? target : source)[key], exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && "function" == typeof out ? _ctx(Function.call, out) : out, target && _redefine(target, key, out, type & $export.U), exports[key] != out && _hide(exports, key, exp), IS_PROTO && expProto[key] != out && (expProto[key] = out);
    }
  };

  _global.core = _core, $export.F = 1, $export.G = 2, $export.S = 4, $export.P = 8, $export.B = 16, $export.W = 32, $export.U = 64, $export.R = 128;

  var IS_INCLUDES,
      _export = $export,
      _iterators = {},
      _iobject = Object("z").propertyIsEnumerable(0) ? Object : function (it) {
    return "String" == _cof(it) ? it.split("") : Object(it);
  },
      _toIobject = function _toIobject(it) {
    return _iobject(_defined(it));
  },
      min = Math.min,
      _toLength = function _toLength(it) {
    return it > 0 ? min(_toInteger(it), 9007199254740991) : 0;
  },
      max = Math.max,
      min$1 = Math.min,
      shared = _shared("keys"),
      _sharedKey = function _sharedKey(key) {
    return shared[key] || (shared[key] = _uid(key));
  },
      arrayIndexOf = (IS_INCLUDES = !1, function ($this, el, fromIndex) {
    var value,
        O = _toIobject($this),
        length = _toLength(O.length),
        index = function (index, length) {
      return (index = _toInteger(index)) < 0 ? max(index + length, 0) : min$1(index, length);
    }(fromIndex, length);

    if (IS_INCLUDES && el != el) {
      for (; length > index;) {
        if ((value = O[index++]) != value) return !0;
      }
    } else for (; length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    }

    return !IS_INCLUDES && -1;
  }),
      IE_PROTO = _sharedKey("IE_PROTO"),
      _enumBugKeys = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),
      _objectKeys = _keys2.default || function (O) {
    return function (object, names) {
      var key,
          O = _toIobject(object),
          i = 0,
          result = [];

      for (key in O) {
        key != IE_PROTO && _has(O, key) && result.push(key);
      }

      for (; names.length > i;) {
        _has(O, key = names[i++]) && (~arrayIndexOf(result, key) || result.push(key));
      }

      return result;
    }(O, _enumBugKeys);
  },
      _objectDps = _descriptors ? _defineProperties.default : function (O, Properties) {
    _anObject(O);

    for (var P, keys = _objectKeys(Properties), length = keys.length, i = 0; length > i;) {
      _objectDp.f(O, P = keys[i++], Properties[P]);
    }

    return O;
  },
      document$1 = _global.document,
      _html = document$1 && document$1.documentElement,
      IE_PROTO$1 = _sharedKey("IE_PROTO"),
      Empty = function Empty() {},
      _createDict2 = function _createDict() {
    var iframeDocument,
        iframe = _domCreate("iframe"),
        i = _enumBugKeys.length;

    for (iframe.style.display = "none", _html.appendChild(iframe), iframe.src = "javascript:", (iframeDocument = iframe.contentWindow.document).open(), iframeDocument.write("<script>document.F=Object<\/script>"), iframeDocument.close(), _createDict2 = iframeDocument.F; i--;) {
      delete _createDict2.prototype[_enumBugKeys[i]];
    }

    return _createDict2();
  },
      _objectCreate = _create.default || function (O, Properties) {
    var result;
    return null !== O ? (Empty.prototype = _anObject(O), result = new Empty(), Empty.prototype = null, result[IE_PROTO$1] = O) : result = _createDict2(), void 0 === Properties ? result : _objectDps(result, Properties);
  },
      def = _objectDp.f,
      TAG$1 = _wks("toStringTag"),
      _setToStringTag = function _setToStringTag(it, tag, stat) {
    it && !_has(it = stat ? it : it.prototype, TAG$1) && def(it, TAG$1, {
      configurable: !0,
      value: tag
    });
  },
      IteratorPrototype = {};

  _hide(IteratorPrototype, _wks("iterator"), function () {
    return this;
  });

  var TO_STRING,
      _iterCreate = function _iterCreate(Constructor, NAME, next) {
    Constructor.prototype = _objectCreate(IteratorPrototype, {
      next: _propertyDesc(1, next)
    }), _setToStringTag(Constructor, NAME + " Iterator");
  },
      IE_PROTO$2 = _sharedKey("IE_PROTO"),
      ObjectProto = Object.prototype,
      _objectGpo = _getPrototypeOf.default || function (O) {
    return O = Object(_defined(O)), _has(O, IE_PROTO$2) ? O[IE_PROTO$2] : "function" == typeof O.constructor && O instanceof O.constructor ? O.constructor.prototype : O instanceof Object ? ObjectProto : null;
  },
      ITERATOR = _wks("iterator"),
      BUGGY = !((0, _keys.default)([]) && "next" in (0, _keys.default)(_context2 = []).call(_context2)),
      returnThis = function returnThis() {
    return this;
  },
      _iterDefine = function _iterDefine(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    _iterCreate(Constructor, NAME, next);

    var methods,
        key,
        IteratorPrototype,
        getMethod = function getMethod(kind) {
      if (!BUGGY && kind in proto) return proto[kind];

      switch (kind) {
        case "keys":
        case "values":
          return function () {
            return new Constructor(this, kind);
          };
      }

      return function () {
        return new Constructor(this, kind);
      };
    },
        TAG = NAME + " Iterator",
        DEF_VALUES = "values" == DEFAULT,
        VALUES_BUG = !1,
        proto = Base.prototype,
        $native = proto[ITERATOR] || proto["@@iterator"] || DEFAULT && proto[DEFAULT],
        $default = $native || getMethod(DEFAULT),
        $entries = DEFAULT ? DEF_VALUES ? getMethod("entries") : $default : void 0,
        $anyNative = "Array" == NAME && (0, _entries.default)(proto) || $native;

    if ($anyNative && (IteratorPrototype = _objectGpo($anyNative.call(new Base()))) !== Object.prototype && IteratorPrototype.next && (_setToStringTag(IteratorPrototype, TAG, !0), "function" != typeof IteratorPrototype[ITERATOR] && _hide(IteratorPrototype, ITERATOR, returnThis)), DEF_VALUES && $native && "values" !== $native.name && (VALUES_BUG = !0, $default = function $default() {
      return $native.call(this);
    }), (BUGGY || VALUES_BUG || !proto[ITERATOR]) && _hide(proto, ITERATOR, $default), _iterators[NAME] = $default, _iterators[TAG] = returnThis, DEFAULT) if (methods = {
      values: DEF_VALUES ? $default : getMethod("values"),
      keys: IS_SET ? $default : getMethod("keys"),
      entries: $entries
    }, FORCED) for (key in methods) {
      key in proto || _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
    return methods;
  },
      $at = (TO_STRING = !0, function (that, pos) {
    var a,
        b,
        s = String(_defined(that)),
        i = _toInteger(pos),
        l = s.length;

    return i < 0 || i >= l ? TO_STRING ? "" : void 0 : (a = s.charCodeAt(i)) < 55296 || a > 56319 || i + 1 === l || (b = s.charCodeAt(i + 1)) < 56320 || b > 57343 ? TO_STRING ? s.charAt(i) : a : TO_STRING ? (0, _slice.default)(s).call(s, i, i + 2) : b - 56320 + (a - 55296 << 10) + 65536;
  });

  _iterDefine(String, "String", function (iterated) {
    this._t = String(iterated), this._i = 0;
  }, function () {
    var point,
        O = this._t,
        index = this._i;
    return index >= O.length ? {
      value: void 0,
      done: !0
    } : (point = $at(O, index), this._i += point.length, {
      value: point,
      done: !1
    });
  });

  var UNSCOPABLES = _wks("unscopables"),
      ArrayProto = Array.prototype;

  null == ArrayProto[UNSCOPABLES] && _hide(ArrayProto, UNSCOPABLES, {});

  var _addToUnscopables = function _addToUnscopables(key) {
    ArrayProto[UNSCOPABLES][key] = !0;
  },
      _iterStep = function _iterStep(done, value) {
    return {
      value: value,
      done: !!done
    };
  },
      es6_array_iterator = _iterDefine(Array, "Array", function (iterated, kind) {
    this._t = _toIobject(iterated), this._i = 0, this._k = kind;
  }, function () {
    var O = this._t,
        kind = this._k,
        index = this._i++;
    return !O || index >= O.length ? (this._t = void 0, _iterStep(1)) : _iterStep(0, "keys" == kind ? index : "values" == kind ? O[index] : [index, O[index]]);
  }, "values");

  _iterators.Arguments = _iterators.Array, _addToUnscopables("keys"), _addToUnscopables("values"), _addToUnscopables("entries");

  for (var ITERATOR$1 = _wks("iterator"), TO_STRING_TAG = _wks("toStringTag"), ArrayValues = _iterators.Array, DOMIterables = {
    CSSRuleList: !0,
    CSSStyleDeclaration: !1,
    CSSValueList: !1,
    ClientRectList: !1,
    DOMRectList: !1,
    DOMStringList: !1,
    DOMTokenList: !0,
    DataTransferItemList: !1,
    FileList: !1,
    HTMLAllCollection: !1,
    HTMLCollection: !1,
    HTMLFormElement: !1,
    HTMLSelectElement: !1,
    MediaList: !0,
    MimeTypeArray: !1,
    NamedNodeMap: !1,
    NodeList: !0,
    PaintRequestList: !1,
    Plugin: !1,
    PluginArray: !1,
    SVGLengthList: !1,
    SVGNumberList: !1,
    SVGPathSegList: !1,
    SVGPointList: !1,
    SVGStringList: !1,
    SVGTransformList: !1,
    SourceBufferList: !1,
    StyleSheetList: !0,
    TextTrackCueList: !1,
    TextTrackList: !1,
    TouchList: !1
  }, collections = _objectKeys(DOMIterables), i = 0; i < collections.length; i++) {
    var key,
        NAME = collections[i],
        explicit = DOMIterables[NAME],
        Collection = _global[NAME],
        proto = Collection && Collection.prototype;
    if (proto && (proto[ITERATOR$1] || _hide(proto, ITERATOR$1, ArrayValues), proto[TO_STRING_TAG] || _hide(proto, TO_STRING_TAG, NAME), _iterators[NAME] = ArrayValues, explicit)) for (key in es6_array_iterator) {
      proto[key] || _redefine(proto, key, es6_array_iterator[key], !0);
    }
  }

  var _redefineAll = function _redefineAll(target, src, safe) {
    for (var key in src) {
      _redefine(target, key, src[key], safe);
    }

    return target;
  },
      _anInstance = function _anInstance(it, Constructor, name, forbiddenField) {
    if (!(it instanceof Constructor) || void 0 !== forbiddenField && forbiddenField in it) throw TypeError(name + ": incorrect invocation!");
    return it;
  },
      _iterCall = function _iterCall(iterator, fn, value, entries) {
    try {
      return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
    } catch (e) {
      var ret = iterator.return;
      throw void 0 !== ret && _anObject(ret.call(iterator)), e;
    }
  },
      ITERATOR$2 = _wks("iterator"),
      ArrayProto$1 = Array.prototype,
      ITERATOR$3 = _wks("iterator"),
      core_getIteratorMethod = _core.getIteratorMethod = function (it) {
    if (null != it) return it[ITERATOR$3] || it["@@iterator"] || _iterators[_classof(it)];
  },
      _forOf = createCommonjsModule(function (module) {
    var BREAK = {},
        RETURN = {},
        exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
      var length,
          step,
          iterator,
          result,
          it,
          iterFn = ITERATOR ? function () {
        return iterable;
      } : core_getIteratorMethod(iterable),
          f = _ctx(fn, that, entries ? 2 : 1),
          index = 0;

      if ("function" != typeof iterFn) throw TypeError(iterable + " is not iterable!");

      if (void 0 === (it = iterFn) || _iterators.Array !== it && ArrayProto$1[ITERATOR$2] !== it) {
        for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
          if ((result = _iterCall(iterator, f, step.value, entries)) === BREAK || result === RETURN) return result;
        }
      } else for (length = _toLength(iterable.length); length > index; index++) {
        if ((result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index])) === BREAK || result === RETURN) return result;
      }
    };

    exports.BREAK = BREAK, exports.RETURN = RETURN;
  }),
      SPECIES = _wks("species"),
      _meta = createCommonjsModule(function (module) {
    var META = _uid("meta"),
        setDesc = _objectDp.f,
        id = 0,
        isExtensible = _isExtensible.default || function () {
      return !0;
    },
        FREEZE = !_fails(function () {
      return isExtensible((0, _preventExtensions.default)({}));
    }),
        setMeta = function setMeta(it) {
      setDesc(it, META, {
        value: {
          i: "O" + ++id,
          w: {}
        }
      });
    },
        meta = module.exports = {
      KEY: META,
      NEED: !1,
      fastKey: function fastKey(it, create) {
        if (!_isObject(it)) return "symbol" == _typeof_1(it) ? it : ("string" == typeof it ? "S" : "P") + it;

        if (!_has(it, META)) {
          if (!isExtensible(it)) return "F";
          if (!create) return "E";
          setMeta(it);
        }

        return it[META].i;
      },
      getWeak: function getWeak(it, create) {
        if (!_has(it, META)) {
          if (!isExtensible(it)) return !0;
          if (!create) return !1;
          setMeta(it);
        }

        return it[META].w;
      },
      onFreeze: function onFreeze(it) {
        return FREEZE && meta.NEED && isExtensible(it) && !_has(it, META) && setMeta(it), it;
      }
    };
  }),
      _validateCollection = (_meta.KEY, _meta.NEED, _meta.fastKey, _meta.getWeak, _meta.onFreeze, function (it, TYPE) {
    if (!_isObject(it) || it._t !== TYPE) throw TypeError("Incompatible receiver, " + TYPE + " required!");
    return it;
  }),
      dP$1 = _objectDp.f,
      fastKey = _meta.fastKey,
      SIZE = _descriptors ? "_s" : "size",
      getEntry = function getEntry(that, key) {
    var entry,
        index = fastKey(key);
    if ("F" !== index) return that._i[index];

    for (entry = that._f; entry; entry = entry.n) {
      if (entry.k == key) return entry;
    }
  },
      _collectionStrong = {
    getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        _anInstance(that, C, NAME, "_i"), that._t = NAME, that._i = _objectCreate(null), that._f = void 0, that._l = void 0, that[SIZE] = 0, null != iterable && _forOf(iterable, IS_MAP, that[ADDER], that);
      });
      return _redefineAll(C.prototype, {
        clear: function clear() {
          for (var that = _validateCollection(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
            entry.r = !0, entry.p && (entry.p = entry.p.n = void 0), delete data[entry.i];
          }

          that._f = that._l = void 0, that[SIZE] = 0;
        },
        delete: function _delete(key) {
          var that = _validateCollection(this, NAME),
              entry = getEntry(that, key);

          if (entry) {
            var next = entry.n,
                prev = entry.p;
            delete that._i[entry.i], entry.r = !0, prev && (prev.n = next), next && (next.p = prev), that._f == entry && (that._f = next), that._l == entry && (that._l = prev), that[SIZE]--;
          }

          return !!entry;
        },
        forEach: function forEach(callbackfn) {
          _validateCollection(this, NAME);

          for (var entry, f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : void 0, 3); entry = entry ? entry.n : this._f;) {
            for (f(entry.v, entry.k, this); entry && entry.r;) {
              entry = entry.p;
            }
          }
        },
        has: function has(key) {
          return !!getEntry(_validateCollection(this, NAME), key);
        }
      }), _descriptors && dP$1(C.prototype, "size", {
        get: function get() {
          return _validateCollection(this, NAME)[SIZE];
        }
      }), C;
    },
    def: function def(that, key, value) {
      var prev,
          index,
          entry = getEntry(that, key);
      return entry ? entry.v = value : (that._l = entry = {
        i: index = fastKey(key, !0),
        k: key,
        v: value,
        p: prev = that._l,
        n: void 0,
        r: !1
      }, that._f || (that._f = entry), prev && (prev.n = entry), that[SIZE]++, "F" !== index && (that._i[index] = entry)), that;
    },
    getEntry: getEntry,
    setStrong: function setStrong(C, NAME, IS_MAP) {
      _iterDefine(C, NAME, function (iterated, kind) {
        this._t = _validateCollection(iterated, NAME), this._k = kind, this._l = void 0;
      }, function () {
        for (var kind = this._k, entry = this._l; entry && entry.r;) {
          entry = entry.p;
        }

        return this._t && (this._l = entry = entry ? entry.n : this._t._f) ? _iterStep(0, "keys" == kind ? entry.k : "values" == kind ? entry.v : [entry.k, entry.v]) : (this._t = void 0, _iterStep(1));
      }, IS_MAP ? "entries" : "values", !IS_MAP, !0), function (KEY) {
        var C = _global[KEY];
        _descriptors && C && !C[SPECIES] && _objectDp.f(C, SPECIES, {
          configurable: !0,
          get: function get() {
            return this;
          }
        });
      }(NAME);
    }
  },
      ITERATOR$4 = _wks("iterator"),
      SAFE_CLOSING = !1;

  try {
    [7][ITERATOR$4]().return = function () {
      SAFE_CLOSING = !0;
    };
  } catch (e) {}

  var _objectPie = {
    f: {}.propertyIsEnumerable
  },
      gOPD = _getOwnPropertyDescriptor.default,
      _objectGopd = {
    f: _descriptors ? gOPD : function (O, P) {
      if (O = _toIobject(O), P = _toPrimitive(P, !0), _ie8DomDefine) try {
        return gOPD(O, P);
      } catch (e) {}
      if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
    }
  },
      check = function check(O, proto) {
    if (_anObject(O), !_isObject(proto) && null !== proto) throw TypeError(proto + ": can't set as prototype!");
  },
      setPrototypeOf = {
    set: _setPrototypeOf.default || ("__proto__" in {} ? function (test, buggy, set) {
      try {
        (set = _ctx(Function.call, _objectGopd.f(Object.prototype, "__proto__").set, 2))(test, []), buggy = !(test instanceof Array);
      } catch (e) {
        buggy = !0;
      }

      return function (O, proto) {
        return check(O, proto), buggy ? O.__proto__ = proto : set(O, proto), O;
      };
    }({}, !1) : void 0),
    check: check
  }.set;

  (function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
    var Base = _global[NAME],
        C = Base,
        ADDER = IS_MAP ? "set" : "add",
        proto = C && C.prototype,
        O = {},
        fixMethod = function fixMethod(KEY) {
      var fn = proto[KEY];

      _redefine(proto, KEY, "delete" == KEY ? function (a) {
        return !(IS_WEAK && !_isObject(a)) && fn.call(this, 0 === a ? 0 : a);
      } : "has" == KEY ? function (a) {
        return !(IS_WEAK && !_isObject(a)) && fn.call(this, 0 === a ? 0 : a);
      } : "get" == KEY ? function (a) {
        return IS_WEAK && !_isObject(a) ? void 0 : fn.call(this, 0 === a ? 0 : a);
      } : "add" == KEY ? function (a) {
        return fn.call(this, 0 === a ? 0 : a), this;
      } : function (a, b) {
        return fn.call(this, 0 === a ? 0 : a, b), this;
      });
    };

    if ("function" == typeof C && (IS_WEAK || (0, _forEach.default)(proto) && !_fails(function () {
      var _context3;

      (0, _entries.default)(_context3 = new C()).call(_context3).next();
    }))) {
      var instance = new C(),
          HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance,
          THROWS_ON_PRIMITIVES = _fails(function () {
        instance.has(1);
      }),
          ACCEPT_ITERABLES = function (exec, skipClosing) {
        if (!skipClosing && !SAFE_CLOSING) return !1;
        var safe = !1;

        try {
          var arr = [7],
              iter = arr[ITERATOR$4]();
          iter.next = function () {
            return {
              done: safe = !0
            };
          }, arr[ITERATOR$4] = function () {
            return iter;
          }, exec(arr);
        } catch (e) {}

        return safe;
      }(function (iter) {
        new C(iter);
      }),
          BUGGY_ZERO = !IS_WEAK && _fails(function () {
        for (var $instance = new C(), index = 5; index--;) {
          $instance[ADDER](index, index);
        }

        return !$instance.has(-0);
      });

      ACCEPT_ITERABLES || ((C = wrapper(function (target, iterable) {
        _anInstance(target, C, NAME);

        var that = function (that, target, C) {
          var P,
              S = target.constructor;
          return S !== C && "function" == typeof S && (P = S.prototype) !== C.prototype && _isObject(P) && setPrototypeOf && setPrototypeOf(that, P), that;
        }(new Base(), target, C);

        return null != iterable && _forOf(iterable, IS_MAP, that[ADDER], that), that;
      })).prototype = proto, proto.constructor = C), (THROWS_ON_PRIMITIVES || BUGGY_ZERO) && (fixMethod("delete"), fixMethod("has"), IS_MAP && fixMethod("get")), (BUGGY_ZERO || HASNT_CHAINING) && fixMethod(ADDER), IS_WEAK && proto.clear && delete proto.clear;
    } else C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER), _redefineAll(C.prototype, methods), _meta.NEED = !0;

    _setToStringTag(C, NAME), O[NAME] = C, _export(_export.G + _export.W + _export.F * (C != Base), O), IS_WEAK || common.setStrong(C, NAME, IS_MAP);
  })("SetPolyfill", function (get) {
    return function () {
      return get(this, arguments.length > 0 ? arguments[0] : void 0);
    };
  }, {
    add: function add(value) {
      return _collectionStrong.def(_validateCollection(this, "SetPolyfill"), value = 0 === value ? 0 : value, value);
    }
  }, _collectionStrong), _core.SetPolyfill;
}();