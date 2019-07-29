import assert from 'assert'
import { func1, var1 } from './src/module1';
import module1 from './src/module1';
import { var2 as var22 } from './src/module2';
import module2 from './src/module2';

describe('env', function() {
    describe('modules', function() {
        it('babel', function(done) {
            var func1Str = func1.toString().replace(/\s+/g, " ");
            assert.ok(func1Str);
            assert.equal(func1("qwe", [1,2]), "qwe 1");
            assert.equal(func1("qwe", 1, 2), "qwe 2");
            assert.equal(func1("qwe"), "qwe 0");
            assert.ok(func1Str.indexOf("function func1(p1)") >= 0, "babel is not worked");
            assert.ok(func1Str.indexOf("arguments.length") >= 0, "babel is not worked");
            //console.log(func1.toString());
            done();
        });
        it('import/export', function(done) {
            assert.equal(var1, "var1");
            assert.equal(module1.func1, func1);
            assert.equal(module1.var_1_1, var1);
            assert.equal(module1.var_1_2, var1);
            assert.equal(var22, var1);
            assert.equal(module2.func1, func1);
            assert.equal(module2.var_2_1, var1);
            assert.equal(module2.var_2_2, var1);
            done();
        });
    });
});
