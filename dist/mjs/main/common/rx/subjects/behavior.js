import { Subject } from './subject';
export function behavior(base) {
  return class Behavior extends base {
    constructor(value) {
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
          // eslint-disable-next-line no-shadow
          // tslint:disable-next-line:no-shadowed-variable
          const {
            value,
            unsubscribeValue
          } = this;

          if (typeof unsubscribeValue !== 'undefined' && unsubscribeValue !== value) {
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