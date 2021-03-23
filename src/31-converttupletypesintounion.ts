/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * https://drive.google.com/drive/folders/0B5_WfYf1UaShNlpHUlVrREJwbVE
 * https://fettblog.eu/low-maintenance-types-typescript/
 */

const categories = ["beginner", "intermediate", "advanced"] as const

/**
 * https://stackoverflow.com/a/56897338
 *
 * With [number] on a tuple you'll retrieve all properties on the tuple which can be accessed with a numeric index.
 */
type Category = typeof categories[number]

type Beginner_Category = typeof categories[0]
type Advanced_Category = typeof categories[2]
