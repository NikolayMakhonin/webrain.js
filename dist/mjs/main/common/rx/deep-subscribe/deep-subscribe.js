function nextRule(rule) {}

function deepSubscribe(object, rule, bind, options) {
  var ruleNext = nextRule(rule);

  if (object.propertyChanged) {
    object.propertyChanged.subscribe(function (event) {
      var unsubscribe = deepSubscribe(event.newValue, ruleNext, function (value) {}, options);
    });
  } else if (object.setChanged) {
    object.setChanged.subscribe(function (event) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = event.newItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var newItem = _step.value;
          var unsubscribe = deepSubscribe(newItem, ruleNext, function (value) {}, options);
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
    });
  } else if (object.mapChanged) {} else if (object.listChanged) {}
}