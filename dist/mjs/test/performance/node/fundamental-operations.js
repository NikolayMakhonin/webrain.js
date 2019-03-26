/* eslint-disable no-new-func,no-array-constructor */
import { calcPerformance } from 'rdtsc';
describe('fundamental-operations', function () {
  function Path(value) {
    this.value = value;
  }

  Path.prototype.unshift = function (value) {
    var item = new Path(value);
    item.next = this;
    return item;
  };

  it('array add item', function () {
    this.timeout(300000);
    var item = 'qweqweqweqweqwe';
    var str = item;
    var arr1 = [];
    var arr2 = new Array(10);
    var path = new Path(item);
    var result = calcPerformance(30000, function () {// no operations
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
});