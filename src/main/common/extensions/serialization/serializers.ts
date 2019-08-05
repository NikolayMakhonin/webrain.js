import {getObjectUniqueId} from '../../lists/helpers/object-unique-id'
import {TClass, TypeMetaCollectionWithId} from '../TypeMeta'
import {
	IDeSerializerVisitor, IDeSerializeValue,
	IObjectSerializer, ISerializable,
	ISerializedData,
	ISerializedDataOrValue, ISerializedObject, ISerializedRef,
	ISerializedTyped, ISerializedTypedValue,
	ISerializedValue, ISerializedValueArray,
	ISerializerVisitor, ISerializeValue,
	ITypeMetaSerializer, ITypeMetaSerializerCollection,
	ITypeMetaSerializerOverride, TResolve, TThen, TThenAny,
} from './contracts'

// region SerializerVisitor

export class SerializerVisitor implements ISerializerVisitor {
	public types: string[]
	public typesMap: { [uuid: string]: number }
	public objects: ISerializedTyped[]
	public objectsMap: Array<ISerializedTyped|ISerializedRef>
	private _typeMeta: ITypeMetaSerializerCollection

	constructor(typeMeta: ITypeMetaSerializerCollection) {
		this._typeMeta = typeMeta
		this.serialize = this.serialize.bind(this)
	}

	private addType(uuid: string): number {
		// tslint:disable-next-line:prefer-const
		let {types, typesMap} = this
		if (!typesMap) {
			this.typesMap = typesMap = {}
			this.types = types = []
		}

		let typeIndex = typesMap[uuid]
		if (typeIndex == null) {
			typeIndex = types.length
			types[typeIndex] = uuid
			typesMap[uuid] = typeIndex
		}

		return typeIndex
	}

	private addObject(
		object: object,
		serialize: (out: ISerializedTyped) => void,
	): ISerializedTyped|ISerializedRef {
		// tslint:disable-next-line:prefer-const
		let {objects, objectsMap} = this
		if (!objectsMap) {
			this.objectsMap = objectsMap = []
			this.objects = objects = []
		}

		const id = getObjectUniqueId(object)
		let ref = objectsMap[id]
		if (ref == null) {
			const index = objects.length
			ref = {id: index}
			objectsMap[id] = ref
			const data = {} as any
			objects[index] = data
			serialize(data as ISerializedTyped)
		}

		return ref
	}

	private serializeObject<TValue>(
		out: ISerializedTyped,
		value: TValue,
		valueType?: TClass<TValue>,
	): void {
		const meta = this._typeMeta.getMeta(valueType || value.constructor as TClass<TValue>)
		if (!meta) {
			throw new Error(`Class (${value.constructor.name}) have no type meta`)
		}

		const uuid = meta.uuid
		if (!uuid) {
			throw new Error(`Class (${value.constructor.name}) type meta have no uuid`)
		}

		const serializer = meta.serializer
		if (!serializer) {
			throw new Error(`Class (${value.constructor.name}) type meta have no serializer`)
		}

		if (!serializer.serialize) {
			throw new Error(`Class (${value.constructor.name}) serializer have no serialize method`)
		}

		out.type = this.addType(uuid)
		out.data = serializer.serialize(this.serialize, value)
	}

	public serialize<TValue extends any>(
		value: TValue,
		valueType?: TClass<TValue>,
	): ISerializedValue {
		if (typeof value === 'undefined') {
			return value
		}

		if (value === null
			|| typeof value === 'number'
			|| typeof value === 'string'
			|| typeof value === 'boolean') {
			return value as any
		}

		return this.addObject(value as any, out => this.serializeObject(out, value, valueType))
	}
}

// tslint:disable-next-line:no-shadowed-variable no-empty
const LOCKED = function LOCKED() {}

export class DeSerializerVisitor implements IDeSerializerVisitor {
	private readonly _types: string[]
	private readonly _objects: ISerializedTyped[]
	private readonly _instances: any[]
	private readonly _resolveInstances: Array<Array<TResolve<any>>>
	private readonly _typeMeta: ITypeMetaSerializerCollection

	constructor(
		typeMeta: ITypeMetaSerializerCollection,
		types: string[],
		objects: ISerializedTyped[],
	) {
		this._typeMeta = typeMeta
		this._types = types
		this._objects = objects

		const len = objects.length
		const instances = new Array(len)
		for (let i = 0; i < len; i++) {
			instances[i] = null
		}
		this._instances = instances

		this.deSerialize = this.deSerialize.bind(this)
	}

	public assertEnd() {
		const {_types, _objects, _instances, _typeMeta} = this

		const getDebugObject = id => {
			const object = _objects[id]
			const uuid = _types[object.type]
			const type = _typeMeta.getType(uuid)
			return {
				type: type == null ? `<Type not found: ${uuid}>` : type.name,
				data: object.data,
			}
		}

		const resolveInstancesIds = Object.keys(this._resolveInstances)
		if (resolveInstancesIds.length > 0) {
			throw new Error('Object cannot be deserialized because some inner dependencies is not resolved:\r\n'
				+ JSON.stringify(resolveInstancesIds.map(id => getDebugObject(id)), null, 4))
		}

		for (let i = 0, len; i < len; i++) {
			const instance = _instances[i]
			if (instance === LOCKED || !instance) {
				throw new Error(`Instance was not deserialize:\r\n${JSON.stringify(getDebugObject(i))}`)
			}
		}
	}

	public deSerialize<TValue extends any>(
		serializedValue: ISerializedValue,
		set?: (value: TValue) => void,
		valueType?: TClass<TValue>,
		valueFactory?: (...args) => TValue,
	): TValue|TThenAny {
		if (typeof serializedValue === 'undefined') {
			return serializedValue
		}

		if (serializedValue === null
			|| typeof serializedValue === 'number'
			|| typeof serializedValue === 'string'
			|| typeof serializedValue === 'boolean') {
			return serializedValue as unknown as TValue
		}

		const id = (serializedValue as ISerializedRef).id
		if (id != null) {
			const cachedInstance = this._instances[id]

			if (cachedInstance === LOCKED) {
				return (resolve: (value: TValue) => void): void => {
					let resolveInstanceQueue = this._resolveInstances[id]
					if (!resolveInstanceQueue) {
						this._resolveInstances[id] = resolveInstanceQueue = []
					}
					resolveInstanceQueue.push(resolve)
				}
			}

			if (cachedInstance) {
				return cachedInstance
			}

			this._instances[id] = LOCKED

			serializedValue = this._objects[id]
		}

		let type = valueType
		if (!type) {
			const typeIndex = (serializedValue as ISerializedTyped).type
			if (typeof typeIndex !== 'number') {
				throw new Error(`Serialized value have no type field: ${JSON.stringify(serializedValue, null, 4)}`)
			}

			const uuid = this._types[typeIndex]
			if (typeof uuid !== 'string') {
				throw new Error(`type uuid not found for index (${typeIndex}): ${JSON.stringify(serializedValue, null, 4)}`)
			}

			type = this._typeMeta.getType(uuid)

			if (!type) {
				throw new Error(`type not found for uuid (${uuid}): ${JSON.stringify(serializedValue, null, 4)}`)
			}
		}

		const meta = this._typeMeta.getMeta(type)
		if (!meta) {
			throw new Error(`Class (${type}) have no type meta`)
		}

		const serializer = meta.serializer
		if (!serializer) {
			throw new Error(`Class (${type}) type meta have no serializer`)
		}

		if (!serializer.deSerialize) {
			throw new Error(`Class (${type}) serializer have no deSerialize method`)
		}

		let factory = valueFactory || meta.valueFactory
		if (id != null && !factory) {
			throw new Error(`valueFactory not found for ${type}. Any object serializers should have valueFactory`)
		}

		let instance

		const iteratorOrValue = serializer.deSerialize(
			this.deSerialize,
			(serializedValue as ISerializedTyped).data,
			(...args) => {
				if (!factory) {
					throw new Error('Multiple call valueFactory is forbidden')
				}

				instance = factory(...args)
				factory = null
				this._instances[id] = instance

				return instance
			},
		)

		let resolveValueQueue

		const resolveValue = (value: TValue) => {
			if (id != null) {
				if (!factory && instance !== value) {
					throw new Error(`valueFactory instance !== return value in serializer for ${type}`)
				}

				const resolveInstanceQueue = this._resolveInstances[id]
				delete this._resolveInstances[id]
				if (resolveInstanceQueue) {
					for (let i = 0, len = resolveInstanceQueue.length; i < len; i++) {
						resolveInstanceQueue[i](value)
					}
				}
			}

			if (resolveValueQueue) {
				for (let i = 0, len = resolveValueQueue.length; i < len; i++) {
					resolveValueQueue[i](value)
				}
			}

			if (set) {
				set(value)
			}

			return value
		}

		if (!(Symbol.iterator in iteratorOrValue)) {
			return resolveValue(iteratorOrValue as TValue)
		}

		const thenValueFunc = (resolve: (value: TValue) => void): void => {
			if (!resolveValueQueue) {
				resolveValueQueue = []
			}
			resolveValueQueue.push(resolve)
		}

		const resolveIterator = (
			iteration: IteratorResult<TValue|TThen<any>>,
		): TValue|TThenAny => {
			if (iteration.done) {
				return resolveValue(iteration.value as TValue)
			}

			(iteration.value as TThenAny)(o => {
				resolveIterator(iteratorOrValue.next(o))
			})

			return thenValueFunc
		}

		return resolveIterator(iteratorOrValue.next())
	}
}

// endregion

// region TypeMetaSerializerCollection

export type TSerializableClass<TObject extends ISerializable>
	= (new (...args: any[]) => TObject) & { readonly uuid: string }

export class TypeMetaSerializerCollection
	extends TypeMetaCollectionWithId<ITypeMetaSerializer<any>>
	implements ITypeMetaSerializerCollection {
	
	constructor(proto?: ITypeMetaSerializerCollection) {
		super(proto || TypeMetaSerializerCollection.default)
	}

	public static default: TypeMetaSerializerCollection = new TypeMetaSerializerCollection()

	private static makeTypeMetaSerializer<TObject extends ISerializable>(
		type: TSerializableClass<TObject>,
		meta?: ITypeMetaSerializerOverride<TObject>,
	): ITypeMetaSerializer<TObject> {
		return {
			uuid: type.uuid,
			valueFactory: () => new (type as new () => TObject)(),
			...meta,
			serializer: {
				serialize(
					serialize: ISerializeValue,
					value: ISerializable,
				): ISerializedTypedValue {
					return value.serialize(serialize)
				},
				deSerialize(
					deSerialize: IDeSerializeValue,
					serializedValue: ISerializedTypedValue,
					valueFactory2?: (...args) => TObject,
				): TObject {
					const value = valueFactory2()
					value.deSerialize(deSerialize, serializedValue)
					return value
				},
				...(meta ? meta.serializer : {}),
			},
		}
	}

	public putSerializableType<TObject extends ISerializable>(
		type: TSerializableClass<TObject>,
		meta?: ITypeMetaSerializerOverride<TObject>,
	): ITypeMetaSerializer<TObject> {
		return this.putType(type, TypeMetaSerializerCollection.makeTypeMetaSerializer(type, meta))
	}
}

export function registerSerializable<TObject extends ISerializable>(
	type: TSerializableClass<TObject>,
	meta?: ITypeMetaSerializerOverride<TObject>,
) {
	TypeMetaSerializerCollection.default.putSerializableType(type, meta)
}

export function registerSerializer<TValue extends any>(
	type: TClass<TValue>,
	meta: ITypeMetaSerializer<TValue>,
) {
	TypeMetaSerializerCollection.default.putType(type, meta)
}

// endregion

// region ObjectSerializer

export class ObjectSerializer implements IObjectSerializer {
	public typeMeta: ITypeMetaSerializerCollection

	constructor(typeMeta?: ITypeMetaSerializerCollection) {
		this.typeMeta = new TypeMetaSerializerCollection(typeMeta)
	}

	public static default: ObjectSerializer = new ObjectSerializer()

	public serialize<TValue>(value: TValue, valueType?: TClass<TValue>): ISerializedDataOrValue {
		const serializer = new SerializerVisitor(this.typeMeta)
		const serializedValue = serializer.serialize(value, valueType)

		if (!serializedValue || typeof serializedValue !== 'object') {
			return serializedValue
		}

		const serializedData: ISerializedData = {
			data: serializedValue,
		}

		if (serializer.types) {
			serializedData.types = serializer.types
		}

		if (serializer.objects) {
			serializedData.objects = serializer.objects
		}

		return serializedData
	}

	public deSerialize<TValue extends any>(
		serializedValue: ISerializedDataOrValue,
		valueType?: TClass<TValue>,
		valueFactory?: (...args) => TValue,
	): TValue {
		if (!serializedValue || typeof serializedValue !== 'object') {
			return serializedValue as any
		}

		const {types, objects, data} = serializedValue as ISerializedData

		if (!Array.isArray(types)) {
			throw new Error(`serialized value types field is not array: ${types}`)
		}

		const deSerializer = new DeSerializerVisitor(this.typeMeta, types, objects)

		const value = deSerializer.deSerialize(data, null, valueType, valueFactory) as TValue

		deSerializer.assertEnd()

		return value
	}
}

// endregion

// region Primitive Serializers

// Handled in SerializerVisitor:
// undefined
// null
// number
// string
// boolean

// region Helpers

export function serializeArray(
	serialize: ISerializeValue,
	value: any[],
	length?: number,
): ISerializedValueArray {
	if (length == null) {
		length = value.length
	}

	const serializedValue = []
	for (let i = 0; i < length; i++) {
		serializedValue[i] = serialize(value[i])
	}

	return serializedValue
}

export function *deSerializeArray<T>(
	deSerialize: IDeSerializeValue,
	serializedValue: ISerializedValueArray,
	value: T[],
): Iterator<T[]|TThen<any>> {
	for (let i = 0, len = serializedValue.length; i < len; i++) {
		value[i] = yield deSerialize(serializedValue[i])
	}
	return value
}

export function serializeIterable(
	serialize: ISerializeValue,
	value: Iterable<any>,
): ISerializedValueArray {
	const serializedValue = []
	for (const item of value) {
		serializedValue.push(serialize(item))
	}
	return serializedValue
}

export function *deSerializeIterable(
	serializedValue: ISerializedValueArray,
	add: (item: any) => void,
): void {
	for (let i = 0, len = serializedValue.length; i < len; i++) {
		add(serializedValue[i])
	}
}

// endregion

// region Object

registerSerializer<object>(Object, {
	uuid: '88968a59-178c-4e73-a99f-801e8cdfc37d',
	serializer: {
		serialize(serialize: ISerializeValue, value: object): ISerializedObject {
			const serializedValue = {}
			for (const key in value) {
				if (Object.prototype.hasOwnProperty.call(value, key)) {
					serializedValue[key] = serialize(value[key])
				}
			}
			return serializedValue
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedTypedValue,
			valueFactory: (...args) => object,
		): object {
			const value = valueFactory()
			for (const key in serializedValue as ISerializedObject) {
				if (Object.prototype.hasOwnProperty.call(serializedValue, key)) {
					value[key] = deSerialize(serializedValue[key])
				}
			}
			return value
		},
	},
	valueFactory: () => ({}),
})

// endregion

// region Array

registerSerializer<any[]>(Array, {
	uuid: 'f8c84ed0-8463-4f45-b14a-228967dfb0de',
	serializer: {
		serialize(serialize: ISerializeValue, value: any[]): ISerializedValueArray {
			return serializeArray(serialize, value)
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedValueArray,
			valueFactory: (...args) => any[],
		): Iterator<any[]|TThenAny> {
			return deSerializeArray(deSerialize, serializedValue, valueFactory())
		},
	},
	valueFactory: () => [],
})

// endregion

// region Set

registerSerializer<Set<any>>(Set, {
	uuid: '17b11d99-ce03-4349-969e-4f9291d0778c',
	serializer: {
		serialize(serialize: ISerializeValue, value: Set<any>): ISerializedValueArray {
			return serializeIterable(serialize, value)
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedValueArray,
			valueFactory: (...args) => Set<any>,
		): Set<any> {
			const value = valueFactory()
			deSerializeIterable(serializedValue, o => value.add(deSerialize(o)))
			return value
		},
	},
	valueFactory: () => new Set(),
})

// endregion

// region Map

registerSerializer<Map<any, any>>(Map, {
	uuid: 'fdf40f21-59b7-4cb2-804f-3d18ebb19b57',
	serializer: {
		serialize(serialize: ISerializeValue, value: Map<any, any>): ISerializedValueArray {
			return serializeIterable(item => [
				serialize(item[0]),
				serialize(item[1]),
			], value)
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedValueArray,
			valueFactory: (...args) => Map<any, any>,
		): Map<any, any> {
			const value = valueFactory()
			deSerializeIterable(
				serializedValue,
				item => value.set(
					deSerialize(item[0]),
					deSerialize(item[1]),
				))
			return value
		},
	},
	valueFactory: () => new Map(),
})

// endregion

// region Date

registerSerializer<Date>(Date, {
	uuid: '7a6c01db-a6b8-4822-a9a5-86e4d3a4460b',
	serializer: {
		serialize(serialize: ISerializeValue, value: Date): number {
			return value.getTime()
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: number,
			valueFactory: (...args) => Date,
		): Date {
			return valueFactory(serializedValue)
		},
	},
	valueFactory: (value: number|string|Date) => new Date(value),
})

// endregion

// endregion
