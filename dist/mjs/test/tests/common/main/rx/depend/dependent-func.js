/* tslint:disable:no-identical-functions no-shadowed-variable */
import { describe, it } from '../../../../../../main/common/test/Mocha';
import { baseTest, createPerceptron } from './src/helpers';
describe('common > main > rx > depend > dependent-func', function () {
  it('base', async function () {
    await baseTest();
  });
  it('perceptron', function () {
    this.timeout(20000);
    const {
      countFuncs,
      input,
      inputState,
      output
    } = createPerceptron(50, 50);
  });
});