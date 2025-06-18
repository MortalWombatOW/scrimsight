// fileComposition.mjs
// @ts-check

import { createFileComposition } from "eslint-plugin-project-structure";

export const fileCompositionConfig = createFileComposition({
  filesRules: [
 
 
    // Test Files Pattern - Require exactly one describe statement
    {
      filePattern: "src/**/*.test.ts",
      allowOnlySpecifiedSelectors: {
        fileRoot: true,
        fileExport: true,
        nestedSelectors: false,
      },
      rootSelectorsLimits: [
        { selector: "variableExpression", limit: 1 }, // Exactly one describe call
      ],
      rules: [
        // Require exactly one describe call at file root
        {
          selector: "variableExpression",
          scope: "fileRoot",
          format: "describe",
          positionIndex: 0,
        },
      ],
    },
  ],
});