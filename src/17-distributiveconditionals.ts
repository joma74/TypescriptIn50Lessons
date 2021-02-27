/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * Chapter 6. Conditional Types
 *
 * Lesson 38: Distributive Conditionals
 *
 */
type Customer = { id: number; firstName: string; lastName: string }

const isACustomer = (a: any): a is Customer => {
	return (a as Customer).id !== undefined
}

type Product = { productId: number; title: string; price: number }

const isAProduct = (a: any): a is Product => {
	return (a as Product).productId !== undefined
}

type Order = {
	orderId: number
	customer: Customer
	products: Product[]
	date: Date
}

type FetchParams1 = number | Customer | Product

/**
 * FetchReturn1 is a distributive conditional type. This means that each constituent
 * of the generic type parameter is instantiated with the same conditional type.
 * A conditional type of a union type is like a union of conditional types.
 */
type FetchReturn1<Param extends FetchParams1> = Param extends Customer
	? Order[]
	: Param extends Product
	? Order[]
	: Param extends number
	? Order
	: never

/**
 * With that in mind, we can see how this conditional type works when we put
 * in one type as argument.
 */
type FetchByCustomer1 = FetchReturn1<Customer> // type FetchByCustomer1 = Order[]

/**
 * Distribution over Unions
 */
type FetchByProductOrId1_1 = FetchReturn1<Product | number> // type FetchByProductOrId1_1 = Order | Order[]

type FetchByProductOrId1_2 = FetchReturn1<Product | Customer | number> // type FetchByProductOrId1_2 = Order | Order[] | Order[]

/**
 * Naked Types
 *
 * Let’s wrap the type parameter in a tuple type.
 */
type FetchReturn2<Param extends FetchParams1> = [Param] extends [Customer]
	? Order[]
	: [Param] extends [Product]
	? Order[]
	: [Param] extends [number]
	? Order
	: never
type FetchByCustomer2 = FetchReturn2<Customer> // type FetchByCustomer2 = Order[]

/**
 * Distribution over Unions With Tuples
 *
 * Never ensures we definitely get the correct return value if we work with a single type.
 * Union types always resolve to never , which can be a nice way of making sure that we
 * first narrow down to a single constituent of the union.
 */
type FetchByProductOrId2_1 = FetchReturn2<Customer | number> // type FetchByProductOrId2_1 = never

/**
 * Lesson 39: Filtering with never
 *
 */
type Medium = { id: number; title: string; artist: string }
type TrackInfo = { duration: number; tracks: number }
/**
 * A CD is a combination of Medium and TrackInfo . We also add a kind to create discriminated unions.
 */
type CD = Medium & TrackInfo & { kind: "cd" }

type LP = Medium & { kind: "lp"; sides: { a: TrackInfo; b: TrackInfo } }

type AllMedia = CD | LP
type MediaKinds = AllMedia["kind"] // type MediaKinds = "cd" | "lp"

type SelectBranch<Branch, Typ> = Branch extends { kind: Typ } ? Branch : never

// a test
type SelectCD = SelectBranch<AllMedia, "cd">
type SelectLP = SelectBranch<AllMedia, "lp">

function neverError(message: string, token: never) {
	return new Error(`${message}. ${token} should not exist`)
}

type RemovableKeys = "kind" | "id"
type GetInfo<Med> = Omit<Med, RemovableKeys>

/**
 * TODO But ? just fucks up
 * @param kind
 * @param info
 */
function createMedium<Typ extends MediaKinds>(
	kind: Typ,
	info: GetInfo<SelectBranch<AllMedia, Typ>> /* no id, no kind */,
): SelectBranch<AllMedia, Typ> {
	switch (kind) {
		case "cd":
			let infoCd = info as GetInfo<SelectBranch<CD, "cd">>
			let cd = {
				id: 1,
				kind: "cd",
				artist: infoCd.artist,
				title: infoCd.title,
				duration: infoCd.duration,
				tracks: infoCd.tracks,
			} as CD
			return cd
		case "lp":
			let lpInfo = info as GetInfo<SelectBranch<LP, "lp">>
			let lp = {
				id: 2,
				kind: "lp",
				artist: lpInfo.artist,
				title: lpInfo.title,
				sides: lpInfo.sides,
			} as LP
			return lp
		default:
			// Type 'string' is not assignable to type 'never'.ts(2345)
			throw neverError("Not sure what to do with that!", kind)
	}
}

let cd = createMedium("cd", {
	artist: "a",
	title: "b",
	duration: 5,
	tracks: 10,
})

let lp = createMedium("lp", {
	artist: "a",
	title: "b",
	sides: { a: { duration: 5, tracks: 5 }, b: { duration: 5, tracks: 5 } },
})

/**
 * Infer the Return Type
 */
let userId = 0

function createUser(
	name: string,
	role: "admin" | "maintenance" | "shipping",
	isActive: boolean,
) {
	return { userId: userId++, name, role, isActive, createdAt: new Date() }
}

type GetReturn1<Fun> = Fun extends (...args: any[]) => any ? Fun : never

type Fun1 = GetReturn1<typeof createUser>

/**
 * This happens with the infer keyword. We can choose a type variable and return this type variable.
 *
 * This helper type is available in TypeScript as ReturnType<Fun> .
 */
type GetReturn2<Fun> = Fun extends (...args: any[]) => infer R ? R : never

type Fun2 = GetReturn2<typeof createUser>
type Fun3 = ReturnType<typeof createUser> // type Fun3 = { userId: number; ... createdAt: Date; }

/**
 * Helper Types
 */
type Promised<T> = T extends Promise<infer Res> ? Res : never
type A1 = Promised<Promise<number>> // type A = number

type Flatten<T> = T extends Array<infer Vals> ? Vals : never
type A2 = Flatten<Customer[]> // A is Customer

/**
 * Collects all arguments from a function in a tuple.
 */
type A3 = Parameters<typeof createUser> // type A3 = [name: string, ... isActive: boolean]

/**
 * NonNullable
 */
function isNonOptional<Obj>(obj: Obj): obj is NonNullable<Obj> {
	return typeof obj !== "undefined" && obj !== null
}

/**
 * Low-Level Utilities
 */
type FetchDBKind = "orders" | "products" | "customers"

type FetchDBKindReturn<T> = T extends "orders"
	? Order[]
	: T extends "products"
	? Product[]
	: T extends "customers"
	? Customer[]
	: never

declare function fetchFromDatabase<Kin extends FetchDBKind>(
	kind: Kin,
): Promise<FetchDBKindReturn<Kin> | null>

function process<T extends Promise<any>>(
	promise: T,
	cb: (res: Promised<NonNullable<T>>) => void,
): void {
	promise.then((res) => {
		if (isNonOptional(res)) {
			cb(res)
		}
	})
}
declare function listOrders(orders: Order[]): void

/**
 * Argument of type '(orders: Order[]) => void' is not assignable to parameter of
 * type '(res: Order[] | null) => void'.
 */
process(fetchFromDatabase("orders"), listOrders)
