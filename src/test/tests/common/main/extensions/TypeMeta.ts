import {TypeMetaCollectionWithId} from '../../../../../main/common/extensions/TypeMeta'
import {assert} from '../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../main/common/test/Mocha'

describe('common > extensions > TypeMeta', function() {
	it('base', function() {
		class Class1 {}
		class Class2 extends Class1 {}

		const typeMeta0 = new TypeMetaCollectionWithId()
		const typeMeta1 = new TypeMetaCollectionWithId(typeMeta0)
		const typeMeta2 = new TypeMetaCollectionWithId(typeMeta1)
		const typeMeta3 = new TypeMetaCollectionWithId(typeMeta2)

		// region typeMeta0

		typeMeta0.putType(Class1, {uuid: 'class1'})
		assert.deepStrictEqual(typeMeta0.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta0.getType('class1'), Class1)

		assert.deepStrictEqual(typeMeta1.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta1.getType('class1'), Class1)

		assert.deepStrictEqual(typeMeta2.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta2.getType('class1'), Class1)

		assert.deepStrictEqual(typeMeta3.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta3.getType('class1'), Class1)

		// endregion

		// region typeMeta1

		typeMeta1.putType(Class1, {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta0.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta0.getType('class1'), Class1)
		assert.strictEqual(typeMeta0.getType('class2'), undefined)

		assert.deepStrictEqual(typeMeta1.getMeta(Class1), {uuid: 'class2'})
		assert.strictEqual(typeMeta1.getType('class1'), Class1)
		assert.strictEqual(typeMeta1.getType('class2'), Class1)

		assert.deepStrictEqual(typeMeta2.getMeta(Class1), {uuid: 'class2'})
		assert.strictEqual(typeMeta2.getType('class1'), Class1)
		assert.strictEqual(typeMeta2.getType('class2'), Class1)

		assert.deepStrictEqual(typeMeta3.getMeta(Class1), {uuid: 'class2'})
		assert.strictEqual(typeMeta3.getType('class1'), Class1)
		assert.strictEqual(typeMeta3.getType('class2'), Class1)

		// endregion

		// region typeMeta2

		typeMeta2.putType(Class2, {uuid: 'class1'})
		assert.deepStrictEqual(typeMeta0.getMeta(Class1), {uuid: 'class1'})
		assert.deepStrictEqual(typeMeta0.getMeta(Class2), undefined)
		assert.strictEqual(typeMeta0.getType('class1'), Class1)
		assert.strictEqual(typeMeta0.getType('class2'), undefined)

		assert.deepStrictEqual(typeMeta1.getMeta(Class1), {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta1.getMeta(Class2), undefined)
		assert.strictEqual(typeMeta1.getType('class1'), Class1)
		assert.strictEqual(typeMeta1.getType('class2'), Class1)

		assert.deepStrictEqual(typeMeta2.getMeta(Class1), {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta2.getMeta(Class2), {uuid: 'class1'})
		assert.strictEqual(typeMeta2.getType('class1'), Class2)
		assert.strictEqual(typeMeta2.getType('class2'), Class1)

		assert.deepStrictEqual(typeMeta3.getMeta(Class1), {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta3.getMeta(Class2), {uuid: 'class1'})
		assert.strictEqual(typeMeta3.getType('class1'), Class2)
		assert.strictEqual(typeMeta3.getType('class2'), Class1)

		// endregion

		// region typeMeta3

		typeMeta3.putType(Class2, {uuid: 'class2_'})
		typeMeta3.putType(Class2, {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta0.getMeta(Class1), {uuid: 'class1'})
		assert.deepStrictEqual(typeMeta0.getMeta(Class2), undefined)
		assert.strictEqual(typeMeta0.getType('class1'), Class1)
		assert.strictEqual(typeMeta0.getType('class2'), undefined)

		assert.deepStrictEqual(typeMeta1.getMeta(Class1), {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta1.getMeta(Class2), undefined)
		assert.strictEqual(typeMeta1.getType('class1'), Class1)
		assert.strictEqual(typeMeta1.getType('class2'), Class1)

		assert.deepStrictEqual(typeMeta2.getMeta(Class1), {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta2.getMeta(Class2), {uuid: 'class1'})
		assert.strictEqual(typeMeta2.getType('class1'), Class2)
		assert.strictEqual(typeMeta2.getType('class2'), Class1)

		assert.deepStrictEqual(typeMeta3.getMeta(Class1), {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta3.getMeta(Class2), {uuid: 'class2'})
		assert.strictEqual(typeMeta3.getType('class1'), Class2)
		assert.strictEqual(typeMeta3.getType('class2'), Class2)

		// endregion

		// region typeMeta2 after delete

		typeMeta3.deleteType(Class2)
		typeMeta3.deleteType(Class2)
		assert.deepStrictEqual(typeMeta0.getMeta(Class1), {uuid: 'class1'})
		assert.deepStrictEqual(typeMeta0.getMeta(Class2), undefined)
		assert.strictEqual(typeMeta0.getType('class1'), Class1)
		assert.strictEqual(typeMeta0.getType('class2'), undefined)

		assert.deepStrictEqual(typeMeta1.getMeta(Class1), {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta1.getMeta(Class2), undefined)
		assert.strictEqual(typeMeta1.getType('class1'), Class1)
		assert.strictEqual(typeMeta1.getType('class2'), Class1)

		assert.deepStrictEqual(typeMeta2.getMeta(Class1), {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta2.getMeta(Class2), {uuid: 'class1'})
		assert.strictEqual(typeMeta2.getType('class1'), Class2)
		assert.strictEqual(typeMeta2.getType('class2'), Class1)

		assert.deepStrictEqual(typeMeta3.getMeta(Class1), {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta3.getMeta(Class2), {uuid: 'class1'})
		assert.strictEqual(typeMeta3.getType('class1'), Class2)
		assert.strictEqual(typeMeta3.getType('class2'), Class1)

		// endregion

		// region typeMeta1 after delete

		typeMeta2.deleteType('class1')
		typeMeta2.deleteType('class1')
		assert.deepStrictEqual(typeMeta0.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta0.getType('class1'), Class1)
		assert.strictEqual(typeMeta0.getType('class2'), undefined)

		assert.deepStrictEqual(typeMeta1.getMeta(Class1), {uuid: 'class2'})
		assert.strictEqual(typeMeta1.getType('class1'), Class1)
		assert.strictEqual(typeMeta1.getType('class2'), Class1)

		assert.deepStrictEqual(typeMeta2.getMeta(Class1), {uuid: 'class2'})
		assert.strictEqual(typeMeta2.getType('class1'), Class1)
		assert.strictEqual(typeMeta2.getType('class2'), Class1)

		assert.deepStrictEqual(typeMeta3.getMeta(Class1), {uuid: 'class2'})
		assert.strictEqual(typeMeta3.getType('class1'), Class1)
		assert.strictEqual(typeMeta3.getType('class2'), Class1)

		// endregion

		// region typeMeta0 after delete

		typeMeta1.deleteType(Class1)
		assert.deepStrictEqual(typeMeta0.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta0.getType('class1'), Class1)

		assert.deepStrictEqual(typeMeta1.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta1.getType('class1'), Class1)

		assert.deepStrictEqual(typeMeta2.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta2.getType('class1'), Class1)

		assert.deepStrictEqual(typeMeta3.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta3.getType('class1'), Class1)

		// endregion

		// region after delete all

		typeMeta0.deleteType('class1')
		assert.deepStrictEqual(typeMeta0.getMeta(Class1), undefined)
		assert.deepStrictEqual(typeMeta0.getMeta(Class2), undefined)
		assert.strictEqual(typeMeta0.getType('class1'), undefined)
		assert.strictEqual(typeMeta0.getType('class2'), undefined)

		assert.deepStrictEqual(typeMeta1.getMeta(Class1), undefined)
		assert.deepStrictEqual(typeMeta1.getMeta(Class2), undefined)
		assert.strictEqual(typeMeta1.getType('class1'), undefined)
		assert.strictEqual(typeMeta1.getType('class2'), undefined)

		assert.deepStrictEqual(typeMeta2.getMeta(Class1), undefined)
		assert.deepStrictEqual(typeMeta2.getMeta(Class2), undefined)
		assert.strictEqual(typeMeta2.getType('class1'), undefined)
		assert.strictEqual(typeMeta2.getType('class2'), undefined)

		assert.deepStrictEqual(typeMeta3.getMeta(Class1), undefined)
		assert.deepStrictEqual(typeMeta3.getMeta(Class2), undefined)
		assert.strictEqual(typeMeta3.getType('class1'), undefined)
		assert.strictEqual(typeMeta3.getType('class2'), undefined)

		// endregion
	})
})
