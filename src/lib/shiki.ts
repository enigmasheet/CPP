import { codeToHtml } from "shiki";

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
  lang: string = "cpp"
): Promise<string> {
  const safeLang = ALLOWED_LANGUAGES.has(lang) ? lang : "text";
  return codeToHtml(code, {
    lang: safeLang,
    theme: "github-dark",
  });
}
