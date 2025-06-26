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
        "src/pages/*.tsx", 
        "src/components/*.tsx",
      ],
      allowExternalImports: true,
    },
    // Component Test: src/components/*.stories.tsx
    {
      name: "component-test",
      pattern: "src/components/*.stories.tsx", 
      allowImportsFrom: [
        "src/components/*.tsx",    // component (for testing specific component) 
        "src/lib/*.ts",        // library (for testing specific library)
        "src/atoms/*.ts",       // atoms (for realistic testing scenarios)
      ],
      allowExternalImports: true,
    },
    // Icon Test: src/icons/*.stories.tsx
    {
      name: "icon-test",
      pattern: "src/icons/*.stories.tsx", 
      allowImportsFrom: [
        "src/icons/*.tsx",         // icon (for testing specific icon) 
      ],
    },
    // Library Test: src/lib/*.test.ts
    {
      name: "library-test",
      pattern: "src/lib/*.test.ts", 
      allowImportsFrom: [
        "src/lib/*.ts",
        "src/lib/sampledata/*",
      ],
    },
    // Atom: src/atoms/*.ts (excluding index, test files, and sampleData)
    {
      name: "atom",
      // pattern is an array of patterns: [include, !exclude1, !exclude2]
      // This is string[] which is a valid type for 'pattern'
      pattern: [["src/atoms/*.ts", "!src/atoms/*.test.ts",]], 
      allowImportsFrom: [
        "src/atoms/*.ts",
        "src/lib/*.ts",
      ],
    },
    // Component: src/components/*.tsx (excluding index and stories files)
    {
      name: "component",
      pattern: [["src/components/*.tsx", "!src/components/*.stories.tsx"]], 
      allowImportsFrom: [
        "src/atoms/*.ts", 
        "src/lib/*.ts",
        "src/hooks/*.ts",         // hooks (for React hooks)
        "src/components/*.tsx", 
        "src/icons/*.tsx", 
      ],
      allowExternalImports: true,
    },
    // Icon: src/icons/*.tsx (excluding index and stories files)
    {
      name: "icon",
      pattern: [["src/icons/*.tsx"]], 
      allowImportsFrom: [
        "src/icons/*.svg",        // SVG files
        "src/lib/*.ts",          // library types (for proper typing)
      ],
    },
    // Page: src/pages/*.tsx (excluding index and stories files)
    {
      name: "page",
      pattern: [["src/pages/*.tsx", "!src/pages/index.tsx"]], 
      allowImportsFrom: [
        "src/components/*.tsx",
        "src/icons/*.tsx",
        "src/lib/*.ts",
        "src/hooks/*.ts",        // hooks (for React hooks)
        "src/atoms/*.ts",        // atoms (for state management)
      ],
      allowExternalImports: true,
    },
    // Library: src/lib/*.ts (excluding index and test files)
    {
      name: "library",
      pattern: [["src/lib/*.ts", "!src/lib/index.ts", "!src/lib/*.test.ts"]], 
      allowImportsFrom: [
        "src/lib/**/*.ts",
      ],
    },
    // Hook: src/hooks/*.ts - React hooks that can use atoms and lib files
    {
      name: "hook",
      pattern: [["src/hooks/*.ts"]], 
      allowImportsFrom: [
        "src/atoms/*.ts",          // atoms (for state management)
        "src/lib/*.ts",           // library (for utilities)
        "src/lib/**/*.ts",        // library subdirectories (for sampledata)
        "src/lib/sampledata/*",   // sampledata files (including raw text imports)
      ],
      allowExternalImports: true,  // Allow React, jotai, etc.
    },
  ],
});