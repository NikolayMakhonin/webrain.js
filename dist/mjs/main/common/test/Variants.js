const arrayEmpty = [];

class NextVariantItem {
  constructor(baseVariant, nextItem) {
    this.baseVariant = baseVariant;
    this.nextItem = nextItem;
  }

  *[Symbol.iterator]() {
    yield* this.baseVariant;
    yield this.nextItem;
  }

}

class NextVariantItems {
  constructor(baseVariant, nextItems) {
    this.baseVariant = baseVariant;
    this.nextItems = nextItems;
  }

  *[Symbol.iterator]() {
    yield* this.baseVariant;
    yield* this.nextItems;
  }

}

export class TreeToSequenceVariants {
  constructor(tree, startIndex = 0, variant = arrayEmpty) {
    this.tree = tree;
    this.startIndex = startIndex;
    this.variant = variant;
  }

  *[Symbol.iterator]() {
    if (this.startIndex >= this.tree.length) {
      yield this.variant;
      return;
    }

    const variant = this.variant;
    const subTree = this.tree[this.startIndex];

    if (Array.isArray(subTree)) {
      for (const subSequenceTree of subTree) {
        if (Array.isArray(subSequenceTree)) {
          const subSequenceVariants = treeToSequenceVariants(subSequenceTree);

          for (const subSequenceVariant of subSequenceVariants) {
            yield* treeToSequenceVariants(this.tree, this.startIndex + 1, new NextVariantItems(variant, subSequenceVariant));
          }
        } else {
          yield* treeToSequenceVariants(this.tree, this.startIndex + 1, new NextVariantItem(variant, subSequenceTree));
        }
      }
    } else {
      yield* treeToSequenceVariants(this.tree, this.startIndex + 1, new NextVariantItem(variant, subTree));
    }
  }

}
export function treeToSequenceVariants(tree, startIndex = 0, variant = arrayEmpty) {
  return new TreeToSequenceVariants(tree, startIndex, variant);
}
export function iterablesToArrays(iterables) {
  const iterablesArray = Array.from(iterables);
  const arrays = iterablesArray.map(iterable => Array.from(iterable));
  return arrays;
}