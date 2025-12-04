// folderStructure.mjs
// @ts-check

import { createFolderStructure } from "eslint-plugin-project-structure";

export const folderStructureConfig = createFolderStructure({
  structure: [
    // Any files can be at the root of the project
    { name: "*" },
    // Any folders can be at the root of the project
    { name: "*", children: [] },
    // src folder
    {
      name: "src",
      children: [
        // src/index.tsx
        { name: "index.tsx" },
        // src/App.tsx
        { name: "App.tsx" },
        // index.css
        { name: "index.css" },
        // src/atoms folder
        {
          name: "atoms",
          children: [
            { name: "index.ts" }, // Atom index file
            // Atom test files
            {
              name: "{camelCase}.test.ts",
              enforceExistence: ["{nodeName}.ts"]
            },
            // Atom implementation files
            {
              name: "{camelCase}.ts",
              // Any atom implementation file must have a corresponding test file
              enforceExistence: ["{nodeName}.test.ts"]
            },
          ],
        },
        // Library: src/lib folder
        {
          name: "lib",
          children: [
            { name: "index.ts" }, // Library index file
            // Library: src/lib/{camelCase}.ts
            { name: "{camelCase}.ts" },
            // Library: src/lib/{camelCase}.test.ts
            { name: "{camelCase}.test.ts" },
            // Sample data folder for testing
            {
              name: "sampledata",
              children: [
                { name: "*.txt" },
              ],
            },
          ],
        },
        // Data layer: src/data folder
        {
          name: "data",
          children: [
            { name: "index.ts" },
            { name: "{camelCase}.ts" },
            { name: "{camelCase}.test.ts" },
          ],
        },
        // Domain layer: src/domain folder
        {
          name: "domain",
          children: [
            { name: "index.ts" },
            { name: "{camelCase}.ts" },
            { name: "{camelCase}.test.ts" },
          ],
        },
        // Hooks: src/hooks folder
        {
          name: "hooks",
          children: [
            { name: "index.ts" },
            { name: "{camelCase}.ts" },
            { name: "{camelCase}.tsx" },
            { name: "{camelCase}.test.ts" },
            { name: "{camelCase}.test.tsx" },
          ],
        },
        // Types: src/types folder
        {
          name: "types",
          children: [
            { name: "index.ts" },
            { name: "{camelCase}.ts" },
          ],
        },
        // Integration tests: src/integration folder
        {
          name: "integration",
          children: [
            { name: "{camelCase}.test.ts" },
            { name: "{camelCase}.test.tsx" },
          ],
        },
        // Components: src/components folder
        {
          name: "components",
          children: [
            { name: "index.ts" }, // Component index file
            // Component implementation files at root
            { name: "{PascalCase}.tsx" },
            // Component subdirectories (feature-based organization)
            {
              name: "{camelCase}",
              children: [
                { name: "index.ts" },
                { name: "{PascalCase}.tsx" },
                // Nested component folders
                {
                  name: "{PascalCase}",
                  children: [
                    { name: "index.ts" },
                    { name: "{PascalCase}.tsx" },
                  ],
                },
              ],
            },
          ],
        },
        // Icons: src/icons folder
        {
          name: "icons",
          children: [
            { name: "index.ts" }, // Icon index file
            // Icon implementation files
            {
              name: "{PascalCase}Icon.tsx",
            },
            // SVG files
            { name: "*.svg" },
          ],
        },
        // Pages: src/pages folder
        {
          name: "pages",
          children: [
            { name: "index.tsx" }, // Page index file
            // Page implementation files
            { name: "{PascalCase}Page.tsx" },
          ],
        },
      ]
    },
  ],
});