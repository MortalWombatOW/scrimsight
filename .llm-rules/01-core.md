# 01 - Core Principles and Setup

## Project Structure

- **Components:** Use a component-based architecture with React.  Break the dashboard down into reusable components with single, well-defined responsibilities. Examples: `Navbar`, `Sidebar`, `MetricCard`, `ChartContainer`, `Table`, `FormInput`, `Button`.
- **Scrimsight Structure:**
    -   [App.tsx](mdc:src/App.tsx): The entrypoint for the app, responsible for layout and routing
    -   `src/pages`: The main pages for the app, contains other components. Gets data from atoms and passes it into components.
    -   `src/atoms`: State management using Jotai. Almost all data logic and transformation should be done here.
    -   `src/lib`: Utility functions and types
- **Workflow:**
  - The tasks are managed through the [index.md](mdc:tasks/index.md) and the tasks folder.
  - When starting a task, mark it on the list of tasks in index.md.
  - Confirm the details and write a step by step plan in a new file under /tasks.
  - When the work is done, make sure to update the new file with learnings.
  - Each change should be done in a new branch off of prod. Before branching, pull from prod.
  - Before submitting, always consider how to refactor the change to clean it up and reduce tech debt.
- **React instructions:**
  - Keep Components Small and Focused - each component should only be responsible for one thing.
  - Keep it DRY with Array Mapping - create an array of objects that hold all the necessary data and dynamically render them with a map function to avoid code repetition
  - Separation of concerns - make sure each part of the app only has one job to do.
  - Use Semantic Keys When Rendering Lists - make sure the key prop on a list element describes more than just the index.
  - Lazy-loading: use Suspense and React.lazy to maximize performance.

## CSS Foundation

- **Styling Priority:** Use DaisyUI and Tailwind CSS.
    1. DaisyUI component classes (e.g., `btn`, `card`).
    2. DaisyUI modifier classes (e.g., `btn-primary`).
    3. Tailwind utility classes (e.g., `flex`, `p-4`).
    4. Inline custom CSS (last resort).
- **Style Conflicts:** Use `!` to make a utility `!important` if needed.
- **Code Organization:** Group related CSS classes.