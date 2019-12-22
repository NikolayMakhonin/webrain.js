import {getObjectUniqueId} from '../../../helpers/object-unique-id'
import {IPropertiesPath, ValueKeyType} from '../contracts/common'
import {IRule} from '../contracts/rules'

export class PropertiesPath implements IPropertiesPath {
	public value: any
	public parent: IPropertiesPath
	public key: any
	public keyType: ValueKeyType
	public rule: IRule

	constructor(value: any, parent: IPropertiesPath, key: any, keyType: ValueKeyType, rule: IRule) {
		this.value = value
		this.parent = parent
		this.key = key
		this.keyType = keyType
		this.rule = rule
	}

	// region id

	private buildId(buffer: any[] = []): any[] {
		if (this.parent) {
			buffer.push(this.parent.id)
			buffer.push(getObjectUniqueId(this.parent.value))
			buffer.push(this.keyType)
			buffer.push(this.key)
		}
		return buffer
	}

	private _id: string
	public get id() {
		let {_id} = this
		if (!_id) {
			_id = this.buildId().join('_')
			this._id = _id
		}
		return _id
	}

	// endregion

	// region description

	private buildString(buffer: any[] = []): any[] {
		if (this.parent) {
			buffer.push(this.parent.toString())
			buffer.push('.')
		}

		buffer.push(this.key)
		if (this.rule) {
			buffer.push('(')
			buffer.push(this.rule.description)
			buffer.push(')')
		}

		return buffer
	}

	private _description: string

	public toString(): string {
		let {_description} = this
		if (!_description) {
			_description = this.buildString().join('_')
			this._description = _description
		}
		return _description
	}

	// endregion
}
