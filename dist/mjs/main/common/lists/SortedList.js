import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";

var _Symbol$iterator, _Symbol$toStringTag;

import { mergeMaps } from '../extensions/merge/merge-maps';
import { createMergeSetWrapper } from '../extensions/merge/merge-sets';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { ListChangedObject } from './base/ListChangedObject';
import { ListChangedType } from './contracts/IListChanged';
import { binarySearch, move } from './helpers/array';
import { compareFast } from './helpers/compare';
import { fillCollection } from './helpers/set';

function calcOptimalArraySize(desiredSize) {
  var optimalSize = 4;

  while (desiredSize > optimalSize) {
    optimalSize <<= 1;
  }

  return optimalSize;
}

export function getDefaultValue(value) {
  if (value === null || typeof value === 'undefined') {
    return value;
  }

  if (typeof value === 'number') {
    return 0;
  }

  if (typeof value === 'boolean') {
    return false;
  }

  return null;
}
_Symbol$iterator = Symbol.iterator;
_Symbol$toStringTag = Symbol.toStringTag;
export var SortedList =
/*#__PURE__*/
function (_ListChangedObject) {
  _inherits(SortedList, _ListChangedObject);

  // region constructor
  function SortedList() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        array = _ref.array,
        minAllocatedSize = _ref.minAllocatedSize,
        compare = _ref.compare,
        autoSort = _ref.autoSort,
        notAddIfExists = _ref.notAddIfExists,
        countSorted = _ref.countSorted;

    _classCallCheck(this, SortedList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SortedList).call(this));
    _this[_Symbol$toStringTag] = 'List';
    _this._array = array || [];
    _this._size = _this._array.length;

    if (minAllocatedSize) {
      _this._minAllocatedSize = minAllocatedSize;
    }

    if (compare) {
      _this._compare = compare;
    }

    if (autoSort) {
      _this._autoSort = !!autoSort;
    }

    if (notAddIfExists) {
      _this._notAddIfExists = !!notAddIfExists;
    }

    _this._countSorted = countSorted || 0;
    return _this;
  } // endregion
  // region Properties
  // region minAllocatedSize


  _createClass(SortedList, [{
    key: "_updateAllocatedSize",
    value: function _updateAllocatedSize() {
      var _array = this._array,
          _size = this._size,
          _minAllocatedSize = this._minAllocatedSize; // We should not manually increment array size,
      // because push() method do it faster and guarantees
      // that the array will not be converted to hashTable

      if (_size * 2 < _array.length) {
        var newLength = _size * 2;

        if (newLength < _minAllocatedSize) {
          newLength = _minAllocatedSize;
        }

        newLength = calcOptimalArraySize(newLength);

        if (newLength < _array.length) {
          _array.length = newLength;
        }
      }
    } // endregion
    // region size

  }, {
    key: "_setSize",
    value: function _setSize(newSize) {
      var oldSize = this._size;

      if (oldSize === newSize) {
        return newSize;
      }

      this._size = newSize;
      var _array = this._array;

      this._updateAllocatedSize(); // Clear not used space to free memory from unnecessary objects


      if (newSize < oldSize) {
        var defaultValue = getDefaultValue(_array[newSize === 0 ? 0 : newSize - 1]);
        var newLength = _array.length;

        for (var i = newSize; i < newLength; i++) {
          _array[i] = defaultValue;
        }
      }

      return newSize;
    } // endregion
    // region compare

  }, {
    key: "removeDuplicates",
    value: function removeDuplicates(withoutShift) {
      var _array = this._array;
      var count = 0;
      var i = this._size - 1;

      if (this._autoSort) {
        withoutShift = false;
        this.sort();
      }

      while (i >= 0) {
        var contains = this.indexOf(_array[i], 0, i) >= 0;

        if (contains) {
          this.removeAt(i, withoutShift);
          count++;
        }

        i--;
      }

      return count;
    }
  }, {
    key: "get",
    value: function get(index) {
      var _size = this._size,
          _array = this._array,
          _autoSort = this._autoSort;

      if (_autoSort) {
        this.sort();
      }

      index = SortedList._prepareIndex(index, _size);
      return _array[index];
    }
  }, {
    key: "set",
    value: function set(index, item) {
      var _size = this._size,
          _array = this._array;
      index = SortedList._prepareIndex(index, _size + 1);

      if (index >= _size) {
        return this.add(item);
      }

      var _autoSort = this._autoSort,
          _notAddIfExists = this._notAddIfExists,
          _compare = this._compare,
          _listChangedIfCanEmit = this._listChangedIfCanEmit;

      if (_autoSort) {
        this.sort();
      }

      var oldItem = _array[index];

      if ((_notAddIfExists || _autoSort || _listChangedIfCanEmit) && (_compare || SortedList.compareDefault)(oldItem, item) === 0) {
        return false;
      }

      var moveIndex;

      if (_notAddIfExists) {
        var foundIndex = this.indexOf(item, null, null, _autoSort ? 1 : 0);

        if (foundIndex < 0) {
          if (_autoSort) {
            foundIndex = ~foundIndex;
            moveIndex = foundIndex > index ? foundIndex - 1 : foundIndex;
          } else {
            moveIndex = index;
          }
        } else if (foundIndex !== index) {
          return this.removeAt(index);
        } else {
          return false;
        }
      } else if (_autoSort) {
        var _foundIndex = this.indexOf(item, 0, this._countSorted, 1);

        if (_foundIndex < 0) {
          _foundIndex = ~_foundIndex;
        } else if (_foundIndex === index) {
          return false;
        }

        moveIndex = _foundIndex > index ? _foundIndex - 1 : _foundIndex;
      } else {
        moveIndex = index;
      }

      if (_listChangedIfCanEmit) {
        _array[index] = item;

        if (moveIndex !== index) {
          this._move(index, moveIndex);
        }

        _listChangedIfCanEmit.emit({
          type: ListChangedType.Set,
          index: index,
          oldItems: [oldItem],
          newItems: [item],
          moveIndex: moveIndex
        });
      } else {
        _array[index] = item;

        if (moveIndex !== index) {
          this._move(index, moveIndex);
        }
      }

      return true;
    }
  }, {
    key: "add",
    value: function add(item) {
      var _notAddIfExists = this._notAddIfExists,
          _autoSort = this._autoSort,
          _size = this._size;

      if (_autoSort) {
        this.sort();
      }

      var index;

      if (_notAddIfExists) {
        index = this.indexOf(item, null, null, _autoSort ? 1 : 0);

        if (index < 0) {
          index = ~index;
        } else {
          return false;
        }
      } else if (_autoSort) {
        index = this.indexOf(item, 0, this._countSorted, 1);

        if (index < 0) {
          index = ~index;
        }
      } else {
        index = _size;
      }

      if (_autoSort) {
        this._countSorted++;
      }

      index = SortedList._prepareIndex(index, _size + 1);
      return this._insert(index, item);
    }
  }, {
    key: "addArray",
    value: function addArray(sourceItems, sourceStart, sourceEnd) {
      return this.insertArray(this._size, sourceItems, sourceStart, sourceEnd);
    }
  }, {
    key: "addIterable",
    value: function addIterable(items, itemsSize) {
      return this.insertIterable(this._size, items, itemsSize);
    }
  }, {
    key: "_insert",
    value: function _insert(index, item) {
      var size = this._size,
          _array = this._array;
      var newSize = size + 1;

      this._setSize(newSize);

      for (var i = newSize - 1; i > index; i--) {
        _array[i] = _array[i - 1];
      }

      _array[index] = item;
      var _listChangedIfCanEmit = this._listChangedIfCanEmit;

      if (_listChangedIfCanEmit) {
        _listChangedIfCanEmit.emit({
          type: ListChangedType.Added,
          index: index,
          newItems: [item],
          shiftIndex: index < size ? index + 1 : index
        });
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: size,
          newValue: newSize
        });
      }

      return true;
    }
  }, {
    key: "insert",
    value: function insert(index, item) {
      if (this._autoSort) {
        return this.add(item);
      }

      if (this._notAddIfExists && this.indexOf(item) >= 0) {
        return false;
      }

      index = SortedList._prepareIndex(index, this._size + 1);

      if (index < this._countSorted) {
        this._countSorted = index;
      }

      return this._insert(index, item);
    }
  }, {
    key: "insertArray",
    value: function insertArray(index, sourceItems, sourceStart, sourceEnd) {
      var size = this._size,
          _array = this._array,
          _autoSort = this._autoSort;
      var itemsSize = sourceItems.length;
      index = SortedList._prepareIndex(index, size + 1);
      sourceStart = SortedList._prepareStart(sourceStart, itemsSize);
      sourceEnd = SortedList._prepareEnd(sourceEnd, itemsSize);

      if (_autoSort) {
        var result = false;

        for (var i = sourceStart; i < sourceEnd; i++) {
          result = this.add(sourceItems[i]) || result;
        }

        return result;
      } else if (this._notAddIfExists) {
        var nextIndex = index;

        for (var _i = sourceStart; _i < sourceEnd; _i++) {
          if (this.insert(nextIndex, sourceItems[_i])) {
            nextIndex++;
          }
        }

        return nextIndex !== index;
      }

      itemsSize = sourceEnd - sourceStart;

      if (itemsSize <= 0) {
        return false;
      }

      var newSize = size + itemsSize;

      this._setSize(newSize);

      for (var _i2 = newSize - 1 - itemsSize; _i2 >= index; _i2--) {
        _array[_i2 + itemsSize] = _array[_i2];
      }

      for (var _i3 = 0; _i3 < itemsSize; _i3++) {
        _array[index + _i3] = sourceItems[sourceStart + _i3];
      }

      if (index < this._countSorted) {
        this._countSorted = index;
      }

      var _listChangedIfCanEmit = this._listChangedIfCanEmit;

      if (_listChangedIfCanEmit) {
        _listChangedIfCanEmit.emit({
          type: ListChangedType.Added,
          index: index,
          newItems: _array.slice(index, index + itemsSize),
          shiftIndex: index < size ? index + itemsSize : index
        });
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: size,
          newValue: newSize
        });
      }

      return true;
    }
  }, {
    key: "insertIterable",
    value: function insertIterable(index, items, itemsSize) {
      var size = this._size,
          _array = this._array;

      if (itemsSize <= 0) {
        return false;
      }

      if (Array.isArray(items)) {
        return this.insertArray(index, items, null, itemsSize);
      }

      var i;

      var start = SortedList._prepareIndex(index, size + 1);

      if (this._autoSort) {
        var result = false;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;
            result = this.add(item) || result;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return result;
      } else if (this._notAddIfExists) {
        var nextIndex = start;
        i = 0;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _item = _step2.value;

            if (this.insert(nextIndex, _item)) {
              nextIndex++;
            }

            i++;

            if (i >= itemsSize) {
              break;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return nextIndex !== start;
      }

      var end = start + itemsSize;
      var newSize = size + itemsSize;

      this._setSize(newSize);

      for (i = newSize - 1 - itemsSize; i >= start; i--) {
        _array[i + itemsSize] = _array[i];
      }

      i = start;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _item2 = _step3.value;
          _array[i++] = _item2;

          if (i >= end) {
            break;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (i !== end) {
        // rollback
        try {
          this.__meta.propertyChangedDisabled = true;
          this.removeRange(start, end);
        } finally {
          this.__meta.propertyChangedDisabled = false;
        }

        throw new Error("Iterable items size (".concat(i - start, ") less than itemsSize (").concat(itemsSize, ")"));
      }

      if (start < this._countSorted) {
        this._countSorted = start;
      }

      var _listChangedIfCanEmit = this._listChangedIfCanEmit;

      if (_listChangedIfCanEmit) {
        _listChangedIfCanEmit.emit({
          type: ListChangedType.Added,
          index: start,
          newItems: _array.slice(start, end),
          shiftIndex: start < size ? end : start
        });
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: size,
          newValue: newSize
        });
      }

      return true;
    }
  }, {
    key: "removeAt",
    value: function removeAt(index, withoutShift) {
      var size = this._size,
          _array = this._array,
          _autoSort = this._autoSort;
      index = SortedList._prepareIndex(index, size);
      var _listChangedIfCanEmit = this._listChangedIfCanEmit;
      var oldItems;

      if (_listChangedIfCanEmit) {
        oldItems = [_array[index]];
      }

      if (withoutShift && !_autoSort) {
        _array[index] = _array[size - 1];

        if (index < size - 2 && index < this._countSorted) {
          this._countSorted = index;
        }
      } else {
        for (var i = index + 1; i < size; i++) {
          _array[i - 1] = _array[i];
        }
      }

      var newSize = this._setSize(size - 1);

      if (index < this._countSorted) {
        this._countSorted--;
      }

      if (_listChangedIfCanEmit) {
        _listChangedIfCanEmit.emit({
          type: ListChangedType.Removed,
          index: index,
          oldItems: oldItems,
          shiftIndex: index < size - 1 ? withoutShift ? size - 1 : index + 1 : index
        });
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: size,
          newValue: newSize
        });
      }

      return true;
    }
  }, {
    key: "removeRange",
    value: function removeRange(start, end, withoutShift) {
      var size = this._size,
          _array = this._array;
      start = SortedList._prepareStart(start, size);
      end = SortedList._prepareEnd(end, size);
      var removeSize = end - start;

      if (removeSize <= 0) {
        return false;
      }

      var _listChangedIfCanEmit = this._listChangedIfCanEmit;
      var oldItems;

      if (_listChangedIfCanEmit) {
        oldItems = _array.slice(start, end);
      } // if (!withoutShift) {
      // 	withoutShift = removeSize < _size - end
      // }


      if (withoutShift) {
        for (var i = start; i < end; i++) {
          _array[i] = _array[size - end + i];
        }

        if (removeSize < size - end && start < this._countSorted) {
          this._countSorted = start;
        }
      } else {
        for (var _i4 = end; _i4 < size; _i4++) {
          _array[_i4 - removeSize] = _array[_i4];
        }
      }

      var newSize = this._setSize(size - removeSize);

      if (end <= this._countSorted) {
        this._countSorted -= removeSize;
      } else if (start < this._countSorted) {
        this._countSorted = start;
      }

      if (_listChangedIfCanEmit) {
        _listChangedIfCanEmit.emit({
          type: ListChangedType.Removed,
          index: start,
          oldItems: oldItems,
          shiftIndex: end < size ? withoutShift ? size - removeSize : end : start
        });
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: size,
          newValue: newSize
        });
      }

      return true;
    }
  }, {
    key: "remove",
    value: function remove(item, withoutShift) {
      var index = this.indexOf(item, null, null, 1);

      if (index < 0) {
        return false;
      }

      this.removeAt(index, withoutShift);
      return true;
    }
  }, {
    key: "removeArray",
    value: function removeArray(sourceItems, sourceStart, sourceEnd) {
      var itemsSize = sourceItems.length;
      sourceStart = SortedList._prepareStart(sourceStart, itemsSize);
      sourceEnd = SortedList._prepareEnd(sourceEnd, itemsSize);
      var result = false;

      for (var i = sourceStart; i < sourceEnd; i++) {
        result = this.remove(sourceItems[i]) || result;
      }

      return result;
    }
  }, {
    key: "removeIterable",
    value: function removeIterable(items, itemsSize) {
      if (itemsSize <= 0) {
        return false;
      }

      if (Array.isArray(items)) {
        return this.removeArray(items, null, itemsSize);
      }

      var result = false;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var item = _step4.value;
          result = this.remove(item) || result;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return result;
    }
  }, {
    key: "_move",
    value: function _move(oldIndex, newIndex) {
      var _array = this._array;
      var moveItem = _array[oldIndex];
      var step = newIndex > oldIndex ? 1 : -1;

      for (var i = oldIndex; i !== newIndex; i += step) {
        _array[i] = _array[i + step];
      }

      _array[newIndex] = moveItem;
    }
  }, {
    key: "move",
    value: function move(oldIndex, newIndex) {
      if (oldIndex === newIndex) {
        return false;
      }

      var _size = this._size;
      oldIndex = SortedList._prepareIndex(oldIndex, _size);
      newIndex = SortedList._prepareIndex(newIndex, _size);

      this._move(oldIndex, newIndex);

      this._countSorted = Math.min(this._countSorted, oldIndex, newIndex);
      var _listChangedIfCanEmit = this._listChangedIfCanEmit;

      if (_listChangedIfCanEmit) {
        _listChangedIfCanEmit.emit({
          type: ListChangedType.Moved,
          index: oldIndex,
          moveSize: 1,
          moveIndex: newIndex
        });
      }

      return true;
    }
  }, {
    key: "moveRange",
    value: function moveRange(start, end, moveIndex) {
      if (start === moveIndex) {
        return false;
      }

      var _size = this._size,
          _array = this._array;
      start = SortedList._prepareStart(start, _size);
      end = SortedList._prepareStart(end, _size);
      moveIndex = SortedList._prepareIndex(moveIndex, _size);
      var maxIndex = _size - end + start;

      if (moveIndex > maxIndex) {
        moveIndex = maxIndex;
      }

      if (!move(_array, start, end, moveIndex)) {
        return false;
      }

      this._countSorted = Math.min(this._countSorted, start, moveIndex);
      var _listChangedIfCanEmit = this._listChangedIfCanEmit;

      if (_listChangedIfCanEmit) {
        _listChangedIfCanEmit.emit({
          type: ListChangedType.Moved,
          index: start,
          moveSize: end - start,
          moveIndex: moveIndex
        });
      }

      return true;
    }
  }, {
    key: "indexOf",
    value: function indexOf(item, start, end, bound) {
      var _size = this._size,
          _array = this._array,
          _compare = this._compare,
          _autoSort = this._autoSort;
      start = SortedList._prepareStart(start, _size);
      end = SortedList._prepareEnd(end, _size);

      if (this._autoSort) {
        this.sort();
      }

      var countSorted = this._countSorted;

      if (!countSorted || countSorted < start || !_autoSort && countSorted <= start + 2) {
        countSorted = start;
      } else if (countSorted > end) {
        countSorted = end;
      }

      var index;

      if (bound == null || bound <= 0) {
        if (countSorted > start) {
          index = binarySearch(_array, item, start, countSorted, _compare || SortedList.compareDefault, bound);

          if (index >= 0) {
            return index;
          }
        }

        if (_compare) {
          for (var i = countSorted; i < end; i++) {
            if (_compare(_array[i], item) === 0) {
              return i;
            }
          }
        } else if (item !== item) {
          // item is NaN
          for (var _i5 = countSorted; _i5 < end; _i5++) {
            var o = _array[_i5];

            if (o !== o) {
              // array item is NaN
              return _i5;
            }
          }
        } else {
          for (var _i6 = countSorted; _i6 < end; _i6++) {
            if (_array[_i6] === item) {
              return _i6;
            }
          }
        }
      } else {
        if (_compare) {
          for (var _i7 = end - 1; _i7 >= countSorted; _i7--) {
            if (_compare(_array[_i7], item) === 0) {
              return _i7;
            }
          }
        } else if (item !== item) {
          // item is NaN
          var last = -1;

          for (var _i8 = countSorted; _i8 < end; _i8++) {
            var _o = _array[_i8];

            if (_o !== _o) {
              // array item is NaN
              last = _i8;
            }
          }

          if (last >= 0) {
            return last;
          }
        } else {
          var _last = -1;

          for (var _i9 = countSorted; _i9 < end; _i9++) {
            if (_array[_i9] === item) {
              _last = _i9;
            }
          }

          if (_last >= 0) {
            return _last;
          }
        }

        if (countSorted > start) {
          index = binarySearch(_array, item, start, countSorted, _compare || SortedList.compareDefault, bound);
        }
      }

      return index == null || index < 0 && !_autoSort ? ~_size : index;
    }
  }, {
    key: "contains",
    value: function contains(item) {
      return this.indexOf(item) >= 0;
    }
  }, {
    key: "clear",
    value: function clear() {
      var size = this._size;

      if (size === 0) {
        return false;
      }

      var _array = this._array,
          _listChangedIfCanEmit = this._listChangedIfCanEmit;
      var oldItems;

      if (_listChangedIfCanEmit) {
        oldItems = _array.slice(0, size);
      }

      this._setSize(0);

      this._countSorted = 0;

      if (_listChangedIfCanEmit) {
        _listChangedIfCanEmit.emit({
          type: ListChangedType.Removed,
          index: 0,
          oldItems: oldItems,
          shiftIndex: 0
        });
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: size,
          newValue: 0
        });
      }

      return true;
    }
  }, {
    key: "reSort",
    value: function reSort() {
      var _countSorted = this._countSorted,
          _autoSort = this._autoSort;

      if (!_countSorted && _autoSort) {
        return false;
      }

      var _size = this._size;

      if (_size <= 1) {
        this._countSorted = _size;
        return false;
      }

      this._countSorted = 0;

      if (this._autoSort) {
        var _listChangedIfCanEmit = this._listChangedIfCanEmit;

        if (_listChangedIfCanEmit) {
          _listChangedIfCanEmit.emit({
            type: ListChangedType.Resorted
          });
        }
      } else {
        this.sort();
      }

      return true;
    }
  }, {
    key: "sort",
    value: function sort() {
      var _size = this._size,
          _array = this._array,
          _countSorted = this._countSorted;

      if (_countSorted >= _size) {
        return false;
      }

      if (_size <= 1) {
        this._countSorted = _size;
        return false;
      }

      _array.length = _size;

      _array.sort(this._compare || SortedList.compareDefault);

      this._countSorted = _size;

      if (!this._autoSort) {
        var _listChangedIfCanEmit = this._listChangedIfCanEmit;

        if (_listChangedIfCanEmit) {
          _listChangedIfCanEmit.emit({
            type: ListChangedType.Resorted
          });
        }
      }

      return true;
    }
  }, {
    key: "toArray",
    value: function toArray(start, end) {
      var _size = this._size,
          _array = this._array,
          _autoSort = this._autoSort;

      if (_autoSort) {
        this.sort();
      }

      start = SortedList._prepareStart(start, _size);
      end = SortedList._prepareEnd(end, _size);
      return _array.slice(start, end);
    }
  }, {
    key: "copyTo",
    value: function copyTo(destArray, destIndex, start, end) {
      var _size = this._size,
          _array = this._array;

      if (destIndex == null) {
        destIndex = 0;
      }

      start = SortedList._prepareStart(start, _size);
      end = SortedList._prepareEnd(end, _size);

      if (end <= start) {
        return false;
      }

      for (var i = start; i < end; i++) {
        destArray[destIndex - start + i] = _array[i];
      }

      return true;
    }
  }, {
    key: _Symbol$iterator,
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function value() {
      var _size, _array, i;

      return _regeneratorRuntime.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _size = this._size, _array = this._array;
              i = 0;

            case 2:
              if (!(i < _size)) {
                _context.next = 8;
                break;
              }

              _context.next = 5;
              return _array[i];

            case 5:
              i++;
              _context.next = 2;
              break;

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, value, this);
    }) // endregion
    // region Static

  }, {
    key: "_canMerge",
    // region IMergeable
    value: function _canMerge(source) {
      if (source.constructor === SortedList && this._array === source._array && this._autoSort === source._autoSort && this._notAddIfExists === source._notAddIfExists) {
        return null;
      }

      return this._autoSort && this._notAddIfExists && (source.constructor === Object || source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source));
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      var _this2 = this;

      return mergeMaps(function (target, source) {
        return createMergeSortedListWrapper(target, source, function (arrayOrIterable) {
          return fillCollection(new SortedList({
            autoSort: true,
            notAddIfExists: true,
            compare: _this2.compare
          }), arrayOrIterable, function (c, o) {
            return c.add(o);
          });
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        array: _serialize(this._array, {
          arrayLength: this._size
        }),
        options: _serialize({
          autoSort: this._autoSort,
          countSorted: this._countSorted,
          minAllocatedSize: this._minAllocatedSize,
          notAddIfExists: this._notAddIfExists
        })
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize(_deSerialize, serializedValue) {} // endregion

  }, {
    key: "minAllocatedSize",
    get: function get() {
      return this._minAllocatedSize;
    },
    set: function set(value) {
      var oldValue = this._minAllocatedSize;

      if (oldValue === value) {
        return;
      }

      this._minAllocatedSize = value;

      this._updateAllocatedSize();

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'minAllocatedSize',
          oldValue: oldValue,
          newValue: value
        });
      }
    } // endregion
    // region allocatedSize

  }, {
    key: "allocatedSize",
    get: function get() {
      return this._array.length;
    }
  }, {
    key: "size",
    get: function get() {
      return this._size;
    }
  }, {
    key: "compare",
    get: function get() {
      return this._compare;
    },
    set: function set(value) {
      this._compare = value;
    } // endregion
    // region countSorted

  }, {
    key: "countSorted",
    get: function get() {
      return this._countSorted;
    } // endregion
    // region autoSort

  }, {
    key: "autoSort",
    get: function get() {
      return this._autoSort;
    },
    set: function set(value) {
      value = !!value;
      var oldValue = this._autoSort;

      if (oldValue === value) {
        return;
      }

      if (!value && !oldValue) {
        this._autoSort = value;
        return;
      }

      if (value) {
        this._autoSort = value;

        if (this._countSorted !== this._size) {
          var _listChangedIfCanEmit = this._listChangedIfCanEmit;

          if (_listChangedIfCanEmit) {
            _listChangedIfCanEmit.emit({
              type: ListChangedType.Resorted
            });
          }
        }
      } else {
        this.sort();
        this._autoSort = value;
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'autoSort',
          oldValue: !!oldValue,
          newValue: value
        });
      }
    } // endregion
    // region notAddIfExists

  }, {
    key: "notAddIfExists",
    get: function get() {
      return this._notAddIfExists;
    },
    set: function set(value) {
      value = !!value;
      var oldValue = this._notAddIfExists;

      if (oldValue === value) {
        return;
      }

      if (!value && !oldValue) {
        this._notAddIfExists = value;
        return;
      }

      this._notAddIfExists = value;
      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'notAddIfExists',
          oldValue: !!oldValue,
          newValue: value
        });
      }
    } // endregion
    // endregion
    // region Methods

  }], [{
    key: "_prepareIndex",
    value: function _prepareIndex(index, size) {
      if (index < 0) {
        index += size;
      }

      if (index < 0 || index >= size) {
        throw new Error("index (".concat(index, ") is out of range [0..").concat(size - 1, "]"));
      }

      return index;
    }
  }, {
    key: "_prepareStart",
    value: function _prepareStart(start, size) {
      if (start == null) {
        start = 0;
      }

      if (start < 0) {
        start += size;
      }

      if (start < 0) {
        throw new Error("start (".concat(start, ") < 0"));
      }

      return start;
    }
  }, {
    key: "_prepareEnd",
    value: function _prepareEnd(end, size) {
      if (end == null) {
        end = size;
      }

      if (end < 0) {
        end += size + 1;
      }

      if (end > size) {
        throw new Error("end (".concat(end, ") > size (").concat(size, ")"));
      }

      return end;
    }
  }]);

  return SortedList;
}(ListChangedObject); // region Merge helpers

SortedList.compareDefault = compareFast;
SortedList.uuid = '1ec56e52-1aa5-4dd1-8471-a6185f22ed0a';
export var MergeSortedListWrapper =
/*#__PURE__*/
function () {
  function MergeSortedListWrapper(list) {
    _classCallCheck(this, MergeSortedListWrapper);

    if (!list.autoSort || !list.notAddIfExists) {
      throw new Error('Cannot create IMergeMapWrapper with ' + "SortedList(autoSort = ".concat(list.autoSort, " (must be true), ") + "notAddIfExists = ".concat(list.notAddIfExists, " (must be true))"));
    }

    this._list = list;
  }

  _createClass(MergeSortedListWrapper, [{
    key: "delete",
    value: function _delete(key) {
      this._list.remove(key);
    }
  }, {
    key: "forEachKeys",
    value: function forEachKeys(callbackfn) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this._list[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _key = _step5.value;
          callbackfn(_key);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      return key;
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._list.contains(key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this._list.add(value);
    }
  }]);

  return MergeSortedListWrapper;
}();
export function createMergeSortedListWrapper(target, source, arrayOrIterableToSortedList) {
  if (source.constructor === SortedList) {
    return new MergeSortedListWrapper(source);
  }

  if (arrayOrIterableToSortedList && (Array.isArray(source) || isIterable(source))) {
    return createMergeSortedListWrapper(target, arrayOrIterableToSortedList(source), null);
  }

  return createMergeSetWrapper(target, source);
} // endregion

registerMergeable(SortedList, {
  valueFactory: function valueFactory(source) {
    return new SortedList({
      autoSort: source.autoSort,
      notAddIfExists: source.notAddIfExists,
      compare: source.compare,
      minAllocatedSize: source.minAllocatedSize
    });
  }
});
registerSerializable(SortedList, {
  serializer: {
    deSerialize: function deSerialize(_deSerialize2, serializedValue, valueFactory) {
      return (
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          var options, value;
          return _regeneratorRuntime.wrap(function _callee$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return _deSerialize2(serializedValue.options);

                case 2:
                  options = _context2.sent;
                  _context2.next = 5;
                  return _deSerialize2(serializedValue.array);

                case 5:
                  options.array = _context2.sent;
                  value = valueFactory(options);
                  value.deSerialize(_deSerialize2, serializedValue);
                  return _context2.abrupt("return", value);

                case 9:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee);
        })()
      );
    }
  }
});