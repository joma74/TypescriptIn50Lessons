/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

import * as express from "express"

/**
 * Generic Tips Part 2: Intersect what you have with whatever TypeScript wants(https://effectivetypescript.com/2020/12/09/gentips-2-intersect/)
 * Generic Tips Part 1: Use Classes and Currying to create new inference sites(https://effectivetypescript.com/2020/12/04/gentips-1-curry/)
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

/**
 * As "Use Classes and Currying to create new inference sites" explained, you can either use
 * a class or a curried function to capture the API type parameter.
 */
class TypedRouter<API> {
	constructor(private router: express.Router) {}
	get<Path extends string>(path: Path) {}
}

/**
 * Usage
 */
const typedRouter = new TypedRouter<API>(app)
typedRouter.get("/users/:userId", async (params) => getUserById(params.userId))
