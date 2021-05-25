# Typescript in 50 Lessons

## 1-example

- Enter unknown, 42
- Excess property check, 46
- Declaration merging for interfaces, 54

## 2-example

- type import, 49
- From d.ts exported type, no module
- From d.ts exported type, with module

## 3-function

- order of arguments, shape
- optional parameter
- substitutability
- substituteable return type void

## 4-this-that

- Function declarations with this

## 5-taggedtemplateliterals

- Template as a function (TemplateStringsArray)

## 6-functionoverload

- implementation-following-overload-defs
- void as return's security gate
- overload function types(fails, see TODO)

## 7-generatorfunctions

## 8-unionintersectiontypes

- Value Types
- Index Access Types or Lookup Types
- Mapped Types

## 9-objectkeystypredicates

- key of
- type predicate

## 10-never-undefinednull

- never as a safeguard
- strictNullChecks
- helper neverError(message: string, token: never) for switch statements

## 11-tupletypes

- individual type arrays

## 12-generics

- Generic
- Generic with extends boundary
- Index Type
- extends keyof

## 13-genericmappedtypes

Any of the implementation of the next-listed mapped types are crucial for a sound TypeScript experience:

- Pick: _From T, pick a set of properties whose keys are in the union K_ -> `type Pick<T, K extends keyof T> = { [Key in K]: T[Key]; }`
- Record: _Construct a type with a set of properties K of type T_ -> `type Record<K extends string | number | symbol, T> = { [P in K]: T; }`
- Readonly: _Make all properties in T readonly_ -> `type Readonly<T> = { readonly [P in keyof T]: T[P]; }`

Based upon the crucial above

- Freeze: `Object.freeze(obj: Obj)` turns the given type into -> `Readonly<Obj>`
- Deep: Features a recursion on type's properties -> `type DeepReadonly<Obj> = { readonly [Key in keyof Obj]: DeepReadonly<Obj[Key]> }`
- Split: Splits type's properties into available unions -> `type Split<Obj> = { [P in keyof Obj]: Record<P, Obj[P]> }[keyof Obj]` such that
  ```
  type VideoFormatURLs = {
    format360p: URL;
    format480p: URL;
    format720p: URL;
    format1080p: URL;
  }
  ->
  type AvailableFormats = Split<VideoFormatURLs>
  ->
  type AvailableFormats = Record<"format360p", URL> | Record<"format480p", URL> | Record<"format720p", URL> | Record<"format1080p", URL>
  ->
  const HQ: AvailableFormats = {
    format720p: new URL(""),
    format1080p: new URL(""),
  } // (ok)
  const LQ: AvailableFormats = {
    format180p: new URL(""),
  } // (ok)
  ```
- How To Merge Specific With General:
  ```
  function combinePreferences(
    defaultUP: UserPreferences,
    userP: Optional<UserPreferences>,
  ) {
    return { ...defaultUP, ...userP }
  }
  ```

## 14-bindinggenerics

- Binding to Generics allows more versatility, especially for value types
- The intersection of two distinct value types always results in never

## 15-generictypedefaults

- generic default parameter
- caution against generic binding, because then infer is canceled out

## 16-ifthisthanthat

- Conditional Types
- Combining Function Overloads and Conditional Types
  - TODO But ? just fucks up
- Function Overloads Are Fine With Conditional Types

## 17-distributiveconditionals

- Never as a stop point in Conditional Types
- createMedium
  - TODO But ? just fucks up, Conditionals
- NonNullable and Low-Level Utilities
  - Promised
  - Flatten
  - isNonOptional

## 18-thinkingintypes

- union types for function overloads
- conditional types with infer
- variadic tuple types

## 25-conditionaltypesints

- dispatch with two split parameters
- function body, to narrow args ...
  - with isType by assertion over same type as the
    parameter type (see dispatch7)
  - with unifiying type and args as target type (
    somehow defeats the split parameters purpose) (see dispatch8)

## 26-tocamel

- Template literal types
- Key Remapping in Mapped Types

## 28-createnewinterferencesite

- With Classes
- With Currying

## 29-typesaferouter

- Apply create new inference site with a class
- An interface's key is a PropertyKey by string | number | symbol
- To narrow the type to an interface's key, one can either e.g. `Extract<keyof API, string>` or `keyof API & string`
- LensOver into type by `type LensOver<T, K> = T[K & keyof T]` for e.g. `API[Path]`

## 30-typedidentityfunction

- `Type Point = [number, number]` != `[number, number]`
- You have to use a function, just to make TS infer the correct type ("identity function")
- Unfortunately you can't have a function with one explicit generic parameter and one inferred parameter
- A Record prevents TS to detect an invalid object key

## 31-converttupletypesintounion

- With [number] on a tuple you'll retrieve all properties on the tuple which can be accessed with a numeric index ->

```
const categories = ["beginner", "intermediate", "advanced"] as const
->
type Category = typeof categories[number] // (ok) type Category = "beginner" | "intermediate" | "advanced"
```

## 32-mergedefault

- `typeof foo` on an object is more ad-hoc flexible than typeing it explicitly

Get toys in, get them grouped by type out `function groupToys(toys: Toy[]): GroupedToys`

1. Union by literal type `Toy["kind"]`
2. a Grouped by kind of each member of a union `{ [Kind in Toy["kind"]]: Toy[] }`
3. b Grouped by kind of each member of a union with s postfixed Plus valued by according type of each member of the union `` { [Kind in Toy["kind"] as `${Kind}s`]: Extract<Group, { kind: Kind }>[] } ``

## 33-prefertypealiasesoverinterfaces

- types are final, interfaces are not
- types are therefore more type savvier

## 34-filterusera

- Filter objects by the same object`s type props as criteria, one type in hierarchy
- Get all object keys as list: `Object.keys(criteria) as (keyof User)[]`

## 35-filteruserb

- Filter objects by the same object`s type props as criteria, all types in hierarchy
- Get all object keys as list: `const getObjectKeys = <T>(obj: T) => Object.keys(obj) as (keyof T)[]`
- Overload methods with types in covariant function parameter positions

## 36-overrideintersectionpoftypes

- Make new type out of other interfaces and overridden prop
  - Any prop must be ommited from interfaces first before overridden

### 37-promisifyacallback

- A callback function is supplied as an argument to a higher-order function(hordfunc) that invokes (“calls back”) the callback function to perform an operation. What’s important is that the hordfunc takes the full responsibility of invoking the callback and supplying it with the right arguments.
  - A hordfunc is typically of signature `hordfunc: (callback: (hordfuncresult: TypeOfHordfuncResult) => void) => void`
  - The hordfunc is told via the callback, who's next to work on it's results (action chaining)
- How compiler inference works
  - Corollary: You do not have to assign a type to a generic if compiler inference works
  - This observation is made also in https://betterprogramming.pub/understanding-typescript-type-inference-4c25f9777e9e
  - Implicit form(Compiler later inferences concrete types): `type funcname = <T>(...args: T[]) => T`
  - Explicit form(Dev later defines concrete types): `type funcname<T> = (...args: T[]) => T`
  - How inference site for function signature work (See also https://stackoverflow.com/a/59055819/3274229)
- Model the input and model the output separately first

### 38-generictypeinferonfunction

Exercises implicit and explicit generic type inference on functions

- Implicit form: `function funcname<T>(...)` or `type Funcname = <T>(...) => ...`. May be either used untyped(implicitly inferred) or typed(explicitly).
  - Usage Untyped: `funcname(...)`
  - Usage Inline Typed: `funcname<typeof A>(...)`
  - Usage Extra Typed: `const funcname: Funcname = ...`
- Explicit form: `type Funcname<T> = (...) => ...`.
  - Usage Untyped: Almost not working. Only if generic is with default, but usage is then by luck.
  - Usage Inline Typed: Not supported.
  - Usage Extra Typed: `const funcname: Funcname<typeof A> = (...) => ...; funcname(...)`

P.S. To define and type a function, one can do

- Inline Typing:
  - `function funcname<...>(...) {...}`
- Extra Typing:
  - `let funA: Funcname = function funcname<...>(...) {...}`
  - `function funcname<...>(...) {...} as Funcname`
  - `type Funcname = <...>(...) => ...; const funcname: Funcname = (...) => ...`
  - Asserting a type on an arrow function `as Fun` is not supported by TypeScript: ~~`const funcname = (...) => { ...} as Funcname`~~

### 39-funoverloadswithinterface

In these examples, all functions have to handle overloads with optional, up to two parameters and self returns. If the second parameter is not given, it must return curried the function or value, whichever is given as the first parameter.

- _*MapFunc*_
- _*FilterFunc*_
- _*ArithmeticFunc*_
- _*PropObjFunc*_: Get Property Value From Some Object. Features this beauty:
  `<K extends string> .. <O extends { [key in K]: O[key] }>(obj: O): O[K]`: breakdown
  - `<K extends string>` is assumed to be some object key literals that are bound as K.
  - `<O extends {...}>` means "Where O is a subtype of of `{...}` only if it matches the shape of `{...}`".
  - The shape of `{...}` matches only if `O[key]` returns for `[key in K]`, else it is `ts(2345)/unkown property`. The index signature `[key in K]` requires that index keys of `O` via `O[key]` be members of the union of literal strings `K`.
  - `O` is in the parameter position

### 40-objectwithnewprops

### 41-typechallenges

#### Algebraic Datatypes

- In https://github.com/microsoft/TypeScript-New-Handbook/blob/master/reference/Assignability.md#algebraic-assignability RyanCavanaugh displays some thinking on algebraic? assignability

  > When a union is the source, every element needs to be assignable to the target.
  > So `A | B | C ⟹ B` is not true in general. It's only true when the target is a supertype of all elements of the source.
  > ... First, if B is assignable to A, then keyof A is assignable to keyof B:
  >
  > ```
  > keyof A ⟹ keyof B
  > B ⟹ A
  > ```
  >
  > The reason the direction A -> B flips to B -> A is due to the exhaustivness check.
  >
  > ```
  > A = { a, b }
  > B = { a, b, c }
  > ```
  >
  > Here, B has an extra property c, so it's OK to assign B to an A with fewer properties (`B ⟹ A`).
  >
  > Regarding keys. `keyof A ⟹ keyof B` holds because `"a" | "b" ⟹ "a" | "b" | "c"`.

#### `[]` Is Not Equal To `any[]`

`[]` denotes only an empty array.

`any[]` denotes

# References

- Book's Home at https://typescript-book.com/

# TODO

- Write test (Jest with ts-test) for 5-TaggedTemplateLiterals, Template as a function
- In 6-functionoverload.ts Fix|Evaluate: Type 'void' is not assignable to type 'Promise<Result[]>'
