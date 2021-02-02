/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars, no-redeclare */
// Make it a module
export {}

/**
 * Enter unknown, 42
 * we have to provide a proper control flow to ensure type safety.
 */
function selectDeliveryAddress(addressOrIndex: unknown): string {
	if (typeof addressOrIndex === "number") {
		return "one"
	} else if (typeof addressOrIndex === "string") {
		return addressOrIndex
	}
	return ""
}

export type Article = {
	title: string
	price: number
	vat: number
	stock?: number
	description?: string
}

const missingProperties = {
	title: "Helvetica",
	price: 6.66,
}

/**
 * Excess property check, 46
 *
 * Property 'vat' is missing in type '{ title: string; price: number; }' but required in type 'Article'.
 */
const anotherMovie: Article = missingProperties

/**
 * Declaration merging for interfaces, 54
 */
interface ShopItem {
	title: string
}

interface ShopItem {
	reviews: { rating: number; content: string }[]
}

const shopItem: ShopItem = {
	title: "An item",
	reviews: [{ rating: 1, content: "whatever" }],
}

declare global {
	interface Window {
		isDevelopment: boolean
	}
}

if (window.isDevelopment) {
	console.log("global declaration merging worked")
}
