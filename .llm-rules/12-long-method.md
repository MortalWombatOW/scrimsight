# 12 - Long Method (Long Function)

## Issue

A function (including React component render functions) is too long.  Long functions are harder to understand, test, and maintain. They often indicate that the function is doing too much.

## Detection

- **High Line Count:**  A function exceeding, say, 20-30 lines is a warning sign.  Again, context matters, but shorter is generally better.
- **Nested Conditionals:** Deeply nested `if/else` or `switch` statements make the function's logic hard to follow.
- **Multiple Operations:** The function performs several distinct operations, rather than a single, well-defined task.
- **Difficult to Name:**  If you struggle to give the function a concise and descriptive name, it's likely doing too much.
- **Many Local Variables:**  A large number of local variables suggests the function is managing too much state.
- **Comments Explaining Blocks:**  If you need to add comments to explain what different sections of the function are doing, those sections should probably be extracted into separate functions.

## Solution

- **Extract Method (Function):**  Break down the long function into smaller, well-named functions. Each new function should perform a single, well-defined task.
- **Extract Component (for render functions):** If a React component's render function is too long, extract parts of the JSX into separate, smaller components.
- **Use Early Returns:**  Use `return` statements early in the function to avoid deep nesting of conditionals.  This is often called the "guard clause" pattern.
- **Compose Functions:**  Combine smaller functions to achieve the desired functionality.

**Example (Before):**

```typescript
function processOrder(order) {
  // Validate order
  if (!order.items || order.items.length === 0) {
    return { success: false, error: 'Order must have items.' };
  }
  if (!order.customer) {
    return { success: false, error: 'Order must have a customer.' };
  }

  // Calculate total
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }

  // Apply discount (if applicable)
  if (order.customer.isPremium) {
    total *= 0.9; // 10% discount
  }

  // Process payment
  const paymentResult = processPayment(order.customer, total);
  if (!paymentResult.success) {
    return { success: false, error: paymentResult.error };
  }

  // Update inventory
  updateInventory(order.items);

  return { success: true, total };
}
```

**Example (After):**

```typescript
function validateOrder(order) {
  if (!order.items || order.items.length === 0) {
    return { success: false, error: 'Order must have items.' };
  }
  if (!order.customer) {
    return { success: false, error: 'Order must have a customer.' };
  }
  return { success: true };
}

function calculateTotal(order) {
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }
  return total;
}

function applyDiscount(total, customer) {
  if (customer.isPremium) {
    return total * 0.9;
  }
  return total;
}


function processOrder(order) {
  const validationResult = validateOrder(order);
  if (!validationResult.success) {
    return validationResult;
  }

  let total = calculateTotal(order);
  total = applyDiscount(total, order.customer);

  const paymentResult = processPayment(order.customer, total);
  if (!paymentResult.success) {
    return { success: false, error: paymentResult.error };
  }

  updateInventory(order.items);

  return { success: true, total };
}
```

The "after" example is more readable and maintainable because each function has a single, clear responsibility.