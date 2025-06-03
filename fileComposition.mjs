// fileComposition.mjs
// @ts-check

import { createFileComposition } from "eslint-plugin-project-structure";

export const fileCompositionConfig = createFileComposition({
  filesRules: [
    {
      // Rule specifically for atom implementation files (e.g., src/atoms/someAtom.ts)
      // Excludes index.ts and .test.ts files from this specific composition rule
      filePattern: [["src/atoms/*.ts", "!src/atoms/index.ts", "!src/atoms/*.test.ts"]],
      // Enforce that only the specified selectors (function and default export arrowFunction) are allowed at the root
      allowOnlySpecifiedSelectors: {
        fileRoot: true, // Only allow what's defined in rules at the root
        fileExport: true, // Only allow what's defined in rules for exports (overlaps with root here)
        nestedSelectors: false, // Allow any selectors inside functions/classes
      },
      // Optional: Limit the number of root selectors if needed, though the rules below are more specific.
      // rootSelectorsLimits: [
      //   { selector: "function", limit: 1 }, // Expecting one named function export
      //   { selector: "arrowFunction", limit: 1 } // Expecting one default export arrow function
      // ],
      rules: [
        // Rule for the exported implementation function (e.g., ability1UsedFn)
        {
          selector: "function", // Could also be "arrowFunction" if you use const fn = () => {}
          scope: "fileExport", // Must be exported
          format: "{fileName}Fn", // Name must be {fileName}Fn (e.g., ability1UsedFn)
          positionIndex: 0, // Should appear first (excluding imports)
        },
        // Rule for the default exported Jotai atom
        {
          selector: "arrowFunction", // Jotai atoms are often defined with arrow functions for async get
          scope: "fileExport", // Must be exported
          // For default exports, the 'format' doesn't apply to the "default" keyword itself,
          // but to the name if it were a named default export.
          // Since it's an anonymous arrow function assigned to default export,
          // we don't need a format for the name.
          // We can ensure it's a default export by checking its AST properties if needed,
          // but ESLint rules often infer default export status.
          // The key here is that it's an exported arrow function and its position.
          // If you wanted to be super strict and ensure it's *the* default export,
          // that's a bit more advanced and might require a custom AST selector or a more complex setup.
          // For now, relying on it being an exported arrowFunction at the second position.
          positionIndex: 1, // Should appear second (after the Fn)
        },
        // If your default export is sometimes a direct `atom()` call not wrapped in an arrow function for export:
        // {
        //   selector: "variable", // If `export default atom(...)` is treated as a variable export
        //   scope: "fileExport",
        //   positionIndex: 1,
        //   // You might need to inspect the AST further to ensure it's `atom(...)`
        //   // This is simpler: assumes the default export is an arrow function or a direct variable.
        // },
      ],
    },
  ],
});