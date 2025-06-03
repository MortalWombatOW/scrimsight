import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import _import from 'eslint-plugin-import';
import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';
import stylistic from '@stylistic/eslint-plugin';
import pathAlias from 'eslint-plugin-path-alias'
import { projectStructurePlugin, projectStructureParser } from "eslint-plugin-project-structure";
import { independentModulesConfig } from "./independentModules.mjs"; 
import { fileCompositionConfig } from "./fileComposition.mjs";
import { folderStructureConfig } from "./folderStructure.mjs";
export default tseslint.config([
  {
    files: ['**'],
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', 'projectStructure.cache.json'],
    languageOptions: {
      parser: projectStructureParser,
    },
    plugins: {
      'project-structure': projectStructurePlugin,
    },
    rules: {
      "project-structure/folder-structure": ["error", folderStructureConfig],
    },
  },
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
      'project-structure': projectStructurePlugin,
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
      "project-structure/independent-modules": ["error", independentModulesConfig],
      "project-structure/file-composition": ["error", fileCompositionConfig],
    },
  },
]);
