/* tslint:disable:no-empty */
import {calcPerformance} from 'rdtsc'
import {ThenableOrIteratorOrValue} from '../../../main/common/async/async'
import {ThenableSync} from '../../../main/common/async/ThenableSync'
import {VALUE_PROPERTY_DEFAULT} from '../../../main/common/helpers/value-property'
import {ObservableClass} from '../../../main/common/rx/object/ObservableClass'
import {CalcObjectBuilder} from '../../../main/common/rx/object/properties/CalcObjectBuilder'
import {calcPropertyFactory} from '../../../main/common/rx/object/properties/CalcPropertyBuilder'
import {ICalcProperty} from '../../../main/common/rx/object/properties/contracts'
import {resolvePath} from '../../../main/common/rx/object/properties/helpers'
import {Property} from '../../../main/common/rx/object/properties/Property'
import {assert} from '../../../main/common/test/Assert'
import {describe, it} from '../../../main/common/test/Mocha'

describe('resolvePath', function() {
	this.timeout(300000)

	class Class extends ObservableClass {
		public simple: { value?: Class } = { value: this }
		public observable: Class
		public calc: ICalcProperty<Class>
	}

	const simple: { value?: Class } = {}

	new CalcObjectBuilder(Class.prototype)
		.writable('observable')
		.calc('calc',
			simple,
			calcPropertyFactory({
				dependencies: null,
				calcFunc(state): ThenableOrIteratorOrValue<void> {
					state.value = state.input.value
					return ThenableSync.createResolved(null)
				},
			}),
		)

	const object = new Class()
	object.simple = simple
	simple.value = object

	it('simple', function() {
		const test = resolvePath(object)()

		const result = calcPerformance(
			20000,
			() => { },
			() => resolvePath(true)(),
			() => resolvePath(object)(),
			() => resolvePath(object)(o => o.simple)(),
			() => resolvePath(object)(o => o.observable)(),
			() => resolvePath(object)(o => o.wait, true)(),
			() => resolvePath(object)(o => o.calc)(),
			() => resolvePath(object)(o => o.calc)(o => o.wait, true)(),
		)

		console.log(result)
	})
})
