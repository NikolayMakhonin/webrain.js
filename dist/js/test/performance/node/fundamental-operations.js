"use strict";

var _rdtsc = require("rdtsc");

/* eslint-disable no-new-func,no-array-constructor */
describe('fundamental-operations', function () {
  function Path(value) {
    this.value = value;
  }

  Path.prototype.unshift = function (value) {
    const item = new Path(value);
    item.next = this;
    return item;
  };

  xit('array add item', function () {
    this.timeout(300000);
    const item = 'qweqweqweqweqwe';
    let str = item;
    let arr1 = [];
    let arr2 = new Array(10);
    let path = new Path(item);
    const result = (0, _rdtsc.calcPerformance)(5000, () => {// no operations
    }, () => {
      str = 'qweqweqweqweqwe';
    }, () => {
      arr1 = new Array();
    }, () => {
      arr2 = new Array(10);
    }, () => {
      path = new Path(item);
    }, () => {
      str += item;
    }, () => {
      arr1[0] = item;
    }, () => {
      arr2[0] = item;
    }, () => {
      path = path.unshift(item);
    });
    console.log(str, result);
  });
  xit('pass arguments', function () {
    this.timeout(300000);

    function f1(args) {
      return args.length + 1;
    }

    function f2(...args) {
      return args.length + 2;
    }

    function passF1(...args) {
      f1(args);
    }

    function passF2(...args) {
      f2(...args);
    }

    const result = (0, _rdtsc.calcPerformance)(5000, () => {// no operations
    }, () => passF1(1, 2, 3, 4, 5, 6, 7, 8, 9), () => passF2(1, 2, 3, 4, 5, 6, 7, 8, 9));
    console.log(result);
  });
  it('lambda vs function', function () {
    this.timeout(300000);

    function f1(args) {
      const calc = () => {
        if (Math.random() + 1) {
          return 1;
        }

        let inputItems;
        let output;
        let map;
        let expandAndDistinct;

        if (inputItems == null) {
          return output;
        }

        if (Array.isArray(inputItems)) {
          for (const item of inputItems) {
            expandAndDistinct(item, output, map);
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

        let inputItems;
        let output;
        let map;
        let expandAndDistinct;

        if (inputItems == null) {
          return output;
        }

        if (Array.isArray(inputItems)) {
          for (const item of inputItems) {
            expandAndDistinct(item, output, map);
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

    const result = (0, _rdtsc.calcPerformance)(30000, () => {// no operations
    }, () => f1(1), () => f2(2));
    console.log(result);
  });
});