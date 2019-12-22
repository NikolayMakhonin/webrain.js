const arrayEmpty = []
export type ArrayTreeOrValue<T> = IArrayTree<T>|T
export interface IArrayTree<T> extends Array<ArrayTreeOrValue<T>> { }

class NextVariantItem<T> {
	public baseVariant: Iterable<T>
	public nextItem: T
	constructor(baseVariant: Iterable<T>, nextItem: T) {
		this.baseVariant = baseVariant
		this.nextItem = nextItem
	}
	public * [Symbol.iterator]() {
		yield* this.baseVariant
		yield this.nextItem
	}
}

class NextVariantItems<T> {
	public baseVariant: Iterable<T>
	public nextItems: Iterable<T>
	constructor(baseVariant: Iterable<T>, nextItems: Iterable<T>) {
		this.baseVariant = baseVariant
		this.nextItems = nextItems
	}
	public * [Symbol.iterator]() {
		yield* this.baseVariant
		yield* this.nextItems
	}
}

export class TreeToSequenceVariants<T> {
	private readonly tree: IArrayTree<T>
	private readonly startIndex: number
	private readonly variant: Iterable<T>

	constructor(
		tree: IArrayTree<T>,
		startIndex: number = 0,
		variant: Iterable<T> = arrayEmpty,
	) {
		this.tree = tree
		this.startIndex = startIndex
		this.variant = variant
	}

	public * [Symbol.iterator]() {
		if (this.startIndex >= this.tree.length) {
			yield this.variant
			return
		}

		const variant = this.variant

		const subTree = this.tree[this.startIndex]
		if (Array.isArray(subTree)) {
			for (const subSequenceTree of subTree) {
				if (Array.isArray(subSequenceTree)) {
					const subSequenceVariants = treeToSequenceVariants(subSequenceTree)
					for (const subSequenceVariant of subSequenceVariants) {
						yield* treeToSequenceVariants(
							this.tree,
							this.startIndex + 1,
							new NextVariantItems(variant, subSequenceVariant),
						)
					}
				} else {
					yield* treeToSequenceVariants(
						this.tree,
						this.startIndex + 1,
						new NextVariantItem(variant, subSequenceTree),
					)
				}
			}
		} else {
			yield* treeToSequenceVariants(
				this.tree,
				this.startIndex + 1,
				new NextVariantItem(variant, subTree),
			)
		}
	}
}

export function treeToSequenceVariants<T>(
	tree: IArrayTree<T>,
	startIndex: number = 0,
	variant: Iterable<T> = arrayEmpty,
): Iterable<Iterable<T>> {
	return new TreeToSequenceVariants(tree, startIndex, variant)
}

export function iterablesToArrays<T>(iterables: Iterable<Iterable<T>>): T[][] {
	const iterablesArray = Array.from(iterables)
	const arrays = iterablesArray
		.map(iterable => Array.from(iterable))

	return arrays
}
