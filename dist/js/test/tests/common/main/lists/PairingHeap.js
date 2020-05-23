"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _ObjectPool = require("../../../../../main/common/lists/ObjectPool");

var _PairingHeap = require("../../../../../main/common/lists/PairingHeap");

var _Assert = require("../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../main/common/test/Mocha");

var objectPool = new _ObjectPool.ObjectPool(1000000);

function getMinIndex(arr) {
  var min;
  var minIndex;

  for (var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];

    if (i === 0 || item.item < min) {
      min = item.item;
      minIndex = i;
    }
  }

  return minIndex;
}

var PairingHeapTester = /*#__PURE__*/function () {
  function PairingHeapTester() {
    (0, _classCallCheck2.default)(this, PairingHeapTester);
    this._heap = new _PairingHeap.PairingHeap({
      objectPool: objectPool
    });
    this._checkItems = [];
    this.check();
  }

  (0, _createClass2.default)(PairingHeapTester, [{
    key: "check",
    value: function check() {
      var _heap = this._heap,
          _checkItems = this._checkItems; // check size

      _Assert.assert.strictEqual(_heap.size, _checkItems.length);
    }
  }, {
    key: "add",
    value: function add(item) {
      var node = this._heap.add(item);

      _Assert.assert.strictEqual(node.item, item);

      this._checkItems.push(node);

      this.check();
      return node;
    }
  }, {
    key: "delete",
    value: function _delete(node) {
      var _context;

      var index = (0, _indexOf.default)(_context = this._checkItems).call(_context, node);
      var checkItem = node.item;

      if (index >= 0) {
        var _context2;

        _Assert.assert.ok(index < this._checkItems.length);

        _Assert.assert.strictEqual(this._checkItems[index], node);

        (0, _splice.default)(_context2 = this._checkItems).call(_context2, index, 1);
      }

      this._heap.delete(node);

      if (node == null) {
        _Assert.assert.strictEqual(index, -1);
      } else {
        _Assert.assert.ok(index >= 0);
      }

      this.check();
    }
  }, {
    key: "deleteMin",
    value: function deleteMin() {
      var index = getMinIndex(this._checkItems);
      var checkItem = index >= 0 ? this._checkItems[index].item : null;

      var item = this._heap.deleteMin();

      _Assert.assert.strictEqual(item, checkItem);

      if (item == null) {
        _Assert.assert.strictEqual(this._checkItems.length, 0);
      } else {
        var _context3;

        _Assert.assert.ok(index < this._checkItems.length);

        (0, _splice.default)(_context3 = this._checkItems).call(_context3, index, 1);
      }

      this.check();
      return item;
    }
  }]);
  return PairingHeapTester;
}();

(0, _Mocha.describe)('common > main > PairingHeap', function () {
  this.timeout(6000000);
  var totalTests = 0;
  after(function () {
    console.log('Total PairingHeap tests >= ' + totalTests);
  });

  function testVariant(heap, addItems, deleteIndexes) {
    try {
      var deleteNodes = [];

      for (var i = 0, len = addItems.length; i < len; i++) {
        deleteNodes.push(heap.add(addItems[i]));
      }

      for (var _i = 0, _len = deleteNodes.length; _i < _len; _i++) {
        heap.delete(deleteNodes[_i]);
      }

      for (var _i2 = 0, _len2 = addItems.length; _i2 < _len2; _i2++) {
        deleteNodes.push(heap.add(addItems[_i2]));
      }

      for (var _i3 = 0, _len3 = addItems.length; _i3 < _len3; _i3++) {
        _Assert.assert.strictEqual(heap.deleteMin(), _i3);
      } // heap.deleteMin()

    } catch (ex) {
      console.log("testsCount: " + totalTests);
      console.log("addItems: " + addItems.join(','));
      console.log("deleteItems: " + deleteIndexes.join(','));
      throw ex;
    }

    totalTests++;
  }

  (0, _Mocha.it)('add / delete', function () {
    var heap = new PairingHeapTester();
    testVariant(heap, [0, 3, 1, 5, 4, 6, 2], [1, 5, 2, 4, 3, 0, 6]);
  });
  (0, _Mocha.it)('add / delete random', function () {
    var heap = new PairingHeapTester();
    var variants = [0, 1, 2, 3, 4, 5, 6];

    for (var i = 0; i < 10000; i++) {
      var _context4, _context5;

      var addItems = (0, _sort.default)(_context4 = (0, _slice.default)(variants).call(variants)).call(_context4, function () {
        return Math.random() > 0.5 ? 1 : -1;
      });
      var deleteIndexes = (0, _sort.default)(_context5 = (0, _slice.default)(variants).call(variants)).call(_context5, function () {
        return Math.random() > 0.5 ? 1 : -1;
      });
      testVariant(heap, addItems, deleteIndexes);
    }
  });
});