export class ObservableSet<T> extends Set<T> {
	public add(value: T): this {
		return super.add(value)
	}

	public clear(): this {
		super.clear()
		return this
	}

	public delete(value: T): boolean {
		return super.delete(value)
	}

	public addArray(sourceItems: T[], sourceStart?: number, sourceEnd?: number): boolean {
		return this.insertArray(this.size, sourceItems, sourceStart, sourceEnd)
	}

	public addIterable(items: Iterable<T>, itemsSize: number): boolean {
		return this.insertIterable(this.size, items, itemsSize)
	}

	public insertArray(index: number, sourceItems: T[], sourceStart?: number, sourceEnd?: number): boolean {

	}

	public insertIterable(index: number, items: Iterable<T>, itemsSize: number): boolean {

	}
}
