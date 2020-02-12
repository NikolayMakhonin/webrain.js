"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getTupleIdMap = getTupleIdMap;
exports.getTupleId = getTupleId;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _objectUniqueId = require("./object-unique-id");

//
// let nextObjectId: number = 1
//
// const UNIQUE_ID_PROPERTY_NAME = '458d576952bc489ab45e98ac7f296fd9'
//
// export function hasObjectUniqueId(object: object): boolean {
// 	return object != null && Object.prototype.hasOwnProperty.call(object, UNIQUE_ID_PROPERTY_NAME)
// }
//
// export function canHaveUniqueId(object: object): boolean {
// 	return !Object.isFrozen(object) || hasObjectUniqueId(object)
// }
//
// const ID_PROPERTY_NAME = 'fc93a7cf9a0e4a95b028f7b4681dc27d'
//
// export function getTupleUniqueId(this: Map<any, number>, ...args: any[]): number {
// 	if (arguments.length === 0) {
// 		// const id = this[ID_PROPERTY_NAME]
// 		// if (id != null) {
// 		// 	return id
// 		// }
// 		// const uniqueId = getNextObjectId()
// 		// this[ID_PROPERTY_NAME] = id
// 	}
//
//
// }
//
// // tslint:disable-next-line:ban-types
// export function freezeWithUniqueId<T extends object>(object: T): T {
// 	getObjectUniqueId(object)
// 	return Object.freeze(object)
// }
//
// // tslint:disable-next-line:ban-types
// export function isFrozenWithoutUniqueId(object: object): boolean {
// 	return !object || Object.isFrozen(object) && !hasObjectUniqueId(object)
// }
// const maps: ITupleIdMap[] = []
// export function getTupleIdMap(countItems: number): ITupleIdMap {
// 	for (let i = maps.length; i < countItems; i++) {
// 		maps[i] = null
// 	}
//
// 	let map = maps[countItems - 1]
// 	if (map == null) {
// 		map = new Map() as ITupleIdMap
// 		map.getTupleIdNextMap = getTupleIdNextMap
// 		map.getTupleId = getTupleId
// 		maps[countItems - 1] = map
// 	}
//
// 	return map
// }
var mapRoot = new _map.default();
mapRoot.getTupleIdMap = getTupleIdMap;
mapRoot.getTupleId = getTupleId;

function getTupleIdMap() {
  var map = this || mapRoot;

  for (var i = 0, len = arguments.length; i < len; i++) {
    var _item = arguments[i];
    var nextMap = map.get(_item);

    if (!nextMap) {
      nextMap = new _map.default();
      nextMap.getTupleIdMap = getTupleIdMap;
      nextMap.getTupleId = getTupleId;
      map.set(_item, nextMap);
    }

    map = nextMap;
  }

  return map;
}

function getTupleId() {
  var map = this || mapRoot;
  var item;

  for (var i = 0, len = arguments.length - 1; i < len; i++) {
    item = arguments[i];
    var nextMap = map.get(item);

    if (!nextMap) {
      nextMap = new _map.default();
      nextMap.getTupleIdMap = getTupleIdMap;
      nextMap.getTupleId = getTupleId;
      map.set(item, nextMap);
    }

    map = nextMap;
  }

  var id;
  {
    item = arguments[arguments.length - 1];
    id = this.get(item);

    if (id == null) {
      id = (0, _objectUniqueId.getNextObjectId)();
      this.set(item, id);
    }
  }
  return id;
}