import { isIterable } from '../../../../helpers/helpers';
import { RuleRepeatAction, RuleType } from './builder/contracts/rules';
import { RuleNever } from './builder/rules';
const ARRAY_EMPTY = [];

function forkToArray(ruleIterable) {
  let array;
  let nothing;
  let never;

  for (const item of ruleIterable) {
    if (isIterable(item)) {
      const itemArray = Array.from(item);

      if (!itemArray.length) {
        if (!nothing) {
          if (!array) {
            array = [itemArray];
          } else {
            array.unshift(itemArray);
          }

          nothing = true;
        }

        continue;
      }

      if (!array) {
        array = [itemArray];
      } else {
        array.push(itemArray);
      }
    } else {
      if (item.type === RuleType.Never) {
        never = true;
      } else {
        throw new Error('Unexpected rule type: ' + RuleType[item.type]);
      }
    }
  }

  if (array) {
    return array;
  } else {
    if (never) {
      return RuleNever.instance;
    }

    return ARRAY_EMPTY;
  }
}

const COMPRESS_FORKS_DISABLED = false;

function* iterateFork(fork) {
  for (const ruleIterable of fork) {
    if (isIterable(ruleIterable)) {
      if (COMPRESS_FORKS_DISABLED) {
        yield compressForks(ruleIterable);
      } else {
        const iterator = ruleIterable[Symbol.iterator]();
        const iteration = iterator.next();

        if (!iteration.done) {
          if (isIterable(iteration.value)) {
            yield* iterateFork(iteration.value);
          } else {
            if (iteration.value.type === RuleType.Never) {
              yield iteration.value;
            } else {
              yield compressForks(ruleIterable, iterator, iteration);
            }
          }
        } else {
          yield ARRAY_EMPTY;
        }
      }
    } else {
      yield ruleIterable;
    }
  }
}

export function* compressForks(ruleOrForkIterable, iterator, iteration) {
  if (!iterator) {
    iterator = ruleOrForkIterable[Symbol.iterator]();
  }

  if (!iteration) {
    iteration = iterator.next();
  }

  if (iteration.done) {
    return;
  }

  const ruleOrFork = iteration.value;

  if (isIterable(ruleOrFork)) {
    const fork = iterateFork(ruleOrFork);
    const array = forkToArray(fork); // TODO optimize this array

    yield array;
    return;
  } else {
    yield ruleOrFork;
  }

  iteration = iterator.next();
  const nextIterable = iteration.value;

  if (nextIterable) {
    yield nextObject => compressForks(nextIterable(nextObject));
  }
}
export function iterateRule(object, rule, next = null) {
  return compressForks(_iterateRule(object, rule, next));
}

function* _iterateRule(object, rule, next) {
  if (!rule) {
    if (next) {
      yield* next(object);
    }

    return;
  }

  const ruleNext = rule.next || next ? nextObject => _iterateRule(nextObject, rule.next, next) : null;

  switch (rule.type) {
    case RuleType.Nothing:
      if (ruleNext) {
        yield* ruleNext(object);
      }

      break;

    case RuleType.Never:
      yield rule;
      break;

    case RuleType.Action:
      yield rule;
      yield ruleNext;
      break;

    case RuleType.If:
      {
        const {
          conditionRules
        } = rule;
        const len = conditionRules.length;
        let i = 0;

        for (; i < len; i++) {
          const conditionRule = conditionRules[i];

          if (Array.isArray(conditionRule)) {
            if (conditionRule[0](object)) {
              yield* _iterateRule(object, conditionRule[1], ruleNext);
              break;
            }
          } else {
            yield* _iterateRule(object, conditionRule, ruleNext);
            break;
          }
        }

        if (i === len && ruleNext) {
          yield* ruleNext(object);
        }

        break;
      }

    case RuleType.Any:
      const {
        rules
      } = rule;

      if (!rules.length) {
        yield RuleNever.instance;
        break; // throw new Error(`RuleType.Any rules.length=${rules.length}`)
      }

      if (rules.length === 1) {
        yield [_iterateRule(object, rules[0], ruleNext)];
      }

      const any = function* () {
        for (let i = 0, len = rules.length; i < len; i++) {
          const subRule = rules[i];

          if (!subRule) {
            throw new Error(`RuleType.Any rule=${subRule}`);
          }

          yield _iterateRule(object, subRule, ruleNext);
        }
      };

      yield any();
      break;

    case RuleType.Repeat:
      {
        const {
          countMin,
          countMax,
          condition,
          rule: subRule
        } = rule; // if (countMin === 0 && countMin === countMax) {
        // 	// == RuleType.Nothing
        // 	if (ruleNext) {
        // 		yield* ruleNext(object)
        // 	}
        // 	break
        // }

        if (countMax < countMin || countMax < 0) {
          // == RuleType.Never
          yield RuleNever.instance;
          break;
        }

        const repeatNext = function* (nextObject, index) {
          let repeatAction = condition ? condition(nextObject, index) : RuleRepeatAction.All;

          if (index < countMin) {
            repeatAction = repeatAction & ~RuleRepeatAction.Fork;
          }

          if (index >= countMax) {
            repeatAction = repeatAction & ~RuleRepeatAction.Next;
          }

          if ((repeatAction & RuleRepeatAction.Fork) === 0) {
            if ((repeatAction & RuleRepeatAction.Next) === 0) {
              yield RuleNever.instance;
              return;
            }

            yield* nextIteration(index + 1);
            return;
          }

          if ((repeatAction & RuleRepeatAction.Next) === 0) {
            if (ruleNext) {
              yield* ruleNext(nextObject);
            }

            return;
          }

          yield [ruleNext ? ruleNext(nextObject) : ARRAY_EMPTY, nextIteration(index + 1)];

          function nextIteration(newCount) {
            return _iterateRule(nextObject, subRule, nextIterationObject => repeatNext(nextIterationObject, newCount));
          }
        };

        yield* repeatNext(object, 0);
        break;
      }

    default:
      throw new Error('Unknown RuleType: ' + rule.type);
  }
}

export function subscribeNextRule(ruleIterator, iteration, fork, subscribeNode) {
  const ruleOrIterable = iteration.value;

  if (isIterable(ruleOrIterable)) {
    let unsubscribers; // for (let step, innerIterator = ruleOrIterable[Symbol.iterator](); !(step = innerIterator.next()).done;) {
    // 	const ruleIterable = step.value
    // 	const unsubscribe = fork(ruleIterable[Symbol.iterator]())
    // 	if (unsubscribe != null) {
    // 		if (!unsubscribers) {
    // 			unsubscribers = [unsubscribe]
    // 		} else {
    // 			unsubscribers.push(unsubscribe)
    // 		}
    // 	}
    // }

    for (const ruleIterable of ruleOrIterable) {
      const unsubscribe = fork(ruleIterable[Symbol.iterator]());

      if (unsubscribe) {
        if (!unsubscribers) {
          unsubscribers = [unsubscribe];
        } else {
          unsubscribers.push(unsubscribe);
        }
      }
    }

    if (!unsubscribers) {
      return null;
    }

    return () => {
      for (let i = 0, len = unsubscribers.length; i < len; i++) {
        unsubscribers[i]();
      }
    };
  }

  const nextIterable = ruleIterator.next().value;
  return subscribeNode(ruleOrIterable, nextIterable // ? () => nextIterable(object)[Symbol.iterator]()
  // : null,
  );
}