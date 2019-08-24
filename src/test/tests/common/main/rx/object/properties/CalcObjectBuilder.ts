/* tslint:disable:no-duplicate-string */
/* eslint-disable guard-for-in */
import {ObservableObject} from '../../../../../../../main/common/rx/object/ObservableObject'
import {ObservableObjectBuilder} from '../../../../../../../main/common/rx/object/ObservableObjectBuilder'
import {CalcObjectBuilder} from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder'
import {connector, ConnectorBuilder} from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder'
import {createObject} from '../../deep-subscribe/helpers/Tester'

declare const assert: any

xdescribe('common > main > rx > properties > CalcObjectBuilder', function() {
	it('calc', function() {
		class Class1 extends ObservableObject {

		}

		new CalcObjectBuilder(Class1.prototype)
			.calc('prop1', {
				input: connector(b => b
					.connect('connectValue1', ))
			})

	})
})
