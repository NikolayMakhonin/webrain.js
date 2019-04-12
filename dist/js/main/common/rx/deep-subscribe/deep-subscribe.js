"use strict";

var _ArraySet = require("../../lists/ArraySet");

var _iterateRule = require("./iterate-rule");

var _subscribeChilds = require("./helpers/subscribe-childs");

function deepSubscribe(object, rule, bind, options) {
  return _deepSubscribe(object, (0, _iterateRule.iterateRule)(rule)[Symbol.iterator](), bind, options);
}

function* _deepSubscribe(object, ruleIterator, bind, options, propertiesPath) {
  const iteration = ruleIterator.next();

  if (iteration.done) {
    return null;
  }

  const ruleOrIterable = iteration.value;

  if (ruleOrIterable[Symbol.iterator]) {
    const unsubscribers = [];

    for (const ruleIterable of ruleOrIterable) {
      unsubscribers.push(_deepSubscribe(object, ruleIterable[Symbol.iterator](), bind, options));
    }

    return () => {
      for (let i = 0, len = unsubscribers.length; i < len; i++) {
        unsubscribers[i]();
      }
    };
  } else {
    const rule = ruleOrIterable;
    const unsubscribers = new _ArraySet.ArraySet();

    function subscribeItem(item, debugPropertyName) {
      let unsubscribe = item.unsubscribe; // TODO

      if (!unsubscribe) {
        unsubscribe = _deepSubscribe(object, ruleIterator, bind, options, (propertiesPath ? propertiesPath + '.' : '') + debugPropertyName + '(' + rule.description + ')');
        item.unsubscribe = unsubscribe; // TODO
      }
    }

    function unsubscribeItem(item, debugPropertyName) {
      const unsubscribe = item.unsubscribe; // TODO

      if (unsubscribe) {
        unsubscribe();
        delete item.unsubscribe; // TODO
      }
    }

    {
      const unsubscribe = (0, _subscribeChilds.subscribeChilds)({
        object,
        propertyPredicate: rule.predicate,
        subscribeItem,
        unsubscribeItem
      });

      if (unsubscribe) {
        unsubscribers.add(unsubscribe);
      }
    }

    for (const item of rule.iterateObject(object)) {
      subscribeItem(item);
    }

    return () => {
      for (const item of rule.iterateObject(object)) {
        unsubscribeItem(item);
      }
    };
  }
}

function deepSubscribeOld(object, rule, bind, options) {
  const ruleNext = nextRule(rule);

  if (object.propertyChanged) {
    object.propertyChanged.subscribe(event => {
      const unsubscribe = deepSubscribe(event.newValue, ruleNext, value => {}, options);
    });
  } else if (object.setChanged) {
    object.setChanged.subscribe(event => {
      for (const newItem of event.newItems) {
        const unsubscribe = deepSubscribe(newItem, ruleNext, value => {}, options);
      }
    });
  } else if (object.mapChanged) {} else if (object.listChanged) {}
}