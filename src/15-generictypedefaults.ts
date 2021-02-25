/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * Lesson 35: Generic Type Defaults
 *
 */

type VideoFormatURLs = {
	format360p: URL
	format480p: URL
	format720p: URL
	format1080p: URL
}

const videoRepo: VideoFormatURLs = {
	format360p: new URL("http://1"),
	format480p: new URL("http://2"),
	format720p: new URL("http://3"),
	format1080p: new URL("http://4"),
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

const userPreferences = {
	format: "format720p",
	theme: "dark",
} as const

function combinePreferences<
	Defaults extends UserPreferences,
	UserPref extends Partial<UserPreferences>
>(defaultUP: Defaults, userP: UserPref) {
	return { ...defaultUP, ...userP }
}

type Nullable<G> = G | undefined

/**
 * Compared to type constraints, generic default parameters don’t create a boundary,
 * but a default value in case we can’t infer or don’t annotate.
 */
class Container<GElement extends HTMLElement = HTMLVideoElement> {
	#element: Nullable<GElement>
	#prefs: UserPreferences

	constructor(prefs: UserPreferences) {
		this.#prefs = prefs
	}

	/**
	 * element(value?: GElement) ->
	 * A 'set' accessor cannot have an optional parameter.ts(1051)
	 */
	set element(value: Nullable<GElement>) {
		this.#element = value
	}

	get element() {
		return this.#element
	}

	loadVideo(from: VideoFormatURLs) {
		const selectedFormat = from[this.#prefs.format].href
		if (this.#element instanceof HTMLVideoElement) {
			this.#element.src = selectedFormat
		} else if (this.#element) {
			const vid = document.createElement("video")
			this.#element.appendChild(vid)
			vid.src = selectedFormat
		}
	}
}
const prefs = combinePreferences(defaultUP, userPreferences)
/**
 * Only after binding the generic to a concrete type, we get appropriate
 * type safety.
 */
const container = new Container<HTMLVideoElement>(prefs)
container.element = document.createElement("video")
/**
 * Type 'HTMLDivElement' is missing the following properties from type
 * 'HTMLVideoElement': height, playsInline, poster, videoHeight, and 47
 * more.ts(2740)
 */
container.element = document.createElement("div")
container.loadVideo(videoRepo)

declare function createVid<GEelemnt extends HTMLElement = HTMLVideoElement>(
	prefs: UserPreferences,
	formats: VideoFormatURLs,
	element?: GEelemnt,
): GEelemnt

/**
 * However, this only works when we rely solely on type inference.
 */

// a is HTMLVideoElement, the default!
const a = createVid(prefs, videoRepo)

// b is HTMLDivElement
const b = createVid(prefs, videoRepo, document.createElement("div"))

// c is HTMLVideoElement
const c = createVid(prefs, videoRepo, document.createElement("video"))

/**
 * Generics also allow us to bind the type explicitly. But, since we are on the type level,
 * the implementation has no clue that we want to have an HTMLAudioElement . That’s why we
 * need to be cautious when we use generic default parameters.
 *
 * c is HTMLAudioElement
 */

const d = createVid<HTMLAudioElement>(prefs, videoRepo)
