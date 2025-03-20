# 17 - Excessive/Misleading Comments

## Issue

Over-reliance on comments to explain *what* the code is doing, rather than *why*.  Comments should be used sparingly to clarify non-obvious logic, not to compensate for poorly written code. Misleading or outdated comments are worse than no comments at all.

## Detection

- **Comments Explaining the Obvious:** Comments that simply restate what the code is already doing (e.g., `// Add 1 to x` above `x++;`).
- **Large Blocks of Commented-Out Code:**  Code that has been commented out, often indicating a previous version or an abandoned approach.
- **Outdated Comments:**  Comments that no longer accurately reflect the code's behavior.
- **TODO/FIXME Comments (without context):**  Comments like `// TODO: Fix this` without any explanation of *what* needs to be fixed or *why*.
- **"Clever" Comments:** Comments that try to be funny or witty but don't add any value.
- **Journal Comments:** Comments that describe the history of changes to the code (this should be handled by version control).
- **Noise Comments:** Comments that are redundant, irrelevant, or simply add visual clutter.

## Solution

- **Write Self-Documenting Code:**  Use descriptive variable and function names, and structure your code in a way that's easy to understand.
- **Extract Method/Function:** If a section of code needs a comment to explain it, extract that section into a well-named function.
- **Use Assertions:**  Use assertions to document assumptions and invariants.
- **Remove Redundant Comments:** Delete comments that are obvious, outdated, or misleading.
- **Explain *Why*, Not *What*:** If a comment is necessary, focus on explaining *why* the code is written the way it is, not *what* it's doing.
- **Use TODO/FIXME Comments Sparingly (with context):** If you use TODO or FIXME comments, include enough information to understand the issue and what needs to be done.  Consider linking to a ticket in your issue tracker.
- **Version Control for History:**  Use your version control system (e.g., Git) to track the history of changes, rather than relying on comments.

**Example (Bad):**

```typescript
// This function calculates the total price of the items in the cart
function calculateTotalPrice(items) {
  let total = 0; // Initialize total to 0
  for (let i = 0; i < items.length; i++) { // Loop through the items
    total += items[i].price * items[i].quantity; // Add the price * quantity to the total
  }
  return total; // Return the total
}
```

**Example (Good):**

```typescript
function calculateTotalPrice(items: Item[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
```
The good example is better because the function name explains the function, and the reduce call is more readable than the for loop.