# 14 - Data Clumps

## Issue

The same group of data items appears together in multiple places (e.g., as function parameters, component props, or fields in a class).  This indicates that these data items are conceptually related and should be grouped together into a single object.

## Detection

- **Repeated Parameter Lists:** The same set of parameters appears in multiple function signatures.
- **Repeated Props:** The same set of props is passed to multiple components.
- **Fields with Similar Prefixes/Suffixes:**  A class has several fields with names that share a common prefix or suffix (e.g., `addressStreet`, `addressCity`, `addressZip`).

## Solution

- **Introduce Parameter Object:**  Create a new object (or class, or interface/type in TypeScript) to represent the data clump.  Pass this object as a single parameter instead of multiple individual parameters.
- **Extract Class:** If the data clump has associated behavior, create a new class to represent the clump and move the related behavior into that class.
- **Use Existing Objects:** If an existing object already represents the data clump, use that object instead of creating a new one.
- **TypeScript Interfaces/Types:** In TypeScript, use interfaces or type aliases to define the shape of the data clump. This improves type safety and code readability.

**Example (Before):**

```typescript
function sendEmail(
  recipientName: string,
  recipientEmail: string,
  subject: string,
  body: string
) {
  // ...
}

sendEmail("Alice", "alice@example.com", "Hello", "How are you?");
sendEmail("Bob", "bob@example.com", "Greetings", "Nice to meet you.");
```

**Example (After):**

```typescript
interface Email {
  recipientName: string;
  recipientEmail: string;
  subject: string;
  body: string;
}

function sendEmail(email: Email) {
  // ...
}

const email1: Email = {
  recipientName: "Alice",
  recipientEmail: "alice@example.com",
  subject: "Hello",
  body: "How are you?",
};
sendEmail(email1);

const email2: Email = {
    recipientName: "Bob",
    recipientEmail: "bob@example.com",
    subject: "Greetings",
    body: "Nice to meet you."
}
sendEmail(email2)

```

The "after" example is more concise and makes the relationship between the data items clearer. It also makes it easier to add or remove data items from the clump in the future.

