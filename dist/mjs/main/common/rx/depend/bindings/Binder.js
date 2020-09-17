export class Binder {
  constructor(bind) {
    this._bindsCount = 0;
    this._bind = bind;
  }

  _unbind() {
    this._bindsCount--;

    if (this._bindsCount > 0) {
      return;
    }

    if (this._bindsCount < 0) {
      throw new Error('Unexpected behavior: this._bindsCount < 0');
    }

    this.__unbind();

    this.__unbind = null;
  }

  bind() {
    if (this.__unbind == null) {
      if (this._bindsCount !== 0) {
        throw new Error('Unexpected behavior: this._bindsCount !== 0');
      }

      this.__unbind = this._bind();
    } else if (this._bindsCount <= 0) {
      throw new Error('Unexpected behavior: this._bindsCount <= 0');
    }

    this._bindsCount++;
    let wasUnbind = false;
    return () => {
      if (wasUnbind) {
        return;
      }

      wasUnbind = true;

      this._unbind();
    };
  }

}