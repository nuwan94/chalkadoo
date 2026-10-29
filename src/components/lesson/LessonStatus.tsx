"use client";

import { useProgress } from "@/lib/progress";

/** Completion badge for a lesson card, read from the learner's saved progress. */
export function LessonStatus({ lessonKey }: { lessonKey: string }) {
  const progress = useProgress();
  const p = progress?.lessons[lessonKey];
  if (!p) return null;
  if (p.completed)
    return (
      <span className="hand rounded-full border-2 border-line bg-correct px-2.5 text-sm font-bold">
        ✓ Done · {p.bestXp} XP
      </span>
    );
  if (p.lastStep > 0)
    return <span className="hand rounded-full border-2 border-line bg-hint px-2.5 text-sm font-bold">In progress</span>;
  return null;
}

export function TotalXp() {
  const progress = useProgress();
  if (!progress || progress.xp === 0) return null;
  return <span className="hand text-xl font-bold">⚡ {progress.xp} XP total</span>;
}
