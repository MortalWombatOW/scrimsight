# Scrimsight

A web application for analyzing and visualizing Overwatch scrims.

---

## Development

### File Structure

There are four types of files in the project:

*   **atoms:** Jotai atoms that define the data flow in the application and can depend on other atoms or libraries.
*   **components:** React components that define the UI and can depend on atoms, libraries, or other components.
*   **pages:** React pages that define the UI and can depend on only components and libraries.
*   **lib:** JavaScript libraries that can be used in atoms, components, or other libraries.

The file structure is optimized for AI-assisted development, with the following conventions:

*   Strict constraints on file names and file locations to ensure conformance to project patterns.
*   Entry points for each type of file that expose the types but hide the implementation details.
*   Strict constraints on the implementation of each type of file to ensure consistency and maintainability.

---

### Code Quality and Compliance

The project maintains code quality and compliance through the following mechanisms:

*   **ESLint**: Configured via `eslint.config.mjs` with `@typescript-eslint`, `react`, `react-hooks`, `import`, `unused-imports`, `stylistic`, `path-alias`, and `boundaries` plugins. The `boundaries` plugin enforces the strict file structure defined in this README.
*   **Prettier**: Integrated with ESLint to handle code formatting, ensuring consistency across the codebase.
*   **CSS/SCSS Linting**: A dedicated linter for CSS/SCSS (e.g., Stylelint) is not currently configured.
*   **Pre-commit Hooks**: Automated pre-commit hooks (e.g., using Husky and lint-staged) are not actively configured.
*   **Manual Checks**: The `check-lint-build-errors.sh` script provides a manual method to run ESLint and TypeScript build checks for code quality verification.

---

#### Atoms

Jotai atoms are used to define the business logic of the application, and can depend on other atoms or libraries.
Each atom has a type, which is used to enforce type safety, and should be tested with vitest/jest.
Atoms can depend on other atoms, and can be used in components.

Atoms are exported from an entry point file which defines the type of the atom, describes it in natural language, and imports the implementation.

Each atom implementation file should define the atom implementation function separately from the atom definition in order to test it without the need for a full render. The atom is the **default export** of the file, and the implementation function is a named export called `{atomName}Fn`. The atom is responsible for fetching any needed data from other atoms, and passing it to and returning from the implementation function.


Atom types (e.g., `LogFileInputType`, `SampleDataType`) are defined and exported from the entry point file (`src/atoms/index.ts`).

The `src/atoms/index.ts` file is responsible for registering all available atoms. Each entry uses a `ScrimsightAtom<T>` type that includes the atom's `name`, a `description`, and the `atom` itself.

*   **Location:** `src/atoms/{atomName}.ts`
*   **Test Location:** `src/atoms/{atomName}.test.ts`
*   **Entrypoint:** `src/atoms/index.ts`
*   **Importing Type:** `import { atomNameType } from '@atoms';`
*   **Importing Atom:** `import { atomName } from '@atoms';`

**Things to check when refactoring atoms to use the new pattern:**

*   **Single Atom per File:**
    *   Does the `src/atoms/{atomName}.ts` file primarily define one logical atom?
    *   Is the main Jotai atom instance the **default export** of this file?

*   **Separate Testable Logic (`{atomName}Fn`):**
    *   Is the core business logic, data transformation, or asynchronous operation extracted into a **named export function** called `{atomName}Fn`?
    *   Is this function pure or easily testable in isolation (i.e., it takes necessary inputs and returns a predictable output or Promise)?
    *   The `{atomName}Fn` should only accept parameters essential for its core logic. Avoid passing Jotai's `get` to the `Fn` if it's not directly used by this core logic. The default exported atom is responsible for using `get` to fetch dependencies and then passing the resolved values to the `Fn`.
    *   Does the default exported atom correctly use this `{atomName}Fn`?
        *   For read-only atoms: Typically in the read function `atom(async (get) => get(anotherAtom).then(data => {atomName}Fn(data)))` or `atom(async (get) => {atomName}Fn(await get(anotherAtom)))`.
        *   For writable atoms: Typically in the write function `atom(..., (_get, set, update) => set(_internalAtom, {atomName}Fn(update)))`.

*   **Type Definition in Entry Point (`src/atoms/index.ts`):**
    *   Has the specific **type** for the atom's value (e.g., `MyAtomValueType`) been defined and exported from `src/atoms/index.ts`?
    *   Is this type imported and used correctly within the `src/atoms/{atomName}.ts` file (e.g., `const myAtom = atom<MyAtomValueType>(...)`)?

*   **Unit Test for `{atomName}Fn`:**
    *   Is there a corresponding `src/atoms/{atomName}.test.ts` file?
    *   Does this test file thoroughly unit test the `{atomName}Fn` with various inputs and edge cases?

*   **Registration in Entry Point (`src/atoms/index.ts`):**
    *   Is the refactored (default exported) atom imported into `src/atoms/index.ts`?
    *   Has an entry for this atom as a `ScrimsightAtom<T>[]` been defined, including its `name`, `description`, and the `atom` instance itself?
    *   Does the `ScrimsightAtom<T>` type (currently `atom: Atom<T>`) correctly accommodate the refactored atom (both synchronous and asynchronous atoms)?

*   **Consolidation (If Applicable):**
    *   If the old pattern involved separate atoms for state and mutation (e.g., `valueAtom` and `valueMutationAtom`), have these been consolidated into a single writable atom following the new pattern (using an internal state atom like `_valueAtom` if necessary, with the default export handling read/write)?

*   **Imports and Dependencies:**
    *   Are all internal dependencies (other atoms) correctly `get` within the atom's definition?
    *   Are import paths correct (e.g., using `@library` for library functions, relative paths for other atoms within the same directory if that's the convention)?
    *   **Importing for Registration vs. Consumption:**
        *   When **registering** an atom in `src/atoms/index.ts`, import the atom's default export directly from its file (e.g., `import myAtom from './myAtom';`).
        *   When **consuming** a registered atom elsewhere in the application, use the path alias (e.g., `import { myAtom } from '@atoms';`).
        *   Types defined in `src/atoms/index.ts` (e.g., `MyAtomType`) should be imported using the alias (e.g., `import { MyAtomType } from '@atoms';`).

*   **Naming Conventions:**
    *   File name: `src/atoms/{atomName}.ts`
    *   Test file name: `src/atoms/{atomName}.test.ts`
    *   Logic function: `{atomName}Fn`
    *   Type in `index.ts`: `{AtomName}Type`

---

#### Components

React components are used to define the UI of the application, styled with DaisyUI and Tailwind.
Each component should take as minimal props as possible to ensure flexibility and maintainability, and fetch data from atoms.
Components can depend on other atoms, components, or libraries.
Each component should be tested with Storybook 8 and Chromatic.
Components are exported from an entry point file which imports the implementation, so that it can be used elsewhere.

*   **Location:** `src/components/{componentName}.tsx`
*   **Test Location:** `src/components/{componentName}.stories.tsx`
*   **Entrypoint:** `src/components/index.ts`
*   **Importing:** `import { componentName } from '@components';`

---

#### Pages

React pages are used to define the UI of the application, styled with DaisyUI and Tailwind.
Pages get their props from the URL, and can depend on only components and libraries.
Pages are exported from an entry point file which imports the implementation, so that it can be used elsewhere.

*   **Location:** `src/pages/{pageName}.tsx`
*   **Test Location:** `src/pages/{pageName}.stories.tsx`
*   **Entrypoint:** `src/pages/index.ts`
*   **Importing:** `import { pageName } from '@pages';`

---

#### Libraries

Libraries are used to define reusable functionality that can be used in atoms, components, pages, or other libraries.
Each library should be tested with vitest.
Libraries are exported from an entry point file which imports the implementation and explains it in natural language.

*   **Location:** `src/lib/{libraryName}.ts`
*   **Test Location:** `src/lib/{libraryName}.test.ts`
*   **Entrypoint:** `src/lib/index.ts`
*   **Importing:** `import { libraryName } from '@lib';`
