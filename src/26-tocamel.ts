/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * https://effectivetypescript.com/2020/11/05/template-literal-types/
 *
 * 1. Template literal types. They look like ES template literals.
 * 2. Key Remapping in Mapped Types
 *
 */
function camelCase1(term: string): string {
	return term.replace(/_([a-z])/g, (m) => m[1].toUpperCase())
}

function objectToCamel1<T extends object>(obj: T) {
	const out: any = {}
	for (const [k, v] of Object.entries(obj)) {
		out[camelCase1(k)] = v
	}
	return out
}
const snake1 = { foo_bar: 12 }
const camel1 = objectToCamel1(snake1) // (ok) camel1 is any
const val1_1 = camel1.fooBar // (ok) type of val1_1 should be number, but is any
const val1_2 = camel1.foo_bar // should be a type error, but is any

type OnString = `on${string}`
const onClick: OnString = "onClick"
const handleClick: OnString = "handleClick" // (ok) Type '"handleClick"' is not assignable to type '`on${string}`'.ts(2322)

/**
 * We can't stop after the first "_", we need to keep going. We can do this by making the type recursive
 */
type ToCamel<S extends string> = S extends `${infer Head}_${infer Tail}`
	? `${Head}${Capitalize<ToCamel<Tail>>}`
	: S

type Test1 = ToCamel<"foo_bar"> // (ok) type Test1 = "fooBar"
type Test2 = ToCamel<"firstName" | "last_name"> // (ok) type Test2 = "firstName" | "lastName"
type Test3 = ToCamel<"firstName" | "last_name" | "foo_bar_baz"> // (ok) type Test3 = "firstName" | "lastName" | "fooBarBaz"

type ObjectToCamelReturn<T extends object> = {
	[K in keyof T as ToCamel<K & string>]: T[K]
}

function objectToCamel2<T extends object>(obj: T): ObjectToCamelReturn<T> {
	const out: any = {}
	for (const [k, v] of Object.entries(obj)) {
		out[camelCase1(k)] = v
	}
	return out
}

const snake2 = { foo_bar: 12 }
const camel2 = objectToCamel2(snake2)
const val2_1 = camel2.fooBar // (ok) type of val2_1 is number
const val2_2 = camel2.foo_bar // (ok) is a type error
