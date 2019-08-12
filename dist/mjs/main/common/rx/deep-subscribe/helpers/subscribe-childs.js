import { ListChangedType } from '../../../lists/contracts/IListChanged';
import { ANY, ANY_DISPLAY } from '../contracts/constants';

// region subscribeChildsObject
function subscribeChildsObject(_ref) {
  var object = _ref.object,
      propertyPredicate = _ref.propertyPredicate,
      subscribeItem = _ref.subscribeItem,
      unsubscribeItem = _ref.unsubscribeItem;
  var propertyChanged = object.propertyChanged;

  if (!propertyChanged) {
    return null;
  }

  var any = propertyPredicate(ANY, object);
  return propertyChanged.subscribe(function (event) {
    if (any || propertyPredicate(event.name, object)) {
      unsubscribeItem(event.oldValue, event.name);
      subscribeItem(event.newValue, event.name);
    }
  });
} // endregion
// region subscribeChildsList


function subscribeChildsList(_ref2) {
  var object = _ref2.object,
      propertyPredicate = _ref2.propertyPredicate,
      subscribeItem = _ref2.subscribeItem,
      unsubscribeItem = _ref2.unsubscribeItem;
  var listChanged = object.listChanged;

  if (!listChanged) {
    return null;
  }

  if (!propertyPredicate(ANY, object)) {
    return null;
  }

  return listChanged.subscribe(function (_ref3) {
    var type = _ref3.type,
        oldItems = _ref3.oldItems,
        newItems = _ref3.newItems;

    switch (type) {
      case ListChangedType.Added:
        for (var i = 0, len = newItems.length; i < len; i++) {
          subscribeItem(newItems[i], ANY_DISPLAY);
        }

        break;

      case ListChangedType.Removed:
        for (var _i = 0, _len = oldItems.length; _i < _len; _i++) {
          unsubscribeItem(oldItems[_i], ANY_DISPLAY);
        }

        break;

      case ListChangedType.Set:
        unsubscribeItem(oldItems[0], ANY_DISPLAY);
        subscribeItem(newItems[0], ANY_DISPLAY);
        break;
    }
  });
} // endregion
// region subscribeChildsSet


function subscribeChildsSet(_ref4) {
  var object = _ref4.object,
      propertyPredicate = _ref4.propertyPredicate,
      subscribeItem = _ref4.subscribeItem,
      unsubscribeItem = _ref4.unsubscribeItem;
  var setChanged = object.setChanged;

  if (!setChanged) {
    return null;
  }

  if (!propertyPredicate(ANY, object)) {
    return null;
  }

  return setChanged.subscribe(function (_ref5) {
    var oldItems = _ref5.oldItems,
        newItems = _ref5.newItems;

    for (var i = 0, len = oldItems.length; i < len; i++) {
      unsubscribeItem(oldItems[i], ANY_DISPLAY);
    }

    for (var _i2 = 0, _len2 = newItems.length; _i2 < _len2; _i2++) {
      subscribeItem(newItems[_i2], ANY_DISPLAY);
    }
  });
} // endregion
// region subscribeChildsMap


function subscribeChildsMap(_ref6) {
  var object = _ref6.object,
      propertyPredicate = _ref6.propertyPredicate,
      subscribeItem = _ref6.subscribeItem,
      unsubscribeItem = _ref6.unsubscribeItem;
  var mapChanged = object.mapChanged;

  if (!mapChanged) {
    return null;
  }

  if (!propertyPredicate(ANY, object)) {
    return null;
  }

  return mapChanged.subscribe(function (_ref7) {
    var key = _ref7.key,
        oldValue = _ref7.oldValue,
        newValue = _ref7.newValue;
    unsubscribeItem([key, oldValue], key);
    subscribeItem([key, newValue], key);
  });
} // endregion
// region subscribeChilds


var childSubscribers = [subscribeChildsObject, subscribeChildsList, subscribeChildsSet, subscribeChildsMap];
export function subscribeChilds(options) {
  var unsubscribers;

  for (var i = 0, len = childSubscribers.length; i < len; i++) {
    var unsubscribe = childSubscribers[i](options);

    if (unsubscribe) {
      if (!unsubscribers) {
        unsubscribers = [unsubscribe];
      } else {
        unsubscribers.push(unsubscribe);
      }
    }
  }

  if (!unsubscribers) {
    return null;
  }

  return function () {
    for (var _i3 = 0, _len3 = unsubscribers.length; _i3 < _len3; _i3++) {
      unsubscribers[_i3]();
    }
  };
} // endregion