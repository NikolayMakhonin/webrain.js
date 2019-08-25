/* tslint:disable:no-duplicate-string */
/* eslint-disable guard-for-in */
import {ThenableOrValue} from '../../../../../../../main/common/async/async'
import {ObservableObject} from '../../../../../../../main/common/rx/object/ObservableObject'
import {CalcObjectBuilder} from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder'
import {connector} from '../../../../../../../main/common/rx/object/properties/Connector'
import {Property} from '../../../../../../../main/common/rx/object/properties/property'

declare const assert: any

describe('common > main > rx > properties > CalcObjectBuilder', function() {
	it('calc', function() {
		class Class1 extends ObservableObject {
			public source: {
				value: string,
			}
		}

		const result = new CalcObjectBuilder(Class1.prototype)
			.calc('prop1', connector(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source['@wait']))),
				{
					dependencies: b => b.path(o => o.connectValue1),
					calcFunc(input, valueProperty: Property<Date, number>): ThenableOrValue<void> {
						valueProperty.value = new Date(0)
					},
				})
			.object.prop1

	})
})
