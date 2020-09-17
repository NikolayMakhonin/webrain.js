import { webrainEquals } from '../../helpers/webrainOptions';
import { CallStatusShort } from '../depend/core/contracts';
export function makeDependPropertySubscriber(name) {
  return function initDependCalcState(state) {
    let value;
    let dependUnsubscribe;

    state._this.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribers => {
      if (dependUnsubscribe) {
        dependUnsubscribe();
        dependUnsubscribe = null;
      }

      if (hasSubscribers) {
        value = state.value;
        state.getValue(false, true);

        switch (state.statusShort) {
          case CallStatusShort.CalculatedValue:
            value = state.value;
            break;

          case CallStatusShort.CalculatedError:
            console.error(state.error);
            break;
        }

        dependUnsubscribe = state.subscribe(() => {
          switch (state.statusShort) {
            case CallStatusShort.Invalidated:
              state.getValue(false, true);
              break;

            case CallStatusShort.CalculatedValue:
              const oldValue = value;
              const newValue = state.value;
              value = newValue;

              if (!webrainEquals(oldValue, newValue)) {
                state._this.propertyChanged.emit({
                  name,
                  oldValue,
                  newValue
                });
              }

              break;

            case CallStatusShort.CalculatedError:
              console.error(state.error);
              break;
          }
        });
      }
    });
  };
}