import typescriptEslint from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import _import from 'eslint-plugin-import';
import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';
import stylistic from '@stylistic/eslint-plugin';
import pathAlias from 'eslint-plugin-path-alias'
import boundaries from "eslint-plugin-boundaries";

export default [
  {
    // Base config for JS/TS files
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**'],
    
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react,
      'react-hooks': reactHooks,
      import: _import,
      'unused-imports': unusedImports,
      stylistic,
      'path-alias': pathAlias,
      boundaries,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      "boundaries/elements": [
        {
          type: "app",
          pattern: "src/App.tsx",
          mode: "file",
        },
        {
          type: "app-index",
          pattern: "src/index.tsx",
          mode: "file",
        },
        {
          type: "atom-index",
          pattern: "src/atoms/index.ts",
          mode: "file",
        },
        {
          type: "component-index",
          pattern: "src/components/index.tsx",
          mode: "file",
        },
        {
          type: "page-index",
          pattern: "src/pages/index.tsx",
          mode: "file",
        },
        {
          type: "library-index",
          pattern: "src/lib/index.ts",
          mode: "file",
        },
        {
          type: "atom-test",
          pattern: "src/atoms/*.test.ts",
          mode: "file",
        },
        {
          type: "component-test",
          pattern: "src/components/*.stories.tsx",
          mode: "file",
        },
        { 
          type: "page-test",
          pattern: "src/pages/*.stories.tsx",
          mode: "file",
        },
        {
          type: "library-test",
          pattern: "src/lib/*.test.ts",
          mode: "file",
        },
        {
          type: "atom",
          pattern: "src/atoms/*.ts",
          mode: "file",
        },
        {
          type: "component",
          pattern: "src/components/*.tsx",
          mode: "file",
        },
        {
          type: "page",
          pattern: "src/pages/*.tsx",
          mode: "file",
        },
       
        {
          type: "library",
          pattern: "src/lib/*.ts",
          mode: "file",
        },
        
      ],
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'unused-imports/no-unused-imports': 'error',
      'stylistic/indent': ['error', 2],
      'stylistic/max-len': ['error', {
        'code': 5000,
        'ignoreUrls': true,
        'ignoreComments': false,
        'ignoreTrailingComments': false,
        'ignorePattern': '^import\\s.+\\sfrom\\s.+\\s;',
      }],
      'path-alias/no-relative': ['error', {}],
      ...boundaries.configs.strict.rules,
      "boundaries/external": [0],
      // "boundaries/entry-point": [2, {
      //   default: "disallow",
      //   rules: [
      //     {
      //       target: ["atoms"],
      //       allow: "atoms/index.ts"
      //     },
      //     {
      //       target: ["components"],
      //       allow: "components/index.tsx"
      //     },
      //     {
      //       target: ["pages"],
      //       allow: "pages/index.tsx"
      //     },
      //     {
      //       target: ["lib"],
      //       allow: "lib/index.ts"
      //     }
      //   ]
      // }],

      
      "boundaries/element-types": [2, {
      default: "disallow",
      rules: [
        // Rule for src/index.tsx (app-index) importing src/App.tsx (app)
        {
          from: "app-index",
          allow: ["app"]
        },
        // Rule for src/App.tsx (app) dependencies
        {
          from: "app",
          allow: ["page-index", "component-index", "atom-index", "library-index"]
        },
        // Rules for core element types based on README and user clarification
        {
          from: "atom", // e.g., src/atoms/someAtom.ts
          allow: [
            "atom-index",    // Allows importing from '@atoms' (for other atoms)
            "library-index"  // Allows importing from '@lib'
          ]
        },
        {
          from: "component", // e.g., src/components/someComponent.tsx
          allow: [
            "atom-index",    // Allows importing from '@atoms'
            "library-index", // Allows importing from '@lib'
            "component-index"// Allows importing from '@components' (for other components)
          ]
        },
        {
          from: "page",      // e.g., src/pages/somePage.tsx
          allow: [
            "component-index",// Allows importing from '@components'
            "library-index"  // Allows importing from '@lib'
          ]
        },
        {
          from: "library",   // e.g., src/lib/someLib.ts
          allow: [
            "library-index"  // Allows importing from '@lib' (for other libraries)
          ]
        },
        // Rules for index files importing their respective raw elements
        {
          from: "atom-index", // src/atoms/index.ts
          allow: ["atom"]     // Allows importing from src/atoms/someAtom.ts
        },
        {
          from: "component-index", // src/components/index.tsx
          allow: ["component"]     // Allows importing from src/components/someComponent.tsx
        },
        {
          from: "page-index", // src/pages/index.tsx
          allow: ["page"]      // Allows importing from src/pages/somePage.tsx
        },
        {
          from: "library-index", // src/lib/index.ts
          allow: ["library"]   // Allows importing from src/lib/someLib.ts
        },
        // Rules for test files
        {
          from: "atom-test", // e.g., src/atoms/someAtom.test.ts
          allow: [
            "atom",          // Allows importing the atom being tested (e.g., './someAtom')
            "atom-index",    // Allows importing other atoms via '@atoms'
            "library-index"  // Allows importing from '@lib'
          ]
        },
        {
          from: "component-test", // e.g., src/components/someComponent.stories.tsx
          allow: [
            "component",       // Allows importing the component being tested (e.g., './someComponent')
            "atom-index",
            "library-index",
            "component-index"  // Allows importing other components via '@components'
          ]
        },
        {
          from: "page-test", // e.g., src/pages/somePage.stories.tsx
          allow: [
            "page",            // Allows importing the page being tested (e.g., './somePage')
            "component-index",
            "library-index"
          ]
        },
        {
          from: "library-test", // e.g., src/lib/someLib.test.ts
          allow: [
            "library",         // Allows importing the library being tested (e.g., './someLib')
            "library-index"    // Allows importing other libraries via '@lib'
          ]
        }
      ]
    }],
    },
  },
  {
    // TypeScript-specific config with project references
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    rules: {
      // Add any TypeScript-specific rules here
    }
  }
];
