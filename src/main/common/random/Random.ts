// from here: https://stackoverflow.com/a/47593316/5221762
import {uuid} from './uuid'

function mulberry32(seed: number): () => number {
	return function() {
		let t = seed += 0x6D2B79F5
		t = Math.imul(t ^ t >>> 15, t | 1)
		t ^= t + Math.imul(t ^ t >>> 7, t | 61)
		return ((t ^ t >>> 14) >>> 0) / 4294967296
	}
}

/** Usage:
	* 1) arrayShuffle(array, () => Math.random())
	* 2) arrayShuffle(array, () => rnd.next())
	*/

export function randomWithoutSeed() {
	return Math.random()
}

// from: https://stackoverflow.com/a/6274398/5221762
export function arrayShuffle<T>(array: T[], rnd?: () => number): T[] {
	if (rnd == null) {
		rnd = randomWithoutSeed
	}

	let counter = array.length

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		const index = (rnd() * counter) | 0

		// Decrease counter by 1
		counter--

		// And swap the last element with it
		const temp = array[counter]
		array[counter] = array[index]
		array[index] = temp
	}

	return array
}

export function getRandomFunc(seed?: number) {
	return seed != null
		? mulberry32(seed)
		: randomWithoutSeed
}

/** Generate random number in range [0..1) like Math.random() or other, but can be pseudorandom with seed */
export class Random {
	private readonly _rnd: () => number

	constructor(seed?: number) {
		this._rnd = getRandomFunc(seed)
	}

	public next(): number {
		return this._rnd()
	}

	public nextRange(from: number, to: number): number {
		return this._rnd() * (to - from) + from
	}

	public nextInt(toExclusive: number): number
	// tslint:disable-next-line:unified-signatures
	public nextInt(from: number, toExclusive: number): number
	public nextInt(from: number, toExclusive?: number): number {
		if (toExclusive == null) {
			toExclusive = from
			from = 0
		}
		return Math.floor(this._rnd() * (toExclusive - from) + from)
	}

	public nextBoolean(trueProbability = 0.5): boolean {
		return this._rnd() < trueProbability
	}

	public nextBooleanOrNull(trueWeight: number = 1, falseWeight: number = 1, nullWeight: number = 1): boolean|null {
		const value = this.next() * (trueWeight + falseWeight + nullWeight)
		if (value < trueWeight) {
			return true
		}
		if (value < trueWeight + falseWeight) {
			return false
		}

		return null
	}

	public nextTime(from: Date|number, toExclusive: Date|number): number {
		if (from instanceof Date) {
			from = from.getTime()
		}
		if (toExclusive instanceof Date) {
			toExclusive = toExclusive.getTime()
		}
		return this.nextInt(from, toExclusive)
	}

	public nextDate(from: Date|number, toExclusive: Date|number): Date {
		if (from instanceof Date) {
			from = from.getTime()
		}
		if (toExclusive instanceof Date) {
			toExclusive = toExclusive.getTime()
		}
		return new Date(this.nextInt(from, toExclusive))
	}

	public pullArrayItem<T>(array: T[]): T {
		const len = array.length
		const index = this.nextInt(len)
		const item = array[index]

		// remove item with shift
		for (let i = index + 1; i < len; i++) {
			array[i - 1] = array[i]
		}
		array.length = len - 1

		return item
	}

	public nextArrayItem<T>(array: T[]): T {
		return array[this.nextInt(array.length)]
	}

	public static arrayShuffle = arrayShuffle

	public nextArrayItems<T>(array: T[], minCount: number, relativeMaxCount: number): T[] {
		arrayShuffle(array, () => this.next())
		const count = this.nextInt(Math.round(array.length * relativeMaxCount))
		return array.slice(0, count)
	}

	public nextColor(): string {
		return '#' + this.nextInt(0x1000000).toString(16)
	}

	public nextEnum<TValue extends string, TEnum extends { [key: string]: TValue }>(enumType: TEnum): TValue {
		return this.nextArrayItem(Object.values(enumType)) as any
	}

	public nextUuid(): string {
		return uuid(() => this.next())
	}
}
