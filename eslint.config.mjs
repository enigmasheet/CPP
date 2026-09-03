import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  {
    rules: {
      // ─── Ban magic numbers ─────────────────────────────────
      // A raw `no-restricted-syntax` + Literal selector flags every
      // number literal, including 0/1/-1, array indices, and enum
      // members — very noisy. The dedicated rule understands JS/TS
      // semantics and lets you allow the common, harmless cases.
      "no-magic-numbers": "off", // must be off; the TS version replaces it
      "@typescript-eslint/no-magic-numbers": [
        "warn",
        {
          ignore: [-1, 0, 1, 2],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreClassFieldInitialValues: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          enforceConst: true,
          detectObjects: false,
        },
      ],

      // ─── TypeScript best practices ─────────────────────────
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // ─── React best practices ──────────────────────────────
      "react/self-closing-comp": "warn",

      // ─── Code quality ──────────────────────────────────────
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-alert": "warn",
      "no-debugger": "error", // should never ship, so this is a hard error
      "eqeqeq": ["warn", "smart"],
      "prefer-const": "warn",
      "no-var": "error",

      // `no-duplicate-imports` doesn't understand TS `import type` and
      // will false-positive against consistent-type-imports splitting a
      // value/type import into two statements. eslint-config-next already
      // wires up `import/no-duplicates`, which handles this correctly.
      "no-duplicate-imports": "off",
    },
  },

  // Magic numbers are expected/noisy in config and test files — relax there.
  {
    files: [
      "**/*.config.{js,ts,mjs,cjs}",
      "**/*.test.{js,ts,jsx,tsx}",
      "**/*.spec.{js,ts,jsx,tsx}",
    ],
    rules: {
      "@typescript-eslint/no-magic-numbers": "off",
    },
  },
]);

export default eslintConfig;
