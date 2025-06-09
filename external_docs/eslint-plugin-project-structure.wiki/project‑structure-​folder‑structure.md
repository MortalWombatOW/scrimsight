# project-structure/folder-structure

Enforce rules on folder structure to keep your project consistent, orderly and well thought out.

### Features:

*   Validation of folder structure. Any files/folders outside the structure will be considered an error.
*   File/Folder name regex validation with features like wildcard `*` and treating `.` as a character, along with other conveniences.
*   Build in case validation.
*   Inheriting the folder's name. The file/folder inherits the name of the folder in which it is located. Option of adding your own prefixes/suffixes or changing the case.
*   Enforcing the existence of a files/folders when a specific file/folder exists. For example, if `./src/Component.tsx` exists, then `./src/Component.test.tsx` and `./src/stories/Component.stories.tsx` must also exist.
*   Reusable rules for folder structures.
*   An option to create a separate configuration file with TypeScript support.
*   Forcing a nested/flat structure for a given folder.
*   Support for all file extensions.
*   Folder recursion. You can repeatedly nest a folder structure and set a limit on the nesting depth. There is also an option to change the rule at the final level, such as flattening the folder structure.
*   Fewer repetitions and precise error messages, even for deeply nested folders (recursion), by representing the folder structure as a tree.
*   Checking the length of paths and notifying when the limit is exceeded.

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

*   [project-structure/independent-modules](https://github.com/Igorkowalski94/eslint-plugin-project-structure/wiki/project%E2%80%91structure-%E2%80%8Bindependent%E2%80%91modules#root)
*   [project-structure/file-composition](https://github.com/Igorkowalski94/eslint-plugin-project-structure/wiki/project%E2%80%91structure-%E2%80%8Bfile%E2%80%91composition#root)

## ✈️ Go to

*   [Plugin homepage](https://github.com/Igorkowalski94/eslint-plugin-project-structure/wiki/Plugin-homepage#root)
*   [Installation](#installation)
*   [Getting started](#getting-started)
    *   [Simple example](#simple-example-for-the-structure-below)
    *   [Advanced example](#advanced-example-for-the-structure-below)
*   [API](#api)
    *   [name](#name)
    *   [children](#children)
    *   [enforceExistence](#enforce-existence)
    *   [ruleId](#ruleid)
    *   [rules](#rules)
    *   [Folder recursion](#folder-recursion)
    *   [folderRecursionLimit](#folder-recursion-limit)
    *   [structure](#structure)
    *   [regexParameters](#regexparameters)
        *   [Built-in regex parameters](#built-in-regex-parameters)
        *   [Regex parameters mix example](#regex-parameters-mix-example)
    *   [ignorePatterns](#ignore-patterns)
    *   [structureRoot](#structure-root)
    *   [projectRoot](#project-root)
    *   [longPathsInfo](#long-paths-info)

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
import {
  projectStructureParser,
  projectStructurePlugin,
} from "eslint-plugin-project-structure";
import { folderStructureConfig } from "./folderStructure.mjs";

export default tseslint.config(
  /**
   *  Only for the `project-structure/folder-structure` rule,
   *  which must use the `projectStructureParser` to check all file extensions not supported by ESLint.
   */
  {
    files: ["**"], // Check all file extensions.
    ignores: ["projectStructure.cache.json"],
    languageOptions: { parser: projectStructureParser },
    plugins: {
      "project-structure": projectStructurePlugin,
    },
    settings: {
      // If you want to change the location of generating the projectStructure.cache.json file.
      // "project-structure/cache-location": "./src/cats",
    },
    rules: {
      // If you have many rules in a separate file.
      "project-structure/folder-structure": ["error", folderStructureConfig],
      // If you have only a few rules.
      "project-structure/folder-structure": [
        "error",
        {
          // Config
        },
      ],
    },
  },

  /**
   *  Here you will add your normal rules, which use the default parser.
   *  `tseslint.configs.recommended` and `eslint.configs.recommended` are written in such a way that their rules are not added globally.
   *  Some recommended rules require the default parser and will not work with additional extensions. Therefore,
   *  we want `projectStructureParser` to be used exclusively by the `project-structure/folder-structure` rule.
   */
  {
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {},
  }
);
```

### Step 2

Create a `folderStructure.mjs` in the root of your project and add `projectStructure.cache.json` to your `.gitignore` file.

> [!WARNING]
> Remember to include `// @ts-check`, otherwise type checking won't be enabled.

> [!NOTE]
> `folderStructure.json`, `folderStructure.jsonc` and `folderStructure.yaml` are also supported. See an example in the 🎮 [Playground](https://github.com/Igorkowalski94/eslint-plugin-project-structure-playground#root) for eslint-plugin-project-structure rules.

#### Simple example for the structure below:

```
.
├── ...
├── 📄 folderStructure.mjs
├── 📄 eslint.config.mjs
├── 📂 ...
└── 📂 src
    ├── 📄 index.tsx
    ├── 📂 allowAnyFoldersAndFiles
    │   └── ...
    ├── 📂 allowFoldersAndFiles
    │   ├── ...
    │   ├── 📄 useHookName.ts
    │   └── 📂 folderName
    │       ├── ...
    │       └── 📄 file_name.json
    ├── 📂 allowOnlyFolders
    │   ├── ...
    │   └── 📂 FOLDER_NAME
    │        ├── ...
    │        ├── 📄 folderName.types.ts
    │        └── 📄 file-name.js
    └── 📂 allowOnlyFiles
        ├── ...
        └── 📄 FileName.tsx
```

```mjs
// @ts-check

import { createFolderStructure } from "eslint-plugin-project-structure";

export const folderStructureConfig = createFolderStructure({
  structure: [
    // Allow any files in the root of your project, like package.json, eslint.config.mjs, etc.
    // You can add rules for them separately.
    // You can also add exceptions like this: "(?!folderStructure)*".
    { name: "*" },

    // Allow any folders in the root of your project.
    { name: "*", children: [] },

    // The `src` folder should follow this structure.
    {
      name: "src",
      children: [
        // src/index.tsx
        { name: "index.tsx" },

        // src/allowAnyFoldersAndFiles/...
        { name: "allowAnyFoldersAndFiles", children: [] },

        // src/allowFoldersAndFiles/useSomeHook.ts
        // src/allowFoldersAndFiles/folderName/hello_world.json
        {
          name: "allowFoldersAndFiles",
          children: [
            { name: "use{PascalCase}.(ts|tsx)" },
            { name: "{camelCase}", children: [{ name: "{snake_case}.json" }] },
          ],
        },

        // src/allowOnlyFolders/FOLDER_NAME/file-name.js
        // src/allowOnlyFolders/FOLDER_NAME/folderName.types.ts
        {
          name: "allowOnlyFolders",
          children: [
            {
              name: "{SNAKE_CASE}",
              children: [
                { name: "{kebab-case}.js" },
                { name: "{folderName}.types.ts" },
              ],
            },
          ],
        },

        // src/allowOnlyFiles/FileName.tsx
        { name: "allowOnlyFiles", children: [{ name: "{PascalCase}.tsx" }] },
      ],
    },
  ],
});
```

#### Advanced example for the structure below:

```
.
└── 📂 packages
    └── 📂 package-name
        ├── ...
        ├── 📄 folderStructure.mjs
        ├── 📄 eslint.config.mjs
        └── 📂 src
            ├── 📂 hooks
            │   ├── ...
            │   ├── 📄 useSimpleGlobalHook.test.ts
            │   ├── 📄 useSimpleGlobalHook.ts
            │   └── 📂 useComplexGlobalHook
            │       ├── 📁 hooks (recursion)
            │       ├── 📄 useComplexGlobalHook.api.ts
            │       ├── 📄 useComplexGlobalHook.types.ts
            │       ├── 📄 useComplexGlobalHook.test.ts
            │       └── 📄 useComplexGlobalHook.ts
            └── 📂 components
                ├── ...
                └── 📂 ParentComponent
                    ├── 📄 parentComponent.api.ts
                    ├── 📄 parentComponent.types.ts
                    ├── 📄 ParentComponent.test.tsx
                    ├── 📄 ParentComponent.tsx
                    ├── 📂 components
                    │   ├── ...
                    │   └── 📂 ChildComponent
                    │       ├── 📁 components (recursion)
                    │       ├── 📁 hooks (recursion)
                    │       ├── 📄 childComponent.types.ts
                    │       ├── 📄 childComponent.api.ts
                    │       ├── 📄 ChildComponent.test.tsx
                    │       └── 📄 ChildComponent.tsx
                    └── 📂 hooks
                        ├── ...
                        ├── 📄 useSimpleParentComponentHook.test.ts
                        ├── 📄 useSimpleParentComponentHook.ts
                        └── 📂 useComplexParentComponentHook
                            ├── 📁 hooks (recursion)
                            ├── 📄 useComplexParentComponentHook.api.ts
                            ├── 📄 useComplexParentComponentHook.types.ts
                            ├── 📄 useComplexParentComponentHook.test.ts
                            └── 📄 useComplexParentComponentHook.ts
```

```mjs
// @ts-check

import { createFolderStructure } from "eslint-plugin-project-structure";

export const folderStructureConfig = createFolderStructure({
  projectRoot: "packages/package-name",
  structureRoot: "src",
  structure: [
    // src/hooks/useComplexGlobalHook/...
    // src/hooks/...
    { ruleId: "hooks_folder" },

    // src/components/ParentComponent/...
    { ruleId: "components_folder" },
  ],
  rules: {
    hooks_folder: {
      name: "hooks",
      // Allow a maximum of three levels of nesting for the `hooks` folder.
      // hooks/useComplexHook/hooks/useComplexHook2/hooks/useComplexHook3/useComplexHook3.ts
      folderRecursionLimit: 3,
      children: [
        // hooks/useComplexHook/...
        { ruleId: "hook_folder" },

        // hooks/useSimpleHook.test.ts
        // hooks/useSimpleHook.ts
        { name: "use{PascalCase}(.test)?.ts" },
      ],
    },

    hook_folder: {
      // For example, this would be `useComplexHook`.
      name: "use{PascalCase}",
      children: [
        // Here we create folder recursion because the `hooks_folder` rule refers to the `hook_folder` rule.
        // useComplexHook/hooks/useComplexHook2/hooks/...
        // useComplexHook/hooks/useComplexHook2/...
        // useComplexHook/hooks/...
        { ruleId: "hooks_folder" },

        // useComplexHook/useComplexHook.test.ts
        // useComplexHook/useComplexHook.api.ts
        // useComplexHook/useComplexHook.types.ts
        // useComplexHook/useComplexHook.ts
        { name: "{folderName}(.(test|api|types))?.ts" },
      ],
    },

    components_folder: {
      name: "components",
      children: [
        // components/ParentComponent/...
        { ruleId: "component_folder" },
      ],
    },

    component_folder: {
      // For example, this would be `ParentComponent`.
      name: "{PascalCase}",
      children: [
        // Here we create folder recursion because the `components_folder` rule refers to the `component_folder` rule.
        // ParentComponent/components/ChildComponent/components/...
        // ParentComponent/components/ChildComponent/hooks/...
        // ParentComponent/components/ChildComponent/...
        { ruleId: "components_folder" },

        // Here we create folder recursion because the `hooks_folder` rule refers to the `hook_folder` rule.
        // ParentComponent/hooks/...
        // ParentComponent/hooks/useComplexParentComponentHook/hooks/...
        // ParentComponent/hooks/useComplexParentComponentHook/...
        { ruleId: "hooks_folder" },

        // ParentComponent/parentComponent.types.ts
        // ParentComponent/parentComponent.api.ts
        { name: "{folderName}.(types|api).ts" },

        // ParentComponent/ParentComponent.test.tsx
        // ParentComponent/ParentComponent.tsx
        { name: "{FolderName}(.test)?.tsx" },
      ],
    },
  },
});
```

## ⚙️ API

### `name?: string`

The name is treated as a `regex`.

The following improvements are automatically added to the regex:

*   The name is wrapped in `^$`.
*   All `.` characters (any character except newline) will be converted to `\.` (dot as a character).
    If you want original behavior, use the following notation `..`.
*   All `*` characters will be converted to `(([^/]*)+)` (wildcard).
    If you want original behavior, use the following notation `**`.

When used with [children](#children) this will be the name of `folder`.
When used without [children](#children) this will be the name of `file`.

> [!NOTE]
> If you only care about the name of the `folder` without rules for its [children](#children), leave the [children](#children) as `[]`.

```jsonc
{ "name": "fileName.*" }
{ "name": "\\$fileName.ts" }
```

```jsonc
{ "name": "folderName", "children": [] }
{ "name": "\\(folderName\\)", "children": [] }
```

### `children?: Rule[]`

`Folder` children rules.

> [!WARNING]
> Folder needs to contain at least one file/subfolder with file to be validated. ESLint and Git ignore empty folders, so they won’t be pushed to the repository and will only remain visible locally.

```jsonc
{ "children": [{ "name": "Child.ts" }] }
```

All duplicate name rules will be ignored:

```jsonc
{
  "children": [
    { "name": "folder1", "children": [{ "name": "hello.ts" }] },
    { "name": "folder1", "children": [{ "name": "hi.js" }] }, // IGNORED

    { "name": "{camelCase}", "children": [{ "name": "hello.ts" }] },
    { "name": "{camelCase}", "children": [{ "name": "hi.js" }] } // IGNORED
  ]
}
```

`children` are automatically sorted to prevent overlap:

From:

```jsonc
{
  "children": [
    { "name": "{camelCase}.ts" },
    { "name": "Hello.ts" },

    { "name": "*", "children": [{ "name": "hi.js" }] },
    { "name": "{camelCase}", "children": [{ "name": "hello.ts" }] },
    { "name": "folderName", "children": [{ "name": "HELLO.js" }] }
  ]
}
```

To:

```jsonc
{
  "children": [
    { "name": "Hello.ts" },
    { "name": "{camelCase}.ts" },

    { "name": "folderName", "children": [{ "name": "HELLO.js" }] },
    { "name": "{camelCase}", "children": [{ "name": "hello.ts" }] },
    { "name": "*", "children": [{ "name": "hi.js" }] }
  ]
}
```

### `enforceExistence?: string | string[]`

Enforce the existence of other folders/files when a given folder/file exists.

In `enforceExistence`, the following references are available:

*   `{nodeName}` - Take the name of the current file or folder and change it to `camelCase`.
*   `{NodeName}` - Take the name of the current file or folder and change it to `PascalCase`.
*   `{node-name}` - Take the name of the current file or folder and change it to `kebab-case`.
*   `{node_name}` - Take the name of the current file or folder and change it to `snake_case`.
*   `{NODE_NAME}` - Take the name of the current file or folder and change it to `SNAKE_CASE`.

> [!WARNING]
> Folder needs to contain at least one file/subfolder with file to be validated. ESLint and Git ignore empty folders, so they won’t be pushed to the repository and will only remain visible locally.

```jsonc
{
  "structure": {
    // If root directory exists.
    "enforceExistence": "src", // ./src must exist.
    "children": [
      { "name": "*" },
      {
        "name": "src",
        "children": [
          {
            "name": "stories",
            "children": [{ "name": "{camelCase}.stories.tsx" }]
          },
          { "name": "{PascalCase}.test.tsx" },
          {
            // If ./src/ComponentName.tsx exist:
            "name": "{PascalCase}.tsx",
            "enforceExistence": [
              "{NodeName}.test.tsx", // ./src/ComponentName.test.tsx must exist.
              "stories/{nodeName}.stories.tsx", // ./src/stories/componentName.stories.tsx must exist.
              "../cats.ts" // ./cats.ts must exist.
            ]
          }
        ]
      }
    ]
  }
}
```

### `ruleId?: string`

A reference to your reusable rule.

```jsonc
{ "ruleId": "yourReusableRule" }
```

You can use it with other keys like [name](#name), [children](#children) and [enforceExistence](#enforce-existence) but remember that they will **override** the keys from your reusable rule.

This is useful if you want to get rid of a lot of repetition in your structure, for example, `folders` have different [name](#name), but the same [children](#children).

```
.
├── ...
└── 📂 src
    ├── 📂 folder1
    │   ├── ...
    │   └── 📂 NestedFolder
    │       ├── ...
    │       ├── 📄 File1.tsx
    │       └── 📄 file2.ts
    └── 📂 folder2
        ├── 📂 subFolder1
        │    ├── ...
        │    ├── 📄 File1.tsx
        │    └── 📄 file2.ts
        └── 📂 subFolder2
            ├── ...
            ├── 📄 File1.tsx
            └── 📄 file2.ts
```

```jsonc
{
  "structure": [
    {
      "name": "src",
      "children": [
        {
          "name": "folder1",
          "children": [{ "name": "{PascalCase}", "ruleId": "shared_children" }]
        },
        {
          "name": "folder2",
          "children": [
            {
              "name": "(subFolder1|subFolder2)",
              "ruleId": "shared_children"
            }
          ]
        }
      ]
    }
  ],
  "rules": {
    "shared_children": {
      "children": [{ "name": "{PascalCase}.tsx" }, { "name": "{camelCase}.ts" }]
    }
  }
}
```

### `rules?: Record<string, FolderRecursionRule>`

A place where you can add your reusable rules.

This is useful when you want to avoid a lot of repetition in your [structure](#structure) or use [folder recursion](#folder-recursion) feature.

The key in the object will correspond to [ruleId](#ruleid), which you can then use in many places.

```jsonc
{
  "rules": {
    "yourReusableRule": { "name": "ComponentName", "children": [] }
  }
}
```

### Folder recursion

You can easily create folder recursions when you refer to the same [ruleId](#ruleid) that your rule has.

The folder recursion can start at any level of nesting. In this case, the folder recursion will always start from the hooks folder:

```
hooks/useHook1/hooks/useHook2/hooks/useHook3/useHook3.ts

hooks/category/useHook1/hooks/category/useHook2/hooks/category/useHook3/useHook3.ts
```

By default, your rule will support an unlimited number of nesting levels. However, if you want to limit the nesting to, for example, 4 levels, you can achieve this by using [folderRecursionLimit](#folder-recursion-limit).

Let's assume you want all files in the `src` folder to follow `{PascalCase}` with any file extension, and all folders to follow `{camelCase}`.

In this case, the folder recursion will look like this:

```
.
├── ...
└── 📂 src
    ├── ...
    ├── 📄 File.tsx
    └── 📂 folder2
        ├── ...
        ├── 📄 File.ts
        └── 📂 folder3
            ├── ...
            ├── 📄 File.js
            └── 📁 folder4
                ├── ...
                ├── 📄 File.jsx
                └── 📂 folder5
                    └── ... (folder recursion)
```

```jsonc
{
  "structure": [{ "name": "src", "ruleId": "folderRule" }],
  "rules": {
    "folderRule": {
      "name": "{camelCase}",
      "children": [{ "name": "{PascalCase}.*" }, { "ruleId": "folderRule" }]
    }
  }
}
```

### `folderRecursionLimit?: number`

You can set a folder recursion limit for specific folders.

The `folderRecursionLimit` is only available for reusable [rules](#rules).

```
.
├── ...
└── 📂 src
    ├── ...
    ├── 📄 File.tsx
    └── 📂 folder2
        ├── ...
        ├── 📄 File.ts
        └── 📂 folder3
            ├── ...
            ├── 📄 File.js
            └── 📁 folder4
                ├── ...
                └── 📄 File.jsx
```

```jsonc
{
  "structure": [{ "name": "src", "ruleId": "folderRule" }],
  "rules": {
    "folderRule": {
      "name": "{camelCase}",
      "folderRecursionLimit": 4,
      "children": [{ "name": "{PascalCase}.*" }, { "ruleId": "folderRule" }]
    }
  }
}
```

There is also an option to change the rule at the final level:

```
.
├── ...
└── 📂 src
    ├── ...
    ├── 📄 File.tsx
    └── 📂 folder2
        ├── ...
        ├── 📄 File.ts
        └── 📂 folder3
            ├── ...
            ├── 📄 File.js
            └── 📁 folder4
                ├── 📁 folder5
                │   └── 📄 HELLO.ts
                └── 📄 File.jsx
```

```jsonc
{
  "structure": [{ "name": "src", "ruleId": "folderRule" }],
  "rules": {
    "folderRule": {
      "name": "{camelCase}",
      "folderRecursionLimit": 4,
      "children": [
        { "name": "{PascalCase}.*" },

        // { "name": "{camelCase}", "children": [...] }
        { "ruleId": "folderRule" },

        // This rule will only be considered when the final nesting of the 'folderRule' rule occurs.
        // This is possible due to the built-in 'children' behavior, which ignores rules with the same 'name'.
        // As the last nesting removes the 'folderRule', our rule will be taken into account.
        { "name": "{camelCase}", "children": [{ "name": "HELLO.ts" }] }
      ]
    }
  }
}
```

### `structure: Rule | Rule[]`

The structure of your project and its rules.

> [!WARNING]
> Make sure your `tsconfig`/`eslint.config.mjs` and the script to run ESLint, contains all the `files`/`folders` you want to validate. Otherwise `eslint` will not take them into account.

> [!TIP]
> I recommend creating reusable [rules](#rules) for each folder and using the [ruleId](#ruleid) in the [structure](#structure) for better readability. See the [example](https://github.com/Igorkowalski94/eslint-plugin-project-structure-playground/blob/main/folderStructure.mjs).

```
.
├── 📂 libs
├── 📂 src
├── 📂 yourCoolFolderName
└── 📄 ...
```

```jsonc
{
  "structure": [
    { "name": "libs", "children": [] },
    { "name": "src", "children": [] },
    { "name": "yourCoolFolderName", "children": [] },
    // Allow any files in the root of your project, like package.json, eslint.config.mjs, etc.
    // You can add rules for them separately.
    // You can also add exceptions like this: "(?!folderStructure)*".
    { "name": "*" }
  ]
}
```

or

```jsonc
{
  "structure": {
    "enforceExistence": "src",
    "children": [
      { "name": "libs", "children": [] },
      { "name": "src", "children": [] },
      { "name": "yourCoolFolderName", "children": [] },
      // Allow any files in the root of your project, like package.json, eslint.config.mjs, etc.
      // You can add rules for them separately.
      // You can also add exceptions like this: "(?!folderStructure)*".
      { "name": "*" }
    ]
  }
}
```

### `regexParameters?: Record<string, string>`

A place where you can add your own regex parameters.

You can use [built-in regex parameters](#built-in-regex-parameters). You can overwrite them with your logic, exceptions are folder name references overwriting them will be ignored.

You can freely mix regex parameters together see [example](#regex-parameters-mix-example).

```jsonc
{
  "regexParameters": {
    "yourRegexParameter": "(Regex logic)",
    "camelCase": "(Regex logic)", // Override built-in camelCase.
    "folderName": "(Regex logic)", // Overwriting will be ignored.
    "FolderName": "(Regex logic)" // Overwriting will be ignored.
  }
}
```

Then you can use them in [name](#name) with the following notation `{yourRegexParameter}`.

```jsonc
{ "name": "{yourRegexParameter}" }
```

#### Built-in regex parameters

`{folderName}`
The file/folder inherits the name of the `folder` it is in and changes it to `camelCase`.

```jsonc
{ "name": "{folderName}" }
```

`{FolderName}`
The file/folder inherits the name of the `folder` it is in and changes it to `PascalCase`.

```jsonc
{ "name": "{FolderName}" }
```

`{folder-name}`
The file/folder inherits the name of the `folder` it is in and changes it to `kebab-case`.

```jsonc
{ "name": "{folder-name}" }
```

`{folder_name}`
The file/folder inherits the name of the `folder` it is in and changes it to `snake_case`.

```jsonc
{ "name": "{folder_name}" }
```

`{FOLDER_NAME}`
The file/folder inherits the name of the `folder` it is in and changes it to `SNAKE_CASE`.

```jsonc
{ "name": "{FOLDER_NAME}" }
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

`{kebab-case}`
Add `kebab-case` validation to your regex.
The added regex is `((([a-z]|\d)+-)*([a-z]|\d)+)`.

Examples: `component`, `component-name`, `component-name-1`.

```jsonc
{ "name": "{kebab-case}" }
```

#### Regex parameters mix example

Here are some examples of how easy it is to combine [regex parameters](#regex-parameters).

```jsonc
// useNiceHook.ts
// useNiceHook.api.ts
// useNiceHook.test.ts
{ "name": "use{PascalCase}(.(test|api))?.ts" }
```

```jsonc
// FolderName.hello_world.ts
// FolderName.hello_world.test.ts
// FolderName.hello_world.api.ts
{ "name": "{FolderName}.{snake_case}(.(test|api))?.ts" }
```

### `ignorePatterns?: string | (string | string[])[]`

Here you can set the paths you want to ignore.

The outer array checks if any pattern meets the requirements. The inner array checks if all patterns meet the requirements.

You can use all [micromatch](https://github.com/micromatch/micromatch?tab=readme-ov-file#matching-features) functionalities.

```jsonc
// Ignore all files from the `src/legacy` folder.
{ "ignorePatterns": "src/legacy/**" } // if `structureRoot` is `.` (default)
{ "ignorePatterns": "legacy/**" } // if `structureRoot` is `src`
```

```jsonc
// Ignore all files from the `src/legacy` folder or all files from `src/components` folder.
{ "ignorePatterns": ["src/legacy/**", "src/components/**"] }
```

```jsonc
// Ignore all files from the `src/legacy` folder or all files from the `src/components` folder  except `.tsx` files.
{ "ignorePatterns": ["src/legacy/**", ["src/components/**", "!(**/*.tsx)"]] }
```

```jsonc
// If your folder name uses micromatch special characters () [] {} ! , + ? etc.
{ "ignorePatterns": ["\\.yarn/**", "src/app/hello/\\(components\\)/**"] }
```

### `projectRoot?: string`

Useful when working with a monorepo or when you want to change the location for generating the `projectStructure.cache.json` file.

The default value is `.`.

```jsonc
{ "projectRoot": "src" }
```

```jsonc
{ "projectRoot": "packages/package-name" }
```

### `structureRoot?: string`

Useful when you want to change the location from which the [structure](#structure) should be checked.

`structureRoot` extends [projectRoot](#project-root)

The default value is `.`.

```jsonc
{ "structureRoot": "packages/package-name/src" }
```

```jsonc
{ "projectRoot": "packages/package-name" }
{ "structureRoot": "src" }
```

### `longPathsInfo: false | { maxLength?: number; mode: "warn" | "error"; root?: string; countFromSystemRoot?: boolean; }`

Too long paths can cause various issues, such as errors when moving or copying a project, unexpected behavior of various tools.

Different systems support different path lengths:

*   Windows 260 or 32 767 characters if long path support is enabled in Windows 10.
*   Unix/Linux 4096 characters.
*   macOS 1024 characters.

Even with long path support enabled, many programs and tools may not handle long paths properly.

By default, the path is counted from the project root.

If the path exceeds 240 characters, the plugin will display a warning by default.

You can change the path length limit, adjust the notification mode, choose from which point the path should be counted or disable it entirely.

```jsonc
{ "longPathsInfo": { "maxLength": 240, "root": "../../", "mode": "warn" } }
```

```jsonc
{
  "longPathsInfo": {
    "maxLength": 240,
    "countFromSystemRoot": true,
    "mode": "error"
  }
}
```

```jsonc
{ "longPathsInfo": false }
```