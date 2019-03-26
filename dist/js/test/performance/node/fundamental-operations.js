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

  it('array add item', function () {
    this.timeout(300000);
    const item = 'qweqweqweqweqwe';
    let str = item;
    let arr1 = [];
    let arr2 = new Array(10);
    let path = new Path(item);
    const result = (0, _rdtsc.calcPerformance)(30000, () => {// no operations
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
});