/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * https://typescript-exercises.github.io/#exercise=14&file=%2Findex.ts
 */

interface MapperFunc<I, O> {
	(): MapperFunc<I, O>
	(subInput: I[]): O[]
}
interface MapFunc {
	(): MapFunc
	<I, O>(mapper: (item: I) => O): MapperFunc<I, O>
	<I, O>(mapper: (item: I) => O, input: I[]): O[]
}

/**
 * 2 arguments passed: returns a new array
 * which is a result of input being mapped using
 * the specified mapper.
 *
 * 1 argument passed: returns a function which accepts
 * an input and returns a new array which is a result
 * of input being mapped using original mapper.
 *
 * 0 arguments passed: returns itself.
 *
 * @param {Function} mapper
 * @param {Array} input
 * @return {Array | Function}
 */
const map = function bla<I, O>(mapper?: (item: I) => O, input?: I[]) {
	if (arguments.length === 0) {
		return bla
	}
	if (arguments.length === 1) {
		const subFunction = function (subInput?: I[]) {
			if (arguments.length === 0) {
				return subFunction
			}
			return subInput!.map(mapper!)
		} as MapperFunc<I, O>
		return subFunction
	}
	return input!.map(mapper!)
} as MapFunc

const mapResult1 = map()(String)()([1, 2, 3]) // (ok) const mapResult1: string[]
const mapResult2 = map(Boolean)([true, false]) // (ok) const mapResult2: boolean[]

interface FiltererFunc<I> {
	(): FiltererFunc<I>
	(subInput: I[]): I[]
}
interface FilterFunc {
	(): FilterFunc
	<I>(filterer: (item: I) => boolean): FiltererFunc<I>
	<I>(filterer: (item: I) => boolean, input: I[]): I[]
}

/**
 * 2 arguments passed: returns a new array
 * which is a result of input being filtered using
 * the specified filter function.
 *
 * 1 argument passed: returns a function which accepts
 * an input and returns a new array which is a result
 * of input being filtered using original filter
 * function.
 *
 * 0 arguments passed: returns itself.
 *
 * @param {Function} filterer
 * @param {Array} input
 * @return {Array | Function}
 */
const filter = function bla<I>(filterer?: (item: I) => boolean, input?: I[]) {
	if (arguments.length === 0) {
		return bla
	}
	if (arguments.length === 1) {
		const subFunction = function (subInput?: I[]) {
			if (arguments.length === 0) {
				return subFunction
			}
			return subInput!.filter(filterer!)
		} as FiltererFunc<I>
		return subFunction
	}
	return input!.filter(filterer!)
} as FilterFunc

const filterResult1 = filter()((n: number) => n !== 0)()([0, 1, 2]) // (ok) const filterResult1: number[]
const filterResult2 = filter(Boolean, [0, 1, 2]) // (ok) const filterResult2: number[]

interface ArithmeticArgFunc {
	(): ArithmeticArgFunc
	(b: number): number
}

interface ArithmeticFunc {
	(): ArithmeticFunc
	(a: number): ArithmeticArgFunc
	(a: number, b: number): number
}

/**
 * 3 arguments passed: reduces input array it using the
 * specified reducer and initial value and returns
 * the result.
 *
 * 2 arguments passed: returns a function which accepts
 * input array and reduces it using previously specified
 * reducer and initial value and returns the result.
 *
 * 1 argument passed: returns a function which:
 *   * when 2 arguments is passed to the subfunction, it
 *     reduces the input array using specified initial
 *     value and previously specified reducer and returns
 *     the result.
 *   * when 1 argument is passed to the subfunction, it
 *     returns a function which expects the input array
 *     and reduces the specified input array using
 *     previously specified reducer and inital value.
 *   * when 0 argument is passed to the subfunction, it
 *     returns itself.
 *
 * 0 arguments passed: returns itself.
 */
const add = function bla(a?: number, b?: number) {
	if (arguments.length === 0) {
		return bla
	}
	if (arguments.length === 1) {
		const subFunction = function (bSub?: number) {
			if (arguments.length === 0) {
				return subFunction
			}
			return a! + bSub!
		} as ArithmeticArgFunc
		return subFunction
	}
	return a! + b!
} as ArithmeticFunc

const addResult1 = add()(1)()(2)
const addResult2 = add(1, 2)

/**
 * Keys in typescript are literals, hence string is not sufficient
 */
interface PropObjFunc<K extends string> {
	(): PropObjFunc<K>
	<O extends { [key in K]: O[key] }>(obj: O): O[K]
}

interface PropVFunc {
	(): PropVFunc
	<K extends string>(propName: K): PropObjFunc<K>
	<O, K extends keyof O>(propName: K, obj: O): O[K]
}

/**
 * 2 arguments passed: returns value of property
 * propName of the specified object.
 *
 * 1 argument passed: returns a function which expects
 * obj and returns value of property propName
 * of the specified object.
 *
 * 0 arguments passed: returns itself.
 *
 * @param {Object} obj
 * @param {String} propName
 * @return {* | Function}
 */
const propv = function bla<O, K extends keyof O & string>(
	propName?: K,
	obj?: O,
) {
	if (arguments.length === 0) {
		return bla
	}
	if (arguments.length === 1) {
		return function subFunction(subPropName: K) {
			if (arguments.length === 0) {
				return subFunction
			}
			return obj![subPropName]
		} as PropObjFunc<K>
	}
	return obj![propName!]
} as PropVFunc

const propNameInSubFunc = propv()("x")
const propResult1 = propNameInSubFunc()({ x: 1, y: "Hello" }) // (ok) const propResult1: number
const propResult2 = propv("y", { x: 1, y: "Hello" }) // (ok) const propResult2: string
const propResult3 = propv("z")({ x: 1, y: "Hello" }) // (ok) Object literal may only specify known properties, and 'x' does not exist in type '{ z: unknown; }'.ts(2345)
