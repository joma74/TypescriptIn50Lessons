/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * Chapter 4 Union and Intersection Types
 * Lesson 26: Object Keys and Type Predicates
 */

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

type TechEvent = Webinar | Conference | Meetup

type EventKind = TechEvent["kind"]

type UserEvents = {
	watching: TechEvent[]
	rvsp: TechEvent[]
	attended: TechEvent[]
	signedout: TechEvent[]
}

/**
 * key of
 */
function filterUserEvent(
	list: UserEvents,
	category: keyof UserEvents, // With keyof we can get the object keys of every type we define.
	filterKind?: EventKind,
) {
	const filteredList = list[category]
	if (filterKind) {
		return filteredList.filter((event) => event.kind === filterKind)
	}
}

/**
 * Type Predicates
 *
 * From both filter operations, the category filter is the problematic
 * one, as it could access a key that is not available in userEventList.
 */
function isCategoryOfList(
	list: UserEvents,
	category: string,
): category is keyof UserEvents {
	return Object.keys(list).includes(category)
}

function filterUserEvent2(
	list: UserEvents,
	category: string,
	filterKind?: EventKind,
) {
	if (isCategoryOfList(list, category)) {
		const filteredList = list[category]
		if (filterKind) {
			return filteredList.filter((event) => event.kind === filterKind)
		}
	}
	return list
}
