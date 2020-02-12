import {OptimizationStatus} from '../contracts'
import v8 from './runtime-adapter'

export {v8}

export function getObjectOptimizationInfo(obj) {
	const result = {
		CountElementsTypes: 0,
		HasFastPackedElements: v8.HasFastPackedElements(obj),
		HasDictionaryElements: v8.HasDictionaryElements(obj),
		HasFastDoubleElements: v8.HasFastDoubleElements(obj),
		// HasElementsInALargeObjectSpace: v8.HasElementsInALargeObjectSpace(obj),
		HasFastElements: false,
		HasFastProperties: v8.HasFastProperties(obj),
		HasFixedFloat32Elements: v8.HasFixedFloat32Elements(obj),
		HasFixedFloat64Elements: v8.HasFixedFloat64Elements(obj),
		HasFixedInt16Elements: v8.HasFixedInt16Elements(obj),
		HasFixedInt32Elements: v8.HasFixedInt32Elements(obj),
		HasFixedInt8Elements: v8.HasFixedInt8Elements(obj),
		HasFixedUint16Elements: v8.HasFixedUint16Elements(obj),
		HasFixedUint32Elements: v8.HasFixedUint32Elements(obj),
		HasFixedUint8ClampedElements: v8.HasFixedUint8ClampedElements(obj),
		HasFixedUint8Elements: v8.HasFixedUint8Elements(obj),
		HasFastHoleyElements: v8.HasFastHoleyElements(obj),
		HasFastObjectElements: v8.HasFastObjectElements(obj),
		HasSloppyArgumentsElements: v8.HasSloppyArgumentsElements(obj),
		HasFastSmiElements: v8.HasFastSmiElements(obj),
		HasFastSmiOrObjectElements: v8.HasFastSmiOrObjectElements(obj),
	}

	result.HasFastElements = result.HasFastPackedElements
		|| result.HasFastDoubleElements
		|| result.HasFastHoleyElements
		|| result.HasFastObjectElements
		|| result.HasFastSmiElements
		|| result.HasFastSmiOrObjectElements

	if (result.HasFixedFloat32Elements) {
		result.CountElementsTypes++
	}
	if (result.HasFastDoubleElements) {
		result.CountElementsTypes++
	}
	if (result.HasFixedInt32Elements) {
		result.CountElementsTypes++
	}
	if (result.HasFixedFloat64Elements) {
		result.CountElementsTypes++
	}
	if (result.HasFixedInt8Elements) {
		result.CountElementsTypes++
	}
	if (result.HasFixedInt16Elements) {
		result.CountElementsTypes++
	}
	if (result.HasFixedUint8ClampedElements) {
		result.CountElementsTypes++
	}
	if (result.HasFixedUint8Elements) {
		result.CountElementsTypes++
	}
	if (result.HasFixedUint16Elements) {
		result.CountElementsTypes++
	}
	if (result.HasFixedUint32Elements) {
		result.CountElementsTypes++
	}
	if (result.HasFastObjectElements) {
		result.CountElementsTypes++
	}
	if (result.HasFastSmiElements) {
		result.CountElementsTypes++
	}

	return result
}

type TObjectOptimizationInfo = { [key in keyof ReturnType<typeof getObjectOptimizationInfo>]?: any }

export const shouldArrayOptimizationInfo: TObjectOptimizationInfo = {
	CountElementsTypes: 1,
	HasFastPackedElements: true,
	HasDictionaryElements: false,
	HasFastElements: true,
}

export const shouldObjectOptimizationInfo: TObjectOptimizationInfo = {
	CountElementsTypes: 1,
	HasDictionaryElements: false,
	HasFastElements: true,
	HasFastHoleyElements: true,
	HasFastObjectElements: true,
	HasFastSmiOrObjectElements: true,
}

export const shouldOptimizationStatus = OptimizationStatus.IsFunction | OptimizationStatus.Optimized
export const shouldNotOptimizationStatus = OptimizationStatus.NeverOptimize
	| OptimizationStatus.AlwaysOptimize | OptimizationStatus.Interpreted
	| OptimizationStatus.MaybeDeopted | OptimizationStatus.MaybeDeopted
