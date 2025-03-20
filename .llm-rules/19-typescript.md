# 19 - TypeScript Best Practices

## Core Principles

- **Explicit Types:** Prefer explicit types over implicit `any`.  Use `any` and `unknown` sparingly and strategically.  `unknown` is generally safer than `any`.
- **Interfaces vs. Types:**  Use `interface` for defining the shape of objects, especially props and public APIs. Use `type` for type aliases, unions, intersections, and mapped types.  Consistency is key.
- **Strict Mode:** Enable strict mode (`"strict": true` in `tsconfig.json`). This enables a wide range of type-checking rules that result in more robust code.  Also consider enabling `"noImplicitAny"`, `"strictNullChecks"`, `"noImplicitThis"`, and `"alwaysStrict"`.
- **Descriptive Names:** Use descriptive names for types, interfaces, and variables.
- **Avoid `!` (Non-null Assertion):** Avoid using the non-null assertion operator (`!`) unless you are *absolutely certain* that a value cannot be `null` or `undefined`.  It's often better to use optional chaining (`?.`) or nullish coalescing (`??`) instead.
- **Generics:** Use generics to create reusable and type-safe components and functions.
- **Discriminated Unions:** For representing a value that can be one of several types, use discriminated unions (tagged unions) for improved type safety.
- **Utility Types:** Leverage TypeScript's built-in utility types (e.g., `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `NonNullable`, `Parameters`, `ReturnType`) to manipulate types effectively.
- **Type Guards:** Use type guards (e.g., `typeof`, `instanceof`, user-defined type guards) to narrow down types within conditional blocks.
- **Avoid `as any`:**  Avoid `as any` as much as possible. It completely disables type checking and defeats the purpose of using TypeScript.  If you must use it, add a comment explaining *why*.
- **Consistent `null` vs `undefined`:** Choose a convention for using `null` versus `undefined` and stick to it consistently.  Often, `undefined` is preferred for "missing" values, and `null` is used for intentionally absent values.
- **Document Complex Types:** Use JSDoc comments to document complex types and interfaces, explaining their purpose and how they should be used.

## Examples

```typescript
// GOOD: Explicit types
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// GOOD: Interface for object shape
interface User {
  id: number;
  name: string;
  email: string;
}

// GOOD: Type alias for union
type Result = SuccessResult | ErrorResult;

// GOOD: Generics
function identity<T>(arg: T): T {
  return arg;
}

// GOOD: Discriminated Union
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; sideLength: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
  }
}

// GOOD: Utility Types
interface Person {
    name: string
    age: number
    address: string
}
type PartialPerson = Partial<Person>; // Makes all properties optional
type NameAndAge = Pick<Person, "name" | "age">;

// GOOD: Type Guard
function isString(value: any): value is string {
  return typeof value === "string";
}

// BAD: Excessive 'any'
function processData(data: any) { // Avoid 'any' if possible
  // ...
}

// BAD: Non-null assertion without justification
function getValue(obj: { value: string | null }) {
  return obj.value!; // Avoid '!' unless absolutely necessary
}
```