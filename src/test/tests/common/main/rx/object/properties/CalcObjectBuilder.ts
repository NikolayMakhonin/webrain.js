/* tslint:disable:no-duplicate-string */
/* eslint-disable guard-for-in */
import {ThenableOrIteratorOrValue, ThenableOrValue} from '../../../../../../../main/common/async/async'
import {ThenableSync} from '../../../../../../../main/common/async/ThenableSync'
import {ObservableObject} from '../../../../../../../main/common/rx/object/ObservableObject'
import {CalcObjectBuilder} from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder'
import {calcPropertyFactory} from '../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder'
import {connectorFactory} from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder'
import {Property} from '../../../../../../../main/common/rx/object/properties/property'

declare const assert: any

describe('common > main > rx > properties > CalcObjectBuilder', function() {
	class Class1 extends ObservableObject {
		public source: {
			value: string,
		}
	}

	const createObject = (async: boolean) => new CalcObjectBuilder(Class1.prototype)
		.calc('prop1',
			connectorFactory(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source['@wait']))),
			calcPropertyFactory(async
				? function *(input, valueProperty: Property<Date, number>): ThenableOrIteratorOrValue<void> {
					yield new Promise(r => setTimeout(r, 100))
					valueProperty.value = new Date(123)
				}
				: (input, valueProperty: Property<Date, number>): ThenableOrIteratorOrValue<void> => {
					valueProperty.value = new Date(123)
				}),
		)
		.object

	it('calc sync', function() {
		let result: any = createObject(false).prop1.last
		assert.deepStrictEqual(result, new Date(123))

		result = createObject(false).prop1.wait
		assert.deepStrictEqual(result, new Date(123))

		result = createObject(false).prop1.lastOrWait
		assert.deepStrictEqual(result, new Date(123))
	})

	it('calc async', async function() {
		assert.deepStrictEqual(createObject(true).prop1.last, void 0)

		let object = createObject(true).prop1
		assert.deepStrictEqual(await object.wait, new Date(123))
		assert.deepStrictEqual(object.last, new Date(123))

		object = createObject(true).prop1
		assert.deepStrictEqual(await object.lastOrWait, new Date(123))
		assert.deepStrictEqual(object.last, new Date(123))
	})
})
