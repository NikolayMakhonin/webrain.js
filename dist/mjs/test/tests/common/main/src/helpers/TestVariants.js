export function expandArray(array, output = []) {
  for (const item of array) {
    if (!item) {
      continue;
    }

    if (Array.isArray(item)) {
      expandArray(item, output);
    } else {
      output.push(item);
    }
  }

  return output;
}
export const THIS = {};

// tslint:disable-next-line:no-shadowed-variable no-empty
const NONE = function NONE() {};

function* generateOptions(base, optionsVariants, exclude) {
  let hasChilds;

  for (const key in optionsVariants) {
    if (optionsVariants[key]) {
      for (const optionVariant of optionsVariants[key]) {
        const variant = { ...base,
          [key]: optionVariant
        };
        const newOptionsVariants = { ...optionsVariants
        };
        newOptionsVariants[key] = null;
        hasChilds = true;
        yield* generateOptions(variant, newOptionsVariants, exclude);
      }

      break;
    }
  }

  if (!hasChilds && (!exclude || !exclude(base))) {
    yield base;
  }
} // region Test Actions


export class TestVariants {
  test(testCases) {
    const optionsVariants = { ...this.baseOptionsVariants,
      ...testCases
    };
    const expected = testCases.expected;
    const exclude = testCases.exclude;
    delete optionsVariants.expected;
    delete optionsVariants.exclude;
    const actionsWithDescriptions = expandArray(optionsVariants.actions);
    delete optionsVariants.actions; // tslint:disable-next-line:prefer-const

    let variants = generateOptions({}, optionsVariants, exclude); // variants = Array.from(variants)

    for (const actionsWithDescription of actionsWithDescriptions) {
      let {
        actions,
        description
      } = actionsWithDescription;

      if (typeof actionsWithDescription === 'function') {
        actions = [actionsWithDescription];
        description = '';
      }

      for (const action of expandArray(actions)) {
        for (const variant of variants) {
          this.testVariant({ ...variant,
            action,
            description,
            expected
          });
        }
      }
    }
  }

}