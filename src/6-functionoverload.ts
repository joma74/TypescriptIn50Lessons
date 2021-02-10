/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

type Result = {
	title: string
	url: string
	abstract: string
}

/**
 * Lesson 20: Function Overloading
 *
 * It isn’t that uncommon in JavaScript to have functions that take differently
 * typed arguments at different positions.
 *
 * In Typescript, instead of having multiple implementations, you have one
 * implementation, but more types.
 *
 * After the function declarations, we need the actual function that
 * implements our function. The function head has to be very special:
 * the argument list has to encompass all argument lists from all function
 * overloads above. Since most of the arguments are different, we use any or
 * unknown to type them.
 *
 * What strikes me is that the overloaded second position parameter,
 * tags? and callback, should be mapped to the weaker cardiniality "optional".
 *
 * I noted that Typescript shows errors for the function heads, which are
 * resolved only after the implementation body matches fulfillment:
 * This overload signature is not compatible with its implementation signature.ts(2394)
 */

function search(term: string, tags?: string[]): Promise<Result[]>
function search(
	term: string,
	callback: (results: Result[]) => void,
	tags?: string[],
): void
function search(term: string, p2?: unknown, p3?: string[]) {
	// We only have a function if p2 is a callback
	const callback = typeof p2 === "function" ? p2 : undefined
	// We have tags if p2 is defined and an array, or if p3 is defined and an array
	const tags =
		typeof p2 !== "undefined" && Array.isArray(p2)
			? p2
			: typeof p3 !== "undefined" && Array.isArray(p3)
			? p3
			: undefined
	let queryString = `?query=${term}`
	// check if tags is defined AND are an array
	if (tags && tags.length) {
		queryString += `&tags=${tags.join}`
	}
	// actual fetching of results
	const results = fetch(`/search${queryString}`).then((response) =>
		response.json(),
	) as Promise<Result[]>

	if (callback) {
		/**
		 * https://fettblog.eu/void-in-javascript-and-typescript/
		 *
		 * Since void always returns undefined, and void always evaluates
		 * the expression next to it, you have a very terse way of returning
		 * from a function without returning a value, but still calling a
		 * callback for example.
		 * When your function is always supposed to return undefined, you
		 * can make sure that this is always the case.
		 */
		return void results.then((res) => callback(res))
	} else {
		// As described in the first function overload
		return results
	}
}

type SearchOverloadFn = typeof search

/**
 *
 * Fix|Evaluate: Type '(term: string, p2?: string[] | ((results: Result[]) => void) | undefined, p3?: string[] | undefined) => void'
 * is not assignable to
 * type '{ (term: string, tags?: string[] | undefined): Promise<Result[]>; (term: string, callback: (results: Result[]) => void, tags?: string[] | undefined): void; }'.
 * Type 'void' is not assignable to type 'Promise<Result[]>'.ts(2322)
 */
const searchWithOverloads: SearchOverloadFn = (
	term: string,
	p2?: string[] | ((results: Result[]) => void),
	p3?: string[],
) => {
	// We only have a function if p2 is a callback
	const callback = typeof p2 === "function" ? p2 : undefined
	// We have tags if p2 is defined and an array, or if p3 is defined and an array
	const tags =
		typeof p2 !== "undefined" && Array.isArray(p2)
			? p2
			: typeof p3 !== "undefined" && Array.isArray(p3)
			? p3
			: undefined
	let queryString = `?query=${term}`
	// check if tags is defined AND is an array
	if (tags && tags.length) {
		queryString += `&tags=${tags.join}`
	}
	// actual fetching of results
	const results = fetch(`/search${queryString}`).then((response) =>
		response.json(),
	) as Promise<Result[]>

	if (callback) {
		return void results.then((res) => callback(res))
	} else {
		// As described in the first function overload
		return results
	}
}
