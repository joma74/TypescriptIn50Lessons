/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * https://typescript-exercises.github.io/#exercise=8&file=%2Findex.ts
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

type PowerUser = Omit<User & Admin, "type"> & { type: "powerUser" }

type Person = User | Admin | PowerUser
