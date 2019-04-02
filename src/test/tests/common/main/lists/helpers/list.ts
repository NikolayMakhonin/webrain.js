import {
	CollectionChangedType,
	ICollectionChangedEvent,
} from '../../../../../../main/common/lists/contracts/ICollectionChanged'
import {List} from "../../../../../../main/common/lists/List";
import {ICompare} from "../../../../../../main/common/lists/contracts/ICompare";

declare const assert: any

export function generateArray(size) {
	const arr = []
	for (let i = 0; i < size; i++) {
		arr.push(i)
	}

	return arr
}

export function compareDefault(o1, o2) {
	if (o1 > o2) {
		return 1
	} else if (o2 > o1) {
		return -1
	} else {
		return 0
	}
}

export function expandArray<T>(array: T[], output: any[] = []): any[] {
	for (const item of array) {
		if (!item) {
			continue
		}

		if (Array.isArray(item)) {
			expandArray(item, output)
		} else {
			output.push(item)
		}
	}

	return output
}

export function *toIterable<T>(array: T[]): Iterable<T> {
	for (const item of array) {
		yield item
	}
}

export function *generateOptions(base: {}, optionsVariants: {}) {
	let hasChilds
	for (const key in optionsVariants) {
		if (Object.prototype.hasOwnProperty.call(optionsVariants, key)) {
			for (const optionVariant of optionsVariants[key]) {
				const variant = {
					...base,
					[key]: optionVariant,
				}

				const newOptionsVariants = {
					...optionsVariants,
				}

				delete newOptionsVariants[key]

				hasChilds = true

				yield* generateOptions(variant, newOptionsVariants)
			}

			break
		}
	}

	if (!hasChilds) {
		yield base
	}
}

export function applyCollectionChangedToArray<T>(event: ICollectionChangedEvent<T>, array: T[], compare: ICompare<T>) {
	switch (event.type) {
		case CollectionChangedType.Added:
			{
				const len = array.length
				const shift = event.shiftIndex - event.index
				for (let i = len - shift; i < len; i++) {
					array[i + shift] = array[i]
				}
				for (let i = len - 1; i >= event.shiftIndex; i--) {
					array[i] = array[i - shift]
				}
			}

			for (let i = 0; i < event.newItems.length; i++) {
				array[event.index + i] = event.newItems[i]
			}
			break
		case CollectionChangedType.Removed:
			for (let i = 0; i < event.oldItems.length; i++) {
				assert.strictEqual(array[event.index + i], event.oldItems[i])
			}
			for (let i = event.shiftIndex; i < array.length; i++) {
				array[event.index + i - event.shiftIndex] = array[i]
			}
			array.length -= event.oldItems.length
			break
		case CollectionChangedType.Set:
			assert.strictEqual(array[event.index], event.oldItems[0])
			array[event.index] = event.newItems[0]
			break
		case CollectionChangedType.Moved:
			array.splice(event.moveIndex, 0, ...array.splice(event.index, event.moveSize))
			break
		case CollectionChangedType.Resorted:
			array.sort(compare)
			break
	}
}

type TestFunc<T> = ((list: List<T>) => any) | TestFuncs<T>
interface TestFuncs<T> extends Array<TestFunc<T>> { }

export interface ITestFuncsWithDescription<T> {
	funcs: TestFuncs<T>,
	description: string
}
type TestFuncsWithDescription<T> = TestFunc<T> | ITestFuncsWithDescription<T> | TestFuncsWithDescriptions<T>
export interface TestFuncsWithDescriptions<T> extends Array<TestFuncsWithDescription<T>> { }

export function testListBase<T>(
	baseOptions: { [key: string]: any },
	baseVariants: { [key: string]: any },
	testVariant: (options: {}) => any,
	...testFuncsWithDescriptions: TestFuncsWithDescriptions<T>
) {
	for (const testFuncsWithDescription of expandArray(testFuncsWithDescriptions)) {
		let {funcs, description} = testFuncsWithDescription
		if (typeof testFuncsWithDescription === 'function') {
			funcs = [testFuncsWithDescription]
			description = ''
		}

		for (const testFunc of expandArray(funcs)) {
			for (const variant of generateOptions({}, {
				...baseVariants,
				...baseOptions.variants,
			})) {
				testVariant({
					...baseOptions,
					description,
					testFunc,
					...variant,
				})
			}
		}
	}
}
