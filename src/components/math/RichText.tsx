import katex from "katex";

/**
 * Renders a plain string where `$...$` is inline math and `$$...$$` is display math.
 * Used for question props (prompts, options, explanations) authored in MDX.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g).filter(Boolean);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const display = part.startsWith("$$") && part.endsWith("$$");
        const inline = !display && part.startsWith("$") && part.endsWith("$") && part.length > 1;
        if (!display && !inline) return <span key={i}>{part}</span>;
        const tex = display ? part.slice(2, -2) : part.slice(1, -1);
        return (
          <span
            key={i}
            className={display ? "block text-center my-2 text-[1.3em]" : undefined}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(tex, { displayMode: display, throwOnError: false }),
            }}
          />
        );
      })}
    </span>
  );
}

export function Tex({ tex, display = false }: { tex: string; display?: boolean }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(tex, { displayMode: display, throwOnError: false }),
      }}
    />
  );
}
