/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * Lesson 34: Binding Generics
 *
 *  Recap from previous chapter, preferred final version
 */

type VideoFormatURLs = {
	format360p: URL
	format480p: URL
	format720p: URL
	format1080p: URL
}

type SubtitleURLs = { english: URL; german: URL; french: URL }

type UserPreferences = {
	format: keyof VideoFormatURLs
	subtitles: { active: boolean; language: keyof SubtitleURLs }
	theme: "dark" | "light"
}

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
 * Only with a assertion of "as const" TS gives intersection hints!
 */
const userPreferences = {
	format: "format720p",
	theme: "dark",
} as const

/**
 * When we call combinePreferences with a literal or a variable in const context,
 * we bind the value type to the Generic UserPref. Because of the generic, this
 * happens:
 * 1. { format: 'format720p', theme: 'dark' } is taken as literal, therefore
 *    we look at the value type.
 * 2. The value type { format: 'format720p', theme: 'dark' } is a subtype
 *    of Partial<UserPreferences> , so it type-checks.
 * 3. We bind UserPref to { format: 'format720p', theme: 'dark' } , which means
 *    we now work with the value type, instead of Partial<UserPreferences>.
 *
 * This intersection of Generics creates an interesting behavior. We have a
 * couple of union types that are now intersected with subtypes of their
 * sets. In such a scenario, the narrower set always wins.
 */
function combinePreferences<
	Defaults extends UserPreferences,
	UserPref extends Partial<UserPreferences>
>(defaultUP: Defaults, userP: UserPref) {
	return { ...defaultUP, ...userP }
}

const prefs = combinePreferences(defaultUP, userPreferences)

/**
 * Which means we know exactly which values we get when we work with prefs.
 */
prefs.theme // is of type 'dark'
prefs.format // is of type 'format720p'

/**
 * But, when we make defaultUP as const ...
 */
const defaultUP2 = {
	format: "format1080p",
	subtitles: { active: false, language: "english" },
	theme: "light",
} as const

/**
 * ... the intersection of two distinct value types always results in never,
 * which means that both theme and format become unusable to us.
 */
const prefs2 = combinePreferences(defaultUP2, userPreferences)

/**
 * Which means we know exactly which values we get when we work with prefs.
 *
 * The intersection ... was reduced to 'never' because property 'format'
 * has conflicting types in some constituents.ts(2339)
 */
prefs2.theme // is of type never
prefs2.format // is of type never
