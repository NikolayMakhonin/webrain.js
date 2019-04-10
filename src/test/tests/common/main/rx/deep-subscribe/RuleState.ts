/* tslint:disable:no-shadowed-variable */
/* eslint-disable no-useless-escape,computed-property-spacing */
import {IRule, RuleType} from '../../../../../../main/common/rx/deep-subscribe/contracts/rules'
import {RuleBuilder} from '../../../../../../main/common/rx/deep-subscribe/RuleBuilder'
import {IRuleIterable, IRuleOrIterable, iterateRule} from '../../../../../../main/common/rx/deep-subscribe/RuleState'

declare const assert

describe('common > main > rx > deep-subscribe > RuleState', function() {
	function ruleToString(rule: IRule) {
		if (!rule) {
			return rule + ''
		}

		return `[${RuleType[rule.type]}]${rule.description ? ' ' + rule.description : ''}`
	}

	function *resolveRules(ruleOrIterable: IRuleOrIterable): Iterable<IRule> {
		if (!ruleOrIterable[Symbol.iterator]) {
			yield ruleOrIterable as IRule
			return
		}
		for (const rule of ruleOrIterable as IRuleIterable) {
			yield* resolveRules(rule)
		}
	}

	function rulesToString(rules: IRuleOrIterable) {
		return Array
			.from(resolveRules(rules))
			.map(o => ruleToString(o)).join('\n')
	}

	function rulesToObjectTree(ruleIterator: Iterator<IRuleOrIterable>): any {
		const iteration = ruleIterator.next()
		if (iteration.done) {
			return null
		}

		const ruleOrIterable = iteration.value
		let obj: any = {}

		if (ruleOrIterable[Symbol.iterator]) {
			for (const ruleIterable of ruleOrIterable as Iterable<IRuleOrIterable>) {
				if (ruleIterable[Symbol.iterator]) {
					Object.assign(obj, rulesToObjectTree(ruleIterable[Symbol.iterator]()))
				} else {
					Object.assign(obj, {[(ruleIterable as IRule).description]: null})
				}
			}
		} else {
			const rule = iteration.value as IRule
			obj = {[rule.description]: rulesToObjectTree(ruleIterator)}
		}

		return obj
	}

	it('path', function() {
		const builder = new RuleBuilder<any>()

		const result = iterateRule(
			builder
				.any(
					b => b.path(o => o.a1.a2.a3),
					b => b.path(o => o.b1.b2.b3),
				)
				// .path(o => o.prop1.prop2.prop3)
				.rule,
		)

		// console.log(rulesToString(result))

		const objectTree = rulesToObjectTree(result[Symbol.iterator]())

		console.log(JSON.stringify(objectTree, null, 4))
	})
})
