import {TypeMetaCollection} from '../../../../../main/common/serialization/TypeMeta'

declare const assert

describe('common > serialization > TypeMeta', function() {
	it('base', function() {
		class Class1 {}
		class Class2 extends Class1 {}

		const typeMeta0 = new TypeMetaCollection()
		const typeMeta1 = new TypeMetaCollection(typeMeta0)
		const typeMeta2 = new TypeMetaCollection(typeMeta1)
		const typeMeta3 = new TypeMetaCollection(typeMeta2)

		typeMeta0.putType(Class1, {uuid: 'class1'})
		assert.deepStrictEqual(typeMeta0.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta0.getType('class1'), Class1)

		assert.deepStrictEqual(typeMeta1.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta1.getType('class1'), Class1)

		assert.deepStrictEqual(typeMeta2.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta2.getType('class1'), Class1)

		assert.deepStrictEqual(typeMeta3.getMeta(Class1), {uuid: 'class1'})
		assert.strictEqual(typeMeta3.getType('class1'), Class1)

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

		typeMeta2.putType(Class2, {uuid: 'class1'})
		assert.deepStrictEqual(typeMeta0.getMeta(Class1), {uuid: 'class1'})
		assert.deepStrictEqual(typeMeta0.getMeta(Class2), {uuid: 'class1'})
		assert.strictEqual(typeMeta0.getType('class1'), Class1)
		assert.strictEqual(typeMeta0.getType('class2'), undefined)

		assert.deepStrictEqual(typeMeta1.getMeta(Class1), {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta1.getMeta(Class2), {uuid: 'class2'})
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

		typeMeta3.putType(Class2, {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta0.getMeta(Class1), {uuid: 'class1'})
		assert.deepStrictEqual(typeMeta0.getMeta(Class2), {uuid: 'class1'})
		assert.strictEqual(typeMeta0.getType('class1'), Class1)
		assert.strictEqual(typeMeta0.getType('class2'), undefined)

		assert.deepStrictEqual(typeMeta1.getMeta(Class1), {uuid: 'class2'})
		assert.deepStrictEqual(typeMeta1.getMeta(Class2), {uuid: 'class2'})
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
	})
})
