export type Article2 = {
	title: string
	price: number
	vat: number
	stock?: number
	description?: string
}

interface SomeGlobalObject {
	disconnect(): void
	observe(): void
	unobserve(): void
}

declare global {
	var SomeGlobalObjectFactory:
		| {
				prototype: SomeGlobalObject
				new (callback: () => void): SomeGlobalObject
		  }
		| undefined
}
