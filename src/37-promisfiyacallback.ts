/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * https://typescript-exercises.github.io/#exercise=10&file=%2Findex.ts
 */

/**
 * Given
 */

interface User {
	type: "user"
	name: string
	age: number
	occupation: string
}

interface Admin {
	type: "admin"
	name: string
	age: number
	role: string
}

type Person = User | Admin

const admins: Admin[] = [
	{ type: "admin", name: "Jane Doe", age: 32, role: "Administrator" },
	{ type: "admin", name: "Bruce Willis", age: 64, role: "World saver" },
]

const users: User[] = [
	{
		type: "user",
		name: "Max Mustermann",
		age: 25,
		occupation: "Chimney sweep",
	},
	{ type: "user", name: "Kate Müller", age: 23, occupation: "Astronaut" },
]

export type ApiResponse<T> =
	| {
			status: "success"
			data: T
	  }
	| {
			status: "error"
			error: string
	  }

/**
 * Higher order functions(hordfuncs) that execute the given callback and supply it with the right arguments.
 */
const oldApi = {
	requestAdmins(callback: (response: ApiResponse<Admin[]>) => void) {
		callback({
			status: "success",
			data: admins,
		})
	},
	requestUsers(callback: (response: ApiResponse<User[]>) => void) {
		callback({
			status: "success",
			data: users,
		})
	},
	requestCurrentServerTime(callback: (response: ApiResponse<number>) => void) {
		callback({
			status: "success",
			data: Date.now(),
		})
	},
	requestCoffeeMachineQueueLength(
		callback: (response: ApiResponse<number>) => void,
	) {
		callback({
			status: "error",
			error: "Numeric value has exceeded Number.MAX_SAFE_INTEGER.",
		})
	},
}

const newApi = {
	requestAdmins: promisify(oldApi.requestAdmins),
	requestUsers: promisify(oldApi.requestUsers),
	requestCurrentServerTime: promisify(oldApi.requestCurrentServerTime),
	requestCoffeeMachineQueueLength: promisify(
		oldApi.requestCoffeeMachineQueueLength,
	),
}

/**
 * Assignement: program promisify function
 */

/**
 * Model Input Parameter
 */
type CallbackBasedFunction<T> = (
	callback: (response: ApiResponse<T>) => void,
) => void
/**
 * Model Output Parameter
 */
type FunctionForPromiseOf<T> = () => Promise<T>

/**
 * There is one inference site for T: the first argument
 * hordfunc: higher order function
 *
 * See https://stackoverflow.com/a/59055819/3274229
 * @param hordfunc
 * @returns
 */
function promisify<T>(
	hordfunc: CallbackBasedFunction<T>,
): FunctionForPromiseOf<T> {
	const resultfn = () =>
		new Promise<T>((resolve, reject) => {
			hordfunc(
				/** <- here we execute the hordfunc */
				/** with this callback function as argument -> */ (response) => {
					if (response.status === "success") {
						resolve(response.data)
					} else {
						reject(response.error)
					}
				}, // callback end
			) // hordfunc end
		})
	return resultfn
}

async function startTheApp_1() {
	;(await newApi.requestAdmins()).forEach((obj) => {})
	;(await newApi.requestUsers()).forEach((obj) => {})
	await newApi.requestCurrentServerTime()
	await newApi.requestCoffeeMachineQueueLength()
}

/**
 * Create a function promisifyAll which accepts an object
 * with functions and returns a new object where each of
 * the function is promisified.
 */

export const newApiAll = promisifyAll(oldApi)

type CallbackBasedFunctions<API> = {
	[K in keyof API]: CallbackBasedFunction<API[K]>
}
type FunctionsForPromiseOf<API> = {
	[K in keyof API]: FunctionForPromiseOf<API[K]>
}

function promisifyAll<API extends Record<string, any>>(
	api: CallbackBasedFunctions<API>,
): FunctionsForPromiseOf<API> {
	const result: Partial<FunctionsForPromiseOf<API>> = {}
	for (const key of Object.keys(api) as (keyof API)[]) {
		result[key] = promisify(api[key])
	}
	return result as FunctionsForPromiseOf<API>
}

async function startTheApp_2() {
	;(await newApiAll.requestAdmins()).forEach((obj) => {})
	;(await newApiAll.requestUsers()).forEach((obj) => {})
	await newApiAll.requestCurrentServerTime()
	await newApiAll.requestCoffeeMachineQueueLength()
}
