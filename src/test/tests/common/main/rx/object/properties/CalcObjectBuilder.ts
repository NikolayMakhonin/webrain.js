/* tslint:disable:no-duplicate-string */
/* eslint-disable guard-for-in */
import {ThenableOrIteratorOrValue} from '../../../../../../../main/common/async/async'
import {ThenableSync} from '../../../../../../../main/common/async/ThenableSync'
import {ObservableObject} from '../../../../../../../main/common/rx/object/ObservableObject'
import {CalcObjectBuilder} from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder'
import {ICalcProperty} from '../../../../../../../main/common/rx/object/properties/CalcProperty'
import {calcPropertyFactory} from '../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder'
import {connectorFactory} from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder'
import {Property} from '../../../../../../../main/common/rx/object/properties/property'

declare const assert: any

describe('common > main > rx > properties > CalcObjectBuilder', function() {
	class ClassSync extends ObservableObject {
		public prop1: ICalcProperty<Date>
		public source: {
			value: string,
		}
	}

	class ClassAsync extends ClassSync {
	
	}

	new CalcObjectBuilder(ClassSync.prototype)
		.calc('prop1',
			connectorFactory(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source['@wait']))),
			calcPropertyFactory((input, valueProperty: Property<Date, number>): ThenableOrIteratorOrValue<void> => {
				valueProperty.value = new Date(123)
				return ThenableSync.createResolved(null)
			}),
		)

	new CalcObjectBuilder(ClassAsync.prototype)
		.calc('prop1',
			connectorFactory(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source['@wait']))),
			calcPropertyFactory(function *(input, valueProperty: Property<Date, number>): ThenableOrIteratorOrValue<void> {
				yield new Promise(r => setTimeout(r, 100))
				valueProperty.value = new Date(123)
			}),
		)

	it('calc sync', function() {
		let result: any = new ClassSync().prop1.last
		assert.deepStrictEqual(result, new Date(123))

		result = new ClassSync().prop1.wait
		assert.deepStrictEqual(result, new Date(123))

		result = new ClassSync().prop1.lastOrWait
		assert.deepStrictEqual(result, new Date(123))
	})

	it('calc async', async function() {
		assert.deepStrictEqual(new ClassAsync().prop1.last, void 0)

		let object = new ClassAsync().prop1
		assert.deepStrictEqual(await object.wait, new Date(123))
		assert.deepStrictEqual(object.last, new Date(123))

		object = new ClassAsync().prop1
		assert.deepStrictEqual(await object.lastOrWait, new Date(123))
		assert.deepStrictEqual(object.last, new Date(123))
	})
})
