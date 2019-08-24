/* tslint:disable:no-duplicate-string */
/* eslint-disable guard-for-in */
import {ObservableObject} from '../../../../../../../main/common/rx/object/ObservableObject'
import {ObservableObjectBuilder} from '../../../../../../../main/common/rx/object/ObservableObjectBuilder'
import {CalcObjectBuilder} from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder'
import {connector, ConnectorBuilder} from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder'
import {createObject} from '../../deep-subscribe/helpers/Tester'
import {Property} from "../../../../../../../main/common/rx/object/properties/property";
import {ThenableOrValue} from "../../../../../../../main/common/async/async";

declare const assert: any

describe('common > main > rx > properties > CalcObjectBuilder', function() {
	it('calc', function() {
		class Class1 extends ObservableObject {
			public map: Map<string, {
				value: string,
			}>
			public source: {
				value: string,
			}
		}

		type TInput = (object: Class1) => ObservableObject & { connectValue1: { value: string } }

		const result = new CalcObjectBuilder(Class1.prototype)
			.calc('prop1', connector(c => c
				.connect('connectValue1', b => b.path(o => (o as Class1).map).mapKey('x').path(o => o.source))),
				{
					dependencies: b => b.path(o => o.connectValue1),
					calcFunc(input, valueProperty: Property<Date, number>): ThenableOrValue<void> {
						valueProperty.value = new Date(0)
					},
				})
			.object.prop1

	})
})
