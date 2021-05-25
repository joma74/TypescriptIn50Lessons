/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * https://github.com/type-challenges/type-challenges
 */

type TupleToObject<T extends readonly string[]> = { [K in T[number]]: K }

const tuple = ["tesla", "model 3"] as const

type A = TupleToObject<typeof tuple> // (ok) type A = { tesla: "tesla"; "model 3": "model 3"; }

//

type First<T extends any[]> = T extends [] ? never : T[0]
type EArray = First<[]> // (ok) type EArray = never

//

type Length<T extends readonly any[]> = T["length"]

const tesla = ["tesla", "model 3", "model X", "model Y"] as const

type tupleLength = Length<typeof tesla> // (ok) type tupleLength = 4

//

/**
 * I like this solution, because
 * - T is reduced to "string | number | symbol"
 * - "Key in T" is more explicit about what is really handled
 * - "Key extends U ?" asks "Is Key assignable to U ?"
 * - "Key in T" is cast/asserted (via "as") on the conditional result of "Is Key assignable to U ?"
 *   "That’s why TypeScript 4.1 allows you to re-map keys in mapped types with a new as clause."
 */
type MyExclude<T, U> = T extends string | number | symbol
	? keyof { [Key in T as Key extends U ? never : Key]: any }
	: never

type Excluded1 = MyExclude<"a" | "b" | "c", "a"> // (ok) type Excluded1 = "b" | "c"
type Excluded2 = MyExclude<{ a: 1; b: ""; c: null }, "a"> // (ok) type Excluded1 = "b" | "c"

/**
 * The TS built-in type Exclude<T, U> = T extends U ? never : T
 */
type Excluded3 = Exclude<"a" | "b" | "c", "a"> // (ok) type Excluded3 = "b" | "c"
type Excluded4 = Exclude<{ a: 1; b: ""; c: null }, "a"> // (ok) type Excluded1 = "b" | "c"
