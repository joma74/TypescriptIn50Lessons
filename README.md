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

# References

- Book's Home at https://typescript-book.com/

# TODO

- Write test (Jest with ts-test) for 5-TaggedTemplateLiterals, Template as a function
- In 6-functionoverload.ts Fix|Evaluate: Type 'void' is not assignable to type 'Promise<Result[]>'
