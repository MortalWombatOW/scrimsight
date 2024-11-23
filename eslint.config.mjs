import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import _import from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...fixupConfigRules(compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
)), {
    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        react: fixupPluginRules(react),
        "react-hooks": fixupPluginRules(reactHooks),
        import: fixupPluginRules(_import),
        prettier: fixupPluginRules(prettier),
    },

    languageOptions: {
        globals: {
            // ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "react/prop-types": "off",

        "prettier/prettier": ["error", {
            printWidth: 225,
            endOfLine: "auto",
        }],
    },
}, {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/coverage/**"],

    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: ["./tsconfig.json"],
        },
    },
}];