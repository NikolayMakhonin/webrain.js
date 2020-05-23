export class ObjectPool {
  constructor(maxSize) {
    this.size = 0;
    this._stack = [null];
    this.maxSize = maxSize;
  }

  get() {
    // this.usedSize++
    const lastIndex = this.size - 1;

    if (lastIndex >= 0) {
      const obj = this._stack[lastIndex];
      this._stack[lastIndex] = null;
      this.size = lastIndex;

      if (obj === null) {
        throw new Error('obj === null');
      }

      return obj;
    }

    return null;
  }

  release(obj) {
    // this.usedSize--
    if (this.size < this.maxSize) {
      this._stack[this.size] = obj;
      this.size++;
    }
  }

}