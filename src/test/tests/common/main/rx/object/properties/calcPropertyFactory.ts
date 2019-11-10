// /* tslint:disable:no-duplicate-string no-empty */
// /* eslint-disable guard-for-in */
// import {ThenableOrIteratorOrValue} from '../../../../../../../main/common/async/async'
// import {ThenableSync} from '../../../../../../../main/common/async/ThenableSync'
// import {delay} from '../../../../../../../main/common/helpers/helpers'
// import {deepSubscribe} from '../../../../../../../main/common/rx/deep-subscribe/deep-subscribe'
// import {ObservableClass} from '../../../../../../../main/common/rx/object/ObservableClass'
// import {CalcObjectBuilder} from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder'
// import {calcPropertyFactory} from '../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder'
// import {connectorFactory} from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder'
// import {ICalcProperty} from '../../../../../../../main/common/rx/object/properties/contracts'
// import {resolvePath} from '../../../../../../../main/common/rx/object/properties/helpers'
// import {Property} from '../../../../../../../main/common/rx/object/properties/Property'
// import {assert} from '../../../../../../../main/common/test/Assert'
// import {describe, it} from '../../../../../../../main/common/test/Mocha'
// import {createObject, TestDeepSubscribe} from '../../deep-subscribe/helpers/src/TestDeepSubscribe'
//
// describe('common > main > rx > properties > calcPropertyFactory', function() {
// 	this.timeout(30000)
//
// 	const factorySync = calcPropertyFactory({
// 		dependencies: d => d.invalidateOn(b => b.propertyAny()),
// 		calcFunc(state): ThenableOrIteratorOrValue<void> {
// 			state.value = state.input.connectValue1 && new Date(state.input.connectValue1)
// 			return ThenableSync.createResolved(null)
// 		},
// 	})
//
// 	const factoryCircularSync = calcPropertyFactory({
// 		dependencies: d => d.invalidateOn(b => b.propertyAny()),
// 		calcFunc(state): ThenableOrIteratorOrValue<boolean> {
// 			state.value = { value: state.input.connectorState.source }
// 			return ThenableSync.createResolved(true)
// 		},
// 	})
//
// 	const factoryCircularAsync = calcPropertyFactory({
// 		dependencies: d => d.invalidateOn(b => b.propertyAny()),
// 		*calcFunc(state): ThenableOrIteratorOrValue<void> {
// 			yield new Promise(r => setTimeout(r, 100))
// 			state.value = new Date(state.input.connectValue1)
// 		},
// 	})
//
// 	it('sync', function() {
//
// 	})
// })
