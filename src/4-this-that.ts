/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

type Result = {
	title: string
	url: string
	abstract: string
}

type SearchFn = (query: string, tags?: string[]) => Promise<Result[]>

declare function displaySearch(
	inputId: string,
	outputId: string,
	search: SearchFn,
): void

/**
 * Property 'value' does not exist on type 'HTMLElement'.
 *
 * @param inputId
 * @param outputId
 * @param search
 */
const displaySearchImplA: typeof displaySearch = function (inputId) {
	document.getElementById(inputId)?.addEventListener("change", function () {
		this.parentElement?.classList.add("active")
		const searchTerm = this.value
	})
}

/**
 * Property 'value' does not exist on type 'HTMLElement'.
 *
 * @param inputId
 * @param outputId
 * @param search
 */
const displaySearchImplB: typeof displaySearch = function (inputId) {
	document.getElementById(inputId)?.addEventListener("change", function () {
		this.parentElement?.classList.add("active")
		if (this instanceof HTMLInputElement) {
			const searchTerm = this.value
		}
	})
}

/**
 * What if we want to extract the callback into its own function? This is not
 * uncommon when writing JavaScript; the same function might be used at different
 * places. But the moment we extract the function and put it in another place,
 * we also lose any connection to this !
 *
 * this' implicitly has type 'any' because it does not have a type annotation.
 */

function inputChangeHandlerA() {
	// We have no clue what this can be // that's why we get red underlines
	this.parentElement?.classList.add("active")
}

/**
 * TypeScript has a way of dealing with situations like this: we are allowed
 * to type this ! Function declarations can have another additional parameter,
 * that has to be at the very first position: this. This parameter gets erased
 * once we compile TypeScript down to JavaScript.
 */
function inputChangeHandlerB(this: HTMLElement) {
	// We have no clue what this can be // that's why we get red underlines
	this.parentElement?.classList.add("active")
}

/**
 * This also ensures that we don’t call inputChangeHandler outside with no context.
 *
 * The 'this' context of type 'void' is not assignable to method's 'this' of
 * type 'HTMLElement'.
 */
inputChangeHandlerB()
