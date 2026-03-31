import { cn } from "@/lib/utils";

interface LessonContentProps {
  content: string;
  /** Optional class on the outer wrapper (e.g. max-width). */
  className?: string;
}

function renderInline(parts: string) {
  return parts.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return (
        <strong key={j} className="font-semibold text-zinc-900">
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code
          key={j}
          className="rounded-md border border-primary/15 bg-primary/8 px-1.5 py-0.5 font-mono text-[0.9em] text-primary"
        >
          {part.slice(1, -1)}
        </code>
      );
    return <span key={j}>{part}</span>;
  });
}

export function LessonContent({ content, className }: LessonContentProps) {
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div
      className={cn(
        "w-full space-y-5 text-[15px] leading-[1.7] text-zinc-700",
        className
      )}
    >
      {paragraphs.map((block, i) => {
        if (block.startsWith("```")) {
          const end = block.indexOf("```", 3);
          const code =
            end > 0 ? block.slice(3, end).trim() : block.slice(3).trim();
          return (
            <figure
              key={i}
              className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950 shadow-inner ring-1 ring-zinc-800/60"
            >
              <figcaption className="border-b border-zinc-800/80 bg-zinc-900/80 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Code
              </figcaption>
              <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-zinc-100">
                <code>{code}</code>
              </pre>
            </figure>
          );
        }

        const singleLine = !block.includes("\n");
        if (singleLine && block.startsWith("## ")) {
          return (
            <h3
              key={i}
              className="max-w-[65ch] border-l-4 border-primary/40 pl-3 text-lg font-semibold tracking-tight text-zinc-900"
            >
              {renderInline(block.slice(3))}
            </h3>
          );
        }

        const lines = block.split("\n");
        const trimmed = lines.map((l) => l.trim());
        const nonEmpty = trimmed.filter(Boolean);
        const isBlockquote = lines.every((l) => l.startsWith("> "));
        if (isBlockquote && lines.length > 0) {
          return (
            <blockquote
              key={i}
              className="max-w-[65ch] rounded-r-lg border-l-4 border-primary/35 bg-primary/6 py-3 pl-4 pr-3 text-zinc-700 italic"
            >
              {lines.map((line, j) => (
                <p key={j} className={j > 0 ? "mt-2" : undefined}>
                  {renderInline(line.replace(/^> /, ""))}
                </p>
              ))}
            </blockquote>
          );
        }

        // Pure list block (each non-empty line is "- ...")
        const isPureList = nonEmpty.length > 0 && nonEmpty.every((l) => l.startsWith("- "));
        if (isPureList) {
          return (
            <ul
              key={i}
              className="my-1 w-full space-y-2.5 rounded-xl border border-primary/10 bg-linear-to-br from-primary/5 to-transparent py-3 pl-3 pr-3 sm:pl-4"
            >
              {nonEmpty.map((line, j) => (
                <li key={j} className="flex gap-3 text-zinc-700">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70 shadow-sm ring-2 ring-primary/20"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    {renderInline(line.replace(/^- /, ""))}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        // Header + list block in the same paragraph, e.g.
        // "**Core ideas:**\n- Item 1\n- Item 2"
        const firstListIdx = trimmed.findIndex((l) => l.startsWith("- "));
        if (firstListIdx > 0) {
          const beforeLines = trimmed.slice(0, firstListIdx).filter(Boolean);
          const afterLines = trimmed.slice(firstListIdx).filter(Boolean);
          const isAfterList =
            afterLines.length > 0 && afterLines.every((l) => l.startsWith("- "));

          if (isAfterList) {
            return (
              <div key={i} className="w-full space-y-2.5">
                <p className="max-w-[65ch] font-semibold text-zinc-900">
                  {renderInline(beforeLines.join("\n"))}
                </p>
                <ul className="my-1 w-full space-y-2.5 rounded-xl border border-primary/10 bg-linear-to-br from-primary/5 to-transparent py-3 pl-3 pr-3 sm:pl-4">
                  {afterLines.map((line, j) => (
                    <li key={j} className="flex gap-3 text-zinc-700">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70 shadow-sm ring-2 ring-primary/20"
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        {renderInline(line.replace(/^- /, ""))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
        }

        return (
          <p key={i} className="max-w-[65ch] text-pretty">
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}
