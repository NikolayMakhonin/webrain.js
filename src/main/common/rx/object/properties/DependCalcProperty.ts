import {ObservableClass} from '../ObservableClass'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'

export class DependCalcProperty<TInput> extends ObservableClass {
	public readonly input: TInput

	constructor(input?: TInput) {
		super()
		this.input = input
	}
}

new ObservableObjectBuilder(DependCalcProperty.prototype)
	.writable('input')
