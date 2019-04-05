export class ObservableMap<TKey, TValue> extends Map<TKey, TValue> {
	public set(key: TKey, value: TValue): this {
		return super.set(key, value)
	}

	public clear(): this {
		super.clear()
		return this
	}

	public delete(key: TKey): boolean {
		return super.delete(key)
	}

}
