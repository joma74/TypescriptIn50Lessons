/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * Generic Tips Part 1: Use Classes and Currying to create new inference sites(https://effectivetypescript.com/2020/12/04/gentips-1-curry/)
 */

interface Endpoint<Request, Response> {
	request: Request
	response: Response
}

type GetEndpoint<Response> = Endpoint<null, Response>

type HTTPVerb = "get" | "post" | "put" | "delete" | "patch"

interface APISpec {
	[path: string]: {
		[method in HTTPVerb]?: Endpoint<any, any>
	}
}

interface User {
	id: string
	name: string
	age: number
}

type CreateUserRequest = Pick<User, "name" | "age">

type RecordSKeys<K extends string, T> = {
	[P in K]: T
} // NOK

type APIType = [string[], object[]] // NOK

interface API {
	"/users": {
		/** Get the full list of users */
		get: GetEndpoint<{ users: User[] }>
		/** Create a new user */
		post: Endpoint<CreateUserRequest, User>
	}
	"/users/:userId": {
		get: GetEndpoint<User>
		/** Edit an existing user */
		patch: Endpoint<Partial<CreateUserRequest>, User>
		put: Endpoint<{ name?: string; age?: number }, User>
		delete: Endpoint<{}, User>
	}
}

type ExtractRouteParams<
	Route extends string
> = Route extends `${infer Start}:${infer Param}/${infer Rest}` // 3rd form
	? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
	: Route extends `${infer Start}:${infer Param}`
	? { [k in Param]: string }
	: {} // 1st form

type apiK = keyof API
type ApiPaths = Extract<apiK, string> // (ok) type Path = "/users/:userId" | "/users"

declare function getUrl<API, Path extends ApiPaths>(
	path: Path,
	params: ExtractRouteParams<Path>,
): string

/**
 * Unfortunately, when you try to use this, you'll get an unexpected error.
 * The problem is that type inference in TypeScript is all or nothing:
 * - either you can let TS infer all the type parameters from usage,
 * - or you can specify all of them explicitly.
 */
getUrl<API>("/users/:userId", { userId: "bob" }) // (ok) Expected 2 type arguments, but got 1.ts(2558)

/**
 * So it would seem the only solution here is to write the Path type explicitly.
 * We need to somehow separate the place where we write the type parameter (API)
 * from the place where we infer it.
 */
getUrl<API, "/users/:userId">("/users/:userId", { userId: "bob" }) // ok

/**
 * With Classes
 * TypeScript has one very familiar tool to introduce a new inference site: classes.
 * What used to be a function that needed two generic type parameters is now a class
 * with one generic type (that you specify explicitly) and a method with one generic
 * type (that's inferred).
 */
declare class URLMaker<API> {
	getUrl<Path extends ApiPaths>(
		path: Path,
		params: ExtractRouteParams<Path>,
	): string
}
const urlMaker = new URLMaker<API>()
const test1_1 = urlMaker.getUrl("/users/:userId", { userId: "bob" }) // (ok)
const test1_2 = urlMaker.getUrl("/users/:userId/profile", { userId: "bob" }) // (ok) Argument of type '"/users/:userId/profile"' is not assignable to parameter of type 'ApiPaths'.ts(2345)
const test1_3 = urlMaker.getUrl("/users/:userId", { user: "bob" }) // (ok) Argument of type '{ user: string; }' is not assignable to parameter of type '{ userId: string; }'.

/**
 * With Currying
 * Currying gives us the flexibility we need to introduce as many inference sites as
 * we like. Each function can infer new generic parameters.
 */
declare function getUrl2<API>(): <Path extends ApiPaths>(
	path: Path,
	params: ExtractRouteParams<Path>,
) => string

const test2_1 = getUrl2()("/users/:userId", { userId: "bob" }) // (ok)
const test2_2 = getUrl2()("/users/:userId/profile", { userId: "bob" }) // (ok) Argument of type '"/users/:userId/profile"' is not assignable to parameter of type 'ApiPaths'.ts(2345)
const test2_3 = getUrl2()("/users/:userId", { user: "bob" }) // (ok) Argument of type '{ user: string; }' is not assignable to parameter of type '{ userId: string; }'.

/**
 * Usage
 * Function to construct URLs for API endpoints. Checks
 * - endpoint exists
 * - proper given path parameters and type
 */
// Correct usage, returns '/users/bob'
const url = getUrl<API>("/users/:userId", { userId: "bob" }) // (nok)
// Incorrect usage; these should be errors:
// endpoint doesn't exist
getUrl<API>("/users/:userId/profile", { userId: "bob" })
// should be userId, not user
getUrl<API>("/users/:userId", { user: "bob" })
