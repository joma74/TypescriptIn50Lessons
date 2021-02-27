/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

type Talk = { title: string; abstract: string; speaker: string }

type TechEventBase = {
	title: string
	description: string
	date: Date
	capacity: number
	rsvp: number
}

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

type Hackathon = TechEventBase & {
	kind: "hackathon"
	location: string
	price?: number
}

type TechEvent = Webinar | Conference | Meetup | Hackathon

/**
 * Chapter 4 Union and Intersection Types
 * Lesson 27: Down at the Bottom: never
 *
 * never doesn’t accept a single value at all. It’s impossible to assign a
 * value and, of course, there are no operations we can do on a type that
 * is never.
 *
 * With never we get a safeguard that can be used for situations that
 * could occur, but should never occur.
 */

function neverError(message: string, token: never) {
	return new Error(`${message}. ${token} should not exist`)
}

function getEventTeaser1(event: TechEvent) {
	switch (event.kind) {
		case "conference":
			return `${event.title} (Conference),` + `priced at ${event.price} USD`
		case "meetup":
			return `${event.title} (Meetup)` + `hosted at ${event.location}`
		case "webinar":
			return `${event.title} (Webinar)` + `available at ${event.url}`
		default:
			// Argument of type 'Hackathon' is not assignable to parameter of type 'never'.ts(2345)
			throw neverError("Not sure what to do with that!", event)
	}
}

function getEventTeaser2(event: TechEvent) {
	switch (event.kind) {
		case "conference":
			return `${event.title} (Conference),` + `priced at ${event.price} USD`
		case "meetup":
			return `${event.title} (Meetup)` + `hosted at ${event.location}`
		case "webinar":
			return `${event.title} (Webinar)` + `available at ${event.url}`
		case "hackathon":
			return `${event.title} (Webinar)` + `hosted at ${event.location}`
		default:
			// Argument of type 'Hackathon' is not assignable to parameter of type 'never'.ts(2345)
			throw neverError("Not sure what to do with that!", event)
	}
}

/**
 * Strict null Checks
 */
let age: number
// Variable 'age' is used before being assigned.ts(2454
age = age + 1

// const list: Element | null
const list = document.querySelector("event-list")
// Object is possibly 'null'.ts(2531)
list.append()
