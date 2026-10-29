"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Doo } from "@/components/brand/Doo";
import { completeLesson, saveStep, useProgress } from "@/lib/progress";
import { StepGateContext, type StepGate } from "./context";

type Meta = { key: string; title: string; courseTitle: string; courseHref: string };

/** Hosts one step's gate and tells the player whether the step is complete. */
function StepFrame({
  index,
  active,
  onOpenChange,
  onXp,
  children,
}: {
  index: number;
  active: boolean;
  onOpenChange: (index: number, open: boolean) => void;
  onXp: (xp: number) => void;
  children: React.ReactNode;
}) {
  const [registered, setRegistered] = useState<ReadonlySet<string>>(new Set());
  const [solved, setSolved] = useState<ReadonlySet<string>>(new Set());
  // Mirrors `solved` so XP is awarded once per piece, outside of a state updater.
  const awarded = useRef(new Set<string>());

  const gate = useMemo<StepGate>(
    () => ({
      register(id) {
        setRegistered((s) => new Set(s).add(id));
        return () =>
          setRegistered((s) => {
            const next = new Set(s);
            next.delete(id);
            return next;
          });
      },
      solve(id, xp) {
        if (awarded.current.has(id)) return;
        awarded.current.add(id);
        onXp(xp);
        setSolved((s) => new Set(s).add(id));
      },
    }),
    [onXp],
  );

  const open = [...registered].every((id) => solved.has(id));
  useLayoutEffect(() => onOpenChange(index, open), [index, open, onOpenChange]);

  return (
    <StepGateContext.Provider value={gate}>
      <div hidden={!active}>{children}</div>
    </StepGateContext.Provider>
  );
}

export function LessonPlayer({ meta, steps }: { meta: Meta; steps: React.ReactNode[] }) {
  const progress = useProgress();
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState(1);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [skippedTo, setSkippedTo] = useState(0);
  const [xp, setXp] = useState(0);
  const [result, setResult] = useState<{ xp: number; gained: number } | null>(null);
  const [dismissedResume, setDismissedResume] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const onOpenChange = useCallback((i: number, isOpen: boolean) => {
    setOpen((o) => (o[i] === isOpen ? o : { ...o, [i]: isOpen }));
  }, []);
  const onXp = useCallback((n: number) => setXp((x) => x + n), []);

  const last = steps.length - 1;
  // Steps skipped via "resume" count as done so the learner can page back through them.
  const canContinue = index < skippedTo || open[index] === true;
  const savedStep = progress?.lessons[meta.key]?.lastStep ?? 0;
  const offerResume = !dismissedResume && index === 0 && savedStep > 0 && savedStep <= last;

  function goTo(i: number) {
    setIndex(i);
    setVisited((v) => Math.max(v, i + 1));
    topRef.current?.scrollIntoView({ block: "start" });
  }

  function next() {
    if (!canContinue) return;
    if (index === last) {
      const gained = completeLesson(meta.key, xp);
      setResult({ xp, gained });
      return;
    }
    saveStep(meta.key, index + 1);
    goTo(index + 1);
  }

  if (result) {
    return <Complete meta={meta} result={result} />;
  }

  return (
    <div ref={topRef} className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b-[2.5px] border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
          <Link
            href={meta.courseHref}
            aria-label={`Leave lesson, back to ${meta.courseTitle}`}
            className="grid size-10 shrink-0 place-items-center rounded-full text-2xl font-bold hover:bg-surface"
          >
            ×
          </Link>
          <div
            className="h-4 flex-1 overflow-hidden rounded-full border-[2.5px] border-line bg-surface"
            role="progressbar"
            aria-label="Lesson progress"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={index + 1}
          >
            <div
              className="h-full bg-highlight transition-[width] duration-500"
              style={{ width: `${((index + (canContinue ? 1 : 0.5)) / steps.length) * 100}%` }}
            />
          </div>
          <span className="hand shrink-0 text-lg font-bold" aria-label={`${xp} XP earned`}>
            ⚡ {xp} XP
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-32 pt-6">
        <p className="hand text-ink-muted">
          {meta.title} · step {index + 1} of {steps.length}
        </p>

        {offerResume && (
          <div className="panel mt-3 flex flex-wrap items-center gap-3 bg-hint px-4 py-3">
            <p className="flex-1 font-bold">Welcome back! You stopped at step {savedStep + 1}.</p>
            <button
              type="button"
              className="btn btn-primary !min-h-10 text-sm"
              onClick={() => {
                setSkippedTo(savedStep);
                setDismissedResume(true);
                goTo(savedStep);
              }}
            >
              Resume
            </button>
            <button type="button" className="font-bold underline underline-offset-4" onClick={() => setDismissedResume(true)}>
              Start over
            </button>
          </div>
        )}

        <div className="panel mt-3 px-5 py-6 sm:px-8 sm:py-8">
          {steps.slice(0, visited).map((step, i) => (
            <StepFrame key={i} index={i} active={i === index} onOpenChange={onOpenChange} onXp={onXp}>
              {step}
            </StepFrame>
          ))}
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t-[2.5px] border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
          >
            ← Back
          </button>
          {!canContinue && <span className="hand hidden text-ink-muted sm:inline">Solve it to continue</span>}
          <button type="button" className="btn btn-primary min-w-36" onClick={next} disabled={!canContinue}>
            {index === last ? "Finish" : "Continue →"}
          </button>
        </div>
      </footer>
    </div>
  );
}

function Complete({ meta, result }: { meta: Meta; result: { xp: number; gained: number } }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center px-4 py-10 text-center">
      <Doo mood="happy" size={140} className="anim-bounce" title="Doo celebrating" />
      <h1 className="comic mt-4 text-6xl text-blue anim-pop">Chalk-a-doo!</h1>
      <p className="hand mt-2 text-2xl">You finished “{meta.title}”.</p>
      <div className="panel mt-6 grid w-full grid-cols-2 divide-x-[2.5px] divide-line">
        <div className="px-4 py-4">
          <p className="comic text-4xl">⚡ {result.xp}</p>
          <p className="text-sm text-ink-muted">XP this run</p>
        </div>
        <div className="px-4 py-4">
          <p className="comic text-4xl">+{result.gained}</p>
          <p className="text-sm text-ink-muted">added to your total</p>
        </div>
      </div>
      {result.gained === 0 && result.xp > 0 && (
        <p className="mt-3 text-sm text-ink-muted">Only XP above your previous best counts. Doo is very strict about this.</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={meta.courseHref} className="btn btn-primary">
          Back to course
        </Link>
        <button type="button" className="btn btn-ghost" onClick={() => window.location.reload()}>
          Play again
        </button>
      </div>
    </main>
  );
}
