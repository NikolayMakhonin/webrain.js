/* tslint:disable:no-identical-functions no-shadowed-variable */
import { webrainOptions } from '../../../../../../../main/common/helpers/webrainOptions';
import { describe, it } from '../../../../../../../main/common/test/Mocha';
import { baseTest, lazyTest } from '../src/base-tests';
import { clearCallStates } from '../src/helpers';
import { createPerceptron } from '../src/perceptron';
describe('common > main > rx > depend > base', function () {
  beforeEach(function () {
    webrainOptions.callState.garbageCollect.disabled = true;
  });
  it('base', async function () {
    this.timeout(20000);
    await baseTest();
    clearCallStates();
  });
  it('lazy', async function () {
    this.timeout(20000);
    await lazyTest();
    clearCallStates();
  });
  it('perceptron', function () {
    this.timeout(20000);
    const {
      countFuncs,
      input,
      inputState,
      output
    } = createPerceptron(50, 50);
    clearCallStates();
  });
});