import { codeToHtml } from "shiki";
import { DEFAULT_CODE_LANGUAGE, DEFAULT_CODE_THEME, SHIKI_THEME_DARK, SHIKI_THEME_LIGHT } from "./constants";

const ALLOWED_LANGUAGES = new Set([
  "cpp",
  "c",
  "javascript",
  "typescript",
  "python",
  "java",
  "html",
  "css",
  "json",
  "bash",
  "text",
]);

export async function highlightCode(
  code: string,
  lang: string = DEFAULT_CODE_LANGUAGE,
  theme: "light" | "dark" = DEFAULT_CODE_THEME
): Promise<string> {
  const safeLang = ALLOWED_LANGUAGES.has(lang) ? lang : "text";
  return codeToHtml(code, {
    lang: safeLang,
    theme: theme === "dark" ? SHIKI_THEME_DARK : SHIKI_THEME_LIGHT,
  });
}
