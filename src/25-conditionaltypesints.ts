/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * https://drive.google.com/file/d/1Dso2KThNHYubALiT92cR_GlslfFd802_/view?usp=sharing
 * https://artsy.github.io/blog/2018/11/21/conditional-types-in-typescript/
 *
 * A real use-case for distributive conditional types.
 *
 */
type Action =
	| {
			type: "INIT"
	  }
	| { type: "SYNC" }
	| { type: "LOG_IN"; emailAddress: string }
	| { type: "LOG_IN_SUCCESS"; accessToken: string }

declare function dispatch1(action: Action): void

dispatch1({ type: "INIT" })
dispatch1({ type: "LOG_IN", emailAddress: "bla" })

/**
 * I wanted the dispatch function to work like this:
 *  dispatch("LOG_IN_SUCCESS", {
 *      accessToken: "038fh239h923908h"
 *  })
 */
type ActionType = Action["type"]
type ExtractActionParameters2<A, T> = A extends { type: T } ? A : never

type Test1 = ExtractActionParameters2<Action, "LOG_IN">
type Test2 = ExtractActionParameters2<Action, "LOG_IN_SUCCESS">

declare function dispatch2<T extends ActionType>(
	type: T,
	args: ExtractActionParameters2<Action, T>,
): void

dispatch2("INIT", { type: "INIT" })
dispatch2("LOG_IN", { type: "INIT" }) // (nok)
dispatch2("LOG_IN", { type: "LOG_IN", emailAddress: "bla" })

/**
 * We can omit the type field by combining a mapped type with a conditional type and the keyof operator.
 */
type ExcludeTypeKey<K> = K extends "type" ? never : K
type Test3 = ExcludeTypeKey<"emailAddress" | "type" | "foo"> // type Test3 = "emailAddress" | "foo"

type ExcludeTypeField<A> = { [K in ExcludeTypeKey<keyof A>]: A[K] }
type Test4 = ExcludeTypeField<{ type: "LOG_IN"; emailAddess: string }> // type Test4 = { emailAddess: string; }

type ExtractActionParameters3<A, T> = A extends { type: T }
	? ExcludeTypeField<A>
	: never

declare function dispatch3<T extends ActionType>(
	type: T,
	args: ExtractActionParameters3<Action, T>,
): void

dispatch3("LOG_IN", { emailAddress: "bla" }) // (ok)
dispatch3("LOG_IN_SUCCESS", { accessToken: "bla" }) // (ok)
dispatch3("LOG_IN_SUCCESS", { badKey: "bla" }) // (ok)
dispatch3("BAD_TYPE", { accessToken: "bla" }) // (ok)

dispatch3("INIT") // (ok) Expected 2 arguments, but got 1.ts(2554)

/**
 * ExcludeTypeField<A> extends {} is always going to be true, because {} is like a
 * top type for interfaces. Pretty much everything is more specific than {}.
 */
type IsAEmptyParamAction1<A> = ExcludeTypeField<A> extends {} ? A : never
/**
 * We need to swap the arguments around. Now if ExcludeTypeField<A> is empty,
 * the condition will be true, otherwise it will be false.
 *
 * But this still doesn't work! That 'distribution', where the union is unrolled
 * recursively, only happens when the thing on the left of the extends keyword
 * is a plain type variable(see Google Keep Note on "Distributive Conditional Type").
 */
type IsAEmptyParamAction2<A> = {} extends ExcludeTypeField<A> ? A : never

/**
 * You can work around it easily.
 *
 * This returns type A iff, after exklusion of K "type", the type is empty.
 */
type IsAEmptyParamAction3<A> = A extends any
	? {} extends ExcludeTypeField<A>
		? A
		: never
	: never

/**
 * Now, create a (union) type of value types from Action, where IsAEmptyParamAction3
 * returns an Action type and pluck, by key "type", that value type out.
 */
type SimpleActionType = IsAEmptyParamAction3<Action>["type"] // type SimpleActionType = "INIT" | "SYNC"

/**
 * Now, we overload that function 1.st with a simple type
 */
declare function dispatch4<T extends ActionType>(type: SimpleActionType): void
declare function dispatch4<T extends ActionType>(
	type: T,
	args?: ExtractActionParameters3<Action, T>,
): void

dispatch4("LOG_IN", { emailAddress: "bla" }) // (ok)
dispatch4("LOG_IN_SUCCESS", { accessToken: "bla" }) // (ok)
dispatch4("LOG_IN_SUCCESS", { badKey: "bla" }) // (ok)
dispatch4("BAD_TYPE", { accessToken: "bla" }) // (ok)
dispatch4("INIT") // (ok)
dispatch4("INIT", {}) // (ok) but ...

/**
 * Use what you've learned so far to make it an error to supply a second argument for 'simple' actions.
 */
type ExtractActionParameters5<A, T> = A extends { type: T }
	? {} extends Omit<A, "type">
		? never
		: Omit<A, "type">
	: never

/**
 * Now, we overload that function 1.st with a simple type
 */
declare function dispatch5<T extends ActionType>(type: SimpleActionType): void
declare function dispatch5<T extends ActionType>(
	type: T,
	args?: ExtractActionParameters5<Action, T>,
): void

dispatch5("LOG_IN", { emailAddress: "bla" }) // (ok)
dispatch5("LOG_IN_SUCCESS", { accessToken: "bla" }) // (ok)
dispatch5("LOG_IN_SUCCESS", { badKey: "bla" }) // (ok)
dispatch5("BAD_TYPE", { accessToken: "bla" }) // (ok) Argument of type '"BAD_TYPE"' is not assignable to parameter of type '"INIT" | "SYNC" | "LOG_IN" | "LOG_IN_SUCCESS"'.ts(2345)
dispatch5("INIT") // (ok)
dispatch5("INIT", {}) // (ok) Argument of type '{}' is not assignable to parameter of type 'never'.ts(2345)

function dispatch6<T extends ActionType>(type: SimpleActionType): void
function dispatch6<T extends ActionType>(
	type: T,
	args?: ExtractActionParameters5<Action, T>,
): void {
	if (typeof args !== "undefined" && type === "LOG_IN") {
		/**
		 * (ok) I suppose the problem is that TypeScript can't yet narrow the types of two independent variables,
		 * even if their types are codependent.
		 */
		console.log(args.emailAddess)
	}
}

function isType<T extends ActionType>(
	desired: T,
	actual: ActionType,
	args: ExcludeTypeField<Action>,
): args is ExtractActionParameters5<Action, T> {
	return desired === actual
}

function dispatch7<T extends ActionType>(type: SimpleActionType): void
function dispatch7<T extends ActionType>(
	type: T,
	args?: ExtractActionParameters5<Action, T>,
): void {
	/**
	 * function isType<"LOG_IN">(
	 *      desired: "LOG_IN",
	 *      actual: "INIT" | "SYNC" | "LOG_IN" | "LOG_IN_SUCCESS",
	 *      args: ExcludeTypeField<Action>)
	 * : args is Omit<{
	 *      type: "LOG_IN";
	 *      emailAddress: string;
	 * }, "type">
	 */
	if (typeof args !== "undefined" && isType("LOG_IN", type, args)) {
		/**
		 * (parameter) args: ExtractActionParameters5<{
		 *     type: "LOG_IN";
		 *     emailAddress: string;
		 * }, T>
		 */
		console.log(args.emailAddress)
	}
	/**
	 *  function isType<"INIT">(
	 *      desired: "INIT",
	 *      actual: "INIT" | "SYNC" | "LOG_IN" | "LOG_IN_SUCCESS",
	 *      args: ExcludeTypeField<Action>)
	 *  : args is never
	 */
	if (typeof args !== "undefined" && isType("INIT", type, args)) {
		console.log(args)
	}
}

/**
 * One thing I might be tempted to try would be combining the values back into a single Action object.
 */
function dispatch8<T extends ActionType>(type: SimpleActionType): void
function dispatch8<T extends ActionType>(
	type: T,
	args?: ExtractActionParameters5<Action, T>,
): void {
	if (typeof args !== "undefined") {
		const action = { type, ...args } as Action
		switch (action.type) {
			case "LOG_IN":
				action.emailAddress // (ok)
				break
		}
	}
}
