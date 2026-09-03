import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // ─── Ban magic numbers ─────────────────────────────────
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[type='number']",
          message:
            "Magic number detected. Extract it to a named constant in src/lib/constants.ts",
        },
      ],

      // ─── TypeScript best practices ─────────────────────────
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // ─── React best practices ──────────────────────────────
      "react/self-closing-comp": "warn",

      // ─── Code quality ──────────────────────────────────────
      "no-console": [
        "warn",
        { allow: ["warn", "error"] },
      ],
      "no-alert": "warn",
      "no-debugger": "warn",
      "no-duplicate-imports": "warn",
    },
  },
]);

export default eslintConfig;
