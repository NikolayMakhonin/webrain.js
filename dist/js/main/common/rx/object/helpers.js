"use strict";

exports.__esModule = true;
exports.makeDependPropertySubscriber = makeDependPropertySubscriber;

var _webrainOptions = require("../../helpers/webrainOptions");

var _contracts = require("../depend/core/contracts");

function makeDependPropertySubscriber(name) {
  return function initDependCalcState(state) {
    var value;
    var dependUnsubscribe;

    state._this.propertyChanged.hasSubscribersObservable.subscribe(function (hasSubscribers) {
      if (dependUnsubscribe) {
        dependUnsubscribe();
        dependUnsubscribe = null;
      }

      if (hasSubscribers) {
        value = state.value;
        state.getValue(false, true);

        switch (state.statusShort) {
          case _contracts.CallStatusShort.CalculatedValue:
            value = state.value;
            break;

          case _contracts.CallStatusShort.CalculatedError:
            console.error(state.error);
            break;
        }

        dependUnsubscribe = state.subscribe(function () {
          switch (state.statusShort) {
            case _contracts.CallStatusShort.Invalidated:
              state.getValue(false, true);
              break;

            case _contracts.CallStatusShort.CalculatedValue:
              var oldValue = value;
              var newValue = state.value;
              value = newValue;

              if (!(0, _webrainOptions.webrainEquals)(oldValue, newValue)) {
                state._this.propertyChanged.emit({
                  name: name,
                  oldValue: oldValue,
                  newValue: newValue
                });
              }

              break;

            case _contracts.CallStatusShort.CalculatedError:
              console.error(state.error);
              break;
          }
        });
      }
    });
  };
}