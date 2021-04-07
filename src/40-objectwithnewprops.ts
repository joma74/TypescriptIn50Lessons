/* eslint-disable no-undef, no-unused-vars, @typescript-eslint/no-unused-vars */

// Make it a module
export {}

/**
 * https://typescript-exercises.github.io/#exercise=15&file=%2Findex.ts
 */

type ObjectWithNewProp<T, K extends string, V> = T & { [Key in K]: V }

class ObjectManipulator<T> {
	constructor(protected obj: T) {}

	public set<K extends string, V>(
		key: K,
		value: V,
	): ObjectManipulator<ObjectWithNewProp<T, K, V>> {
		return new ObjectManipulator({
			...this.obj,
			[key]: value,
		}) as ObjectManipulator<ObjectWithNewProp<T, K, V>>
	}

	public get<K extends keyof T>(key: K) {
		return this.obj[key]
	}

	public delete<K extends keyof T>(key: K): ObjectManipulator<Omit<T, K>> {
		const newObj = { ...this.obj }
		delete newObj[key]
		return new ObjectManipulator(newObj)
	}

	public getObject(): T {
		return this.obj
	}
}

const test1 = new ObjectManipulator({})
	.set("x", 123)
	.set("y", "hello")
	.getObject() // (ok) const test1: ObjectWithNewProp<{ x: number; }, "y", string>

const test2 = new ObjectManipulator({})
	.set("x", 123)
	.set("y", "hello")
	.set("z", true)
	.delete("z")
	.delete("y")
	.getObject() // (ok) const test2: Omit<Omit<ObjectWithNewProp<ObjectWithNewProp<{ x: number;}, "y", string>, "z", boolean>, "z">, "y">

const test3 = new ObjectManipulator({})
	.set("x", 123)
	.set("y", "hello")
	.delete("y")
	.get("x") // (ok) const test3: number

const test4 = new ObjectManipulator({ x: true, y: "hello" })
	.delete("y")
	.get("x") // (ok) const test4: boolean
