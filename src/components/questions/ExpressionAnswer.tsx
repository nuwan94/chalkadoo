"use client";

import { useId, useState } from "react";
import { RichText, Tex } from "@/components/math/RichText";
import { checkExpression, previewTex } from "@/lib/answers";
import { QuestionShell } from "./QuestionShell";
import { useQuestion } from "./useQuestion";

/**
 * An algebraic answer checked for equivalence, so `b - a`, `-a + b` and `(b-a)` all count.
 * Shows a live typeset preview of what the learner typed.
 */
export function ExpressionAnswer({
  prompt,
  label,
  answer,
  variables = ["x"],
  hint,
  explanation,
}: {
  prompt?: string;
  label?: string;
  /** The correct expression in mathjs syntax, e.g. "b - a". */
  answer: string;
  variables?: string[];
  hint?: string;
  explanation?: string;
}) {
  const q = useQuestion();
  const [value, setValue] = useState("");
  const inputId = useId();
  const preview = previewTex(value);

  function check() {
    const result = checkExpression(value, answer, variables);
    if (!result.ok) q.nudge(result.reason);
    else q.submit(result.correct);
  }

  const tone =
    q.status === "correct" || q.status === "revealed"
      ? "bg-correct"
      : q.status === "wrong"
        ? "bg-wrong"
        : "bg-surface";

  return (
    <QuestionShell
      q={q}
      prompt={prompt}
      hint={hint}
      explanation={explanation}
      canCheck={value.trim() !== ""}
      onCheck={check}
      onReveal={() => {
        setValue(answer);
        q.reveal();
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) check();
        }}
        className="flex flex-wrap items-center gap-3 text-2xl"
      >
        {label && (
          <label htmlFor={inputId} className="shrink-0">
            <RichText text={label} />
          </label>
        )}
        <input
          id={inputId}
          aria-label={label ? undefined : prompt ?? "Your expression"}
          aria-describedby={`${inputId}-preview`}
          value={value}
          disabled={q.done}
          onChange={(e) => {
            setValue(e.target.value);
            q.touch();
          }}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={`in terms of ${variables.join(", ")}`}
          className={`hand min-w-0 flex-1 basis-48 rounded-xl border-[2.5px] border-line px-3 py-1.5 text-2xl font-bold outline-none placeholder:text-base placeholder:font-normal focus:ring-[3px] focus:ring-blue ${tone}`}
        />
      </form>
      <p id={`${inputId}-preview`} className="mt-2 min-h-8 text-ink-muted" aria-live="polite">
        {preview ? (
          <>
            <span className="text-sm">Reads as </span>
            <Tex tex={preview} />
          </>
        ) : value.trim() ? (
          <span className="text-sm">Keep going…</span>
        ) : (
          <span className="text-sm">Tip: type * for times and / for divide. 2a works too.</span>
        )}
      </p>
    </QuestionShell>
  );
}
