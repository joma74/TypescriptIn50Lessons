/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * https://fettblog.eu/tidy-typescript-prefer-type-aliases/
 */

declare function send(data: any, headers: Record<string, string>): void

type HTTPHeaders = {
	Accept: string
	Cookie: string
}

const hdrs1: HTTPHeaders = {
	Accept: "text/html",
	Cookie: "",
}

send({}, hdrs1)

interface HTTPHeaderInterface {
	Accept: string
	Cookie: string
}

const hdrs2: HTTPHeaderInterface = {
	Accept: "text/html",
	Cookie: "",
}

/**
 * Only if the type is final, like with HTTPHeaders, TypeScript can correctly check if
 * all properties and values are assignable to the Record<string, string> type we
 * declared in send. Since interfaces are up for declaration merging, and therefore
 * not all properties are known, TypeScript can’t tell if the index signature is compatible.
 */
send({}, hdrs2)

/**
 * That’s why I suggest to prefer type aliases over interfaces. Of course, if you are providing
 * a library that has interfaces that should be extendable by others, type aliases won’t
 * get you far.
 */
