import assert from 'assert'
import { mergeArrays } from '../src/merger';
import Merge from '../src/merger';

describe('merger', function() {
    describe('#mergeArrays()', function() {
        var test = function(original, versions, expected) {
            var result = Merge.mergeArrays(original, versions);
            assert.equal(result, expected);
        }

        it('import/export/babel', function(done) {
            //mergeArrays(1,2,3);
            //test([1,2,3,4], [[1,2,'a',4], [1,2,'b',4]], [1,2,'b',4]);
            done();
        });
    });
});
