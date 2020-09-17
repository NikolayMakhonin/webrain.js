/* tslint:disable:no-empty */
import { assert } from '../../../../../main/common/test/Assert';
import { it, xdescribe } from '../../../../../main/common/test/Mocha';
xdescribe('async behavior', function () {
  it('base', async function () {
    this.timeout(10000);

    const asyncImmediate = async func => {
      if (new Date().getTime() < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1));
        assert.fail();
      }

      return func ? func() : new Date().getTime() + Math.random();
    };

    const sync = func => {
      return func ? func() : new Date().getTime() + Math.random();
    };

    let result;

    const asyncFunc = async (func, awaitMode) => {
      switch (awaitMode) {
        case 'immediate':
          break;

        case 'after immediate async':
          if (!(await asyncImmediate())) {
            assert.fail();
          }

          break;

        case 'after await sync':
          if (!(await sync())) {
            assert.fail();
          }

          break;

        case 'after immediate promise':
          await new Promise(resolve => resolve());
          break;

        case 'in immediate async':
          return asyncImmediate(func);

        case 'in immediate promise':
          return new Promise(resolve => {
            func();
            resolve();
          });

        case 'in immediate promise then':
          return new Promise(resolve => resolve()).then(func);

        case 'in immediate async 2':
          result = await asyncImmediate(func);

          if (result === 'qwe') {
            assert.fail();
          }

          return result;

        case 'in immediate promise 2':
          result = await new Promise(resolve => {
            func();
            resolve();
          });

          if (result === 'qwe') {
            assert.fail();
          }

          return result;

        case 'after timeout 0':
          await new Promise(resolve => setTimeout(resolve, 0));
          break;

        case 'after timeout 1':
          await new Promise(resolve => setTimeout(resolve, 1));
          break;

        case 'in timeout 0':
          await new Promise(resolve => setTimeout(() => {
            func();
            resolve();
          }, 0));
          return null;

        case 'in timeout 1':
          await new Promise(resolve => setTimeout(() => {
            func();
            resolve();
          }, 1));
          return null;

        default:
          assert.fail('Unknown awaitMode: ' + awaitMode);
      }

      return func();
    };

    const test = async (shouldCallImmediate, ...awaitModes) => {
      for (let i = 0; i < awaitModes.length; i++) {
        const awaitMode = awaitModes[i];
        console.log(`shouldCallImmediate = ${shouldCallImmediate}; awaitMode = ${awaitMode}`);
        let call = false;
        const promise = asyncFunc(() => call = true, awaitMode);
        assert.strictEqual(call, shouldCallImmediate);
        await promise;
        assert.ok(call);
      }
    };

    await test(true, 'immediate', 'in immediate async', 'in immediate promise', 'in immediate async 2', 'in immediate promise 2');
    await test(false, 'after immediate async', 'after immediate promise', 'after timeout 0', 'after timeout 1', 'in timeout 0', 'in timeout 1', 'after await sync', 'in immediate promise then');
    console.log('Promise next then is not immediate');
    {
      let call;
      await new Promise(resolve => resolve()).then(() => {
        new Promise(resolve => resolve()).then(() => {
          assert.strictEqual(call, 1);
        });
        (async () => {})().then(() => {
          assert.strictEqual(call, 1);
        });
        call = 1;
        return 2;
      }).then(o => {
        call = o;
      });
      console.log('Promise lazy then');
      call = undefined;
      const promise = new Promise(resolve => resolve()).then(() => {
        call = true;
      });
      assert.strictEqual(call, undefined);
      await promise;
      assert.strictEqual(call, true);
      await new Promise(resolve => resolve());
      assert.strictEqual(call, true);
    }
  });
});