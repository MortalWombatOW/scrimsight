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
            { name: "CLAUDE.md" }, // Claude memory file
            { name: "index.ts" }, // Atom index file
            {
              name: "{camelCase}.ts",
            }, 
          ],
        },
        // Library: src/lib folder
        {
          name: "lib",
          children: [
            // Library: src/lib/{camelCase}.ts
            { name: "{camelCase}.ts" },
            // Library: src/lib/{camelCase}.test.ts
            { name: "{camelCase}.test.ts" },
            // Library: src/lib/{PascalCase}.ts
            { name: "{PascalCase}.ts" },
            // Library: src/lib/{PascalCase}.test.ts
            { name: "{PascalCase}.test.ts" },
            // Library: src/lib/{camelCase}.worker.ts
            { name: "{camelCase}.worker.ts" },
          ],
        },
        // Components: src/components folder
        {
          name: "components",
          children: [
            {
              name: "{PascalCase}.tsx",
              enforceExistence: ["{NodeName}.stories.tsx"]
            },
            // Component test files
            { name: "{PascalCase}.stories.tsx", enforceExistence: ["{NodeName}.tsx"] },
          ],
        },
        // Icons: src/icons folder
        {
          name: "icons",
          children: [
            {
              name: "{PascalCase}Icon.tsx",
              enforceExistence: ["{NodeName}.stories.tsx"]
            },
            // Icon story files
            { name: "{PascalCase}Icon.stories.tsx", enforceExistence: ["{NodeName}.tsx"] },
            // SVG files
            { name: "*.svg" },
          ],
        },
        // Pages: src/pages folder
        {
          name: "pages",
          children: [
            // Page implementation files
            { name: "{PascalCase}Page.tsx" },
          ],
        },
        // Hooks: src/hooks folder
        {
          name: "hooks",
          children: [
            // Hook implementation files
            { name: "use{PascalCase}.ts" },
          ],
        },
      ]},
],
});