import {TClass, typeToDebugString} from '../../helpers/helpers'
import {ThenableSync, ThenableSyncIterator, ThenableSyncOrValue, TOnFulfilled} from '../../helpers/ThenableSync'
import {getObjectUniqueId} from '../../lists/helpers/object-unique-id'
import {TypeMetaCollectionWithId} from '../TypeMeta'
import {
	IDeSerializeOptions,
	IDeSerializerVisitor, IDeSerializeValue, IDeSerializeVisitorOptions,
	IObjectSerializer, ISerializable,
	ISerializedData,
	ISerializedDataOrValue, ISerializedObject, ISerializedRef,
	ISerializedTyped, ISerializedTypedValue,
	ISerializedValue, ISerializedValueArray, ISerializeOptions,
	ISerializerVisitor, ISerializeValue, ISerializeVisitorOptions,
	ITypeMetaSerializer, ITypeMetaSerializerCollection,
	ITypeMetaSerializerOverride,
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
		options: ISerializeVisitorOptions<TValue>,
	): void {
		const meta = this._typeMeta.getMeta(options && options.valueType || value.constructor as TClass<TValue>)
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
		out.data = serializer.serialize(this.getNextSerialize(options), value, options)
	}

	// noinspection JSUnusedLocalSymbols
	public getNextSerialize(
		options: ISerializeVisitorOptions<any>,
	): ISerializeValue {
		return <TNextValue = any>(
			next_value: TNextValue,
			next_options: ISerializeVisitorOptions<TNextValue>,
		) => this.serialize(
			next_value,
			next_options,
			// next_options == null || next_options === options
			// 	? options
			// 	: (options == null ? next_options : {
			// 		...options,
			// 		...next_options,
			// 	}),
		)
	}

	public serialize<TValue = any>(
		value: TValue,
		options?: ISerializeVisitorOptions<TValue>,
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

		return this.addObject(value as any, out => { this.serializeObject(out, value, options) })
	}
}

// tslint:disable-next-line:no-shadowed-variable no-empty
const LOCKED = function LOCKED() {}

export class DeSerializerVisitor implements IDeSerializerVisitor {
	private readonly _types: string[]
	private readonly _objects: ISerializedTyped[]
	private readonly _instances: any[]
	private _countDeserialized: number = 0
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

		const getDebugObject = (deserialized, id) => {
			const object = _objects[id]
			const uuid = _types[object.type]
			const type = _typeMeta.getType(uuid)
			return {
				type: type == null ? `<Type not found: ${uuid}>` : type.name,
				data: object.data,
				deserialized: deserialized == null
					? deserialized
					: deserialized.constructor.name,
			}
		}

		if (this._countDeserialized !== _instances.length) {
			throw new Error(`${_instances.length - this._countDeserialized} instances is not deserialized\r\n` +
				JSON.stringify(_instances
					.map((o, i) => [o, i])
					.filter(o => !o[0] || o[0] === LOCKED || ThenableSync.isThenableSync(o[0]))
					.map(o => getDebugObject(o[0], o[1]))))
		}
	}

	// noinspection JSUnusedLocalSymbols
	public getNextDeSerialize(
		options: IDeSerializeVisitorOptions<any>,
	): IDeSerializeValue {
		return <TNextValue = any>(
			next_serializedValue: ISerializedValue,
			next_onfulfilled?: TOnFulfilled<TNextValue>,
			next_options?: IDeSerializeVisitorOptions<TNextValue>,
		) => this.deSerialize(
			next_serializedValue,
			next_onfulfilled,
			next_options,
			// next_options == null || next_options === options
			// 	? options
			// 	: (options == null ? next_options : {
			// 		...options,
			// 		...next_options,
			// 	}),
		)
	}

	public deSerialize<TValue = any>(
		serializedValue: ISerializedValue,
		onfulfilled?: TOnFulfilled<TValue>,
		options?: IDeSerializeVisitorOptions<TValue>,
	): ThenableSyncOrValue<TValue> {
		if (onfulfilled) {
			const input_onfulfilled = onfulfilled
			onfulfilled = value => {
				const result = input_onfulfilled(value)
				onfulfilled = null
				return result
			}
		}

		if (serializedValue == null
			|| typeof serializedValue === 'number'
			|| typeof serializedValue === 'string'
			|| typeof serializedValue === 'boolean'
		) {
			if (onfulfilled) {
				return ThenableSync.resolve(onfulfilled(serializedValue as unknown as TValue))
			}
			return serializedValue as unknown as TValue
		}

		const id = (serializedValue as ISerializedRef).id
		if (id != null) {
			let cachedInstance = this._instances[id]

			if (cachedInstance) {
				if (cachedInstance === LOCKED) {
					this._instances[id] = cachedInstance = new ThenableSync<TValue>()
				}

				if (onfulfilled) {
					if (cachedInstance instanceof ThenableSync) {
						(cachedInstance as ThenableSync<TValue>)
							.thenLast(onfulfilled)
					} else {
						return ThenableSync.resolve(onfulfilled(cachedInstance))
					}
				}

				return cachedInstance
			}

			this._instances[id] = LOCKED

			serializedValue = this._objects[id]
		}

		let type = options && options.valueType
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
			throw new Error(`Class (${typeToDebugString(type)}) have no type meta`)
		}

		const serializer = meta.serializer
		if (!serializer) {
			throw new Error(`Class (${typeToDebugString(type)}) type meta have no serializer`)
		}

		if (!serializer.deSerialize) {
			throw new Error(`Class (${typeToDebugString(type)}) serializer have no deSerialize method`)
		}

		let factory = options && options.valueFactory || meta.valueFactory || ((...args) => new type(...args))
		if (id != null && !factory) {
			throw new Error(`valueFactory not found for ${typeToDebugString(type)}. `
				+ 'Any object serializers should have valueFactory')
		}

		let instance

		const iteratorOrValue = serializer.deSerialize(
			this.getNextDeSerialize(options),
			(serializedValue as ISerializedTyped).data,
			(...args) => {
				if (!factory) {
					throw new Error('Multiple call valueFactory is forbidden')
				}

				instance = factory(...args)
				factory = null

				return instance
			},
			options,
		)

		const resolveInstance = (value: TValue) => {
			const cachedInstance = this._instances[id]
			this._instances[id] = value
			if (cachedInstance instanceof ThenableSync) {
				cachedInstance.resolve(value)
			}
		}

		const resolveValue = (value: TValue): ThenableSyncOrValue<TValue> => {
			if (id != null) {
				if (!factory && instance !== value) {
					throw new Error(`valueFactory instance !== return value in serializer for ${typeToDebugString(type)}`)
				}

				resolveInstance(value)
				this._countDeserialized++
			}

			if (onfulfilled) {
				return ThenableSync.resolve(onfulfilled(value))
			}

			return value
		}

		const valueOrThenFunc = ThenableSync.resolve(iteratorOrValue, resolveValue)

		if (id != null
			&& !factory
			&& ThenableSync.isThenableSync(valueOrThenFunc)
		) {
			resolveInstance(instance)
			if (onfulfilled) {
				return ThenableSync.resolve(onfulfilled(instance))
			}
			return instance
		}

		return valueOrThenFunc
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
			// valueFactory: (...args) => new (type as new (...args: any[]) => TObject)(...args),
			...meta,
			serializer: {
				serialize(
					serialize: ISerializeValue,
					value: ISerializable,
					options?: ISerializeOptions,
				): ISerializedTypedValue {
					return value.serialize(serialize, options)
				},
				*deSerialize(
					deSerialize: IDeSerializeValue,
					serializedValue: ISerializedTypedValue,
					valueFactory: (...args) => TObject,
					options?: IDeSerializeOptions,
				) {
					const value = valueFactory()
					yield value.deSerialize(deSerialize, serializedValue, options)
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

export function registerSerializer<TValue = any>(
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

	public serialize<TValue>(
		value: TValue,
		options?: ISerializeVisitorOptions<TValue>,
	): ISerializedDataOrValue {
		const serializer = new SerializerVisitor(this.typeMeta)
		const serializedValue = serializer.serialize(value, options)

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

	public deSerialize<TValue = any>(
		serializedValue: ISerializedDataOrValue,
		options?: IDeSerializeVisitorOptions<TValue>,
	): TValue {
		if (!serializedValue || typeof serializedValue !== 'object') {
			return serializedValue as any
		}

		const {types, objects, data} = serializedValue as ISerializedData

		if (!Array.isArray(types)) {
			throw new Error(`serialized value types field is not array: ${types}`)
		}

		const deSerializer = new DeSerializerVisitor(this.typeMeta, types, objects)

		const value = deSerializer.deSerialize(data, null, options) as TValue

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

export function deSerializeArray<T>(
	deSerialize: IDeSerializeValue,
	serializedValue: ISerializedValueArray,
	value: T[],
): T[] {
	for (let i = 0, len = serializedValue.length; i < len; i++) {
		const index = i
		if (ThenableSync.isThenableSync(
			deSerialize(serializedValue[index], o => { value[index] = o }),
		)) {
			value[index] = null
		}
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

export function *deSerializeIterableOrdered(
	serializedValue: ISerializedValueArray,
	add: (item: any) => void|ThenableSync<any>,
): ThenableSyncIterator<any> {
	for (let i = 0, len = serializedValue.length; i < len; i++) {
		yield add(serializedValue[i])
	}
}

export function deSerializeIterable(
	serializedValue: ISerializedValueArray,
	add: (item: any) => void,
): void {
	for (let i = 0, len = serializedValue.length; i < len; i++) {
		add(serializedValue[i])
	}
}

// endregion

// region Object

export function serializeObject(
	serialize: ISerializeValue,
	value: object,
	options?: ISerializeOptions,
): ISerializedObject {
	const keepUndefined = options && options.objectKeepUndefined
	const serializedValue = {}
	for (const key in value) {
		if (Object.prototype.hasOwnProperty.call(value, key)) {
			const item = value[key]
			if (keepUndefined || typeof item !== 'undefined') {
				serializedValue[key] = serialize(item)
			}
		}
	}
	return serializedValue
}

export function deSerializeObject<T extends object>(
	deSerialize: IDeSerializeValue,
	serializedValue: ISerializedObject,
	value: T,
): T {
	for (const key in serializedValue) {
		if (Object.prototype.hasOwnProperty.call(serializedValue, key)) {
			// tslint:disable-next-line:no-collapsible-if
			if (ThenableSync.isThenableSync(
				deSerialize(serializedValue[key], o => { value[key] = o }),
			)) {
				value[key] = null
			}
		}
	}
	return value
}

registerSerializer<object>(Object, {
	uuid: '88968a59-178c-4e73-a99f-801e8cdfc37d',
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: object,
			options?: ISerializeOptions,
		): ISerializedObject {
			return serializeObject(serialize, value, options)
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (...args) => object,
			// options?: IDeSerializeOptions,
		): object {
			const value = valueFactory()
			return deSerializeObject(deSerialize, serializedValue, value)
		},
	},
	valueFactory: () => ({}),
})

// endregion

// region Primitive as object

export function serializePrimitiveAsObject<T extends object>(
	serialize: ISerializeValue,
	object: T,
	// options?: ISerializeOptions,
): ISerializedValue {
	const value = object.valueOf() as any
	if (value === object) {
		throw new Error(`value is not primitive as object: ${value && value.constructor.name}`)
	}
	return value

	// return {
	// 	value: serialize(value),
	// 	object: serializeObject(serialize, object, options) as any,
	// }
}

export function deSerializePrimitiveAsObject<T extends object>(
	deSerialize: IDeSerializeValue,
	serializedValue: ISerializedObject,
	valueFactory: (...args) => T,
	// options?: ISerializeOptions,
): T {
	const object = valueFactory(serializedValue)
	// deSerializeObject(deSerialize, serializedValue.object as any, object)
	return object
}

const primitiveAsObjectSerializer = {
	serialize: serializePrimitiveAsObject,
	deSerialize: deSerializePrimitiveAsObject,
}

// @ts-ignore
registerSerializer<string>(String, {
	uuid: '96104fd7-d6f8-4a32-b8f2-feaa4f3666d8',
	serializer: primitiveAsObjectSerializer,
})

// @ts-ignore
registerSerializer<number>(Number, {
	uuid: 'dea0de40-1801-4025-b6a4-b6f6c7a4fa11',
	serializer: primitiveAsObjectSerializer,
})

// @ts-ignore
registerSerializer<boolean>(Boolean, {
	uuid: 'e8d1ac82-a0fa-4431-a23e-3d8f954f736f',
	serializer: primitiveAsObjectSerializer,
})

// endregion

// region Array

registerSerializer<any[]>(Array, {
	uuid: 'f8c84ed0-8463-4f45-b14a-228967dfb0de',
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: any[],
			options?: ISerializeOptions,
		): ISerializedValueArray|ISerializedObject {
			if (options && options.arrayAsObject) {
				return serializeObject(serialize, value, options)
			}
			return serializeArray(serialize, value, options && options.arrayLength)
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedValueArray,
			valueFactory: (...args) => any[],
			options?: IDeSerializeOptions,
		): ThenableSyncIterator<any[]>|any[] {
			const value = valueFactory()
			if (options && options.arrayAsObject) {
				return deSerializeObject(deSerialize, serializedValue as any, value)
			}
			return deSerializeArray(deSerialize, serializedValue, value)
		},
	},
	valueFactory: () => [],
})

// endregion

// region Set

registerSerializer<Set<any>>(Set, {
	uuid: '17b11d99-ce03-4349-969e-4f9291d0778c',
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: Set<any>,
			// options?: ISerializeOptions,
		): ISerializedValueArray {
			return serializeIterable(serialize, value)
		},
		*deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedValueArray,
			valueFactory: (...args) => Set<any>,
			// options?: IDeSerializeOptions,
		): ThenableSyncIterator<Set<any>> {
			const value = valueFactory()
			yield deSerializeIterableOrdered(serializedValue, o => deSerialize(o, val => { value.add(val) }))
			return value
		},
	},
	// valueFactory: () => new Set(),
})

// endregion

// region Map

registerSerializer<Map<any, any>>(Map, {
	uuid: 'fdf40f21-59b7-4cb2-804f-3d18ebb19b57',
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: Map<any, any>,
			// options?: ISerializeOptions,
		): ISerializedValueArray {
			return serializeIterable(item => [
				serialize(item[0]),
				serialize(item[1]),
			], value)
		},
		*deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedValueArray,
			valueFactory: (...args) => Map<any, any>,
			// options?: IDeSerializeOptions,
		): ThenableSyncIterator<Map<any, any>> {
			const value = valueFactory()
			yield deSerializeIterableOrdered(
				serializedValue,
				item => deSerialize(
					item[0],
					key => deSerialize(item[1], val => {
						value.set(key, val)
					}),
				))
			return value
		},
	},
	// valueFactory: () => new Map(),
})

// endregion

// region Date

registerSerializer<Date>(Date, {
	uuid: '7a6c01db-a6b8-4822-a9a5-86e4d3a4460b',
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: Date,
			// options?: ISerializeOptions,
		): number {
			return value.getTime()
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: number,
			valueFactory: (...args) => Date,
			// options?: IDeSerializeOptions,
		): Date {
			return valueFactory(serializedValue)
		},
	},
	// valueFactory: (value: number|string|Date) => new Date(value),
})

// endregion

// endregion
