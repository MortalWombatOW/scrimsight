# 15 - Primitive Obsession

## Issue

Using primitive data types (strings, numbers, booleans) to represent domain concepts that have specific rules or behaviors. This leads to code that's harder to understand, maintain, and extend.  It also increases the risk of errors.

## Detection

- **Strings for Everything:** Using strings to represent things like email addresses, phone numbers, ZIP codes, currencies, etc., when those things have specific formats or validation rules.
- **Numbers for Everything:** Using numbers to represent quantities that have units (e.g., meters, kilograms, seconds) without explicitly tracking the units.
- **Boolean Flags:** Using boolean flags to represent complex states or conditions.
- **Magic Numbers/Strings:** Using literal values (numbers or strings) without explanation or named constants.
- **Missing Validation:**  Lack of validation for data that should have specific constraints.
- **Repetitive Validation:** The same validation logic is repeated in multiple places.

## Solution

- **Introduce Value Objects:** Create small, immutable objects to represent domain concepts.  These objects should encapsulate the data and any associated validation or behavior.
- **Use Enums (where appropriate):**  For a fixed set of values, use enums (or union types in TypeScript) to represent the possible options.
- **Create Type Aliases (TypeScript):**  Use type aliases to give meaningful names to primitive types (e.g., `type EmailAddress = string;`).  This improves readability, but doesn't provide additional type safety.
- **Custom Hooks (React):** For validation and formatting logic that's specific to a UI component, consider using a custom hook.

**Example (Before):**

```typescript
function createUser(name: string, email: string, age: number) {
  // ... no validation ...
}

createUser("Alice", "invalid-email", -5); // No errors!
```

**Example (After):**

```typescript
class Email {
  readonly value: string;

  constructor(value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error("Invalid email address.");
    }
    this.value = value;
  }

  private isValidEmail(email: string): boolean {
    // ... email validation logic ...
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}

class Age {
    readonly value: number;
    constructor(value: number) {
        if (value < 0) {
            throw new Error("Age cannot be negative")
        }
        this.value = value
    }
}

function createUser(name: string, email: Email, age: Age) {
  // ...
}
//Good
createUser("Alice", new Email("alice@example.com"), new Age(30));

//Error: Argument of type 'string' is not assignable to parameter of type 'Email'.
// createUser("Bob", "invalid-email", -5);

//Error: Argument of type 'number' is not assignable to parameter of type 'Age'.
// createUser("Bob", new Email("bob@example.com"), -5);
```

The "after" example uses `Email` and `Age` value objects to encapsulate the data and validation logic. This makes the code more robust and easier to understand.  It also prevents invalid data from being used.
