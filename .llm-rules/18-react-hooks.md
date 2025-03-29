# 18 - React Hooks Rules

## Core Principles

- **Only Call Hooks at the Top Level:** Don't call Hooks inside loops, conditions, or nested functions. This ensures that Hooks are called in the same order each time a component renders.
- **Only Call Hooks from React Functions:** Call Hooks from React function components or custom Hooks. Don't call Hooks from regular JavaScript functions.
- **Use the ESLint Plugin:**  Use the `eslint-plugin-react-hooks` ESLint plugin to automatically enforce the Rules of Hooks.  This is *critical* for preventing subtle bugs.
- **Custom Hooks for Logic:** Encapsulate reusable stateful logic in custom Hooks.  Name custom Hooks starting with `use` (e.g., `useFetchData`, `useFormInput`).
- **`useEffect` Dependencies:** Be *extremely* careful with the dependency array in `useEffect`.  Missing dependencies can lead to stale data and subtle bugs.  The ESLint plugin helps, but you must understand *why* a dependency is needed.  If you're intentionally omitting a dependency, add a comment explaining why.
- **`useEffect` Cleanup:** If a `useEffect` hook sets up a subscription or has side effects that need to be cleaned up (e.g., event listeners, timers), *always* return a cleanup function from the effect.
- **`useCallback` and `useMemo`:** Use `useCallback` to memoize callbacks and `useMemo` to memoize values.  This is important for performance optimization, especially when passing props to child components, to prevent unnecessary re-renders. However, don't overuse them; premature optimization can make code harder to read. Only use them when there's a measurable performance benefit.
- **Avoid Inline Functions in JSX:** Avoid creating new functions within JSX props (e.g., `<button onClick={() => handleClick()}>`).  This creates a new function on every render, which can cause performance issues, especially with `PureComponent` or components using `React.memo`.  Use `useCallback` to memoize the function instead.
- **`useState` with Functions:** If the initial state of a `useState` hook is computationally expensive, use a function to initialize it lazily: `useState(() => computeInitialState())`.
- **Prefer `useReducer` for Complex State:** For complex state logic that involves multiple sub-values or transitions, prefer `useReducer` over `useState`. This makes state updates more predictable.

## Examples (Bad):

```javascript
// BAD: Hook inside a condition
function MyComponent({ condition }) {
  if (condition) {
    const [count, setCount] = useState(0);
  }
  // ...
}

// BAD: Hook inside a loop
function MyComponent({ items }) {
    const [counts, setCounts] = useState([])
  for (let i = 0; i < items.length; i++) {
      const [num, setNum] = useState(i) //incorrect
      counts.push(num)
  }
  // ...
}

// BAD: Missing useEffect dependency
function MyComponent({ id }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/data/${id}`); // 'id' is missing!
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []); // Missing 'id' in the dependency array
  // ...
}

// BAD: No useEffect cleanup
function MyComponent() {
  useEffect(() => {
    window.addEventListener('resize', handleResize); // No cleanup!
  }, []);
  // ...
}
```

## Examples (Good):

```javascript
// GOOD: Hook at the top level
function MyComponent({ condition }) {
  const [count, setCount] = useState(0);
  // ...
}

// GOOD: useEffect with dependency and cleanup
function MyComponent({ id }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/data/${id}`);
      const result = await response.json();
      setData(result);
    }
    fetchData();

    // Cleanup function
    return () => {
      // Perform any necessary cleanup, e.g., cancel the fetch if it's still in progress
    };
  }, [id]); // 'id' is included in the dependency array
  // ...
}

// GOOD: useEffect with cleanup
function MyComponent() {
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup!
    };
  }, []);
  // ...
}

// GOOD: useCallback for memoized callback
function MyComponent({ onItemClick }) {
  const handleClick = useCallback(() => {
    onItemClick(someData);
  }, [onItemClick, someData]); // Dependencies are listed

  return <button onClick={handleClick}>Click Me</button>;
}
```
