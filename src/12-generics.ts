/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * Lesson 29: I Don’t Know What I Want, but I Know How to Get It
 */
type VideoFormatURLs = {
	format360p: URL
	format480p: URL
	format720p: URL
	format1080p: URL
}

type SubtitleURLs = { english: URL; german: URL; french: URL }

/**
 * Defining Boundaries
 *
 * However, there’s the possibility to define boundaries, or subsets of the type space.
 * This makes generic type parameters a little bit narrower before they’re substituted
 * by real types. We get information up front if we pass an object that shouldn’t be passed.
 * To define generic subsets, TypeScript uses the extends keyword. We check if a
 * generic type parameter extends a specific subset of types.
 *
 * Index Types
 *
 * Now that URLList accepts all property keys of type string , we can explicitly say
 * that the type of each property needs to be URL.
 *
 * @param obj
 * @param key
 */
function isAvailable<Formats extends URLList>(
	obj: Formats,
	key: number | string | symbol,
): key is keyof Formats {
	return key in obj
}

/**
 * Index Type
 */
type URLList = { [k: string]: URL }

declare const videoFormats: VideoFormatURLs

if (isAvailable(videoFormats, "format360p")) {
}

declare const subtitles: SubtitleURLs

if (isAvailable(subtitles, "english")) {
}

/**
 * Argument of type 'string' is not assignable
 * to parameter of type 'object'.ts(2345)
 */
if (isAvailable("a string", "length")) {
}

/**
 * Lesson 31: Working with Keys
 *
 * The second type parameter, Key is a subtype of keyof
 * Formats, the first type parameter.
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
 * loadFile(
 *      fileFormats: VideoFormatURLs,
 *      format: "format360p" | "format480p" | "format720p" | "format1080p")
 * :    Promise<{ format: "format360p" | "format480p" | "format720p" | "format1080p"; loaded: boolean; }>
 */
async function test() {
	/**
	 * const result: {
	 *   format: "format1080p";
	 *   loaded: boolean;
	 * }
	 */
	const result = await loadFile(videoFormats, "format1080p")
	// (property) format: "format1080p"
	if (result.format != "format1080p") {
		throw new Error("Implementation is wrong")
	}
}

/**
 * To make sure that we’re also implementing the right thing, we define
 * a return type for the loadFile function where we expect the Key type
 * to appear.
 */
type Loaded<Key> = {
	format: Key
	loaded: boolean
}

async function loadFile2<Formats extends URLList, Key extends keyof Formats>(
	fileFormats: Formats,
	format: Key,
): Promise<Loaded<Key>> {
	const data = await fetch(fileFormats[format].href)
	return {
		format,
		loaded: data.status == 200,
	}
}

async function test2() {
	/**
	 * const result: Loaded<"format1080p">
	 */
	const result = await loadFile2(videoFormats, "format1080p")
	// (property) format: "format1080p"
	if (result.format != "format1080p") {
		throw new Error("Implementation is wrong")
	}
}
