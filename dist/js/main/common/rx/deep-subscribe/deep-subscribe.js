"use strict";

function nextRule(rule) {}

function deepSubscribe(object, rule, bind, options) {
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