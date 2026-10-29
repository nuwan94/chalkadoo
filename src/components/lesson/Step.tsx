import { Doo, type DooMood } from "@/components/brand/Doo";

/** One screen of a lesson. Every top-level element in a lesson MDX file should be a <Step>. */
export function Step({ children }: { children: React.ReactNode }) {
  return <section className="lesson-prose">{children}</section>;
}

/** An aside from Doo, for jokes, warnings and "well, actually" moments. */
export function DooSays({ mood = "smug", children }: { mood?: DooMood; children: React.ReactNode }) {
  return (
    <aside className="not-prose my-6 flex items-end gap-2">
      <Doo mood={mood} size={56} className="shrink-0" />
      <div className="panel flex-1 bg-hint px-4 py-3 text-base leading-relaxed [&_p+p]:mt-2">{children}</div>
    </aside>
  );
}
