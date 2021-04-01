/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

let x = { a: 1, b: 2, c: 3, d: 4 }

let xapo = x

let y = { x: 1, y: 2, z: 3 }

/**
 * Implicit type inference (if generics are defined on right side) ↓
 */

// ****

function getProperty0<T, K extends keyof T>(obj: T, key: K) {
	return obj[key]
}

getProperty0(x, "a") // (ok)
getProperty0(x, "m") // (ok) Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.ts(2345)

// ****

getProperty0<typeof x, keyof typeof x>(x, "a")

// ****

type GetProperty2 = <T, K extends keyof T>(obj: T, key: K) => T[K]

const getProperty2: GetProperty2 = (obj, key) => obj[key]

getProperty2(x, "a") // (ok)
getProperty2(x, "m") // (ok) Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.ts(2345)

/**
 * Explicit type inference (if generics are defined on left side) ↓
 */

// ****
type GetProperty3<T extends {} = {}, K extends keyof T = keyof T> = (
	obj: T,
	key: K,
) => T[K]

const getProperty3_1: GetProperty3 = (obj, key) => obj[key]

getProperty3_1(x, "a") // (nok) Argument of type 'string' is not assignable to parameter of type 'never'.ts(2345)
getProperty3_1(x, "m") // (nok) Argument of type 'string' is not assignable to parameter of type 'never'.ts(2345)

const getProperty3_2: GetProperty3<typeof x> = (obj, key) => obj[key]

getProperty3_2(x, "a") // (ok)
getProperty3_2(x, "m") // (ok) Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.ts(2345)

const getProperty3_3: GetProperty3<typeof x, keyof typeof x> = (obj, key) =>
	obj[key]

getProperty3_3(x, "a") // (ok)
getProperty3_3(x, "m") // (ok) Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.ts(2345)

const getProperty3_4: GetProperty3<typeof x, keyof typeof xapo> = (obj, key) =>
	obj[key]

getProperty3_4(x, "a") // (ok)
getProperty3_4(x, "m") // (ok) Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.ts(2345)

const getProperty3_5: GetProperty3<typeof x, keyof typeof y> = (
	obj,
	key, // (ok) Type '"x" | "y" | "z"' does not satisfy the constraint '"a" | "b" | "c" | "d"'.
) => obj[key] // (ok) Element implicitly has an 'any' type because expression of type '"x" | "y" | "z"' can't be used to index type '{ a: number; b: number; c: number; d: number; }'.

getProperty3_5(x, "x") // (nok) but see above, getProperty3_5 wiggles
getProperty3_5(x, "m") // (ok)

// ****
type GetProperty0 = typeof getProperty0

const getProperty0_1: GetProperty0 = (obj, key) => obj[key]

getProperty0_1(x, "a") // (ok)
getProperty0_1(x, "m") // (ok) Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.ts(2345)

// ****

type GetProperty4<T extends {}, K extends keyof T> = (obj: T, key: K) => T[K]

const getProperty4_1: GetProperty4 = (obj, key) => obj[key] // (ok) Generic type 'GetProperty4' requires 2 type argument(s).ts(2314)

const getProperty4_2: GetProperty4<typeof x, keyof typeof x> = (obj, key) =>
	obj[key]

getProperty4_2(x, "a") // (ok)
getProperty4_2(x, "m") // (ok) Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.ts(2345)

// ****
function getProperty10<T extends {} = {}, K extends keyof T = keyof T>(
	obj: T,
	key: K,
) {
	return obj[key]
}
getProperty10(x, "a") // (ok)
getProperty10(x, "m") // (ok) Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.ts(2345)
