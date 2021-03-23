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

- Pick
- Record
- Readonly, including Deep, Freeze
- Split Object's Properties Into Available Unions -> `type Split<Obj> = { [P in keyof Obj]: Record<P, Obj[P]> }[keyof Obj]`
- How To Merge Specific With General

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

- Type Point = [number, number] != [number, number]
- You have to use a function, just to make TS infer the correct type ("identity function")
- Unfortunately you can't have a function with one explicit generic parameter and one inferred parameter
- A Record prevents TS to detect an invalid object key

# References

- Book's Home at https://typescript-book.com/

# TODO

- Write test (Jest with ts-test) for 5-TaggedTemplateLiterals, Template as a function
- In 6-functionoverload.ts Fix|Evaluate: Type 'void' is not assignable to type 'Promise<Result[]>'
