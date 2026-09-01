import { highlightCode } from "@/lib/shiki";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export default async function CodeBlock({
  code,
  language = "cpp",
  showLineNumbers = false,
}: CodeBlockProps) {
  const html = await highlightCode(code, language);

  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground uppercase">
          {language}
        </span>
        {showLineNumbers && (
          <span className="text-xs text-muted-foreground">
            {code.split("\n").length} lines
          </span>
        )}
      </div>
      <div
        className="overflow-x-auto text-sm [&_pre]:p-4 [&_pre]:bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
