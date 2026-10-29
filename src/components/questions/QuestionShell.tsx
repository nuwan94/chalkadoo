"use client";

import { Feedback } from "@/components/lesson/Feedback";
import { RichText } from "@/components/math/RichText";
import type { QuestionState } from "./useQuestion";

/** Shared frame for every question: prompt, the input area, a Check button and Doo's feedback. */
export function QuestionShell({
  q,
  prompt,
  hint,
  explanation,
  canCheck,
  onCheck,
  onReveal,
  children,
}: {
  q: QuestionState;
  prompt?: string;
  hint?: string;
  explanation?: string;
  canCheck: boolean;
  onCheck: () => void;
  onReveal: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="not-prose my-6 panel bg-surface-2 p-4 sm:p-6">
      {prompt && (
        <p className="mb-4 text-lg font-bold leading-snug">
          <RichText text={prompt} />
        </p>
      )}
      {children}
      {!q.done && (
        <div className="mt-5 flex justify-end">
          <button type="button" className="btn btn-primary" disabled={!canCheck} onClick={onCheck}>
            Check
          </button>
        </div>
      )}
      <Feedback q={q} hint={hint} explanation={explanation} onReveal={onReveal} />
    </div>
  );
}
