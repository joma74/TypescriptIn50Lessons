/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * https://effectivetypescript.com/2020/06/16/typed-identity-functions/
 */

/**
 * 1. Example
 */
type Point = [number, number]
function distance([x1, y1]: Point, [x2, y2]: Point) {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

/**
 * Default
 */
const p1_1: Point = [0, 0]
const p1_2: Point = [3, 4]
let d = distance(p1_1, p1_2) // ok

/**
 * This should be ok, but is not
 */
let p2_1 = [0, 0]
let p2_2 = [3, 4]
distance(p2_1, p2_2) // ok Argument of type 'number[]' is not assignable to parameter of type 'Point'.

/**
 * Use identity functions that adjust the inferred type #1
 */
const Point = (x: number, y: number): Point => [x, y]
const p3_1 = Point(0, 0)
const p3_2 = Point(3, 4)
distance(p3_1, p3_2) // ok

/**
 * Use identity functions that adjust the inferred type #2
 *
 */
const tuple = <T extends unknown[]>(...args: T): T => args

const p4_1 = tuple(0, 0)
const p4_2 = tuple(3, 4)
distance(p4_1, p4_2) // ok

/**
 * 2. Example
 *
 * Now, some extended usage of an identity function
 */

const capitals_1 = {
	ny: [-73.7562, 42.6526],
	ca: [-121.4944, 38.5816],
	ak: [-134.4197, 58.3019],
}

distance(capitals_1.ny, capitals_1.ak) // (ok) Argument of type 'number[]' is not assignable to parameter of type 'Point'.ts(2345)

/**
 * What it does
 * 1. In order to infer the object's type as something different,
 *    we first need to capture it in a generic argument, just like we did with tuple.
 *
 *    Unfortunately you can't have a function with one explicit generic parameter and one
 *    inferred parameter. TypeScript will either infer all the generic parameters to a
 *    function or none of them, not a mix.
 *
 * @returns a Record with all values inferred as V
 */
const withValueType = <V extends unknown>() => <
	T extends Record<PropertyKey, V>
>(
	o: T,
) => o

const capitals_2 = withValueType<Point>()({
	ny: [-73.7562, 42.6526],
	ca: [-121.4944, 38.5816],
	ak: [-134.4197, 58.3019],
})

distance(capitals_2.ny, capitals_2.ak)

/**
 * In contrast to withValueType, this Record fixes the type error, but prevents
 * TS to produce an error when accessing an invalid key.
 */
const capitals_3Rec: Record<string, Point> = {
	ny: [-73.7562, 42.6526],
	ca: [-121.4944, 38.5816],
	ak: [-134.4197, 58.3019],
}

distance(capitals_3Rec.whit, capitals_3Rec.ak)

/**
 * Works only, if keys are written explicitly
 */
const capitals_4Rec: Record<"ny" | "ca" | "ak", Point> = {
	ny: [-73.7562, 42.6526],
	ca: [-121.4944, 38.5816],
	ak: [-134.4197, 58.3019],
}

distance(capitals_4Rec.whit, capitals_4Rec.ak) // (ok) Property 'whit' does not exist on type 'Record<"ny" | "ca" | "ak", Point>'.

/**
 * 3. Example
 *
 * Define an object that has some (but not all) of the fields of another object
 */

type CSSColor = "aliceblue" | "antiquewhite" | "aqua" | "black"
interface DisplayValue {
	value: number
	units: string
	color: CSSColor
	style: "regular" | "bold" | "italic" | "bolditalic"
}
const defaults_1 = {
	color: "black",
	style: "regular",
}
const distanceToJupiter_1: DisplayValue = {
	...defaults_1,
	value: 25_259_974_097_204,
	units: "inches",
} // (ok) Types of property 'color' are incompatible. Type 'string' is not assignable to type 'CSSColor'.ts(2322)

const defaults_2 = {
	color: "black" as const,
	style: "regular" as const,
}

const distanceToJupiter_2: DisplayValue = {
	...defaults_2,
	value: 25_259_974_097_204,
	units: "inches",
}

/**
 * @template V the explicit Generic, for which x must be a subset of
 *
 * @returns a Record whose keys and values are subsets of V
 */
const withValueTypesFrom = <V extends unknown>() => <K extends keyof V>(
	x: Pick<V, K>,
): Pick<V, K> => x

const distanceToJupiter_3 = withValueTypesFrom<DisplayValue>()({
	color: "black",
	style: "regular",
})

const distanceToJupiter_4 = withValueTypesFrom<DisplayValue>()({
	color: "white",
	style: "normal",
}) // (ok) Type '"white"' is not assignable to type 'CSSColor'.ts(2322)

const distanceToJupiter_5 = withValueTypesFrom<DisplayValue>()(defaults_2)
