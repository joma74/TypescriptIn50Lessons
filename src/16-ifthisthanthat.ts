/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * Chapter 6. Conditional Types
 *
 * Lesson 36: If This, Then That
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

/**
 * Seven overloads for three possible input types, and two possible output types. Now add
 * another one, it’s exhausting!
 */
function fetchOrder1(customer: Customer): Order[]
function fetchOrder1(product: Product): Order[]
function fetchOrder1(orderId: number): Order
function fetchOrder1(param: Customer | Product | number): Order[] | Order {
	// Implementation to follow
	return {} as any
}

/**
 * This works well for simple cases where we’re absolutely sure which
 * parameters we expect.
 * But it gets hairy when our input is ambiguous.
 */
fetchOrder1({ id: 1, firstName: "Stefan", lastName: "Baumgartner" }) // It's Order[]
fetchOrder1(2) // It's Order
declare const ambiguous: Customer | number
fetchOrder1(ambiguous) // No overload matches this call. ... ts(2769)

/**
 * This has to be easier. We can map each input type to an output type:
 * • If the input type is Customer, the return type is Order[].
 * • If the input type is Product, the return type is Order[].
 * • If the input type is number, the return type is Order .
 *
 * First, we create a type for all possible inputs.
 */
type FetchParams1 = number | Customer | Product
/**
 * With Conditinal Types, We can read this statement like ternary operations
 * in JavaScript.
 */
type FetchReturn1<Param extends FetchParams1> = Param extends Customer
	? Order[] // In TypeScript jargon, we say the conditional type resolves to Order[]
	: Param extends Product
	? Order[] // In TypeScript jargon, we say the conditional type resolves to Order[]
	: Order // In TypeScript jargon, we say the conditional type resolves to Order

function fetchOrder2<Param extends FetchParams1>(
	param: Param,
): FetchReturn1<Param> {
	// Implementation to follow
	return {} as any
}

/**
 * This is all we need to get the required return types for every combination of input types.
 */
fetchOrder2({ id: 1, firstName: "Stefan", lastName: "Baumgartner" }) // It's Order[]
fetchOrder2(2) // It's Order
fetchOrder2(ambiguous) // It's Order | Order[]

declare const x: any

fetchOrder2(x) // It's Order | Order[] | Order[]

/**
 * Lesson 37: Combining Function Overloads and Conditional Types
 * Tuple Types for Function Heads
 *
 * Lets make it classic: Either we pass a callback, or we return a promise.
 *
 * TODO But ? just fucks up
 */
type FetchParams3 = number | Customer | Product
type FHeadReturn3<Param extends FetchParams3> = Param extends Customer
	? Order[] // In TypeScript jargon, we say the conditional type resolves to Order[]
	: Param extends Product
	? Order[] // In TypeScript jargon, we say the conditional type resolves to Order[]
	: Order // In TypeScript jargon, we say the conditional type resolves to Order

type Callback3<Res> = (result: Res) => void
type FetchCb3<Param extends FetchParams3> = Callback3<FHeadReturn3<Param>>

type FHeadParams3<Param extends FetchParams3> =
	| [Param, FetchCb3<Param>]
	| [Param]
/**
 * Now, for the conditional type with tuple param types
 */
type AsyncResult3<
	FHeadParams extends FHeadParams3<Par>,
	Par extends FetchParams3
> = FHeadParams extends [Par, FetchCb3<Par>] // If called with a tuple of Parameter AND Callback, then ...
	? void
	: FHeadParams extends [Par] // If called with a tuple of Parameter, then ...
	? Promise<FHeadReturn3<FetchParams3>>
	: never // ... otherwise

function fetchOrder3<Par extends FetchParams3, FHead extends FHeadParams3<Par>>(
	...args: FHead
): AsyncResult3<FHead, Par> {
	const callback = typeof args[1] === "function" ? args[1] : undefined
	let par = args[0]
	let queryString = "?"
	if (isACustomer(par)) {
		const results = fetch(`/backend?inp=${JSON.stringify(par)}`).then((res) =>
			res.json(),
		) as Promise<Order[]>
		if (typeof callback !== "undefined") {
			// Type 'undefined' is not assignable to type 'AsyncResult3<FHead, Par>'.ts(2322)
			// (nok) Argument of type 'Order[]' is not assignable to parameter of type 'FHeadReturn3<Par>'.ts(2345)
			return void results.then((res) => callback(res))
		} else {
			// Type 'Promise<Order | Order[] | Order[]>' is not assignable to type 'AsyncResult3<FHead, Par>'.ts(2322)
			return results as AsyncResult3<[Customer], Customer>
		}
	} else if (isAProduct(par)) {
		const results = fetch(`/backend?inp=${JSON.stringify(par)}`).then((res) =>
			res.json(),
		) as Promise<Order[]>
		if (typeof callback !== "undefined") {
			// (nok) Type 'undefined' is not assignable to type 'AsyncResult2<FHead, Par>'.ts(2322)
			// (nok) Argument of type 'Order[]' is not assignable to parameter of type 'FHeadReturn3<Par>'.ts(2345)
			return void results.then((res) => callback(res))
		} else {
			// (nok) Type 'Promise<Order[]>' is not assignable to type 'AsyncResult2<FHead, Par>'.ts(2322)
			return results
		}
	} else if (typeof par === "number") {
		const results = fetch(`/backend?inp=${JSON.stringify(par)}`).then((res) =>
			res.json(),
		) as Promise<Order>
		if (typeof callback !== "undefined") {
			// (nok) Type 'undefined' is not assignable to type 'AsyncResult2<FHead, Par>'.ts(2322)
			// (nok) Argument of type 'Order' is not assignable to parameter of type 'FHeadReturn3<Par>'.ts(2345)
			return void results.then((res) => callback(res))
		} else {
			// (nok) Type 'Promise<Order>' is not assignable to type 'AsyncResult2<FHead, Par>'.ts(2322)
			return results
		}
	}
	throw new Error("invalid parameters")
}

let res3_4 = fetchOrder3(
	{
		id: 1,
		firstName: "fn",
		lastName: "ln",
	},
	(fres) => {},
) // (ok) res4 is void, (nok) fres is Order | Order[] | Order[], should be Order[]

let res3_5 = fetchOrder3(
	{
		productId: 1,
		title: "t",
		price: 1,
	} as Product,
	(fres) => {},
) // (ok) res5 is void, (nok) fres is Order | Order[] | Order[], should be Order[]

let res3_6 = fetchOrder3(4, (fres) => {}) // (ok) res6 is void, (nok) fres is Order | Order[] | Order[], should be Order

let res3_1 = fetchOrder3({
	id: 1,
	firstName: "fn",
	lastName: "ln",
}) // (nok) res1 is Promise<Order | Order[] | Order[]>, should be Promise<Order[]>

let res3_2 = fetchOrder3({
	productId: 1,
	title: "t",
	price: 1,
} as Product) // (nok) res3 is Promise<Order | Order[] | Order[]>, should be Promise<Order[]

let res3_3 = fetchOrder3(4) // (nok) res3 is Promise<Order | Order[] | Order[]>, should be Promise<Order>

// Function Overloads Are Fine
type FetchParams4 = number | Customer | Product
type FetchReturn4<Param extends FetchParams4> = Param extends Customer
	? Order[] // In TypeScript jargon, we say the conditional type resolves to Order[]
	: Param extends Product
	? Order[] // In TypeScript jargon, we say the conditional type resolves to Order[]
	: Order // In TypeScript jargon, we say the conditional type resolves to Order
type Callback4<Res> = (result: Res) => void

function fetchOrder4<Par extends FetchParams4>(
	inp: Par,
): Promise<FetchReturn4<Par>>
function fetchOrder4<Par extends FetchParams4>(
	inp: Par,
	callback: Callback4<FetchReturn4<Par>>,
): void
function fetchOrder4<Par extends FetchParams4>(
	inp: Par,
	callback?: Callback4<FetchReturn4<Par>>,
): Promise<FetchReturn4<Par>> | void {
	const res = fetch(`/backend?inp=${JSON.stringify(inp)}`).then((res) =>
		res.json(),
	)
	if (callback) {
		res.then((res) => {
			return void callback(res)
		})
	} else {
		return res
	}
}

let res4_4 = fetchOrder4(
	{
		id: 1,
		firstName: "fn",
		lastName: "ln",
	},
	(fres) => {},
)

let res4_5 = fetchOrder4(
	{
		productId: 1,
		title: "t",
		price: 1,
	} as Product,
	(fres) => {},
)

let res4_6 = fetchOrder4(4, (fres) => {})

let res4_1 = fetchOrder4({
	id: 1,
	firstName: "fn",
	lastName: "ln",
})

let res4_2 = fetchOrder4({
	productId: 1,
	title: "t",
	price: 1,
} as Product)

let res4_3 = fetchOrder4(4)
