/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * https://typescript-exercises.github.io/#exercise=6&file=%2Findex.ts
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

type PersonKind = Person["type"]

const persons: Person[] = [
	{
		type: "user",
		name: "Max Mustermann",
		age: 25,
		occupation: "Chimney sweep",
	},
	{ type: "admin", name: "Jane Doe", age: 32, role: "Administrator" },
]

const getObjectKeys1 = <T extends Person>() => <U extends Omit<T, "type">>(
	criteria: Partial<U>,
) => {
	return Object.keys(criteria) as (keyof U)[]
}

/**
 * Solution 1: mui duplication
 */

function filterPersons1(
	persons: Person[],
	personType: "admin",
	criteria: Partial<Omit<Admin, "type">>,
): Admin[]
function filterPersons1(
	persons: Person[],
	personType: "user",
	criteria: Partial<Omit<User, "type">>,
): User[]
function filterPersons1(
	persons: Person[],
	personType: PersonKind,
	criteria: Partial<Omit<Person, "type">>,
): User[] | Admin[] {
	let result = persons.filter((person) => person.type === personType)
	if (personType == "admin") {
		let criteriaAdminKeys = getObjectKeys1<Admin>()(criteria)
		let criteriaAdmin = criteria as Partial<Omit<Admin, "type">>
		let admins = result as Admin[]
		result = admins.filter((admin) => {
			return criteriaAdminKeys.every((fieldName) => {
				return admin[fieldName] === criteriaAdmin[fieldName]
			})
		})
		return admins
	} else {
		let criteriaUserKeys = getObjectKeys1<User>()(criteria)
		let criteriaUsers = criteria as Partial<Omit<User, "type">>
		let users = result as User[]
		users = users.filter((user) => {
			return criteriaUserKeys.every((fieldName) => {
				return user[fieldName] === criteriaUsers[fieldName]
			})
		})
		return users
	}
}

const usersOfAge23_1 = filterPersons1(persons, "user", { age: 23 })

const adminsOfAge23_1 = filterPersons1(persons, "admin", { age: 23 })

/**
 * Solution 2: mui complicato
 */

function filterPersons2(
	persons: Person[],
	personType: "admin",
	criteria: Partial<Omit<Admin, "type">>,
): Admin[]
function filterPersons2(
	persons: Person[],
	personType: "user",
	criteria: Partial<Omit<User, "type">>,
): User[]
function filterPersons2<T extends Person>(
	persons: Person[],
	personType: T["type"],
	criteria: Partial<Omit<T, "type">>,
): T[] {
	let results = persons.filter((person) => person.type === personType) as T[]
	let criteriaKeys = getObjectKeys1<T>()(criteria)
	let criteriaObject = criteria as Partial<Omit<T, "type">>
	results = results.filter((admin) => {
		return criteriaKeys.every((fieldName) => {
			return admin[fieldName] === criteriaObject[fieldName]
		})
	})
	return results
}

const usersOfAge23_2 = filterPersons2(persons, "user", { age: 23 })

const adminsOfAge23_2 = filterPersons2(persons, "admin", { age: 23 })

/**
 * Solution 3: Their solution
 */

const getObjectKeys2 = <T>(obj: T) => Object.keys(obj) as (keyof T)[]

function filterPersons3(
	persons: Person[],
	personType: "admin",
	criteria: Partial<Omit<Admin, "type">>,
): Admin[]
function filterPersons3(
	persons: Person[],
	personType: "user",
	criteria: Partial<Omit<User, "type">>,
): User[]
function filterPersons3(
	persons: Person[],
	personType: PersonKind,
	criteria: Partial<Omit<Person, "type">>,
): Person[] {
	return persons
		.filter((person) => person.type === personType)
		.filter((person) => {
			let criteriaKeys = getObjectKeys2(criteria)
			return criteriaKeys.every((fieldName) => {
				return person[fieldName] === criteria[fieldName]
			})
		})
}

const usersOfAge23_3 = filterPersons3(persons, "user", { age: 23 })

const adminsOfAge23_3 = filterPersons3(persons, "admin", { age: 23 })
