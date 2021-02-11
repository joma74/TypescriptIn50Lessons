/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * Chapter 4 Union and Intersection Types
 * Lesson 22: Modeling Data
 * Lesson 23: Moving in the Type Space
 */
type Talk = { title: string; abstract: string; speaker: string }

type TechEventBase = {
	title: string
	description: string
	date: Date
	capacity: number
	rsvp: number
	// kind: "webinar" | "conference" | "meetup"
}

/**
 * With the TechEventBase, we form intersection types
 * Intersection Type(&)
 */
type Conference = TechEventBase & {
	kind: "conference"
	location: string
	price: number
	talks: Talk[]
}
type Meetup = TechEventBase & {
	kind: "meetup"
	location: string
	price: string
	talks: Talk[]
}

type Webinar = TechEventBase & {
	kind: "webinar"
	url: string
	price?: number
	talks: Talk
}

/**
 * But what happens if we get a list of tech events, where each
 * entry can be either a webinar, or a conference, or a meetup?
 * Where we don’t know exactly what entries we get, only that
 * they are of one of the three event types.
 *
 * What we get is a new type, a type that tries to encompass all
 * possible properties available from the types we set in union.
 *
 * Union Type(|) allow all values that are in either set
 */

type TechEvent = Webinar | Conference | Meetup

function printEvent(event: TechEvent) {
	if (event.price) {
		if (typeof event.price === "number") {
			console.log("Price in EUR: ", event.price)
		} else {
			console.log("It is free!")
		}
	}
	if (Array.isArray(event.talks)) {
		event.talks.forEach((talk) => {
			console.log(talk.title)
		})
	} else {
		console.log(`It's just a single talk ${event.talks.title}.`)
	}
}

/**
 * Lesson 24: Working with Value Types
 */

let withTypeAny: any = "conference" // top type "any"
let withTypeString: string = "conference" // primitive type string.
let withValueType: "conference" = "conference" // OMyGosh!

/**
 * let asTypeString: string
 */
let asTypeString = "conference" // Can change, hence string
/**
 * const asValueType: "conference"
 */
const asValueType = "conference" // Can NOT change, hence value type

type EventKind = "webinar" | "conference" | "meetup"

/**
 * When we add distinct value types to each specific tech event(kind),
 * something wonderful happens. Where before TypeScript just knew
 * that some properties of the big TechEvent union type existed or
 * didn't exist, with a specific value type for a property we
 * can directly point to the surrounding object type.
 *
 * Using value types for properties works like a hook for TypeScript to
 * find the exact shape inside a union. Types like this are called
 * discriminated union types , and they’re a safe way to move around in TypeScript’s type space.
 *
 * @param event
 */
function getEventTeaser(event: TechEvent) {
	switch (event.kind) {
		case "conference":
			return `${event.title} (Conference),` + `priced at ${event.price} USD`
		case "meetup":
			return `${event.title} (Meetup)` + `hosted at ${event.location} USD`
		case "webinar":
			return `${event.title} (Webinar)` + `available at ${event.url}`
		default:
			// Property 'title' does not exist on type 'never'.ts(2339)
			// return `${event.title} (?)`
			throw new Error("Not sure what to do with that!")
	}
}

const someObjectWithoutValueType = {
	kind: "conference",
	title: "Script conf",
	description: "The feel-good JS conference",
	capacity: 300,
	date: new Date("2019-10-25"),
	rsvp: 289,
	location: "Central Linz",
	price: 129,
	talks: [],
}
/**
 * kind: "conference"
 * Type '{ kind: string; ... }' is not assignable to type 'Meetup'.
 */
getEventTeaser(someObjectWithoutValueType)

/**
 * kind: "conference" as const
 */
const someObjectWithKindValueType = {
	kind: "conference" as const,
	title: "Script conf",
	description: "The feel-good JS conference",
	capacity: 300,
	date: new Date("2019-10-25"),
	rsvp: 289,
	location: "Central Linz",
	price: 129,
	talks: [],
}

getEventTeaser(someObjectWithKindValueType)

/**
 * Lesson 25: Dynamic Unions
 */
function filterByKind(list: TechEvent[], kind: EventKind): TechEvent[] {
	return list.filter((el) => el.kind === kind)
}

// A list of tech events we get from a back end
declare const eventList: TechEvent[]

filterByKind(eventList, "conference")
// Argument of type '"concert"' is not assignable to parameter of type 'EventKind'.ts(2345)
filterByKind(eventList, "concert")

/**
 * Lookup Types
 *
 * What if we get another event type to the existing list of event types, called Hackathon ?
 */
type Hackathon = TechEventBase & {
	kind: "hackathon"
	location: string
	price?: number
}

type TechEvent2 = TechEvent | Hackathon

/**
 * We would need to change type EventKind too, = "webinar" | "conference" | "meetup" | "hackathon"
 */
filterByKind(eventList, "hackathon")

declare const event: TechEvent
// Accessing the kind property via the index operator
console.log(event.kind)
/**
 * ! Doing the same thing on a type level
 */
type EventKind2 = TechEvent2["kind"]

function filterByKind3(list: TechEvent2[], kind: EventKind2): TechEvent2[] {
	return list.filter((el) => el.kind === kind)
}

filterByKind3(eventList, "hackathon")

/**
 * Mapped Types
 * Let's look at a function that groups events by their kind.
 */
type GroupedEvents = {
	conference: TechEvent2[]
	meetup: TechEvent2[]
	webinar: TechEvent2[]
	hackathon: TechEvent2[]
}

function groupEvents(events: TechEvent2[]): GroupedEvents {
	const grouped: GroupedEvents = {
		conference: [],
		meetup: [],
		webinar: [],
		hackathon: [],
	}
	events.forEach((el) => {
		grouped[el.kind].push(el)
	})
	return grouped
}

/**
 * With TypeScript we can create object types by running over a set
 * of value types to generate property keys, and assigning them
 * a specific type.
 *
 * We call this kind of type mapped type . Rather than having clear
 * property names, they use brackets to indicate a placeholder for
 * eventual property keys. In our example, the property keys are
 * generated by looping over the union type EventKind .
 */
type GroupedEvents2 = {
	[kind in EventKind2]: TechEvent2[]
}

function groupEvents2(events: TechEvent2[]): GroupedEvents2 {
	const grouped: GroupedEvents2 = {
		conference: [],
		meetup: [],
		webinar: [],
		hackathon: [],
	}
	events.forEach((el) => {
		grouped[el.kind].push(el)
	})
	return grouped
}
