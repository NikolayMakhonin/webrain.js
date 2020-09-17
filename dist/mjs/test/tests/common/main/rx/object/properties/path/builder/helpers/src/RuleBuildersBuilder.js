/* tslint:disable:no-shadowed-variable */
import { RuleRepeatAction } from '../../../../../../../../../../../main/common/rx/object/properties/path/builder/contracts/rules';
import { iterablesToArrays, treeToSequenceVariants } from '../../../../../../../../../../../main/common/test/Variants'; // region helpres
// export interface IRuleBuildersBuilder<TObject = any, TValueKeys extends string | number = never>
// 	extends IRuleBuilder<TObject, TValueKeys>
// {
// 	ruleFactoriesTree: IArrayTree<IRuleFactory<any, any, TValueKeys>>
// }

/**
 * Returns an array with arrays of the given size.
 *
 * @param array array to split
 * @param chunkSize Size of every group
 */
function chunkArray(array, chunkSize) {
  const arrayLength = array.length;
  const chunks = [];

  for (let index = 0; index < arrayLength; index += chunkSize) {
    const chunk = array.slice(index, index + chunkSize);
    chunks.push(chunk);
  }

  return chunks;
}

// endregion
export class RuleBuildersBuilder // implements IRuleBuildersBuilder<TObject, TValueKeys>
{
  constructor() {
    this.ruleFactoriesTree = [];
  }

  ruleFactory(ruleFactory, prevRuleFactoryIndex) {
    this.ruleFactoriesTree.push(function _ruleFactory(index) {
      return [ruleFactory, index + 1];
    });
    return this;
  }

  variants(...getVariants) {
    if (getVariants.length === 0) {
      return this;
    }

    if (getVariants.length === 1) {
      getVariants[0](this);
      return this;
    }

    const variants = getVariants.map(getVariant => getVariant(this.clone(true)).ruleFactoriesTree).filter(o => o.length);

    if (variants.length) {
      this.ruleFactoriesTree.push(variants);
    }

    return this;
  }

  _any(...getChilds) {
    const len = getChilds.length;
    const ruleIndex = this.ruleFactoriesTree.length - 1;
    this.ruleFactoriesTree.push(function any(index) {
      index++;
      const args = [];

      for (let i = 0; i < len; i++) {
        const [ruleFactory, indexNext] = this[index](index);
        index = indexNext;
        args.push(ruleFactory);
      }

      return [b => b.any(...args), index];
    });

    for (let i = 0; i < len; i++) {
      getChilds[i](this);
    }

    return this;
  }

  any(...getChilds) {
    const variants = iterablesToArrays(treeToSequenceVariants(getChilds));
    return this.variants(...variants.map(args => b => b._any(...args)));
  }

  _if(...exclusiveConditionRules) {
    const len = exclusiveConditionRules.length;
    const ruleIndex = this.ruleFactoriesTree.length - 1;
    this.ruleFactoriesTree.push(function If(index) {
      index++;
      const args = [];

      for (let i = 0; i < len; i++) {
        const conditionRule = exclusiveConditionRules[i];
        const [ruleFactory, indexNext] = this[index](index);
        index = indexNext;
        args.push(Array.isArray(conditionRule) ? [conditionRule[0], ruleFactory] : ruleFactory);
      }

      return [b => b.if(...args), index];
    });

    for (let i = 0; i < len; i++) {
      const conditionRule = exclusiveConditionRules[i];

      if (Array.isArray(conditionRule)) {
        conditionRule[1](this);
      } else {
        conditionRule(this);
      }
    }

    return this;
  }

  if(...exclusiveConditionRules) {
    const tree = exclusiveConditionRules.flatMap(o => o);
    const variants = iterablesToArrays(treeToSequenceVariants(tree));
    return this.variants(...variants.map(args => {
      const chunkArgs = chunkArray(args, 2).map(o => o[0] ? o : o[1]);
      return b => b._if(...chunkArgs);
    }));
  }

  _repeat(countMin, countMax, condition, getChild) {
    const ruleIndex = this.ruleFactoriesTree.length - 1;
    this.ruleFactoriesTree.push(function repeat(index) {
      index++;
      const [ruleFactory, indexNext] = this[index](index);
      index = indexNext;
      return [b => b.repeat(countMin, countMax, condition, ruleFactory), index];
    });
    getChild(this);
    return this;
  }

  repeat(countMin, countMax, condition, getChild) {
    const variants = iterablesToArrays(treeToSequenceVariants([countMin, countMax, condition, getChild]));
    return this.variants(...variants.map(args => b => b._repeat(...args)));
  }

  collection() {
    return this.ruleFactory(function collection(b) {
      return b.collection();
    });
  }

  mapAny() {
    return this.ruleFactory(function mapAny(b) {
      return b.mapAny();
    });
  }

  mapKey(key) {
    const variants = iterablesToArrays(treeToSequenceVariants([key]));
    return this.variants(...variants.map(args => bb => bb.ruleFactory(function mapKey(b) {
      return b.mapKey(...args);
    })));
  }

  mapKeys(...keys) {
    const variants = iterablesToArrays(treeToSequenceVariants(keys));
    return this.variants(...variants.map(args => bb => bb.ruleFactory(function mapKeys(b) {
      return b.mapKeys(...args);
    })));
  }

  mapPredicate(keyPredicate, description) {
    const variants = iterablesToArrays(treeToSequenceVariants([keyPredicate, description]));
    return this.variants(...variants.map(args => bb => bb.ruleFactory(function mapPredicate(b) {
      return b.mapPredicate(...args);
    })));
  }

  mapRegexp(keyRegexp) {
    const variants = iterablesToArrays(treeToSequenceVariants([keyRegexp]));
    return this.variants(...variants.map(args => bb => bb.ruleFactory(function mapRegexp(b) {
      return b.mapRegexp(...args);
    })));
  }

  never() {
    return this.ruleFactory(function never(b) {
      return b.never();
    });
  }

  nothing() {
    return this.ruleFactory(function nothing(b) {
      return b.nothing();
    });
  } // public path<TValue>(getValueFunc: (o: TObject) => TValue): IRuleBuildersBuilder<any, TValueKeys> {
  // 	return this.ruleFactory(function collection(b) { return b.collection() })
  // }


  propertyAny() {
    return this.ruleFactory(function propertyAny(b) {
      return b.propertyAny();
    });
  }

  propertyName(propName) {
    const variants = iterablesToArrays(treeToSequenceVariants([propName]));
    return this.variants(...variants.map(args => bb => bb.ruleFactory(function propertyName(b) {
      return b.propertyName(...args);
    })));
  }

  propertyNames(...propertiesNames) {
    const variants = iterablesToArrays(treeToSequenceVariants(propertiesNames));
    return this.variants(...variants.map(args => bb => bb.ruleFactory(function propertyNames(b) {
      return b.propertyNames(...args);
    })));
  }

  p(...propertiesNames) {
    const variants = iterablesToArrays(treeToSequenceVariants(propertiesNames));
    return this.variants(...variants.map(args => bb => bb.ruleFactory(function p(b) {
      return b.p(...args);
    })));
  }

  propertyPredicate(predicate, description) {
    const variants = iterablesToArrays(treeToSequenceVariants([predicate, description]));
    return this.variants(...variants.map(args => bb => bb.ruleFactory(function propertyPredicate(b) {
      return b.propertyPredicate(...args);
    })));
  }

  propertyRegexp(regexp) {
    const variants = iterablesToArrays(treeToSequenceVariants([regexp]));
    return this.variants(...variants.map(args => bb => bb.ruleFactory(function propertyRegexp(b) {
      return b.propertyRegexp(...args);
    })));
  } // public rule<TValue>(rule: IRule): IRuleBuildersBuilder<TValue, TValueKeys> {
  // 	return this.ruleFactory(function collection(b) { return b.collection() })
  // }
  // public ruleSubscribe<TValue>(ruleSubscribe: IRuleSubscribe<TObject, TValue>, description?: string)
  // 	: IRuleBuildersBuilder<TValue, TValueKeys>
  // {
  // 	return this.ruleFactory(function collection(b) { return b.collection() })
  // }


  valuePropertyDefault() {
    return this.ruleFactory(function valuePropertyDefault(b) {
      return b.valuePropertyDefault();
    });
  }

  valuePropertyName(propertyName) {
    const variants = iterablesToArrays(treeToSequenceVariants([propertyName]));
    return this.variants(...variants.map(args => bb => bb.ruleFactory(function valuePropertyName(b) {
      return b.valuePropertyName(...args);
    })));
  }

  valuePropertyNames(...propertiesNames) {
    const variants = iterablesToArrays(treeToSequenceVariants(propertiesNames));
    return this.variants(...variants.map(args => bb => bb.ruleFactory(function valuePropertyNames(b) {
      return b.valuePropertyNames(...args);
    })));
  }

  v(...propertiesNames) {
    const variants = iterablesToArrays(treeToSequenceVariants(propertiesNames));
    return this.variants(...variants.map(args => bb => bb.ruleFactory(function v(b) {
      return b.v(...args);
    })));
  }

  clone(optionsOnly) {
    const clone = new RuleBuildersBuilder();

    if (!optionsOnly) {
      throw new Error('Not implemented'); // clone.ruleFactoriesTree = [...this.ruleFactoriesTree]
    }

    return clone;
  } // endregion
  // variants


  nothingVariants(beforeValueProperty) {
    return this.variants(b => b, b => b.nothing(), b => b.if([o => false, b => b.never()]), b => b.if([o => false, b => b.never()], [null, b => b.nothing()]), b => b.repeat(0, 2, [(o, i) => i === 1 ? RuleRepeatAction.Fork : RuleRepeatAction.Next], b => b.nothing()), // b => b.any(
    // 	b => b.nothing(),
    // 	b => b.repeat([1, 2], [0, 2], [null, o => RuleRepeatAction.All], b => b.never()),
    // ),
    ...(beforeValueProperty ? [] : [b => b.valuePropertyDefault(), b => b.v('notExistProperty')]));
  }

  neverVariants() {
    return this.variants(b => b, b => b.never(), b => b.if([o => true, b => b.never()]), b => b.if([o => false, b => b.nothing()], [null, b => b.never()]), b => b.any(b => b.repeat([1, 2], [0, 2], [null, o => RuleRepeatAction.All], b => b.never())));
  } // endregion


} // region ruleFactoriesVariants

export function applyRuleFactories(ruleFactories, builder) {
  const len = ruleFactories.length;
  let index = 0;

  while (index < len) {
    const [ruleFactory, indexNext] = ruleFactories[index](index);
    builder = ruleFactory(builder);
    index = indexNext;
  }

  return builder;
}
export function ruleFactoriesVariants(...variants) {
  const ruleFactoriesTree = new RuleBuildersBuilder().variants(...variants).ruleFactoriesTree;
  const factoriesVariants = treeToSequenceVariants(ruleFactoriesTree);
  const factories = [];

  for (const factoriesVariant of factoriesVariants) {
    const factoriesVariantArray = Array.from(factoriesVariant);
    factories.push(b => applyRuleFactories(factoriesVariantArray, b));
  }

  return factories;
} // endregion