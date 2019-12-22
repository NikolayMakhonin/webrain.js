import { getObjectUniqueId } from '../../../helpers/object-unique-id';
export class PropertiesPath {
  constructor(value, parent, key, keyType, rule) {
    this.value = value;
    this.parent = parent;
    this.key = key;
    this.keyType = keyType;
    this.rule = rule;
  } // region id


  buildId(buffer = []) {
    if (this.parent) {
      buffer.push(this.parent.id);
      buffer.push(getObjectUniqueId(this.parent.value));
      buffer.push(this.keyType);
      buffer.push(this.key);
    }

    return buffer;
  }

  get id() {
    let {
      _id
    } = this;

    if (!_id) {
      _id = this.buildId().join('_');
      this._id = _id;
    }

    return _id;
  } // endregion
  // region description


  buildString(buffer = []) {
    if (this.parent) {
      buffer.push(this.parent.toString());
      buffer.push('.');
    }

    buffer.push(this.key);

    if (this.rule) {
      buffer.push('(');
      buffer.push(this.rule.description);
      buffer.push(')');
    }

    return buffer;
  }

  toString() {
    let {
      _description
    } = this;

    if (!_description) {
      _description = this.buildString().join('_');
      this._description = _description;
    }

    return _description;
  } // endregion


}