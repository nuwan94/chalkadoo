"use client";

import { Doo, type DooMood } from "@/components/brand/Doo";
import { RichText } from "@/components/math/RichText";
import type { QuestionState } from "@/components/questions/useQuestion";

const CORRECT = [
  "Chalk-a-doo! Correct.",
  "Fascinating. You're right.",
  "Precisely. Write that on the board.",
  "Correct. I'd expect nothing less. Well… slightly less.",
];
const WRONG = [
  "Not quite. Even geniuses check their working.",
  "Hmm. That's not even wrong. Well — it is wrong. Try again.",
  "Close-ish. Have another go.",
];

/** Doo's speech bubble under a question: hints after a miss, explanation after a solve. */
export function Feedback({
  q,
  hint,
  explanation,
  onReveal,
}: {
  q: QuestionState;
  hint?: string;
  explanation?: string;
  onReveal?: () => void;
}) {
  let mood: DooMood = "thinking";
  let headline: string | null = null;
  let body: string | undefined;
  let tone = "bg-surface-2";

  if (q.message) {
    headline = q.message;
  } else if (q.status === "correct") {
    mood = "happy";
    headline = CORRECT[(q.attempts - 1) % CORRECT.length];
    body = explanation;
    tone = "bg-correct";
  } else if (q.status === "revealed") {
    mood = "smug";
    headline = "Here's how it works. No shame — just science.";
    body = explanation;
    tone = "bg-hint";
  } else if (q.status === "wrong") {
    mood = "worried";
    headline = WRONG[(q.attempts - 1) % WRONG.length];
    body = hint;
    tone = "bg-wrong";
  }

  if (!headline) return null;

  return (
    <div className="mt-5 flex items-end gap-2 anim-pop" role="status" aria-live="polite">
      <Doo mood={mood} size={58} className={`shrink-0 ${mood === "happy" ? "anim-bounce" : ""}`} />
      <div className={`panel relative flex-1 px-4 py-3 ${tone} ${q.status === "wrong" ? "anim-wiggle" : ""}`}>
        <p className="hand text-xl font-bold leading-snug">{headline}</p>
        {body && (
          <p className="mt-1 leading-relaxed">
            {q.status === "wrong" && <span className="font-bold">Hint: </span>}
            <RichText text={body} />
          </p>
        )}
        {q.status === "wrong" && q.attempts >= 2 && onReveal && (
          <button type="button" onClick={onReveal} className="mt-2 font-bold underline underline-offset-4 text-blue">
            Show me the answer (no XP)
          </button>
        )}
      </div>
    </div>
  );
}
