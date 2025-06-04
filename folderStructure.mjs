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
            { name: "atomTemplate.ts.txt" }, // Atom template file
            // Atom test files
            {
              name: "{camelCase}.test.ts",
              enforceExistence: ["{nodeName}.ts"]
            }, 
            // Atom implementation files
            {
              name: "{camelCase}.ts",
              // Any atom implementation file must have a corresponding test file
              // enforceExistence: ["{nodeName}.test.ts"]
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
          ],
        },
        // Components: src/components folder
        {
          name: "components",
          children: [
            { name: "index.tsx" }, // Component index file
            // Component implementation files
            {
              name: "{PascalCase}.tsx",
              enforceExistence: ["{NodeName}.stories.tsx"]
            },
            // Component test files
            { name: "{PascalCase}.stories.tsx", enforceExistence: ["{NodeName}.tsx"] },
          ],
        },
        // Pages: src/pages folder
        {
          name: "pages",
          children: [
            { name: "index.tsx" }, // Page index file
            // Page implementation files
            { name: "{PascalCase}.tsx", enforceExistence: ["{NodeName}.stories.tsx"] },
            // Page test files
            { name: "{PascalCase}.stories.tsx", enforceExistence: ["{NodeName}.tsx"] },
          ],
        },
      ]},
],
});