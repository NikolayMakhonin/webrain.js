function compareHandlers(o1, o2) {
  if (o1.time > o2.time) {
    return 1;
  }

  if (o1.time < o2.time) {
    return -1;
  }

  if (o1.id > o2.id) {
    return 1;
  }

  if (o1.id < o2.id) {
    return -1;
  }

  throw new Error('Duplicate timing handlers');
}

export class TestTiming {
  constructor() {
    this._handlers = [];
    this._now = 1;
    this._nextId = 0;
  }

  addTime(time) {
    this.setTime(this._now + time);
  }

  setTime(time) {
    if (time <= 0) {
      throw new Error(`time (${time} should be > 0)`);
    }

    const {
      _handlers,
      _now: now
    } = this;

    while (true) {
      let minHandler;

      for (const id in _handlers) {
        if (Object.prototype.hasOwnProperty.call(_handlers, id)) {
          const handler = _handlers[id];

          if (handler.time <= time && (!minHandler || compareHandlers(handler, minHandler) < 0)) {
            minHandler = handler;
          }
        }
      }

      if (!minHandler) {
        break;
      }

      delete _handlers[minHandler.id];
      this._now = minHandler.time;
      minHandler.handler();
    }

    this._now = time;
  }

  now() {
    return this._now;
  }

  setTimeout(handler, timeout) {
    const id = this._nextId++;
    this._handlers[id] = {
      id,
      time: this._now + timeout,
      handler
    };
    return id;
  }

  clearTimeout(handle) {
    delete this._handlers[handle];
  }

}