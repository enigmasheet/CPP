"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Copy, Check } from "lucide-react";
import { COPY_FEEDBACK_TIMEOUT_MS } from "@/lib/constants";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language = "cpp",
  showLineNumbers = false,
}: CodeBlockProps) {
  const { theme } = useTheme();
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const resolvedTheme = theme === "dark" || theme === "light" ? theme : "dark";
    import("@/lib/shiki").then(({ highlightCode }) => {
      highlightCode(code, language, resolvedTheme).then(setHtml);
    });
  }, [code, language, theme]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_TIMEOUT_MS);
  };

  if (!html) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-border">
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          <span className="text-xs font-mono text-muted-foreground uppercase">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <pre className="p-4 text-sm font-mono overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground uppercase">
          {language}
        </span>
        <div className="flex items-center gap-2">
          {showLineNumbers && (
            <span className="text-xs text-muted-foreground">
              {code.split("\n").length} lines
            </span>
          )}
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <div
        className="overflow-x-auto text-sm [&_pre]:p-4 [&_pre]:bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
