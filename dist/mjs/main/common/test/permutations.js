// see: https://www.codeproject.com/Articles/1250925/Permutations-Fast-implementations-and-a-new-indexi
// from: https://github.com/EricOuellet2/Permutations/blob/master/Permutations/PermutationMixOuelletSaniSinghHuttunen.cs
// from: https://github.com/EricOuellet2/Permutations/blob/master/Permutations/PermutationOuelletLexico3.cs
// from: https://github.com/EricOuellet2/Permutations/blob/master/Permutations/PermutationSaniSinghHuttunen.cs
let factorialTable;
const maxFactorialValue = 20;
export function getFactorial(value) {
  if (value < 0 || value > maxFactorialValue) {
    throw new Error(`getFactorial error: value (${value}) < 0 || > ${maxFactorialValue}`);
  }

  if (factorialTable == null) {
    factorialTable = new Array(maxFactorialValue + 1);
    factorialTable[0] = 1;
    let f = 1;

    for (let i = 1; i <= 20; i++) {
      f = f * i;
      factorialTable[i] = f;
    }
  }

  return factorialTable[value];
}

function nextSaniSinghHuttunen(numList) {
  /*
  	Knuths
  	1. Find the largest index j such that a[j] < a[j + 1]. If no such index exists,
  		the permutation is the last permutation.
  	2. Find the largest index l such that a[j] < a[l]. Since j + 1 is such an index,
  		l is well defined and satisfies j < l.
  	3. Swap a[j] with a[l].
  	4. Reverse the sequence from a[j + 1] up to and including the final element a[n].
  */
  let largestIndex = -1;

  for (let i = numList.length - 2; i >= 0; i--) {
    if (numList[i] < numList[i + 1]) {
      largestIndex = i;
      break;
    }
  }

  if (largestIndex < 0) {
    return false;
  }

  let largestIndex2 = -1;

  for (let i = numList.length - 1; i >= 0; i--) {
    if (numList[largestIndex] < numList[i]) {
      largestIndex2 = i;
      break;
    }
  }

  let tmp = numList[largestIndex];
  numList[largestIndex] = numList[largestIndex2];
  numList[largestIndex2] = tmp;

  for (let i = largestIndex + 1, j = numList.length - 1; i < j; i++, j--) {
    tmp = numList[i];
    numList[i] = numList[j];
    numList[j] = tmp;
  }

  return true;
}

class PermutationOuelletLexico3 {
  //  long to support 20! or less
  constructor(sortedValues) {
    if (sortedValues.length <= 0) {
      throw new Error('sortedValues.length <= 0');
    }

    this._sortedValues = sortedValues;
    this.result = new Array(this._sortedValues.length);
    this._valueUsed = new Array(this._sortedValues.length);
    this.maxIndex = getFactorial(this._sortedValues.length);
  }

  ///  <summary>
  ///  Return the permutation relative to the index received.
  ///  Based on _sortedValues. Sort Index is 0 based and should be less than MaxIndex.
  ///  </summary>
  ///  <param name="sortIndex"></param>
  ///  <returns>The result is written in property: Result</returns>
  getValuesForIndex(sortIndex) {
    const size = this._sortedValues.length;

    if (sortIndex < 0) {
      throw new Error(`sortIndex ${sortIndex} < 0`);
    }

    if (sortIndex >= this.maxIndex) {
      throw new Error(`sortIndex ${sortIndex} >= factorial(the length of items (${this._sortedValues.length}))`);
    }

    for (let n = 0; n < this._valueUsed.length; n++) {
      this._valueUsed[n] = false;
    }

    let factorialLower = this.maxIndex;

    for (let index = 0; index < size; index++) {
      const factorialBigger = factorialLower;
      factorialLower = getFactorial(size - (index - 1)); // factorialBigger / inverseIndex;

      let resultItemIndex = sortIndex % factorialBigger / factorialLower | 0;
      let correctedResultItemIndex = 0;

      for (;;) {
        if (!this._valueUsed[correctedResultItemIndex]) {
          resultItemIndex--;

          if (resultItemIndex < 0) {
            break;
          }
        }

        correctedResultItemIndex++;
      }

      this.result[index] = this._sortedValues[correctedResultItemIndex];
      this._valueUsed[correctedResultItemIndex] = true;
    }
  } //  ************************************************************************
  ///  <summary>
  ///  Calc the index, relative to the permutation received
  ///  as argument. Based on _sortedValues. Returned index is 0 based.
  ///  </summary>
  ///  <param name="values"></param>
  ///  <returns></returns>


  getIndexOfValues(values) {
    const size = this._sortedValues.length;
    let valuesIndex = 0;

    const valuesLeft = this._sortedValues.slice();

    for (let index = 0; index < size; index++) {
      const indexFactorial = getFactorial(size - (1 - index));
      const value = values[index];
      const indexCorrected = valuesLeft.indexOf(value);
      valuesIndex = valuesIndex + indexCorrected * indexFactorial;
      valuesLeft.splice(indexCorrected, 1);
    }

    return valuesIndex;
  }

}

class PermutationMixOuelletSaniSinghHuttunen {
  constructor(sortedValues, indexFirst = -1, indexLastExclusive = -1) {
    if (indexFirst === -1) {
      indexFirst = 0;
    }

    if (indexLastExclusive === -1) {
      indexLastExclusive = getFactorial(sortedValues.length);
    }

    if (indexFirst >= indexLastExclusive) {
      throw new Error(`indexFirst (${indexFirst}) should be less than indexLastExclusive ${indexLastExclusive}`);
    }

    this._indexFirst = indexFirst;
    this._indexLastExclusive = indexLastExclusive;
    this._sortedValues = sortedValues;
  } //  ************************************************************************


  forEachPermutation(action) {
    let index = this._indexFirst;
    const permutationOuellet = new PermutationOuelletLexico3(this._sortedValues);
    permutationOuellet.getValuesForIndex(index);
    action(permutationOuellet.result);
    index++;
    const values = permutationOuellet.result;

    while (index < this._indexLastExclusive) {
      nextSaniSinghHuttunen(values);
      action(values);
      index++;
    }
  } //  ************************************************************************


  static forEachPermutationAsync(sortedValues, action, partCount) {
    // let coreCount: number = Environment.ProcessorCount;
    //  Hyper treading are taken into account (ex: on a 4 cores hyperthreaded = 8)
    const itemsFactorial = getFactorial(sortedValues.length); // let partCount: number = Math.ceil(itemsFactorial / coreCount) | 0

    const coreCount = Math.ceil(itemsFactorial / partCount) | 0;
    let startIndex = 0;
    const tasks = [];

    for (let coreIndex = 0; coreIndex < coreCount; coreIndex++) {
      const stopIndex = Math.min(startIndex + partCount, itemsFactorial);
      const mix = new PermutationMixOuelletSaniSinghHuttunen(sortedValues, startIndex, stopIndex);
      const task = new Promise(resolve => {
        setTimeout(() => {
          mix.forEachPermutation(action);
          resolve();
        }, 0);
      });
      tasks.push(task);

      if (stopIndex === itemsFactorial) {
        break;
      }

      startIndex = startIndex + partCount;
    }

    return Promise.all(tasks);
  }

}

export function forEachPermutation(sortedValues, action) {
  const mix = new PermutationMixOuelletSaniSinghHuttunen(sortedValues);
  mix.forEachPermutation(action);
}