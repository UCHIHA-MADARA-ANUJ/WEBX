"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { CodeFile } from "@/lib/content/firmware";

const KEYWORDS = new Set([
  "void", "int", "float", "double", "bool", "char", "const", "static", "constexpr", "return", "if", "else", "for",
  "while", "switch", "case", "break", "continue", "struct", "class", "namespace", "using", "true", "false", "nullptr",
  "import", "export", "from", "function", "new", "async", "await", "type", "extends", "string", "number", "boolean",
  "uint8_t", "uint32_t", "uint16_t", "size_t", "String", "unsigned", "long", "delay", "sizeof",
]);

type Token = { text: string; cls?: string };

function tokenize(line: string): Token[] {
  const out: Token[] = [];
  let i = 0;

  while (i < line.length) {
    const rest = line.slice(i);

    if (rest.startsWith("//")) {
      out.push({ text: rest, cls: "tok-com" });
      break;
    }
    const block = rest.match(/^\/\*.*?\*\//);
    if (block) {
      out.push({ text: block[0], cls: "tok-com" });
      i += block[0].length;
      continue;
    }
    const str = rest.match(/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/);
    if (str) {
      out.push({ text: str[0], cls: "tok-str" });
      i += str[0].length;
      continue;
    }
    const num = rest.match(/^(0x[0-9a-fA-F]+|\d+(?:\.\d+)?f?)/);
    if (num) {
      out.push({ text: num[0], cls: "tok-num" });
      i += num[0].length;
      continue;
    }
    const pre = rest.match(/^#\s*\w+/);
    if (pre) {
      out.push({ text: pre[0], cls: "tok-pre" });
      i += pre[0].length;
      continue;
    }
    const word = rest.match(/^[A-Za-z_$][\w$]*/);
    if (word) {
      const value = word[0];
      const after = line.slice(i + value.length);
      let cls = "tok-id";
      if (KEYWORDS.has(value)) cls = "tok-key";
      else if (/^\s*\(/.test(after)) cls = "tok-fn";
      else if (/^[A-Z]/.test(value)) cls = "tok-key";
      out.push({ text: value, cls });
      i += value.length;
      continue;
    }

    out.push({ text: line[i] });
    i += 1;
  }

  return out;
}

export function CodeBlock({
  file,
  className,
  maxHeight = "30rem",
}: {
  file: CodeFile;
  className?: string;
  maxHeight?: string;
}) {
  const [copied, setCopied] = useState(false);
  const rendered = useMemo(() => file.lines.map((line) => tokenize(line)), [file.lines]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(file.lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the code is selectable anyway */
    }
  };

  return (
    <div className={cn("panel-flat overflow-hidden", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-rust/70" />
            <span className="h-2 w-2 rounded-full bg-amber/70" />
            <span className="h-2 w-2 rounded-full bg-chloro/70" />
          </span>
          <span className="truncate font-mono text-[11.5px] text-bone">{file.name}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="label hidden sm:block">{file.meta}</span>
          <button
            type="button"
            onClick={copy}
            className="btn-quiet inline-flex items-center gap-1.5 rounded-md px-2 py-1"
            aria-label={`Copy ${file.name}`}
          >
            {copied ? <Check size={13} className="text-chloro" /> : <Copy size={13} />}
            <span className="font-mono text-[10px] uppercase tracking-[0.16em]">{copied ? "copied" : "copy"}</span>
          </button>
        </div>
      </header>

      <div className="hide-scrollbar overflow-auto" style={{ maxHeight }}>
        <pre className="term min-w-max px-0 py-4">
          <code>
            {rendered.map((tokens, index) => (
              <span key={index} className="group flex hover:bg-bone/[0.03]">
                <span className="sticky left-0 w-12 shrink-0 select-none bg-panel pl-3 pr-3 text-right text-mute/60">
                  {index + 1}
                </span>
                <span className="whitespace-pre pr-6 text-bone/90">
                  {tokens.length ? (
                    tokens.map((token, ti) => (
                      <span key={ti} className={token.cls}>
                        {token.text}
                      </span>
                    ))
                  ) : (
                    <span> </span>
                  )}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
