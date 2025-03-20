# 13 - Feature Envy

## Issue

A method (or function) accesses the data of another object more than its own data. This indicates that the method might be better placed in the other object (or a related object).  In React, this often manifests as a component accessing props or state of a parent component excessively, or reaching deeply into nested prop structures.

## Detection

- **Excessive `this.props` or `this.state` Access (in another component):**  A component frequently accessing `props` or `state` of *another* component (not its own).  This is a strong indicator.
- **Many Getters on Another Object:**  The method calls many getter methods on another object to retrieve data.
- **Data Clumps:** The method uses several pieces of data from another object that are often used together.
- **Message Chains:**  Long chains of method calls to access nested data (e.g., `this.props.user.address.city`).

## Solution

- **Move Method:** Move the method to the class whose data it primarily uses.
- **Extract Method:** If the method accesses data from multiple objects, extract parts of the method into smaller methods and move those to the appropriate classes.
- **Introduce Parameter Object:** If the method uses a data clump, consider creating a new object (or using an existing one) to represent that clump and pass it as a parameter.
- **Delegate:**  If a component needs to access data from a parent, consider having the parent provide a specific function to perform the operation, rather than exposing its internal data directly.  This promotes encapsulation.
- **Use Context (sparingly):** If the data is truly global and needs to be accessed by many components, consider using React Context.  But avoid overusing Context for localized state.
- **Custom Hooks:** If the logic is reusable, extract it into a custom hook.

**Example (Before):**

```typescript
// Parent component
function ShoppingCart({ cartItems, user }) {
  function calculateTotal() {
    let total = 0;
    for (const item of cartItems) {
      total += item.price * item.quantity;
    }
    if (user.isPremium) { // Accessing user data here
      total *= 0.9;
    }
    return total;
  }

  const total = calculateTotal();

  return (
    <div>
      {/* ... display cart items ... */}
      <p>Total: ${total}</p>
    </div>
  );
}
```

**Example (After):**

```typescript
// Assuming a User object/class with a `applyDiscount` method
// and a Cart object/class with a calculateTotal method

function ShoppingCart({ cart, user }) {
  const total = cart.calculateTotal();
  const discountedTotal = user.applyDiscount(total);

  return (
    <div>
      {/* ... display cart items ... */}
      <p>Total: ${discountedTotal}</p>
    </div>
  );
}

//In some other file
class Cart {
    //...
    calculateTotal() {
        let total = 0;
        for (const item of this.items) {
            total += item.price * item.quantity
        }
        return total
    }
}

class User {
    //...
    applyDiscount(total) {
     if (this.isPremium) {
        return total * 0.9;
      }
      return total;
    }
}
```

The "after" example moves the `calculateTotal` logic to the `Cart` class and the discount logic to the `User` class, where they belong. The `ShoppingCart` component is now simpler and more focused.
