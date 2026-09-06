"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const resolvedTheme = theme === "dark" || theme === "light" ? theme : "dark";
    import("@/lib/shiki").then(({ highlightCode }) => {
      highlightCode(code, language, resolvedTheme).then(setHtml);
    });
  }, [code, language, theme]);

  const checkOverflow = useCallback(() => {
    const el = scrollRef.current || preRef.current;
    if (el) {
      setHasOverflow(el.scrollWidth > el.clientWidth);
    }
  }, []);

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [checkOverflow, html]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_TIMEOUT_MS);
  };

  const scrollClasses = `overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] relative text-xs sm:text-sm ${
    hasOverflow ? "pr-8" : ""
  }`;

  if (!html) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-border group">
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          <span className="text-xs font-mono text-muted-foreground uppercase">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <pre ref={preRef} className={`${scrollClasses} p-4 font-mono`}>
          <code>{code}</code>
        </pre>
        {hasOverflow && (
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-border group">
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
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className={`${scrollClasses} [&_pre]:p-4 [&_pre]:bg-transparent`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {hasOverflow && (
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
}
