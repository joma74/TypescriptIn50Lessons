/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * https://typescript-exercises.github.io/#exercise=5&file=%2Findex.ts
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

const isAdmin = (person: Person): person is Admin => person.type === "admin"
const isUser = (person: Person): person is User => person.type === "user"

function filterUsers1(persons: Person[], criteria: Partial<User>): User[] {
	return persons.filter(isUser).filter((user) => {
		const criteriaKeys = Object.keys(criteria)
		return criteriaKeys.every((fieldName) => {
			return user[fieldName] === criteria[fieldName] // (ok) Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'User'. No index signature with a parameter of type 'string' was found on type 'User'.ts(7053)
		})
	})
}

function filterUsers2(persons: Person[], criteria: Partial<User>): User[] {
	return persons.filter(isUser).filter((user) => {
		const criteriaKeys = Object.keys(criteria) as (keyof User)[] // (ok) const criteriaKeys: ("type" | "name" | "age" | "occupation")[]
		return criteriaKeys.every((fieldName) => {
			return user[fieldName] === criteria[fieldName] // (ok)
		})
	})
}

/**
 * Higher difficulty bonus exercise: Exclude "type" from filter criterias.
 * @param criteria Partial<Pick<User, "name" | "age" | "occupation">>
 */
function filterUsers3(
	persons: Person[],
	criteria: Partial<Omit<User, "type">>,
): User[] {
	return persons.filter(isUser).filter((user) => {
		const criteriaKeys = Object.keys(criteria) as (keyof Omit<User, "type">)[] // (ok) const criteriaKeys: ("name" | "age" | "occupation")[]
		return criteriaKeys.every((fieldName) => {
			return user[fieldName] === criteria[fieldName] // (ok)
		})
	})
}
