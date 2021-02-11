/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * Lesson 21: Generator Functions
 * Polling Search
 */

type Result = {
	title: string
	url: string
	abstract: string
}

type PollingResults = { results: Result[]; done: boolean }

async function polling(term: string): Promise<PollingResults> {
	return fetch(`/pollingSearch?query=${term}`).then((res) => res.json())
}

/**
 *
 * Returns AsyncGenerator<Result[], void, boolean>:
 * - yields Result[] arrays
 * - returns nothings, hence void
 * - passes stop in, hence boolean
 *
 * @param term
 */
async function* getResults(
	term: string,
): AsyncGenerator<Result[], void, boolean> {
	let state, stop
	do {
		state = await polling(term)
		stop = yield state.results
	} while (!state.done || stop)
}

function append(result: Result) {
	const node = document.createElement("li")
	node.innerHTML = `<a href="${result.url}>${result.title}</a>`
	document.querySelector("#results")?.append(node)
}

async function handleChange(this: HTMLElement, ev: Event) {
	if (this instanceof HTMLInputElement) {
		//call the generator, get an iterator
		let resultsGen = getResults(this.value)
		let next,
			count = 0
		do {
			// Preemptively say stop polling if we reach a certain count of results we want to show.
			// Gives IteratorResult<Result[], void>
			next = await resultsGen.next(count >= 5)
			if (typeof next.value !== "undefined") {
				count += next.value.length
				next.value.map(append)
			}
		} while (!next.done)
		// if one does not pass something in, then more elegantly
		// But as we pass in stop, an expected error is reported:
		// Cannot iterate value because the 'next' method of its iterator expects type 'boolean', but for-of will always send 'undefined'.ts(2763)
		for await (let results of resultsGen) {
			results.map(append)
		}
	}
}

document.getElementById("searchField")?.addEventListener("change", handleChange)
