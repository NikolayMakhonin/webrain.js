"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandArray = expandArray;
exports.TestVariants = exports.THIS = void 0;

function expandArray(array, output = []) {
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

const THIS = {};
exports.THIS = THIS;

function* generateOptions(base, optionsVariants) {
  let hasChilds;

  for (const key in optionsVariants) {
    if (Object.prototype.hasOwnProperty.call(optionsVariants, key)) {
      for (const optionVariant of optionsVariants[key]) {
        const variant = { ...base,
          [key]: optionVariant
        };
        const newOptionsVariants = { ...optionsVariants
        };
        delete newOptionsVariants[key];
        hasChilds = true;
        yield* generateOptions(variant, newOptionsVariants);
      }

      break;
    }
  }

  if (!hasChilds) {
    yield base;
  }
} // region Test Actions


class TestVariants {
  test(testCases) {
    const optionsVariants = { ...this.baseOptionsVariants,
      ...testCases
    };
    const expected = testCases.expected;
    delete optionsVariants.expected;
    const actionsWithDescriptions = expandArray(optionsVariants.actions);
    delete optionsVariants.actions;
    const variants = Array.from(generateOptions({}, optionsVariants));

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

exports.TestVariants = TestVariants;