/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

type Result = {
	title: string
	url: string
	abstract: string
}

/**
 * Typing Function Heads
 *
 * We use the declare keyword to make the function available without
 * implementing a function body at the moment.
 */
declare function search(query: string, tags?: string[]): Result[]

search("Ember")
search("Ember", ["JavaScript"])

/**
 * Lesson 16: Callbacks
 *
 * We can get the function’s type most easily by calling typeof
 */
type SearchFnAa = typeof search

/**
 * Or type a function head seperately
 */
type SearchFnA = (query: string, tags?: string[]) => Promise<Result[]>

/**
 * Explicit return type with function head
 */
function searchB(query: string, tags?: string[]): Promise<Result[]> {
	return fetch(`search${query}`).then((rs) => rs.json())
}

/**
 * Function Types in Functions
 *
 * We can get the function’s type most easily by calling typeof
 */
type SearchFnB = typeof searchB

/**
 * Explicit return type with type cast
 */
function searchC(query: string, tags?: string[]) {
	return fetch(`search${query}`).then((rs) => rs.json() as Promise<Result[]>)
}

// We can get the function’s type most easily by calling typeof :
type SearchFnC = typeof searchC

/**
 * And types are composable, so we can define the function type for assemble at
 * a different position.
 */
type AssemblFn = (includeTags: boolean) => string

type SearchParams = { query: string; tags?: string; assemble: AssemblFn }

/**
 * Let’s say we want to have our search function be pluggable, and want to create
 * different search functions for different scenarios.
 */
declare function displaySearch(
	inputId: string,
	outputId: string,
	search: SearchFnA,
): void

const testSearchA: SearchFnA = function (query, tags) {
	const results: Result[] = [
		{
			title: `The ${query} test book`,
			url: ` / ${query} - design - patterns`,
			abstract: `A practical book on ${query} `,
		},
	]
	return Promise.resolve(results)
}

testSearchA("query")
testSearchA("query", ["a tag"])

/**
 * TypeScript has a structural type system. This also applies to functions:
 * the shape has to be intact.
 *
 * Function shapes, however, work a little differently:
 * Structure and shape aren’t defined by the names of arguments as in objects, but
 * by the order of arguments. This means we can rename our parameters and still
 * retain types.
 */
const testSearchB: SearchFnA = function (term, options) {
	const results: Result[] = [
		{
			title: `The ${term} test book`,
			url: ` / ${term} - design - patterns`,
			abstract: `A practical book on ${term} `,
		},
	]
	return Promise.resolve(results)
}

testSearchB("term")
testSearchB("term", ["an option"])

/**
 * Lesson 17: Substitutability
 *
 * And we can also completely remove the optional parameter tags (the string array)
 *  if we don’t have any use for it:
 */
const testSearchC: SearchFnA = function (term) {
	const results: Result[] = [
		{
			title: `The ${term} test book`,
			url: ` / ${term} - design - patterns`,
			abstract: `A practical book on ${term} `,
		},
	]
	return Promise.resolve(results)
}

testSearchC("term")
testSearchC("term", ["an option never used"])

/**
 * We can also drop arguments entirely if we don’t have any use for them.
 */
const testSearchD: SearchFnA = function () {
	const results: Result[] = [
		{
			title: `The test book`,
			url: ` / - design - patterns`,
			abstract: `A practical book`,
		},
	]
	return Promise.resolve(results)
}

/**
 * In JavaScript, we can call a function with any amount of parameters, no
 * matter how many we define in the function’s head.
 *
 * But, if a function signature requires us to pass arguments, TypeScript
 * will report an error if we don’t.
 *
 * Expected 1-2 arguments, but got 0.
 */
testSearchD()

/**
 * Inside displaySearch , testSearchD takes on the shape of SearchFn,
 * even though it does nothing with the parameters passed.
 *
 * TypeScript calls this behavior substitutability . We can substitute one
 * function signature for another if it makes sense. Leaving out parameters
 * if we don’t have any use for them inside the function body is OK.
 *
 * Substitutability works because the types of the return values stay the
 * same. In both testSearchD and testSearchA , we return a
 * promise with a result array. Passed parameters disappear the moment
 * we don’t need them anymore.
 */
displaySearch("input", "output", testSearchD)

/**
 * There are situations where we can also substitute the return type of
 * the function: when the return type is void.
 *
 * P.S. We add a callback as second parameter, as optional parameters
 * always have to be last.
 */
declare function searchWithCallbackA(
	query: string,
	callback: (results: Result[]) => void,
	tags?: string[],
): void

searchWithCallbackA("query", function (results) {
	console.log(results)
})

/**
 * But here’s the thing: we can also pass functions that have a
 * different return type. Inside the calling function, the return
 * type will be handled as undefined, which means you can’t do
 * anything with it that wouldn’t let TypeScript scream at
 * you with red underlines.
 */

searchWithCallbackA("query", function (results) {
	console.log(results)
	return 1
})

/**
 * If you really want to make sure that no value is returned, you
 * can put void in front of callback in plain JavaScript.
 *
 * @param query
 * @param callback
 */
const searchWithCallbackAImpl: typeof searchWithCallbackA = function (
	query,
	callback,
) {
	Promise.resolve({} as Promise<Result[]>).then(
		(results) => void callback(results),
	)
}

/**
 * Still types to
 * ```ts
 * const searchWithCallbackAImpl: (query: string, callback: (results: Result[]) => void, tags?: string[] | undefined) => void
 * ```
 */
searchWithCallbackAImpl("unused", (results) => {
	return "1"
})

/**
 * If you really want to make sure that no value is returned,
 * you can use undefined as a type.
 */
declare function searchWithCallbackB(
	query: string,
	callback: (results: Result[]) => undefined,
	tags?: string[],
): undefined

/**
 * Fails as we can’t substitute a return of undefined for a
 * return of number .
 *
 * Argument of type '(results: Result[]) => number' is not
 * assignable to parameter of type '(results: Result[]) => undefined'.
 * Type 'number' is not assignable to type 'undefined'.
 */
searchWithCallbackB("query", function (results) {
	console.log(results)
	return 1
})
