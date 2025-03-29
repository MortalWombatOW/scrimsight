# 16 - Switch Statements (Conditional Complexity)

## Issue

Using large `switch` statements (or long chains of `if/else if`) to handle different cases based on a type code or state. This often indicates a violation of the Open/Closed Principle and can lead to code that's hard to maintain and extend. This is particularly relevant when the switch statement appears in multiple places.

## Detection

- **Large `switch` Statement:** A `switch` statement with many `case` clauses.
- **Long `if/else if` Chains:**  A long chain of `if/else if` statements that check for different types or states.
- **Type Checking:**  Code that explicitly checks the type of an object (e.g., using `instanceof` in JavaScript/TypeScript, or checking a type code property) before performing an action.
- **Duplicated Conditionals:** The same `switch` statement or `if/else if` chain appears in multiple places in the code.

## Solution

- **Polymorphism (Strategy/State Patterns):**  Replace the `switch` statement with polymorphism.  Create a separate class (or object) for each case, and let the object's type determine the behavior.  This often involves using the Strategy or State patterns.
- **Factory Method/Abstract Factory:** If the `switch` statement is used to create objects of different types, use a Factory Method or Abstract Factory pattern.
- **Lookup Table (Map/Object):**  For simple cases, use a lookup table (e.g., a JavaScript object or a `Map`) to map type codes to actions or objects.
- **Chain of Responsibility:** If the logic for handling each case is complex and might need to be extended, consider using the Chain of Responsibility pattern.

**Example (Before):**

```typescript
function calculateArea(shape: { type: string; width?: number; height?: number; radius?: number }) {
  switch (shape.type) {
    case 'rectangle':
      return shape.width * shape.height;
    case 'circle':
      return Math.PI * shape.radius * shape.radius;
    case 'triangle':
        return 0 //not implemented
    default:
      throw new Error('Invalid shape type.');
  }
}
```

**Example (After - using polymorphism):**

```typescript
interface Shape {
  calculateArea(): number;
}

class Rectangle implements Shape {
  constructor(public width: number, public height: number) {}

  calculateArea(): number {
    return this.width * this.height;
  }
}

class Circle implements Shape {
  constructor(public radius: number) {}

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}
class Triangle implements Shape {
    calculateArea(): number {
        return 0; //not implemented
    }
}

function calculateArea(shape: Shape): number {
  return shape.calculateArea();
}
```

The "after" example is more extensible.  To add a new shape, you just need to create a new class that implements the `Shape` interface, without modifying the `calculateArea` function.