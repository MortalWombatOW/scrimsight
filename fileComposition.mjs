// fileComposition.mjs
// @ts-check

import { createFileComposition } from "eslint-plugin-project-structure";

export const fileCompositionConfig = createFileComposition({
  filesRules: [
    // AtomFamily Pattern - Files ending with AtomFamily.ts
    {
      filePattern: "src/atoms/*AtomFamily.ts",
      allowOnlySpecifiedSelectors: {
        fileRoot: true,
        fileExport: true, 
        nestedSelectors: false,
      },
      rootSelectorsLimits: [
        { selector: "variable", limit: 1 }, // Only the default atomFamily export
      ],
      rules: [
        // AtomFamily default export (unnamed default)
        {
          selector: "variable",
          scope: "fileExport", 
          format: "default",
          positionIndex: 0,
        },
      ],
    },

    // Input Atom Pattern - Files ending with Input or containing Input
    {
      filePattern: "src/atoms/*Input*.ts",
      allowOnlySpecifiedSelectors: {
        fileRoot: true,
        fileExport: true,
        nestedSelectors: false,
      },
      rootSelectorsLimits: [
        { selector: "variable", limit: 3 }, // private atom + writable atom + default export
        { selector: "arrowFunction", limit: 1 } // helper function
      ],
      rules: [
        // Helper function export (named)
        {
          selector: "arrowFunction",
          scope: "fileExport",
          format: "{fileName}Fn",
          positionIndex: 0,
        },
        // Private atom variable (non-exported)
        {
          selector: "variable", 
          scope: "fileRoot",
          format: "_{camelCase}",
          positionIndex: 1,
        },
        // Writable atom variable (non-exported) 
        {
          selector: "variable",
          scope: "fileRoot",
          format: "{camelCase}Atom",
          positionIndex: 2,
        },
        // Default writable atom export (unnamed default)
        {
          selector: "variable",
          scope: "fileExport",
          format: "default",
          positionIndex: 3,
        },
        // Allow function calls (variableExpression) like atom(), get(), set()
        {
          selector: "variableExpression",
          scope: "file",
          format: "*", // Allow any function calls in input atoms
        },
      ],
    },

    // Standard Single Atoms - All other atom files
    {
      filePattern: [["src/atoms/*.ts", "!src/atoms/index.ts", "!src/atoms/*.test.ts", "!src/atoms/*AtomFamily.ts", "!src/atoms/*Input*.ts", "!src/atoms/atomTemplate.ts.txt"]],
      allowOnlySpecifiedSelectors: {
        fileRoot: true,
        fileExport: true, 
        nestedSelectors: false,
      },
      rootSelectorsLimits: [
        { selector: "variable", limit: 1 }, // unnamed default export only
        { selector: "arrowFunction", limit: 1 } // named function export only
      ],
      rules: [
        // Implementation function export (named export for testing)
        {
          selector: "arrowFunction",
          scope: "fileExport", 
          format: "{fileName}Fn", 
          positionIndex: 0, 
        },
        // Atom default export (unnamed default export)
        {
          selector: "variable", 
          scope: "fileExport",
          format: "default",
          positionIndex: 1,
        },
      ],
    },
  ],
});