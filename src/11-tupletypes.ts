/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * Tuple types are subtypes of arrays.
 *
 * Note that we don’t define properties, just types. The order
 * in which the types appear is important.
 */
declare function useToggleState(id: number): [boolean, () => void]

/**
 * As with any other value type, declaring a const context can
 * infer the types correctly.
 */
let tuple = ["Stefan", 38] as const
