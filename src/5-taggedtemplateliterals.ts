/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

type Result = {
	title: string
	url: string
	abstract: string
}

/**
 * Lesson 19: The Function Type Tool Belt
 *
 * @param strings an array that contains all the strings around the expressions. In our case <li> and </li>
 * @param values a string array with the actual expressions. In our case whatever ${result.title} gives us.
 */
function highlight(strings: TemplateStringsArray, ...values: string[]) {
	let rVal = ""
	strings.forEach((templ, index) => {
		/**
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
		 *
		 * ES2020 introduced the nullish coalescing operator denoted by the double question marks ( ?? ).
		 * The nullish coalescing operator (??) is a logical operator that returns its right-hand side operand
		 * when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand.
		 * A nullish value is a value that is either null or undefined .
		 */
		let expr = values[index] ?? ""
		rVal += templ + expr
	})
	return rVal
}

function createResultTemplate(results: Result[]): string {
	return `<ul>
        ${results.map((result) => highlight`<li>${result.title}</li>`)}
    </ul>`
}
