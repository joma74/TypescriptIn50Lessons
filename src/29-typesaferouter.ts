/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

import * as express from "express"
import { assert, IsExact } from "conditional-type-checks"

/**
 * Generic Tips Part 2: Intersect what you have with whatever TypeScript wants
 * https://effectivetypescript.com/2020/12/09/gentips-2-intersect/
 * Generic Tips Part 1: Use Classes and Currying to create new inference sites
 * https://effectivetypescript.com/2020/12/04/gentips-1-curry/
 *
 */

export interface Endpoint<Request, Response> {
	request: Request
	response: Response
}

export type GetEndpoint<Response> = Endpoint<null, Response>

export type HTTPVerb = "get" | "post" | "put" | "delete" | "patch"

export interface APISpec {
	[path: string]: {
		[method in HTTPVerb]?: Endpoint<any, any>
	}
}

export interface User {
	id: string
	name: string
	age: number
}

export type CreateUserRequest = Pick<User, "name" | "age">

export interface API {
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

type ApiPaths<A> = Extract<keyof A, string>

declare let app: express.Router
declare function getUserById(userId: string): Promise<User>

assert<IsExact<ReturnType<typeof getUserById>, Promise<User>>>(true)
assert<IsExact<Parameters<typeof getUserById>, [string]>>(true)

/**
 * As "Use Classes and Currying to create new inference sites" explained, you can either use
 * a class or a curried function to capture the API type parameter.
 *
 * But what about that return type of the handler => Promise<unknown>? Really you'd like to
 * look it up from the API interface given Path.
 */
class TypedRouter1<API> {
	constructor(private router: express.Router) {}
	get<Path extends ApiPaths<API>>(
		path: Path,
		handler: (params: ExtractRouteParams<Path>) => Promise<unknown>,
	) {
		this.router.get(path, (request, response) => {
			handler(request.params as any).then((obj) => response.json(obj))
		})
	}
}

const typedRouter1 = new TypedRouter1<API>(app)
typedRouter1.get("/users/:userId", async (params) => getUserById(params.userId))

/**
 * Here's how you'd do that with a type alias:
 */
type Response = API["/users/:userId"]["get"]["response"] // (ok) type Response = User

class TypedRouter2<API> {
	constructor(private router: express.Router) {}
	get<Path extends ApiPaths<API>>(
		path: Path,
		handler: (
			params: ExtractRouteParams<Path>,
		) => Promise<API[Path]["get"]["response"]>,
		/**
		 * (nok) Type 'Path' cannot be used to index type 'API'.ts(2536)
		 * (nok) Type '"get"' cannot be used to index type 'API[Path]'.ts(2536)
		 * (nok) Type '"response"' cannot be used to index type 'API[Path]["get"]'.ts(2536)
		 **/
	) {
		this.router.get(path, (request, response) => {
			handler(request.params as any).then((obj) => response.json(obj))
		})
	}
}

class TypedRouter3<API> {
	constructor(private router: express.Router) {}
	get<Path extends ApiPaths<API>>(
		path: Path,
		handler: (
			params: ExtractRouteParams<Path>,
		) => Promise<API[Path]["get"]["response"]>,
		/**
		 * (nok) Type '"get"' cannot be used to index type 'API[Path]'.ts(2536)
		 * (nok) Type '"response"' cannot be used to index type 'API[Path]["get"]'.ts(2536)
		 **/
	) {
		this.router.get(path, (request, response) => {
			handler(request.params as any).then((obj) => response.json(obj))
		})
	}
}

class TypedRouter4<API> {
	constructor(private router: express.Router) {}
	get<Path extends ApiPaths<API>>(
		path: Path,
		handler: (
			params: ExtractRouteParams<Path>,
		) => Promise<
			API[Path]["get" & keyof API[Path]]["response" &
				keyof API[Path]["get" & keyof API[Path]]]
		>,
	) {
		this.router.get(path, (request, response) => {
			handler(request.params as any).then((obj) => response.json(obj))
		})
	}
}

declare function getUserByIdBad(
	userId: string,
): Promise<{
	id: string
	name: string
}>

const typedRouter4 = new TypedRouter4<API>(app)
typedRouter4.get("/users/:userId", async (params) => getUserById(params.userId)) // (ok)
typedRouter4.get("/user/:userId", async (params) => getUserById(params.userId)) // (ok) Argument of type '"/user/:userId"' is not assignable to parameter of type 'keyof API'.ts(2345)
typedRouter4.get("/users/:userId", async (params) => getUserById(params.user)) // (ok) Property 'user' does not exist on type '{ userId: string; }'.ts(2339)
typedRouter4.get("/users/:userId", async (params) =>
	getUserByIdBad(params.userId),
) // (ok) Type 'Promise<{ id: string; name: string; }>' is not assignable to type 'Promise<User>'.

/**
 * This is like T[K] except that it doesn't require evidence that K is actually a key of T.
 * If it's not, it will resolve to never.
 */
type LensOver1<T, K> = T[K] // (ok) Type 'K' cannot be used to index type 'T'.ts(2536)
type LensOver<T, K> = T[K & keyof T]

type endpoint_1 = LensOver<API["/users/:userId"], "bla"> // (ok) type endpoint_1 = never
type endpoint_2 = LensOver<API["/users/:userId"], "get"> // (ok) type endpoint_2 = Endpoint<null, User>
type response_endpoint_2 = LensOver<endpoint_2, "response"> // (ok) type response_endpoint_2 = User

class TypedRouter5<API> {
	constructor(private router: express.Router) {}
	get<Path extends Extract<keyof API, string>>(
		path: Path,
		handler: (
			params: ExtractRouteParams<Path>,
		) => Promise<LensOver<LensOver<API[Path], "get">, "response">>,
	) {
		this.router.get(path, (request, response) => {
			handler(request.params as any).then((obj) => response.json(obj))
		})
	}
}

// type DrillByKey<T extends object, U extends any[]
// type test_variadic_1 = DrillByKey<API["/users/:userId"], ["get", "response"]>

const typedRouter5 = new TypedRouter5<API>(app)
typedRouter5.get("/users/:userId", async (params) => getUserById(params.userId)) // (ok)
typedRouter5.get("/user/:userId", async (params) => getUserById(params.userId)) // (ok) Argument of type '"/user/:userId"' is not assignable to parameter of type 'keyof API'.ts(2345)
typedRouter5.get("/users/:userId", async (params) => getUserById(params.user)) // (ok) Property 'user' does not exist on type '{ userId: string; }'.ts(2339)
typedRouter5.get("/users/:userId", async (params) =>
	getUserByIdBad(params.userId),
) // (ok) Type 'Promise<{ id: string; name: string; }>' is not assignable to type 'Promise<User>'.ts(2322)
