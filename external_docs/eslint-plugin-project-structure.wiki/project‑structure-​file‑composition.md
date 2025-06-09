# project-structure/file-composition

Compose your ideal files!
Have full control over the order and quantity of selectors.
Define advanced naming conventions and prohibit the use of specific selectors in given files.

### Features:

*   File composition validation.
*   Supported selectors: `class`, `function`, `arrowFunction`, `type`, `interface`, `enum`, `variable`, `variableExpression`, `propertyDefinition`.
*   Inheriting the filename as the selector name. Option to add your own prefixes/suffixes, change the case, or remove parts of the filename.
*   Prohibit the use of given selectors in a given file. For example, `**/*.consts.ts` files can only contain variables, `**/*.types.ts` files can only contain interfaces and types.
*   Define the order in which your selectors should appear in a given file. Support for `--fix` to automatically correct the order.
*   Rules for exported selectors, selectors in the root of the file and nested/all selectors in the file. They can be used together in combination.
*   Enforcing a maximum of one main function/class per file.
*   The ability to set a specific limit on the occurrence of certain selectors in the root of a given file.
*   Selector name regex validation.
*   Build in case validation.
*   Different rules for different files.
*   An option to create a separate configuration file with TypeScript support.

## 📋 General information

*   🎮 [Playground](https://github.com/Igorkowalski94/eslint-plugin-project-structure-playground#root) for eslint-plugin-project-structure rules.
*   Check the latest [releases](https://github.com/Igorkowalski94/eslint-plugin-project-structure/releases) and stay updated with new features and changes.
*   Become part of the community!
    Leave a ⭐ and share the link with your friends.
*   If you have any questions or need help creating a configuration that meets your requirements, [help](https://github.com/Igorkowalski94/eslint-plugin-project-structure/discussions/new?category=help).
*   If you have found a bug or an error in the documentation, [report issues](https://github.com/Igorkowalski94/eslint-plugin-project-structure/issues/new?assignees=Igorkowalski94&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D).
*   If you have an idea for a new feature or an improvement to an existing one, [ideas](https://github.com/Igorkowalski94/eslint-plugin-project-structure/discussions/new?category=ideas).
*   If you're interested in discussing project structures across different frameworks or want to vote on a proposed idea, [discussions](https://github.com/Igorkowalski94/eslint-plugin-project-structure/discussions?discussions_q=).

## 📚 Documentation

*   [project-structure/folder-structure](https://github.com/Igorkowalski94/eslint-plugin-project-structure/wiki/project%E2%80%91structure-%E2%80%8Bfolder%E2%80%91structure#root)
*   [project-structure/independent-modules](https://github.com/Igorkowalski94/eslint-plugin-project-structure/wiki/project%E2%80%91structure-%E2%80%8Bindependent%E2%80%91modules#root)

## ✈️ Go to

*   [Plugin homepage](https://github.com/Igorkowalski94/eslint-plugin-project-structure/wiki/Plugin-homepage#root)
*   [Installation](#installation)
*   [Getting started](#getting-started)
    *   [Example](#example)
*   [API](#api)
    *   [filesRules](#filesrules)
        *   [filePattern](#filepattern)
        *   [rootSelectorsLimits](#rootselectorslimits)
        *   [allowOnlySpecifiedSelectors](#allowonlyspecifiedselectors)
        *   [rules](#rules)
            *   [selector](#selector)
            *   [scope](#scope)
            *   [positionIndex](#positionindex)
            *   [filenamePartsToRemove](#filenamepartstoremove)
            *   [format](#format)
    *   [regexParameters](#regexparameters)
        *   [Built-in regex parameters](#built-in-regex-parameters)
        *   [Regex parameters mix example](#regex-parameters-mix-example)
    *   [projectRoot](#projectroot)

## 💾 Installation

```bsh
npm install --save-dev eslint-plugin-project-structure
```

```bsh
yarn add --dev eslint-plugin-project-structure
```

```bsh
pnpm add --save-dev eslint-plugin-project-structure
```

## 🏁 Getting started

### Step 1

Add the following lines to `eslint.config.mjs`.

> [!NOTE]
> The examples in the documentation refer to ESLint's new config system. If you're interested in examples for the old ESLint config, you can find them in the 🎮 [Playground](https://github.com/Igorkowalski94/eslint-plugin-project-structure-playground#root) for eslint-plugin-project-structure rules.

```mjs
// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { projectStructurePlugin } from "eslint-plugin-project-structure";
import { fileCompositionConfig } from "./fileComposition.mjs";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      "project-structure": projectStructurePlugin,
    },
    rules: {
      // If you have many rules in a separate file.
      "project-structure/file-composition": ["error", fileCompositionConfig],
      // If you have only a few rules.
      "project-structure/file-composition": [
        "error",
        {
          // Config
        },
      ],
    },
  }
);
```

### Step 2

Create a `fileComposition.mjs` in the root of your project.

> [!WARNING]
> Remember to include `// @ts-check`, otherwise type checking won't be enabled.

> [!NOTE]
> `fileComposition.json`, `fileComposition.jsonc` and `fileComposition.yaml` are also supported. See an example in the 🎮 [Playground](https://github.com/Igorkowalski94/eslint-plugin-project-structure-playground#root) for eslint-plugin-project-structure rules.

#### Example:

```ts
// File transformUserData.ts

// Let's assume we want all `.ts` files to have the following rules:

// In the root of the file, there may be an `interface` or a `type` that must follow `{FileName}Props`, or simply `Props` if it is not exported.
// This selector must always be in the 0 position in the file, excluding imports.
export type TransformUserDataProps = {
  name: number;
  surname: number;
  email: string;
};

// In the root of the file, there may be an `interface` or a `type` that must follow `{FileName}Return`, or simply `Return` if it is not exported.
// This selector must always be in the 1 position in the file, excluding imports.
interface Return {
  fullName: string;
  email: string;
}

// In the root of the file, there may be only one main `arrowFunction` that must follow `{fileName}`.
// This selector must always be in the 2 position in the file, excluding imports.
export const transformUserData = ({
  name,
  surname,
  email,
}: TransformUserDataProps): Return => {
  // Nested arrowFunctions must follow 'camelCase'.
  const nestedFunction = () => {};
  // Nested variables must follow 'camelCase'.
  const nestedVariable = "";

  //All nested selectors that are not specified in the rules are allowed.

  return {
    fullName: `${name} ${surname}`,
    email,
  };
};

// All root/exported selectors that are not specified in the rules are prohibited.
// The file may contain at most one main `arrowFunction` and at most two `types`/`interfaces`.
```

```mjs
// @ts-check

import { createFileComposition } from "eslint-plugin-project-structure";

export const fileCompositionConfig = createFileComposition({
  filesRules: [
    {
      filePattern: "**/*.ts",
      allowOnlySpecifiedSelectors: {
        fileRoot: true,
        fileExport: true,
        nestedSelectors: false,
      },
      rootSelectorsLimits: [{ selector: ["interface", "type"], limit: 2 }],
      rules: [
        {
          selector: ["interface", "type"],
          scope: "fileExport",
          positionIndex: 0,
          format: "{FileName}Props",
        },
        {
          selector: ["interface", "type"],
          scope: "fileRoot",
          positionIndex: 0,
          format: "Props",
        },
        {
          selector: ["interface", "type"],
          scope: "fileExport",
          positionIndex: 1,
          format: "{FileName}Return",
        },
        {
          selector: ["interface", "type"],
          scope: "fileRoot",
          positionIndex: 1,
          format: "Return",
        },
        {
          selector: "arrowFunction",
          scope: "fileExport",
          positionIndex: 2,
          format: "{fileName}",
        },
        {
          selector: ["arrowFunction", "variable"],
          scope: "nestedSelectors",
          format: "{camelCase}",
        },
      ],
    },
  ],
});
```

## ⚙️ API

### `filesRules: FilesRules[]`

A place where you can add rules for a given file.

This way, you can ignore specific folders/files:

```jsonc
{
  "filesRules": [
    // Ignore all files from the `legacy` folder.
    { "filePattern": "legacy/**" },
    {
      // All `.ts` files from the `components` folders or all `.js` files from the `helpers` folders.
      "filePattern": ["**/components/*.ts", "**/helpers/*.js"],
      "rules": [
        {
          "selector": "variable",
          "format": "{SNAKE_CASE}"
        }
      ]
    }
  ]
}
```

> [!WARNING]
> The order of rules matters! Rules are checked in order from top to bottom.

```jsonc
{
  "filesRules": [
    {
      "filePattern": "**",
      "rules": [
        {
          "selector": "variable",
          "format": "{SNAKE_CASE}"
        }
      ]
    },
    {
      // File rule with "**/*.consts.ts" will not be taken into account because file rule with "**" meets the condition.
      "filePattern": "**/*.consts.ts",
      "rules": [
        {
          "selector": "variable",
          "format": "{snake_case}"
        }
      ]
    }
  ]
}
```

```jsonc
{
  "filesRules": [
    {
      // File rule with "**/*.consts.ts" will be taken into account because file rule with "**" is below file rule with "**/*.consts.ts".
      "filePattern": "**/*.consts.ts",
      "rules": [
        {
          "selector": "variable",
          "format": "{snake_case}"
        }
      ]
    },
    {
      "filePattern": "**",
      "rules": [
        {
          "selector": "variable",
          "format": "{SNAKE_CASE}"
        }
      ]
    }
  ]
}
```

```jsonc
{
  "filesRules": [
    {
      "filePattern": [["**", "!(**/*.consts.ts)"]],
      "rules": [
        {
          "selector": "variable",
          "format": "{SNAKE_CASE}"
        }
      ]
    },
    {
      // File rule with "**/*.consts.ts" will be taken into account because file rule with [["**", "!(**/*.consts.ts)"]] ignores "**/*.consts.ts" pattern.
      "filePattern": "**/*.consts.ts",
      "rules": [
        {
          "selector": "variable",
          "format": "{snake_case}"
        }
      ]
    }
  ]
}
```

### `filePattern: string | (string | string[])[]`

Here you define which files should meet the rules.

The outer array checks if any pattern meets the requirements. The inner array checks if all patterns meet the requirements.

You can use all [micromatch](https://github.com/micromatch/micromatch?tab=readme-ov-file#matching-features) functionalities.

```jsonc
{ "filePattern": "src/hello.ts" } // If your `projectRoot` is `.` (default).
{ "filePattern": "packages/package-name/src/hello.ts" } // If your `projectRoot` is `.` (default) and you use monorepo.
{ "filePattern": "src/hello.ts" } // If your `projectRoot` is `packages/package-name` and you use monorepo.
```

```jsonc
// Name rules for all `.ts`,
{ "filePattern": "**/*.ts" }
```

```jsonc
// Name rules for all `.js` files or all `.ts` files.
{ "filePattern": ["**/*.js", "**/*.ts"] }
```

```jsonc
// Name rules for all `.js` files or all `.ts` files except `index.ts`
{ "filePattern": ["**/*.js", ["**/*.ts", "!(**/index.ts)"]] }
```

```jsonc
// If your folder name uses micromatch special characters () [] {} ! , + ? etc.
{ "filePattern": "src/app/hello/\\(components\\)/**" }
```

### `rootSelectorsLimits: {selector: SelectorType | SelectorType[]; limit: number;}[]`

The ability to set a specific limit on the occurrence of certain selectors in the root of a given file.

```jsonc
{
  "filePattern": "**/*.tsx",
  "rootSelectorsLimits": [
    // The number of all arrowFunctions in the root of the file cannot exceed 1.
    { "selector": "arrowFunction", "limit": 1 },
    // The number of all types and interfaces in the root of the file cannot exceed 2.
    { "selector": ["interface", "type"], "limit": 2 }
  ]
}
```

### `allowOnlySpecifiedSelectors?: boolean | AllowOnlySpecifiedSelectors`

With `allowOnlySpecifiedSelectors`, you can prohibit the use of selectors that you haven’t explicitly specified for the file.

The default value is `false`.

```jsonc
{
  "filePattern": "**",
  "allowOnlySpecifiedSelectors": true
}
```

```jsonc
{
  "filePattern": "**",
  "allowOnlySpecifiedSelectors": {
    "fileExport": true, // Default value, you do not need to specify it.
    "fileRoot": true, // Default value, you do not need to specify it.
    "nestedSelectors": false
  }
}
```

You can define global errors or precise ones for a given [scope](#scope).

```jsonc
{
  "filePattern": "**",
  "allowOnlySpecifiedSelectors": {
    "errors": {
      "function": "We prefer using arrow functions ..."
    },
    "fileExport": {
      "arrowFunction": "Exporting arrowFunctions is prohibited ..."
    },
    "fileRoot": {
      "arrowFunction": "arrowFunctions in the root of the file are prohibited ..."
    },
    "nestedSelectors": {
      "arrowFunction": "Nested arrowFunctions are prohibited ..."
    }
  }
}
```

### `rules?: FileRule[]`

The place where you add the rules that selectors for a given file must follow.

```jsonc
{
  "filePattern": "**",
  "rules": []
}
```

### `selector: Selector | Selector[]`

Here you define the selector or selectors you are interested in.

Available selectors:

*   `class`
*   `function`
*   `arrowFunction`
*   `type`
*   `interface`
*   `enum`
*   `variable`
*   `variableExpression`
*   `propertyDefinition`

```jsonc
{
  "filePattern": "**/*.tsx",
  "rules": [
    { "selector": ["function", "arrowFunction"] },
    { "selector": "variable" },
    { "selector": "variableExpression" }
  ]
}
```

#### `selector: { type: "variableExpression"; limitTo: string | string[]; }`

You can restrict `variableExpression` to specific names.

`limitTo` is treated as a regular expression.

The following improvements are automatically added to the regular expression:

*   Regular expression is automatically wrapped in `^$`.
*   All `*` characters will be converted to `(([^/]*)+)` (wildcard).
    If you want original behavior, use the following notation `**`.

```jsonc
{
  "filePattern": "**/*.tsx",
  "rules": [
    // variableExpression with name `styled` should follow {PascalCase}.
    {
      "selector": { "type": "variableExpression", "limitTo": "styled" },
      "format": "{PascalCase}"
    },
    // variableExpression with name `css` should follow {camelCase}.
    {
      "selector": {
        "type": "variableExpression",
        "limitTo": ["css"]
      },
      "format": "{camelCase}"
    },
    // All variableExpressions except `styled` and `css` should follow {snake_case}.
    {
      "selector": {
        "type": "variableExpression",
        "limitTo": "(?!^(styled|css)$)*"
      },
      "format": "{snake_case}"
    }
  ]
}
```

```ts
const VariableName = styled.div``;
const variableName = css();
const variable_name = someFn();
```

### `scope?: Scope | Scope[]`

Here you define the scope of your rule.

Available options: `fileExport`, `fileRoot`, `nestedSelectors`, `file`.

*   `file` (default) refers to all selectors in the file and is a shorthand notation for `["fileExport", "fileRoot", "nestedSelectors"]`.
*   `fileExport` refers to exported selectors in the file.
*   `fileRoot` refers to non-exported selectors in the root of the file.
*   `nestedSelectors` refers to selectors nested within functions and classes.

```jsonc
{
  "filePattern": "**/*.tsx",
  "rules": [
    { "selector": "arrowFunction", "scope": ["fileExport", "fileRoot"] },
    {
      "selector": "variable",
      "scope": "file" // Default value, you do not need to specify it.
    },
    { "selector": "interface", "scope": "fileRoot" }
  ]
}
```

### `positionIndex?: number | { index: number; sorting?: "none" | "az"; }`

You can define the order in which your selectors should appear in the root of the given file.

The `positionIndex` dynamically adjusts to the number of selectors in the file.

All `positionIndex` selectors with non-unique names will be sorted alphabetically, taking numbers into account. It is possible to disable the default sorting by setting `positionIndex.sorting = "none"` if your selectors are not hoisted.

*   If you provide a positive `positionIndex`, you determine the order from the beginning of the file.
*   If you provide a negative `positionIndex`, you determine the order from the end of the file.
*   All selectors that do not have a `positionIndex` will be moved below those with a positive `positionIndex` or above those with a negative `positionIndex`.

```jsonc
{
  "filePattern": "**/*.tsx",
  "rules": [
    {
      "selector": "interface",
      "scope": ["fileExport", "fileRoot"],
      "positionIndex": 0,
      "format": "{PascalCase}Props"
    },
    {
      "selector": "interface",
      "scope": ["fileExport", "fileRoot"],
      "positionIndex": 1,
      "format": "{PascalCase}Return"
    },
    {
      "selector": "arrowFunction",
      "scope": "fileExport",
      "positionIndex": 2,
      "format": "{FileName}"
    },
    {
      "selector": "variable",
      "scope": "fileRoot",
      "positionIndex": { "index": 3, "sorting": "none" },
      "format": "{camelCase}"
    }
    {
      "selector": "variable",
      "scope": "fileExport",
      "positionIndex": -1,
      "format": "SpecialLastVariable"
    }
  ]
}
```

### `filenamePartsToRemove?: string | string[]`

Useful if you use prefixes in your filenames and don't want them to be part of the [selector](#selector) name.

> [!NOTE]
> Only taken into account when using `references` with filename.

```jsonc
{
  "filePattern": "**/*.tsx",
  "rules": [
    {
      "selector": "arrowFunction",
      "filenamePartsToRemove": ".react", // ComponentName.react.tsx => ComponentName.tsx
      "format": "{FileName}" // const ComponentName = () => {}
    }
  ]
}
```

### `format?: string | string[]`

The format that the given [selector](#selector) must adhere to.

It is treated as a regular expression. If the [selector](#selector) name matches at least one regular expression, it will be considered valid.

The following improvements are automatically added to the regular expression:

*   Regular expression is automatically wrapped in `^$`.
*   All `*` characters will be converted to `(([^/]*)+)` (wildcard).
    If you want original behavior, use the following notation `**`.

> [!NOTE]
> If you do not specify `format`, the default value is [{camelCase}](#camelcase).

```jsonc
{
  "filePattern": "**/*.tsx",
  "rules": [
    {
      "selector": "arrowFunction",
      // Arrow functions in `.tsx` files should meet {camelCase} or {PascalCase}.
      "format": ["{camelCase}", "{PascalCase}"]
    },
    {
      "selector": "variable",
      // Variables in `.tsx` files should meet `use*` for example `useValue`, `useSomeName`.
      "format": "use*"
    }
  ]
}
```

### `regexParameters?: Record<string, string>`

A place where you can add your own regex parameters.

You can use [built-in regex parameters](#built-in-regex-parameters). You can overwrite them with your logic, exceptions are filename references.

You can freely mix regex parameters together see [example](#regex-parameters-mix-example).

```jsonc
{
  "regexParameters": {
    "yourRegexParameter": "(Regex logic)",
    "camelCase": "(Regex logic)", // Override built-in camelCase.
    "fileName": "(Regex logic)", // Overwriting will be ignored.
    "FileName": "(Regex logic)" // Overwriting will be ignored.
  }
}
```

Then you can use them in [format](#format) with the following notation `{yourRegexParameter}`.

```jsonc
{ "format": "{yourRegexParameter}" }
```

#### Built-in regex parameters

`{fileName}`
Take the name of the file you are currently in and change it to `camelCase`.

```jsonc
{ "format": "{fileName}" }
```

`{FileName}`
Take the name of the file you are currently in and change it to `PascalCase`.

```jsonc
{ "format": "{FileName}" }
```

`{file_name}`
Take the name of the file you are currently in and change it to `snake_case`.

```jsonc
{ "format": "{file_name}" }
```

`{FILE_NAME}`
Take the name of the file you are currently in and change it to `SNAKE_CASE`.

```jsonc
{ "format": "{FILE_NAME}" }
```

`{camelCase}`
Add `camelCase` validation to your regex.
The added regex is `([a-z]+[A-Z0-9]*[A-Z0-9]*)*`.

Examples: `component`, `componentName`, `componentName1`, `componentXYZName`, `cOMPONENTNAME`.

```jsonc
{ "name": "{camelCase}" }
```

`{PascalCase}`
Add `PascalCase` validation to your regex.
The added regex is `([A-Z]+[a-z0-9]*[A-Z0-9]*)*`.

Examples: `Component`, `ComponentName`, `ComponentName1`, `ComponentXYZName`, `COMPONENTNAME`.

```jsonc
{ "name": "{PascalCase}" }
```

`{strictCamelCase}`
Add `strictCamelCase` validation to your regex.
The added regex is `[a-z][a-z0-9]*(([A-Z][a-z0-9]+)*[A-Z]?|([a-z0-9]+[A-Z])*|[A-Z])`.

Examples: `component`, `componentName`, `componentName1`.

```jsonc
{ "name": "{strictCamelCase}" }
```

`{StrictPascalCase}`
Add `StrictPascalCase` validation to your regex.
The added regex is `[A-Z](([a-z0-9]+[A-Z]?)*)`.

Examples: `Component`, `ComponentName`, `ComponentName1`.

```jsonc
{ "name": "{StrictPascalCase}" }
```

`{snake_case}`
Add `snake_case` validation to your regex.
The added regex is `((([a-z]|\d)+_)*([a-z]|\d)+)`.

Examples: `component`, `component_name`, `component_name_1`.

```jsonc
{ "format": "{snake_case}" }
```

`{SNAKE_CASE}`
Add `SNAKE_CASE` validation to your regex.
The added regex is `((([A-Z]|\d)+_)*([A-Z]|\d)+)`.

Examples: `COMPONENT`, `COMPONENT_NAME`, `COMPONENT_NAME_1`.

```jsonc
{ "format": "{SNAKE_CASE}" }
```

#### Regex parameters mix example

Here are some examples of how easy it is to combine [regex parameters](#regex-parameters).

```jsonc
// useNiceHook
// useNiceHook_api
// useNiceHook_test
{ "format": "use{PascalCase}(_(test|api))?" }
```

```jsonc
// someFileName_hello_world
// someFileName_hello_world_test
// someFileName_hello_world_api
{ "format": "{fileName}_{snake_case}(_(test|api))?" }
```

### `projectRoot?: string`

Useful when working with a monorepo. You don’t need to specify `projectRoot` in [filePattern](#filepattern) then.

The default value is `.`.

```jsonc
{ "projectRoot": "src" }
```

```jsonc
{ "projectRoot": "packages/package-name" }
```
