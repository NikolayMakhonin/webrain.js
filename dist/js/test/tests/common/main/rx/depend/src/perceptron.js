"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createPerceptronNaked = createPerceptronNaked;
exports.createPerceptron = createPerceptron;

var _flatMap = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/flat-map"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _helpers = require("../../../../../../../main/common/helpers/helpers");

var _CallState = require("../../../../../../../main/common/rx/depend/core/CallState");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _helpers2 = require("./helpers");

function createPerceptronNaked(layerSize, layersCount, check) {
  if (check === void 0) {
    check = true;
  }

  var countFuncs = layersCount * layerSize + 2;

  var input = function input() {
    return 1;
  }; // first layer


  var layer;

  var _loop = function _loop(i) {
    var func = function func(a, b) {
      return i * a * b * input() * this;
    };

    if (i === 0) {
      layer = [func];
    } else {
      layer[i] = func;
    }
  };

  for (var i = 0; i < layerSize; i++) {
    _loop(i);
  }

  var layers = [layer];

  for (var _i = 0; _i < layersCount - 1; _i++) {
    var nextLayer = void 0;

    var _loop2 = function _loop2(j) {
      var prevLayer = layer;

      var func = function func(a, b) {
        var sum = 0;

        for (var k = 0; k < layerSize; k++) {
          sum += prevLayer[k].call(this, a, b);
        }

        return sum;
      };

      if (j === 0) {
        nextLayer = [func];
      } else {
        nextLayer[j] = func;
      }
    };

    for (var j = 0; j < layerSize; j++) {
      _loop2(j);
    }

    layer = nextLayer;
    layers.push(layer);
  }

  var output;
  {
    var prevLayer = layer;

    output = function output(a, b) {
      var sum = 0;

      for (var _i2 = 0; _i2 < layerSize; _i2++) {
        sum += prevLayer[_i2].call(this, a, b);
      }

      return sum;
    };
  }

  if (check) {
    _Assert.assert.strictEqual(output.call(2, 5, 10).toPrecision(6), (100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6));
  }

  return output;
}

function createNextLayer(prevLayer, layerSize) {
  return (0, _helpers2.__makeDependentFunc)(function (a, b) {
    var sum = 0;

    for (var k = 0; k < layerSize; k++) {
      sum += prevLayer[k].call(this, a, b);
    }

    return sum;
  });
}

function createFirstLayer(i, input) {
  return (0, _helpers2.__makeDependentFunc)(function (a, b) {
    return i * a * b * input() * this;
  });
}

function createPerceptron(layerSize, layersCount, check) {
  if (check === void 0) {
    check = true;
  }

  var countFuncs = layersCount * layerSize + 2; // region randomValues

  var randomValues = [0, {
    x: 1
  }, '123', null, function () {
    return {};
  }, 1, false, function () {
    return 1;
  }, {}, '', void 0, 2, {
    y: 1,
    x: 2
  }, true];
  var randomValuesLength = randomValues.length; // endregion

  var callId = 0;
  var input = (0, _helpers2.__makeDependentFunc)(function () {
    return ++callId;
  }); // first layer

  var layer;

  for (var i = 0; i < layerSize; i++) {
    var func = createFirstLayer(i, input);

    if (i === 0) {
      layer = [func];
    } else {
      layer[i] = func;
    }
  }

  var layers = [layer];

  for (var _i3 = 0; _i3 < layersCount - 1; _i3++) {
    var nextLayer = void 0;

    for (var j = 0; j < layerSize; j++) {
      var prevLayer = layer; // const r1 = randomValues[(i * layerSize * 3 + j) % randomValuesLength]
      // const r2 = randomValues[(i * layerSize * 3 + j + 1) % randomValuesLength]
      // const r3 = randomValues[(i * layerSize * 3 + j + 2) % randomValuesLength]

      var _func = createNextLayer(prevLayer, layerSize);

      if (j === 0) {
        nextLayer = [_func];
      } else {
        nextLayer[j] = _func;
      }
    }

    layer = nextLayer;
    layers.push(layer);
  }

  var output;
  {
    var _prevLayer = layer;
    output = (0, _helpers2.__makeDependentFunc)(function (a, b) {
      var sum = 0;

      for (var _i4 = 0; _i4 < layerSize; _i4++) {
        sum += _prevLayer[_i4].call(this, a, b);
      }

      return sum;
    });
  }

  var _states;

  var getStates = function getStates() {
    if (!_states) {
      var _context;

      _states = (0, _map.default)(_context = (0, _flatMap.default)(layers).call(layers, function (o) {
        return o;
      })).call(_context, function (o) {
        return (0, _CallState.getOrCreateCallState)(o)();
      });
    }

    return _states;
  };

  var inputState = (0, _CallState.getOrCreateCallState)(input)();
  var outputState = (0, _CallState.getOrCreateCallState)(output).call(2, 5, 10);

  if (check) {
    _Assert.assert.strictEqual((0, _helpers2.__outputCall)(output).toPrecision(6), (callId * 100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6));

    inputState.invalidate();

    _Assert.assert.strictEqual((0, _helpers2.__outputCall)(output).toPrecision(6), (callId * 100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6));
  }

  var outputStateHash = 17;

  for (var _i5 = 0; _i5 < outputState.valueIds.length; _i5++) {
    outputStateHash = (0, _helpers.nextHash)(outputStateHash, outputState.valueIds[_i5]);
  }

  return {
    getStates: getStates,
    countFuncs: countFuncs,
    input: input,
    inputState: inputState,
    output: output,
    outputState: outputState,
    outputStateHash: outputStateHash
  };
}