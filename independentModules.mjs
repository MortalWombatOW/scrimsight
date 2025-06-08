// independentModules.mjs
// @ts-check

import { createIndependentModules } from "eslint-plugin-project-structure";

export const independentModulesConfig =
createIndependentModules({
  // debugMode: true,
  modules: [

    // App Index: src/index.tsx
    {
      name: "app-index",
      pattern: "src/index.tsx", 
      allowImportsFrom: [
        "src/App.tsx", 
        "src/index.css",
      ],
      errorMessage: "App index (src/index.tsx) can only import the main App component and index.css.",
    },
    // App: src/App.tsx
    {
      name: "app",
      pattern: "src/App.tsx", 
      allowImportsFrom: [
        "src/pages/index.tsx",    // page-index 
        "src/components/index.ts",  // component-index 
        "src/atoms/index.ts",     // atom-index 
        "src/lib/index.ts",       // library-index 
      ],
      allowExternalImports: true,
      errorMessage: "App (src/App.tsx) has restricted dependencies, can only import from pages index (@pages), components index (@components), atom index (@atoms), library index (@library), and external packages.",
    },
    // Atom Index: src/atoms/index.ts
    {
      name: "atom-index",
      pattern: "src/atoms/index.ts", 
      allowImportsFrom: [
       "src/atoms/*.ts", // atoms (for other atoms, e.g. '@atoms/filename.ts')
        "src/lib/index.ts", // library-index
      ],
      errorMessage: "Atom index (src/atoms/index.ts) can only import files from its own directory (e.g. '@atoms/filename.ts') or the library index (@library).",
    },
    // Component Index: src/components/index.ts
    {
      name: "component-index",
      pattern: "src/components/index.ts", 
      allowImportsFrom: [
        "src/components/*.tsx", 
      ],
      errorMessage: "Component index (src/components/index.ts) can only import files from '@components/filename.tsx'.",
    },
    // Icon Index: src/icons/index.ts
    {
      name: "icon-index",
      pattern: "src/icons/index.ts", 
      allowImportsFrom: [
        "src/icons/*.tsx", 
        "src/icons/*.svg",
      ],
      errorMessage: "Icon index (src/icons/index.ts) can only import files from '@icons/filename.tsx' or SVG files.",
    },
    // Page Index: src/pages/index.tsx
    {
      name: "page-index",
      pattern: "src/pages/index.tsx", 
      allowImportsFrom: [
        "src/pages/*.tsx", 
      ],
      errorMessage: "Page index (src/pages/index.tsx) can only import files from '@pages/filename.tsx'.",
    },
    // Library Index: src/lib/index.ts
    {
      name: "library-index",
      pattern: "src/lib/index.ts", 
      allowImportsFrom: [
        "src/lib/*.ts", 
      ],
      errorMessage: "Library index (src/lib/index.ts) can only import files from '@library/filename.ts'.",
    },
    // Sample Data Test: Special case for raw file imports
    {
      name: "sample-data-test",
      pattern: "src/atoms/sampleData.test.ts",
      allowImportsFrom: [
        "src/atoms/*.ts",      // atom (for testing specific atom)
        "src/atoms/index.ts",  // atom-index (for other atoms via index) 
        "src/lib/index.ts",    // library-index
        "src/lib/sampledata/*.txt", // raw sample data files
      ],
      errorMessage: "Sample data test (src/atoms/sampleData.test.ts) can import from atoms, atom index (@atoms), library index (@library), and raw sample data files.",
    },
    // Atom Test: src/atoms/*.test.ts (excluding sampleData.test.ts)
    {
      name: "atom-test",
      pattern: [["src/atoms/*.test.ts", "!src/atoms/sampleData.test.ts"]], 
      allowImportsFrom: [
        "src/atoms/*.ts",      // atom (for testing specific atom, e.g. './someAtom' or aliased) 
        "src/atoms/index.ts",  // atom-index (for other atoms via index) 
        "src/lib/index.ts",    // library-index 
      ],
      errorMessage: "Atom tests (src/atoms/*.test.ts) have restricted dependencies, can only import from an atom (@atoms/atomName), the atom index (@atoms), or the library index (@library).",
    },
    // Component Test: src/components/*.stories.tsx
    {
      name: "component-test",
      pattern: "src/components/*.stories.tsx", 
      allowImportsFrom: [
        "src/components/*.tsx",    // component (for testing specific component) 
        "src/atoms/index.ts",      // atom-index 
        "src/lib/index.ts",        // library-index 
        "src/components/index.ts", // component-index (for other components via index) 
        "src/icons/index.ts",      // icon-index (for icons via index)
      ],
      allowExternalImports: true,
      errorMessage: "Component stories (src/components/*.stories.tsx) have restricted dependencies, can only import from a component (@components/componentName), the component index (@components), icon index (@icons), the library index (@library), or allowed external packages.",
    },
    // Icon Test: src/icons/*.stories.tsx
    {
      name: "icon-test",
      pattern: "src/icons/*.stories.tsx", 
      allowImportsFrom: [
        "src/icons/*.tsx",         // icon (for testing specific icon) 
        "src/icons/index.ts",      // icon-index (for other icons via index) 
        "src/lib/index.ts",        // library-index 
      ],
      errorMessage: "Icon stories (src/icons/*.stories.tsx) have restricted dependencies, can only import from an icon (@icons/iconName), the icon index (@icons), or the library index (@library).",
    },
    // Library Test: src/lib/*.test.ts
    {
      name: "library-test",
      pattern: "src/lib/*.test.ts", 
      allowImportsFrom: [
        "src/lib/*.ts",       // library (for testing specific library) 
        "src/lib/index.ts",   // library-index (for other libraries via index) 
      ],
      errorMessage: "Library tests (src/lib/*.test.ts) have restricted dependencies, can only import from a library (@library/libraryName), or the library index (@library).",
    },
    // Sample Data Atom: Special case for raw file imports
    {
      name: "sample-data-atom",
      pattern: "src/atoms/sampleData.ts",
      allowImportsFrom: [
        "src/atoms/index.ts",   // atom-index (for types and other atoms)
        "src/lib/index.ts",     // library-index
        "src/lib/sampledata/*.txt", // raw sample data files
      ],
      errorMessage: "Sample data atom (src/atoms/sampleData.ts) can import from atom index (@atoms), library index (@library), and raw sample data files.",
    },
    // Atom: src/atoms/*.ts (excluding index, test files, and sampleData)
    {
      name: "atom",
      // pattern is an array of patterns: [include, !exclude1, !exclude2]
      // This is string[] which is a valid type for 'pattern'
      pattern: [["src/atoms/*.ts", "!src/atoms/index.ts", "!src/atoms/*.test.ts", "!src/atoms/sampleData.ts"]], 
      allowImportsFrom: [
        "src/atoms/index.ts", // atom-index (for other atoms) 
        "src/lib/index.ts",   // library-index 
      ],
      errorMessage: "Atoms (src/atoms/*.ts) can only import from the atom index (@atoms) or the library index (@library).",
    },
    // Component: src/components/*.tsx (excluding index and stories files)
    {
      name: "component",
      pattern: [["src/components/*.tsx", "!src/components/index.ts", "!src/components/*.stories.tsx"]], 
      allowImportsFrom: [
        "src/atoms/index.ts",     // atom-index 
        "src/lib/index.ts",       // library-index 
        "src/components/index.ts", // component-index (for other components) 
        "src/icons/index.ts",     // icon-index (for icons)
      ],
      allowExternalImports: true,
      errorMessage: "Components (src/components/*.tsx) have restricted dependencies, can only import from the atom index (@atoms), the library index (@library), the component index (@components), the icon index (@icons), or allowed external packages.",
    },
    // Icon: src/icons/*.tsx (excluding index and stories files)
    {
      name: "icon",
      pattern: [["src/icons/*.tsx", "!src/icons/index.ts", "!src/icons/*.stories.tsx"]], 
      allowImportsFrom: [
        "src/lib/index.ts",       // library-index 
        "src/icons/*.svg",        // SVG files
      ],
      errorMessage: "Icons (src/icons/*.tsx) have restricted dependencies, can only import from the library index (@library) or SVG files.",
    },
    // Page: src/pages/*.tsx (excluding index and stories files)
    {
      name: "page",
      pattern: [["src/pages/*.tsx", "!src/pages/index.tsx"]], 
      allowImportsFrom: [
        "src/components/index.ts", // component-index 
        "src/lib/index.ts",        // library-index 
      ],
      errorMessage: "Pages (src/pages/*.tsx) can only import from the component index (@components), or the library index (@library).",
    },
    // Library: src/lib/*.ts (excluding index and test files)
    {
      name: "library",
      pattern: [["src/lib/*.ts", "!src/lib/index.ts", "!src/lib/*.test.ts"]], 
      allowImportsFrom: [
        "src/lib/index.ts", // library-index (for other libraries) 
      ],
      errorMessage: "Libraries (src/lib/*.ts) can only import from the library index (@library).",
    },
  ],
});