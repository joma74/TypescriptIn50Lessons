/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * If we are only interested in types, we use a slight variation on the regular ECMAScript import: a type import.
 * 49
 */
import type { Article } from "./1-example"
import type { Article2 } from "@article/no-module"
import type { Article3 } from "@article/with-module"

const book: Article = {
	price: 29,
	vat: 0.2,
	title: "From ts exported type",
}

const book2: Article2 = {
	price: 29,
	vat: 0.2,
	title: "From d.ts exported type, no module",
}

const book3: Article3 = {
	price: 29,
	vat: 0.2,
	title: "From d.ts exported type, with module",
}

if (SomeGlobalObjectFactory) {
	let sgo = new SomeGlobalObjectFactory(() => {})
}
