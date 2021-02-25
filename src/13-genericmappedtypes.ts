/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * Lesson 32: Generic Mapped Types
 *
 * TypeScript has a couple of helper types that can be used for what we did manually.
 * They might come in handy when we start creating advanced types. Let’s look at
 * Record and Pick. Both are mapped types with generics.
 *
 * P.S. All not-numbered Types, Functions and so on are the preferred final version.
 * See next lesson.
 */

/**
 * Pick<O, K> creates a new object with selected property keys K of object O .
 */

type VideoFormatURLs = {
	format360p: URL
	format480p: URL
	format720p: URL
	format1080p: URL
}

/**
 * type HD = {
 *   format1080p: URL;
 *   format720p: URL;
 * }
 */
type HD = Pick<VideoFormatURLs, "format1080p" | "format720p">

type URLList = Record<string, URL>

/**
 * Works same with Record as with user built type, see 12-generics
 */
async function loadFile<Formats extends URLList, Key extends keyof Formats>(
	fileFormats: Formats,
	format: Key,
) {
	const data = await fetch(fileFormats[format].href)
	return {
		format,
		loaded: data.status == 200,
	}
}

/**
 * Requirements: We just want to have VideoFormatURLs but split into unions.
 * Such that { format360p: URL} | { format480p: URL} | { format720p: URL} | { format1080p: URL}
 * Equal to Record<"format360p": URL> | Record<"format480p": URL> | Record<"format720p": URL> | Record<"format1080p": URL>
 */

/**
 * 1
 *
 * keyof creates a union of all keys of VideoFormatURLs as value types
 */
type Split = keyof VideoFormatURLs

/**
 * 2
 *
 * Same, but
 *  a) with mapped types and
 *  b) hence with the key also being the value
 *
 * type Split2 = {
 *  format360p: "format360p";
 *  format480p: "format480p";
 *  format720p: "format720p";
 *  format1080p: "format1080p";
 * }
 */
type Split2 = { [P in keyof VideoFormatURLs]: P }

/**
 * 3
 *
 * Now we can access the values of this type again by
 * using the indexed access operator. If we access by
 * the union of keys of VideoFormatURLs , we get a
 * union of the values.
 *
 * type Split3 = "format360p" | "format480p" | "format720p" | "format1080p"
 *
 * Same as 1
 */
type Split3 = { [P in keyof VideoFormatURLs]: P }[keyof VideoFormatURLs]

/**
 * 4
 *
 * The final, required version
 */
type Split4 = {
	[P in keyof VideoFormatURLs]: Record<P, VideoFormatURLs[P]>
}[keyof VideoFormatURLs]

/**
 * 5
 *
 * Generalize the final, required version
 */
type Split5<Obj> = { [P in keyof Obj]: Record<P, Obj[P]> }[keyof Obj]

type AvailableFormats = Split5<VideoFormatURLs>

const HQ: AvailableFormats = {
	format720p: new URL(""),
	format1080p: new URL(""),
}

/**
 * P.S. Split4 should be Split5
 * Type '{ format180p: URL; }' is not assignable to type 'Split4'.
 * Object literal may only specify known properties, and 'format180p' does not exist in type 'Split4'.ts(2322)
 */
const LQ: AvailableFormats = {
	format180p: new URL(""),
}

/**
 * Lesson 33: Mapped Type Modifiers
 */

type SubtitleURLs = { english: URL; german: URL; french: URL }

type UserPreferences = {
	format: keyof VideoFormatURLs
	subtitles: { active: boolean; language: keyof SubtitleURLs }
	theme: "dark" | "light"
}

/**
 * As you can read from the type UserPreferences , no property is optional. All properties are required to
 * produce a sound user experience, so we don’t want to leave anything out. To ensure all keys are set, we provide
 * a set of default user preferences.
 **
 * One thing we want to ensure is that defaultUP cannot be changed from other parts of our software. We need a type
 * that ensures every property is a read-only property.
 */
type Const<Obj> = { readonly [Key in keyof Obj]: Obj[Key] }

const defaultUP1: Const<UserPreferences> = {
	format: "format1080p",
	subtitles: { active: false, language: "english" },
	theme: "light",
}

/**
 * Const<Obj> is available in TypeScript as Readonly<Obj>.
 */

const defaultUP2: Readonly<UserPreferences> = {
	format: "format1080p",
	subtitles: { active: false, language: "english" },
	theme: "light",
}

/**
 * In JavaScript we would still be allowed to modify that object.
 * That’s why we use Object.freeze to make sure we can’t change
 * anything at runtime. The return value’s type of Object.freeze
 * is Readonly<Obj> .
 *
 * function freeze(obj: UserPreferences): Readonly<UserPreferences>
 */

function freeze1(obj: UserPreferences) {
	return Object.freeze(obj)
}

const defaultUP3 = freeze1({
	format: "format1080p",
	subtitles: { active: false, language: "english" },
	theme: "light",
})

/**
 * oh, no. This should not be made possible.
 */
defaultUP3.subtitles.active = true

/**
 * Deep Modifications
 *
 * There’s one thing to keep in mind with Readonly and Partial : our
 * nested data structure.
 *
 * Readonly only modifies the first level of properties, which means
 * that this call does not cause an error in TypeScript.
 * To make sure our types are what we expect them to be, we need helper
 * types that go deeper than one level. Thankfully, TypeScript allows for
 * recursive types. We can define a type that references itself, and goes
 * one level deeper.
 * TypeScript knows to stop the recursion if Obj[Key] returns a primitive
 * or value type, or a union of primitive or value types.
 */

type DeepReadonly<Obj> = { readonly [Key in keyof Obj]: DeepReadonly<Obj[Key]> }

function freeze(obj: UserPreferences): DeepReadonly<UserPreferences> {
	return Object.freeze(obj)
}

const defaultUP = freeze({
	format: "format1080p",
	subtitles: { active: false, language: "english" },
	theme: "light",
})

/**
 * Cannot assign to 'format' because it is a read-only property.ts(2540)
 */
defaultUP.format = "format720p"

/**
 * oh, yes
 *
 * Cannot assign to 'active' because it is a read-only property.ts(2540)
 */
defaultUP.subtitles.active = true

/**
 * For our users we just store deltas. If a user changes their preferred video format to
 * something different, it’s only the new format that we store.
 */
const userPreferences1 = {
	format: "format720p",
	theme: "dark",
}

/**
 * To get to the full set of preferences, we merge our default preferences with the user’s
 *  preferences in a function.
 *
 * Spread types may only be created from object types.ts(2698) ->
 * How do we type userP?
 * We would need a type where every key can be optional.
 */
function combinePreferences1(defaultUP: UserPreferences, userP: unknown) {
	return { ...defaultUP, ...userP }
}
/**
 * Note the little question mark next to the mapped argument where we iterate through
 * all the keys. This is called a property modifier.
 */
type Optional<Obj> = { [Key in keyof Obj]?: Obj[Key] }

function combinePreferences2(
	defaultUP: UserPreferences,
	userP: Optional<UserPreferences>,
) {
	return { ...defaultUP, ...userP }
}

/**
 * The moment we assign this value to userSettings , TypeScript infers its type to the
 * most reasonably widest type. In our case, strings.
 *
 * Types of property 'format' are incompatible.
 *    Type 'string' is not assignable to type '"format1080p" | "format720p" | "format360p" | "format480p" | undefined'.ts(2345)
 */
combinePreferences2(defaultUP, userPreferences1)

/**
 * So, A
 */
const userPreferences2 = {
	format: "format720p" as const,
	theme: "dark" as const,
}

const prefs = combinePreferences2(defaultUP, userPreferences2)
prefs.theme

/**
 * So, B
 */
const userPreferences3 = {
	format: "format720p",
	theme: "dark",
} as const

const prefs2 = combinePreferences2(defaultUP, userPreferences3)
prefs2.theme

/**
 * So, C
 *
 * Partial, unforunately, mixes undefined in
 */
const userPreferences: Partial<UserPreferences> = {
	format: "format720p",
	theme: "dark",
}

combinePreferences2(defaultUP, userPreferences)

/**
 * So, D
 *
 * The moment we pass the second parameter as literal, TypeScript infers the type
 * of our literal to be the value type. This is because this value, being an
 * argument of a function, can’t change through operations. The only way we can
 * modify this value is by editing the source code. It’s final.
 */
combinePreferences2(defaultUP, {
	format: "format720p",
	theme: "dark",
})

/**
 * TS's built in type Partial is like Optional
 *
 * P.S. Opposite of TS's Partial is Required, which makes all keys required by removing
 *  the optional property modifier.
 */
function combinePreferences(
	defaultUP: UserPreferences,
	userP: Partial<UserPreferences>,
) {
	return { ...defaultUP, ...userP }
}

combinePreferences(defaultUP, userPreferences)
