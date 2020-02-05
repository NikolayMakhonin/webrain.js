function f(a, b) {
	return a + b
}
function apply() {
	return f.apply(this, arguments)
}
function createCall() {
	const args = arguments
	return function (_this, func) {
		return func.call(_this, args)
	}
}
function createCall2(a, b, c, d, e, f, g, h, i, j, k) {
	switch (arguments.length) {
		case 0:
			return function (_this, func) {
				return func.call(_this)
			}
		case 1:
			return function (_this, func) {
				return func.call(_this, a)
			}
		case 2:
			return function (_this, func) {
				return func.call(_this, a, b)
			}
		case 3:
			return function (_this, func) {
				return func.call(_this, a, b, c)
			}
		case 4:
			return function (_this, func) {
				return func.call(_this, a, b, c, d)
			}
		case 5:
			return function (_this, func) {
				return func.call(_this, a, b, c, d, e)
			}
		case 6:
			return function (_this, func) {
				return func.call(_this, a, b, c, d, e, f)
			}
		case 7:
			return function (_this, func) {
				return func.call(_this, a, b, c, d, e, f, g)
			}
		case 8:
			return function (_this, func) {
				return func.call(_this, a, b, c, d, e, f, g, h)
			}
		case 9:
			return function (_this, func) {
				return func.call(_this, a, b, c, d, e, f, g, h, i)
			}
		case 10:
			return function (_this, func) {
				return func.call(_this, a, b, c, d, e, f, g, h, i, j)
			}
		case 11:
			return function (_this, func) {
				return func.call(_this, a, b, c, d, e, f, g, h, i, j, k)
			}
		default:
			return createCall.apply(this, arguments)
	}
}
const i = 0
let result
