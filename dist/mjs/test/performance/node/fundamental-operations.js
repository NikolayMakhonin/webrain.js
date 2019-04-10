/* eslint-disable no-new-func,no-array-constructor,object-property-newline */
import { calcPerformance } from 'rdtsc';
import { binarySearch } from '../../../main/common/lists/helpers/array';
export function compareDefault(o1, o2) {
  if (o1 > o2) {
    return 1;
  }

  if (o2 > o1) {
    return -1;
  }

  return 0;
}
describe('fundamental-operations', function () {
  function Path(value) {
    this.value = value;
  }

  Path.prototype.unshift = function (value) {
    var item = new Path(value);
    item.next = this;
    return item;
  };

  xit('array add item', function () {
    this.timeout(300000);
    var item = 'qweqweqweqweqwe';
    var str = item;
    var arr1 = [];
    var arr2 = new Array(10);
    var path = new Path(item);
    var result = calcPerformance(5000, function () {// no operations
    }, function () {
      str = 'qweqweqweqweqwe';
    }, function () {
      arr1 = new Array();
    }, function () {
      arr2 = new Array(10);
    }, function () {
      path = new Path(item);
    }, function () {
      str += item;
    }, function () {
      arr1[0] = item;
    }, function () {
      arr2[0] = item;
    }, function () {
      path = path.unshift(item);
    });
    console.log(str, result);
  });
  xit('pass arguments', function () {
    this.timeout(300000);

    function f1(args) {
      return args.length + 1;
    }

    function f2() {
      return arguments.length + 2;
    }

    function passF1() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      f1(args);
    }

    function passF2() {
      f2.apply(void 0, arguments);
    }

    var result = calcPerformance(5000, function () {// no operations
    }, function () {
      return passF1(1, 2, 3, 4, 5, 6, 7, 8, 9);
    }, function () {
      return passF2(1, 2, 3, 4, 5, 6, 7, 8, 9);
    });
    console.log(result);
  });
  xit('lambda vs function', function () {
    this.timeout(300000);

    function f1(args) {
      var calc = function calc() {
        if (Math.random() + 1) {
          return 1;
        }

        var inputItems;
        var output;
        var map;
        var expandAndDistinct;

        if (inputItems == null) {
          return output;
        }

        if (Array.isArray(inputItems)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = inputItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var item = _step.value;
              expandAndDistinct(item, output, map);
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

          return output;
        }

        if (!map[inputItems]) {
          map[inputItems] = true;
          output[output.length] = inputItems;
        }

        return output;
      };

      return calc();
    }

    function f2(args) {
      return calc();

      function calc() {
        if (Math.random() + 1) {
          return 1;
        }

        var inputItems;
        var output;
        var map;
        var expandAndDistinct;

        if (inputItems == null) {
          return output;
        }

        if (Array.isArray(inputItems)) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = inputItems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var item = _step2.value;
              expandAndDistinct(item, output, map);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          return output;
        }

        if (!map[inputItems]) {
          map[inputItems] = true;
          output[output.length] = inputItems;
        }

        return output;
      }
    }

    var result = calcPerformance(30000, function () {// no operations
    }, function () {
      return f1(1);
    }, function () {
      return f2(2);
    });
    console.log(result);
  });
  xit('lazy function parameters', function () {
    this.timeout(300000);

    function f(arg1, arg2) {
      if (!arg1 || Math.random() === 0.5) {
        return arg2.x;
      }

      if (typeof arg2 === 'function') {
        arg2 = arg2();
      }

      if (Math.random() === 0.5) {
        console.log(arg2.x);
      }

      return arg2.x;
    }

    var result = calcPerformance(60000, function () {// no operations
    }, function () {
      return f(false, {
        x: [1, 2, 3],
        y: 2,
        z: 3
      });
    }, function () {
      return f(false, function () {
        return {
          x: [1, 2, 3],
          y: 2,
          z: 3
        };
      });
    }, function () {
      return f(true, {
        x: [1, 2, 3],
        y: 2,
        z: 3
      });
    }, function () {
      return f(true, function () {
        return {
          x: [1, 2, 3],
          y: 2,
          z: 3
        };
      });
    });
    console.log(result);
  });

  function copyToArray(source, dest, len, index) {
    if (!len) {
      len = source.length;
    }

    if (!index) {
      index = 0;
    }

    for (var i = index; i < len; i++) {
      dest[index + i] = source[i];
    }
  }

  function generateArray(size) {
    var arr = [];

    for (var i = 0; i < size; i++) {
      arr.push(i);
    }

    return arr;
  }

  xit('array decrease length', function () {
    this.timeout(300000);
    var arr = generateArray(10000);
    var arr2;
    var result = calcPerformance(60000, function () {// no operations
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.splice(arr2.length - 1, 1); // 1368
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.length--; // 698
    }, function () {
      arr2 = arr.slice();
    }, function () {
      delete arr2[arr2.length - 1]; // 291
    });
    console.log(result);
  });
  xit('array decrease length 100', function () {
    this.timeout(300000);
    var arr = generateArray(10000);
    var arr2;
    var result = calcPerformance(60000, function () {// no operations
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.splice(arr2.length - 100, 100); // 3465
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.length -= 100; // 690
    });
    console.log(result);
  });
  xit('array increase length', function () {
    this.timeout(300000);
    var arr = generateArray(10000);
    var arr2;
    var result = calcPerformance(60000, function () {// no operations
    }, function () {
      arr2 = arr.slice();
    }, function () {
      // 80803
      var clone = new Array(arr2.length + 1);
      copyToArray(arr2, clone);
      arr2 = clone;
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2[arr2.length] = arr2.length; // 34189
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.push(arr2.length); // 34048
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.length++; // 137850
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.splice(arr2.length, 0, arr2.length); // 138119
    });
    console.log(result);
  });
  xit('array increase length 100', function () {
    this.timeout(300000);
    var arr = generateArray(10000);
    var arr2;
    var result = calcPerformance(60000, function () {// no operations
    }, function () {
      arr2 = arr.slice();
    }, function () {
      // 81010
      var clone = new Array(arr2.length + 100);
      copyToArray(arr2, clone);
      arr2 = clone;
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.length += 100; // 137800
    }, function () {
      arr2 = arr.slice();
    }, function () {
      // 35132
      for (var i = 0; i < 100; i++) {
        arr2.push(0);
      }
    }, function () {
      arr2 = arr.slice();
    }, function () {
      // 35581
      for (var i = arr2.length, end = i + 100; i < end; i++) {
        arr2[i] = 0;
      }
    });
    console.log(result);
  });
  xit('array default value', function () {
    this.timeout(300000);
    var arrNumbers = generateArray(10);
    var arrStrings = arrNumbers.map(function (o) {
      return o.toString();
    });
    var arrFunctions = arrNumbers.map(function (o) {
      return function () {
        return o.toString();
      };
    });
    var arrObjects = arrNumbers.map(function (o) {
      return {
        o: o
      };
    });
    var defaultNumber = 0;
    var defaultString = '';
    var defaultFunction = new Function();
    var defaultObject = {};
    var arr;
    var result = calcPerformance(180000, function () {// no operations
    }, function () {
      arr = arrNumbers.slice();
    }, function () {
      // 31
      arr[arr.length - 1] = undefined;
    }, function () {
      arr = arrNumbers.slice();
    }, function () {
      // 4
      arr[arr.length - 1] = null;
    }, function () {
      arr = arrNumbers.slice();
    }, function () {
      // -11
      arr[arr.length - 1] = defaultNumber;
    }, function () {
      arr = arrNumbers.slice();
    }, function () {
      // 35
      arr[arr.length - 1] = defaultString;
    }, function () {
      arr = arrStrings.slice();
    }, function () {
      // 8
      arr[arr.length - 1] = undefined;
    }, function () {
      arr = arrStrings.slice();
    }, function () {
      // -4
      arr[arr.length - 1] = null;
    }, function () {
      arr = arrStrings.slice();
    }, function () {
      // 27
      arr[arr.length - 1] = defaultString;
    }, function () {
      arr = arrStrings.slice();
    }, function () {
      // -7
      arr[arr.length - 1] = defaultNumber;
    }, function () {
      arr = arrFunctions.slice();
    }, function () {
      // 4
      arr[arr.length - 1] = undefined;
    }, function () {
      arr = arrFunctions.slice();
    }, function () {
      // -7
      arr[arr.length - 1] = null;
    }, function () {
      arr = arrFunctions.slice();
    }, function () {
      // 11
      arr[arr.length - 1] = defaultFunction;
    }, function () {
      arr = arrFunctions.slice();
    }, function () {
      // 27
      arr[arr.length - 1] = defaultNumber;
    }, function () {
      arr = arrObjects.slice();
    }, function () {
      // 8
      arr[arr.length - 1] = undefined;
    }, function () {
      arr = arrObjects.slice();
    }, function () {
      // 27
      arr[arr.length - 1] = null;
    }, function () {
      arr = arrObjects.slice();
    }, function () {
      // 11
      arr[arr.length - 1] = defaultObject;
    }, function () {
      arr = arrObjects.slice();
    }, function () {
      // 8
      arr[arr.length - 1] = defaultNumber;
    });
    console.log(result);
  });
  xit('array last index', function () {
    this.timeout(300000);

    function defaultCompare(o1, o2) {
      return o1 === o2;
    }

    function lastIndexOf1(array, value, compare) {
      if (!compare) {
        compare = defaultCompare;
      }

      var i = 0;
      var len = array.length;
      var ind = -1;

      while (i !== len) {
        if (compare(array[i], value)) {
          ind = i;
        }

        i++;
      }

      return ind;
    }

    function lastIndexOf2(array, value, compare) {
      if (!compare) {
        compare = defaultCompare;
      }

      var i = array.length;

      while (i !== 0) {
        if (compare(array[i], value)) {
          return i;
        }

        i--;
      }

      return -1;
    }

    var arr = generateArray(10000);
    var result = calcPerformance(10000, function () {// no operations
    }, function () {
      return lastIndexOf1(arr, 5000);
    }, function () {
      return lastIndexOf2(arr, 5000);
    });
    console.log(result);
  }); // xit('array capacity', function () {
  // 	this.timeout(300000)
  //
  // 	let arr
  //
  // 	const result = calcPerformance(
  // 		60000,
  // 		() => {
  // 			// no operations
  // 		},
  // 		() => { // 821
  // 			arr = [1, 2, 3, 4, 5]
  // 			arr.length = 10
  // 		},
  // 		() => {
  // 			arr.push(6) // 16
  // 		},
  // 		() => {
  // 			arr = arr.slice(5, 1) // 265
  // 		},
  // 		() => { // 737
  // 			arr = [1, 2, 3, 4, 5]
  // 			arr.length = 10
  // 		},
  // 		() => {
  // 			arr[5] = 6 // 20
  // 		},
  // 		() => {
  // 			delete arr[5] // 238
  // 		},
  // 		() => { // 74
  // 			arr = new Array(10)
  // 			copyToArray([1, 2, 3, 4, 5], arr)
  // 		},
  // 		() => {
  // 			arr.push(6) // 146
  // 		},
  // 		() => {
  // 			arr.splice(5, 1) // 771
  // 		},
  // 		() => { // 55
  // 			arr = new Array(10)
  // 			copyToArray([1, 2, 3, 4, 5], arr)
  // 		},
  // 		() => {
  // 			arr[5] = 6 // 1
  // 		},
  // 		() => {
  // 			delete arr[5] // 231
  // 		}
  // 	)
  //
  // 	console.log(result)
  // })

  function calcSortCompareCount(array, size, addArray) {
    // array.length = size
    var count = 0;

    for (var i = 0, len = addArray.length; i < len; i++) {
      array[size++] = addArray[i];
    }

    array.sort(function (o1, o2) {
      count++;
      return compareDefault(o1, o2);
    }); // console.log(`${JSON.stringify(array)}`)

    return count;
  }

  function calcBinarySearchCount(array, size, addArray) {
    var count = 0;

    for (var i = 0, addLen = addArray.length; i < addLen; i++) {
      var addItem = addArray[i]; // eslint-disable-next-line no-loop-func

      var insertIndex = binarySearch(array, addItem, null, size, function (o1, o2) {
        count++;
        return compareDefault(o1, o2);
      });

      if (insertIndex < 0) {
        insertIndex = ~insertIndex;
      } // insert


      for (var j = size - 1; j < size; j++) {
        array[j + 1] = array[j];
      }

      for (var _j = size - 1; _j > insertIndex; _j--) {
        array[_j] = array[_j - 1];
      }

      array[insertIndex] = addItem;
      size++;
    } // console.log(`${JSON.stringify(array)}`)


    return count;
  }

  function printSortCompareCount(array, addArray) {
    var sortCount = calcSortCompareCount(array, array.length, addArray);
    var binarySearchCount = calcBinarySearchCount(array, array.length, addArray);
    console.log("".concat(sortCount, "\t").concat(binarySearchCount, "\t").concat(JSON.stringify(array), "\t").concat(JSON.stringify(addArray)));
  }

  xit('sorted array add items', function () {
    this.timeout(300000);
    var array = [];
    var addArray = generateArray(1000).sort(function (o1, o2) {
      return Math.random() > 0.5 ? -1 : 1;
    }); // [-3, -1, -2, 1, 9, -4, 7, -6, 11]

    var resultArray; // console.log(JSON.stringify(addArray))
    // printSortCompareCount(array.slice(), addArray)

    var result = calcPerformance(10000, function () {// no operations
    }, function () {
      resultArray = array.slice().concat(addArray.map(function (o) {
        return 0;
      }));
    }, function () {
      return calcSortCompareCount(resultArray, array.length, addArray);
    }, function () {
      resultArray = array.slice().concat(addArray.map(function (o) {
        return 0;
      }));
    }, function () {
      return calcBinarySearchCount(resultArray, array.length, addArray);
    });
    console.log(result);
  });
  it('regexp', function () {
    this.timeout(300000);
    var regexp = /qwe\/wer\/ert\/rty\/tyu/;
    var path = 'qwe/wer/ert/rty/tyu';
    var wrongPath = 'wwe/wer/ert/rty/tyu';
    var checkPath = wrongPath.replace(/^w/, 'q');
    var result = calcPerformance(10000, // () => {
    // 	// no operations
    function () {
      return wrongPath === checkPath;
    }, function () {
      return path === checkPath;
    }, function () {
      return regexp.test(wrongPath);
    }, function () {
      return wrongPath.match(regexp);
    }, function () {
      return regexp.test(path);
    }, function () {
      return path.match(regexp);
    });
    console.log(result);
  });
});