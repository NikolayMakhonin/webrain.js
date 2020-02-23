"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getSubscriberLinkFromPool = getSubscriberLinkFromPool;
exports.releaseSubscriberLink = releaseSubscriberLink;
exports.getSubscriberLink = getSubscriberLink;
exports.subscriberLinkDelete = subscriberLinkDelete;
exports.unsubscribeDependencies = unsubscribeDependencies;
exports._subscribe = _subscribe;
exports.subscribeDependency = subscribeDependency;
exports.update = update;
exports.invalidate = invalidate;
exports.emit = emit;
exports.createFuncCallState = createFuncCallState;
exports._dependentFunc = _dependentFunc;
exports.makeDependentIterator = makeDependentIterator;
exports.isRefType = isRefType;
exports.createSemiWeakMap = createSemiWeakMap;
exports.semiWeakMapGet = semiWeakMapGet;
exports.semiWeakMapSet = semiWeakMapSet;
exports.createCallWithArgs = createCallWithArgs;
exports._getFuncCallState = _getFuncCallState;
exports.createDependentFunc = createDependentFunc;
exports.createMakeDependentFunc = createMakeDependentFunc;
exports.createGetFuncCallState = createGetFuncCallState;
exports.makeDependentFunc = exports.getFuncCallState = exports.FuncCallState = exports.poolLast = exports.poolFirst = exports.subscriberLinkPool = exports.SubscriberLinkPool = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _weakMap = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/weak-map"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _async = require("../../async/async");

var _ThenableSync = require("../../async/ThenableSync");

var _helpers = require("../../helpers/helpers");

var _contracts = require("./contracts");

var _marked =
/*#__PURE__*/
_regenerator.default.mark(makeDependentIterator);

// invalidate,
// getFuncCallState,
// makeDependentFunc,
// region subscriberLinkPool
var SubscriberLinkPool = function SubscriberLinkPool() {
  (0, _classCallCheck2.default)(this, SubscriberLinkPool);
  this.size = 0;
  this.maxSize = 1000000;
  this.stack = [];
};

exports.SubscriberLinkPool = SubscriberLinkPool;
var subscriberLinkPool = new SubscriberLinkPool();
exports.subscriberLinkPool = subscriberLinkPool;
var poolFirst;
exports.poolFirst = poolFirst;
var poolLast;
exports.poolLast = poolLast;

function getSubscriberLinkFromPool() {
  // Pool as Linked List
  // const result = poolLast
  // if (result != null) {
  // 	const {prev} = result
  // 	if (prev == null) {
  // 		poolFirst = null
  // 		poolLast = null
  // 	} else {
  // 		prev.next = null
  // 		poolLast = prev
  // 	}
  // }
  // return result
  // Pool as Array
  // this.usedSize++
  var lastIndex = subscriberLinkPool.size - 1;

  if (lastIndex >= 0) {
    var obj = subscriberLinkPool.stack[lastIndex];
    subscriberLinkPool.stack[lastIndex] = null;
    subscriberLinkPool.size = lastIndex;

    if (obj == null) {
      throw new Error('obj == null');
    }

    return obj;
  }

  return null;
} // tslint:disable-next-line:no-shadowed-variable


function releaseSubscriberLink(obj) {
  // Pool as Linked List
  // if (poolLast == null) {
  // 	poolFirst = obj
  // 	obj.prev = null
  // } else {
  // 	poolLast.next = obj
  // 	obj.prev = poolLast
  // }
  // obj.next = null
  // poolLast = obj
  // Pool as Array
  // this.usedSize--
  if (subscriberLinkPool.size < subscriberLinkPool.maxSize) {
    subscriberLinkPool.stack[subscriberLinkPool.size] = obj;
    subscriberLinkPool.size++;
  }
} // tslint:disable-next-line:no-shadowed-variable


function getSubscriberLink(state, subscriber, prev, next) {
  var item = getSubscriberLinkFromPool();

  if (item != null) {
    item.state = state;
    item.value = subscriber;
    item.prev = prev;
    item.next = next;
    return item;
  }

  return {
    state: state,
    value: subscriber,
    prev: prev,
    next: next
  };
} // endregion
// region subscribeDependency


function subscriberLinkDelete(state, item) {
  if (state == null) {
    return;
  }

  var prev = item.prev,
      next = item.next;

  if (prev == null) {
    if (next == null) {
      state._subscribersFirst = null;
      state._subscribersLast = null;
    } else {
      state._subscribersFirst = next;
      next.prev = null;
      item.next = null;
    }
  } else {
    if (next == null) {
      state._subscribersLast = prev;
      prev.next = null;
    } else {
      prev.next = next;
      next.prev = prev;
      item.next = null;
    }

    item.prev = null;
  }

  item.state = null;
  item.value = null;
  releaseSubscriberLink(item);
} // tslint:disable-next-line:no-shadowed-variable


function unsubscribeDependencies(state) {
  var _unsubscribers = state._unsubscribers;

  if (_unsubscribers != null) {
    var len = state._unsubscribersLength;

    for (var i = 0; i < len; i++) {
      var item = _unsubscribers[i];
      _unsubscribers[i] = null; // subscriberLinkDelete(item.state, item)
      // region inline call

      {
        // tslint:disable-next-line:no-shadowed-variable
        var prev = item.prev,
            next = item.next,
            _state = item.state;

        if (_state == null) {
          return;
        }

        if (prev == null) {
          if (next == null) {
            _state._subscribersFirst = null;
            _state._subscribersLast = null;
          } else {
            _state._subscribersFirst = next;
            next.prev = null;
            item.next = null;
          }
        } else {
          if (next == null) {
            _state._subscribersLast = prev;
            prev.next = null;
          } else {
            prev.next = next;
            next.prev = prev;
            item.next = null;
          }

          item.prev = null;
        }

        item.state = null;
        item.value = null;
        releaseSubscriberLink(item);
      } // endregion
    }

    state._unsubscribersLength = 0;

    if (len > 256) {
      _unsubscribers.length = 256;
    }
  }
}

function _subscribe(state, subscriber) {
  var _subscribersLast = state._subscribersLast;
  var subscriberLink = getSubscriberLink(state, subscriber, _subscribersLast, null);

  if (_subscribersLast == null) {
    state._subscribersFirst = subscriberLink;
  } else {
    _subscribersLast.next = subscriberLink;
  }

  state._subscribersLast = subscriberLink;
  return subscriberLink;
} // tslint:disable-next-line:no-shadowed-variable


function subscribeDependency(state, dependency) {
  if (dependency.callId > state.callId) {
    return;
  }

  var subscriberLink = _subscribe(dependency, state);

  var _unsubscribers = state._unsubscribers;

  if (_unsubscribers == null) {
    state._unsubscribers = [subscriberLink];
    state._unsubscribersLength = 1;
  } else {
    _unsubscribers[state._unsubscribersLength++] = subscriberLink;
  }
} // endregion
// region _createDependentFunc


var FuncCallStatus_Invalidating = 1;
var FuncCallStatus_Invalidated = 2;
var FuncCallStatus_Calculating = 3;
var FuncCallStatus_CalculatingAsync = 4;
var FuncCallStatus_Calculated = 5;
var FuncCallStatus_Error = 6;

function update(state, status, valueAsyncOrValueOrError) {
  var prevStatus = state.status;

  switch (status) {
    case FuncCallStatus_Invalidating:
      if (prevStatus === FuncCallStatus_Invalidated) {
        return;
      }

      if (prevStatus !== FuncCallStatus_Invalidating && prevStatus !== FuncCallStatus_Calculated && prevStatus !== FuncCallStatus_Error) {
        throw new Error("Set status " + status + " called when current status is " + prevStatus);
      }

      break;

    case FuncCallStatus_Invalidated:
      if (prevStatus !== FuncCallStatus_Invalidating) {
        return;
      }

      break;

    case FuncCallStatus_Calculating:
      if (prevStatus != null && prevStatus !== FuncCallStatus_Invalidating && prevStatus !== FuncCallStatus_Invalidated) {
        throw new Error("Set status " + status + " called when current status is " + prevStatus);
      }

      break;

    case FuncCallStatus_CalculatingAsync:
      if (prevStatus !== FuncCallStatus_Calculating) {
        throw new Error("Set status " + status + " called when current status is " + prevStatus);
      }

      state.valueAsync = valueAsyncOrValueOrError;
      break;

    case FuncCallStatus_Calculated:
      if (prevStatus !== FuncCallStatus_Calculating && prevStatus !== FuncCallStatus_CalculatingAsync) {
        throw new Error("Set status " + status + " called when current status is " + prevStatus);
      }

      if (typeof state.valueAsync !== 'undefined') {
        state.valueAsync = null;
      }

      state.error = void 0;
      state.value = valueAsyncOrValueOrError;
      state.hasError = false;
      state.hasValue = true;
      break;

    case FuncCallStatus_Error:
      if (prevStatus !== FuncCallStatus_Calculating && prevStatus !== FuncCallStatus_CalculatingAsync) {
        throw new Error("Set status " + status + " called when current status is " + prevStatus);
      }

      if (typeof state.valueAsync !== 'undefined') {
        state.valueAsync = null;
      }

      state.error = valueAsyncOrValueOrError;
      state.hasError = true;
      break;

    default:
      throw new Error('Unknown FuncCallStatus: ' + status);
  }

  state.status = status;

  switch (status) {
    case FuncCallStatus_Invalidating:
      // emit(state, status)
      // region inline call
      if (state._subscribersFirst != null) {
        // let clonesFirst
        // let clonesLast
        // for (let link = state._subscribersFirst; link; link = link.next) {
        // 	const cloneLink = getSubscriberLink(state, link.value, null, link.next)
        // 	if (clonesLast == null) {
        // 		clonesFirst = cloneLink
        // 	} else {
        // 		clonesLast.next = cloneLink
        // 	}
        // 	clonesLast = cloneLink
        // }
        for (var link = state._subscribersFirst; link;) {
          var next = link.next;

          if (link.value.status !== _contracts.FuncCallStatus.Invalidating && link.value.status !== _contracts.FuncCallStatus.Invalidated) {
            // invalidate(link.value, status)
            // region inline call
            {
              // tslint:disable-next-line:no-shadowed-variable
              var _state2 = link.value;
              update(_state2, FuncCallStatus_Invalidating);
            } // endregion
            // link.value = null
            // link.next = null
            // releaseSubscriberLink(link)
          }

          link = next;
        }
      } // endregion


      break;

    case FuncCallStatus_Invalidated:
      // emit(state, status)
      // region inline call
      if (state._subscribersFirst != null) {
        // let clonesFirst
        // let clonesLast
        // for (let link = state._subscribersFirst; link; link = link.next) {
        // 	const cloneLink = getSubscriberLink(state, link.value, null, link.next)
        // 	if (clonesLast == null) {
        // 		clonesFirst = cloneLink
        // 	} else {
        // 		clonesLast.next = cloneLink
        // 	}
        // 	clonesLast = cloneLink
        // }
        for (var _link = state._subscribersFirst; _link;) {
          var _next = _link.next; // invalidate(link.value, status)
          // region inline call

          {
            // tslint:disable-next-line:no-shadowed-variable
            var _state3 = _link.value;
            update(_state3, FuncCallStatus_Invalidated);
          } // endregion
          // link.value = null
          // link.next = null
          // releaseSubscriberLink(link)

          _link = _next;
        }
      } // endregion


      break;
  }
} // tslint:disable-next-line:no-shadowed-variable


function invalidate(state, status) {
  if (status == null) {
    update(state, FuncCallStatus_Invalidating);
    update(state, FuncCallStatus_Invalidated);
  } else {
    update(state, status);
  }
}

function emit(state, status) {
  if (state._subscribersFirst != null) {
    var clonesFirst;
    var clonesLast;

    for (var link = state._subscribersFirst; link; link = link.next) {
      var cloneLink = getSubscriberLink(state, link.value, null, link.next);

      if (clonesLast == null) {
        clonesFirst = cloneLink;
      } else {
        clonesLast.next = cloneLink;
      }

      clonesLast = cloneLink;
    }

    for (var _link2 = clonesFirst; _link2;) {
      invalidate(_link2.value, status);
      _link2.value = null;
      var next = _link2.next;
      _link2.next = null;
      releaseSubscriberLink(_link2);
      _link2 = next;
    }
  }
}

var FuncCallState = function FuncCallState(func, _this, callWithArgs) {
  (0, _classCallCheck2.default)(this, FuncCallState);
  this.status = FuncCallStatus_Invalidated;
  this.hasValue = false;
  this.hasError = false;
  this.valueAsync = null;
  this.value = void 0;
  this.error = void 0;
  this.parentCallState = null;
  this._subscribersFirst = null;
  this._subscribersLast = null;
  this.callId = 0;
  this._unsubscribers = null;
  this._unsubscribersLength = 0;
  this.func = func;
  this._this = _this;
  this.callWithArgs = callWithArgs;
}; // tslint:disable-next-line:no-shadowed-variable


exports.FuncCallState = FuncCallState;

function createFuncCallState(func, _this, callWithArgs) {
  return new FuncCallState(func, _this, callWithArgs);
}

var currentState;
var nextCallId = 1;

function _dependentFunc(state) {
  if (currentState != null) {
    subscribeDependency(currentState, state);
  }

  state.callId = nextCallId++;

  if (state.status != null) {
    switch (state.status) {
      case FuncCallStatus_Calculated:
        return state.value;

      case FuncCallStatus_Invalidating:
      case FuncCallStatus_Invalidated:
        break;

      case FuncCallStatus_CalculatingAsync:
        var parentCallState = state.parentCallState;

        while (parentCallState) {
          if (parentCallState === state) {
            throw new Error('Recursive async loop detected');
          }

          parentCallState = parentCallState.parentCallState;
        }

        return state.valueAsync;

      case FuncCallStatus_Error:
        throw state.error;

      case FuncCallStatus_Calculating:
        throw new Error('Recursive sync loop detected');

      default:
        throw new Error('Unknown FuncStatus: ' + state.status);
    }
  } // unsubscribeDependencies(state)
  // region inline call


  {
    var _unsubscribers = state._unsubscribers;

    if (_unsubscribers != null) {
      var len = state._unsubscribersLength;

      for (var i = 0; i < len; i++) {
        var item = _unsubscribers[i];
        _unsubscribers[i] = null; // subscriberLinkDelete(item.state, item)
        // region inline call

        {
          // tslint:disable-next-line:no-shadowed-variable
          var prev = item.prev,
              next = item.next,
              _state4 = item.state;

          if (_state4 == null) {
            return;
          }

          if (prev == null) {
            if (next == null) {
              _state4._subscribersFirst = null;
              _state4._subscribersLast = null;
            } else {
              _state4._subscribersFirst = next;
              next.prev = null;
              item.next = null;
            }
          } else {
            if (next == null) {
              _state4._subscribersLast = prev;
              prev.next = null;
            } else {
              prev.next = next;
              next.prev = prev;
              item.next = null;
            }

            item.prev = null;
          }

          item.state = null;
          item.value = null;
          releaseSubscriberLink(item);
        } // endregion
      }

      state._unsubscribersLength = 0;

      if (len > 256) {
        _unsubscribers.length = 256;
      }
    }
  } // endregion

  state.parentCallState = currentState;
  currentState = state; // return tryInvoke.apply(state, arguments)

  try {
    update(state, FuncCallStatus_Calculating); // let value: any = state.func.apply(state._this, arguments)

    var value = state.callWithArgs(state._this, state.func);

    if ((0, _helpers.isIterator)(value)) {
      value = (0, _ThenableSync.resolveAsync)(makeDependentIterator(state, value));

      if ((0, _async.isThenable)(value)) {
        update(state, FuncCallStatus_CalculatingAsync, value);
      }

      return value;
    } else if ((0, _async.isThenable)(value)) {
      throw new Error('You should use iterator instead thenable for async functions');
    }

    update(state, FuncCallStatus_Calculated, value);
    return value;
  } catch (error) {
    update(state, FuncCallStatus_Error, error);
    throw error;
  } finally {
    currentState = state.parentCallState;
    state.parentCallState = null;
  }
}

function makeDependentIterator(state, iterator, nested) {
  var iteration, value;
  return _regenerator.default.wrap(function makeDependentIterator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          currentState = state;
          _context.prev = 1;
          iteration = iterator.next();

        case 3:
          if (iteration.done) {
            _context.next = 13;
            break;
          }

          value = iteration.value;

          if ((0, _helpers.isIterator)(value)) {
            value = makeDependentIterator(state, value, true);
          }

          _context.next = 8;
          return value;

        case 8:
          value = _context.sent;
          currentState = state;
          iteration = iterator.next(value);
          _context.next = 3;
          break;

        case 13:
          if (nested == null) {
            update(state, FuncCallStatus_Calculated, iteration.value);
          }

          return _context.abrupt("return", iteration.value);

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](1);

          if (nested == null) {
            update(state, FuncCallStatus_Error, _context.t0);
          }

          throw _context.t0;

        case 21:
          _context.prev = 21;
          currentState = null;
          state.parentCallState = null;
          return _context.finish(21);

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, null, [[1, 17, 21, 25]]);
} // endregion
// region _getFuncCallState


function isRefType(value) {
  return value != null && (typeof value === 'object' || typeof value === 'function');
}

function createSemiWeakMap() {
  return {
    map: null,
    weakMap: null
  };
}

function semiWeakMapGet(semiWeakMap, key) {
  var value;

  if (isRefType(key)) {
    var weakMap = semiWeakMap.weakMap;

    if (weakMap != null) {
      value = weakMap.get(key);
    }
  } else {
    var map = (0, _map2.default)(semiWeakMap);

    if (map != null) {
      value = map.get(key);
    }
  }

  return value == null ? null : value;
}

function semiWeakMapSet(semiWeakMap, key, value) {
  if (isRefType(key)) {
    var weakMap = semiWeakMap.weakMap;

    if (weakMap == null) {
      semiWeakMap.weakMap = weakMap = new _weakMap.default();
    }

    weakMap.set(key, value);
  } else {
    var map = (0, _map2.default)(semiWeakMap);

    if (map == null) {
      semiWeakMap.map = map = new _map.default();
    }

    map.set(key, value);
  }
}

function createCallWithArgs() {
  var args = arguments;
  return function (_this, func) {
    return func.apply(_this, args);
  };
} // tslint:disable-next-line:no-shadowed-variable


function _getFuncCallState(func, funcStateMap) {
  return function () {
    var argumentsLength = arguments.length;
    var argsLengthStateMap = funcStateMap.get(argumentsLength);

    if (argsLengthStateMap == null) {
      argsLengthStateMap = createSemiWeakMap();
      funcStateMap.set(argumentsLength, argsLengthStateMap);
    }

    var state;
    var currentMap = semiWeakMapGet(argsLengthStateMap, this);

    if (argumentsLength !== 0) {
      if (currentMap == null) {
        currentMap = createSemiWeakMap();
        semiWeakMapSet(argsLengthStateMap, this, currentMap);
      }

      for (var i = 0; i < argumentsLength - 1; i++) {
        var arg = arguments[i];
        var nextStateMap = semiWeakMapGet(currentMap, arg);

        if (nextStateMap == null) {
          nextStateMap = createSemiWeakMap();
          semiWeakMapSet(currentMap, arg, nextStateMap);
        }

        currentMap = nextStateMap;
      }

      var lastArg = arguments[argumentsLength - 1];
      state = semiWeakMapGet(currentMap, lastArg);

      if (state == null) {
        state = createFuncCallState(func, this, createCallWithArgs.apply(null, arguments));
        semiWeakMapSet(currentMap, lastArg, state);
      }
    } else {
      state = semiWeakMapGet(argsLengthStateMap, this);

      if (state == null) {
        state = createFuncCallState(func, this, createCallWithArgs.apply(null, arguments));
        semiWeakMapSet(argsLengthStateMap, this, state);
      }
    }

    return state;
  };
} // endregion
// region facade


function createDependentFunc(getState) {
  return function () {
    var state = getState.apply(this, arguments);
    return _dependentFunc(state);
  };
}

// tslint:disable-next-line:no-shadowed-variable
function createMakeDependentFunc(rootStateMap) {
  // tslint:disable-next-line:no-shadowed-variable
  // tslint:disable-next-line:no-shadowed-variable
  // tslint:disable-next-line:no-shadowed-variable
  function makeDependentFunc(func) {
    if (rootStateMap.get(func)) {
      throw new Error('Multiple call makeDependentFunc() for func: ' + func);
    }

    var getState = _getFuncCallState(func, new _map.default());

    rootStateMap.set(func, getState);
    var dependentFunc = createDependentFunc(getState);
    rootStateMap.set(dependentFunc, getState);
    return dependentFunc;
  }

  return makeDependentFunc;
} // tslint:disable-next-line:no-empty


var emptyFunc = function emptyFunc() {}; // tslint:disable-next-line:no-shadowed-variable


function createGetFuncCallState(rootStateMap) {
  // tslint:disable-next-line:no-shadowed-variable
  function getFuncCallState(func) {
    return rootStateMap.get(func) || emptyFunc;
  }

  return getFuncCallState;
}

var rootStateMap = new _weakMap.default(); // tslint:disable-next-line:no-shadowed-variable

var getFuncCallState = createGetFuncCallState(rootStateMap); // tslint:disable-next-line:no-shadowed-variable

exports.getFuncCallState = getFuncCallState;
var makeDependentFunc = createMakeDependentFunc(rootStateMap); // endregion

exports.makeDependentFunc = makeDependentFunc;