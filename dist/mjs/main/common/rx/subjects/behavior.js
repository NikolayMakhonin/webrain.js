import { equals } from '../../helpers/helpers';
import { Subject } from './subject';
export function behavior(base) {
  return class Behavior extends base {
    constructor(value) {
      // eslint-disable-next-line constructor-super
      super();

      if (typeof value !== 'undefined') {
        this.value = value;
      }
    }

    subscribe(subscriber, description) {
      if (!subscriber) {
        return null;
      }

      if (description) {
        subscriber.description = description;
      }

      let unsubscribe = super.subscribe(subscriber);
      const {
        value
      } = this;

      if (typeof value !== 'undefined') {
        subscriber(value);
      }

      return () => {
        const _unsubscribe = unsubscribe;

        if (!_unsubscribe) {
          return;
        }

        unsubscribe = null;

        try {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const {
            value,
            unsubscribeValue
          } = this;

          if (typeof unsubscribeValue !== 'undefined' && !equals(unsubscribeValue, value)) {
            subscriber(unsubscribeValue);
          }
        } finally {
          _unsubscribe();
        }
      };
    }

    emit(value) {
      this.value = value;
      super.emit(value);
      return this;
    }

  };
}
export const BehaviorSubject = behavior(Subject);