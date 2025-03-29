```markdown
# 11 - Large Class (God Component)

## Issue

A React component (or a Jotai atom, utility function file, etc.) has grown too large and has too many responsibilities. This violates the Single Responsibility Principle (SRP) and makes the code harder to understand, maintain, and test.  It often indicates a missed opportunity for component composition or the extraction of custom hooks.

## Detection

- **High Line Count:**  A component file exceeding, say, 200 lines is a strong warning sign.  (This is a guideline, not a hard rule.  Context matters.)
- **Multiple Concerns:** The component handles unrelated logic. Examples:
    - Fetching data *and* managing complex UI state *and* performing intricate data transformations *and* handling user input validation.
    - Managing both parent and child component state.
- **Difficult to Test:**  Writing unit tests that cover all aspects of the component is cumbersome.
- **"And" in the Name/Description:** If you describe the component's purpose and use the word "and" multiple times, it likely has too many responsibilities.  (e.g., "This component fetches data *and* displays it in a table *and* handles sorting *and* filtering.")
- **Many `useState` or `useReducer` Hooks:**  A large number of state variables within a single component suggests it might be managing too much state.
- **Many `useEffect` Hooks:**  A large number of side effects, especially if they're unrelated, is a red flag.
- **Props Drilling:** Passing many props down through multiple levels of child components.

## Solution

- **Extract Components:** Break down the large component into smaller, more focused components. Each new component should have a single, well-defined responsibility.  Use composition to combine them.
- **Extract Custom Hooks:**  If the component contains reusable logic (state management, side effects, data fetching), extract that logic into custom hooks (e.g., `useDataFetching`, `useFormValidation`, `usePagination`).
- **Move Logic to Atoms:** If the logic is related to application state, move it to Jotai atoms.  Components should ideally consume data from atoms, not perform complex data transformations themselves.
- **Use Render Props or Compound Components:** For complex UI patterns, consider render props or compound components to improve flexibility and reduce prop drilling.
- **Consider Higher-Order Components (HOCs):**  Less common in modern React, but HOCs can be used to add shared behavior to multiple components (use with caution, as they can make the component tree harder to follow).
- **Utilize Context (Carefully):** If you need to share state across many components without prop drilling, consider using React Context. However, avoid overusing Context, as it can make it harder to track where data is coming from.  Use it for truly global state, not for localized component state.
- **Favor Composition:** Break down complex logic into a series of smaller, composable functions.

**Example (Before):**

```typescript
// src/components/ProductList.tsx
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredProducts.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Example (After - using custom hook and component extraction):**

```typescript
// src/components/ProductList.tsx
import useProducts from '../hooks/useProducts'; // Custom hook
import ProductSearch from './ProductSearch';
import ProductItem from './ProductItem';

function ProductList() {
  const { products, loading, error, filterProducts } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <ProductSearch onSearch={filterProducts} />
      <ul>
        {products.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}

// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';

function useProducts() {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setAllProducts(data)
      } catch (err : any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

    const filterProducts = (searchTerm : string) => {
        if (!searchTerm) {
            setProducts(allProducts)
            return;
        }
        const filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(filteredProducts)
    }

  return { products, loading, error, filterProducts };
}

export default useProducts

// src/components/ProductSearch.tsx
import {useState} from "react"
interface ProductSearchProps {
    onSearch: (term: string) => void
}
function ProductSearch({onSearch}: ProductSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => {
          setSearchTerm(e.target.value)
          onSearch(e.target.value)
      }}
    />
  );
}
export default ProductSearch

// src/components/ProductItem.tsx
interface ProductItemProps {
    product: any
}
function ProductItem({product}: ProductItemProps) {
  return (
    <li>{product.name}</li>
  );
}
export default ProductItem
```

The "after" example demonstrates:

-   **Custom Hook:** `useProducts` encapsulates data fetching and filtering logic.
-   **Component Extraction:** `ProductSearch` and `ProductItem` handle specific UI concerns.
-   **Single Responsibility:** Each component and hook has a clear, focused purpose.
- **Improved Readability**

```