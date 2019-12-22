import { typeToDebugString } from '../helpers/helpers';
// noinspection SpellCheckingInspection
const typeMetaPropertyNameBase = '043a558080e94cbda1add09753c28772';
let typeMetaPropertyNameIndex = 0;
export class TypeMetaCollection {
  // noinspection JSUnusedLocalSymbols
  constructor(proto) {
    this._typeMetaPropertyName = typeMetaPropertyNameBase + typeMetaPropertyNameIndex++;

    if (proto) {
      this._proto = proto;
    }
  }

  getMeta(type) {
    let meta;
    const {
      _typeMetaPropertyName
    } = this;

    if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
      meta = type[_typeMetaPropertyName];
    }

    if (typeof meta === 'undefined') {
      const {
        _proto
      } = this;

      if (_proto) {
        return _proto.getMeta(type);
      }
    }

    return meta;
  }

  putType(type, meta) {
    if (!type || typeof type !== 'function') {
      throw new Error(`type (${type}) should be function`);
    }

    const {
      _typeMetaPropertyName
    } = this;
    let prevMeta;

    if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
      prevMeta = type[_typeMetaPropertyName];
      delete type[_typeMetaPropertyName];
    }

    Object.defineProperty(type, _typeMetaPropertyName, {
      configurable: true,
      enumerable: false,
      writable: false,
      value: meta
    });
    return prevMeta;
  }

  deleteType(type) {
    const {
      _typeMetaPropertyName
    } = this;
    let prevMeta;

    if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
      prevMeta = type[_typeMetaPropertyName];
      delete type[_typeMetaPropertyName];
    }

    return prevMeta;
  }

}
export class TypeMetaCollectionWithId extends TypeMetaCollection {
  constructor(proto) {
    super(proto);
    this._typeMap = {};
  }

  getType(uuid) {
    const type = this._typeMap[uuid];

    if (typeof type === 'undefined') {
      const {
        _proto
      } = this;

      if (_proto) {
        return _proto.getType(uuid);
      }
    }

    return type;
  }

  putType(type, meta) {
    const uuid = meta && meta.uuid;

    if (!uuid || typeof uuid !== 'string') {
      throw new Error(`meta.uuid (${uuid}) should be a string with length > 0`);
    }

    const prevType = this._typeMap[uuid];

    if (prevType && prevType !== type) {
      throw new Error(`Same uuid (${uuid}) used for different types: ` + `${typeToDebugString(prevType)}, ${typeToDebugString(type)}`);
    }

    const prevMeta = super.putType(type, meta);
    this._typeMap[uuid] = type;
    return prevMeta;
  }

  deleteType(typeOrUuid) {
    let uuid;
    let type;

    if (typeof typeOrUuid === 'function') {
      const meta = this.getMeta(typeOrUuid);
      uuid = meta && meta.uuid;
      type = typeOrUuid;
    } else if (typeof typeOrUuid === 'string') {
      type = this.getType(typeOrUuid);
      uuid = typeOrUuid;
    } else {
      throw new Error(`typeOrUuid (${typeOrUuid == null ? typeOrUuid : typeof typeOrUuid}) is not a Function or String`);
    }

    const prevMeta = super.deleteType(type);
    delete this._typeMap[uuid];
    return prevMeta;
  }

}